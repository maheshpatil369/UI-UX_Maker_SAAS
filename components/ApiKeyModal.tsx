"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Copy, Trash2, X } from "lucide-react";

export default function ApiKeyModal({ close }: any) {

  const [apiKey, setApiKey] = useState("");
  const [storedKey, setStoredKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  /* ---------------- FETCH API STATUS ---------------- */

  const fetchStatus = async () => {

    try {
      const res = await fetch("/api/user/api-status");
      const data = await res.json();

      if (data?.apiKey) {
        setStoredKey(data.apiKey);
        setHasKey(true);
      } else {
        setHasKey(false);
      }

    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- SAVE / UPDATE KEY ---------------- */

  const saveKey = async () => {

    if (!apiKey) {
      alert("Please enter API key");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/user/api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ apiKey })
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      alert("API key saved successfully");
      setApiKey("");
      fetchStatus();
    } else {
      alert(data.error || "Failed to save key");
    }
  };

  /* ---------------- REMOVE KEY ---------------- */

  const removeKey = async () => {

    const confirmDelete = confirm("Remove API key?");
    if (!confirmDelete) return;

    const res = await fetch("/api/user/api-key", {
      method: "DELETE"
    });

    if (res.ok) {
      alert("API key removed");
      setStoredKey("");
      setHasKey(false);
    }
  };

  /* ---------------- COPY KEY ---------------- */

  const copyKey = async () => {

    await navigator.clipboard.writeText(storedKey);

    alert("API key copied");
  };

  /* ---------------- MASK KEY ---------------- */

  const maskedKey = storedKey
    ? storedKey.slice(0, 8) + "••••••••••••"
    : "";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">

      <div className="bg-white w-[420px] rounded-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={close}
          className="absolute right-3 top-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          OpenRouter API Key
        </h2>

        {/* EXISTING KEY DISPLAY */}

        {hasKey && (
          <div className="mb-4 border rounded-lg p-3 flex items-center gap-2 hover:bg-gray-50">

            <input
              readOnly
              value={showKey ? storedKey : maskedKey}
              className="flex-1 text-sm border px-2 py-1 rounded"
            />

            {/* SHOW / HIDE */}
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1 text-gray-600 hover:text-black cursor-pointer"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* COPY */}
            <button
              onClick={copyKey}
              className="p-1 text-gray-600 hover:text-black cursor-pointer"
            >
              <Copy size={16} />
            </button>

            {/* DELETE */}
            <button
              onClick={removeKey}
              className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>

          </div>
        )}

        {/* ADD / UPDATE KEY */}

        <input
          className="border w-full p-2 rounded mb-3"
          placeholder="sk-or-xxxx"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <button
          onClick={saveKey}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded cursor-pointer"
        >
          {loading ? "Validating..." : hasKey ? "Update API Key" : "Save API Key"}
        </button>

        {/* INFO */}

        <div className="text-xs text-gray-500 mt-4 space-y-1">

          <p>
            Free mode allows only <b>2 projects</b>.
          </p>

          <p>
            Add your OpenRouter API key to unlock unlimited projects.
          </p>

          <p className="mt-2">
            Get your key from:
          </p>

       <a
  href="https://openrouter.ai/keys"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:underline cursor-pointer"
>
  https://openrouter.ai/keys
</a>

        </div>

      </div>

    </div>
  );
}