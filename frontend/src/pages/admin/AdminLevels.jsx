import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icônes pour plus de modernité

const AdminLevels = () => {
    const [levels, setLevels] = useState([]);
    const [categories, setCategories] = useState([]);

    // Récupérer les niveaux
    useEffect(() => {
        fetch("http://localhost:5000/api/admin/levels", {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => setLevels(data));
    }, []);

    // Récupérer les catégories
    useEffect(() => {
        fetch("http://localhost:5000/api/categories/names", {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => setCategories(data));
    }, []);

    // Regrouper les niveaux par catégorie
    const categoriesWithLevels = categories.map(category => ({
        ...category,
        levels: levels.filter(level => (level.category?._id || level.category) === category._id)
    }));

    return (
        <div className="p-10 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen" dir="rtl"> {/* Dégradé léger */}
            <h1 className="text-4xl font-bold mb-8 text-right text-gray-700">📊 إدارة المستويات</h1>
            <div className="space-y-8">
                {categoriesWithLevels.map(category => (
                    <div key={category._id} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 pb-2">{category.nom}</h2>
                        <div className="space-y-3">
                            {category.levels.length > 0 ? (
                                category.levels.map(level => (
                                    <div key={level._id} className="flex justify-between items-center p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all shadow-sm">
                                        <span className="text-gray-800 text-lg font-medium">{level.nom}</span>
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
                                                <FaEdit /> تعديل
                                            </button>
                                            <button className="px-3 py-2 flex items-center gap-2 text-red-600 hover:text-red-800 transition">
                                                <FaTrash /> حذف
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">لا توجد مستويات متاحة لهذه الفئة</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminLevels;
