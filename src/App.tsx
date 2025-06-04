import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import LoadingState from "./components/LoadingState";
import { AuthProvider } from "./context/AuthContext";
import {
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
} from "@clerk/clerk-react";
import { ToastWrapper } from "./components/ui/toast-wrapper";
import { useAuth } from "./context/AuthContext";

// Lazy-loaded components
const Dashboard = lazy(() => import("./components/Dashboard"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const Pricing = lazy(() => import("./components/Pricing"));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900">
        <LoadingState />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ToastWrapper>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900">
              <LoadingState />
            </div>
          }
        >
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sign-in/*"
                element={
                  <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-6 w-full max-w-md">
                      <ClerkSignIn
                        routing="path"
                        path="/sign-in"
                        redirectUrl="/"
                        signUpUrl="/sign-up"
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "bg-transparent shadow-none",
                            headerTitle: "text-white text-2xl",
                            headerSubtitle: "text-white/80",
                            formButtonPrimary:
                              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                            formFieldLabel: "text-white",
                            formFieldInput:
                              "bg-white/20 border-white/30 text-white",
                            footerActionLink:
                              "text-indigo-400 hover:text-indigo-300",
                          },
                        }}
                      />
                    </div>
                  </div>
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-6 w-full max-w-md">
                      <ClerkSignUp
                        routing="path"
                        path="/sign-up"
                        redirectUrl="/"
                        signInUrl="/sign-in"
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "bg-transparent shadow-none",
                            headerTitle: "text-white text-2xl",
                            headerSubtitle: "text-white/80",
                            formButtonPrimary:
                              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                            formFieldLabel: "text-white",
                            formFieldInput:
                              "bg-white/20 border-white/30 text-white",
                            footerActionLink:
                              "text-indigo-400 hover:text-indigo-300",
                          },
                        }}
                      />
                    </div>
                  </div>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Add this before the catchall route */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </ToastWrapper>
    </AuthProvider>
  );
}

export default App;
