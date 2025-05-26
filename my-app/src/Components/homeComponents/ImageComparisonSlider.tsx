import { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import { motion } from 'framer-motion';
import '../Styles/ImageComparisonSlider.css'
export const ImageComparisonSlider = () => {
  const cases = [
    {
      before: "/Images/image.jpg",
      after: "/Images/image (1).jpg",
      title: "Пневмония",
      description: "AI выделил зону воспаления (стрелка)"
    },
    {
      before: "/Images/left-leg.png",
      after: "/Images/right-leg.jpg",
      title: "Перелом",
      description: "Обнаружена трещина в лучевой кости"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="comparison-container relative py-20 overflow-hidden">
      {/* Фоновый градиент + частицы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0F3A] to-[#1A0033] opacity-90" />
        <div className="particle-field absolute inset-0" />
      </div>

      {/* Контент */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Результаты сканирования AI
        </motion.h2>

        {/* Кнопки выбора кейса */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {cases.map((caseItem, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-5 py-2 rounded-full text-sm md:text-base transition-all ${
                activeIndex === index
                  ? 'bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] text-[#0C0F3A] font-medium shadow-lg'
                  : 'bg-[#1A0033] text-[#00FFF7] hover:bg-[#00C2D1]/20 border border-[#00C2D1]/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {caseItem.title}
            </motion.button>
          ))}
        </div>

        {/* Слайдер сравнения */}
        <motion.div
          className="relative h-[400px] md:h-[600px] border-2 border-[#00C2D1]/30 rounded-xl overflow-hidden shadow-2xl bg-[#0C0F3A]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <ReactCompareImage
            leftImage={cases[activeIndex].before}
            rightImage={cases[activeIndex].after}
            sliderLineColor="#00C2D1"
            sliderLineWidth={3}
            hover
          />
          
          {/* Подписи */}
          <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm backdrop-blur-sm border border-[#00C2D1]/30">
            <span className="text-[#00FFF7]">Исходный снимок</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-sm backdrop-blur-sm border border-[#CE67D3]/30">
            <span className="text-[#CE67D3]">Диагностика AI</span>
          </div>
        </motion.div>

        {/* Описание кейса */}
        <motion.div 
          className="mt-6 text-center text-[#00FFF7]/90 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-medium">{cases[activeIndex].description}</p>
        </motion.div>
      </div>
    </div>
  );
};