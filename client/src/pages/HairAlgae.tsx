import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function HairAlgae() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticleContent() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/hair-algae-article");
        const data = await response.json();

        if (data.success && data.content) {
          setContent(data.content);
        } else {
          setError(data.error || "Failed to load article content");
        }
      } catch (error) {
        setError("An error occurred while fetching the article");
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticleContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <main className="flex-grow">
        {isLoading ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-5/6 mb-3" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-5/6 mb-3" />
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-5/6 mb-3" />
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error Loading Article
            </h1>
            <p className="mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </main>

      <Footer />
    </div>
  );
}