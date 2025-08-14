'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { apiCall } from '@/lib/api';

interface PromptModule {
  type: string;
  name: string;
  content: string;
}

export default function NewCharacterPage() {
  const [characterName, setCharacterName] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<PromptModule[]>([
    { type: '角色设定', name: '', content: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const addModule = (type: string) => {
    setModules([...modules, { type, name: '', content: '' }]);
  };

  const updateModule = (index: number, field: keyof PromptModule, value: string) => {
    const updatedModules = modules.map((module, i) => 
      i === index ? { ...module, [field]: value } : module
    );
    setModules(updatedModules);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !characterName.trim()) return;

    setLoading(true);
    try {
      const response = await apiCall('/api/characters', {
        method: 'POST',
        body: JSON.stringify({
          name: characterName.trim(),
          description: description.trim(),
          modules: modules.filter(m => m.content.trim())
        }),
      });

      if (response.ok) {
        router.push('/characters');
      } else {
        const error = await response.text();
        alert('创建失败: ' + error);
      }
    } catch (error) {
      alert('创建失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>创建新角色</CardTitle>
            <CardDescription>
              设计您的 AI 角色，包括角色设定、注意事项等模块
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    角色名称 *
                  </label>
                  <Input
                    id="name"
                    placeholder="输入角色名称"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    角色描述
                  </label>
                  <Textarea
                    id="description"
                    placeholder="简单描述这个角色..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Prompt 模块 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Prompt 模块</h3>
                  <Select onValueChange={(value) => addModule(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="添加模块" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="角色设定">角色设定</SelectItem>
                      <SelectItem value="注意事项">注意事项</SelectItem>
                      <SelectItem value="特殊要求">特殊要求</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {modules.map((module, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">
                          {module.type}
                        </span>
                        {modules.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeModule(index)}
                          >
                            删除
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="模块名称（可选）"
                        value={module.name}
                        onChange={(e) => updateModule(index, 'name', e.target.value)}
                      />
                      <Textarea
                        placeholder={`输入${module.type}内容...`}
                        value={module.content}
                        onChange={(e) => updateModule(index, 'content', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !characterName.trim()}
                  className="flex-1"
                >
                  {loading ? '创建中...' : '创建角色'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 