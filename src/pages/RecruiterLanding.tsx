import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Search, Briefcase, Github, FileText, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Github,
    title: "Enter Candidate Profiles",
    desc: "Provide GitHub, LeetCode, and resume details of the candidate.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Our AI evaluates coding skills, projects, consistency, and problem-solving ability.",
  },
  {
    icon: CheckCircle,
    title: "Get Smart Reports",
    desc: "Receive detailed insights, skill match score, and hiring recommendations.",
  },
];

const features = [
  {
    icon: Search,
    title: "Deep Profile Analysis",
    desc: "Analyze GitHub activity, LeetCode stats, and resume data in seconds.",
  },
  {
    icon: Briefcase,
    title: "Role-Based Matching",
    desc: "Match candidates based on required skills and experience level.",
  },
  {
    icon: FileText,
    title: "AI Reports",
    desc: "Get structured reports with strengths, weaknesses, and hiring decisions.",
  },
];

const RecruiterLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">

      {/* HERO */}
      <div className="text-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#3fc4e7]/15 border border-[#3fc4e7]/30">
            <Shield className="w-8 h-8 text-[#3fc4e7]" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Hire Smarter with <span className="text-[#69d2f1]">AI Insights</span>
          </h1>

          <p className="text-[#b8c7e0] max-w-xl mx-auto mb-8">
            Evaluate candidates using GitHub, LeetCode, and resumes.  
            Get AI-powered reports with skill match, strengths, and hiring recommendations.
          </p>

          <Button
            onClick={() => navigate("/recruiter/dashboard")}
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black rounded-full"
          >
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#132f52] p-6 rounded-2xl border border-[#3fc4e7]/20"
            >
              <step.icon className="w-8 h-8 text-[#3fc4e7] mb-4" />
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-[#b8c7e0]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-[#132f52]/40">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Recruiters Love It
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-2xl border border-[#3fc4e7]/20 bg-[#0b1f3a]"
            >
              <f.icon className="w-8 h-8 text-[#3fc4e7] mb-4" />
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[#b8c7e0]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold mb-4">
          Start Hiring with Confidence
        </h2>

        <p className="text-[#b8c7e0] mb-8">
          Make data-driven hiring decisions in seconds.
        </p>

       
      </section>

    </div>
  );
};

export default RecruiterLanding;