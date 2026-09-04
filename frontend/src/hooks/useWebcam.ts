import { useMedia } from '../context/MediaContext';

export const useWebcam = () => {
  const {
    cameraState,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
  } = useMedia();

  return {
    ...cameraState,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
  };
};
