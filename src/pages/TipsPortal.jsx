import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./TipsPortal.css";

const TipsPortal = () => {
  return (
    <>
      <Navbar />
      <div className="tips-container">
        <div className="tips-header">
          <h1>Portal de Dicas</h1>
          <p>Tudo o que você precisa saber para escolher o calçado ideal para cada atividade.</p>
        </div>
        
        <div className="tips-content">
          <section className="tips-section">
            <div className="tips-image">
              <img src="https://images.unsplash.com/photo-1597892657493-6847b9640bac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tênis para corrida" />
            </div>
            <div className="tips-text">
              <h2>Calçados para Corrida</h2>
              <p>Escolher o tênis ideal para corrida pode melhorar seu desempenho e prevenir lesões. Veja nossas dicas:</p>
              <ul>
                <li><strong>Amortecimento:</strong> Tênis com boa absorção de impacto são essenciais para proteger joelhos e tornozelos, especialmente em corridas de longa distância.</li>
                <li><strong>Tipo de pisada:</strong> Identifique se sua pisada é neutra, pronada ou supinada. Cada tipo requer um tênis específico para corrigir o movimento e distribuir melhor o impacto.</li>
                <li><strong>Peso:</strong> Tênis mais leves são ideais para corridas de velocidade, enquanto modelos com mais estrutura são melhores para longas distâncias.</li>
                <li><strong>Respirabilidade:</strong> Materiais que permitem a circulação de ar evitam o acúmulo de suor e proporcionam mais conforto.</li>
                <li><strong>Superfície de corrida:</strong> Para asfalto, busque mais amortecimento; para trilhas, priorize estabilidade e sola com melhor tração.</li>
              </ul>
              <p>Recomendamos a troca do tênis de corrida a cada 500-800 km percorridos, pois o amortecimento diminui com o uso, mesmo que a aparência externa ainda esteja boa.</p>
            </div>
          </section>
          
          <section className="tips-section reverse">
            <div className="tips-image">
              <img src="https://images.unsplash.com/photo-1620650663972-a03f6f55930a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Chuteiras para futebol" />
            </div>
            <div className="tips-text">
              <h2>Chuteiras para Futebol</h2>
              <p>A escolha da chuteira certa pode fazer toda a diferença no seu desempenho em campo:</p>
              <ul>
                <li><strong>Tipo de campo:</strong> Para gramado natural, use chuteiras com travas mais longas; para grama sintética, prefira travas menores e mais numerosas; para quadras, opte por solados emborrachados.</li>
                <li><strong>Material:</strong> Chuteiras de couro oferecem melhor toque de bola e se moldam ao pé, enquanto materiais sintéticos são mais leves e resistentes à água.</li>
                <li><strong>Posição em campo:</strong> Atacantes geralmente preferem chuteiras leves para maior velocidade; defensores optam por modelos mais robustos para proteção adicional.</li>
                <li><strong>Ajuste:</strong> A chuteira deve proporcionar um ajuste firme, sem apertar. Um ajuste inadequado pode causar bolhas e desconforto.</li>
                <li><strong>Tipo de trava:</strong> Travas redondas oferecem melhor distribuição de peso e são mais versáteis; travas em formato de lâmina proporcionam melhor tração ao arrancar e parar.</li>
              </ul>
              <p>Um bom período de adaptação é necessário antes de usar a chuteira nova em jogos oficiais. Use nos treinos primeiro para amoldar ao seu pé.</p>
            </div>
          </section>
          
          <section className="tips-section">
            <div className="tips-image">
              <img src="https://images.unsplash.com/photo-1641188721482-d6da1d5b87bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Calçados casuais" />
            </div>
            <div className="tips-text">
              <h2>Calçados para o Dia a Dia</h2>
              <p>Conforto e estilo andam juntos quando se trata de escolher calçados para o uso diário:</p>
              <ul>
                <li><strong>Conforto:</strong> Procure por calçados com boa palmilha e suporte para o arco do pé, especialmente se você passa muitas horas em pé.</li>
                <li><strong>Versatilidade:</strong> Invista em modelos que combinam com diferentes estilos de roupa e podem ser usados em várias ocasiões.</li>
                <li><strong>Material:</strong> Considere a estação do ano. Materiais respiráveis são ideais para o verão, enquanto materiais mais resistentes à água são melhores para dias chuvosos.</li>
                <li><strong>Ajuste adequado:</strong> Experimente calçados no final do dia, quando os pés estão naturalmente mais inchados, para garantir conforto o dia todo.</li>
                <li><strong>Atividades cotidianas:</strong> Se você caminha muito no dia a dia, busque tênis com boa absorção de impacto; para trabalho em ambiente corporativo, mocassins ou sapatênis podem ser excelentes opções.</li>
              </ul>
              <p>É recomendável alternar entre dois ou mais pares de calçados durante a semana. Isso prolonga a vida útil dos produtos e permite que absorvam a umidade entre os usos.</p>
            </div>
          </section>
          
          <section className="tips-section reverse">
            <div className="tips-image">
              <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tênis para basquete" />
            </div>
            <div className="tips-text">
              <h2>Tênis para Basquete</h2>
              <p>O basquete exige calçados específicos devido aos movimentos rápidos e saltos constantes:</p>
              <ul>
                <li><strong>Suporte de tornozelo:</strong> Modelos de cano alto oferecem maior proteção contra entorses, enquanto os de cano médio permitem mais mobilidade.</li>
                <li><strong>Amortecimento:</strong> Tecnologias como Air, Zoom ou Boost são excelentes para absorver impactos de saltos e aterrissagens.</li>
                <li><strong>Tração:</strong> A sola deve fornecer aderência adequada para movimentos rápidos de arranque e parada sem escorregar.</li>
                <li><strong>Estabilidade:</strong> Escolha modelos com boa base e estrutura lateral para evitar rolamentos de tornozelo durante movimentos laterais.</li>
                <li><strong>Respirabilidade:</strong> Opte por materiais que permitam ventilação adequada e mantenham o pé seco durante o jogo intenso.</li>
              </ul>
              <p>Tenha um par específico apenas para quadras cobertas, aumentando sua durabilidade, e outro para quadras externas se necessário.</p>
            </div>
          </section>
          
          <section className="tips-care">
            <h2>Cuidados com seus Calçados</h2>
            <div className="care-tips">
              <div className="care-tip">
                <h3>Limpeza Regular</h3>
                <p>Remova a sujeira superficial após cada uso e faça uma limpeza mais profunda periodicamente, usando produtos específicos para cada material.</p>
              </div>
              <div className="care-tip">
                <h3>Secagem Adequada</h3>
                <p>Deixe seus calçados secarem naturalmente, longe de fontes diretas de calor. Use papel absorvente dentro deles para acelerar o processo após dias chuvosos.</p>
              </div>
              <div className="care-tip">
                <h3>Armazenamento</h3>
                <p>Guarde em local ventilado, evitando exposição ao sol. Use tensores para manter a forma dos calçados de couro ou camurça.</p>
              </div>
              <div className="care-tip">
                <h3>Rotação de Uso</h3>
                <p>Alterne entre diferentes pares para permitir que o material "descanse" e recupere sua forma original entre os usos.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TipsPortal; 