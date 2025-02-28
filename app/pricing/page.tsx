"use client";

import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe-client";
import { useEffect, useState, Suspense, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { STRIPE_PLANS } from "@/lib/stripe";

const PRICING_PLANS = [
  {
    name: "BASIC",
    credits: STRIPE_PLANS.BASIC.credits,
    price: `$${STRIPE_PLANS.BASIC.price / 100}`,
    features: [
      "5 AI Trip Itineraries",
      "Basic Destinations",
      "Standard Support",
    ],
  },
  {
    name: "PRO",
    credits: STRIPE_PLANS.PRO.credits,
    price: `$${STRIPE_PLANS.PRO.price / 100}`,
    features: [
      "15 AI Trip Itineraries",
      "Premium Destinations",
      "Priority Support",
      "Custom Modifications",
    ],
  },
  {
    name: "PREMIUM",
    credits: STRIPE_PLANS.PREMIUM.credits,
    price: `$${STRIPE_PLANS.PREMIUM.price / 100}`,
    features: [
      "50 AI Trip Itineraries",
      "All Destinations",
      "24/7 Priority Support",
      "Unlimited Modifications",
      "Exclusive Features",
    ],
  },
];

function PricingPageContent(): ReactNode {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    picture: string;
    credits?: number;
  } | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    } else {
      window.location.href = "/";
    }
  }, []); // Only run on mount

  useEffect(() => {
    let isSubscribed = true;

    const handlePaymentStatus = async () => {
      const success = searchParams.get("success");
      const error = searchParams.get("error");

      if (!success && !error) return;

      if (success === "true") {
        const newCredits = searchParams.get("newCredits");
        if (newCredits && userData && isSubscribed) {
          const credits = parseInt(newCredits);
          const updatedUserData = {
            ...userData,
            credits,
          };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
          setUserData(updatedUserData);

          toast({
            title: "Payment Successful!",
            description: `Your account has been credited with ${newCredits} credits.`,
          });
        }
      } else if (error === "true") {
        const errorMessage = searchParams.get("message");
        toast({
          title: "Payment Failed",
          description:
            errorMessage || "There was an error processing your payment.",
          variant: "destructive",
        });
      }

      // Clean up URL parameters using history API instead of router
      if (isSubscribed) {
        window.history.replaceState({}, "", "/pricing");
      }
    };

    handlePaymentStatus();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, toast, userData]);

  const handlePurchase = async (planName: string) => {
    if (!userData) return;

    setLoading(true);
    try {
      // Create Checkout Session
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planName,
          userEmail: userData.email,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to purchase credits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">
          Select the perfect plan for your travel needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-4xl font-bold mb-6">{plan.price}</p>
            <p className="text-gray-600 mb-6">{plan.credits} Credits</p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => handlePurchase(plan.name)}
            >
              {loading ? "Processing..." : `Purchase ${plan.credits} Credits`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          Loading...
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  );
}
