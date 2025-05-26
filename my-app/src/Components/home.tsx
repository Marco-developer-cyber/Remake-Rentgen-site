import { Link } from "react-router-dom";
import "./Styles/home.css";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageComparisonSlider } from "./homeComponents/ImageComparisonSlider";
import { ProcessSteps } from "./homeComponents/ProcessSteps";
import { Footer } from "./homeComponents/footer";

const Home: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const gradientStyle = {
    background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, 
      rgba(0, 194, 209, 0.2) 0%, 
      rgba(26, 0, 51, 0) 70%)`,
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[#0C0F3A]">
        {/* Космическое видео с эффектом параллакса */}
        <motion.div
          className="video-container absolute inset-0 z-0 overflow-hidden"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source src="/videos/background-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F3A]/90 via-transparent to-[#1A0033]/90" />
        </motion.div>

        {/* Неоновые частицы */}
        <div className="absolute inset-0 z-1 particle-field"></div>

        {/* Динамический градиент (только для десктопов) */}
        <div
          className="cursor-gradient absolute inset-0 z-2 pointer-events-none transition-opacity duration-1000"
          style={gradientStyle}
        />

        {/* Основной контент */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-20 h-screen flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="max-w-2xl"
          >
            {/* Заголовок с эффектом неоновой подсветки */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00C2D1] to-[#CE67D3]"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                textShadow: "0 0 15px rgba(206, 103, 211, 0.5)",
              }}
              transition={{ duration: 1.2, delay: 2.3 }}
            >
              AI Рентген-Анализ
            </motion.h1>

            {/* Подзаголовок с эффектом набора текста */}
            <motion.p
              className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              <span className="inline-block">
                {`Мгновенная диагностика с точностью 98.7%`
                  .split("")
                  .map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.7 + i * 0.03 }}
                    >
                      {char}
                    </motion.span>
                  ))}
              </span>
            </motion.p>

            {/* Интерактивная кнопка */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link to="/uploadImages">
                <button className="relative px-8 py-3 md:px-14 md:py-4 rounded-full bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] text-white text-lg md:text-xl font-semibold overflow-hidden group">
                  <span className="relative z-10">Начать сканирование</span>

                  {/* Эффект сканирования (анимированная полоса) */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-white/30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Свечение при hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
                </button>
              </Link>
            </motion.div>

            {/* Анимированные фишки сервиса */}
            <motion.div
              className="mt-12 md:mt-16 features-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
            >
              {[
                "✓ Точность 98.7%",
                "✓ Мгновенный результат",
                "✓ Безопасно и конфиденциально",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="feature-item"
                  whileHover={{
                    y: -5,
                    borderColor: "#CE67D3",
                    boxShadow: "0 10px 20px rgba(0, 194, 209, 0.2)",
                  }}
                >
                  <p>{feature}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Анимированный скролл-хинт */}
        <motion.div
  className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
>
  <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
    <motion.div
      className="w-1 h-2 bg-cyan-400 rounded-full mt-2"
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
    />
  </div>
</motion.div>
      </div>
      <ImageComparisonSlider/>
      <ProcessSteps/>
      <Footer/>
    </>
  );
};

export default Home;