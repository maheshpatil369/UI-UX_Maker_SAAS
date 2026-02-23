import React, { useState, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfigType[];
  loading?: boolean;
};

/* ================= CONTROLS ================= */
const Controls = ({ isMobileView }: { isMobileView: boolean }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  if (isMobileView) return null; // 📱 pinch zoom is enough

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-gray-200">
      <button
        onClick={() => zoomIn()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm"
      >
        <ZoomIn size={20} />
      </button>

      <button
        onClick={() => zoomOut()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm"
      >
        <ZoomOut size={20} />
      </button>

      <div className="h-px bg-gray-200 mx-2" />

      <button
        onClick={() => resetTransform()}
        className="p-2.5 hover:bg-white hover:text-blue-600 rounded-lg text-gray-500 transition-all shadow-sm"
      >
        <Maximize size={20} />
      </button>
    </div>
  );
};

/* ================= CANVAS ================= */
function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1440);

  const isMobile = projectDetail?.device === "mobile";

  /* ================= VIEWPORT TRACKING ================= */
  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobileView = viewportWidth < 768;

  /* ================= SCREEN SIZING ================= */
  const SCREEN_WIDTH = isMobile
    ? Math.min(360, viewportWidth * 0.9)
    : Math.min(1200, viewportWidth * 0.7);

  const SCREEN_HIGHT = isMobile ? 720 : 800;

  const GAP = isMobileView ? 16 : isMobile ? 12 : 80;

  const INITIAL_SCALE = isMobileView ? 0.65 : 0.75;

  const PADDING_TOP = isMobileView ? 40 : 75;
  const PADDING_LEFT = isMobileView ? 20 : 75;

  /* ================= PREVENT CTRL + SCROLL ================= */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  /* ================= RENDER ================= */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-100 overflow-hidden select-none"
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
        pinch={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
        doubleClick={{ disabled: true }}
      >
        <Controls isMobileView={isMobileView} />

        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            cursor: panningEnabled ? "grab" : "default",
          }}
        >
          <div className="relative">
            {screenConfig.map((screen, index) => (
              <ScreenFrame
                key={index}
                x={PADDING_LEFT + index * (SCREEN_WIDTH + GAP)}
                y={PADDING_TOP}
                width={SCREEN_WIDTH}
                height={SCREEN_HIGHT}
                setPanningEnabled={setPanningEnabled}
                htmlCode={screen?.code}
                projectDetail={projectDetail}
                panningEnabled={panningEnabled}
                screen={screen}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Canvas;