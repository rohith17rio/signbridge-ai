import { useApp } from '../context/AppContext';

export const useBackendHealth = () => {
  const { backendHealth, refreshBackendHealth } = useApp();

  return {
    ...backendHealth,
    refreshBackendHealth,
  };
};
