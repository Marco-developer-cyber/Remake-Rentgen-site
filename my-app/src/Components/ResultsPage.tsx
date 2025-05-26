import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./Styles/result.css";
import Comments from "./UploadButtons/Comments";
import {
  formatConfidence,
  getPriorityColor,
  apiService,
  // type XrayAnalysis,
  type SimilarCase,
  type DiagnosisItem,
  type RecommendationItem,
} from "../services/api";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>("");
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { fileUrl, metadata, analysis, serverImageUrl } = location.state || {};
  console.log("Metadata in ResultsPage:", metadata);
  console.log("Analysis in ResultsPage:", analysis);

  useEffect(() => {
    const loadSimilarCases = async () => {
      try {
        if (analysis?.similarCases && analysis.similarCases.length > 0) {
          setSimilarCases(analysis.similarCases);
        } else {
          const cases = await apiService.getSimilarCases("default");
          setSimilarCases(cases);
        }
      } catch (error) {
        console.error("Ошибка загрузки похожих случаев:", error);
      }
      
      setSimilarCases([
        {
          id: 1,
          imageUrl: "https://www.ckbran.ru/upload/medialibrary/10b/r1kwcbrmtwpm04pi5zccep60ecjtuk83.jpg",
          diagnosis: "Перелом лучевой кости",
          match: 88,
          description: "Классический перелом дистального отдела",
        },
        {
          id: 2,
          imageUrl: "https://www.dikul.net/files/images/wiki/osteoartroz4.jpg",
          diagnosis: "Остеоартрит 2 степени",
          match: 76,
          description: "Сужение суставной щели, остеофиты",
        },
        {
          id: 3,
          imageUrl: "https://cs12.pikabu.ru/post_img/big/2022/08/15/4/1660537276129999906.jpg",
          diagnosis: "Трещина кости",
          match: 42,
          description: "Линейный перелом без смещения",
        },
      ]);
    };

    loadSimilarCases();
  }, [analysis]);

  const handleGetDetailedAnalysis = async () => {
    if (!analysis?.diagnosis || analysis.diagnosis.length === 0) {
      alert("Нет данных для детального анализа");
      return;
    }

    setIsLoadingDetails(true);
    try {
      const sortedDiagnosis = [...analysis.diagnosis].sort((a, b) => b.confidence - a.confidence);
      const findings = sortedDiagnosis.map((d: DiagnosisItem) => d.text);
      const detailed = await apiService.getDetailedAnalysis(serverImageUrl || "", findings);
      const formattedDetailed = `Детальный анализ:\n\nДиагнозы (по убыванию уверенности):\n${sortedDiagnosis
        .map((d, index) => `${index + 1}. ${d.text} (${formatConfidence(d.confidence)})`)
        .join('\n')}\n\nДополнительная информация:\n${detailed}`;
      setDetailedAnalysis(formattedDetailed);
      setShowDetailedAnalysis(true);
    } catch (error) {
      console.error("Ошибка получения детального анализа:", error);
      alert("Не удалось получить детальный анализ");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleShare = (method: "telegram" | "copy") => {
    const reportUrl = `${window.location.origin}/report/${Date.now()}`;
    if (method === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=Мой%20рентген-анализ%20${metadata?.surname || "Пациент"}`
      );
    } else {
      navigator.clipboard.writeText(reportUrl);
      alert("Ссылка скопирована в буфер обмена!");
    }
    setShowShareModal(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const input = pdfRef.current;
      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2, // Увеличение качества
        useCORS: true, // Для загрузки внешних изображений
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const fileName = `Рентген_анализ_${metadata?.surname || "Пациент"}_${new Date().toLocaleDateString("ru-RU").replace(/\./g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert("Не удалось создать PDF");
    }
  };

  const handleBack = () => {
    navigate("/uploadImages");
  };

  return (
    <div className="backGround">
      <div className="results-page" ref={pdfRef}>
        <div className="patient-header">
          <div className="patient-info-grid">
            <div className="patient-info-item">
              <span className="info-label">Пациент:</span>
              <span className="info-value">
                {metadata?.surname || "Не указано"}{" "}
                {metadata?.name || "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Возраст:</span>
              <span className="info-value">
                {metadata?.age ? `${metadata.age} лет` : "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Врач:</span>
              <span className="info-value">
                {metadata?.doctor || "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Дата исследования:</span>
              <span className="info-value">
                {new Date().toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleBack} className="back-button">
          <svg className="back-icon" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </button>

        <div className="results-grid">
          <div className="image-section">
            <h3 className="section-title">Рентгеновский снимок</h3>
            {fileUrl && (
              <img
                src={fileUrl}
                alt="Рентгеновский снимок"
                className="xray-image"
              />
            )}
          </div>

          <div className="diagnosis-section">
            <h2 className="diagnosis-title">
              <span className="gradient-text">Заключение</span>{" "}
              врача-рентгенолога
            </h2>

            <div className="diagnosis-card">
              <h3 className="card-title">Основной диагноз</h3>
              {analysis?.confidence && (
                <div className="confidence-indicator">
                  <span>
                    Уверенность: {formatConfidence(analysis.confidence)}
                  </span>
                </div>
              )}
              <ul className="diagnosis-list">
                {analysis?.diagnosis && analysis.diagnosis.length > 0 ? (
                  [...analysis.diagnosis]
                    .sort((a, b) => b.confidence - a.confidence)
                    .map((item: DiagnosisItem, index: number) => (
                      <li key={index} className="diagnosis-item">
                        <span className="bullet">•</span>
                        {item.text}
                        <span className="confidence-badge">
                          {formatConfidence(item.confidence)}
                        </span>
                      </li>
                    ))
                ) : (
                  <>
                    <li className="diagnosis-item">
                      <span className="bullet">•</span>
                      Перелом дистального отдела лучевой кости
                      <span className="confidence-badge">85%</span>
                    </li>
                    <li className="diagnosis-item">
                      <span className="bullet">•</span>
                      Деформация костной структуры
                      <span className="confidence-badge">75%</span>
                    </li>
                    <li className="diagnosis-item">
                      <span className="bullet">•</span>
                      Остеоартрит лучезапястного сустава 1-2 степени
                      <span className="confidence-badge">72%</span>
                    </li>
                    <li className="diagnosis-item">
                      <span className="bullet">•</span>
                      Признаки остеопороза
                      <span className="confidence-badge">68%</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="recommendations-card">
              <h3 className="card-title">Рекомендации</h3>
              <ul className="recommendations-list">
                {analysis?.recommendations && analysis.recommendations.length > 0 ? (
                  [...analysis.recommendations]
                    .sort((a, b) => {
                      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((rec: RecommendationItem, index: number) => (
                      <li key={index} className="recommendation-item">
                        <span
                          className="bullet"
                          style={{ color: getPriorityColor(rec.priority) }}
                        >
                          •
                        </span>
                        {rec.text}
                        <span
                          className={`priority-badge priority-${rec.priority}`}
                        >
                          {rec.priority === "high"
                            ? "Высокий"
                            : rec.priority === "medium"
                            ? "Средний"
                            : "Низкий"}
                        </span>
                      </li>
                    ))
                ) : (
                  <>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#ff4444" }}>•</span>
                      Консультация травматолога-ортопеда
                      <span className="priority-badge priority-high">Высокий</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#ff4444" }}>•</span>
                      Гипсовая иммобилизация сроком на 4-6 недель
                      <span className="priority-badge priority-high">Высокий</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#ff8800" }}>•</span>
                      Контрольный снимок через 10-14 дней
                      <span className="priority-badge priority-medium">Средний</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#ff8800" }}>•</span>
                      Физиотерапевтические процедуры после снятия гипса
                      <span className="priority-badge priority-medium">Средний</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#88cc00" }}>•</span>
                      Прием препаратов кальция и витамина D
                      <span className="priority-badge priority-low">Низкий</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#88cc00" }}>•</span>
                      Ограничение физических нагрузок на 2-3 месяца
                      <span className="priority-badge priority-low">Низкий</span>
                    </li>
                    <li className="recommendation-item">
                      <span className="bullet" style={{ color: "#ff8800" }}>•</span>
                      МРТ при отсутствии положительной динамики
                      <span className="priority-badge priority-medium">Средний</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="detailed-analysis-section">
              <button
                onClick={handleGetDetailedAnalysis}
                disabled={isLoadingDetails}
                className="detailed-analysis-button"
              >
                {isLoadingDetails ? "Загрузка..." : "Получить детальный анализ"}
              </button>
            </div>
          </div>
        </div>

        {showDetailedAnalysis && (
          <div className="detailed-analysis-modal-overlay">
            <div className="detailed-analysis-modal">
              <div className="modal-header">
                <h3 className="modal-title">Детальный анализ</h3>
                <button
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="close-detailed-modal"
                >
                  ✕
                </button>
              </div>
              <div className="detailed-analysis-content">
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Times New Roman, serif", fontSize: "14px" }}>
                  {detailedAnalysis}
                </pre>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="close-detailed-button"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="similar-cases">
          <h3 className="similar-title">Сравнение с аналогичными случаями</h3>
          <div className="cases-list">
            {similarCases.map((caseItem) => (
              <div key={caseItem.id} className="case-card">
                <div className="case-image-container">
                  <img
                    src={caseItem.imageUrl}
                    alt={caseItem.diagnosis}
                    className="case-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgNWEyIDIgMCAwIDEgMi0yaDEyYTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg2YTIgMiAwIDAgMS0yLTJWNXptMTIgMGEyIDIgMCAxIDAtNCAwIDIgMiAwIDAgMCA0IDB6Ii8+PC9zdmc+";
                    }}
                  />
                </div>
                <div className="case-details">
                  <h4 className="case-diagnosis">{caseItem.diagnosis}</h4>
                  <p className="case-description">{caseItem.description}</p>
                  <div className="match-container">
                    <div
                      className="match-bar"
                      style={{ width: `${caseItem.match}%` }}
                    ></div>
                    <span className="match-percent">
                      Совпадение: {caseItem.match}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleDownloadPDF}
            className="action-button save-button"
          >
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M19 8h-4V3H9v5H5l7 7 7-7zM5 19v2h14v-2H5z" />
            </svg>
            <span className="button-text">Сохранить PDF</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="action-button share-button"
          >
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="button-text">Поделиться</span>
          </button>

          <button
            onClick={() => window.print()}
            className="action-button print-button"
          >
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
            <span className="button-text text-white">Печать</span>
          </button>
        </div>

        {showShareModal && (
          <div className="share-modal-overlay">
            <div className="share-modal">
              <h3 className="modal-title">Поделиться результатами</h3>
              <p className="modal-subtitle">
                Для пациента: {metadata?.surname || "Не указано"}{" "}
                {metadata?.name || "Не указано"}
              </p>
              <div className="share-options">
                <button
                  onClick={() => handleShare("telegram")}
                  className="share-option telegram"
                >
                  <svg className="share-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                  Отправить в Telegram
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="share-option copy-link"
                >
                  <svg className="share-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  <p className="text-white">Копировать ссылку</p>
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="close-modal"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
      <Comments initialUsername={metadata?.name || "Не указано"} />
    </div>
  );
};

export default ResultsPage;