import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Initialize user data if new
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if categories exist
        const { data: categories } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        // Initialize if no categories
        if (!categories || categories.length === 0) {
          await supabase.rpc('initialize_user_categories', { p_user_id: user.id })
          
          // Get the new categories and initialize missions
          const { data: newCategories } = await supabase
            .from('categories')
            .select('id, code')
            .eq('user_id', user.id)

          if (newCategories) {
            for (const cat of newCategories) {
              await supabase.rpc('initialize_default_missions', {
                p_user_id: user.id,
                p_category_id: cat.id,
                p_category_code: cat.code,
              })
            }
          }
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`)
}
