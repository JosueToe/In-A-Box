import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAuth } from "../context/AuthContext";
import { SignInButton, useUser } from "@clerk/clerk-react";
import SignupModal from "./SignupModal";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
  feature?: string;
}

const PaywallModal = ({
  open,
  onOpenChange,
  onUpgrade,
  feature = "premium features",
}: PaywallModalProps) => {
  const { user, upgradeUser } = useAuth();
  const { isSignedIn } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleUpgrade = async () => {
    if (!isSignedIn) {
      // Store that the user wanted to upgrade
      sessionStorage.setItem("pendingUpgrade", "true");
      // Show signup modal instead of redirecting
      setShowSignupModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      // In a real implementation, this would open Stripe checkout
      // For now, we'll just simulate upgrading the user
      const success = await upgradeUser(user.id);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error upgrading user:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SignupModal
        open={showSignupModal}
        onOpenChange={setShowSignupModal}
        title="Unlock Premium Features"
        description="Create your account to access premium features and save your startup ideas."
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gray-900/90 backdrop-blur-lg border border-white/20 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-12 w-12 flex items-center justify-center relative z-10"
                >
                  <Rocket className="h-12 w-12 text-white" />
                </motion.div>
              </motion.div>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Unlock {feature}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Get unlimited ideas, custom pitch decks, and social posts — all
              saved to your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <h3 className="font-medium text-white mb-2">
                SoloLaunch Pro includes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    Unlimited startup name generations
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    Complete mini pitch decks
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    Viral social media post ideas
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    Save all your startup packages
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-300">
                    Access to "My Launches" dashboard
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button className="w-full bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white">
                  Sign in to Upgrade
                </Button>
              </SignInButton>
            ) : (
              <Button
                onClick={handleUpgrade}
                className="w-full bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Upgrade to SoloLaunch Pro – $9.99/month</>
                )}
              </Button>
            )}
            <p className="text-xs text-center text-gray-400 mt-2">
              Cancel anytime. No long-term commitment required.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaywallModal;
