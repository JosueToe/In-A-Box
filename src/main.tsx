import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { TempoDevtools } from "tempo-devtools";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_cG9saXRlLWdlbGRpbmctNDQuY2xlcmsuYWNjb3VudHMuZGV2JA";
const basename = import.meta.env.BASE_URL;

TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      navigate={(to) => (window.location.href = to)}
      appearance={{
        baseTheme: "dark",
        layout: {
          socialButtonsVariant: "iconButton",
          socialButtonsPlacement: "top",
        },
        elements: {
          card: "bg-[#111827] text-white border border-white/10 shadow-xl rounded-xl w-full max-w-md p-6",

          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-white/80",

          formField: "p-0 m-0 w-full border-none shadow-none ring-0",
          formFieldLabel: "text-white text-sm",
          formFieldInput:
            "bg-[#1f2937] text-white placeholder-white/70 border border-gray-600 focus:border-purple-500 focus:ring-purple-500",

          formButtonPrimary:
            "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white",
          socialButtonsBlockButton:
            "bg-[#1f2937] text-white border border-white/20 hover:bg-[#2d3748]",
          socialButtonsBlockButtonText: "text-white",

          footerActionLink: "text-purple-400 hover:text-purple-300",
          alertText: "text-white",
          formFieldHintText: "text-white/70",
          formFieldSuccessText: "text-green-400",
          formFieldErrorText: "text-red-400",

          modalContent: "text-white",
          modalCloseButton: "text-white",

          // ✅ Popover menu text fix
          userButtonPopoverCard:
            "bg-[#1f2937] border border-white/10 shadow-xl",
          userButtonPopoverActionButton: "text-white hover:bg-[#374151]",
          userButtonPopoverActionButtonText: "text-white",
          userButtonPopoverActionButtonIcon: "text-white",
        },
        variables: {
          colorPrimary: "#a855f7",
          colorText: "#ffffff",
          colorBackground: "#111827",
          colorTextSecondary: "#9ca3af",
          colorInputBackground: "#1f2937",
          colorInputText: "#ffffff",
          borderRadius: "0.5rem",
        },
      }}
    >
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
);
