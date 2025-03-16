"use client";
import { useState } from "react";

const teacherSubject = "Mathematics";
const categoryMapping = { Mathematics: 1 };
const categoryId = categoryMapping[teacherSubject];

const data = {
    "Video": [
        {"id": 13, "name": "Linear Equations", "url": "https://www.youtube.com/embed/tHm3X_Ta_iE", "subtopicId": 13},
        {"id": 14, "name": "Linear Inequalities", "url": "https://www.youtube.com/embed/DrZJKdXlZ3I", "subtopicId": 14},
        {"id": 15, "name": "Chemical Reactions", "url": "https://www.youtube.com/embed/Lvbm8horG1U", "subtopicId": 15},
        {"id": 16, "name": "Organic Chemistry", "url": "https://www.youtube.com/embed/nP0gDV0xDLY", "subtopicId": 16},
        {"id": 17, "name": "Revolution in Metal Industry", "url": "https://www.youtube.com/embed/zsPYi2KQ2a0", "subtopicId": 17},
        {"id": 18, "name": "Revolution in Taxes", "url": "https://www.youtube.com/embed/HlUiSBXQHCw", "subtopicId": 18},
        {"id": 1, "name": "Sine and Cosine", "url": "https://www.youtube.com/embed/uMfnJ6TJinc", "subtopicId": 1},
        {"id": 2, "name": "Tangent and Cotangent", "url": "https://www.youtube.com/embed/7PVKbyLFY5U", "subtopicId": 2},
        {"id": 3, "name": "Triangles", "url": "https://www.youtube.com/embed/j2b2uyC9k1o", "subtopicId": 3},
        {"id": 4, "name": "Circles", "url": "https://www.youtube.com/embed/wYshjXUHgLA", "subtopicId": 4},
        {"id": 5, "name": "Newton's Laws", "url": "https://www.youtube.com/embed/kKKM8Y-u7ds", "subtopicId": 5},
        {"id": 6, "name": "Thermodynamics", "url": "https://www.youtube.com/embed/4i1MUWJoI0U", "subtopicId": 6},
        {"id": 7, "name": "Cell Structure", "url": "https://www.youtube.com/embed/eS-kn6zfOgA", "subtopicId": 7},
        {"id": 8, "name": "DNA and Genetics", "url": "https://www.youtube.com/embed/ictAm2wSwtY", "subtopicId": 8},
        {"id": 9, "name": "Greek Civilization", "url": "https://www.youtube.com/embed/IUZKg3KdtYo", "subtopicId": 9},
        {"id": 10, "name": "Roman Empire", "url": "https://www.youtube.com/embed/x3FFDPdLVNw", "subtopicId": 10},
        {"id": 11, "name": "World War I", "url": "https://www.youtube.com/embed/dHSQAEam2yc", "subtopicId": 11},
        {"id": 12, "name": "World War II", "url": "https://www.youtube.com/embed/58XB0OvoGAI", "subtopicId": 12}
    ],
    "Topic": [
        {"id": 1, "name": "Trigonometry", "categoryId": 1, "imageUrl": "https://t4.ftcdn.net/jpg/00/55/58/41/360_F_55584182_yYGnmk8WELSWVaBHDZKgwsfFNm217M5v.jpg"},
        {"id": 2, "name": "Geometry", "categoryId": 1, "imageUrl": "https://www.piqosity.com/wp-content/uploads/2022/12/Depositphotos_400945552_L-e1658434781329-1024x599.jpg"},
        {"id": 3, "name": "Physics", "categoryId": 2, "imageUrl": "https://www.shutterstock.com/shutterstock/photos/1988419205/display_1500/stock-vector-physics-chalkboard-background-in-hand-drawn-style-round-composition-with-lettering-and-physical-1988419205.jpg"},
        {"id": 4, "name": "Biology", "categoryId": 2, "imageUrl": "https://img.freepik.com/premium-vector/biology-doodle-set-collection-hand-drawn-elements-science-biology-isolated-white-background_308665-1569.jpg"},
        {"id": 5, "name": "Ancient History", "categoryId": 3, "imageUrl": "https://i.natgeofe.com/k/109a4e08-5ebc-48a5-99ab-3fbfc1bbd611/Giza_Egypt_KIDS_0123_16x9.jpg"},
        {"id": 6, "name": "Modern History", "categoryId": 3, "imageUrl": "https://defencedirecteducation.com/wp-content/uploads/2022/04/ezgif-5-d9a1447572-696x464.jpg"},
        {"id": 7, "name": "Algebra", "categoryId": 1, "imageUrl": "https://demmelearning.com/wp-content/uploads/2024/08/algebra-1-prep.jpg"},
        {"id": 8, "name": "Chemistry", "categoryId": 2, "imageUrl": "https://www.meritstore.in/wp-content/uploads/2016/12/10-reasons-to-love-Chemistry.png"},
        {"id": 9, "name": "Industrial Revolution", "categoryId": 3, "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Powerloom_weaving_in_1835.jpg/1200px-Powerloom_weaving_in_1835.jpg"}
    ],
    "Subtopic": [
        {"id": 1, "name": "Sine and Cosine", "topicId": 1},
        {"id": 2, "name": "Tangent and Cotangent", "topicId": 1},
        {"id": 3, "name": "Triangles", "topicId": 2},
        {"id": 4, "name": "Circles", "topicId": 2},
        {"id": 5, "name": "Newton's Laws", "topicId": 3},
        {"id": 6, "name": "Thermodynamics", "topicId": 3},
        {"id": 7, "name": "Cell Structure", "topicId": 4},
        {"id": 8, "name": "DNA and Genetics", "topicId": 4},
        {"id": 9, "name": "Greek Civilization", "topicId": 5},
        {"id": 10, "name": "Roman Empire", "topicId": 5},
        {"id": 11, "name": "World War I", "topicId": 6},
        {"id": 12, "name": "World War II", "topicId": 6},
        {"id": 13, "name": "Linear Equations", "topicId": 7},
        {"id": 14, "name": "Linear Inequalities", "topicId": 7},
        {"id": 15, "name": "Chemical Reactions", "topicId": 8},
        {"id": 16, "name": "Organic Chemistry", "topicId": 8},
        {"id": 17, "name": "Revolution in Metal Industry", "topicId": 9},
        {"id": 18, "name": "Revolution in Taxes", "topicId": 9}
    ]
};

