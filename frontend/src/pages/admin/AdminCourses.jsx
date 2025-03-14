"use client";

import { useEffect, useState } from "react";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/subjects", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => res.json())
      .then((data) => setSubjects(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/levels", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => res.json())
      .then((data) => setLevels(data));
  }, []);

  // Regrouper les cours par niveau puis par matière
  const groupedByLevel = levels.map((level) => {
    const subjectsInLevel = subjects.filter((subject) => subject.level === level._id);
    const subjectsWithCourses = subjectsInLevel.map((subject) => ({
      ...subject,
      courses: courses.filter((course) => course.subject === subject._id),
    })).filter(subject => subject.courses.length > 0);

    return { ...level, subjects: subjectsWithCourses };
  }).filter(level => level.subjects.length > 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4 text-right">
          إدارة الدروس 📚
        </h1>
        <div className="space-y-6">
          {groupedByLevel.map((level) => (
            <div key={level._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {level.nom} 📖
              </h2>
              <div className="space-y-4">
                {level.subjects.map((subject) => (
                  <div key={subject._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">
                      {subject.nom} 🏫
                    </h3>
                    <div className="space-y-3">
                      {subject.courses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-xl transition"
                        >
                          <div className="flex-grow">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {course.title}
                            </h4>
                            <p className="text-gray-600 text-sm">{course.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 text-sm">
                              ✏️ تعديل
                            </button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200 text-sm">
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {groupedByLevel.length === 0 && (
            <p className="text-center text-gray-500">لا توجد دروس متاحة حاليًا</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
