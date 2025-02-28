"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Map, Settings, Star, Clock, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/my-trips");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-8">
            <div className="text-center max-w-5xl mx-auto space-y-10">
              <h2 className="text-7xl font-bold text-white leading-tight">
                Your Perfect Trip,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-300">
                  Planned by AI
                </span>
              </h2>
              <p className="text-2xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
                Create personalized travel itineraries in minutes with our
                advanced AI technology. Perfect for any destination, any budget,
                any style.
              </p>
              <div className="flex gap-6 justify-center pt-4">
                <Link href="/create-trip">
                  <Button
                    size="lg"
                    className="bg-indigo-500 hover:bg-indigo-600 text-lg px-8 py-6 rounded-full"
                  >
                    Plan Your Trip
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-full border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-20 text-white">
              Why Choose TripAI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Map className="h-12 w-12 text-indigo-500" />,
                  title: "AI-Powered Recommendations",
                  description:
                    "Get personalized suggestions based on your preferences, past trips, and travel style.",
                },
                {
                  icon: <Clock className="h-12 w-12 text-indigo-500" />,
                  title: "Save Time Planning",
                  description:
                    "Create detailed itineraries in minutes instead of hours of research.",
                },
                {
                  icon: <Settings className="h-12 w-12 text-indigo-500" />,
                  title: "Full Customization",
                  description:
                    "Easily modify any aspect of your itinerary to make it perfect for you.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 relative bg-zinc-900/50">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-20 text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Share Your Preferences",
                  description:
                    "Tell us about your travel style, interests, and must-see attractions.",
                },
                {
                  step: "2",
                  title: "Set Your Parameters",
                  description:
                    "Input your dates, budget, and any specific requirements.",
                },
                {
                  step: "3",
                  title: "AI Creates Your Plan",
                  description:
                    "Our AI generates a personalized itinerary in minutes.",
                },
                {
                  step: "4",
                  title: "Customize & Go",
                  description: "Fine-tune your plan and start your adventure!",
                },
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-20 text-white">
              What Travelers Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  text: "The AI-generated itinerary was perfect! It saved me hours of planning and found amazing hidden gems.",
                  author: "Sarah J.",
                  location: "New York, USA",
                },
                {
                  text: "I was skeptical at first, but the personalized recommendations were spot-on. Best trip ever!",
                  author: "Mike R.",
                  location: "London, UK",
                },
                {
                  text: "This tool is a game-changer for travel planning. The customization options are endless.",
                  author: "Laura M.",
                  location: "Sydney, Australia",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <Star className="h-12 w-12 text-indigo-500 mb-6" />
                  <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                    {testimonial.text}
                  </p>
                  <div>
                    <p className="font-semibold text-lg text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-zinc-500">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative bg-zinc-900/50">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-center mb-20 text-white">
              Simple Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Basic",
                  price: "Free",
                  features: [
                    "1 trip per month",
                    "Basic recommendations",
                    "24-hour support",
                  ],
                },
                {
                  name: "Pro",
                  price: "$9.99/month",
                  features: [
                    "Unlimited trips",
                    "Advanced AI recommendations",
                    "Priority support",
                    "Custom modifications",
                  ],
                },
                {
                  name: "Business",
                  price: "$29.99/month",
                  features: [
                    "Team collaboration",
                    "API access",
                    "White-label options",
                    "Dedicated account manager",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-3xl border transition-all duration-300 ${
                    index === 1
                      ? "bg-indigo-500/10 border-indigo-500/50 hover:border-indigo-500"
                      : "bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50"
                  }`}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold mb-8 text-white">
                    {plan.price}
                  </p>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-lg text-zinc-300"
                      >
                        <Shield className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full text-lg py-6 rounded-2xl ${
                      index === 1
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-b from-zinc-900/50 to-indigo-500/10">
          <div className="container mx-auto px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-8 text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="text-2xl mb-12 leading-relaxed text-zinc-400">
                Join thousands of happy travelers who have discovered their
                perfect trips with TripAI.
              </p>
              <Link href="/create-trip">
                <Button
                  size="lg"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-6 rounded-full"
                >
                  Create Your Free Itinerary
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
