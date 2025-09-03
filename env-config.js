// Configuração de ambiente para desenvolvimento
export const API_CONFIG = {
  // URL do backend local
  LOCAL: 'http://localhost:3002',
  
  // URL do backend em produção
  PRODUCTION: 'https://hannover-backend.onrender.com',
  
  // URL atual (com fallback)
  get CURRENT() {
    return import.meta.env.VITE_API_URL || this.LOCAL;
  }
};

// Log da configuração atual
console.log('🔧 API Config:', API_CONFIG.CURRENT);
