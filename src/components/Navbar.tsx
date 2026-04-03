import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/favicon/IMG-20260403-WA0058.jpg";
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
      className="fixed top-0 left-0 right-0 z-50 bg-[#132f52]/80 backdrop-blur-lg border-b border-[#3fc4e7]/20"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            style={{ border: "2px solid rgba(63,196,231,0.4)" }}
          />
          <span className="font-display font-bold text-xl text-white">Repoflo</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={handleLinkClick(link)}
              className={`font-body text-sm font-medium transition-colors hover:text-[#69d2f1] cursor-pointer ${
                location.pathname === link.path
                  ? "text-[#3fc4e7]"
                  : "text-[#b8c7e0]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">

          <motion.a
            href="https://www.repolyn.site"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-body border border-[#a78bfa]/40 text-[#c4b5fd] hover:bg-[#3fc4e7] hover:border-[#3fc4e7] hover:text-black transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
            Try Repolyn
          </motion.a>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Button
              variant="cta"
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
              asChild
            >
              <Link to="/themes">Get Started</Link>
            </Button>
          </motion.div>

          {/* Mobile hamburger */}
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2 text-[#b8c7e0] hover:text-[#69d2f1]"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] pt-12 bg-[#132f52] border-l border-[#3fc4e7]/20"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <div className="flex flex-col gap-2">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.path}
                      onClick={handleLinkClick(link)}
                      className={`font-body text-base font-medium px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === link.path
                          ? "text-[#3fc4e7] bg-[#3fc4e7]/10"
                          : "text-white hover:bg-[#0b1f3a]"
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}

                  <div className="mt-4 px-4 flex flex-col gap-2">
                    <a
                      href="https://www.repolyn.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold font-body border border-[#a78bfa]/40 text-[#c4b5fd] hover:bg-[#3fc4e7] hover:border-[#3fc4e7] hover:text-black transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                      Try Repolyn
                    </a>
                    <Button
                      variant="cta"
                      className="w-full rounded-full bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
                      asChild
                      onClick={() => setOpen(false)}
                    >
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