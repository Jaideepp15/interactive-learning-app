"use client";

import { useState, useEffect, useRef } from "react";

interface Video {
  id: number;
  name: string;
  url: string;
  subtopicId: number;
}

interface Subtopic {
  id: number;
  name: string;
  topicId: number;
  videos: Video[];
}

interface Topic {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string;
  subtopics: Subtopic[];
}

interface Category {
  id: number;
  name: string;
  topics: Topic[];
}

export default function VideoLessons() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<number[]>([]);
  const videoProgress = useRef<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("./api/videos");
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: Category[] = await response.json();
        console.log("Fetched Categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    async function fetchCompletedSubtopics() {
      if (!selectedTopic) return;
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated.");
        return;
      }
      try {
        const response = await fetch(`/api/progress/${selectedTopic.categoryId}/subtopics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        setCompletedSubtopics(Array.isArray(data) ? data.map((item) => item.id) : []);
      } catch (error) {
        console.error("Failed to fetch completed subtopics", error);
      }
    }
    fetchCompletedSubtopics();
  }, [selectedTopic]);

  async function markSubtopicCompleted(subtopicId: number) {
    if (completedSubtopics.includes(subtopicId)) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated.");
      return;
    }
    try {
      const response = await fetch("/api/progress/addCompletedSubtopic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subtopicId }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      setCompletedSubtopics((prev) => [...prev, subtopicId]);
    } catch (error) {
      console.error("Failed to mark subtopic as completed", error);
    }
  }

  function handleTimeUpdate(videoId: number, progress: number) {
    videoProgress.current[videoId] = progress;

    if (selectedSubtopic) {
      const allVideosWatched = selectedSubtopic.videos.every(
        (video) => (videoProgress.current[video.id] || 0) >= 90
      );
      if (allVideosWatched) {
        markSubtopicCompleted(selectedSubtopic.id);
      }
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Video Lessons</h2>

      {/* Categories View */}
      {!selectedTopic && !selectedSubtopic && (
        <div>
          {categories?.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-accent">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.topics?.map((topic) => (
                  <div
                    key={topic.id}
                    className="cursor-pointer overflow-hidden rounded-lg shadow-lg border border-zinc-100 transform transition duration-300 hover:scale-105"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <img src={topic.imageUrl} alt={topic.name} className="w-full h-56 object-cover" />
                    <div className="p-4 text-center font-semibold">{topic.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtopics View */}
      {selectedTopic && !selectedSubtopic && (
        <div>
          <button className="mb-4 p-2 bg-zinc-100 text-zinc-800 rounded" onClick={() => setSelectedTopic(null)}>
            Back
          </button>
          <h3 className="text-2xl font-semibold mb-4 text-accent">{selectedTopic.name}</h3>
          {selectedTopic.subtopics?.map((subtopic) => (
            <div
              key={subtopic.id}
              className="mb-2 p-2 flex items-center justify-between bg-zinc-100 text-zinc-800 rounded cursor-pointer"
              onClick={() => setSelectedSubtopic(subtopic)}
            >
              <span>{subtopic.name}</span>
              {completedSubtopics.includes(subtopic.id) && <span className="text-green-600 font-bold">✔ Completed</span>}
            </div>
          ))}
        </div>
      )}

      {/* Video Player View */}
      {selectedSubtopic && (
        <div>
          <button className="mb-4 p-2 bg-zinc-100 text-zinc-800 rounded" onClick={() => setSelectedSubtopic(null)}>
            Back
          </button>
          <h3 className="text-2xl font-semibold mb-4 text-accent">{selectedSubtopic.name}</h3>
          {selectedSubtopic.videos?.map((video) => (
            <div key={video.id} className="mb-4">
              <h4 className="text-xl font-semibold mb-2">{video.name}</h4>
              <iframe
                className="w-full h-96"
                src={video.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => handleTimeUpdate(video.id, 90)}
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
