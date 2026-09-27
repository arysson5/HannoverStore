import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import './Chatbot.css';

const Chatbot = () => {
  const { products, categories } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const messagesEndRef = useRef(null);

  // Carregar mensagem de boas-vindas
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = [
        "👟 Oi! Sou o Hannovinho! Como posso te ajudar?",
        "🤖 Salve! Hannovinho aqui! O que você tá procurando?",
        "👟 Ei! Hannovinho na área! Vamos encontrar algo top?",
        "🤖 Opa! Sou o Hannovinho! Pronto para te ajudar!",
        "👟 Salve! Hannovinho aqui! Como posso ajudar?",
        "🤖 Oi! Hannovinho na área! O que você precisa?"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setMessages([{ type: 'bot', text: randomGreeting }]);
    }
  }, [isOpen, messages.length]);

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chatbot configurado para usar banco de dados local
  useEffect(() => {
    console.log('Chatbot funcionando no modo offline (apenas respostas locais)');
    setApiKey('');
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response = '';
      console.log('Processando mensagem:', inputMessage);

      // Tentar encontrar resposta no banco local (QA)
      const localResponse = await findLocalAnswer(inputMessage);
      if (localResponse) {
        console.log('Resposta encontrada no banco local');
        response = localResponse;
      } else {
        console.log('Resposta não encontrada no banco local, usando fallback');
        // Se não encontrar no QA, usar fallback com produtos relevantes
        const relevantProducts = findRelevantProducts(inputMessage);
        let fallbackResponse = "👟🤖 Opa, não tenho essa info agora! Mas olha só:";
        
        if (relevantProducts.length > 0) {
          fallbackResponse += "\n\n👟 **Produtos top que podem te interessar:**\n";
          relevantProducts.slice(0, 3).forEach(product => {
            const productName = product.name || product.title || 'Produto';
            const productPrice = product.price ? `R$ ${product.price}` : 'Consulte o preço';
            fallbackResponse += `• [${productName}](/produto/${product.id}) - ${productPrice}\n`;
          });
        }
        
        fallbackResponse += "\n\n🤖 **Dicas:**\n";
        fallbackResponse += "• Navegue pelos produtos na página inicial\n";
        fallbackResponse += "• Use os filtros por categoria\n";
        fallbackResponse += "• Contato: contato@hannoverstore.com\n";
        
        response = fallbackResponse;
      }

      setMessages(prev => [...prev, { type: 'bot', text: response, hasLinks: response.includes('[') && response.includes(']') }]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      let errorMessage = '👟🤖 Opa, deu um probleminha aqui! Mas vou te ajudar mesmo assim!';
      
      // Adicionar recomendações de produtos mesmo em caso de erro
      const relevantProducts = findRelevantProducts(inputMessage);
      if (relevantProducts.length > 0) {
        errorMessage += "\n\n👟 **Olha só, tenho uns produtos que podem te interessar:**\n";
        relevantProducts.forEach(product => {
          const productName = product.name || product.title || 'Produto';
          const productPrice = product.price ? `R$ ${product.price}` : 'Consulte o preço';
          errorMessage += `• [${productName}](/produto/${product.id}) - ${productPrice}\n`;
        });
      } else {
        errorMessage += "\n\n🤖 **Que tal dar uma olhada nos nossos produtos?**\n";
        errorMessage += "• Tênis esportivos de alta qualidade\n";
        errorMessage += "• Roupas para academia e esportes\n";
        errorMessage += "• Equipamentos de fitness\n";
        errorMessage += "• Acessórios esportivos\n";
      }
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: errorMessage,
        hasLinks: errorMessage.includes('[') && errorMessage.includes(']')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const findLocalAnswer = async (question) => {
    try {
      // Importar o JSON diretamente
      const data = await import('../../data/chatbot-qa.json');
      
      const lowerQuestion = question.toLowerCase();
      
      // Buscar por palavras-chave
      for (const qa of data.default.questions) {
        for (const keyword of qa.keywords) {
          if (lowerQuestion.includes(keyword.toLowerCase())) {
            let answer = qa.answer;
            
            // Adicionar recomendações de produtos reais se disponíveis
            const relevantProducts = findRelevantProducts(question);
            if (relevantProducts.length > 0) {
              answer += "\n\n👟 **Produtos que recomendo para você:**\n";
              relevantProducts.forEach(product => {
                const productName = product.name || product.title || 'Produto';
                const productPrice = product.price ? `R$ ${product.price}` : 'Consulte o preço';
                answer += `• [${productName}](/produto/${product.id}) - ${productPrice}\n`;
              });
            }
            
            return answer;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao carregar banco de dados local:', error);
      return null;
    }
  };

  const getGoogleAIResponse = async (question, retryCount = 0) => {
    try {
      // Construir contexto da conversa (últimas 10 mensagens para melhor contexto)
      const recentMessages = messages.slice(-10);
      const conversationContext = recentMessages.map(msg => 
        `${msg.type === 'user' ? 'Usuário' : 'Hannovinho'}: ${msg.text}`
      ).join('\n');

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é o HANNOVINHO, um tênis-robô super divertido e especialista em produtos esportivos da Hannover Store! 

IMPORTANTE: Você está conversando com UMA ÚNICA PESSOA e deve MANTENHER O CONTEXTO da conversa. Se a pessoa mencionar algo em mensagens anteriores, REFERENCIE e CONTINUE a conversa naturalmente.

SUA PERSONALIDADE:
- Você é um tênis-robô chamado "Hannovinho" (brincadeira com "Hannover" + "novinho")
- Use emojis de tênis 👟 e robô 🤖 frequentemente
- Seja animado, divertido e entusiasmado com produtos esportivos
- Fale como um amigo que ama esportes e produtos de qualidade
- Use expressões como "cara", "galera", "show de bola", "top demais"
- Seja CONCISO - respostas curtas e diretas (máximo 2-3 frases)
- Fale como se estivesse conversando com UMA pessoa específica

PRODUTOS REAIS DISPONÍVEIS:
${products && products.length > 0 ? products.slice(0, 10).map(p => `- ${p.name || p.title} (ID: ${p.id}) - R$ ${p.price || 'Consulte'}`).join('\n') : '- Carregando produtos...'}

CATEGORIAS DISPONÍVEIS:
${categories && categories.length > 0 ? categories.map(c => `- ${c.name}`).join('\n') : '- Carregando categorias...'}

PORTAL DE DICAS ESPECIAL:
- Temos um [Portal de Dicas](/tips-portal) incrível com guias completos!
- Lá você encontra: tipos de pisada, cuidados com tênis, tecnologias, diferenças entre modelos
- SEMPRE direcione para o portal quando perguntarem sobre dicas, cuidados, tipos de pisada, tecnologias
- Use o link: [Portal de Dicas](/tips-portal) para direcionar

CONTEXTO DA CONVERSA (MANTENHA SEMPRE):
${conversationContext ? `\nConversa recente:\n${conversationContext}\n` : ''}

SUAS RESPONSABILIDADES:
1. Responda como o Hannovinho, sendo divertido e animado
2. MANTENHA O CONTEXTO - se a pessoa mencionou algo antes, REFERENCIE
3. SEMPRE recomende produtos REAIS da loja quando apropriado
4. Use links no formato: [Nome do Produto](/produto/id)
5. SEMPRE direcione para o [Portal de Dicas](/tips-portal) quando perguntarem sobre:
   - Tipos de pisada, cuidados com tênis, tecnologias, diferenças entre modelos
   - Como escolher tênis, manutenção, durabilidade
   - Dicas gerais sobre calçados esportivos
6. Seja entusiasmado sobre produtos esportivos
7. Use emojis e linguagem jovem e divertida
8. CONTINUE a conversa naturalmente - se mencionaram marca, cor, tipo, REFERENCIE
9. Seja CONCISO - respostas curtas e diretas (máximo 2-3 frases)

EXEMPLO DE CONVERSA CONTEXTUAL:
- Usuário: "Quero um tênis Adidas"
- Hannovinho: "👟🤖 Opa! Adidas é show de bola! Temos vários modelos incríveis..."
- Usuário: "É preto"
- Hannovinho: "👟🤖 Perfeito! Tênis Adidas preto é clássico demais! Vou te mostrar as opções..."

Pergunta atual do usuário: ${question}`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512, // Reduzido para respostas mais curtas
          }
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Chave da API inválida ou sem permissão. Verifique sua chave no Google AI Studio.');
        } else if (response.status === 400) {
          throw new Error('Solicitação inválida. Tente reformular sua pergunta.');
        } else if (response.status === 503) {
          // Tentar novamente para erros 503 (serviço indisponível)
          if (retryCount < 2) {
            console.log(`Tentativa ${retryCount + 1} falhou, tentando novamente...`);
            // Mostrar mensagem de retry para o usuário
            if (retryCount === 0) {
              setMessages(prev => [...prev, { 
                type: 'bot', 
                text: '👟🤖 Opa! Serviço lento, tentando de novo...' 
              }]);
            }
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Delay progressivo
            return getGoogleAIResponse(question, retryCount + 1);
          }
          throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.');
        } else if (response.status === 429) {
          // Tentar novamente para erros 429 (rate limit)
          if (retryCount < 1) {
            console.log('Rate limit atingido, aguardando...');
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: '👟🤖 Muitas perguntas! Aguarda um pouquinho...' 
            }]);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return getGoogleAIResponse(question, retryCount + 1);
          }
          throw new Error('Muitas solicitações. Aguarde um momento antes de tentar novamente.');
        } else {
          throw new Error(`Erro da API: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Resposta inválida da API do Google');
      }
    } catch (error) {
      console.error('Erro na API do Google:', error);
      throw error;
    }
  };



  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Função para buscar produtos reais baseados na pergunta
  const findRelevantProducts = (question) => {
    if (!products || products.length === 0) return [];
    
    const lowerQuestion = question.toLowerCase();
    const relevantProducts = [];
    
    // Palavras-chave expandidas para diferentes categorias
    const keywords = {
      'tênis': ['tênis', 'sapato', 'calçado', 'corrida', 'basquete', 'futebol', 'caminhada', 'esportivo', 'atletismo', 'chuteira'],
      'roupa': ['camiseta', 'short', 'legging', 'jaqueta', 'roupa', 'academia', 'top', 'shorts', 'blusa', 'calça', 'yoga', 'fitness'],
      'acessório': ['mochila', 'garrafa', 'relógio', 'acessório', 'equipamento', 'luva', 'óculos', 'faixa', 'tornozeleira'],
      'fitness': ['halter', 'esteira', 'bicicleta', 'fitness', 'academia casa', 'equipamento', 'peso', 'bike', 'ciclismo'],
      'marca': ['nike', 'adidas', 'puma', 'marca', 'fabricante'],
      'cor': ['preto', 'branco', 'azul', 'vermelho', 'verde', 'rosa', 'cinza', 'cor', 'cores'],
      'tamanho': ['tamanho', 'numeração', 'P', 'M', 'G', 'GG', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
    };
    
    products.forEach(product => {
      const productName = (product.name || product.title || '').toLowerCase();
      const productDescription = (product.description || '').toLowerCase();
      const productCategory = (product.category || '').toLowerCase();
      const productBrand = (product.brand || '').toLowerCase();
      
      // Verificar se o produto é relevante para a pergunta
      Object.entries(keywords).forEach(([, words]) => {
        words.forEach(word => {
          if (lowerQuestion.includes(word) && 
              (productName.includes(word) || 
               productDescription.includes(word) || 
               productCategory.includes(word) ||
               productBrand.includes(word))) {
            if (!relevantProducts.find(p => p.id === product.id)) {
              relevantProducts.push(product);
            }
          }
        });
      });
    });
    
    // Se não encontrou produtos específicos, retornar alguns produtos populares
    if (relevantProducts.length === 0 && products.length > 0) {
      return products.slice(0, 3);
    }
    
    // Retornar até 3 produtos mais relevantes
    return relevantProducts.slice(0, 3);
  };

  // Função para processar links internos nas respostas
  const processInternalLinks = (text) => {
    // Converter links markdown para HTML clicável
    return text.replace(/\[([^\]]+)\]\(\/produto\/([^)]+)\)/g, (match, productName, productId) => {
      return `<a href="/produto/${productId}" style="color: #3b82f6; text-decoration: underline; font-weight: 500;">${productName}</a>`;
    });
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        <div className="chatbot-icon">
          {isOpen ? '✕' : '👟'}
        </div>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-avatar">👟🤖</span>
              <span>Hannovinho</span>
            </div>
            <div className="chatbot-controls">
              <button 
                className="chatbot-btn" 
                onClick={clearChat}
                title="Limpar conversa"
              >
                🗑️
              </button>
              <button 
                className="chatbot-btn" 
                onClick={toggleChatbot}
                title="Fechar"
              >
                ✕
              </button>
            </div>
          </div>



          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chatbot-message ${message.type}`}>
                <div 
                  className="chatbot-message-content"
                  dangerouslySetInnerHTML={{
                    __html: message.hasLinks ? processInternalLinks(message.text) : message.text
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="chatbot-message-content">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Digite sua pergunta..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="chatbot-input-field"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              className="chatbot-send-btn"
              disabled={isLoading || !inputMessage.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
