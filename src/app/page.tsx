'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { 
  Bot, 
  Sparkles, 
  Users, 
  Shield, 
  Zap, 
  Heart,
  ArrowRight,
  Star,
  MessageCircle,
  Settings
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      title: "AI 角色定制",
      description: "精心设计每一个 AI 角色的性格、规则和背景，创造独一无二的对话体验"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "模块化 Prompt",
      description: "灵活的模块化设计，让你可以复用和组合不同的角色设定、注意事项"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "安全可靠",
      description: "API Key 加密存储，保护你的隐私和安全，支持多种主流 AI 服务"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "社区分享",
      description: "与社区分享你的创作，发现其他用户的精彩角色，一键复制到你的库中"
    }
  ];

  const stats = [
    { number: "1000+", label: "活跃用户" },
    { number: "5000+", label: "创建角色" },
    { number: "50000+", label: "对话次数" },
    { number: "99.9%", label: "服务可用性" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Persona</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                功能特色
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                如何使用
              </Link>
              <Link href="#community" className="text-gray-600 hover:text-gray-900">
                社区
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    欢迎回来，{user.email}
                  </span>
                  <Link href="/characters/new">
                    <Button>创建角色</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="outline">登录</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>立即开始</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              创造你的
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}AI 角色{" "}
              </span>
              世界
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              高度可定制化的 AI 角色扮演平台。设计独特的角色性格，构建专属的对话体验，
              <br />
              与社区分享你的创意，探索无限可能。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link href="/characters/new">
                  <Button size="lg" className="text-lg px-8 py-3">
                    开始创建角色
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 py-3">
                      免费开始
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                      已有账户？登录
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              为什么选择 Persona？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供最先进的 AI 角色定制功能，让每个人都能成为创造者
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              三步开始你的 AI 之旅
            </h2>
            <p className="text-xl text-gray-600">
              简单几步，就能拥有属于你的 AI 角色
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. 添加 API Key</h3>
              <p className="text-gray-600">
                在设置中安全地添加你的 AI 服务 API Key，支持 DeepSeek、Gemini 等主流服务
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. 创建角色</h3>
              <p className="text-gray-600">
                设计角色的性格、背景和特殊要求，使用模块化的方式构建完美的 AI 人格
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. 开始对话</h3>
              <p className="text-gray-600">
                与你的 AI 角色进行深度对话，体验个性化的智能交互体验
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              加入创作者社区
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              分享你的创作，发现优秀作品，与全球创作者一起探索 AI 的无限可能
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">分享创作</h3>
                  <p className="text-gray-600">
                    将你的角色设定分享给社区，获得点赞和反馈
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">发现精品</h3>
                  <p className="text-gray-600">
                    浏览社区中的优秀角色，找到你喜欢的创作
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">一键复制</h3>
                  <p className="text-gray-600">
                    喜欢的角色可以一键复制到你的库中，快速开始
                  </p>
                </CardContent>
              </Card>
            </div>
            {!user && (
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  立即加入社区
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            准备好创造你的 AI 角色了吗？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            加入数千名创作者，开始你的 AI 角色扮演之旅
          </p>
          {user ? (
            <Link href="/characters/new">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                创建你的第一个角色
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                免费开始创建
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bot className="w-6 h-6" />
              <span className="text-xl font-bold">Persona</span>
            </div>
            <div className="text-gray-400">
              © 2024 Persona. 让每个人都能成为 AI 创作者.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
