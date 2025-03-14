import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LevelsPage from "./pages/LevelSelection";
import CoursePage from "./pages/CoursePage"; 
import RessourcePage from "./pages/Ressource";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLevels from "./pages/admin/AdminLevels";
import AdminSubjects from "./pages/admin/AdminSubjects";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import GestionStructure from "./pages/admin/GestionStructure";
import GestionCoursById from "./pages/admin/GestionCoursById";
import GestionCours from "./pages/admin/GestionCours";
import AjoutDonnees from "./pages/admin/AjoutDonnees";
import Admin from  "./pages/admin/admin";
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/levels/:category" element={<LevelsPage />} />
          <Route path="/courses/subject/:subjectId" element={<CoursePage />} />
          <Route path="/ressources/:ressourcesId" element={<RessourcePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Routes protégées pour l'administration */}
          <Route path="/admin/*" element={<ProtectedRoute><Admin/></ProtectedRoute>}>
            <Route path="courses" element={<AdminCourses />} />
            <Route path="levels" element={<AdminLevels />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="GestionStructure" element={<GestionStructure />} />
            <Route path="GestionCoursById/:subjectId" element={<GestionCoursById />} />
            <Route path="GestionCours" element={<GestionCours />} />
            <Route path="AjoutDonnees" element={<AjoutDonnees />} />

          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
