"use client";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Send } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { suggestions } from "@/data/constant";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { randomUUID } from "crypto";

function Hero() {
  const [userInput, setUserInput] = useState<string>("");
const [device, setDevice] = useState<string>("mobile");
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
const [apiKey, setApiKey] = useState("");
const [savingKey, setSavingKey] = useState(false);

  const onCreateProject = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);

    const projectId = window.crypto.randomUUID();
    const result = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
        device: device,
        projectId: projectId,
      }),
    });

const data = await result.json();

if (result.status === 403) {
  setLoading(false);
  setShowApiModal(true);
  return;
}

console.log(data);

setLoading(false);

router.push(`/project/` + projectId);
  };

  const saveApiKey = async () => {

  setSavingKey(true);

  const res = await fetch("/api/user/api-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey }),
  });

  const data = await res.json();

  setSavingKey(false);

  if (res.ok) {
    alert("API key saved successfully!");
    setShowApiModal(false);
  } else {
    alert(data.error);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // stop new line
    if (!loading && userInput.trim()) {
      onCreateProject();
    }
  }
};


return (
  <div className="w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[100svh] flex flex-col justify-center py-16">

      {/* Badge */}
      <div className="group relative mx-auto max-w-sm flex items-center justify-center rounded-full px-5 py-2 mb-6
        bg-white/10 backdrop-blur-md
        shadow-[0_0_25px_rgba(156,64,255,0.35)] 
        transition-all duration-500 ease-out 
        hover:shadow-[0_0_35px_rgba(156,64,255,0.6)]">

        <span
          className="absolute inset-0 rounded-full p-[2px] 
          bg-gradient-to-r from-orange-400 via-violet-500 to-cyan-400 
          bg-[length:300%_100%] animate-gradient"
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
          }}
        />

        <span className="relative flex items-center text-white font-medium">
          🎉
          <hr className="mx-2 h-4 w-px bg-white/40" />
          <AnimatedGradientText className="text-sm font-semibold">
            Introducing Magic UI
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-violet-600 leading-tight max-w-3xl mx-auto">
        Design High Quality{" "}
        <span className="text-teal-500">
          Website and Mobile App
        </span>{" "}
        Designs
      </h2>

      <p className="text-center text-gray-700 text-base sm:text-lg mt-4 max-w-xl mx-auto">
        <span className="text-violet-500 font-medium">
          Imagine your idea
        </span>{" "}
        and turn into{" "}
        <span className="text-teal-500 font-medium">
          reality
        </span>
      </p>

      {/* Input Section */}
      <div className="w-full flex justify-center mt-8">
        <InputGroup className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">

          <InputGroupTextarea
            disabled={!isSignedIn}
            placeholder={
              isSignedIn
                ? "Enter what design you want..."
                : "Please sign-in to start designing"
            }
            className={cn(
              "min-h-[100px] w-full resize-none rounded-md bg-transparent px-4 py-3 outline-none text-sm sm:text-base",
              !isSignedIn && "opacity-50"
            )}
            value={userInput}
            onChange={(event) => setUserInput(event.target?.value)}
            onKeyDown={handleKeyDown}
          />

          <InputGroupAddon align="block-end" className="flex items-center gap-2 p-2">

            <div onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <Select value={device} onValueChange={(value) => setDevice(value)}>
                <SelectTrigger className="w-[110px] sm:w-[140px] h-10 text-sm">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <InputGroupButton
              disabled={loading || !userInput}
              className="cursor-pointer flex items-center justify-center bg-red-500 hover:bg-red-600 min-w-[44px] h-10"
              size="sm"
              variant="default"
              onClick={onCreateProject}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </InputGroupButton>

          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-10 max-w-3xl mx-auto w-full">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 border rounded-2xl flex flex-col items-center cursor-pointer bg-white hover:shadow-md transition"
            onClick={() => setUserInput(suggestion?.description)}
          >
            <h2 className="text-lg">{suggestion?.icon}</h2>
            <h2 className="text-center line-clamp-2 text-sm sm:text-base">
              {suggestion?.name}
            </h2>
          </div>
        ))}
      </div>
      {showApiModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">

    <div className="bg-white rounded-xl p-6 w-[420px]">

      <h2 className="text-lg font-semibold mb-2">
        Project Limit Reached
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Free mode allows only <b>2 projects</b>.
        Add your OpenRouter API key to create unlimited projects.
      </p>

      <input
        className="border w-full p-2 rounded mb-3"
        placeholder="sk-or-xxxx"
        value={apiKey}
        onChange={(e)=>setApiKey(e.target.value)}
      />

      <button
        onClick={saveApiKey}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
      >
        {savingKey ? "Validating..." : "Save API Key"}
      </button>

      <div className="text-xs text-gray-500 mt-4 space-y-1">
        <p>How to get OpenRouter API key:</p>
        <p>1. Go to https://openrouter.ai</p>
        <p>2. Login to your account</p>
        <p>3. Open "Keys" section</p>
        <p>4. Generate new key</p>
        <p>5. Paste it here</p>
      </div>

      <button
        onClick={()=>setShowApiModal(false)}
        className="text-sm text-gray-500 mt-4 underline"
      >
        Cancel
      </button>

    </div>

  </div>
)}

    </div>
  </div>
);
}

export default Hero;
