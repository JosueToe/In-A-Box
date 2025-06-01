import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Rocket, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useToastNotification } from "./ui/toast-wrapper";
import IdeaForm from "./IdeaForm";
import LoadingState from "./LoadingState";
import ResultsDisplay from "./ResultsDisplay";
import Header from "./Header";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Home = () => {
  const { showToast } = useToastNotification();
  const [formData, setFormData] = useState({
    problem: "",
    audience: "",
    solution: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [viralPosts, setViralPosts] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 150]);
  const y2 = useTransform(scrollY, [0, 800], [0, -200]);
  const y3 = useTransform(scrollY, [0, 800], [0, 100]);
  const y4 = useTransform(scrollY, [0, 800], [0, -80]);
  const y5 = useTransform(scrollY, [0, 800], [0, 180]);
  const y6 = useTransform(scrollY, [0, 800], [0, -120]);

  // Initialize Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  );

  const { user, isLoading: authLoading, login } = useAuth();

  const handleFormSubmit = async (data) => {
    // If user is not authenticated, show auth modal
    if (!user && !authLoading) {
      // Store form data to session storage to use after login
      sessionStorage.setItem("pendingFormData", JSON.stringify(data));
      setShowAuthModal(true);
      return;
    }

    setFormData(data);
    setIsLoading(true);
    setViralPosts("");

    try {
      // Generate viral posts using the edge function
      const startupIdea = `Problem: ${data.problem}\nAudience: ${data.audience}\nSolution: ${data.solution}`;

      // Start the viral posts generation but don't await it yet
      const viralPostsPromise = supabase.functions.invoke(
        "supabase-functions-generate_viral_posts",
        {
          body: { startupIdea },
        },
      );

      // Simulate API call to generate results
      // Mock results - in a real app, this would be an API call
      const mockResults = {
        names: ["SolveStack", "LaunchPad Pro", "MicroFounder"],
        pitch:
          "The all-in-one platform that helps solo founders launch profitable micro-SaaS businesses in weeks, not months.",
        pitchDeck: {
          problem:
            "Solo founders struggle to launch SaaS products quickly due to limited resources, technical barriers, and overwhelming business requirements.",
          solution:
            "MicroSaaS-in-a-Box provides pre-built templates, no-code tools, and guided frameworks to launch a profitable micro-SaaS in record time.",
          market:
            "The global micro-SaaS market is growing at 25% annually, with over 2 million solo entrepreneurs seeking efficient ways to launch software businesses.",
          monetization:
            "Subscription model starting at $29/month with premium tiers for advanced features, API access, and white-labeling capabilities.",
        },
      };

      // Set the results immediately
      setResults(mockResults);

      // Now await the viral posts result
      try {
        const { data: viralPostsData, error } = await viralPostsPromise;

        if (error) {
          console.error("Error generating viral posts:", error);
          showToast({
            title: "Warning",
            description:
              "Generated startup package, but failed to generate viral posts.",
            type: "warning",
          });
        } else if (viralPostsData?.viralPosts) {
          setViralPosts(viralPostsData.viralPosts);
        }
      } catch (viralPostsError) {
        console.error("Error generating viral posts:", viralPostsError);
        // Don't show toast here as we already have the main results
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      showToast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("idea-form").scrollIntoView({ behavior: "smooth" });
  };

  // Testimonial data
  const testimonials = [
    {
      text: "SoloLaunch helped me pitch my idea in one day. Incredible.",
      author: "Alex R.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    {
      text: "I didn't know where to begin until I found this. It's perfect.",
      author: "Mia C.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
    },
    {
      text: "Beautiful UI, smart results. Game-changer for solopreneurs.",
      author: "Diego M.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diego",
    },
  ];

  // Check for pending form data after login
  useEffect(() => {
    if (user && !results && !isLoading) {
      const pendingData = sessionStorage.getItem("pendingFormData");
      if (pendingData) {
        try {
          // Clear the pending data first to avoid loops
          sessionStorage.removeItem("pendingFormData");
          const parsedData = JSON.parse(pendingData);
          handleFormSubmit(parsedData);
        } catch (error) {
          console.error("Error handling pending form data:", error);
        }
      }
    }
  }, [user, results, isLoading]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        showSignIn={false}
      />
      {/* Background Image Collage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-indigo-900/60 to-purple-900/50 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 absolute inset-0 -m-10 scale-125 opacity-80">
          <motion.div style={{ y: y1 }} className="col-span-1 space-y-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80')`,
              }}
            ></motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-80 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="col-span-1 space-y-4 pt-20">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-72 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80')`,
              }}
            ></motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>

          <motion.div style={{ y: y3 }} className="col-span-1 space-y-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-80 bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80')`,
              }}
            ></motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>
        </div>

        {/* Second row with different parallax speeds */}
        <div className="grid grid-cols-3 gap-4 p-4 absolute inset-0 top-[100%] -m-10 scale-125 opacity-80">
          <motion.div style={{ y: y4 }} className="col-span-1 space-y-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-72 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>

          <motion.div style={{ y: y5 }} className="col-span-1 space-y-4 pt-10">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>

          <motion.div style={{ y: y6 }} className="col-span-1 space-y-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden h-80 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80')`,
              }}
            ></motion.div>
          </motion.div>
        </div>

        {/* Fade to background effect */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-900/80 to-transparent z-20"></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center min-h-[80vh] text-center py-24 justify-center relative z-10">
        {/* Animated Banner */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-xl">
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg p-6 flex items-center justify-center">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="relative">
                    <Rocket className="h-16 w-16 relative z-10 text-white" />
                  </div>
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
                  className="text-3xl font-bold ml-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-size-200"
                >
                  SoloLaunch
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-xl md:text-2xl text-gray-100 mb-10 drop-shadow-md">
            Your startup launchpad in a box 🚀
          </p>
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden text-white font-medium py-3 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl flex items-center mx-auto animate-gradient"
            style={{
              background:
                "linear-gradient(90deg, #4f46e5, #9333ea, #ec4899, #4f46e5)",
              backgroundSize: "300% 100%",
            }}
          >
            Launch My Idea
          </motion.button>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 w-full max-w-5xl"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            What Founders Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg flex flex-col items-center text-center"
              >
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white mb-4 italic">"{testimonial.text}"</p>
                <div className="mt-auto flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border-2 border-white/30">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium">
                    {testimonial.author}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={scrollToForm}
        >
          <ArrowDown className="h-8 w-8 text-white cursor-pointer" />
        </motion.div>
      </section>

      {/* Form Section - Smooth Transition */}
      <section
        id="idea-form"
        className="container mx-auto px-4 pt-10 pb-16 relative z-10 mx-4 sm:mx-8 lg:mx-auto max-w-6xl"
      >
        <div className="rounded-xl bg-white/20 backdrop-blur-lg shadow-xl border border-white/30 p-6 transition-all duration-500 transform">
          {!isLoading && !results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-12 text-white">
                Tell us about your startup idea
              </h2>
              <IdeaForm onSubmit={handleFormSubmit} />
            </motion.div>
          )}

          {isLoading && <LoadingState />}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-12 text-white">
                Your AI-Generated Startup Package
              </h2>
              <ResultsDisplay
                results={results}
                viralPosts={viralPosts}
                formData={formData}
              />
              <div className="mt-12 text-center">
                <button
                  onClick={() => {
                    setResults(null);
                    setFormData({
                      problem: "",
                      audience: "",
                      solution: "",
                    });
                  }}
                  className="bg-white/30 hover:bg-white/40 text-white font-medium py-2 px-6 rounded-lg transition-all border border-white/40"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900/60 backdrop-blur-md text-gray-200 pt-4 pb-2 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Column 1: About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h3 className="text-lg font-bold mb-2">About SoloLaunch</h3>
              <p className="text-gray-300 text-sm">
                SoloLaunch empowers solo founders to bring their SaaS ideas to
                life faster. We give you the tools to name, pitch, and launch
                your product — all powered by AI, backed by real startup
                experience. Whether you're just starting or pivoting, SoloLaunch
                accelerates your first step to market.
              </p>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3 flex flex-col items-center"
            >
              <h3 className="text-lg font-bold mb-2">Quick Links</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About Us
                </a>
                <Link
                  to="/terms-of-service"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact
                </a>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </div>
            </motion.div>

            {/* Column 3: Follow Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h3 className="text-lg font-bold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  className="text-gray-300 hover:text-white transition-colors"
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
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  className="text-gray-300 hover:text-white transition-colors"
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
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  className="text-gray-300 hover:text-white transition-colors"
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
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M16 8v8" />
                    <path d="M12 16v-8" />
                    <path d="M20 12V8h-4" />
                    <path d="M16 8a4 4 0 0 0-4-4" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-2">
            <p className="text-center text-gray-400 text-xs">
              © {new Date().getFullYear()} SoloLaunch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
