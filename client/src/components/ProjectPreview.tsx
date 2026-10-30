import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Project } from "../types";
import { iframeScript } from "../assets/assets";
import EditorPanel from "./EditorPanel";

interface ProjectPreviewProps {
  project: Project;
  isGenerating: boolean;
  device?: "phone" | "tablet" | "desktop";
  showEditorPanel?: boolean;
}

export interface ProjectPreviewReference {
  getcode: () => string | undefined;
}

const ProjectPreview = forwardRef<ProjectPreviewReference, ProjectPreviewProps>(
  (
    { project, isGenerating, device = "desktop", showEditorPanel = true },
    ref,
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedElement, setSelectedElement] = useState<any>(null);
    useImperativeHandle(ref, () => ({
      getcode: () => {
        const docinfo = iframeRef.current?.contentDocument;
        if (!docinfo) {
          return undefined;
        }
        // 1. Remove our selection class / attributes / outline from all elements
        docinfo
          .querySelectorAll(".ai-selected-element,[data-ai-selected]")
          .forEach((el) => {
            el.classList.remove("ai-selected-element");
            el.removeAttribute("data-ai-selected");
            (el as HTMLElement).style.outline = "";
          });

        // 2. Remove injected style + script from the document
        const previewStyle = docinfo.getElementById("ai-preview-style");
        if (previewStyle) {
          previewStyle.remove();
        }
        const previewScript = docinfo.getElementById("ai-preview-script");
        if (previewScript) {
          previewScript.remove();
        }

        // 3. Serialize clean HTML
        const html = docinfo.documentElement.outerHTML
        return html
      },
    }));

    useEffect(() => {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === "ELEMENT_SELECTED") {
          const el = e.data.payload;
          setSelectedElement({
            ...el,
            style: {
              padding: el.style?.padding || "",
              margin: el.style?.margin || "",
              backgroundColor: el.style?.backgroundColor || "rgba(0,0,0,0)",
              color: el.style?.color || "#000000",
              fontSize: el.style?.fontSize || "",
            },
          });
        } else if (e.data.type === "CLEAR_SELECTION") {
          setSelectedElement(null);
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);

    const resolutions = {
      phone: "w-[412px]",
      tablet: "w-[768px]",
      desktop: "w-full",
    };

    const handleUpdate = (updates: any) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "UPDATE_ELEMENT",
            payload: updates,
          },
          "*",
        );
      }
    };

    const injectPreview = (html: string) => {
      if (!html) {
        return "";
      }
      if (!showEditorPanel) {
        return html;
      }
      if (html.includes("</body>")) {
        return html.replace("</body>", iframeScript + "</body>");
      } else {
        return html + iframeScript;
      }
    };
    return (
      <div
        className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden
max-sm: m1-2"
      >
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
            />
            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null);
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      { type: "CLEAR_SELECTION_REQUEST" },
                      "*",
                    );
                  }
                }}
              />
            )}
          </>
        ) : (
          isGenerating && <div>Loading</div>
        )}
      </div>
    );
  },
);

export default ProjectPreview;
