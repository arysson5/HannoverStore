import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import './Shoe3DModeler.css';

const Shoe3DModeler = ({ product, onClose }) => {
  const { showNotification } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [footDetected, setFootDetected] = useState(false);
  const [shoeModel, setShoeModel] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' = frontal, 'environment' = traseira
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelContainerRef = useRef(null);

  // Detectar se é dispositivo móvel e compatível
  useEffect(() => {
    const checkCompatibility = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                            window.innerWidth <= 768 ||
                            'ontouchstart' in window;
      
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      // Verificar se é um dispositivo móvel real (não apenas tela pequena)
      const isRealMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.log('🔍 Verificação de compatibilidade 3D:', {
        isMobileDevice,
        isRealMobile,
        hasCamera,
        isHTTPS,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        touchSupport: 'ontouchstart' in window
      });
      
      // Para 3D, preferir dispositivos móveis reais com câmera
      setIsMobile(isRealMobile && hasCamera && isHTTPS);
    };
    
    checkCompatibility();
    window.addEventListener('resize', checkCompatibility);
    window.addEventListener('orientationchange', checkCompatibility);
    
    return () => {
      window.removeEventListener('resize', checkCompatibility);
      window.removeEventListener('orientationchange', checkCompatibility);
    };
  }, []);

  // Inicializar câmera
  const initializeCamera = async (facingMode = cameraFacing) => {
    try {
      console.log('🚀 Iniciando câmera...', { facingMode });
      setIsInitializing(true);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste dispositivo');
      }

      // Configuração otimizada para inicialização rápida
      const constraints = {
        video: {
          facingMode: facingMode, // Câmera frontal ou traseira
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 }
        }
      };

      console.log('📹 Solicitando acesso à câmera...', constraints);
      
      // Timeout para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Câmera demorou muito para responder')), 10000);
      });

      // Usar configuração mais simples para inicialização rápida
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraints),
        timeoutPromise
      ]);
      
      console.log('✅ Stream da câmera obtido:', stream);

      // Guardar o stream e ativar a view; o vídeo será configurado no efeito abaixo
      setCameraStream(stream);
      setIsActive(true);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setIsInitializing(false);
      
      let errorMessage = 'Erro ao acessar câmera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Permissão negada. Permita o acesso à câmera.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Câmera não encontrada.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Câmera não suportada.';
      } else {
        errorMessage += 'Verifique as permissões.';
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  // Trocar entre câmera frontal e traseira
  const switchCamera = async () => {
    try {
      console.log('🔄 Trocando câmera...');
      
      // Parar stream atual
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      // Determinar nova câmera
      const newFacingMode = cameraFacing === 'user' ? 'environment' : 'user';
      setCameraFacing(newFacingMode);
      
      // Reinicializar com nova câmera
      await initializeCamera(newFacingMode);
      
      showNotification(
        newFacingMode === 'user' ? '📱 Câmera frontal ativada' : '📷 Câmera traseira ativada', 
        'info'
      );
    } catch (error) {
      console.error('Erro ao trocar câmera:', error);
      showNotification('Erro ao trocar câmera', 'error');
    }
  };

  // Quando a view estiver ativa e o stream disponível, configurar o elemento de vídeo
  useEffect(() => {
    if (!isActive || !cameraStream) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Verificar se já foi configurado para evitar loops
    if (videoEl.srcObject === cameraStream) {
      console.log('📹 Vídeo já configurado, pulando...');
      return;
    }

    try {
      console.log('📹 Configurando elemento de vídeo com stream...');
      videoEl.srcObject = cameraStream;
      
      const handleLoadedMetadata = () => {
        console.log('📹 Metadados carregados, iniciando reprodução...');
        videoEl.play()
          .then(() => {
            console.log('📹 Vídeo iniciado com sucesso');
            setIsInitializing(false);
            showNotification('📱 Câmera ativada! Posicione seu pé na tela', 'info');
          })
          .catch((error) => {
            console.error('❌ Erro ao iniciar vídeo:', error);
            setIsInitializing(false);
            showNotification('Erro ao iniciar câmera', 'error');
          });
      };

      const handleError = (error) => {
        console.error('❌ Erro no elemento de vídeo:', error);
        setIsInitializing(false);
        showNotification('Erro no elemento de vídeo', 'error');
      };

      videoEl.onloadedmetadata = handleLoadedMetadata;
      videoEl.onerror = handleError;

      // Cleanup function
      return () => {
        videoEl.onloadedmetadata = null;
        videoEl.onerror = null;
      };
    } catch (e) {
      console.error('❌ Falha ao configurar vídeo:', e);
      setIsInitializing(false);
    }
  }, [isActive, cameraStream, showNotification]);

  // Detectar pé usando visão computacional simplificada
  const detectFoot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Verificação rápida - só processar se vídeo tem dimensões válidas
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return; // Silencioso para não poluir console
    }

    // Configurar canvas com as mesmas dimensões do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Desenhar frame atual do vídeo no canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obter dados da imagem
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

    // Algoritmo otimizado de detecção de pé para mobile
    let footPixels = 0;
    let footCenterX = 0;
    let footCenterY = 0;
    let totalFootX = 0;
    let totalFootY = 0;

    // Amostrar apenas uma parte da imagem para melhor performance
    const step = 6; // Processar a cada 6 pixels (balanceado)
    const minPixels = Math.max(800, (canvas.width * canvas.height) / 1000); // Mínimo maior para detecção mais precisa

    // Focar na parte inferior da tela onde o pé deve estar
    const focusArea = {
      startY: Math.floor(canvas.height * 0.3), // Começar a partir de 30% da altura
      endY: canvas.height,
      startX: Math.floor(canvas.width * 0.1),  // Margens laterais
      endX: Math.floor(canvas.width * 0.9)
    };

    for (let y = focusArea.startY; y < focusArea.endY; y += step) {
      for (let x = focusArea.startX; x < focusArea.endX; x += step) {
        const i = (y * canvas.width + x) * 4;
        if (i >= data.length) continue;
        
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detectar tons de pele mais preciso
        const isSkinTone = (
          r > 80 && r < 255 &&
          g > 40 && g < 200 &&
          b > 20 && b < 180 &&
          r > g && g > b &&
          (r - g) > 10 &&
          (g - b) > 5 &&
          r > 120 // Mais restritivo para tons de pele
        );

        if (isSkinTone) {
          footPixels++;
          totalFootX += x;
          totalFootY += y;
        }
      }
    }

    // Threshold mais rigoroso
    const threshold = Math.max(minPixels, (canvas.width * canvas.height) / 800);

    // Se detectou área suficiente de "pele"
    if (footPixels > threshold) {
      footCenterX = totalFootX / footPixels;
      footCenterY = totalFootY / footPixels;
      
      setFootDetected(true);
      setShoeModel({
        x: footCenterX,
        y: footCenterY,
        scale: Math.min(Math.max(Math.sqrt(footPixels) / 40, 0.5), 2.0) // Escala limitada
      });

      // Desenhar indicador visual otimizado
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(footCenterX, footCenterY, Math.min(40, canvas.width / 20), 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.fillStyle = '#00ff00';
      ctx.font = `${Math.min(14, canvas.width / 30)}px Arial`;
      ctx.fillText('Pé Detectado!', footCenterX - 30, footCenterY - 50);
      
      // Notificação mais sutil
      console.log('👟 Pé detectado! Visualizando tênis 3D');
    } else {
      setFootDetected(false);
      setShoeModel(null);
    }
    } catch (error) {
      console.error('❌ Erro ao processar vídeo:', error);
      setFootDetected(false);
      setShoeModel(null);
    }
  }, []);

  // Loop de detecção otimizado para mobile
  useEffect(() => {
    let detectionInterval;
    
    if (isActive && cameraStream && videoRef.current) {
      // Aguardar um pouco para o vídeo estabilizar
      const startDetection = () => {
        console.log('📹 Iniciando detecção de pé...');
        
        // Frequência adaptativa baseada no dispositivo
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const detectionInterval_ms = isMobileDevice ? 500 : 800; // Menos frequente para estabilizar
        
        detectionInterval = setInterval(() => {
          if (!isDetecting && videoRef.current && videoRef.current.readyState >= 2) {
            setIsDetecting(true);
            detectFoot();
            setTimeout(() => setIsDetecting(false), 50); // Processamento mais rápido
          }
        }, detectionInterval_ms);
      };

      // Aguardar 1 segundo para o vídeo estabilizar
      const timeoutId = setTimeout(startDetection, 1000);
      
      return () => {
        clearTimeout(timeoutId);
        if (detectionInterval) {
          clearInterval(detectionInterval);
        }
      };
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, cameraStream, detectFoot, isDetecting]);

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
    console.log('🎨 renderShoe3D chamado:', { shoeModel, containerRef: modelContainerRef.current });
    
    if (!shoeModel || !modelContainerRef.current) {
      console.log('❌ Condições não atendidas:', { shoeModel: !!shoeModel, container: !!modelContainerRef.current });
      return;
    }

    const container = modelContainerRef.current;
    console.log('📦 Container encontrado:', container);
    
    // Configurar container para o modelo 3D
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `;
    
    container.innerHTML = '';
    console.log('📦 Container estilizado:', container.style.cssText);

    // Usar dados do produto
    const productColor = product?.color || '#333';
    const productName = product?.name || 'Tênis';
    const productImage = product?.images?.[0] || product?.image || '/placeholder-product.jpg';
    console.log('🎨 Produto:', { productColor, productName, productImage });

    // Criar elemento 3D do tênis usando a imagem real
    const shoeElement = document.createElement('div');
    shoeElement.className = 'shoe-3d-model';
    shoeElement.style.cssText = `
      position: absolute;
      left: ${shoeModel.x - 50}px;
      top: ${shoeModel.y - 70}px;
      width: 100px;
      height: 120px;
      background-image: url('${productImage}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 20px 20px 30px 30px;
      transform: perspective(500px) rotateX(20deg) rotateY(10deg) scale(${shoeModel.scale});
      box-shadow: 
        0 25px 50px rgba(0,0,0,0.6),
        0 10px 20px rgba(0,0,0,0.3),
        inset 0 1px 2px rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.2);
      z-index: 1000;
      pointer-events: none;
      opacity: 1;
      overflow: hidden;
      filter: brightness(1.1) contrast(1.05);
    `;
    
    console.log('🎨 Estilos aplicados:', {
      left: `${shoeModel.x - 40}px`,
      top: `${shoeModel.y - 60}px`,
      scale: shoeModel.scale,
      color: productColor
    });

    // Overlay de profundidade para dar efeito 3D
    const depthOverlay = document.createElement('div');
    depthOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(255,255,255,0.1) 0%,
        rgba(0,0,0,0.1) 50%,
        rgba(0,0,0,0.3) 100%
      );
      border-radius: 20px 20px 30px 30px;
      pointer-events: none;
    `;
    shoeElement.appendChild(depthOverlay);

    // Sombra interna para dar profundidade
    const innerShadow = document.createElement('div');
    innerShadow.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        rgba(0,0,0,0.2) 0%,
        transparent 30%,
        transparent 70%,
        rgba(0,0,0,0.4) 100%
      );
      border-radius: 20px 20px 30px 30px;
      pointer-events: none;
    `;
    shoeElement.appendChild(innerShadow);

    // Texto do produto com estilo elegante
    const productText = document.createElement('div');
    productText.style.cssText = `
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7));
      color: white;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      z-index: 1001;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    productText.textContent = productName;
    shoeElement.appendChild(productText);

    container.appendChild(shoeElement);
    console.log('✅ Elemento adicionado ao container:', shoeElement);

    // Animação de entrada realista como Wanna Kicks
    shoeElement.style.opacity = '0';
    shoeElement.style.transform = `perspective(500px) rotateX(20deg) rotateY(10deg) scale(${shoeModel.scale * 0.2}) translateY(20px)`;
    
    console.log('🎬 Iniciando animação de entrada...');
    setTimeout(() => {
      shoeElement.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      shoeElement.style.opacity = '1';
      shoeElement.style.transform = `perspective(500px) rotateX(20deg) rotateY(10deg) scale(${shoeModel.scale}) translateY(0px)`;
      console.log('🎬 Animação aplicada:', shoeElement.style.opacity, shoeElement.style.transform);
    }, 150);
  }, [shoeModel, product]);

  // Renderizar modelo 3D quando detectado
  useEffect(() => {
    console.log('🔄 useEffect renderShoe3D:', { footDetected, shoeModel: !!shoeModel });
    if (footDetected && shoeModel) {
      console.log('🎯 Chamando renderShoe3D...');
      renderShoe3D();
    }
  }, [footDetected, shoeModel, renderShoe3D]);

  if (!isMobile) {
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth > 768;
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
    
    return (
      <div className="shoe-3d-modal">
        <div className="shoe-3d-content">
          <div className="shoe-3d-header">
            <h3>Modelagem 3D de Calçados</h3>
            <button className="close-btn" onClick={handleClose}>✕</button>
          </div>
          <div className="shoe-3d-body">
            <div className="compatibility-message">
              <div className="compatibility-icon">🔧</div>
              <h4>Funcionalidade 3D Indisponível</h4>
              
              {isDesktop && (
                <div className="reason">
                  <h5>🖥️ Dispositivo Desktop Detectado</h5>
                  <p>Esta funcionalidade é otimizada para dispositivos móveis com câmera.</p>
                  <p><strong>Solução:</strong> Acesse este site em seu celular ou tablet.</p>
                </div>
              )}
              
              {!hasCamera && (
                <div className="reason">
                  <h5>📷 Câmera Não Disponível</h5>
                  <p>Seu dispositivo não possui câmera ou não suporta acesso à câmera.</p>
                  <p><strong>Solução:</strong> Use um dispositivo com câmera funcional.</p>
                </div>
              )}
              
              {!isHTTPS && (
                <div className="reason">
                  <h5>🔒 Conexão Não Segura</h5>
                  <p>O acesso à câmera requer conexão HTTPS segura.</p>
                  <p><strong>Solução:</strong> Acesse via HTTPS ou localhost.</p>
                </div>
              )}
              
              <div className="compatibility-info">
                <h5>📋 Requisitos para Funcionar:</h5>
                <ul>
                  <li>✅ Dispositivo móvel (celular/tablet)</li>
                  <li>✅ Câmera funcional</li>
                  <li>✅ Conexão HTTPS ou localhost</li>
                  <li>✅ Permissão de acesso à câmera</li>
                </ul>
              </div>
              
              <div className="alternative-info">
                <h5>💡 Alternativas:</h5>
                <p>• Visualize as imagens do produto em alta resolução</p>
                <p>• Use a funcionalidade de zoom nas imagens</p>
                <p>• Acesse em um dispositivo móvel para experimentar o 3D</p>
              </div>
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
              <button 
                className="start-camera-btn" 
                onClick={initializeCamera}
                disabled={isInitializing}
              >
                {isInitializing ? (
                  <>
                    <span className="loading-spinner"></span>
                    Iniciando...
                  </>
                ) : (
                  '🎥 Ativar Câmera'
                )}
              </button>
              
              {isInitializing && (
                <button 
                  className="cancel-camera-btn" 
                  onClick={() => {
                    setIsInitializing(false);
                    showNotification('Inicialização cancelada', 'info');
                  }}
                >
                  ❌ Cancelar
                </button>
              )}
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
                
                {!footDetected && (
                  <div className="detection-status waiting">
                    👣 Posicione seu pé na parte inferior da tela
                  </div>
                )}
              </div>
              
              <div className="camera-controls">
                <button className="stop-camera-btn" onClick={stopCamera}>
                  🛑 Parar Câmera
                </button>
                <button 
                  className="switch-camera-btn" 
                  onClick={switchCamera}
                  disabled={isInitializing}
                >
                  {cameraFacing === 'user' ? '📷 Câmera Traseira' : '📱 Câmera Frontal'}
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
