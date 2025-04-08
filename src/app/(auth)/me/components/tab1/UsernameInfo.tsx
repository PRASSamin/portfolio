"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types";
import { debounce } from "@/utils/debounce";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const UsernameInfo = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const hasChanges = username !== user.username;
  const { updateUser, reloadSession, isUsernameAvailable } = useUser();

  const checkAvailability = debounce(async (value: string) => {
    try {
      const result = await isUsernameAvailable(value);
      setIsAvailable(result);
    } catch (error) {
      console.error("Username availability check failed:", error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
      setUsername(value);
    }
  }, 1000);

  const handleSubmit = async () => {
    if (!hasChanges || !isAvailable) return;

    try {
      setIsLoading(true);
      await updateUser({ username });
      await reloadSession();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-id="username-info" className="mt-4 mb-8">
      <h2 className="text-sm font-bold">Username</h2>

      <AnimatePresence mode="wait">
        {!isEditing && (
          <motion.div
            key="username-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mt-4 px-2"
          >
            <span className="w-full text-sm">{user.username}</span>
            <div className="w-full flex items-center justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-[13px] text-purple-600 rounded-md hover:bg-muted-foreground/5 focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-300"
              >
                Update username
              </button>
            </div>
          </motion.div>
        )}

        {isEditing && (
          <motion.div
            key="username-edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 w-full border p-4 rounded-md bg-card/30"
          >
            <h3 className="text-sm font-bold">Update username</h3>
            <div className="flex flex-col mt-6">
              {/* Input */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="username" className="text-[13px]">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    defaultValue={username}
                    onChange={(e) => {
                      setIsChecking(true);
                      checkAvailability(e.target.value.trim());
                    }}
                    className="px-3 py-2 w-full text-sm border rounded-md bg-background/40 hover:border-ring/30 focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:border-ring/30 duration-300"
                  />
                  <div className="text-xs mt-1 min-h-[1rem]">
                    {isChecking && (
                      <span className="text-muted-foreground gap-1 flex items-center">
                        <Loader2 className="animate-spin -mt-0.5" size={12} />{" "}
                        Checking
                      </span>
                    )}
                    {isAvailable === false && !isChecking && (
                      <span className="text-red-500">Username is taken</span>
                    )}
                    {isAvailable === true && !isChecking && (
                      <span className="text-green-500">
                        Username is available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading || isChecking}
                  className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    !hasChanges ||
                    isChecking ||
                    isAvailable !== true
                  }
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

export default UsernameInfo