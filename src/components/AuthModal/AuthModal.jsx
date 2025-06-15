import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api';
import './AuthModal.css';

const AuthModal = () => {
  const { showAuthModal, hideAuthModal, login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin) {
        // Validações para cadastro
        if (!formData.name.trim()) {
          setError('Nome é obrigatório');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Senhas não coincidem');
          return;
        }
        if (formData.password.length < 6) {
          setError('Senha deve ter pelo menos 6 caracteres');
          return;
        }
      }

      if (isLogin) {
        // Login
        const data = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (data.user && data.token) {
          login(data.user, data.token);
          hideAuthModal();
        }
      } else {
        // Registro
        const data = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (data.user && data.token) {
          login(data.user, data.token);
          hideAuthModal();
        }
      }
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      setError(error.message || 'Erro no servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="modal-overlay" onClick={hideAuthModal}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
          <button className="close-btn" onClick={hideAuthModal}>×</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  required={!isLogin}
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                type="button" 
                className="toggle-btn"
                onClick={toggleMode}
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="admin-info">
              <small>
                <strong>Admin:</strong> admin@hannover.com / senha: admin123
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 