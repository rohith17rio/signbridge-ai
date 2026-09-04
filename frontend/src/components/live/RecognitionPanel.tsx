import React from 'react';
import { UnifiedChatBox } from './UnifiedChatBox';

interface RecognitionPanelProps {
  lastLandmarks?: any[];
}

export const RecognitionPanel: React.FC<RecognitionPanelProps> = () => {
  return <UnifiedChatBox />;
};
