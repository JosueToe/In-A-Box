import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const SignIn = () => {
  // This is a placeholder component that would redirect to Clerk's sign-in page
  // In a real implementation, we would use Clerk's SignIn component

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
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
                <Rocket className="h-12 w-12 text-transparent fill-current stroke-current bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text bg-size-200" />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Sign In to SoloLaunch
          </h1>
          <p className="text-gray-300">Welcome back! Sign in to continue.</p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-300 py-8">
            This is a placeholder for Clerk's sign-in component.
            <br />
            In a real implementation, Clerk would handle authentication.
          </p>

          <div className="flex justify-center">
            <Link to="/">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
