import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './AdminSettings.css';

const AdminSettings = () => {
  const { user, showNotification } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState({ hasApiKey: false, maskedKey: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar status da chave API
  useEffect(() => {
    if (user?.role === 'admin') {
      loadApiKeyStatus();
    }
  }, [user]);

  const loadApiKeyStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/google-ai-key`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeyStatus(data);
        console.log('Status da API Key:', data);
      } else {
        console.error('Erro ao carregar status da API Key');
        showNotification('Erro ao carregar configurações', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar status da API Key:', error);
      showNotification('Erro ao carregar configurações', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showNotification('Por favor, insira uma chave API válida', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/google-ai-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeyStatus({ hasApiKey: true, apiKey: data.apiKey });
        setApiKey('');
        showNotification('Chave API salva com sucesso!', 'success');
        console.log('API Key salva:', data);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Erro ao salvar chave API', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar API Key:', error);
      showNotification('Erro ao salvar chave API', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    if (!window.confirm('Tem certeza que deseja remover a chave API? O chatbot não funcionará sem ela.')) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/google-ai-key`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setApiKeyStatus({ hasApiKey: false, apiKey: null });
        showNotification('Chave API removida com sucesso!', 'success');
        console.log('API Key removida');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Erro ao remover chave API', 'error');
      }
    } catch (error) {
      console.error('Erro ao remover API Key:', error);
      showNotification('Erro ao remover chave API', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-settings">
        <div className="access-denied">
          <h3>🚫 Acesso Negado</h3>
          <p>Apenas administradores podem acessar as configurações do sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="admin-settings-header">
        <h2>⚙️ Configurações do Sistema</h2>
        <p>Gerencie as configurações globais do sistema</p>
      </div>

      <div className="admin-settings-content">
        {/* Configurações do Chatbot */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3>🤖 Configurações do Chatbot</h3>
            <p>Configure a chave API do Google AI para o funcionamento do chatbot</p>
          </div>

          <div className="settings-section-content">
            {/* Status atual */}
            <div className="api-key-status">
              <div className="status-indicator">
                <span className={`status-dot ${apiKeyStatus.hasApiKey ? 'active' : 'inactive'}`}></span>
                <span className="status-text">
                  {apiKeyStatus.hasApiKey ? 'Chave API configurada' : 'Chave API não configurada'}
                </span>
              </div>
              
              {apiKeyStatus.hasApiKey && apiKeyStatus.apiKey && (
                <div className="api-key-preview">
                  <span className="api-key-masked">{apiKeyStatus.apiKey}</span>
                  <button 
                    className="remove-api-key-btn"
                    onClick={handleRemoveApiKey}
                    disabled={isSaving}
                  >
                    🗑️ Remover
                  </button>
                </div>
              )}
            </div>

            {/* Formulário para adicionar/atualizar chave */}
            <form onSubmit={handleSaveApiKey} className="api-key-form">
              <div className="form-group">
                <label htmlFor="apiKey">Chave API do Google AI</label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Cole sua chave da API do Google AI aqui"
                  className="api-key-input"
                  disabled={isSaving}
                />
                <small className="form-help">
                  Para obter sua chave gratuita, acesse: 
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="help-link"
                  >
                    Google AI Studio
                  </a>
                </small>
              </div>
              
              <button 
                type="submit" 
                className="save-api-key-btn"
                disabled={isSaving || !apiKey.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="loading-spinner"></span>
                    Salvando...
                  </>
                ) : (
                  '💾 Salvar Chave API'
                )}
              </button>
            </form>

            {/* Informações sobre a chave API */}
            <div className="api-key-info">
              <h4>📋 Informações Importantes:</h4>
              <ul>
                <li>✅ A chave API é armazenada de forma segura no servidor</li>
                <li>✅ Apenas administradores podem configurar a chave</li>
                <li>✅ A chave é válida para todo o sistema</li>
                <li>✅ O chatbot funcionará automaticamente com a chave configurada</li>
                <li>⚠️ Mantenha sua chave API segura e não a compartilhe</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Outras configurações futuras */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3>🔮 Configurações Futuras</h3>
            <p>Mais configurações serão adicionadas em breve</p>
          </div>
          
          <div className="coming-soon">
            <div className="coming-soon-item">
              <span className="coming-soon-icon">📧</span>
              <span>Configurações de Email</span>
            </div>
            <div className="coming-soon-item">
              <span className="coming-soon-icon">💳</span>
              <span>Configurações de Pagamento</span>
            </div>
            <div className="coming-soon-item">
              <span className="coming-soon-icon">📊</span>
              <span>Configurações de Analytics</span>
            </div>
            <div className="coming-soon-item">
              <span className="coming-soon-icon">🔔</span>
              <span>Configurações de Notificações</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
