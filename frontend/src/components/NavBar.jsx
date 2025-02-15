import { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Menu, X, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";

  

const levels = {

  "ابتدائي": ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الرابع", "المستوى الخامس", "المستوى السادس"],

  "إعدادي": ["السنة الأولى إعدادي", "السنة الثانية إعدادي", "السنة الثالثة إعدادي"],

  "ثانوي": ["الجذع المشترك", "السنة الأولى باك", "السنة الثانية باك"]

};

  

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const menuRef = useRef(null);

  const dropdownRef = useRef(null);

  

  // Close dropdowns when clicking outside

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {

        setIsOpen(false);

      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

        setDropdownOpen(null);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  

  return (

        <nav className="bg-gradient-to-r from-[#1f2a69] to-[#123456] text-white p-4 shadow-lg fixed top-0 left-0 w-full z-50">


      <div className="container mx-auto flex items-center justify-between flex-row rtl:flex-row-reverse">
        {/* Logo (Now on the Left) */}

        <h1 className="text-3xl font-bold tracking-widest uppercase sm:ml-2">
  نتعلم
</h1>

  

        {/* Desktop Menu */}

        <ul className="hidden md:flex space-x-6 rtl:space-x-reverse mx-auto">

          {Object.keys(levels).map((category, index) => (

            <li key={index} className="relative group" ref={dropdownRef}>

              <button

                className="text-lg font-medium flex items-center gap-1 transition-all hover:text-green-300"

                onClick={() => setDropdownOpen(dropdownOpen === category ? null : category)}

              >

                {category} <ChevronDown size={16} />

              </button>

  

              {/* Dropdown (Desktop) */}

              <AnimatePresence>

                {dropdownOpen === category && (

                  <motion.ul

                    className="absolute right-0 mt-2 w-48 bg-white text-[#1f2a69] shadow-xl rounded-lg overflow-hidden"

                    initial={{ opacity: 0, y: -10 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0, y: -10 }}

                  >

                    {levels[category].map((level, idx) => (

                      <motion.li

                        key={idx}

                        className="p-3 transition-all cursor-pointer hover:bg-green-400 hover:text-white"

                        whileHover={{ scale: 1.05 }}

                        onClick={() => setDropdownOpen(null)} // Close on click

                      >

                        {level}

                      </motion.li>

                    ))}

                  </motion.ul>

                )}

              </AnimatePresence>

            </li>

          ))}

        </ul>

  

        {/* Contact Button (Now on the Right) */}

        <button className="hidden md:block px-4 py-3 rounded-full font-semibold text-[#1f2a69] bg-gradient-to-r from-green-400 to-green-500 transition-all hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105">

          اتصل بنا

        </button>

  

        {/* Mobile Menu Button */}

        <button className="md:hidden transition-all hover:scale-110 ml-4" onClick={() => setIsOpen(!isOpen)}>

          {isOpen ? <X size={28} /> : <Menu size={28} />}

        </button>

      </div>

  

      {/* Mobile Sidebar Menu */}

      <AnimatePresence>

        {isOpen && (

          <>

            {/* Background Overlay */}

            <motion.div

              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"

              onClick={() => setIsOpen(false)}

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

            />

  

            {/* Sidebar Panel */}

            <motion.div

              ref={menuRef}

              className="fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-[#1f2a69] p-6 shadow-lg flex flex-col space-y-6"

              initial={{ x: "100%" }}

              animate={{ x: 0 }}

              exit={{ x: "100%" }}

              transition={{ type: "spring", stiffness: 200, damping: 20 }}

            >

              <button className="self-end" onClick={() => setIsOpen(false)}>

                <X size={28} />

              </button>

  

              {/* Mobile Menu Items with Dropdown */}

              <ul className="space-y-4 text-lg">

                {Object.keys(levels).map((category, index) => (

                  <li key={index} className="flex flex-col">

                    <button

                      className="flex items-center justify-between w-full text-white hover:text-green-400 transition-all"

                      onClick={() => setDropdownOpen(dropdownOpen === category ? null : category)}

                    >

                      {category} <ChevronDown size={16} />

                    </button>

  

                    {/* Dropdown (Mobile) */}

                    <AnimatePresence>

                      {dropdownOpen === category && (

                        <motion.ul

                          className="mt-2 bg-white text-[#1f2a69] shadow-xl rounded-lg overflow-hidden"

                          initial={{ opacity: 0, y: -10 }}

                          animate={{ opacity: 1, y: 0 }}

                          exit={{ opacity: 0, y: -10 }}

                        >

                          {levels[category].map((level, idx) => (

                            <motion.li

                              key={idx}

                              className="p-3 transition-all cursor-pointer hover:bg-green-400 hover:text-white"

                              whileHover={{ scale: 1.05 }}

                              onClick={() => setDropdownOpen(null)} // Close on click

                            >

                              {level}

                            </motion.li>

                          ))}

                        </motion.ul>

                      )}

                    </AnimatePresence>

                  </li>

                ))}

              </ul>

  

              {/* Contact Button (Now in Sidebar) */}

              <button className="mt-6 px-4 py-3 w-full rounded-full font-semibold text-[#1f2a69] bg-gradient-to-r from-green-400 to-green-500 transition-all hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105">

                اتصل بنا

              </button>

  

              {/* Social Media Icons */}

              <div className="flex justify-around mt-6">

                {[Facebook, Instagram, Twitter].map((Icon, index) => (

                  <motion.div

                    key={index}

                    className="p-3 rounded-full bg-white bg-opacity-10 cursor-pointer transition-all hover:bg-opacity-20 shadow-md"

                    whileHover={{ scale: 1.2, boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)" }}

                  >

                    <Icon size={24} />

                  </motion.div>

                ))}

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

    </nav>

  );

};


export default Navbar;