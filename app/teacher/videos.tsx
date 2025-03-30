"use client";
import { useState, useEffect } from "react";

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

export default function VideosPage() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [newSubtopic, setNewSubtopic] = useState({ name: "", videoUrl: "" });
    const [newTopic, setNewTopic] = useState({ name: "", imageUrl: "" });
    const [showAddTopicForm, setShowAddTopicForm] = useState(false);
    const [CategoryId, setCategoryId] = useState(0);
    const [Topics, setTopics] = useState<Topic[]>([]);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const response = await fetch("/api/fetch-teacher-details", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setCategoryId(data.categoryid);
    
                    const videosResponse = await fetch("/api/videos");
                    const videoData = await videosResponse.json();
    
                    const filteredTopics = videoData
                        .filter((category: Category) => category.id === data.categoryid)
                        .flatMap((category: Category) => category.topics);
    
                    setTopics(filteredTopics);
                } else {
                    console.error("Failed to fetch teacher details");
                }
            } catch (error) {
                console.error("Error fetching teacher details:", error);
            }
        }
    
        fetchVideos();
    }, []);    
    
    const handleTopicClick = (topicId : any) => {
        setSelectedTopic(topicId);
        setNewSubtopic({ name: "", videoUrl: "" });
    };
    
    const handleNewSubtopicChange = (e : any) => {
        setNewSubtopic({ ...newSubtopic, [e.target.name]: e.target.value });
    };
    
    const handleNewTopicChange = (e : any) => {
        setNewTopic({ ...newTopic, [e.target.name]: e.target.value });
    };
    
    const handleAddTopic = async () => {
        if (!newTopic.name || !newTopic.imageUrl) return;
    
        try {
            const response = await fetch("/api/add-topic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: newTopic.name,
                    categoryId: CategoryId,
                    imageUrl: newTopic.imageUrl
                })
            });
    
            if (!response.ok) throw new Error("Failed to add topic");
    
            const createdTopic = await response.json();
            setTopics([...Topics, createdTopic]); // Update UI with new topic
    
            // Reset form
            setNewTopic({ name: "", imageUrl: "" });
            setShowAddTopicForm(false);
        } catch (error) {
            console.error("Error adding topic:", error);
        }
    };
    
    const handleAddSubtopic = async () => {
        if (!newSubtopic.name || !newSubtopic.videoUrl || !selectedTopic) return;
    
        try {
            // Add subtopic
            const subtopicResponse = await fetch("/api/add-subtopic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: newSubtopic.name,
                    topicId: selectedTopic
                })
            });
    
            if (!subtopicResponse.ok) throw new Error("Failed to add subtopic");
    
            const createdSubtopic = await subtopicResponse.json();
    
            // Add associated video
            const videoResponse = await fetch("/api/add-video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: newSubtopic.name,
                    url: newSubtopic.videoUrl,
                    subtopicId: createdSubtopic.id
                })
            });
    
            if (!videoResponse.ok) throw new Error("Failed to add video");
    
            // Update UI with new subtopic
            const updatedTopics = Topics.map(topic =>
                topic.id === selectedTopic
                    ? { ...topic, subtopics: [...topic.subtopics, createdSubtopic] }
                    : topic
            );
            setTopics(updatedTopics);
    
            // Reset form
            setNewSubtopic({ name: "", videoUrl: "" });
        } catch (error) {
            console.error("Error adding subtopic/video:", error);
        }
    };    
    
    const getSubtopicsForTopic = (topicId: number) => {
        const topic = Topics.find(t => t.id === topicId);
        return topic ? topic.subtopics : [];
    };
    
    const getVideoForSubtopic = (subtopicId: number) => {
        for (const topic of Topics) {
            for (const subtopic of topic.subtopics) {
                if (subtopic.id === subtopicId) {
                    return subtopic.videos.length > 0 ? subtopic.videos[0] : null;
                }
            }
        }
        return null;
    };    

    const toggleAddTopicForm = () => {
        setShowAddTopicForm(!showAddTopicForm);
    };

    return (
        <div className="p-8">
            
            {!selectedTopic ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Topics</h2>
                        <button 
                            onClick={toggleAddTopicForm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {showAddTopicForm ? "Cancel" : "Add New Topic"}
                        </button>
                    </div>
                    
                    {showAddTopicForm && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-xl font-semibold mb-4">Add New Topic</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Topic Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={newTopic.name}
                                        onChange={handleNewTopicChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter topic name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input 
                                        type="text" 
                                        name="imageUrl" 
                                        value={newTopic.imageUrl}
                                        onChange={handleNewTopicChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleAddTopic}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    disabled={!newTopic.name || !newTopic.imageUrl}
                                >
                                    Add Topic
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Topics.map(topic => (
                            <div 
                                key={topic.id} 
                                className="cursor-pointer overflow-hidden rounded-lg shadow-lg border border-zinc-100 transform transition duration-300 hover:scale-105"
                                onClick={() => handleTopicClick(topic.id)}
                            >
                                <img 
                                    src={topic.imageUrl} 
                                    alt={topic.name} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 text-center font-semibold">{topic.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <button 
                        onClick={() => setSelectedTopic(null)}
                        className="mb-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Back to Topics
                    </button>
                    <h2 className="text-3xl font-semibold mb-4">
                        {Topics.find(t => t.id === selectedTopic)?.name} Videos
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {getSubtopicsForTopic(selectedTopic).map(subtopic => {
                            const video = getVideoForSubtopic(subtopic.id);
                            return (
                                <div key={subtopic.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <h3 className="text-xl font-medium p-4 bg-gray-50">{subtopic.name}</h3>
                                    {video && (
                                        <div className="p-4">
                                            <div className="aspect-w-16 aspect-h-9">
                                                <iframe 
                                                    className="w-full h-64"
                                                    src={video.url} 
                                                    allowFullScreen
                                                    title={video.name}
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4">Add New Subtopic with Video</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subtopic Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={newSubtopic.name}
                                    onChange={handleNewSubtopicChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subtopic name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Video URL (YouTube Embed)
                                </label>
                                <input 
                                    type="text" 
                                    name="videoUrl" 
                                    value={newSubtopic.videoUrl}
                                    onChange={handleNewSubtopicChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://www.youtube.com/embed/..."
                                />
                            </div>
                            
                            <button 
                                onClick={handleAddSubtopic}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                disabled={!newSubtopic.name || !newSubtopic.videoUrl}
                            >
                                Add Subtopic
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}