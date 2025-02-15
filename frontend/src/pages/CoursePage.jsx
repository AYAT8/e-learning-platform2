import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const CoursePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Cours - Mathématiques</h2>
        <div className="grid grid-cols-3 gap-4">
          <img src="/images/cours1.png" alt="Cours 1" className="border rounded-lg shadow-md" />
          <img src="/images/cours2.png" alt="Cours 2" className="border rounded-lg shadow-md" />
        </div>
        <div className="mt-6">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Télécharger</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
