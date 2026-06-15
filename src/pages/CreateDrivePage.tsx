import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Code2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TechStackInput from "@/components/TechStackInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createDrive } from "@/lib/firebase";

const CreateDrive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [driveName, setDriveName] = useState("");
  const [role, setRole] = useState("");

  const [requiredTechStack, setRequiredTechStack] =
    useState<string[]>([]);

  const [experienceLevel, setExperienceLevel] =
    useState("");

  const [selectedFields, setSelectedFields] =
    useState<string[]>([]);

  const availableFields = [
    { id: "github", label: "GitHub" },
    { id: "leetcode", label: "LeetCode" },
    { id: "resume", label: "Resume" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "codechef", label: "CodeChef" },
    { id: "geeksforgeeks", label: "GeeksForGeeks" },
    { id: "hackerrank", label: "HackerRank" },
  ];

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleCreateDrive = async () => {
    if (!driveName.trim()) {
      toast({
        title: "Drive name required",
        variant: "destructive",
      });
      return;
    }

    if (!role.trim()) {
      toast({
        title: "Role required",
        variant: "destructive",
      });
      return;
    }

    if (selectedFields.length === 0) {
      toast({
        title: "Select at least one field",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDrive({
        recruiterEmail: user?.email || "",
        driveName,
        role,
        selectedFields,
        requiredTechStack,
        experienceLevel,
        status: "active",
      });

      toast({
        title: "Drive created successfully",
      });

      navigate("/recruiter");
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to create drive",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="outline"
            className="mb-6 border-[#3fc4e7]/30 bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-display">
              Create Hiring Drive
            </h1>
            <p className="text-[#b8c7e0] mt-2">
              Configure candidate requirements for this drive
            </p>
          </div>

          <div className="bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl p-6 space-y-6">

            {/* Drive Name */}
            <div>
              <Label className="text-white mb-2 block">
                Drive Name
              </Label>
              <Input
                value={driveName}
                onChange={(e) =>
                  setDriveName(e.target.value)
                }
                placeholder="Campus Hiring 2026"
                className="bg-[#0b1f3a] border-[#3fc4e7]/20"
              />
            </div>

            {/* Role */}
            <div>
              <Label className="text-white mb-2 block">
                Role
              </Label>
              <Input
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                placeholder="Frontend Developer"
                className="bg-[#0b1f3a] border-[#3fc4e7]/20"
              />
            </div>

            {/* Required Fields */}
            <div>
              <Label className="text-white mb-3 block">
                Candidate Must Provide
              </Label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() =>
                      toggleField(field.id)
                    }
                    className={`rounded-xl border p-3 text-sm font-semibold transition-all
                    ${
                      selectedFields.includes(field.id)
                        ? "bg-[#3fc4e7]/20 border-[#3fc4e7] text-[#3fc4e7]"
                        : "bg-[#0b1f3a] border-[#3fc4e7]/20 text-[#b8c7e0]"
                    }`}
                  >
                    {selectedFields.includes(field.id) && (
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                    )}
                    {field.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <Label className="flex items-center gap-2 text-white mb-2">
                <Code2 className="w-4 h-4 text-[#3fc4e7]" />
                Required Tech Stack
              </Label>

              <TechStackInput
                selected={requiredTechStack}
                onChange={setRequiredTechStack}
              />
            </div>

            {/* Experience */}
            <div>
              <Label className="flex items-center gap-2 text-white mb-2">
                <Briefcase className="w-4 h-4 text-[#3fc4e7]" />
                Experience Level
              </Label>

              <Select
                value={experienceLevel}
                onValueChange={setExperienceLevel}
              >
                <SelectTrigger className="bg-[#0b1f3a] border-[#3fc4e7]/20">
                  <SelectValue placeholder="Any Experience" />
                </SelectTrigger>

                <SelectContent className="bg-[#132f52] text-white">
                  <SelectItem value="any">
                    Any Level
                  </SelectItem>

                  <SelectItem value="intern">
                    Intern
                  </SelectItem>

                  <SelectItem value="fresher">
                    Fresher
                  </SelectItem>

                  <SelectItem value="entry">
                    Entry Level
                  </SelectItem>

                  <SelectItem value="mid">
                    Mid Level
                  </SelectItem>

                  <SelectItem value="senior">
                    Senior
                  </SelectItem>

                  <SelectItem value="staff">
                    Staff / Lead
                  </SelectItem>

                  <SelectItem value="principal">
                    Principal / Architect
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateDrive}
              className="w-full h-12 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
            >
              Create Drive
            </Button>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDrive;