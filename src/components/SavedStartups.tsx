import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getUserStartupIdeas, deleteStartupIdea } from "../lib/auth";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Copy, Download, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import LoadingState from "./LoadingState";

interface StartupIdea {
  id: string;
  user_id: string;
  problem: string;
  audience: string;
  solution: string;
  names: string[];
  pitch: string;
  pitch_deck: Record<string, string>;
  viral_posts: string;
  created_at: string;
}

const SavedStartups = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<StartupIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedText, setCopiedText] = useState("");

  const fetchStartups = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const ideas = await getUserStartupIdeas(user.id);
      setStartups(ideas);
    } catch (error) {
      console.error("Error fetching startups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStartups();
    }
  }, [user]);

  const handleDelete = async (ideaId: string) => {
    if (!user) return;

    try {
      const success = await deleteStartupIdea(user.id, ideaId);
      if (success) {
        setStartups(startups.filter((startup) => startup.id !== ideaId));
      }
    } catch (error) {
      console.error("Error deleting startup:", error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const downloadAsText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (startups.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-100 mb-4">
          No saved startups yet
        </h3>
        <p className="text-gray-300 mb-6">
          Generate your first startup idea to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <motion.div
          key={startup.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full bg-white/20 backdrop-blur-sm border-white/30 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">
                {startup.names?.[0] || "Unnamed Startup"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/80">
              <p className="line-clamp-3 mb-4">{startup.pitch}</p>
              <div className="text-sm text-white/60">
                <p>
                  <span className="font-medium">Problem:</span>{" "}
                  <span className="line-clamp-2">{startup.problem}</span>
                </p>
                <p className="mt-1">
                  <span className="font-medium">Audience:</span>{" "}
                  <span className="line-clamp-1">{startup.audience}</span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(startup.pitch, `pitch-${startup.id}`)
                }
                className="flex items-center gap-1 bg-white/30 border-white/40 text-white hover:bg-white/50"
              >
                <Copy className="h-3 w-3" />
                {copiedText === `pitch-${startup.id}` ? "Copied!" : "Copy"}
              </Button>

              {startup.pitch_deck && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadAsText(
                      Object.entries(startup.pitch_deck)
                        .map(
                          ([key, value]) => `${key.toUpperCase()}:\n${value}`,
                        )
                        .join("\n\n"),
                      `${startup.names?.[0] || "startup"}-pitch-deck.txt`,
                    )
                  }
                  className="flex items-center gap-1 bg-white/30 border-white/40 text-white hover:bg-white/50"
                >
                  <Download className="h-3 w-3" />
                  Deck
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-white/30 border-white/40 text-white hover:bg-white/50"
              >
                <ExternalLink className="h-3 w-3" />
                View
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-white/30 border-white/40 text-white hover:bg-white/50"
              >
                <RefreshCw className="h-3 w-3" />
                Rename
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(startup.id)}
                className="flex items-center gap-1 bg-white/30 border-white/40 text-white hover:bg-white/50 ml-auto"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SavedStartups;
