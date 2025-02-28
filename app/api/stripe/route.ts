import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, userEmail } = body;

    if (!plan || !userEmail) {
      return NextResponse.json(
        { error: "Plan and user email are required" },
        { status: 400 }
      );
    }

    const planDetails = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: planDetails.currency,
            product_data: {
              name: `${plan} Credits Package`,
              description: `${planDetails.credits} AI Trip Planner Credits`,
            },
            unit_amount: planDetails.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&email=${userEmail}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        credits: planDetails.credits.toString(),
        userEmail,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
