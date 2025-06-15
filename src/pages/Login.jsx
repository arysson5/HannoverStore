import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { authService } from "../services/api";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, showNotification } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Limpar erro quando usuário digita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 handleSubmit chamado');
    console.log('🔍 Event:', e);
    console.log('🔍 FormData:', formData);
    
    setLoading(true);
    setError("");

    try {
      console.log('🔍 Fazendo login através do authService');
      
      const data = await authService.login(formData);
      console.log('🔍 Response data:', data);

      login(data.user, data.token);
      showNotification("Login realizado com sucesso!", "success");
      navigate("/"); // Redirecionar para home
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setError(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <h2>Que bom ter você aqui!</h2>
          <p className="auth-subtitle">Entre rapidamente colocando seu login</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-label">Informe seu e-mail</div>
            <input 
              type="email" 
              name="email"
              className="auth-input" 
              placeholder="E-mail" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="input-label">Informe sua senha</div>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="auth-input" 
                placeholder="Senha" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            
            <div className="forgot-password">Esqueci minha senha</div>
            
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          
          <Link to="/register">
            <button className="auth-button secondary">Criar conta agora</button>
          </Link>
          
          <div className="social-login">
            <button className="google-login">
              <svg className="google-icon" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Entrar com o Google
            </button>
          </div>
          
          <div className="terms">
            Termos de uso <span>©</span>
          </div>
        </div>
        <div className="auth-image">
          <img src="/chuteira_nike.jpg" alt="Sneakers" />
        </div>
      </div>
    </div>
  );
};

export default Login; 