import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./Header";

const PrivacyPolicy = () => {
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
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-200">Last Updated: June 1, 2024</p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-200 mb-4">
              Welcome to SoloLaunch ("we," "our," or "us"). We respect your
              privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              2. Information We Collect
            </h2>
            <p className="text-gray-200 mb-2">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-gray-200 mb-4">
              <li>
                Personal information (name, email address, etc.) when you
                register
              </li>
              <li>Usage data and analytics information</li>
              <li>Information about your startup ideas and submissions</li>
              <li>
                Payment information when you subscribe to premium features
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-200 mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-200 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you updates, notifications, and support messages</li>
              <li>Analyze usage patterns and optimize user experience</li>
              <li>Protect against fraudulent or unauthorized activity</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              4. Data Storage and Security
            </h2>
            <p className="text-gray-200 mb-4">
              We implement appropriate security measures to protect your
              personal information. Your data is stored securely on our servers
              and we use industry-standard encryption to protect sensitive
              information.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              5. Sharing Your Information
            </h2>
            <p className="text-gray-200 mb-4">
              We do not sell your personal information. We may share your
              information with third-party service providers who help us operate
              our business, but only as necessary to provide our services to
              you.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              6. Your Rights
            </h2>
            <p className="text-gray-200 mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-200 mb-4">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>
                Data portability (receiving your data in a structured format)
              </li>
              <li>
                Withdraw consent at any time (where processing is based on
                consent)
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-200 mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6 mb-3">
              8. Contact Us
            </h2>
            <p className="text-gray-200 mb-4">
              If you have any questions about this Privacy Policy, please
              contact us at privacy@sololaunch.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
