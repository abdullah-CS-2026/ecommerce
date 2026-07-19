import React from "react";

const categories = [
  {
    id: 1,
    title: "Premium Camera Phones",
    image:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/2945ef142751649.626c71bf5fa54.jpg",
    description:
      "Capture every moment with flagship camera smartphones featuring ultra-clear lenses, advanced night mode, and professional-grade photography for stunning photos and videos.",
  },
  {
    id: 2,
    title: "Imported Smartphones",
    image:
      "https://lh3.googleusercontent.com/ocVnD1tmf7sRKugBcqRxA8H2aFe24DWaSl2P7asZ4Np-kJ-GTo2OVyO1flotM4sQhrhlGHTi0W-VTav7kdoqGESngl3Nb1l4IcY1=e365-pa-nu-s0",
    description:
      "Explore genuine imported smartphones from top international brands at competitive prices with complete quality assurance and excellent customer support.",
  },
  {
    id: 3,
    title: "Box-Pack iPhones",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiYYPRNVbVFX1uoci--qJ8T_LpeX2nOFdO8cVDzFLtCIPT_MFxMWTvqNM&s=10",
    description:
      "Shop brand-new, factory-sealed box-pack iPhones with original accessories, official warranty support, and guaranteed authentic Apple products.",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why Shop With Us</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Discover premium smartphones with guaranteed quality, competitive prices, and trusted
            service.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden h-48 sm:h-56 md:h-64">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-6 sm:leading-7">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;