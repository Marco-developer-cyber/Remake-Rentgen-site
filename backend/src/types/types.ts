export interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  doctorName: string;
}

export interface XrayAnalysisRequest {
  imagePath: string;
  patientData: PatientData;
}

export interface DiagnosisItem {
  text: string;
  confidence: number;
}

export interface RecommendationItem {
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SimilarCase {
  id: number;
  imageUrl: string;
  diagnosis: string;
  match: number;
  description: string;
}

export interface XrayAnalysis {
  diagnosis: DiagnosisItem[];
  recommendations: RecommendationItem[];
  similarCases: SimilarCase[];
  confidence: number;
  analysisDate: string;
}

export interface XrayAnalysisResponse {
  success: boolean;
  analysis?: XrayAnalysis;
  imageUrl?: string;
  timestamp: string;
  processingTime?: string;
  error?: string;
  details?: string;
}

export interface AIApiResponse {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  findings: string[];
}

// Дополнительные типы для API ответов
export interface ApiResponse {
  success: boolean;
  timestamp: string;
  error?: string;
  details?: string;
}

export interface SimilarCasesResponse extends ApiResponse {
  similarCases?: SimilarCase[];
}

export interface DetailedAnalysisResponse extends ApiResponse {
  detailedAnalysis?: string;
}

export interface StatsResponse extends ApiResponse {
  stats?: {
    totalAnalyses: number;
    huggingFaceEnabled: boolean;
    serverUptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    nodeVersion: string;
  };
}

export interface CleanupResponse extends ApiResponse {
  message?: string;
  deletedCount?: number;
}
