import { motion } from 'framer-motion';

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#00C2D1" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Загрузка снимка",
    description: "DICOM, JPG, PNG или DICOM файлы"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#CE67D3" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Анализ AI",
    description: "Точность 98.7% за 2-5 секунд"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#00FFF7" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Отчет",
    description: "С выделенными аномалиями"
  }
];

export const ProcessSteps = () => {
  return (
    <div className="bg-gradient-to-b from-[#0C0F3A] to-[#1A0033] py-20 px-4">
      <motion.h2
        className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Как это работает?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-[#1A0033]/80 backdrop-blur-sm p-8 rounded-xl border border-[#00C2D1]/20 hover:border-[#CE67D3]/40 transition-all h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 30px rgba(0, 194, 209, 0.3)"
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-[#0C0F3A] rounded-full border border-[#00C2D1]/30">
                {step.icon}
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center text-[#00FFF7]">{step.title}</h3>
            <p className="text-[#00FFF7]/80 text-center">{step.description}</p>
            
            <div className="mt-8 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] flex items-center justify-center text-[#0C0F3A] font-bold">
                {index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};