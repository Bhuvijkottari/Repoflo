import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GitBranch, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#feedback");
    }
  };

  const handleProcessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#process");
    }
  };

  const links = [
    { label: "Home", path: "/", onClick: undefined },
    { label: "Themes", path: "/themes", onClick: undefined },
    { label: "Recruiter View", path: "/generate", onClick: undefined },
    { label: "Process", path: "/#process", onClick: handleProcessClick },
    { label: "Feedback", path: "/#feedback", onClick: handleFeedbackClick },
  ];

  const handleLinkClick = (link: typeof links[0]) => (e: React.MouseEvent) => {
    if (link.onClick) {
      link.onClick(e);
    } else if (!link.path.startsWith("/#")) {
      e.preventDefault();
      setOpen(false);
      navigate(link.path);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl text-foreground">Repoflow</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={handleLinkClick(link)}
              className={`font-body text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
            <Button variant="cta" size="sm" className="rounded-full" asChild>
              <Link to="/themes">Get Started</Link>
            </Button>
          </motion.div>

          {/* Mobile hamburger */}
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] pt-12">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.path}
                      onClick={handleLinkClick(link)}
                      className={`font-body text-base font-medium px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === link.path
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="mt-4 px-4">
                    <Button variant="cta" className="w-full rounded-full" asChild onClick={() => setOpen(false)}>
                      <Link to="/themes">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
