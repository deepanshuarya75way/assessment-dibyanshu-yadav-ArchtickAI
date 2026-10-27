import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project, Version } from "../types";
import { axiosInstance } from "@/configs/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const PreviewPage = () => {
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState("");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const fetchCode = async () => {
    if (!projectId) return;
    try {
      const response = await axiosInstance.get(`/website-project/preview/${projectId}`);
      setCode(response.data.project.current_code);
      if (versionId) {
        response.data.project.versions.forEach((version: Version) => {
          if (version.id === versionId) {
            setCode(version.code)
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error.message)
      toast.error(error?.response?.data?.message || error?.message)
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not authenticated, please login");
    } else if (isAuthenticated) {
      fetchCode();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  return (
    <div className="h-screen">
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};

export default PreviewPage;
