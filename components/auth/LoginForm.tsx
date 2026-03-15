'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha incorretos')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-[#E5E7EB] shadow-sm">
      <CardHeader className="text-center space-y-1">
        <div className="mb-4 flex justify-center">
          <Image
            src="/logocrescitech.png"
            alt="CrescitechMD"
            width={160}
            height={48}
            priority
          />
        </div>
        <CardTitle className="text-2xl font-semibold text-[#111827]">
          Entrar na sua conta
        </CardTitle>
        <CardDescription className="text-[#4B5563]">
          Digite seu email e senha para acessar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#111827]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className="border-[#E5E7EB] focus-visible:ring-[#0066CC]"
            />
            {errors.email && (
              <p className="text-sm text-[#EF4444]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#111827]">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              className="border-[#E5E7EB] focus-visible:ring-[#0066CC]"
            />
            {errors.password && (
              <p className="text-sm text-[#EF4444]">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-[#4B5563]">
            Não tem uma conta?{' '}
            <Link
              href="/signup"
              className="font-medium text-[#0066CC] hover:underline"
            >
              Criar conta grátis
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
