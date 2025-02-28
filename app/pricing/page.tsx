/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { updateUserCredits, getUser } from "@/service/UserService";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PRICING_PLANS = [
  {
    name: "Basic",
    credits: 5,
    price: "$10",
    features: [
      "5 AI Trip Itineraries",
      "Basic Destinations",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    credits: 15,
    price: "$25",
    features: [
      "15 AI Trip Itineraries",
      "Premium Destinations",
      "Priority Support",
      "Custom Modifications",
    ],
  },
  {
    name: "Premium",
    credits: 50,
    price: "$75",
    features: [
      "50 AI Trip Itineraries",
      "All Destinations",
      "24/7 Priority Support",
      "Unlimited Modifications",
      "Exclusive Features",
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    picture: string;
    credits?: number;
  } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    } else {
      router.push("/");
    }
  }, [router]);

  const handlePurchase = async (credits: number) => {
    if (!userData) return;

    setLoading(true);
    try {
      const user = await getUser(userData.email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      const updatedUser = await updateUserCredits(
        userData.email,
        user.credits + credits
      );

      if (!updatedUser) {
        throw new Error("Failed to update user credits");
      }

      // Update local storage with new credit balance
      const updatedUserData = { ...userData, credits: updatedUser.credits };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      toast({
        title: "Success!",
        description: `Added ${credits} credits to your account. New balance: ${updatedUser.credits} credits`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase credits",
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
              onClick={() => handlePurchase(plan.credits)}
            >
              {loading ? "Processing..." : "Purchase Now"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
