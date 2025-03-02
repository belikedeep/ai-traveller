"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Map, Settings, Star, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/my-trips");
    }
  }, [router]);

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-background to-background" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>
        <div className="container mx-auto px-8">
          <div className="text-center max-w-5xl mx-auto space-y-10">
            <h2 className="text-7xl font-bold leading-tight">
              🚀 Your Perfect Trip,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">
                Planned by AI
              </span>{" "}
              ✨
            </h2>
            <p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Create personalized travel itineraries in minutes with our
              advanced AI technology. Perfect for any destination, any budget,
              any style.
            </p>
            <div className="flex gap-6 justify-center pt-4">
              <Link href="/create-trip">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg px-8 py-6 rounded-full group"
                >
                  <span>Plan Your Trip 🗺️</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full"
                >
                  Learn More 💡
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-20 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            ✨ Why Choose TripAI? ✨
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
                className="group p-8 rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/5 to-background -z-10" />
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-20 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            ⚙️ How It Works ⚙️
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
                <div className="w-16 h-16 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/20">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
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
          <h2 className="text-4xl font-bold text-center mb-20 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            🗣️ What Travelers Say 🗣️
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
                className="p-8 rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <Star className="h-12 w-12 text-indigo-500 mb-6" />
                <p className="text-lg leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-lg">{testimonial.author}</p>
                  <p className="text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/10 to-background -z-10" />
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Ready to Start Your Journey? 🚀
            </h2>
            <p className="text-2xl mb-12 leading-relaxed text-muted-foreground">
              Join thousands of happy travelers who have discovered their
              perfect trips with TripAI.
            </p>
            <Link href="/create-trip">
              <Button
                size="lg"
                variant="premium"
                className="text-lg px-8 py-6 rounded-full group"
              >
                <span>Create Your Free Itinerary ✨</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
