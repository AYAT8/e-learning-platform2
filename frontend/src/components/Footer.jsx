const Footer = () => {

      return (
    
        <footer className="bg-[#1E2A78] text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-xs sm:text-sm md:text-base" dir="rtl">
    
          <div className="max-w-6xl mx-auto">
    
            {/* 📱 Mobile : Titre + Design en haut */}
    
            <div className="sm:hidden flex flex-col items-start self-start mb-6">
    
            <h1 className="text-4xl  arabic-text">نتعلم</h1>
    
            <div className="w-40 h-[2px] bg-gray-500 my-1"></div>
    
            <div className="w-20 h-[2px] bg-gray-500 my-1"></div>
    
          </div>
    
      
    
            {/* 📱 Mobile : Deux colonnes */}
    
            <div className="grid grid-cols-2 gap-8 sm:hidden">
    
      
    
              {/* Colonne 2 : Liens du site */}
    
              <div className="text-right">
    
                <h2 className="text-lg font-semibold mb-3">أقسام الموقع</h2>
    
                <ul className="space-y-2 text-gray-300">
    
                  <li className="hover:text-gray-400 cursor-pointer">الرئيسية</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">الدروس</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">مقالات</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">مركز نتعلم</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">اتصل بنا</li>
    
                </ul>
    
              </div>
    
              {/* Colonne 1 : Contact */}
    
              <div className="text-right">
    
                <h2 className="text-lg font-semibold mb-3">تواصل معنا</h2>
    
                <p className="text-gray-300"> الهاتف</p>
    
                <p className="mb-2 font-medium text-gray-400">+212 777 898 858</p>
    
                <p className="text-gray-300">البريد الإلكتروني</p>
    
                <p className="mb-2 font-medium text-gray-400">nataalamcenter@gmail.com</p>
    
                <p className="text-gray-300"> العنوان</p>
    
                <p className="font-medium text-gray-400">رقم 5، شارع العقبة، التجزئة 5</p>
    
                <p className="font-medium text-gray-400">(قبالة صيدلية نجيب)</p>
    
                <div className="flex space-x-2 space-x-reverse mt-8 sm:mt-12">
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-[#D6E400] rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                </div>
    
              </div>
    
      
    
            </div>
    
      
    
            {/* 🖥️ Moyen & Grand écran : Design original */}
    
            <div className="hidden sm:flex flex-col md:flex-row justify-between text-sm md:text-base">
    
              {/* Colonne 1 : Logo et design */}
    
              <div className="flex flex-col items-start text-right mb-6 md:mb-0">
    
                <h1 className="text-4xl md:text-5xl font-extrabold font-[Tajawal]">نتعلم</h1>
    
                <div className="w-40 h-[2px] bg-gray-500 my-1"></div>
    
                <div className="w-40 h-[2px] bg-gray-500 my-1"></div>
    
                <div className="w-20 h-[2px] bg-gray-500 my-1"></div>
    
                <div className="flex space-x-2 space-x-reverse mt-4">
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-[#D6E400] rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded-full"></div>
    
                </div>
    
              </div>
    
      
    
              {/* Colonne 2 : Liens du site */}
    
              <div className="flex flex-col items-start text-right">
    
                <h2 className="text-lg font-semibold mb-3">أقسام الموقع</h2>
    
                <ul className="space-y-2 text-gray-200">
    
                  <li className="hover:text-gray-400 cursor-pointer">الرئيسية</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">الدروس</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">مقالات</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">مركز نتعلم</li>
    
                  <li className="hover:text-gray-400 cursor-pointer">اتصل بنا</li>
    
                </ul>
    
              </div>
    
      
    
              {/* Colonne 3 : Contact */}
    
              <div className="flex flex-col items-start text-right">
    
                <h2 className="text-lg font-semibold mb-3">تواصل معنا</h2>
    
                <p className="text-gray-300"> الهاتف</p>
    
                <p className="mb-2 font-medium text-gray-400">+212 777 898 858</p>
    
                <p className="text-gray-300"> البريد الإلكتروني</p>
    
                <p className="mb-2 font-medium text-gray-400">nataalamcenter@gmail.com</p>
    
                <p className="text-gray-300">العنوان</p>
    
                <p className="font-medium text-gray-400">رقم 5، شارع العقبة، التجزئة 5</p>
    
                <p className="font-medium text-gray-400">(قبالة صيدلية نجيب)</p>
    
              </div>
    
            </div>
    
          </div>
    
        </footer>
    
      );
    
    };
    
      
    
    export default Footer;