import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Target, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterSection = () => {
  return (
    <section className="py-24 bg-[#0b1f3a] relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-[#132f52]/40 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >

          <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
            <Target className="w-4 h-4" /> Built for Hiring Teams
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Do You Know About Our{" "}
            <span className="text-[#69d2f1]">Recruiter View</span>?
          </h2>

          <p className="text-[#b8c7e0] font-body max-w-2xl mx-auto text-lg">
            A dedicated analytics dashboard designed for technical recruiters and hiring managers. 
            Get AI powered candidate assessments, GitHub activity insights, and downloadable evaluation reports.
          </p>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">

          {[
            {
              icon: BarChart3,
              title: "GitHub Analytics",
              desc: "Deep analysis of commit history, language proficiency, contribution patterns, and collaboration metrics.",
            },
            {
              icon: FileCheck,
              title: "AI Powered Assessment",
              desc: "Get a hire/no-hire recommendation with confidence score, strengths analysis, and actionable hiring notes.",
            },
            {
              icon: Shield,
              title: "Downloadable Reports",
              desc: "Generate comprehensive PDF-ready evaluation reports to share with your hiring committee.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#132f52] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-[#3fc4e7]/20"
            >

              <div className="w-14 h-14 rounded-2xl bg-[#3fc4e7]/15 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-[#3fc4e7]" />
              </div>

              <h3 className="font-display font-semibold text-lg text-white mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-[#b8c7e0] font-body leading-relaxed">
                {item.desc}
              </p>

            </motion.div>
          ))}

        </div>

        <div className="text-center">

          <Button
            variant="cta"
            size="lg"
            className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
            asChild
          >
            <Link to="/for-recruiters">
              Explore Recruiter Features <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <p className="text-xs text-[#b8c7e0] mt-3 font-body">
            Secure OAuth login required for recruiter analytics
          </p>

        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;