"use client";

import { Header } from "./_shared/Header";
import Hero from "./_shared/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/project?recent=true");
        setProjects(res.data.projects || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <Header />

      <div className="min-h-screen overflow-hidden flex items-center justify-center">
        <Hero />
      </div>

      {/* RECENT PROJECTS */}
      {projects.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20 px-6 relative z-10">
          <h2 className="text-xl font-semibold mb-6">
            Recent Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.projectId}
                onClick={() =>
                  router.push(`/project/${project.projectId}`)
                }
                className="cursor-pointer rounded-xl border bg-white p-4 hover:shadow-lg transition"
              >
                <h3 className="font-medium line-clamp-2">
                  {project.userInput}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {project.device}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Last updated:{" "}
                  {new Date(project.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full left-1/3"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-sky-400/20 blur-[120px] rounded-full left-1/2"></div>
    </div>
  );
}