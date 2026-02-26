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
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Recent Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.projectId}
                onClick={() =>
                  router.push(`/project/${project.projectId}`)
                }
                className="group cursor-pointer rounded-2xl border bg-white overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-gray-100 shadow-md"
              >
                {/* PREVIEW IMAGE SECTION */}
                <div className="aspect-video w-full bg-slate-50 relative overflow-hidden border-b border-gray-50">
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.userInput}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preview Pending</span>
                      </div>
                    </div>
                  )}
                  
                  {/* DEVICE BADGE */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold rounded-lg border border-gray-100 uppercase shadow-sm text-gray-600">
                      {project.device}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {project.userInput || "Untitled Project"}
                  </h3>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                    <span className="text-purple-500 font-bold text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto px-6 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Built with ❤️ by <span className="font-semibold text-gray-800">@Mahesh Patil</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://maheshpatil.tech"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-red-600 hover:text-red-400 transition-colors font-bold  border-b border-transparent hover:border-red-600"
          >
            Contact Developer
          </a>
          <span className="text-gray-300 hidden md:block">|</span>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} UIForage. All rights reserved.
          </p>
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full left-1/3"></div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-sky-400/20 blur-[120px] rounded-full left-1/2"></div>
    </div>
  );
}