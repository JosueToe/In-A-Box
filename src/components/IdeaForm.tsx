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
import { useUser } from "@clerk/clerk-react";
import AuthModal from "./AuthModal"; // custom popup modal

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
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: "",
      audience: "",
      solution: "",
    },
  });

  useEffect(() => {
    const processPendingData = async () => {
      if (user) {
        const pendingData = sessionStorage.getItem("pendingFormData");
        if (pendingData) {
          try {
            sessionStorage.removeItem("pendingFormData");
            const parsedData = JSON.parse(pendingData);

            const timeoutId = setTimeout(() => {
              form.reset();
              console.warn("Form submission timeout.");
            }, 10000);

            try {
              const result = onSubmit(parsedData);
              if (result instanceof Promise) await result;
            } finally {
              clearTimeout(timeoutId);
              if (form.formState.isSubmitting) form.reset();
            }
          } catch (error) {
            console.error("Error processing pending data:", error);
            if (form.formState.isSubmitting) form.reset();
          }
        }
      }
    };

    processPendingData();
  }, [user, onSubmit, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isSignedIn && !isLoading) {
      sessionStorage.setItem("pendingFormData", JSON.stringify(data));
      setShowAuthModal(true);
      return;
    }

    try {
      const timeoutId = setTimeout(() => {
        if (form.formState.isSubmitting) {
          form.reset();
          console.warn("Submission timeout.");
        }
      }, 10000);

      try {
        const result = onSubmit(data);
        if (result instanceof Promise) await result;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      if (form.formState.isSubmitting) form.reset();
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
                        placeholder="E.g., Solo entrepreneurs and indie hackers..."
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
                        placeholder="E.g., A platform with templates, no-code tools, and guides..."
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
            {!isSignedIn ? (
              <>
                <Button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white px-8 py-2 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Generate My Startup Package
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                className="bg-[linear-gradient(270deg,#8338ec,#ff006e,#3a86ff,#ffbe0b)] animate-gradient-move text-white px-8 py-2 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
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
            )}
          </div>
        </form>
      </Form>

      {/* Custom popup modal for authentication */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSignUp={() => {
          setShowAuthModal(false);
          setTimeout(() => setShowAuthModal(true), 1500);
        }}
      />
    </>
  );
};

export default IdeaForm;
