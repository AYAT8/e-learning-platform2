import React from "react";

const categories = [
  { title: "المستوى الابتدائي", color: "bg-red-400", gradient: "from-red-400", image: "https://img-3.journaldesfemmes.fr/eCSnt7eZyx-zo1WcrKfwLb9I5AY=/1500x/smart/31e24df52a2e40c084297299739b8991/ccmcms-jdf/20118118.jpg" },
  { title: "الإعدادي", color: "bg-green-500", gradient: "from-green-500", image: "https://www.saintdominique.fr/wp-content/uploads/2021/05/collegiens-6eme.jpg" },
  { title: "الثانوي", color: "bg-blue-500", gradient: "from-blue-500", image: "https://monenfant.fr/documents/20143/65237/COLLEGE-I-177016370.jpg/05c29778-a3e8-cd52-7aa6-ff69d26d8b3e?t=1533138559038.jpg" },
  { title: "الغير متمدرسين", color: "bg-orange-400", gradient: "from-orange-400", image: "https://celadonbooks.com/wp-content/uploads/2021/02/what-is-nonfiction.gif" }
];

const HomePageContent = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-8 md:mt-16 pb-4 md:pb-2 ">
      <div className="text-right py-8 mt-8">
        <h1 className="text-5xl font-bold text-gray-800 arabic-text">معاك باش تنجح</h1>
        <div className="w-18 h-1 bg-lime-400 mt-5 mr-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-y-8 lg:gap-x-4 lg:flex lg:flex-wrap lg:flex-row-reverse mt-24 md:mb-24">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg shadow-lg ${category.color} h-40 w-full mx-0 md:max-w-none lg:w-[48%]`}
          >
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              <div
                className={`absolute inset-0 bg-gradient-to-l ${category.gradient} via-transparent to-transparent`}
              ></div>
            </div>
            <div className="relative flex items-center justify-end h-full p-6">
              <span className="text-white text-2xl font-semibold text-right">
                {category.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageContent;
