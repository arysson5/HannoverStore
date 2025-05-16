import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Policy.css";

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="policy-container">
        <div className="policy-content">
          <h1>Política de Devolução</h1>
          
          <div className="policy-section">
            <h2>Direito de Arrependimento</h2>
            <p>De acordo com o Código de Defesa do Consumidor (Lei nº 8.078/90), você tem até <strong>7 (sete) dias corridos</strong>, a contar da data de recebimento do produto, para desistir da compra realizada pela internet.</p>
            <p>Este direito de arrependimento é aplicável a todas as compras realizadas fora do estabelecimento comercial, como em lojas virtuais e aplicativos.</p>
          </div>
          
          <div className="policy-section">
            <h2>Como solicitar a devolução</h2>
            <p>Para exercer seu direito de arrependimento, siga os seguintes passos:</p>
            <ol>
              <li>Entre em contato com nosso Serviço de Atendimento ao Cliente pelo e-mail <a href="mailto:atendimento@hannoverstore.com.br">atendimento@hannoverstore.com.br</a> ou pelo telefone (XX) XXXX-XXXX, informando o número do pedido e o motivo da devolução.</li>
              <li>Nossa equipe enviará um formulário de devolução para você preencher.</li>
              <li>Devolva o produto na embalagem original, sem indícios de uso, acompanhado de todos os acessórios, manuais e nota fiscal.</li>
              <li>Após recebermos o produto e confirmarmos que está em perfeito estado, o reembolso será processado.</li>
            </ol>
          </div>
          
          <div className="policy-section">
            <h2>Condições para devolução</h2>
            <p>Para que a devolução seja aceita, é necessário que:</p>
            <ul>
              <li>O produto esteja em sua embalagem original, sem indícios de uso;</li>
              <li>Todos os acessórios, manuais e etiquetas estejam presentes;</li>
              <li>O produto não apresente sinais de desgaste, sujeira ou danos;</li>
              <li>No caso de calçados, a sola não apresente marcas de uso.</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>Produtos com defeito ou avaria</h2>
            <p>Caso o produto apresente defeito ou avaria:</p>
            <ul>
              <li>Para problemas identificados no momento da entrega, recuse o recebimento e registre o motivo na nota de entrega.</li>
              <li>Para defeitos identificados após o recebimento, entre em contato conosco em até 7 dias.</li>
              <li>Produtos com defeito de fabricação estão cobertos pela garantia do fabricante, normalmente de 90 dias a partir da data de entrega.</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>Reembolso</h2>
            <p>O reembolso será realizado da seguinte forma:</p>
            <ul>
              <li>Para pagamentos com cartão de crédito, o estorno será solicitado junto à administradora do cartão, podendo levar até 2 faturas para ser processado, conforme política da operadora.</li>
              <li>Para pagamentos via boleto bancário ou transferência, o reembolso será feito por transferência bancária para a conta indicada pelo cliente em até 10 dias úteis após a aprovação da devolução.</li>
              <li>Para pagamentos via PIX, o reembolso será feito para a mesma chave utilizada no pagamento em até 5 dias úteis.</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>Trocas por tamanho ou modelo</h2>
            <p>Para solicitar a troca por um tamanho ou modelo diferente:</p>
            <ul>
              <li>Entre em contato com nosso atendimento em até 30 dias após o recebimento.</li>
              <li>O produto deve estar em perfeito estado, sem uso e com todas as etiquetas originais.</li>
              <li>As despesas de envio para troca são de responsabilidade do cliente.</li>
              <li>Disponibilidade do novo tamanho/modelo está sujeita ao nosso estoque atual.</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>Observações importantes</h2>
            <p>A Hannover Store se reserva o direito de recusar a devolução nos seguintes casos:</p>
            <ul>
              <li>Produto com sinais evidentes de uso;</li>
              <li>Produto devolvido fora do prazo estabelecido;</li>
              <li>Produto sem embalagem original, acessórios ou manuais;</li>
              <li>Produto personalizado ou sob medida.</li>
            </ul>
            <p>Em caso de dúvidas sobre nossa política de devolução, entre em contato com nosso serviço de atendimento ao cliente.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnPolicy; 