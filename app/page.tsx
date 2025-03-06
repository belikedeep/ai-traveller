"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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

  const features = [
    {
      icon: <Map className="h-12 w-12 text-indigo-500" />,
      title: "AI-Powered Recommendations",
      description:
        "Get personalized suggestions based on your preferences, past trips, and travel style.",
      imageDesc:
        "A modern interface showing AI analyzing travel preferences and suggesting personalized destinations. The screen displays data visualization, travel patterns, and smart recommendations. Size: 600x400px, Style: Clean UI/UX with futuristic elements",
    },
    {
      icon: <Clock className="h-12 w-12 text-indigo-500" />,
      title: "Save Time Planning",
      description:
        "Create detailed itineraries in minutes instead of hours of research.",
      imageDesc:
        "Split screen showing a person traditionally planning a trip with papers and guides (looking stressed) vs using TripAI (looking relaxed). The AI side shows real-time itinerary generation. Size: 600x400px, Style: Lifestyle comparison photography",
    },
    {
      icon: <Settings className="h-12 w-12 text-indigo-500" />,
      title: "Full Customization",
      description:
        "Easily modify any aspect of your itinerary to make it perfect for you.",
      imageDesc:
        "Person customizing their travel itinerary on a tablet, with multiple trip elements being dragged and rearranged. Background shows the actual destination changing based on selections. Size: 600x400px, Style: Interactive app demonstration",
    },
  ];

  return (
    <main className="relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)] opacity-10" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:grid lg:grid-cols-2 lg:h-screen lg:items-center lg:gap-8">
          {/* Left side with text */}
          {/* Left column for text */}
          <div className="mx-auto max-w-2xl text-left lg:mx-0">
            <h1 className="text-3xl font-extrabold sm:text-5xl lg:text-7xl flex flex-col items-start">
              <div className="flex items-center gap-4">
                <span className="animate-bounce">🚀</span>
                <span className="bg-gradient-to-r from-indigo-600 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  Your Perfect Trip,
                </span>
              </div>
              <span className="bg-gradient-to-r from-indigo-600 via-sky-400 to-indigo-400 bg-clip-text text-transparent sm:mt-2">
                Planned by AI
              </span>
              <span className="animate-pulse sm:mt-2">✨</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl text-muted-foreground sm:text-2xl/relaxed">
              Create personalized travel itineraries in minutes with our
              advanced AI technology. Perfect for any destination, any budget,
              any style.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/create-trip">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg px-8 py-6 rounded-full group transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
                >
                  <span>
                    Plan Your Trip <span className="inline-block">🗺️</span>
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300 hover:bg-indigo-500/10"
                >
                  Learn More <span className="inline-block">💡</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column for hero image */}
          <div className="hidden lg:block relative mt-12 lg:mt-0">
            <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl -rotate-3">
              <Image
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1200}
                height={900}
                alt="Hero image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-xl text-center mx-auto mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-pulse">✨</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Why Choose TripAI?
              </span>
              <span className="animate-pulse">✨</span>
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-indigo-500/25 hover:border-indigo-500/50 hover:-translate-y-1"
              >
                <div className="w-full">
                  <div className="aspect-[3/2] w-full relative">
                    <Image
                      src={
                        feature.title === "AI-Powered Recommendations"
                          ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122004/ai-travel/ruqlyblpjnlrjpvkxq6q.png"
                          : feature.title === "Save Time Planning"
                          ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122005/ai-travel/biuvu8ci0izly6rrmbck.png"
                          : "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122005/ai-travel/vycgnnvippsujghuyydj.png"
                      }
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-500/20 bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110 mb-8">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white/90 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="absolute right-4 top-4 rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                      {index + 1}/3
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32">
        <div className="container mx-auto px-8">
          <h2 className="flex items-center justify-center gap-4 text-4xl font-bold text-center mb-20">
            <span className="animate-spin-slow">⚙️</span>
            <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              How It Works
            </span>
            <span className="animate-spin-slow">⚙️</span>
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
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-bounce">🗣️</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                What Travelers Say
              </span>
              <span className="animate-bounce">🗣️</span>
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            {[
              {
                text: "The AI-generated itinerary was perfect! It saved me hours of planning and found amazing hidden gems.",
                author: "Sarah J.",
                location: "New York, USA",
                rating: 5,
              },
              {
                text: "I was skeptical at first, but the personalized recommendations were spot-on. Best trip ever!",
                author: "Mike R.",
                location: "London, UK",
                rating: 5,
              },
              {
                text: "This tool is a game-changer for travel planning. The customization options are endless.",
                author: "Laura M.",
                location: "Sydney, Australia",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 p-8 shadow-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14">
                    <div className="absolute -inset-1 rounded-full bg-indigo-500/20 blur-lg" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-indigo-600/10 text-indigo-500 border border-indigo-500/20">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <p className="mt-0.5 text-lg font-medium text-white/90">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-indigo-500" />
                  ))}
                </div>

                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-pulse">💎</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Simple Pricing
              </span>
              <span className="animate-pulse">💎</span>
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Choose the plan that best fits your travel needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {[
              {
                name: "FREE",
                price: "$0",
                description: "Perfect for trying out TripAI",
                features: [
                  "Plan trips up to 5 days",
                  "3 AI Trip Itineraries",
                  "Popular Destinations",
                  "Basic Support",
                  "Authenticated Sharing (Sign-in required)",
                ],
              },
              {
                name: "PRO",
                price: "$5",
                description: "Great for regular travelers",
                features: [
                  "Everything from Free",
                  "Plan trips up to 15 days",
                  "15 AI Trip Itineraries",
                  "All Destinations",
                  "Priority Support",
                  "Public Trip Sharing",
                  "Share with Anyone (No Sign-in Required)",
                ],
                popular: true,
              },
              {
                name: "PREMIUM",
                price: "$10",
                description: "For serious travel enthusiasts",
                features: [
                  "Everything from Pro",
                  "Plan trips up to 15 days",
                  "50 AI Trip Itineraries",
                  "All Destinations",
                  "24/7 Priority Support",
                  "Priority Queue",
                  "Advanced Trip Sharing Analytics",
                  "Unlimited Public Sharing",
                ],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  plan.popular
                    ? "bg-gradient-to-b from-indigo-500/10 via-background to-background ring-2 ring-indigo-500"
                    : "border-border/50 bg-background/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-muted-foreground">
                      /one-time
                    </span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 ${
                            plan.popular ? "text-indigo-500" : "text-green-500"
                          }`}
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
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/pricing">
                      <Button
                        className="w-full"
                        variant={plan.popular ? "premium" : "default"}
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 relative">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-indigo-200 to-gray-400 bg-clip-text text-transparent">
              Ready to Start Your Journey?{" "}
            </h2>
            <span className="inline-block animate-float text-4xl font-bold sm:text-5xl md:text-6xl">
              🚀
            </span>

            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Join thousands of happy travelers who have discovered their
              perfect trips with TripAI.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/create-trip">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg px-10 py-8 rounded-full group relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <span>
                      Create Your Free Itinerary{" "}
                      <span className="inline-block animate-pulse">✨</span>
                    </span>
                    <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </div>
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-muted-foreground">
              No credit card required • Start planning in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-pulse">🌎</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Popular Destinations
              </span>
              <span className="animate-pulse">🌎</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "European Adventure",
                description:
                  "From ancient ruins to modern cities, experience the best of Europe.",
                popular: ["Paris", "Rome", "Barcelona"],
              },
              {
                title: "Asian Discovery",
                description:
                  "Immerse yourself in rich cultures and stunning landscapes.",
                popular: ["Tokyo", "Bangkok", "Singapore"],
              },
              {
                title: "American Journey",
                description: "Explore diverse landscapes from coast to coast.",
                popular: ["New York", "San Francisco", "Miami"],
              },
            ].map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-indigo-500/25 hover:border-indigo-500/50"
              >
                {/* Destination Image */}
                <div className="aspect-video w-full relative">
                  <Image
                    src={
                      index === 0
                        ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122025/ai-travel/outwf1t9k6nffvgggbmb.png"
                        : index === 1
                        ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122024/ai-travel/obvlefh15degxmhmbgr5.png"
                        : "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122024/ai-travel/uwvtp16hveskr2f12bwu.png"
                    }
                    alt={destination.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Destination Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white/90 mb-4">
                    {destination.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {destination.description}
                  </p>
                  <div className="space-y-2">
                    {destination.popular.map((city, i) => (
                      <div
                        key={i}
                        className="flex items-center text-indigo-400"
                      >
                        <span className="mr-2">•</span>
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips & Resources */}
      {/* <section className="py-32 relative">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-float">📚</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Travel Tips & Resources
              </span>
              <span className="animate-float">📚</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Packing Essentials",
                description:
                  "Our AI helps you create the perfect packing list based on your destination and season.",
              },
              {
                title: "Local Customs",
                description:
                  "Get insights about local customs and etiquette for a respectful travel experience.",
              },
              {
                title: "Budget Planning",
                description:
                  "Smart tools to help you plan and track your travel expenses effectively.",
              },
              {
                title: "Safety Tips",
                description:
                  "Stay informed about travel safety with real-time updates and recommendations.",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="group rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[3/2] w-full relative">
                  <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    {index === 0 &&
                      "[Image: Organized travel essentials neatly laid out with AI interface overlay suggesting items based on destination. Shows both summer and winter packing scenarios. Size: 600x400px, Style: Clean, minimal product photography]"}
                    {index === 1 &&
                      "[Image: Collage showing different cultural greetings and customs from around the world, with subtle AI interface elements providing context. Size: 600x400px, Style: Documentary photography with infographic elements]"}
                    {index === 2 &&
                      "[Image: Smart budget tracking interface showing expense categories, with background showing tourist enjoying experiences within budget. Size: 600x400px, Style: UI screenshot with lifestyle photography]"}
                    {index === 3 &&
                      "[Image: Real-time safety monitoring dashboard with map overlays and travel alerts, showing practical usage in different scenarios. Size: 600x400px, Style: Technical interface with real-world application]"}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">{tip.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Travel Styles */}
      <section className="py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="flex items-center justify-center gap-4 text-4xl font-bold sm:text-5xl">
              <span className="animate-color-shift">🎨</span>
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Your Travel Style
              </span>
              <span className="animate-color-shift">🎨</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Luxury Traveler",
                description:
                  "Premium experiences with top-rated accommodations and exclusive activities.",
              },
              {
                title: "Adventure Seeker",
                description:
                  "Off-the-beaten-path experiences and thrilling activities for the bold.",
              },
              {
                title: "Cultural Explorer",
                description:
                  "Deep dive into local traditions, arts, and authentic experiences.",
              },
            ].map((style, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-indigo-500/25 hover:border-indigo-500/50"
              >
                <div className="aspect-video w-full relative">
                  <Image
                    src={
                      index === 0
                        ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122083/ai-travel/cbdhi5yprj4trujc2hms.png"
                        : index === 1
                        ? "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122043/ai-travel/sbasejlcivwerhgw0yue.png"
                        : "https://res.cloudinary.com/dgvdv9xhx/image/upload/v1741122063/ai-travel/v7jwqmlschpvenewffmf.png"
                    }
                    alt={style.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white/90 mb-4">
                    {style.title}
                  </h3>
                  <p className="text-muted-foreground">{style.description}</p>
                  <Link href="/create-trip">
                    <Button variant="ghost" className="mt-6 group">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
