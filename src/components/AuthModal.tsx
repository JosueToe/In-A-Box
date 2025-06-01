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
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp?: () => void;
  showSignIn?: boolean;
}

const AuthModal = ({
  open,
  onOpenChange,
  onSignUp,
  showSignIn = false,
}: AuthModalProps) => {
  const navigate = useNavigate();

  const handleAuth = (type: "sign-in" | "sign-up") => {
    onOpenChange(false);
    navigate(`/${type}`);
  };

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
            {showSignIn ? "Welcome back!" : "Create your free account"}
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            {showSignIn
              ? "Sign in to continue using SoloLaunch and access your saved ideas."
              : "Create your free SoloLaunch account to get started and unlock your first startup idea!"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-gray-300 text-center">
            {showSignIn
              ? "Access all your saved startup ideas and premium features."
              : "Join thousands of founders who've launched successful startups with SoloLaunch."}
          </p>
        </div>
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          {showSignIn ? (
            <>
              <Button
                onClick={() => handleAuth("sign-in")}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Sign In
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Don't have an account?{" "}
                <button
                  onClick={() => handleAuth("sign-up")}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleAuth("sign-up")}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Sign Up for Free
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Already have an account?{" "}
                <button
                  onClick={() => handleAuth("sign-in")}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Sign In
                </button>
              </p>
              <p className="text-xs text-center text-gray-400 mt-2">
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
