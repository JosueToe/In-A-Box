import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import SavedStartups from "./SavedStartups";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("launches");

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
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-300">
                Welcome back, {user?.firstName || "Founder"}!
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {!user?.isPremium && (
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  Upgrade to Pro
                </Button>
              )}
              {user?.isPremium && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-[1px] rounded-md">
                  <div className="bg-indigo-900/50 backdrop-blur-sm px-4 py-2 rounded-md">
                    <span className="text-white font-medium">Pro Member</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-6">
            <Tabs
              defaultValue="launches"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden w-full max-w-md mx-auto">
                <TabsTrigger
                  value="launches"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                >
                  My Launches
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                >
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="launches"
                className="focus-visible:outline-none"
              >
                <SavedStartups />
              </TabsContent>

              <TabsContent
                value="account"
                className="focus-visible:outline-none"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 mb-6">
                    <h3 className="text-xl font-medium text-white mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Email
                        </label>
                        <div className="bg-white/20 backdrop-blur-sm rounded-md px-4 py-2 text-white">
                          {user?.email}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-1">
                            First Name
                          </label>
                          <div className="bg-white/20 backdrop-blur-sm rounded-md px-4 py-2 text-white">
                            {user?.firstName || "Not set"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-1">
                            Last Name
                          </label>
                          <div className="bg-white/20 backdrop-blur-sm rounded-md px-4 py-2 text-white">
                            {user?.lastName || "Not set"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                    <h3 className="text-xl font-medium text-white mb-4">
                      Subscription
                    </h3>
                    {user?.isPremium ? (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                            <span className="text-white font-bold">PRO</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">
                              SoloLaunch Pro
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Active subscription
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          You have full access to all premium features including
                          unlimited generations, pitch decks, viral posts, and
                          saved startups.
                        </p>
                        <Button
                          variant="outline"
                          className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-300 mb-4">
                          Upgrade to SoloLaunch Pro to unlock unlimited
                          generations, pitch decks, viral posts, and saved
                          startups.
                        </p>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                          Upgrade to Pro – $9.99/month
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
