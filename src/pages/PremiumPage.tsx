import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    priceINR: "₹399",
    priceUSD: "$4.99",
    views: "10 Resume Views",
  },
  {
    name: "Growth",
    priceINR: "₹899",
    priceUSD: "$10.99",
    views: "30 Resume Views",
  },
  {
    name: "Professional",
    priceINR: "₹1299",
    priceUSD: "$15.99",
    views: "50 Resume Views",
  },
  {
    name: "Enterprise Lite",
    priceINR: "₹1899",
    priceUSD: "$22.99",
    views: "80 Resume Views",
  },
];

const PremiumPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display mb-3">
          Upgrade to Premium 
        </h1>
        <p className="text-[#b8c7e0] max-w-md mx-auto">
          Unlock more candidate analyses and gain deeper hiring insights.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.name;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-[#3fc4e7] bg-[#132f52] scale-105 shadow-lg shadow-[#3fc4e7]/20"
                  : "border-[#3fc4e7]/20 bg-[#132f52]"
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {/* Plan Name */}
              <h2 className="text-xl font-bold font-display mb-2">
                {plan.name}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-[#3fc4e7]">
                  {plan.priceINR}
                </p>
                <p className="text-sm text-[#b8c7e0]">{plan.priceUSD}</p>
              </div>

              {/* Features */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <CheckCircle2 className="w-4 h-4 text-[#3fc4e7]" />
                {plan.views}
              </div>

              {/* Button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  className={`w-full font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
                      : "bg-[#3fc4e7]/10 text-[#69d2f1] border border-[#3fc4e7]/30 hover:bg-[#3fc4e7]/20"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevents double trigger
                    setSelectedPlan(plan.name);
                  }}
                >
                  {isSelected ? "Selected ✓" : "Choose Plan"}
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="text-center mt-12">
        <Button
          variant="outline"
          className="border-[#3fc4e7]/30 text-[#69d2f1] hover:bg-[#3fc4e7]/10"
          onClick={() => navigate("/recruiter")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PremiumPage;