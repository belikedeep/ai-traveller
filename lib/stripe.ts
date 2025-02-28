import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  BASIC: {
    credits: 5,
    price: 1000, // $10.00
    currency: "usd",
  },
  PRO: {
    credits: 15,
    price: 2500, // $25.00
    currency: "usd",
  },
  PREMIUM: {
    credits: 50,
    price: 7500, // $75.00
    currency: "usd",
  },
};
