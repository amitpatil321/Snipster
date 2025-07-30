import { Alert } from "components/Alert";
import { Skeleton } from "components/ui/skeleton";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "services/axios.service";

import SnippetDetailsView from "./SnipeptDetails.view";

import type { Snippet } from "types/snippet.types";

const SnippetDetails = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/snippet/details/${id}`);
        const data = res.data?.data?.[0];
        setSnippet(data);
      } catch (err) {
        console.error("Failed to fetch snippet details:", err);
        setSnippet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-4 w-1/3 h-6" />
        <Skeleton className="mb-2 w-1/4 h-4" />
        <Skeleton className="w-full h-48" />
      </div>
    );
  }

  if (!snippet) {
    return (
      <Alert
        type="error"
        title="Snippet not found!"
        description="Please try again."
      />
    );
  }

  return <SnippetDetailsView snippet={snippet} />;
};

export default SnippetDetails;
