import React, { useState } from "react";
import { motion } from "framer-motion";
import { Select, MenuItem } from "@mui/material";
import CategoryForm from "../../components/formulaires_d'ajout/CategoryForm";
import LevelForm from "../../components/formulaires_d'ajout/LevelForm";
import FiliereForm from "../../components/formulaires_d'ajout/FiliereForm";
import SubjectForm from "../../components/formulaires_d'ajout/SubjectForm";
import CourseForm from "../../components/formulaires_d'ajout/CourseForm";
import ResourceTypeForm from "../../components/formulaires_d'ajout/ResourceTypeForm";
import ResourceForm from "../../components/formulaires_d'ajout/ResourceForm";

const sectionComponents = {
  "Catégories": CategoryForm,
  "Niveaux": LevelForm,
  "Filière": FiliereForm,
  "Matières": SubjectForm,
  "Cours": CourseForm,
  "Types de Ressources": ResourceTypeForm,
  "Ressources": ResourceForm,
};

export default function AdminDataManagement() {
  const [selectedSection, setSelectedSection] = useState("Catégories");
  const SectionComponent = sectionComponents[selectedSection];

  return (
    <div className="p-8 lg:p-14 -m-10  bg-blue-100 min-h-screen ">
      <motion.div 
        className="bg-white shadow-lg rounded-2xl p-4 flex items-center justify-between mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-sm lg:text-2xl font-bold text-custom-blue2">Ajouter des Données</h1>
        <Select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="bg-gray-100 p-2 rounded-lg shadow-sm  text-sm"
        >
          {Object.keys(sectionComponents).map((section) => (
            <MenuItem key={section} value={section}>
              {section}
            </MenuItem>
          ))}
        </Select>
      </motion.div>
      
      <motion.div 
        className="bg-white shadow-xl rounded-xl p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {SectionComponent && <SectionComponent />}
      </motion.div>
    </div>
  );
}
