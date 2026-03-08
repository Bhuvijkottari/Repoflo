import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Target, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
            <Target className="w-4 h-4" /> Built for Hiring Teams
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Do You Know About Our{" "}
            <span className="text-gradient">Recruiter View</span>?
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
            A dedicated analytics dashboard designed for technical recruiters and hiring managers. 
            Get Nova powered candidate assessments, GitHub activity insights, and downloadable evaluation reports.
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
              title: "AI-Powered Assessment",
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
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 text-center border border-border"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-lg" asChild>
            <Link to="/generate">
              Try Recruiter View <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3 font-body">
            Select the "Recruiter View" theme after generating your portfolio
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;
