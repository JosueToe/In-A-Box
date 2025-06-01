import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Copy, Download, Share2, Lock, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PaywallModal from "./PaywallModal";
import AuthModal from "./AuthModal";
import { saveStartupIdea } from "../lib/auth";

interface ResultsDisplayProps {
  results: {
    names: string[];
    pitch: string;
    pitchDeck: {
      problem: string;
      solution: string;
      market: string;
      monetization: string;
    };
  } | null;
  viralPosts: string;
  formData: {
    problem: string;
    audience: string;
    solution: string;
  };
}

const ResultsDisplay = ({
  results = null,
  viralPosts = "",
  formData,
}: ResultsDisplayProps) => {
  const { user, isLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState("names");
  const [copiedText, setCopiedText] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState("");
  const [savedToAccount, setSavedToAccount] = useState(false);

  // Check for pending startup idea data after login
  useEffect(() => {
    if (user && results) {
      const pendingIdea = sessionStorage.getItem("pendingStartupIdea");
      if (pendingIdea) {
        try {
          // Clear the pending data first to avoid loops
          sessionStorage.removeItem("pendingStartupIdea");

          // If we have results and the user just logged in, try to save the idea
          if (user.isPremium) {
            handleSaveToAccount();
          }
        } catch (error) {
          console.error("Error handling pending startup idea:", error);
        }
      }

      // Check for pending tab change
      const pendingTabChange = sessionStorage.getItem("pendingTabChange");
      if (pendingTabChange) {
        sessionStorage.removeItem("pendingTabChange");
        handleTabChange(pendingTabChange);
      }
    }
  }, [user, results]);

  if (!results) {
    return null;
  }

  const isPremiumUser = user?.isPremium === true;

  const handleTabChange = (value: string) => {
    // Free users can only access Names and Pitch tabs
    if (!user) {
      // Store the tab they were trying to access
      sessionStorage.setItem("pendingTabChange", value);
      setShowAuthModal(true);
      return;
    }

    // Lock premium features for free users
    if (!isPremiumUser && (value === "pitchDeck" || value === "viralPosts")) {
      setPremiumFeature(
        value === "pitchDeck" ? "Mini Pitch Deck" : "Viral Posts",
      );
      setShowPaywallModal(true);
      return;
    }

    setActiveTab(value);
  };

  // Check if user is allowed to regenerate content
  const canRegenerate = isPremiumUser;

  // Add tooltip for locked features
  const renderTooltip = (content) => {
    return (
      <div className="group relative inline-block">
        {content}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Unlock with SoloLaunch Pro to access this feature
        </div>
      </div>
    );
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(section);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const downloadAsText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToAccount = async () => {
    if (!user) {
      // Store the current results in session storage to save after login
      sessionStorage.setItem(
        "pendingStartupIdea",
        JSON.stringify({
          formData,
          results,
          viralPosts,
        }),
      );
      setShowAuthModal(true);
      return;
    }

    if (!isPremiumUser) {
      setPremiumFeature("Save to Account");
      setShowPaywallModal(true);
      return;
    }

    try {
      await saveStartupIdea({
        userId: user.id,
        problem: formData.problem,
        audience: formData.audience,
        solution: formData.solution,
        names: results.names,
        pitch: results.pitch,
        pitchDeck: results.pitchDeck,
        viralPosts: viralPosts,
      });
      setSavedToAccount(true);
      setTimeout(() => setSavedToAccount(false), 3000);
    } catch (error) {
      console.error("Error saving startup idea:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-8 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden">
            <TabsTrigger
              value="names"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
            >
              Names
            </TabsTrigger>
            <TabsTrigger
              value="pitch"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
            >
              Pitch
            </TabsTrigger>
            <TabsTrigger
              value="pitchDeck"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white group"
            >
              {!isPremiumUser
                ? renderTooltip(
                    <>
                      <Lock className="h-3 w-3 mr-1 inline-block group-hover:text-white" />
                      Mini Pitch Deck
                    </>,
                  )
                : "Mini Pitch Deck"}
            </TabsTrigger>
            <TabsTrigger
              value="viralPosts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white group"
            >
              {!isPremiumUser
                ? renderTooltip(
                    <>
                      <Lock className="h-3 w-3 mr-1 inline-block group-hover:text-white" />
                      Viral Posts
                    </>,
                  )
                : "Viral Posts"}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="names">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {results.names.map((name, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full bg-white/20 backdrop-blur-sm border-white/30 shadow-lg rounded-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-center text-white">
                          {name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(name, `name-${index}`)}
                          className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedText === `name-${index}` ? "Copied!" : "Copy"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="pitch">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg rounded-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Elevator Pitch
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        A concise explanation of your startup idea
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium mb-6 text-white">
                        {results.pitch}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(results.pitch, "elevator-pitch")
                          }
                          className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedText === "elevator-pitch" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadAsText(
                              results.pitch,
                              "startup-elevator-pitch.txt",
                            )
                          }
                          className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        {canRegenerate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="pitchDeck">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {Object.entries(results.pitchDeck).map(
                  ([key, value], index) => (
                    <motion.div key={key} variants={itemVariants}>
                      <Card className="h-full bg-white/20 backdrop-blur-sm border-white/30 shadow-lg rounded-xl overflow-hidden">
                        <CardHeader>
                          <CardTitle className="capitalize text-white">
                            {key}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-white">{value}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(value, `deck-${key}`)
                            }
                            className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                          >
                            <Copy className="h-4 w-4" />
                            {copiedText === `deck-${key}` ? "Copied!" : "Copy"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ),
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="viralPosts">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg rounded-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Viral Social Media Posts
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        Ready-to-use content for your launch
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {viralPosts ? (
                        <>
                          <div className="whitespace-pre-line mb-6 text-white">
                            {viralPosts}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(viralPosts, "viral-posts")
                              }
                              className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                            >
                              <Copy className="h-4 w-4" />
                              {copiedText === "viral-posts"
                                ? "Copied!"
                                : "Copy"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                downloadAsText(
                                  viralPosts,
                                  "startup-viral-posts.txt",
                                )
                              }
                              className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 bg-white/30 border-white/40 text-white hover:bg-white/50"
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-white/70 italic">
                          No viral posts generated yet. This feature requires
                          the edge function to be working properly.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Save to account button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSaveToAccount}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8"
            disabled={savedToAccount}
          >
            {savedToAccount ? "Saved to Your Account!" : "Save to My Launches"}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        showSignIn={false}
      />

      <PaywallModal
        open={showPaywallModal}
        onOpenChange={setShowPaywallModal}
        onUpgrade={login}
        feature={premiumFeature}
      />
    </>
  );
};

export default ResultsDisplay;
