import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const LevelSelection = () => {
  const [searchParams] = useSearchParams();
  const levelType = searchParams.get("type") || "Niveau";

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sélection du niveau - {levelType}</h2>
        <div className="mt-6">
          <label className="block text-lg font-semibold">Choisir un niveau :</label>
          <select className="p-2 border rounded mt-2">
            <option>1ère année {levelType}</option>
            <option>2ème année {levelType}</option>
          </select>
        </div>
        <div className="mt-6">
          <label className="block text-lg font-semibold">Choisir une matière :</label>
          <select className="p-2 border rounded mt-2">
            <option>Mathématiques</option>
            <option>Physique</option>
          </select>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LevelSelection;
