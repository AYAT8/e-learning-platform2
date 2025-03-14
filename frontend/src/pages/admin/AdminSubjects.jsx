import { useEffect, useState } from "react";

const AdminSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/subjects", {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors du chargement des matières.");
                }
                return res.json();
            })
            .then((data) => {
                setSubjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📖 Gestion des Matières</h1>
            <table className="min-w-full bg-white border border-gray-200 rounded shadow-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border">Nom</th>
                        <th className="py-2 px-4 border">Niveau</th>
                        <th className="py-2 px-4 border">Filière</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject._id} className="text-center">
                            <td className="py-2 px-4 border">{subject.nom}</td>
                            <td className="py-2 px-4 border">{subject.level?.name || "N/A"}</td>
                            <td className="py-2 px-4 border">{subject.filiere?.name || "Général"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSubjects;
