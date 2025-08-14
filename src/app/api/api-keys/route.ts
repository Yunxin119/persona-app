import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

function encrypt(text: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    const { service, apiKey } = await request.json();

    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查是否已存在该服务的 API Key
    const { data: existing, error: checkError } = await supabase
      .from('user_api_keys')
      .select('id')
      .eq('user_id', user.id)
      .eq('service', service)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: '该服务的 API Key 已存在，请先删除旧的' },
        { status: 400 }
      );
    }

    // 加密 API Key
    const encryptedApiKey = encrypt(apiKey);

    // 存储加密后的 API Key
    const { data, error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        service,
        api_key: encryptedApiKey,
      })
      .select('id, service, created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save API key: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取用户的 API Keys 列表（不返回实际的 key 值）
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: apiKeys, error } = await supabase
      .from('user_api_keys')
      .select('id, service, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch API keys: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 用于内部使用的解密函数，获取实际的 API Key
export async function getDecryptedApiKey(userId: string, service: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('api_key')
      .eq('user_id', userId)
      .eq('service', service)
      .single();

    if (error || !data) {
      return null;
    }

    return decrypt(data.api_key);
  } catch (error) {
    console.error('Error decrypting API key:', error);
    return null;
  }
} 