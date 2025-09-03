import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminSettings.css';

const AdminSettings = () => {
  const { showNotification } = useApp();
  const [apiKeyStatus, setApiKeyStatus] = useState({ hasApiKey: false, apiKey: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKeyStatus();
  }, []);

  const loadApiKeyStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_BASE_URL}/api/admin/google-ai-key`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeyStatus(data);
        console.log('Status da API Key carregado:', data);
      } else {
        console.error('Erro ao carregar status da API Key:', response.status);
        showNotification('Erro ao carregar status da API Key', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar status da API Key:', error);
      showNotification('Erro ao carregar status da API Key', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings-container">
        <h2>⚙️ Configurações do Sistema</h2>
        
        <div className="admin-settings-form">
          <h3>Status da Chave API do Google AI</h3>
          <p>A chave API está configurada via variável de ambiente no servidor.</p>
          
          {isLoading ? (
            <div className="loading">Carregando status...</div>
          ) : (
            <div className="api-key-status">
              <div className="status-card">
                <h4>Status Atual</h4>
                <div className="status-info">
                  <span className={`status-indicator ${apiKeyStatus.hasApiKey ? 'active' : 'inactive'}`}>
                    {apiKeyStatus.hasApiKey ? '✅ Ativa' : '❌ Inativa'}
                  </span>
                  {apiKeyStatus.apiKey && (
                    <div className="api-key-preview">
                      <strong>Chave:</strong> {apiKeyStatus.apiKey}
                    </div>
                  )}
                  {apiKeyStatus.message && (
                    <div className="api-key-message">
                      <strong>Info:</strong> {apiKeyStatus.message}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="info-card">
                <h4>ℹ️ Como Configurar</h4>
                <p>Para configurar a chave API do Google AI:</p>
                <ol>
                  <li>Acesse o <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                  <li>Crie uma nova chave API</li>
                  <li>Configure a variável de ambiente <code>GOOGLE_AI_API_KEY</code> no servidor</li>
                  <li>Reinicie o servidor backend</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;