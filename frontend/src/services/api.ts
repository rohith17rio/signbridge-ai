import { logger } from './logger';

export const API_BASE_URL = 'http://localhost:8000';

export interface HealthApiResponse {
  status: string;
  version: string;
  uptime: number;
  timestamp: string;
}

export const checkBackendHealth = async (): Promise<HealthApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    return await response.json();
  } catch (err: any) {
    logger.error('Backend health check failed:', err.message);
    throw err;
  }
};

export const processVisionMock = async (cameraId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/vision/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ camera_id: cameraId }),
  });
  return response.json();
};

export const processSpeechMock = async (language: string) => {
  const response = await fetch(`${API_BASE_URL}/api/speech/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language }),
  });
  return response.json();
};

export const processTranslationMock = async (sourceText: string, targetLang: string) => {
  const response = await fetch(`${API_BASE_URL}/api/translation/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_text: sourceText, target_lang: targetLang }),
  });
  return response.json();
};

export const triggerTrainMock = async (datasetName: string, epochs: number) => {
  const response = await fetch(`${API_BASE_URL}/api/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_name: datasetName, epochs }),
  });
  return response.json();
};
