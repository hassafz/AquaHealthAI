import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/queryClient';

export default function GreenWaterAlgae() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticleContent() {
      try {
        setLoading(true);
        const response = await fetch('/api/green-water-algae-article');
        const data = await response.json();

        if (data.success && data.content) {
          setContent(data.content);
        } else {
          setError(data.error || 'Failed to load article content');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('An error occurred while loading the article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticleContent();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <a 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Home
        </a>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}