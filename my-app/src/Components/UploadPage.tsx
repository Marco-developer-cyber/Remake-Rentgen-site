import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/UploadPage.css";
import { apiService, validateImageFile, type PatientData } from "../services/api";

const UploadMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    doctorName: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      
      if (!validation.isValid) {
        setErrorMessage(validation.error || "Неверный формат файла");
        return;
      }
      
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setErrorMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = validateImageFile(droppedFile);
      
      if (!validation.isValid) {
        setErrorMessage(validation.error || "Неверный формат файла");
        return;
      }
      
      setSelectedFile(droppedFile);
      setFileUrl(URL.createObjectURL(droppedFile));
      setErrorMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage("");
  };

  const handleNext = async () => {
    if (!patientData.firstName || !patientData.lastName || !patientData.age || !patientData.doctorName) {
      setErrorMessage("Пожалуйста, заполните все поля перед продолжением.");
      return;
    }

    if (!selectedFile || !fileUrl) {
      setErrorMessage("Пожалуйста, загрузите файл перед продолжением.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const patientApiData: PatientData = {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        age: parseInt(patientData.age),
        doctorName: patientData.doctorName
      };

      const analysisResult = await apiService.analyzeXray(selectedFile, patientApiData);

      if (analysisResult.success && analysisResult.analysis) {
        navigate("/results", { 
          state: { 
            file: selectedFile, 
            fileUrl, 
            metadata: {
              name: patientData.firstName,
              surname: patientData.lastName,
              age: patientData.age,
              doctor: patientData.doctorName
            },
            analysis: analysisResult.analysis,
            serverImageUrl: analysisResult.imageUrl
          } 
        });
      } else {
        setErrorMessage(analysisResult.error || "Ошибка при анализе снимка");
      }
    } catch (error) {
      console.error("Ошибка анализа:", error);
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка при анализе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`upload-container ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <h2 className="title">
          <span className="gradient-text">Медицинский анализ</span>{" "}
          <span className="text-white">снимков</span>
        </h2>

        <div className="data-form">
          <div className="name-row">
            <div className="input-field">
              <input
                type="text"
                name="firstName"
                value={patientData.firstName}
                onChange={handleInputChange}
                placeholder=" "
              />
              <label>Имя</label>
              <div className="underline"></div>
            </div>
            
            <div className="input-field">
              <input
                type="text"
                name="lastName"
                value={patientData.lastName}
                onChange={handleInputChange}
                placeholder=" "
              />
              <label>Фамилия</label>
              <div className="underline"></div>
            </div>
          </div>

          <div className="input-field">
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleInputChange}
              placeholder=" "
              className="no-spinner"
            />
            <label>Возраст</label>
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input
              type="text"
              name="doctorName"
              value={patientData.doctorName}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label>Лечащий врач</label>
            <div className="underline"></div>
          </div>
        </div>

        <div
          className="drop-zone"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <div className="drop-content">
            <svg className="upload-icon" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="drop-text">
              {isDragging ? "Отпустите файл" : "Нажмите или перетащите файл"}
            </p>
            <p className="drop-hint">Поддерживаются JPG, PNG, DICOM</p>
            {selectedFile && <p className="file-loaded">Файл загружен: {selectedFile.name}</p>}
          </div>
        </div>

        <button
          onClick={handleNext}
          className={`next-button ${isLoading ? "loading" : ""}`}
          disabled={!patientData.firstName || !patientData.lastName || !patientData.age || !patientData.doctorName || !selectedFile || isLoading}
        >
          <span className="button-content">
            {isLoading ? (
              <>
                <span>Анализируем</span>
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </>
            ) : (
              "Анализ"
            )}
          </span>
          {isLoading && <span className="liquid-effect"></span>}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          id="fileInput"
          type="file"
          accept="image/*,.dcm"
          onChange={handleFileChange}
          className="hidden-input"
        />
      </div>
    </div>
  );
};

export default UploadMenu;