const PrintButton = () => {
    const handlePrint = () => {
      // Можно добавить специальные стили для печати
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Рентген-анализ</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              .print-header { color: #1A0033; margin-bottom: 20px; }
              .diagnosis { color: #d6336c; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2 class="print-header">Результат анализа рентгена</h2>
            <p><strong>Диагноз:</strong> <span class="diagnosis">Перелом правой лучевой кости</span></p>
            <p><strong>Дата:</strong> ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    };
  
    return (
      <button
        onClick={handlePrint}
        className="flex items-center bg-[#0C0F3A] hover:bg-[#0C0F3A]/90 text-[#00FFF7] px-5 py-2.5 rounded-full border border-[#00FFF7]/30 transition-all"
      >
        <span className="mr-2">🖨️</span>
        Распечатать
      </button>
    );
  };
  export default PrintButton