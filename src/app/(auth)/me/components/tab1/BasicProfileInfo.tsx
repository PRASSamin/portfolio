"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types";
import { upload } from "@/utils/uploadToCloudinary";
import { BetterImage } from "@prass/betterimage/components";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const BasicProfileInfo = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [form, setForm] = useState<{
    first_name: string;
    last_name: string;
    avatar: string;
  }>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    avatar: user?.avatar || "",
  });

  const initialFormState = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    avatar: user?.avatar || "",
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialFormState);

  const { updateUser, reloadSession } = useUser();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size must be less than 5MB");
    }

    setIsAvatarUploading(true);
    try {
      const url = await upload({ file, folder: "pras/portfolio/user" });
      setForm((prev) => ({ ...prev, avatar: url }));
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Failed to upload Avatar");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!hasChanges) return;

    try {
      setIsLoading(true);
      await updateUser(form);
      await reloadSession();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-id="profile" className="mt-4 mb-8">
      <h2 className="text-sm font-bold">Profile</h2>

      <AnimatePresence mode="wait">
        {/* Profile View Mode */}
        {!isEditing && (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mt-4 px-2"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-16 aspect-square">
                <BetterImage
                  src={user?.avatar || ""}
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt={user.full_name || ""}
                />
              </div>
              <span className="w-full text-sm">{user.full_name}</span>
            </div>
            <div className="w-full flex items-center justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-[13px] text-purple-600 rounded-md hover:bg-muted-foreground/5 focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-300"
              >
                Update Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Edit Profile Mode */}
        {isEditing && (
          <motion.div
            key="profile-edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 w-full border p-4 rounded-md bg-card/30"
          >
            <h3 className="text-sm font-bold">Update profile</h3>
            <div className="flex flex-col mt-4">
              {/* Avatar Upload */}
              <div className="h-16 flex items-center gap-4">
                <div className="h-full">
                  <BetterImage
                    width={100}
                    height={100}
                    src={form.avatar || ""}
                    alt={user.full_name || ""}
                    className="rounded-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e: any) => handleFileChange(e);
                      document.body.appendChild(input);
                      setTimeout(() => {
                        input.click();
                      }, 0);

                      setTimeout(() => {
                        document.body.removeChild(input);
                      }, 1000);
                    }}
                    disabled={isAvatarUploading}
                    className="text-xs border px-2 py-1 rounded-md text-muted-foreground hover:bg-muted/50 transition-all duration-300 focus:ring-2 focus:ring-muted"
                  >
                    {isAvatarUploading ? (
                      <Loader2
                        className="animate-spin mx-[14.5px] my-[1px]"
                        size={14}
                      />
                    ) : (
                      "Upload"
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground w-full">
                    Recommended size 1:1, max 5MB
                  </p>
                </div>
              </div>

              {/* Name Input */}
              <div className="flex gap-2 mt-8">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="first_name" className="text-[13px]">
                    First name
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="px-3 py-2 w-full text-sm border rounded-md bg-background/40 hover:border-ring/30 focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring/30 duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="last_name" className="text-[13px]">
                    Last name
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="px-3 py-2 w-full text-sm border rounded-md bg-background/40 hover:border-ring/30 focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring/30 duration-300"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={isAvatarUploading}
                  className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || isAvatarUploading || !hasChanges}
                  className="px-3 py-1.5 text-[13px] text-white bg-purple-800 rounded-md hover:bg-purple-900 transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-2" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BasicProfileInfo;
