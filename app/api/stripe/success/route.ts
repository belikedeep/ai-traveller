import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { getUser, updateUserCredits } from "@/service/UserService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");
    const plan = searchParams.get("plan");
    const email = searchParams.get("email");

    if (!sessionId || !plan || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment status
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get plan details
    const planDetails = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Update user credits
    const user = await getUser(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await updateUserCredits(
      email,
      user.credits + planDetails.credits
    );

    if (!updatedUser) {
      return NextResponse.redirect(
        new URL(
          `/pricing?error=true&message=failed-to-update-credits`,
          req.nextUrl.origin
        )
      );
    }

    // Add credits info to redirect URL
    return NextResponse.redirect(
      new URL(
        `/pricing?success=true&newCredits=${updatedUser.credits}`,
        req.nextUrl.origin
      )
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL(`/pricing?error=true`, req.nextUrl.origin)
    );
  }
}
