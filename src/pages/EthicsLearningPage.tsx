import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EthicsLearningPage = () => (
  <div className="min-h-screen bg-[#0b1f3a] text-white px-4 py-20">
    <div className="container mx-auto max-w-4xl rounded-3xl border border-[#3fc4e7]/20 bg-[#132f52]/80 p-10 shadow-xl shadow-[#3fc4e7]/10">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Recruiter Ethics Hub</h1>
        <p className="text-[#b8c7e0] text-lg leading-relaxed">
          This section will host ethics, compliance, and best-practice videos for recruiters. For now, the page shows a placeholder with video content coming soon.
        </p>
      </div>
      <div className="rounded-3xl border border-[#3fc4e7]/15 bg-[#0b1f3a] p-8 text-center">
        <div className="mx-auto mb-6 flex h-48 w-full max-w-2xl items-center justify-center rounded-3xl bg-[#0b1f3a]/80 border border-dashed border-[#3fc4e7]/20">
          <span className="text-[#b8c7e0] text-sm">Video content coming soon</span>
        </div>
        <p className="text-[#b8c7e0] text-sm mb-6">This page will feature ethics and hiring guidance videos for HR and recruiting teams.</p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black">Back to Landing</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default EthicsLearningPage;
