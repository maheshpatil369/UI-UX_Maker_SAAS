// app/project/[ProjectId]/_shared/Canvas.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import axios from "axios";

/* ================= PROPS ================= */
type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfigType[];
  loading?: boolean;
};

/* ================= CONTROLS ================= */
const Controls = ({ isMobileView }: { isMobileView: boolean }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div
      className={`
        absolute z-50 flex gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-gray-200
        ${isMobileView ? "bottom-28 right-4 flex-row" : "bottom-6 right-6 flex-col"}
      `}
    >
      <button
        onClick={() => zoomIn()}
        className="p-3 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-gray-700 transition-all"
        title="Zoom In"
      >
        <ZoomIn size={isMobileView ? 24 : 20} />
      </button>

      <button
        onClick={() => zoomOut()}
        className="p-3 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-gray-700 transition-all"
        title="Zoom Out"
      >
        <ZoomOut size={isMobileView ? 24 : 20} />
      </button>

      <div
        className={`${
          isMobileView ? "w-px h-8" : "h-px w-8"
        } bg-gray-200 self-center`}
      />

      <button
        onClick={() => resetTransform()}
        className="p-3 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-gray-700 transition-all font-bold"
        title="Reset View"
      >
        <Maximize size={isMobileView ? 24 : 20} />
      </button>
    </div>
  );
};
/* ================= CANVAS ================= */
function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const { ProjectId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  const [panningEnabled, setPanningEnabled] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [hasCaptured, setHasCaptured] = useState(false);

  const isMobile = projectDetail?.device === "mobile";

  /* ================= VIEWPORT ================= */
  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobileView = viewportWidth < 768;

  /* ================= SIZING ================= */
  const SCREEN_WIDTH = isMobile
    ? Math.min(360, viewportWidth * 0.9)
    : Math.min(1200, viewportWidth * 0.7);

  const SCREEN_HEIGHT = isMobile ? 720 : 800;
  const GAP = isMobileView ? 16 : isMobile ? 12 : 80;
  const INITIAL_SCALE = isMobileView ? 0.65 : 0.75;
  const PADDING_TOP = isMobileView ? 40 : 75;
  const PADDING_LEFT = isMobileView ? 20 : 75;

  /* ================= IFRAME CAPTURE (GEMINI LOGIC) ================= */
  const captureOneIframe = async (iframe: HTMLIFrameElement) => {
    try {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return null;

      // wait for fonts
      // @ts-ignore
      if (doc.fonts?.ready) await doc.fonts.ready;

      // wait for tailwind / animations
      await new Promise((r) => setTimeout(r, 800));

      const w = doc.documentElement.scrollWidth || SCREEN_WIDTH;
      const h = doc.documentElement.scrollHeight || SCREEN_HEIGHT;

      return await html2canvas(doc.body, {
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
        scale: 0.5, // optimized for DB preview
        logging: false,
      });
    } catch (e) {
      console.error("Iframe capture failed", e);
      return null;
    }
  };

  const onTakeScreenshot = async () => {
    if (hasCaptured) return;
    try {
      const iframes = iframeRefs.current.filter(Boolean) as HTMLIFrameElement[];
      if (!iframes.length) return;
      const shotCanvases: HTMLCanvasElement[] = [];
      for (const iframe of iframes) {
        const c = await captureOneIframe(iframe);
        if (c) shotCanvases.push(c);
      }
      if (shotCanvases.length === 0) return;
      const stitchW = Math.max(shotCanvases.length * (SCREEN_WIDTH * 0.5 + 10), SCREEN_WIDTH * 0.5);
      const stitchH = SCREEN_HEIGHT * 0.5;
      const out = document.createElement("canvas");
      out.width = stitchW; out.height = stitchH;
      const ctx = out.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, stitchW, stitchH);
      shotCanvases.forEach((canvas, i) => {
        ctx.drawImage(canvas, i * (SCREEN_WIDTH * 0.5 + 10), 0, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5);
      });
      await axios.put("/api/project", { projectId: ProjectId, previewImage: out.toDataURL("image/jpeg", 0.7) });
      setHasCaptured(true);
    } catch (e) { console.error(e); }
  };

  /* ================= AUTO TRIGGER ================= */
useEffect(() => {
    if (screenConfig.length > 0 && !loading && !hasCaptured) {
      if (screenConfig.every(s => s.code && s.code.trim().length > 100)) {
        const timer = setTimeout(() => onTakeScreenshot(), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [screenConfig, loading, hasCaptured]);

  /* ================= PREVENT CTRL + SCROLL ================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => e.ctrlKey && e.preventDefault();
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  /* ================= RENDER ================= */
 return (
  // ✅ STATIC BACKGROUND (never transforms)
  <div
    ref={containerRef}
    className="relative w-full h-full overflow-hidden select-none"
    style={{
      backgroundImage:
        "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    }}
  >
    <TransformWrapper
      initialScale={INITIAL_SCALE}
      minScale={0.1}
      maxScale={4}
      centerOnInit
      limitToBounds={false}
      wheel={{ step: 0.1, activationKeys: [] }}
      panning={{ disabled: !panningEnabled }}
      doubleClick={{ disabled: true }}
    >
      <Controls isMobileView={isMobileView} />

      {/* 🔥 ONLY CONTENT TRANSFORMS */}
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%" }}
      >
        <div className="relative">
          {screenConfig.map((screen, index) => (
            <ScreenFrame
              key={index}
              x={PADDING_LEFT + index * (SCREEN_WIDTH + GAP)}
              y={PADDING_TOP}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              setPanningEnabled={setPanningEnabled}
              htmlCode={screen.code}
              projectDetail={projectDetail}
              panningEnabled={panningEnabled}
              screen={screen}
              ref={(el: any) => {
                iframeRefs.current[index] =
                  el?.getIframe?.() || null;
              }}
            />
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  </div>
);
}

export default Canvas;