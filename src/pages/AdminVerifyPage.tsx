import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Shield } from "lucide-react";
import { verifyAdminEmailLink } from "@/lib/firebase";

const AdminVerifyPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await verifyAdminEmailLink();
        if (user) {
          setStatus("success");
          setTimeout(() => navigate("/rfl-secure/dashboard", { replace: true }), 1500);
        } else {
          setStatus("error");
          setErrorMsg("This email is not authorised to access the admin portal.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Verification failed. The link may have expired.");
      }
    };
    verify();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl"
      >
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#3fc4e7]/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[#3fc4e7] animate-spin" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">Verifying your identity</h2>
            <p className="text-[#b8c7e0] font-body text-sm">Please wait while we authenticate your link...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">Identity verified!</h2>
            <p className="text-[#b8c7e0] font-body text-sm">Redirecting to admin dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">Verification failed</h2>
            <p className="text-[#b8c7e0] font-body text-sm mb-4">{errorMsg}</p>
            <button
              onClick={() => navigate("/rfl-secure/signin")}
              className="text-[#3fc4e7] text-sm font-body hover:text-white transition-colors"
            >
              ← Try again
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminVerifyPage;
