import React, { useEffect } from 'react';

const LegacyPage = () => {
  useEffect(() => {
    // Redireciona para o arquivo HTML
    window.location.href = '/index.html';
  }, []);

  return null;
};

export default LegacyPage;