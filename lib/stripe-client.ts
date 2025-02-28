import { loadStripe } from "@stripe/stripe-js";

export const getStripe = async () => {
  const stripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  if (!stripe) {
    throw new Error("Failed to initialize Stripe");
  }

  return stripe;
};
