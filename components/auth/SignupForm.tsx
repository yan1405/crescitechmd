'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
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

interface SignupFormProps {
  defaultReferralCode?: string
}

export function SignupForm({ defaultReferralCode = '' }: SignupFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { referralCode: defaultReferralCode },
  })

  async function onSubmit(data: SignupInput) {
    setLoading(true)
    setError(null)

    try {
      // 1. Create account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const body = await res.json()

      if (!res.ok) {
        setError(body.error || 'Erro ao criar conta')
        return
      }

      // 2. Auto-login after signup
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Account created but login failed, redirect to login
        router.push('/login')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-[#E5E7EB] shadow-sm">
      <CardHeader className="text-center space-y-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#0066CC]">CrescitechMD</h1>
        </div>
        <CardTitle className="text-2xl font-semibold text-[#111827]">
          Criar conta gratuita
        </CardTitle>
        <CardDescription className="text-[#4B5563]">
          Comece com 5 conversões grátis, sem cartão de crédito
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
            <Label htmlFor="name" className="text-[#111827]">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              {...register('name')}
              className="border-[#E5E7EB] focus-visible:ring-[#0066CC]"
            />
            {errors.name && (
              <p className="text-sm text-[#EF4444]">{errors.name.message}</p>
            )}
          </div>

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
              Senha (mínimo 8 caracteres)
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

          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-[#111827]">
              Código de referência (opcional)
            </Label>
            <Input
              id="referralCode"
              type="text"
              placeholder="Ex: A3K9M2X7"
              {...register('referralCode')}
              className="border-[#E5E7EB] focus-visible:ring-[#0066CC]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
          </Button>

          <p className="text-center text-sm text-[#4B5563]">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="font-medium text-[#0066CC] hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
