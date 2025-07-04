import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser, UserButton, useClerk } from "@clerk/clerk-react";
import AuthModal from "./AuthModal";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => navigate("/dashboard");
  const handleSubscribeClick = () =>
    user ? handleDashboardClick() : navigate("/pricing");

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/20 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            animate={{
              y: [0, -5, 0],
              filter: [
                "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                "drop-shadow(0 0 8px rgba(255,255,255,0.8))",
                "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="h-8 w-8 text-white" />
          </motion.div>
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="text-xl font-bold bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] bg-[length:400%_400%] animate-gradient-move text-transparent bg-clip-text"
          >
            SoloLaunch
          </motion.span>
        </Link>

        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDashboardClick}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    filter: [
                      "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                      "drop-shadow(0 0 8px rgba(255,255,255,0.8))",
                      "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Rocket className="h-6 w-6 text-white" />
                </motion.div>
                <span className="text-white font-medium">Dashboard</span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Sign In / Sign Up
              </Button>
              <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                onSignUp={() => {
                  setShowAuthModal(false);
                  setTimeout(() => setShowAuthModal(true), 1500);
                }}
              />
            </>
          )}
          <Button
            onClick={user ? handleDashboardClick : handleSubscribeClick}
            className="bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white px-5 py-2 rounded-md shadow-md transition-all"
          >
            {user ? "Dashboard" : "Subscribe"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
