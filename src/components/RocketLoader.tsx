import React from "react";
import { motion } from "framer-motion";

const RocketLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md rounded-xl w-full h-full min-h-[300px]">
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative h-40 w-40 flex items-center justify-center">
          {/* Launchpad */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-700 rounded-full"></div>

          {/* Rocket */}
          <motion.div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [-5, -15, -5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              {/* Rocket Body */}
              <div className="w-8 h-16 bg-gradient-to-b from-white to-gray-200 rounded-t-full"></div>

              {/* Rocket Window */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-blue-600"></div>

              {/* Rocket Fins */}
              <div className="absolute bottom-0 -left-2 w-3 h-6 bg-gradient-to-r from-red-600 to-red-400 rounded-l-full"></div>
              <div className="absolute bottom-0 -right-2 w-3 h-6 bg-gradient-to-l from-red-600 to-red-400 rounded-r-full"></div>

              {/* Rocket Bottom */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-700 rounded-full"></div>

              {/* Thruster Fire */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                animate={{
                  height: [10, 25, 10],
                  width: [8, 12, 8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-orange-600 via-orange-500 to-yellow-400 rounded-b-lg"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="mt-6 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-lg font-medium text-white">Launching your idea...</p>
        <p className="text-sm text-white/70 mt-1">
          This may take a few moments
        </p>
      </motion.div>
    </div>
  );
};

export default RocketLoader;
