import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role, is_active')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      // If user not found, return not found so client can proceed to normal sign-in
      return NextResponse.json({ found: false }, { status: 200 })
    }

    return NextResponse.json({ found: true, role: data?.role, is_active: data?.is_active }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

