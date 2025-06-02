import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

const SignupModal = ({
  open,
  onOpenChange,
  title = "Create your account",
  description = "Create your free account to unlock your startup tools.",
}: SignupModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900/90 backdrop-blur-lg border border-white/20 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
        <DialogHeader className="text-center">
          <div className="absolute right-4 top-4">
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={() => onOpenChange(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <Rocket className="h-12 w-12 text-white mr-3" />
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-size-200"
              >
                SoloLaunch
              </motion.span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-gray-300 text-center">
            Join thousands of founders who've launched successful startups with
            SoloLaunch.
          </p>
        </div>
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <div className="grid grid-cols-2 gap-3 w-full">
            <SignInButton mode="modal">
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
