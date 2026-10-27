import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project } from "../types";
import { axiosInstance } from "@/configs/axios";

const View = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCode = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/website-project/public/${projectId}`);
      setCode(response.data.code);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching project code:", error);
      setError(error.response?.data?.detail || "Failed to load project");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-400 max-w-md mb-8">{error}</p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      {code ? (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No content available
        </div>
      )}
    </div>
  );
};

export default View;
