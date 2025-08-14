import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, description, modules } = await request.json();

    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 开始事务：创建角色
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name,
        description,
      })
      .select()
      .single();

    if (characterError) {
      return NextResponse.json(
        { error: 'Failed to create character: ' + characterError.message },
        { status: 500 }
      );
    }

    // 创建 prompt 模块并关联
    for (const module of modules) {
      if (!module.content.trim()) continue;

      // 创建 prompt 模块
      const { data: promptModule, error: moduleError } = await supabase
        .from('prompt_modules')
        .insert({
          user_id: user.id,
          module_type: module.type,
          content: module.content.trim(),
          name: module.name?.trim() || null,
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Failed to create prompt module:', moduleError);
        continue;
      }

      // 创建角色和模块的关联
      const { error: relationError } = await supabase
        .from('character_modules')
        .insert({
          character_id: character.id,
          module_id: promptModule.id,
        });

      if (relationError) {
        console.error('Failed to create character-module relation:', relationError);
      }
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取用户的角色列表
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

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch characters: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 