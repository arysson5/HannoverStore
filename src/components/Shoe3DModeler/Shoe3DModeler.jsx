import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import './Shoe3DModeler.css';

const Shoe3DModeler = ({ product, onClose }) => {
  const { showNotification } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [footDetected, setFootDetected] = useState(false);
  const [shoeModel, setShoeModel] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelContainerRef = useRef(null);

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                            window.innerWidth <= 768 ||
                            'ontouchstart' in window;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Inicializar câmera
  const initializeCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste dispositivo');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Câmera frontal
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsActive(true);
      showNotification('Câmera ativada! Posicione seu pé na tela', 'info');
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      showNotification('Erro ao acessar câmera. Verifique as permissões.', 'error');
    }
  };

  // Detectar pé usando visão computacional simplificada
  const detectFoot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Configurar canvas com as mesmas dimensões do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obter dados da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Algoritmo simplificado de detecção de pé
    // Procura por áreas com tons de pele (tons de rosa/bege)
    let footPixels = 0;
    let footCenterX = 0;
    let footCenterY = 0;
    let totalFootX = 0;
    let totalFootY = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detectar tons de pele (simplificado)
      if (r > 100 && g > 80 && b > 60 && r > g && g > b) {
        footPixels++;
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        totalFootX += x;
        totalFootY += y;
      }
    }

    // Se detectou área suficiente de "pele"
    if (footPixels > 1000) {
      footCenterX = totalFootX / footPixels;
      footCenterY = totalFootY / footPixels;
      
      setFootDetected(true);
      setShoeModel({
        x: footCenterX,
        y: footCenterY,
        scale: Math.sqrt(footPixels) / 50 // Escala baseada no tamanho detectado
      });

      // Desenhar indicador visual
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(footCenterX, footCenterY, 50, 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      ctx.fillText('Pé Detectado!', footCenterX - 40, footCenterY - 60);
      
      showNotification('Pé detectado! Visualizando tênis 3D', 'success');
    } else {
      setFootDetected(false);
      setShoeModel(null);
    }
  }, [showNotification]);

  // Loop de detecção
  useEffect(() => {
    let detectionInterval;
    
    if (isActive && cameraStream) {
      detectionInterval = setInterval(() => {
        if (!isDetecting) {
          setIsDetecting(true);
          detectFoot();
          setTimeout(() => setIsDetecting(false), 100);
        }
      }, 500); // Detectar a cada 500ms
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, cameraStream, isDetecting, detectFoot]);

  // Parar câmera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsActive(false);
    setFootDetected(false);
    setShoeModel(null);
  };

  // Fechar modal
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Renderizar modelo 3D do tênis
  const renderShoe3D = useCallback(() => {
    if (!shoeModel || !modelContainerRef.current) return;

    const container = modelContainerRef.current;
    container.innerHTML = '';

    // Criar elemento 3D simplificado usando CSS 3D transforms
    const shoeElement = document.createElement('div');
    shoeElement.className = 'shoe-3d-model';
    shoeElement.style.cssText = `
      position: absolute;
      left: ${shoeModel.x - 30}px;
      top: ${shoeModel.y - 40}px;
      width: 60px;
      height: 80px;
      background: linear-gradient(45deg, #333, #666);
      border-radius: 10px 10px 20px 20px;
      transform: perspective(500px) rotateX(15deg) rotateY(10deg);
      box-shadow: 0 10px 20px rgba(0,0,0,0.3);
      border: 2px solid #fff;
      z-index: 1000;
    `;

    // Adicionar detalhes do tênis
    const shoeDetails = document.createElement('div');
    shoeDetails.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      height: 20px;
      background: #555;
      border-radius: 5px;
    `;
    shoeElement.appendChild(shoeDetails);

    const shoeLaces = document.createElement('div');
    shoeLaces.style.cssText = `
      position: absolute;
      top: 30px;
      left: 15px;
      right: 15px;
      height: 2px;
      background: #fff;
      border-radius: 1px;
    `;
    shoeElement.appendChild(shoeLaces);

    const shoeLaces2 = document.createElement('div');
    shoeLaces2.style.cssText = `
      position: absolute;
      top: 35px;
      left: 15px;
      right: 15px;
      height: 2px;
      background: #fff;
      border-radius: 1px;
    `;
    shoeElement.appendChild(shoeLaces2);

    container.appendChild(shoeElement);

    // Animação de entrada
    shoeElement.style.opacity = '0';
    shoeElement.style.transform = 'perspective(500px) rotateX(15deg) rotateY(10deg) scale(0.5)';
    
    setTimeout(() => {
      shoeElement.style.transition = 'all 0.5s ease-out';
      shoeElement.style.opacity = '1';
      shoeElement.style.transform = 'perspective(500px) rotateX(15deg) rotateY(10deg) scale(1)';
    }, 100);
  }, [shoeModel]);

  // Renderizar modelo 3D quando detectado
  useEffect(() => {
    if (footDetected && shoeModel) {
      renderShoe3D();
    }
  }, [footDetected, shoeModel, renderShoe3D]);

  if (!isMobile) {
    return (
      <div className="shoe-3d-modal">
        <div className="shoe-3d-content">
          <div className="shoe-3d-header">
            <h3>Modelagem 3D de Calçados</h3>
            <button className="close-btn" onClick={handleClose}>✕</button>
          </div>
          <div className="shoe-3d-body">
            <div className="mobile-only-message">
              <div className="mobile-icon">📱</div>
              <h4>Funcionalidade Disponível Apenas em Dispositivos Móveis</h4>
              <p>Esta funcionalidade requer acesso à câmera e é otimizada para dispositivos móveis.</p>
              <p>Abra este site em seu celular ou tablet para experimentar a modelagem 3D!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shoe-3d-modal">
      <div className="shoe-3d-content">
        <div className="shoe-3d-header">
          <h3>Modelagem 3D - {product?.name || 'Tênis'}</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        
        <div className="shoe-3d-body">
          {!isActive ? (
            <div className="camera-setup">
              <div className="setup-icon">👟📱</div>
              <h4>Experimente o Tênis em 3D!</h4>
              <p>Posicione seu pé na câmera e veja como o tênis fica em você</p>
              <button className="start-camera-btn" onClick={initializeCamera}>
                🎥 Ativar Câmera
              </button>
              <div className="instructions">
                <h5>Instruções:</h5>
                <ul>
                  <li>Permita o acesso à câmera</li>
                  <li>Posicione seu pé na tela</li>
                  <li>O sistema detectará automaticamente</li>
                  <li>Veja o tênis em 3D sobre seu pé</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="camera-view">
              <div className="video-container">
                <video
                  ref={videoRef}
                  className="camera-video"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="detection-canvas"
                  style={{ display: 'none' }}
                />
                <div ref={modelContainerRef} className="model-container" />
                
                {footDetected && (
                  <div className="detection-status success">
                    ✅ Pé detectado! Visualizando tênis 3D
                  </div>
                )}
                
                {!footDetected && (
                  <div className="detection-status waiting">
                    👣 Posicione seu pé na tela...
                  </div>
                )}
              </div>
              
              <div className="camera-controls">
                <button className="stop-camera-btn" onClick={stopCamera}>
                  🛑 Parar Câmera
                </button>
                <button className="retry-detection-btn" onClick={detectFoot}>
                  🔄 Detectar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shoe3DModeler;
