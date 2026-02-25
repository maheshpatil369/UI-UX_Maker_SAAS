import { themeToCssVars, THEMES } from "@/data/Themes";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { GripVertical } from "lucide-react";
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Rnd } from "react-rnd";
import ScreenHandler from "./ScreenHandler";
import html2canvas from "html2canvas";

/* ================= REF TYPE ================= */
export type ScreenFrameRef = {
  getIframe: () => HTMLIFrameElement | null;
};

/* ================= PROPS ================= */
type Props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void;
  width: number;
  height: number;
  htmlCode: string | undefined;
  projectDetail: ProjectType | undefined;
  panningEnabled: boolean;
  screen: ScreenConfigType;
};

/* ================= COMPONENT ================= */
const ScreenFrame = forwardRef<ScreenFrameRef, Props>(
  (
    {
      x,
      y,
      width,
      height,
      setPanningEnabled,
      htmlCode,
      projectDetail,
      panningEnabled,
      screen,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    /* expose iframe to parent (Canvas) */
    useImperativeHandle(ref, () => ({
      getIframe: () => iframeRef.current,
    }));

    const safeHtmlCode = typeof htmlCode === "string" ? htmlCode : "";
    const isGenerated = safeHtmlCode.trim() !== "";

    /* ================= DOWNLOAD SCREENSHOT ================= */
    const takeIframeScreenshot = async () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const doc = iframe.contentDocument;
        if (!doc || !doc.body) return;

        // wait for layout stability
        await new Promise((res) => requestAnimationFrame(res));

        const canvas = await html2canvas(doc.body, {
          backgroundColor: null,
          useCORS: true,
          scale: window.devicePixelRatio || 1,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${screen.screenName || "screen"}.png`;
        link.click();
      } catch (err) {
        console.error("Screenshot failed:", err);
      }
    };

    const themeCss = projectDetail?.theme
      ? themeToCssVars(THEMES[projectDetail.theme])
      : "";
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>

  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

  <style>
    ${themeCss}
  </style>
</head>

<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
${
  safeHtmlCode.trim()
    ? safeHtmlCode
    : `<div class="h-full flex items-center justify-center text-sm opacity-60">
       Processing....
       </div>`
}

</body>
</html>
`;

  return (
    <Rnd
      default={{ x, y, width, height }}
      dragHandleClassName="drag-handle"
      enableResizing={{
        bottomRight: true,
        bottomLeft: true,
      }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={() => setPanningEnabled(true)}
    >
      {/* Container with conditional pointer events */}
      <div className="w-full h-full flex flex-col shadow-lg border rounded-lg overflow-hidden bg-white">

 <div className="drag-handle flex items-center justify-between bg-gray-50 border-b p-2">
  {/* LEFT: screen info */}
  <div className="flex items-center gap-2">
    <GripVertical className="text-gray-400 h-4 w-4" />

    <span className="text-xs font-semibold text-gray-600 uppercase">
      {projectDetail?.device === "mobile" ? "Mobile Screen" : "Website Screen"}
    </span>

    <span className="text-xs text-gray-400">
      {screen.screenName}
    </span>
  </div>

  {/* RIGHT: actions (ALWAYS visible) */}
  <ScreenHandler
    screen={screen}
    onDownload={takeIframeScreenshot}
  />
</div>

        {/* Iframe */}
    <iframe
  ref={iframeRef}
  className={`w-full h-[calc(100%-72px)] bg-white transition-opacity ${
    !panningEnabled ? "pointer-events-none" : "pointer-events-auto"
  }`}
  sandbox="allow-same-origin allow-scripts"
  srcDoc={html}
/>
        {/* Footer status indicator */}
        <div className={`h-[32px] w-full border-t flex items-center px-3 justify-between ${isGenerated ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isGenerated ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            <span className={`text-[10px] font-bold uppercase ${isGenerated ? 'text-green-700' : 'text-red-700'}`}>
              {isGenerated ? "Generation Complete" : "Wait... AI Generating"}
            </span>
          </div>
          
          {!isGenerated && (
            <span className="text-[9px] text-red-400 font-medium animate-bounce">
              Processing...
            </span>
          )}
        </div>

      </div>
    </Rnd>
  );
});

export default ScreenFrame;
