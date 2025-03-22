import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  className?: string;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export function Dropzone({
  onFileAccepted,
  className,
  maxSize = 10 * 1024 * 1024, // 10MB default max size
  acceptedFileTypes = ["image/jpeg", "image/png"],
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setErrorMessage(null);

      const { files } = e.dataTransfer;
      if (files && files.length) {
        validateAndProcessFile(files[0]);
      }
    },
    [onFileAccepted, maxSize, acceptedFileTypes]
  );

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setErrorMessage(`File type not accepted. Please upload: ${acceptedFileTypes.join(", ")}`);
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      setErrorMessage(`File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // File is valid, process it
    onFileAccepted(file);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const { files } = e.target;
    if (files && files.length) {
      validateAndProcessFile(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <motion.div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-64",
          isDragging
            ? "border-primary bg-primary/5 dark:bg-primary/10"
            : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
          className
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 mb-3 rounded-full bg-primary-light/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            JPEG, PNG (MAX. {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes.join(",")}
          onChange={handleChange}
        />
      </motion.div>
      {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
}
