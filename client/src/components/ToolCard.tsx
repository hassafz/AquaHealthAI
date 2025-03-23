import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface ToolCardProps {
  type: "algae" | "fish";
  title: string;
  description: string;
  onSelect: (type: "algae" | "fish") => void;
}

export function ToolCard({ type, title, description, onSelect }: ToolCardProps) {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate images when component mounts
    const generateImage = async () => {
      try {
        setIsLoading(true);
        const endpoint = type === "algae" 
          ? "/api/generate-aquascape-image" 
          : "/api/generate-fish-image";
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success && data.path) {
          setImagePath(data.path);
        } else {
          console.error("Failed to generate image:", data.error);
        }
      } catch (error) {
        console.error(`Error generating ${type} image:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [type]);

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`h-48 flex items-center justify-center relative overflow-hidden
          ${type === "algae" 
            ? "bg-gradient-to-r from-green-600 to-teal-500" 
            : "bg-gradient-to-r from-blue-600 to-indigo-500"}`}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          ) : imagePath ? (
            <div className="absolute inset-0">
              <img 
                src={imagePath} 
                alt={type === "algae" ? "Aquascape" : "Fish"} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
          ) : (
            type === "algae" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-16 w-16 text-white"
              >
                <path d="M17 8c.7 0 1.3.5 1.4 1.2.5.2 1 .5 1.3.9.6.8.8 1.8.3 2.5-.2.3-.8.3-.7.8s.7.8.3 1.4c-.4.5-1.1.6-1.7.5-.2.4-.5.7-.8.9-.3 1.7-2.1 1.3-2.5.5-1.3-.3-2.3-1.7-2.5-2.7h-1c-.2 1-1.2 2.4-2.5 2.7-.4.8-2.2 1.2-2.5-.5-.3-.2-.6-.5-.8-.9-.6.1-1.3 0-1.7-.5-.4-.6 0-1.4.3-1.4.1-.5-.5-.5-.7-.8-.5-.8-.3-1.7.3-2.5.3-.4.8-.7 1.3-.9.1-.7.7-1.2 1.4-1.2.7-.8 1.6-1 2.3-.6.1-.6.5-1.3 1.2-1.5.8-.5 1.8-.1 2.3.2.5-.3 1.5-.7 2.3-.2.7.2 1.1.9 1.2 1.5.7-.4 1.6-.2 2.3.6Z" />
                <path d="M7 20v-3" />
                <path d="M12 17v3" />
                <path d="M17 20v-3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-16 w-16 text-white"
              >
                <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6" />
                <path d="M21 12c-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6" />
                <path d="M12 10v4" />
                <path d="M12 14s.5 2 2 2c1.5 0 2-2 2-2" />
                <path d="M5 18s-.5.5-1.5.5" />
                <path d="M2 18c.5-1.5 1.5-2 1.5-2" />
                <path d="M3 22c1-1 2.5-1 2.5-1" />
              </svg>
            )
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        <Button
          className="w-full"
          onClick={() => onSelect(type)}
        >
          {type === "algae" ? "Detect Algae" : "Fish Health Check"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 ml-2"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </motion.div>
  );
}
