import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Check, Loader2, X } from "lucide-react";
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
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/auth";
import AuthModal from "./AuthModal";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const { user } = useAuth();
  const { isSignedIn } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubscribe = async () => {
    // Check if user is signed in with Clerk first
    if (!isSignedIn) {
      // Store that the user wanted to upgrade
      sessionStorage.setItem("pendingUpgrade", "true");
      setShowAuthModal(true);
      return;
    }

    // If signed in but user data not loaded yet, wait
    if (!user) {
      console.log("User signed in but data not loaded yet");
      return;
    }

    setIsProcessing(true);
    try {
      // Create a checkout session using our edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create_stripe_checkout",
        {
          body: {
            email: user.email,
            successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/pricing`,
          },
        },
      );

      if (error || !data.success) {
        console.error("Error creating checkout session:", error || data.error);
        alert("Failed to create checkout session. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout - don't reset processing state as we're redirecting
      window.location.href = data.data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        showSignIn={false}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-gray-900/95 backdrop-blur-lg border border-white/20 shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg">
          <DialogHeader className="text-center relative">
            <button
              className="absolute right-0 top-0 text-white/60 hover:text-white transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </button>
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
            <DialogTitle className="text-3xl font-bold text-white mb-2">
              SoloLaunch Pro
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg">
              Everything you need to launch your startup successfully
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-end justify-center mb-2">
                <span className="text-5xl font-bold text-white">$9.99</span>
                <span className="text-gray-300 ml-2 mb-2">/month</span>
              </div>
              <p className="text-sm text-gray-400">
                Billed monthly • Cancel anytime
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-6">
              <h3 className="font-semibold text-white mb-4 text-center">
                What's included:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Unlimited startup name generations
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Advanced elevator pitch creation
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Complete mini pitch deck generation
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Viral social media post ideas
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Save unlimited startup packages
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Access to "My Launches" dashboard
                  </span>
                </li>
              </ul>
            </div>

            {/* Billing cycle info */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300 text-center">
                <strong className="text-white">Monthly Billing:</strong> You'll
                be charged $9.99 every month. Cancel anytime from your dashboard
                with no long-term commitment.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating checkout session...
                </>
              ) : (
                "Subscribe Now - $9.99/month"
              )}
            </Button>
            <p className="text-xs text-center text-gray-400">
              Secure payment powered by Stripe • 30-day money-back guarantee
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionModal;
