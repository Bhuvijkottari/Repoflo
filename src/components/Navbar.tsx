import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#feedback");
    }
  };

  const handleProcessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#process");
    }
  };

  const links = [
    { label: "Home", path: "/", onClick: undefined },
    { label: "Themes", path: "/themes", onClick: undefined },
    { label: "Process", path: "/#process", onClick: handleProcessClick },
    { label: "Feedback", path: "/#feedback", onClick: handleFeedbackClick },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl text-foreground">PortfolioForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={link.onClick || (link.path.startsWith("/#") ? undefined : (e) => { e.preventDefault(); navigate(link.path); })}
              className={`font-body text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="cta" size="sm" className="rounded-full" asChild>
            <Link to="/generate">Generate Your Portfolio</Link>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
