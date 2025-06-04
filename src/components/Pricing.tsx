import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../lib/auth";
import SubscriptionModal from "./SubscriptionModal";

const Pricing = () => {
  const { user, isLoading, login } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleSubscribe = () => {
    setShowSubscriptionModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get the tools you need to launch your startup idea faster
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-300 ml-2 mb-1">/month</span>
              </div>
              <p className="text-gray-300 mb-6">
                Perfect for trying out SoloLaunch and generating basic startup
                ideas.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">Generate startup names</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">Basic elevator pitch</span>
                </li>
                <li className="flex items-center opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">
                    Mini pitch deck (Pro only)
                  </span>
                </li>
                <li className="flex items-center opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">
                    Viral social posts (Pro only)
                  </span>
                </li>
                <li className="flex items-center opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">
                    Save ideas to account (Pro only)
                  </span>
                </li>
              </ul>
              <Button
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                onClick={() => navigate("/")}
              >
                Start for Free
              </Button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-xl border border-white/30 shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-gray-300 ml-2 mb-1">/month</span>
              </div>
              <p className="text-gray-300 mb-6">
                Everything you need to launch your startup idea successfully.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    Generate unlimited startup names
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">Advanced elevator pitch</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    Complete mini pitch deck
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    Viral social media posts
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    Save unlimited ideas to account
                  </span>
                </li>
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={handleSubscribe}
              >
                Subscribe Now
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12 text-gray-300 max-w-2xl mx-auto">
          <p className="text-sm">
            All plans include access to our AI-powered startup idea generator.
            Pro subscribers get additional features like complete pitch decks,
            viral social posts, and the ability to save unlimited ideas to their
            account.
          </p>
        </div>
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </div>
  );
};

export default Pricing;
