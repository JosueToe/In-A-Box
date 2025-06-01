import React from "react";
import { useToast } from "./use-toast";
import { Toaster } from "./toaster";

interface ToastWrapperProps {
  children: React.ReactNode;
}

export const ToastWrapper: React.FC<ToastWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export const useToastNotification = () => {
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    type = "default",
  }: {
    title?: string;
    description: string;
    type?: "default" | "success" | "error" | "warning";
  }) => {
    toast({
      title,
      description,
      variant: type === "error" ? "destructive" : "default",
    });
  };

  return { showToast };
};
