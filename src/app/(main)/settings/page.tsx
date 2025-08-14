'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/store/hooks';
import { apiCall } from '@/lib/api';

interface ApiKey {
  id: number;
  service: string;
  created_at: string;
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newService, setNewService] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const response = await apiCall('/api/api-keys');
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService || !newApiKey.trim()) return;

    setLoading(true);
    try {
      const response = await apiCall('/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          service: newService,
          apiKey: newApiKey.trim(),
        }),
      });

      if (response.ok) {
        setNewService('');
        setNewApiKey('');
        await fetchApiKeys();
        alert('API Key 添加成功！');
      } else {
        const error = await response.text();
        alert('添加失败: ' + error);
      }
    } catch (error) {
      alert('添加失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApiKey = async (id: number) => {
    if (!confirm('确定要删除这个 API Key 吗？')) return;

    try {
      const response = await apiCall(`/api/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchApiKeys();
        alert('API Key 删除成功！');
      } else {
        const error = await response.text();
        alert('删除失败: ' + error);
      }
    } catch (error) {
      alert('删除失败: ' + (error as Error).message);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>用户设置</CardTitle>
            <CardDescription>
              管理您的 API Keys 和其他设置
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 添加新的 API Key */}
        <Card>
          <CardHeader>
            <CardTitle>添加 API Key</CardTitle>
            <CardDescription>
              添加不同 AI 服务的 API Key，用于与角色对话
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddApiKey} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">
                  选择服务
                </label>
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择 AI 服务" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="apikey" className="text-sm font-medium">
                  API Key
                </label>
                <Input
                  id="apikey"
                  type="password"
                  placeholder="输入您的 API Key"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  ⚠️ API Key 将在服务器端加密存储，确保安全
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading || !newService || !newApiKey.trim()}
              >
                {loading ? '添加中...' : '添加 API Key'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 已有的 API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>已保存的 API Keys</CardTitle>
            <CardDescription>
              管理您已添加的 API Keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetchLoading ? (
              <div className="text-center py-4">加载中...</div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                暂无 API Keys，请添加一个
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium capitalize">{key.service}</div>
                      <div className="text-sm text-gray-500">
                        添加于: {new Date(key.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApiKey(key.id)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 