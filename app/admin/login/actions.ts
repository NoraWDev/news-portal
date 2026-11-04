'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

function getSafeAuthErrorCode(error: unknown): string {
  if (!error || typeof error !== 'object') return 'auth_error'

  const authError = error as { code?: string; status?: number }
  const code = typeof authError.code === 'string' ? authError.code : ''
  const status = typeof authError.status === 'number' ? authError.status : 0

  if (code === 'invalid_credentials') return 'invalid_credentials'
  if (code === 'email_not_confirmed') return 'email_not_confirmed'
  if (code === 'over_request_rate_limit' || status === 429) return 'rate_limit'
  if (code === 'user_not_found') return 'auth_failed'

  if (status >= 500) return 'server_error'
  if (status >= 400) return 'auth_failed'

  return 'auth_error'
}

export async function login(formData: FormData) {
  const rawEmail = formData.get('email')
  const rawPassword = formData.get('password')

  if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string') {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }
  }

  const email = rawEmail.trim().toLowerCase()
  // كلمة المرور تُرسل كما أدخلها المستخدم تماماً دون تعديل أو تنظيف
  const password = rawPassword

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // فحص تشخيصي آمن يرصد الخصائص العامة دون طباعة أو تسجيل كلمة المرور
    const length = password.length
    const hasLeadingSpace = password.startsWith(' ')
    const hasTrailingSpace = password.endsWith(' ')
    const hasArabicDigits = /[\u0660-\u0669\u06F0-\u06F9]/.test(password)
    const hasHiddenChars = /[\u200B-\u200F\uFEFF\u202A-\u202E]/.test(password)
    const hasNonAscii = /[^\x20-\x7E]/.test(password)

    const issues: string[] = []
    if (hasLeadingSpace) issues.push('مسافة في البداية')
    if (hasTrailingSpace) issues.push('مسافة في النهاية')
    if (hasArabicDigits) issues.push('أرقام عربية/مشرقية')
    if (hasHiddenChars) issues.push('محارف توجيه مخفية')
    else if (hasNonAscii) issues.push('رموز غير قياسية (Non-ASCII)')

    // استخدام رمز خطأ آمن ومحدد فقط وتجنب عرض رسائل Supabase الخام
    const safeCode = getSafeAuthErrorCode(error)
    let diagnostic = `رمز الفحص: ${safeCode} • الطول: ${length}`
    if (issues.length > 0) {
      diagnostic += ` • ملاحظات: ${issues.join('، ')}`
    }

    return {
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      diagnostic,
    }
  }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
