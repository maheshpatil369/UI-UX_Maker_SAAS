"use client"

import { Header } from "../_shared/Header";
import { Check } from "lucide-react"

export default function PricingPage() {

  const comingSoon = () => {
    alert("🚀 Coming Soon! Payment system will be available soon.")
  }

  const plans = [
    {
      name: "Starter",
      price: "$0",
      attempts: "2 UI Generations",
      features: [
        "2 AI UI Generations",
        "Export Generated Code",
        "Download UI Screenshots",
        "Mobile & Website UI",
        "Basic AI Speed"
      ]
    },
    {
      name: "Pro",
      price: "$9",
      attempts: "10 UI Generations",
      highlight: true,
      features: [
        "10 AI UI Generations",
        "Export Clean HTML Code",
        "Download UI Screenshots",
        "Mobile & Website UI",
        "Priority Generation",
        "Better AI Response"
      ]
    },
    {
      name: "Unlimited",
      price: "$19",
      attempts: "Unlimited UI Generations",
      features: [
        "Unlimited AI UI Generations",
        "Export Clean HTML Code",
        "Download UI Screenshots",
        "Mobile & Website UI",
        "Fastest AI Generation",
        "Future Premium Features"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">

      <Header />

      <section className="max-w-6xl mx-auto px-6 py-0">

        {/* Title */}
        <div className="text-center mb-16">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Simple Pricing
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Generate beautiful UI designs using AI
          </p>

        </div>


        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {plans.map((plan, index) => (

            <div
              key={index}
              className={`rounded-2xl border p-8 shadow-sm flex flex-col
              ${plan.highlight ? "border-red-500 scale-105 shadow-lg bg-white" : "bg-white"}
              `}
            >

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-3 flex items-end gap-2">

                <span className="text-4xl font-bold">
                  {plan.price}
                </span>

                <span className="text-gray-500">
                  /month
                </span>

              </div>

              {/* Attempts */}
              <p className="mt-2 text-sm text-gray-500">
                {plan.attempts}
              </p>


              {/* Features */}
              <ul className="mt-6 space-y-3 flex-1">

                {plan.features.map((feature, i) => (

                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">

                    <Check size={16} className="text-green-500" />

                    {feature}

                  </li>

                ))}

              </ul>


              {/* Button */}
       <button
  onClick={comingSoon}
  className={`group mt-8 w-full py-3 rounded-lg font-semibold transition cursor-pointer
  ${plan.highlight
      ? "bg-red-600 hover:bg-red-500 text-white"
      : "bg-gray-900 hover:bg-black text-white"}
  `}
>

  <span className="group-hover:hidden">
    Pay Now
  </span>

  <span className="hidden group-hover:inline">
    Coming Soon
  </span>

</button>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}