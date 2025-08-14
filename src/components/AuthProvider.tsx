'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/features/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 获取初始用户状态
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      dispatch(setUser(user));
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        dispatch(setUser(session?.user ?? null));
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
} 