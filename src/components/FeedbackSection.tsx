import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Send, MessageSquare } from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  rating: number;
  message: string;
  date: string;
}

const defaultFeedbacks: Feedback[] = [
  { id: 1, name: "Priya Sharma", rating: 5, message: "Generated my portfolio in 2 minutes! The recruiter theme is a game changer.", date: "2026-03-05" },
  { id: 2, name: "Rahul M.", rating: 4, message: "Love the developer terminal theme. My GitHub data was pulled perfectly.", date: "2026-03-04" },
  { id: 3, name: "Sarah Chen", rating: 5, message: "Clean, professional, and the animations are beautiful. Highly recommend!", date: "2026-03-03" },
  { id: 4, name: "Arjun K.", rating: 5, message: "20+ themes and all of them look production-ready. Amazing work by Adithya and Tharun!", date: "2026-03-02" },
  { id: 5, name: "Emily Davis", rating: 4, message: "The bold dark theme with purple gradients is stunning. Easy to use interface.", date: "2026-03-01" },
];

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem("portfolioforge-feedbacks");
    return saved ? [...defaultFeedbacks, ...JSON.parse(saved)] : defaultFeedbacks;
  });
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !name || !message) return;
    const newFeedback: Feedback = {
      id: Date.now(),
      name,
      rating,
      message,
      date: new Date().toISOString().split("T")[0],
    };
    const userFeedbacks = JSON.parse(localStorage.getItem("portfolioforge-feedbacks") || "[]");
    userFeedbacks.push(newFeedback);
    localStorage.setItem("portfolioforge-feedbacks", JSON.stringify(userFeedbacks));
    setFeedbacks((prev) => [...prev, newFeedback]);
    setShowForm(false);
    setRating(0);
    setName("");
    setMessage("");
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
    ));

  return (
    <section id="feedback" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            What Users Say
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Real feedback from real developers
          </p>
        </motion.div>

        {/* Feedback Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {feedbacks.map((fb, i) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center gap-1 mb-3">{renderStars(fb.rating)}</div>
              <p className="text-sm text-muted-foreground font-body mb-4">"{fb.message}"</p>
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-sm text-foreground">{fb.name}</span>
                <span className="text-xs text-muted-foreground">{fb.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Feedback */}
        <div className="text-center">
          {!showForm ? (
            <Button variant="cta" size="lg" className="rounded-full px-8" onClick={() => setShowForm(true)}>
              <MessageSquare className="w-5 h-5 mr-2" /> Leave Feedback
            </Button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-card space-y-6 text-left"
            >
              {/* Star Rating */}
              <div>
                <label className="font-display font-semibold text-sm text-foreground block mb-2">
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
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-display font-semibold text-sm text-foreground block mb-2">Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="font-display font-semibold text-sm text-foreground block mb-2">Your Feedback</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="cta" className="flex-1 rounded-lg" disabled={!rating}>
                  <Send className="w-4 h-4 mr-2" /> Submit
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
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
