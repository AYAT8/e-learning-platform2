import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion

const HomePageContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBox, setActiveBox] = useState(null); // State to track the active box
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        const formattedCategories = data.map((category, index) => ({
          _id: category._id,
          title: category.nom,
          color: ["bg-red-400", "bg-green-500", "bg-blue-500", "bg-orange-400"][index % 4],
          gradient: ["from-red-400", "from-green-500", "from-blue-500", "from-orange-400"][index % 4],
          image: `http://localhost:5000/${category.image.replace(/\\/g, "/")}`,
          path: `/levels/${category._id}`,
        }));
        setCategories(formattedCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de récupération des catégories :", error);
        setLoading(false);
      });
  }, []);

  const handleBoxClick = (category) => {
    setActiveBox(category._id); // Set the active box
    setTimeout(() => {
      navigate(category.path); // Navigate after a short delay
    }, 100); // 100ms delay for the click effect
  };

  useEffect(() => {
    return () => {
      setActiveBox(null); // Reset activeBox when the component unmounts
    };
  }, []);

  if (loading) {
    return (
      <div className="">
      </div>
    );
  }

  const CustomIcon = () => (
    <svg width="60" height="28" viewBox="0 0 40 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 19V14.0125C40 14.0125 32.18 14.3189 31.3657 9.13663C31.3632 9.13425 30.6786 0 19.9144 0H19.8411C9.36056 0 8.39222 9.13425 8.39222 9.13425C7.5755 14.3189 0 14.0125 0 14.0125V19H40Z" fill="#F3F4F6"></path>
      <g clipPath="url(#clip0_95_601)">
        <path d="M20 10.1349L23.3 7.45361L24.2427 8.21953L20 11.6667L15.7573 8.21953L16.7 7.45361L20 10.1349Z" fill="#111111"></path>
      </g>
      <defs>
        <clipPath id="clip0_95_601">
          <rect width="13" height="16" fill="white" transform="translate(28 3) rotate(90)"></rect>
        </clipPath>
      </defs>
    </svg>
  );

  // Animation variants for the boxes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const boxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray px-0 sm:px-4 mt-8 md:mt-16 pb-4 md:pb-2 w-full mx-0">
      <div
        className="text-right py-8 mt-8 relative bg-gray-100 bg-no-repeat bg-[url('/images/Icon.png')] 
                   lg:bg-[length:300px_auto]  bg-[length:300px_auto] bg-left-[300px]"
      >
        <h1 className="text-5xl md:text-6xl lg:text-6xl md:mt-10 text-gray-800 font-arabic leading-tight text-right">
          معاك <span className="block sm:inline sm:whitespace-nowrap">باش تنجح</span>
        </h1>
        <div className="w-1/4 h-1 bg-lime-400 mt-3 ml-auto lg:mb-20"></div>

        {/* Animated container for the boxes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-y-4 md:gap-x-2 md:flex md:flex-wrap md:flex-row-reverse mt-12 md:mb-24 mb-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category._id}
              className="flex flex-col items-center w-full md:w-[48%] relative"
              variants={boxVariants}
            >
              <div
                onClick={() => handleBoxClick(category)}
                className={`relative overflow-hidden md:rounded-xl ${category.color} h-32 md:h-44 w-full transition-transform duration-100 ease-in-out cursor-pointer ${
                  activeBox === category._id ? "scale-95" : ""
                } hover:scale-95 `} // Hover effect added here
              >
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})`, backgroundPosition: "left center" }}
                  ></div>
                  <div className={`absolute inset-0 bg-gradient-to-l ${category.gradient} via-transparent to-transparent`}></div>
                </div>
                <div className="relative flex items-center justify-end h-full p-6">
                  <span className="text-white text-3xl font-semibold text-right drop-shadow-lg font-arabic">
                    {category.title}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
                <CustomIcon />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageContent;