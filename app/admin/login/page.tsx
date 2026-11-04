'use client'

import { useState, useTransition } from 'react'
import { login } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await login(formData)

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background text-foreground p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        {/* الشعار */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <span className="text-primary font-bold text-xl whitespace-nowrap">
              أجراس
            </span>
          </div>

          <h1 className="text-[24px] font-semibold tracking-tight text-foreground">
            لوحة التحكم
          </h1>

          <p className="text-sm text-muted-foreground">
            تسجيل الدخول لإدارة أجراس اليمن الإخبارية
          </p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="admin@ajras.net"
              className="w-full h-10 px-3.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition text-start text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              كلمة المرور
            </label>

            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full h-10 px-3.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition text-start text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 px-4 rounded-lg font-medium text-white bg-primary hover:bg-[var(--primary-hover,#8B2635)] active:bg-[var(--burgundy-dark,#5A1020)] active:scale-[0.99] transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-muted-foreground">
            منصة أجراس اليمن الإخبارية &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}
