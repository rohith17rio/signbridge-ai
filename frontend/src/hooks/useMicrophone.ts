import { useMedia } from '../context/MediaContext';

export const useMicrophone = () => {
  const {
    microphoneState,
    startMicrophone,
    stopMicrophone,
    switchMicrophone,
  } = useMedia();

  return {
    ...microphoneState,
    startMicrophone,
    stopMicrophone,
    switchMicrophone,
  };
};
