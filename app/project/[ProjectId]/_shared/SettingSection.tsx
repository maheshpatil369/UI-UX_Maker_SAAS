"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { THEME_NAME_LIST, THEMES, ThemeKey } from "@/data/Themes";
import { Camera, Share, Sparkle, Menu, X } from "lucide-react";
import { ProjectType } from '@/type/types'

interface Props {
  projectDetail: ProjectType | undefined;
  onIframeRef?: (iframe: HTMLIFrameElement | null) => void;
}

export const SettingSection: React.FC<Props> = ({ projectDetail }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);
  const [projectName, setProjetName] = useState(projectDetail?.projectName);
  const [userNewScreenInput, setUserNewScreenInput] = useState<string>("");

  // ✅ mobile drawer state
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    projectDetail && setProjetName(projectDetail?.projectName);
  }, [projectDetail]);

  const onTakeScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${projectName || "screenshot"}.png`;
      link.click();
    }
  };

  return (
    <>
      {/* ✅ Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 left-6 z-[100] md:hidden shadow-xl bg-white rounded-full h-12 w-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </Button>

      {/* ✅ Responsive Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-[90] w-[300px] bg-white border-r
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 h-[90vh] p-5 overflow-y-auto
      `}
      >
        <h2 className="font-medium text-lg">Settings</h2>

        <div className="mt-3">
          <h2 className="text-sm mb-1">Project Name</h2>
          <Input
            placeholder="Project Name"
            value={projectDetail?.projectName ?? ""}
            onChange={(event) => setProjetName(event.target.value)}
          />
        </div>

        <div className="mt-3">
          <h2 className="text-sm mb-1">Generate New Screen</h2>
          <Textarea
            placeholder="Enter prompt to generate screen using AI"
            value={userNewScreenInput}
            onChange={(event) => setUserNewScreenInput(event.target.value)}
          />
          <Button
            size="sm"
            className="cursor-pointer bg-red-600 hover:bg-red-500 mt-2 w-full"
          >
            <Sparkle />
            Generate with AI
          </Button>
        </div>

        <div className="mt-5">
          <h2 className="text-sm mb-1">Themes</h2>
          <div className="h-50 overflow-auto">
            {THEME_NAME_LIST.map((theme: ThemeKey, index: number) => (
           <div
  key={index}
  className={`group relative p-3 border rounded-2xl mb-3 cursor-pointer transition-all ${
    theme === selectedTheme ? "border-primary bg-primary/20" : ""
  }`}
  onClick={() => setSelectedTheme(theme)}
>
  <h2 className="text-sm font-semibold tracking-wide uppercase">
    {theme.replaceAll("_", " ")}
  </h2>

  <div className="flex gap-2 p-2">
    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].primary }} />
    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].secondary }} />
    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].accent }} />
    <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].background }} />
    <div
      className="h-4 w-4 rounded-full"
      style={{
        background: `linear-gradient(
          135deg,
          ${THEMES[theme].background},
          ${THEMES[theme].primary},
          ${THEMES[theme].accent}
        )`,
      }}
    />
  </div>

<span className="absolute bottom-[-22px] left-2 text-[11px] px-2 py-[2px] rounded-md border bg-muted text-muted-foreground shadow-sm opacity-0 group-hover:opacity-100 transition">
  Coming Soon...
</span>
</div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-sm mb-1">Extras</h2>
          <div className="flex gap-3">
            <Button size="sm" variant="outline" className="flex gap-2" onClick={onTakeScreenshot}>
              <Camera size={16} />
              Screenshot
            </Button>
            <Button size="sm" variant="outline">
              <Share />
              Share
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};