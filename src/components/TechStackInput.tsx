import { useState, useRef, useEffect } from "react";
import { X, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const TECH_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust", "Ruby",
  "PHP", "Swift", "Kotlin", "Dart", "Scala", "R", "Perl", "Haskell", "Elixir", "Clojure",
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Nuxt.js", "Remix", "Gatsby", "Astro",
  "Node.js", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "Rails",
  "Laravel", "ASP.NET", "Gin", "Fiber", "Actix",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Cassandra", "DynamoDB", "Firebase",
  "Supabase", "Prisma", "Drizzle", "TypeORM",
  "AWS", "GCP", "Azure", "Vercel", "Netlify", "Cloudflare", "DigitalOcean", "Heroku",
  "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "CircleCI",
  "GraphQL", "REST API", "gRPC", "WebSocket", "tRPC",
  "TailwindCSS", "Bootstrap", "Material UI", "Chakra UI", "Styled Components", "Sass",
  "React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Ionic", "Electron",
  "TensorFlow", "PyTorch", "OpenAI", "LangChain", "Hugging Face",
  "Git", "Linux", "Nginx", "Apache", "RabbitMQ", "Kafka", "Elasticsearch",
  "Jest", "Vitest", "Cypress", "Playwright", "Selenium",
  "Figma", "Storybook", "Webpack", "Vite", "Rollup", "ESBuild",
  "Solidity", "Web3.js", "Ethers.js", "Hardhat",
  "Three.js", "D3.js", "Chart.js", "Framer Motion",
  "Redux", "Zustand", "Jotai", "MobX", "React Query", "SWR",
  "OAuth", "JWT", "SAML", "Auth0", "Clerk",
  "Stripe", "Twilio", "SendGrid", "Algolia",
  "HTML", "CSS", "WASM", "Bash", "PowerShell",
];

interface TechStackInputProps {
  selected: string[];
  onChange: (techs: string[]) => void;
}

const TechStackInput = ({ selected, onChange }: TechStackInputProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = TECH_OPTIONS.filter(
    (t) => t.toLowerCase().includes(query.toLowerCase()) && !selected.includes(t)
  );

  const add = (tech: string) => {
    onChange([...selected, tech]);
    setQuery("");
  };

  const addCustom = () => {
    const trimmed = query.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setQuery("");
    }
  };

  const remove = (tech: string) => onChange(selected.filter((t) => t !== tech));

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        <AnimatePresence>
          {selected.map((tech) => (
            <motion.div key={tech} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Badge variant="secondary" className="text-xs font-body gap-1 pr-1">
                {tech}
                <button onClick={() => remove(tech)} className="ml-0.5 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); if (filtered.length > 0) add(filtered[0]); else addCustom(); }
          }}
          placeholder="Search tech stack (e.g. React, Python)..."
          className="h-9 text-sm pl-8"
        />
      </div>
      {open && (query || true) && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-popover border border-border rounded-lg shadow-lg">
          {filtered.length === 0 && query.trim() && (
            <button
              onClick={addCustom}
              className="w-full text-left px-3 py-2 text-sm font-body text-foreground hover:bg-accent flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add "{query.trim()}"
            </button>
          )}
          {filtered.slice(0, 20).map((tech) => (
            <button
              key={tech}
              onClick={() => add(tech)}
              className="w-full text-left px-3 py-2 text-sm font-body text-foreground hover:bg-accent transition-colors"
            >
              {tech}
            </button>
          ))}
          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-2 text-xs text-muted-foreground">Type to search technologies...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TechStackInput;
