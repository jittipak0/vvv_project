import { useState, useEffect } from "react";
import { Page } from "@/types/api";
import { getPageByTitle } from "@/services/endpoint/content";

export const usePageData = (title: string) => {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await getPageByTitle(title);
        setPageData(response);
      } catch {
        setError("Failed to load page data");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [title]);

  return { pageData, loading, error };
};
