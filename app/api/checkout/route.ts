import { createClient } from '@/lib/supabase/server'
import { stripe, PRICE_ONE_TIME, PRICE_MONTHLY } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const priceType = formData.get('priceType') as 'lifetime' | 'monthly'

    const isMonthly = priceType === 'monthly'
    const amount = isMonthly ? PRICE_MONTHLY : PRICE_ONE_TIME

    // Create or retrieve Stripe customer
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = userData?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isMonthly ? 'AppPlaybook Monthly Subscription' : 'AppPlaybook Lifetime Access',
              description: 'Access to 30+ app case studies',
            },
            unit_amount: amount,
            ...(isMonthly && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isMonthly ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        price_type: priceType,
      },
    })

    return NextResponse.redirect(session.url!)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
