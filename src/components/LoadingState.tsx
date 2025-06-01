import React from "react";
import RocketLoader from "./RocketLoader";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <RocketLoader />
    </div>
  );
};

export default LoadingState;
