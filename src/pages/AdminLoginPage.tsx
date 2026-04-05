import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, AlertTriangle, Lock, Eye, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInAdminWithGoogle, isAdminAuthenticated } from "@/lib/firebase";
import logo from "@/favicon/IMG-20260403-WA0058.jpg";

const AccessDenied = ({ email, onBack }: { email: string; onBack: () => void }) => {
  const time = new Date().toLocaleString();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Red scan lines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(220,38,38,0.03)_0px,rgba(220,38,38,0.03)_1px,transparent_1px,transparent_4px)] pointer-events-none" />
      {/* Pulsing red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-900/20 blur-3xl animate-pulse pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative max-w-lg w-full"
      >
        {/* Terminal-style header */}
        <div className="bg-red-950/80 border border-red-800/60 rounded-t-xl px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <div className="w-3 h-3 rounded-full bg-red-900" />
            <div className="w-3 h-3 rounded-full bg-red-900" />
          </div>
          <span className="text-red-500 font-mono text-xs ml-2">SECURITY_ALERT :: ACCESS_CONTROL_SYSTEM</span>
        </div>

        <div className="bg-[#0a0000] border border-red-900/50 border-t-0 rounded-b-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(220,38,38,0.3)", "0 0 50px rgba(220,38,38,0.7)", "0 0 20px rgba(220,38,38,0.3)"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-red-950 border-2 border-red-700 flex items-center justify-center"
            >
              <Lock className="w-10 h-10 text-red-500" />
            </motion.div>
          </div>

          {/* Main message */}
          <div className="text-center mb-6">
            <div className="text-red-500 font-mono text-xs tracking-[4px] uppercase mb-3">
              ⚠ UNAUTHORISED ACCESS ATTEMPT ⚠
            </div>
            <h1 className="text-3xl font-black text-red-500 mb-2 font-mono tracking-tight">
              ACCESS DENIED
            </h1>
            <p className="text-red-300/70 text-sm font-mono">
              You do not have clearance to access this system.
            </p>
          </div>

          {/* Log-style info block */}
          <div className="bg-black/60 border border-red-900/40 rounded-lg p-4 font-mono text-xs space-y-1.5 mb-6">
            <div className="flex gap-3">
              <span className="text-red-600 w-20 flex-shrink-0">[ACCOUNT]</span>
              <span className="text-red-300/80">{email}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 w-20 flex-shrink-0">[STATUS]</span>
              <span className="text-red-400 font-bold">NOT AUTHORISED</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 w-20 flex-shrink-0">[TIME]</span>
              <span className="text-red-300/60">{time}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 w-20 flex-shrink-0">[ACTION]</span>
              <span className="text-red-300/60">Session terminated · Account logged</span>
            </div>
          </div>

          {/* Warning items */}
          <div className="space-y-2 mb-8">
            {[
              { icon: Eye,    text: "This access attempt has been recorded and logged." },
              { icon: Server, text: "All unauthorised activity is monitored 24/7." },
              { icon: Shield, text: "Contact the system administrator if you believe this is an error." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-xs text-red-300/50 font-mono">
                <Icon className="w-3.5 h-3.5 text-red-700 flex-shrink-0 mt-0.5" />
                {text}
              </div>
            ))}
          </div>

          <button
            onClick={onBack}
            className="w-full py-2.5 rounded-lg border border-red-900/50 text-red-600/60 font-mono text-xs hover:border-red-700 hover:text-red-500 transition-all"
          >
            ← Return to login
          </button>
        </div>

        {/* Blinking cursor line */}
        <div className="mt-3 text-center">
          <span className="text-red-900/60 font-mono text-xs">
            REPOFLO SECURITY SYSTEM v2.1 · DEVORA TECHNOLOGIES
            <span className="animate-[blink_1s_step-end_infinite] ml-1">█</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState<string>("");

  if (isAdminAuthenticated()) {
    navigate("/rfl-secure/dashboard", { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    setDenied("");
    setLoading(true);
    try {
      await signInAdminWithGoogle();
      navigate("/rfl-secure/dashboard", { replace: true });
    } catch (err: any) {
      // Show scary screen only for unauthorised accounts
      const msg: string = err.message || "";
      if (msg.includes("denied") || msg.includes("not authorised")) {
        const emailMatch = msg.match(/[\w.-]+@[\w.-]+\.\w+/);
        setDenied(emailMatch?.[0] || "unknown@account");
      }
    } finally {
      setLoading(false);
    }
  };

  if (denied) {
    return <AccessDenied email={denied} onBack={() => setDenied("")} />;
  }

  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3fc4e7]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#6366f1]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        <div className="bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-5">
              <img src={logo} alt="Repoflo" className="h-9 w-9 rounded-full object-cover border-2 border-[#3fc4e7]/30" />
              <span className="font-display font-bold text-lg text-white">Repoflo</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#3fc4e7]/10 border border-[#3fc4e7]/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-[#3fc4e7]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-[#b8c7e0] font-body text-sm">Restricted — authorised personnel only</p>
          </div>

          <div className="bg-[#0b1f3a] rounded-xl p-4 mb-6 space-y-2.5 border border-[#3fc4e7]/10">
            {[
              ["1", "Click the button below"],
              ["2", "Sign in with your Google account"],
              ["3", "Access is granted if your account is authorised"],
            ].map(([n, text]) => (
              <div key={n} className="flex items-center gap-3 text-sm font-body">
                <span className="w-5 h-5 rounded-full bg-[#3fc4e7]/15 text-[#3fc4e7] text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                <span className="text-[#b8c7e0]">{text}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...</>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-[#b8c7e0]/25 font-body text-xs mt-4">
          Repoflo Admin · Powered by Devora Technologies
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
