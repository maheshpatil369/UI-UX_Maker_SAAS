"use client";

import { ScreenConfigType } from "@/type/types";
import { Code2, Download, Trash2, Copy, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useEffect  } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  onDownload: () => void;
  screen: ScreenConfigType;
};

function ScreenHandler({ screen, onDownload }: Props) {
  const [open, setOpen] = useState(false);
  const code = screen?.code || "";

  const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${screen.screenName || "Generated UI"}</title>

  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    :root {
      --background: #f5f5f5;
      --foreground: #111827;
      --card: #ffffff;
      --muted-foreground: #6b7280;
      --primary: #2563eb;
      --primaryForeground: #ffffff;
    }
  </style>
</head>

<body class="bg-[var(--background)] text-[var(--foreground)]">
${screen.code || ""}
</body>
</html>
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalHtml);
  };


  const codeScrollRef = useRef<HTMLDivElement>(null);
const scrollUp = () => {
  codeScrollRef.current?.scrollBy({
    top: -200,
    behavior: "smooth",
  });
};

const scrollDown = () => {
  codeScrollRef.current?.scrollBy({
    top: 200,
    behavior: "smooth",
  });
};

const scrollLeft = () => {
  codeScrollRef.current?.scrollBy({
    left: -200,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  codeScrollRef.current?.scrollBy({
    left: 200,
    behavior: "smooth",
  });
};



  return (
    <>
      {/* Right-side buttons only (no left UI touched) */}
      <div className="flex items-center gap-1 ml-2">
        {/* CODE */}
        <button
          title="View Code"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Code2 size={14} />
        </button>

        {/* DOWNLOAD (later) */}
        <button
          title="Download"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Download size={14} />
        </button>

        {/* DELETE (later) */}
        <button
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            console.log("DELETE SCREEN:", screen);
          }}
          className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* CODE MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
       <div
  className="bg-white w-[90vw] max-w-4xl h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
  onClick={(e) => e.stopPropagation()}
>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-700">
                {screen.screenName} — Generated Code
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-medium cursor-pointer"
                >
                  <Copy size={14} />
                  Copy
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

      {/* Code Viewer */}
{/* Code Viewer */}
<div className="relative flex-1 bg-white border-t">
  {/* Scroll buttons */}
  <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
    <button
      onClick={scrollUp}
      className="p-1.5 rounded !bg-black text-white hover:!bg-yellow-400 hover:text-black transition-colors !bg-neutral-900 cursor-pointer"
    >
      <ChevronUp size={16} />
    </button>

    <button
      onClick={scrollDown}
      className="p-1.5 rounded bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
    >
      <ChevronDown size={16} />
    </button>

    <div className="h-px bg-gray-300 my-1" />

    <button
      onClick={scrollLeft}
      className="p-1.5 rounded bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
    >
      <ChevronLeft size={16} />
    </button>

    <button
      onClick={scrollRight}
      className="p-1.5 rounded bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors cursor-pointer"
    >
      <ChevronRight size={16} />
    </button>
  </div>

  {/* Scrollable code */}
  <div
    ref={codeScrollRef}
    className="absolute inset-0 overflow-auto"
  >
    <pre className="p-5 text-xs text-black whitespace-pre">
      <code>{finalHtml || "// No code generated yet"}</code>
    </pre>
  </div>
</div>
            </div>
          </div>
      
      )}
    </>
  );
}

export default ScreenHandler;