export default function VideosPage() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [newSubtopic, setNewSubtopic] = useState({ name: "", videoUrl: "" });
    
    // Filter topics by the current category (Mathematics)
    const mathTopics = data.Topic.filter(topic => topic.categoryId === categoryId);
    
    const handleTopicClick = (topicId : any) => {
        setSelectedTopic(topicId);
        setNewSubtopic({ name: "", videoUrl: "" });
    };
    
    const handleNewSubtopicChange = (e : any) => {
        setNewSubtopic({ ...newSubtopic, [e.target.name]: e.target.value });
    };
    
    const handleAddSubtopic = () => {
        if (!newSubtopic.name || !newSubtopic.videoUrl || !selectedTopic) return;
        
        // Create new subtopic ID (max ID + 1)
        const newSubtopicId = Math.max(...data.Subtopic.map(s => s.id)) + 1;
        
        // Add new subtopic
        data.Subtopic.push({
            id: newSubtopicId,
            name: newSubtopic.name,
            topicId: selectedTopic
        });
        
        // Create new video ID (max ID + 1)
        const newVideoId = Math.max(...data.Video.map(v => v.id)) + 1;
        
        // Add new video
        data.Video.push({
            id: newVideoId,
            name: newSubtopic.name,
            url: newSubtopic.videoUrl,
            subtopicId: newSubtopicId
        });
        
        // Reset form
        setNewSubtopic({ name: "", videoUrl: "" });
        
        // Force re-render
        setSelectedTopic(null);
        setTimeout(() => setSelectedTopic(selectedTopic), 0);
    };
    
    const getSubtopicsForTopic = (topicId : any) => {
        return data.Subtopic.filter(subtopic => subtopic.topicId === topicId);
    };
    
    const getVideoForSubtopic = (subtopicId : any) => {
        return data.Video.find(video => video.subtopicId === subtopicId);
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Math</h1>
            
            {!selectedTopic ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mathTopics.map(topic => (
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
            ) : (
                <div>
                    <button 
                        onClick={() => setSelectedTopic(null)}
                        className="mb-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Back to Topics
                    </button>
                    
                    <h2 className="text-3xl font-semibold mb-4">
                        {mathTopics.find(t => t.id === selectedTopic)?.name} Videos
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