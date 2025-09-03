# 👟 Modelagem 3D de Calçados

## 📱 Funcionalidade de Realidade Aumentada

Este componente implementa uma funcionalidade avançada de modelagem 3D de calçados usando a câmera do dispositivo móvel para detectar o pé do usuário e sobrepor um modelo 3D do tênis.

## 🚀 Características

### ✅ Funcionalidades Implementadas:
- **Detecção de Dispositivo Móvel**: Funciona apenas em smartphones e tablets
- **Acesso à Câmera**: Utiliza a câmera frontal do dispositivo
- **Detecção de Pé**: Algoritmo de visão computacional para detectar o pé
- **Modelo 3D**: Renderização de modelo 3D do tênis sobre o pé detectado
- **Interface Intuitiva**: Interface amigável com instruções claras
- **Responsivo**: Adaptado para diferentes tamanhos de tela

### 🎯 Como Funciona:

1. **Detecção de Dispositivo**: Verifica se é um dispositivo móvel
2. **Acesso à Câmera**: Solicita permissão para usar a câmera
3. **Detecção de Pé**: Usa algoritmos de visão computacional para detectar tons de pele
4. **Renderização 3D**: Cria um modelo 3D do tênis sobre o pé detectado
5. **Animações**: Adiciona efeitos visuais e animações

## 🛠️ Tecnologias Utilizadas

- **React Hooks**: useState, useEffect, useRef, useCallback
- **Canvas API**: Para processamento de imagem
- **MediaDevices API**: Para acesso à câmera
- **CSS 3D Transforms**: Para renderização 3D
- **Responsive Design**: CSS Grid e Flexbox

## 📱 Compatibilidade

### ✅ Suportado:
- **iOS Safari** (iOS 11+)
- **Android Chrome** (Android 7+)
- **Samsung Internet** (Android 7+)
- **Firefox Mobile** (Android 7+)

### ❌ Não Suportado:
- **Desktop/Laptop** (mostra mensagem informativa)
- **Navegadores sem suporte a MediaDevices API**
- **Dispositivos sem câmera**

## 🎨 Interface

### Desktop:
- Mensagem informativa sobre disponibilidade apenas em dispositivos móveis
- Ícone de celular e instruções

### Mobile:
- Botão "Ativar Câmera" para iniciar
- Visualização da câmera em tempo real
- Status de detecção (aguardando/detectado)
- Controles para parar câmera e detectar novamente

## 🔧 Algoritmo de Detecção

### Detecção de Pé:
```javascript
// Algoritmo simplificado de detecção de tons de pele
if (r > 100 && g > 80 && b > 60 && r > g && g > b) {
  // Pixel identificado como pele
  footPixels++;
}
```

### Parâmetros:
- **Área mínima**: 1000 pixels para considerar detecção válida
- **Frequência**: Detecção a cada 500ms
- **Tolerância**: Algoritmo flexível para diferentes tons de pele

## 🎭 Modelo 3D

### Renderização:
- **CSS 3D Transforms**: perspective, rotateX, rotateY
- **Gradientes**: Simulação de materiais do tênis
- **Sombras**: Efeito de profundidade
- **Animações**: Movimento flutuante e transições suaves

### Elementos Visuais:
- **Corpo do tênis**: Gradiente cinza
- **Detalhes**: Faixas e elementos decorativos
- **Cadarços**: Linhas brancas simulando cadarços
- **Bordas**: Contorno branco para destaque

## 📊 Performance

### Otimizações:
- **useCallback**: Evita re-renderizações desnecessárias
- **Interval Controlado**: Detecção limitada a 500ms
- **Canvas Otimizado**: Processamento eficiente de pixels
- **Cleanup**: Limpeza adequada de recursos

### Limitações:
- **Processamento**: Algoritmo simplificado para performance
- **Precisão**: Detecção básica de tons de pele
- **Compatibilidade**: Dependente de APIs do navegador

## 🚀 Uso

### Integração no Card de Produto:
```jsx
import Shoe3DModeler from '../Shoe3DModeler/Shoe3DModeler';

// No componente Card
<Shoe3DModeler 
  product={product} 
  onClose={close3DModal} 
/>
```

### Botão 3D:
```jsx
<button 
  className="try-3d-btn"
  onClick={open3DModal}
  aria-label="Experimentar em 3D"
>
  👟 3D
</button>
```

## 🎯 Próximas Melhorias

### Funcionalidades Futuras:
- **Detecção Mais Precisa**: Usar bibliotecas como MediaPipe
- **Modelos 3D Reais**: Integração com Three.js
- **Múltiplos Ângulos**: Rotação e visualização 360°
- **Tamanhos**: Detecção automática do tamanho do pé
- **Cores**: Múltiplas opções de cor do tênis
- **Compartilhamento**: Salvar e compartilhar imagens

### Otimizações:
- **WebGL**: Renderização 3D mais avançada
- **Web Workers**: Processamento em background
- **Machine Learning**: Detecção mais inteligente
- **AR.js**: Realidade aumentada nativa

## 📝 Notas Técnicas

- **Permissões**: Requer acesso à câmera
- **HTTPS**: Necessário para acesso à câmera em produção
- **Performance**: Otimizado para dispositivos móveis
- **Acessibilidade**: Suporte a screen readers
- **Responsivo**: Adaptado para diferentes orientações

## 🐛 Troubleshooting

### Problemas Comuns:
1. **Câmera não acessível**: Verificar permissões
2. **Detecção não funciona**: Verificar iluminação
3. **Performance lenta**: Fechar outros apps
4. **Modelo não aparece**: Aguardar detecção completa

### Soluções:
- Permitir acesso à câmera
- Melhorar iluminação do ambiente
- Fechar aplicativos em background
- Aguardar alguns segundos para detecção
