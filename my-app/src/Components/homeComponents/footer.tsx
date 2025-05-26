export const Footer = () => {
    return (
      <footer className="bg-[#0C0F3A] border-t border-[#00C2D1]/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Лого + описание */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] rounded-full flex items-center justify-center text-[#0C0F3A] font-bold">
                  R
                </div>
                <span className="text-2xl font-bold text-white">RentgenAI</span>
              </div>
              <p className="text-[#00FFF7]/70">
                Искусственный интеллект для диагностики медицинских снимков
              </p>
            </div>
  
            {/* Навигация */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#00FFF7]">Навигация</h3>
              <ul className="space-y-2">
                {['Главная', 'Анализ', 'О нас', 'Контакты'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#00FFF7]/80 hover:text-[#CE67D3] transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Контакты */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#00FFF7]">Контакты</h3>
              <ul className="space-y-2">
                <li className="text-[#00FFF7]/80">info@rentgenai.com</li>
                <li className="text-[#00FFF7]/80">+7 (123) 456-7890</li>
              </ul>
            </div>
  
            {/* Соцсети */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#00FFF7]">Подписка</h3>
              <div className="flex space-x-5 mb-4">
  {/* Telegram */}
  <a href="#" aria-label="Telegram" className="text-[#00FFF7] hover:text-[#00C2D1] transition">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM18.115 7.18L16.384 17.896C16.284 18.482 15.934 18.634 15.439 18.368L11.66 15.681L9.838 17.424C9.638 17.624 9.472 17.79 9.089 17.79L9.344 13.939L16.026 7.974C16.308 7.716 15.966 7.574 15.602 7.832L7.521 13.03L3.8 11.908C3.222 11.726 3.212 11.326 3.928 11.042L17.616 6.132C18.102 5.952 18.527 6.244 18.115 7.18Z" fill="currentColor"/>
    </svg>
  </a>

   {/* GitHub */}
  <a href="https://github.com/yourusername" aria-label="GitHub" className="text-[#00FFF7] hover:text-[#00C2D1] transition">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="currentColor" className="opacity-0 group-hover:opacity-10 transition-opacity"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="currentColor" className="group-hover:scale-110 transition-transform"/>
    </svg>
  </a>

  {/* Twitter/X */}
  <a href="#" aria-label="Twitter" className="text-[#00FFF7] hover:text-[#00C2D1] transition">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.901 1.153H22.58L14.541 10.343L24 22.846H16.594L10.794 15.262L4.156 22.846H0.474L9.074 13.016L0 1.154H7.594L12.837 8.086L18.901 1.153ZM17.61 20.644H19.649L6.486 3.24H4.298L17.61 20.644Z" fill="currentColor"/>
    </svg>
  </a>
</div>
            </div>
  
          </div>
  
          {/* Копирайт */}
          <div className="border-t border-[#00C2D1]/10 pt-6 text-center text-[#00FFF7]/60">
            <p>© 2025 RentgenAI. Все права защищены.</p>
          </div>
        </div>
      </footer>
    );
  };