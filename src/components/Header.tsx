import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useClerk, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user, isLoading } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setShowSignIn(false);
    setShowAuthModal(true);
  };

  const handleAuthClick = () => {
    // Show auth modal instead of redirecting
    setShowSignIn(true);
    setShowAuthModal(true);
  };

  const handleSubscribeClick = () => {
    if (user) {
      handleDashboardClick();
    } else {
      navigate("/pricing");
    }
  };

  const handleLogout = async () => {
    await signOut(() => navigate("/"));
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
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
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Rocket className="h-8 w-8 text-white" />
            </motion.div>
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-size-200"
            >
              SoloLaunch
            </motion.span>
          </Link>
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm animate-pulse"></div>
            ) : !user ? (
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleAuthClick}
                  className="border border-white/30 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white shadow-sm flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="inline-block">Sign In / Sign Up</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={handleDashboardClick}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 overflow-hidden">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.firstName || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white text-xs font-medium">
                        {user.firstName ? (
                          user.firstName.charAt(0).toUpperCase()
                        ) : user.email ? (
                          user.email.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-white text-sm hidden md:inline">
                    {user.firstName || user.email.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button
              onClick={user ? handleDashboardClick : handleSubscribeClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {user ? "Dashboard" : "Subscribe"}
            </Button>
          </div>
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        showSignIn={showSignIn}
      />
    </>
  );
};

export default Header;
