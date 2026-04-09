import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Send, MessageSquare, Loader2 } from "lucide-react";
import { subscribeFeedbacks, submitFeedback } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

const FeedbackSection = () => {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let didLoad = false;
    const unsubscribe = subscribeFeedbacks(20, (data) => {
      didLoad = true;
      setFeedbacks(data);
      setLoading(false);
    });
    // Timeout fallback — stop showing spinner after 5s even if Firestore is slow/blocked
    const timeout = setTimeout(() => { if (!didLoad) setLoading(false); }, 5000);
    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await submitFeedback(name.trim(), rating, message.trim());
      setShowForm(false);
      setRating(0);
      setName("");
      setMessage("");
      toast({ title: "Thank you!", description: "Your feedback has been submitted." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to submit feedback", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < count ? "fill-[#3fc4e7] text-[#3fc4e7]" : "text-[#b8c7e0]/30"
        }`}
      />
    ));

  return (
    <section id="feedback" className="py-24 bg-[#0b1f3a]">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            What Users Say
          </h2>

          <p className="text-[#b8c7e0] font-body max-w-lg mx-auto text-base">
            Real feedback from real developers
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#3fc4e7]" />
          </div>
        ) : feedbacks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-[#b8c7e0] font-body mb-4 text-base">
              No feedback yet. Be the first to share your experience!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">

            {feedbacks.map((fb, i) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#132f52] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#3fc4e7]/15"
              >
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(fb.rating)}
                </div>

                <p className="text-sm text-[#b8c7e0] font-body mb-4 leading-relaxed">
                  "{fb.message}"
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-sm text-white">
                    {fb.name}
                  </span>

                  <span className="text-xs text-[#b8c7e0]">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>

              </motion.div>
            ))}

          </div>
        )}

        <div className="text-center">

          {!showForm ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="cta"
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
                onClick={() => setShowForm(true)}
              >
                <MessageSquare className="w-5 h-5 mr-2" /> Leave Feedback
              </Button>
            </motion.div>
          ) : (

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto bg-[#132f52] rounded-2xl p-8 shadow-lg space-y-6 text-left border border-[#3fc4e7]/15"
            >

              <div>
                <label className="font-display font-semibold text-sm text-white block mb-2">
                  Rate your experience
                </label>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          i < (hoverRating || rating)
                            ? "fill-[#3fc4e7] text-[#3fc4e7]"
                            : "text-[#b8c7e0]/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-display font-semibold text-sm text-white block mb-2">
                  Your Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg border border-[#3fc4e7]/20 bg-[#0b1f3a] px-3 text-white font-body text-base focus:outline-none focus:ring-2 focus:ring-[#3fc4e7]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="font-display font-semibold text-sm text-white block mb-2">
                  Your Feedback
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-[#3fc4e7]/20 bg-[#0b1f3a] px-3 py-2 text-white font-body text-base focus:outline-none focus:ring-2 focus:ring-[#3fc4e7] resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <div className="flex gap-3">

                <Button
                  type="submit"
                  variant="cta"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
                  disabled={!rating || submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}

                  {submitting ? "Submitting..." : "Submit"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="border-[#3fc4e7]/30 text-white"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>

              </div>

            </motion.form>

          )}

        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;