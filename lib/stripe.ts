import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  FREE: {
    credits: 3,
    price: 0, // $0
    currency: "usd",
  },
  PRO: {
    credits: 15,
    price: 500, // $5.00
    currency: "usd",
  },
  PREMIUM: {
    credits: 50,
    price: 1000, // $10.00
    currency: "usd",
  },
};
