import { motion } from "framer-motion";
import { Palette, Github, Upload, Rocket, ArrowRight } from "lucide-react";

const steps = [
  { icon: Palette, title: "Pick a Theme", desc: "Choose from 20+ stunning themes or Recruiter mode", color: "from-primary to-accent" },
  { icon: Github, title: "Connect GitHub", desc: "Link your GitHub profile to auto-import projects", color: "from-accent to-primary" },
  { icon: Upload, title: "Upload Resume", desc: "Nova reads your resume and extracts all sections", color: "from-primary/80 to-accent/80" },
  { icon: Rocket, title: "Generate & Deploy", desc: "Get a production-ready portfolio instantly", color: "from-accent/80 to-primary" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto text-base">
            Four simple steps to your dream portfolio
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative"
        >
          {/* Connection line */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center relative border border-border/50"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg`}>
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="font-display font-bold text-primary text-xs mb-2 tracking-wider">STEP {i + 1}</div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="w-4 h-4 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
