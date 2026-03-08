import { motion } from "framer-motion";
import { Palette, Github, Upload, Rocket } from "lucide-react";

const steps = [
  { icon: Palette, title: "Pick a Theme", desc: "Choose from 20+ stunning themes or Recruiter mode" },
  { icon: Github, title: "Connect GitHub", desc: "Link your GitHub profile to auto-import projects" },
  { icon: Upload, title: "Upload Resume", desc: "AI reads your resume and extracts all sections" },
  { icon: Rocket, title: "Generate & Deploy", desc: "Get a production-ready portfolio instantly" },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Four simple steps to your dream portfolio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="font-display font-bold text-primary text-xs mb-2">Step {i + 1}</div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
