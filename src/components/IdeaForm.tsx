import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const formSchema = z.object({
  problem: z
    .string()
    .min(10, "Problem description must be at least 10 characters"),
  audience: z.string().min(5, "Target audience must be at least 5 characters"),
  solution: z
    .string()
    .min(10, "Solution description must be at least 10 characters"),
});

interface IdeaFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const IdeaForm = ({ onSubmit = () => {} }: IdeaFormProps) => {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: "",
      audience: "",
      solution: "",
    },
  });

  // Check for pending form data after login
  useEffect(() => {
    if (user) {
      const pendingData = sessionStorage.getItem("pendingFormData");
      if (pendingData) {
        try {
          const parsedData = JSON.parse(pendingData);
          // Submit the pending form data
          const timeoutId = setTimeout(() => {
            // Fallback to clear loading state after 10 seconds
            form.formState.isSubmitting && form.reset();
            console.warn("Form submission timeout: clearing loading state.");
          }, 10000);

          // Submit and clear timeout when done
          onSubmit(parsedData).finally(() => {
            clearTimeout(timeoutId);
            // Clear the pending data
            sessionStorage.removeItem("pendingFormData");
          });
        } catch (error) {
          console.error("Error parsing pending form data:", error);
          sessionStorage.removeItem("pendingFormData");
        }
      }
    }
  }, [user, onSubmit, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user && !isLoading) {
      // Store form data in session storage to retrieve after login
      sessionStorage.setItem("pendingFormData", JSON.stringify(data));
      setShowAuthModal(true);
      return;
    }

    // Set up timeout to clear loading state if submission hangs
    const timeoutId = setTimeout(() => {
      if (form.formState.isSubmitting) {
        form.reset();
        console.warn("Form submission timeout: clearing loading state.");
      }
    }, 10000);

    // Call the onSubmit prop with the form data and clear timeout when done
    try {
      const result = onSubmit(data);
      if (result instanceof Promise) {
        result
          .catch((error) => {
            console.error("Error submitting form:", error);
            form.reset();
          })
          .finally(() => {
            clearTimeout(timeoutId);
          });
      } else {
        // If not a promise, clear the timeout
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      form.reset();
      clearTimeout(timeoutId);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-100">
                      What problem are you solving?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Solo founders struggle to launch SaaS products quickly due to limited resources..."
                        className="min-h-[120px] resize-none bg-white/30 backdrop-blur-sm border-white/40 shadow-md text-white placeholder:text-white/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-100">
                      Who is your target audience?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Solo entrepreneurs and indie hackers looking to launch micro-SaaS products..."
                        className="min-h-[120px] resize-none bg-white/30 backdrop-blur-sm border-white/40 shadow-md text-white placeholder:text-white/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-100">
                      What's your solution?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., A platform that provides pre-built templates, no-code tools, and guided frameworks..."
                        className="min-h-[280px] resize-none bg-white/30 backdrop-blur-sm border-white/40 shadow-md text-white placeholder:text-white/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Generate My Startup Package"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        showSignIn={false}
      />
    </>
  );
};

export default IdeaForm;
