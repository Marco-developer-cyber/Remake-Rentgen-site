import { useState } from 'react';

const ShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    { name: 'Telegram', icon: '📨', color: 'bg-[#0088CC]' },
    { name: 'Email', icon: '✉️', color: 'bg-[#EA4335]' },
    { name: 'Ссылка', icon: '🔗', color: 'bg-[#00C2D1]' },
  ];

  const handleShare = (method: string) => {
    const reportUrl = `${window.location.origin}/report/${generateId()}`; // Фейковая ссылка
    let shareUrl = '';
    
    switch(method) {
      case 'Telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=Мой рентген-анализ`;
        break;
      case 'Email':
        shareUrl = `mailto:?subject=Рентген-анализ&body=Ссылка на результаты: ${reportUrl}`;
        break;
      default:
        navigator.clipboard.writeText(reportUrl);
        alert('Ссылка скопирована!');
        return;
    }
    
    window.open(shareUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-[#CE67D3] hover:bg-[#CE67D3]/90 text-white px-5 py-2.5 rounded-full transition-all"
      >
        <span className="mr-2">📩</span>
        Поделиться
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A0033] rounded-2xl p-6 max-w-md w-full border border-[#00C2D1]/30">
            <h3 className="text-xl font-bold text-[#00FFF7] mb-4">Поделиться результатами</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option.name)}
                  className={`${option.color} flex flex-col items-center justify-center p-4 rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl mb-1">{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center bg-[#0C0F3A] rounded-lg overflow-hidden">
              <input 
                type="text" 
                value={`${window.location.origin}/report/123`} 
                readOnly
                className="flex-1 bg-transparent p-3 text-gray-300 text-sm truncate"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/report/123`);
                  alert('Ссылка скопирована!');
                }}
                className="bg-[#00C2D1] px-4 py-3 text-[#0C0F3A] font-medium"
              >
                Копировать
              </button>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full py-2 border border-[#00FFF7] text-[#00FFF7] rounded-lg hover:bg-[#00FFF7]/10 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Временная функция для генерации ID
const generateId = () => Math.random().toString(36).substring(2, 9);
export default ShareModal