import { useState, useRef } from "react";
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
import { hashPassword, isValidPasswordCode } from "@/lib/password";

import { createDrive } from "@/lib/firebase";

const CreateDrive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [driveName, setDriveName] = useState("");
  const [role, setRole] = useState("");
  const [createdByName, setCreatedByName] = useState("");
  const [createdByPosition, setCreatedByPosition] = useState("");

  const [requiredTechStack, setRequiredTechStack] =
    useState<string[]>([]);

  const [experienceLevel, setExperienceLevel] =
    useState("");

  const [selectedFields, setSelectedFields] =
    useState<string[]>([]);
  const [drivePassword, setDrivePassword] = useState("");
  const [driveCreatedMessage, setDriveCreatedMessage] = useState("");
  const successRef = useRef<HTMLDivElement | null>(null);

  const availableFields = [
    { id: "github", label: "GitHub" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "website", label: "Portfolio Website" },
    { id: "leetcode", label: "LeetCode" },
    { id: "resume", label: "Resume" },
    { id: "aptitudeScore", label: "Aptitude/Maths Score" },
    { id: "technicalScore", label: "Technical Test Score" },
    // Removed GeeksForGeeks per UI cleanup request
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

    if (!createdByName.trim()) {
      toast({
        title: "Recruiter name required",
        description: "Please enter the name of the person creating the drive.",
        variant: "destructive",
      });
      return;
    }

    if (!createdByPosition.trim()) {
      toast({
        title: "Position required",
        description: "Please enter the recruiter position in the company.",
        variant: "destructive",
      });
      return;
    }

    if (drivePassword && !isValidPasswordCode(drivePassword)) {
      toast({
        title: "Password must be 4 digits",
        description: "Enter a 4-digit numeric code to secure the drive.",
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
        createdByName,
        createdByPosition,
        selectedFields,
        requiredTechStack,
        experienceLevel,
        passwordHash: drivePassword ? await hashPassword(drivePassword) : undefined,
        status: "active",
      });

      const successText = `Drive "${driveName}" created successfully.`;
      toast({
        title: "Drive created successfully",
        description: successText,
      });
      if (!drivePassword) {
        toast({
          title: "Tip: secure your drive",
          description: "An optional 4-digit password can protect analysis and results for this drive.",
        });
      }
      setDriveCreatedMessage(successText);
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
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
            onClick={() => navigate("/recruiter")}
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
            {driveCreatedMessage && (
              <div ref={successRef} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200 space-y-4">
                <div>{driveCreatedMessage}</div>
                <Button
                  variant="outline"
                  className="w-full border-[#3fc4e7]/30 bg-transparent text-white"
                  onClick={() => navigate("/recruiter")}
                >
                  Back to Recruiter Portal
                </Button>
              </div>
            )}

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

            {/* Recruiter name */}
            <div>
              <Label className="text-white mb-2 block">
                Recruiter Name
              </Label>
              <Input
                value={createdByName}
                onChange={(e) =>
                  setCreatedByName(e.target.value)
                }
                placeholder="Akhil Sharma"
                className="bg-[#0b1f3a] border-[#3fc4e7]/20"
              />
            </div>

            {/* Position in company */}
            <div>
              <Label className="text-white mb-2 block">
                Position in Company
              </Label>
              <Input
                value={createdByPosition}
                onChange={(e) =>
                  setCreatedByPosition(e.target.value)
                }
                placeholder="Talent Acquisition Lead"
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

            <div>
              <Label className="text-white mb-2 block">Optional Drive Password</Label>
              <Input
                type="password"
                maxLength={4}
                value={drivePassword}
                onChange={(e) => setDrivePassword(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="1234"
                className="bg-[#0b1f3a] border-[#3fc4e7]/20"
              />
              <p className="text-[#b8c7e0] text-xs mt-2">
                Keep this drive secure with an optional 4-digit passcode. If you skip it, anyone with access can analyze or view results for this drive.
              </p>
            </div>

            <Button
              type="button"
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