import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const CourseSelection = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sélection du cours</h2>
        <label className="block text-lg font-semibold">Choisir un contenu :</label>
        <select className="p-2 border rounded mt-2">
          <option>Cours</option>
          <option>Exercices</option>
          <option>Corrections</option>
        </select>
      </main>
      <Footer />
    </div>
  );
};

export default CourseSelection;
