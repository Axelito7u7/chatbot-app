import { useState, useEffect } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const images = [
  'https://th.bing.com/th/id/OIP.O5-IV0ZUZOENNeZDrQ0AwAHaFH?rs=1&pid=ImgDetMain',
  'https://image.freepik.com/vetores-gratis/banner-de-moda-promocional_1188-197.jpg',
  'https://static.vecteezy.com/system/resources/previews/000/662/990/large_2x/vector-fashion-banner-design.jpg',
  'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/93789a50700333.58d7586f2ced4.png'
];

export default function BannerWithCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative h-80"> {/* Ajusta la altura aquí */}
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
        >
          <HiArrowLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
        >
          <HiArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
