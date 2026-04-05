import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};
import Index from "./pages/Index";
import GeneratePage from "./pages/GeneratePage";
import RecruiterPage from "./pages/RecruiterPage";
import AdminPage from "./pages/AdminPage";
import ThemesPage from "./pages/ThemesPage";
import PreviewPage from "./pages/PreviewPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import PremiumPage from "./pages/PremiumPage";
import RecruiterLandingPage from "./pages/RecruiterLandingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminVerifyPage from "./pages/AdminVerifyPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
    <ScrollToTop />
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen">
        <Routes location={location}>
          <Route path="/" element={<Index />} />
           <Route path="/generate" element={<GeneratePage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
          <Route path="/for-recruiters" element={<RecruiterLandingPage />} />
          <Route path="/adminProtectedRoutes/auth/signin" element={<AdminLoginPage />} />
          <Route path="/adminProtectedRoutes/auth/verify" element={<AdminVerifyPage />} />
          <Route path="/adminProtectedRoutes/auth/dashboard" element={<AdminDashboardPage />} />
          <Route path="/protectedRoutes/pages/admin" element={<AdminPage />} />
          <Route path="/themes" element={<ThemesPage />} />
          <Route path="/preview/:themeId" element={<PreviewPage />} />
          <Route path="*" element={<NotFound />} />

<Route path="/premium" element={<PremiumPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
