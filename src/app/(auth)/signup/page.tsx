'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, clearError } from '@/store/features/authSlice';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    // 清除错误信息当组件挂载时
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password || !confirmPassword) {
      setFormError('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('密码不匹配');
      return;
    }

    if (password.length < 6) {
      setFormError('密码至少需要6个字符');
      return;
    }

    try {
      await dispatch(signUp({ email, password })).unwrap();
      // 注册成功后显示提示信息
      alert('注册成功！请检查您的邮箱以验证账户。');
    } catch (error) {
      // 错误已经在 Redux 中处理
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">注册</CardTitle>
            <CardDescription className="text-center">
              创建您的账户开始使用 Persona
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="输入您的密码（至少6个字符）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  确认密码
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入您的密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {(formError || error) && (
                <div className="text-red-500 text-sm text-center">
                  {formError || error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !email || !password || !confirmPassword}
              >
                {loading ? '注册中...' : '注册'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm text-gray-600 w-full">
              已有账户？{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                立即登录
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 