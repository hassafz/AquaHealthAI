import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlgaeAnalysisResponse, FishHealthResponse } from "@shared/schema";

interface ToolInterfaceProps {
  toolType: "algae" | "fish" | null;
  onClose: () => void;
}

export function ToolInterface({ toolType, onClose }: ToolInterfaceProps) {
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<
    | { type: "algae"; data: AlgaeAnalysisResponse }
    | { type: "fish"; data: FishHealthResponse }
    | null
  >(null);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploadComplete(true);
    setResult(null);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploadComplete(false);
    setResult(null);
  };

  // Handle analysis
  const handleAnalyze = async () => {
    if (!selectedFile || !toolType) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const endpoint =
        toolType === "algae" ? "/api/analyze-algae" : "/api/analyze-fish";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();

      setResult({
        type: toolType,
        data: data.result,
      });

      toast({
        title: "Analysis Complete",
        description: "Your image has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Conditional icon and title based on tool type
  const toolInfo = {
    algae: {
      title: "Algae Identifier",
      description: "Upload a clear photo of your tank to identify algae",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M17 8c.7 0 1.3.5 1.4 1.2.5.2 1 .5 1.3.9.6.8.8 1.8.3 2.5-.2.3-.8.3-.7.8s.7.8.3 1.4c-.4.5-1.1.6-1.7.5-.2.4-.5.7-.8.9-.3 1.7-2.1 1.3-2.5.5-1.3-.3-2.3-1.7-2.5-2.7h-1c-.2 1-1.2 2.4-2.5 2.7-.4.8-2.2 1.2-2.5-.5-.3-.2-.6-.5-.8-.9-.6.1-1.3 0-1.7-.5-.4-.6 0-1.4.3-1.4.1-.5-.5-.5-.7-.8-.5-.8-.3-1.7.3-2.5.3-.4.8-.7 1.3-.9.1-.7.7-1.2 1.4-1.2.7-.8 1.6-1 2.3-.6.1-.6.5-1.3 1.2-1.5.8-.5 1.8-.1 2.3.2.5-.3 1.5-.7 2.3-.2.7.2 1.1.9 1.2 1.5.7-.4 1.6-.2 2.3.6Z" />
          <path d="M7 20v-3" />
          <path d="M12 17v3" />
          <path d="M17 20v-3" />
        </svg>
      ),
      tips: [
        "Ensure the image is clear and well-lit",
        "Focus on the area with visible algae growth",
        "Avoid reflections and glare on the tank glass",
        "Include surrounding plants/hardscape for context",
      ],
    },
    fish: {
      title: "Fish Health Analyzer",
      description: "Upload a clear photo of your fish to diagnose health issues",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6" />
          <path d="M21 12c-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6" />
          <path d="M12 10v4" />
          <path d="M12 14s.5 2 2 2c1.5 0 2-2 2-2" />
          <path d="M5 18s-.5.5-1.5.5" />
          <path d="M2 18c.5-1.5 1.5-2 1.5-2" />
          <path d="M3 22c1-1 2.5-1 2.5-1" />
        </svg>
      ),
      tips: [
        "Ensure the fish is clearly visible in the frame",
        "Take photos from multiple angles if possible",
        "Use good lighting to capture true colors",
        "Avoid using flash as it can distort appearance",
      ],
    },
  };

  // Get the current tool info
  const currentTool = toolType ? toolInfo[toolType] : null;

  return (
    <AnimatePresence>
      {toolType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden mb-16"
        >
          <div className="p-6">
            {/* Tool Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white mr-4">
                  {currentTool?.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {currentTool?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentTool?.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>

            {/* Tool Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Upload section */}
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Upload Image
                  </h4>
                  
                  {!isUploadComplete ? (
                    <Dropzone onFileAccepted={handleFileAccepted} />
                  ) : (
                    <div className="relative">
                      <img
                        src={previewUrl!}
                        alt="Preview"
                        className="w-full h-64 object-contain border rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full w-8 h-8"
                        onClick={handleRemoveImage}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>

                {isUploadComplete && !result && (
                  <Button
                    className="w-full mb-6"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Image
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
                          <path d="m8 12 4 4 4-4" />
                          <path d="M12 4v12" />
                          <path d="M20 20H4" />
                        </svg>
                      </>
                    )}
                  </Button>
                )}

                {!result && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                      For Best Results:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                      {currentTool?.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right column - Results section */}
              <div>
                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 border-4 border-primary-lighter rounded-full"></div>
                      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Analyzing your image...
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our AI is carefully analyzing your image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      This may take up to 30 seconds
                    </p>
                  </div>
                )}

                {result && result.type === "algae" && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                      Algae Analysis Results
                    </h4>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-primary dark:text-primary-light">
                            {result.data.algae_type.common_name}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {result.data.algae_type.scientific_name}
                          </p>
                        </div>
                        <div className="bg-primary-light text-white text-sm px-2 py-1 rounded-full">
                          {result.data.confidence}% confident
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Description
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.description}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Causes
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.causes}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Identification Details
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.identification_details}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-lg p-4">
                      <h5 className="font-medium text-primary dark:text-primary-light mb-2">
                        2-Week Treatment Plan
                      </h5>
                      <ol className="list-decimal pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                        {result.data.treatment_plan.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {result && result.type === "fish" && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                      Fish Health Analysis Results
                    </h4>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-primary dark:text-primary-light">
                            {result.data.disease.common_name}
                          </h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {result.data.disease.scientific_name}
                          </p>
                        </div>
                        <div className="bg-primary-light text-white text-sm px-2 py-1 rounded-full">
                          {result.data.confidence}% confident
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Visible Symptoms
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.symptoms}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Likely Causes
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.causes}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Diagnosis Details
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {result.data.diagnosis_details}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-lg p-4">
                      <h5 className="font-medium text-primary dark:text-primary-light mb-2">
                        Treatment Recommendations
                      </h5>
                      <ol className="list-decimal pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                        {result.data.treatment_plan.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {!isAnalyzing && !result && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-16 w-16 mb-4"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                      <path d="M12 9v1" />
                      <path d="M12 22v-1" />
                    </svg>
                    <h4 className="text-xl font-medium text-center">
                      Upload an image to see analysis results
                    </h4>
                    <p className="text-center mt-2">
                      Our AI will provide detailed identification and treatment
                      recommendations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
