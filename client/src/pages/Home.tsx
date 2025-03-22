import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolCard } from "@/components/ToolCard";
import { ToolInterface } from "@/components/ToolInterface";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<"algae" | "fish" | null>(null);

  const handleToolSelect = (tool: "algae" | "fish") => {
    setSelectedTool(tool);
    
    // Smooth scroll to tool interface
    setTimeout(() => {
      document.getElementById("tool-interface")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleToolClose = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ToolCard
            type="algae"
            title="Algae Analyzer"
            description="Upload a photo of your tank to identify algae issues and get a customized treatment plan."
            onSelect={handleToolSelect}
          />

          <ToolCard
            type="fish"
            title="Fish Health Analyzer"
            description="Upload a clear photo of your fish to diagnose potential health issues and treatment options."
            onSelect={handleToolSelect}
          />
        </div>

        {/* Tool Interface */}
        <div id="tool-interface">
          <ToolInterface toolType={selectedTool} onClose={handleToolClose} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
