"use client";

import { ScreenConfigType } from "@/type/types";
import { Code2, Download, Trash2, Copy, X } from "lucide-react";
import { useState } from "react";

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
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
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
          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
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
          className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
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
            className="bg-white w-[90vw] max-w-4xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden"
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
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
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
            <pre className="p-4 text-xs overflow-auto max-h-[65vh] bg-gray-50 text-gray-800">
              <code>{finalHtml || "// No code generated yet"}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}

export default ScreenHandler;