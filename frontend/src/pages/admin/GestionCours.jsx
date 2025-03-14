import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload } from "react-icons/fa";
import axios from "axios";

const GestionCours = () => {
    const [courses, setCourses] = useState([]);
    const [typeRessources, setTypeRessources] = useState({});
    const [ressources, setRessources] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [openResources, setOpenResources] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/api/courses", {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setCourses(data);
            data.forEach(course => loadTypeRessources(course._id));
        })
        .catch(err => console.error("Erreur lors du chargement des cours:", err));
    }, []);

    const loadTypeRessources = (courseId) => {
        fetch(`http://localhost:5000/api/typeRessources/cours/${courseId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setTypeRessources(prev => ({ ...prev, [courseId]: data }));
            data.forEach(type => loadRessources(type._id));
        })
        .catch(err => console.error(`Erreur lors du chargement des types de ressources pour le cours ${courseId}:`, err));
    };

    const loadRessources = (typeRessourceId) => {
        fetch(`http://localhost:5000/api/ressources/typeressources/${typeRessourceId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setRessources(prev => ({ ...prev, [typeRessourceId]: data }));
        })
        .catch(err => console.error(`Erreur lors du chargement des ressources pour le type ${typeRessourceId}:`, err));
    };

    const handleDownload = async (url) => {
        try {
            const response = await axios.get(url, { responseType: "blob" });
            const fileName = url.split("/").pop();
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
        }
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen" dir="rtl">
            <h1 className="text-4xl font-bold mb-8">📚 إدارة الدروس</h1>
            {courses.map(course => (
                <div key={course._id} className="bg-white p-4 rounded-xl shadow-md mb-4">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpenDropdowns(prev => ({ ...prev, [course._id]: !prev[course._id] }))}>
                        <span className="text-lg font-semibold">{course.title}</span>
                        <div className="flex gap-2">
                            
                            
                        </div>
                    </div>
                    {openDropdowns[course._id] && typeRessources[course._id]?.map(type => (
                        <div key={type._id} className="mt-3 p-3 bg-gray-200 rounded-lg">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpenResources(prev => ({ ...prev, [type._id]: !prev[type._id] }))}>
                                <h3 className="font-medium">{type.nom}</h3>
                                <div className="flex gap-2">
                                    
                                    
                                </div>
                            </div>
                            {openResources[type._id] && ressources[type._id]?.map(ressource => (
                                <div key={ressource._id} className="flex justify-between items-center p-2 bg-white rounded-lg mt-2">
                                    <span>{ressource.title}</span>
                                    <div className="flex gap-2">
                                        
                                        
                                        <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                                            <FaEye className="text-green-600 cursor-pointer" title="Afficher" />
                                        </a>
                                        <FaDownload className="text-gray-600 cursor-pointer" title="Télécharger" onClick={() => handleDownload(ressource.url)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GestionCours;
