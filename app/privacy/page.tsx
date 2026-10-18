import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { contactEmail } from "@/content/site";
import { RETENTION_MONTHS } from "@/modules/applications/retention";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Quais dados a Liga da Juventude Livre guarda, para quê, por quanto tempo, e como pedir a exclusão.",
};

const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function PrivacyPage() {
  return (
    <>
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />
      <main id="content">
        <section className="page-hero" data-reveal>
          <div className="wrap">
            <p className="kicker rise">Privacidade</p>
            <h1>
              <Words text="Seus dados, em português claro." />
            </h1>
            <p className="lede rise" style={n(5)}>
              Guardamos o mínimo para responder a você e organizar o trabalho dos diretórios. Não vendemos nem cedemos dados a terceiros.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="prose">
              <h2>Quem cuida dos dados</h2>
              <p>
                A Liga da Juventude Livre, movimento estudantil apartidário. Para qualquer assunto sobre seus dados, escreva para{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>

              <h2>O que guardamos e para quê</h2>
              <ul>
                <li>
                  <b>Pedido de diretório</b> (formulário em Diretórios): nome, e-mail, universidade, curso e mensagem. Serve para a equipe responder e ajudar a montar o diretório.
                </li>
                <li>
                  <b>Candidatura</b> (formulário em Entre na Liga): nome, e-mail, diretório, curso, período, competências, interesses, horas por semana, link de portfólio e mensagem. Serve para a
                  coordenação do diretório conversar com você e chamar você quando houver uma vaga ou tarefa.
                </li>
                <li>
                  <b>Registro de membro e alumni</b>: nome, e-mail, função, datas do mandato e, se você aceitar, que está disponível para mentoria. Serve para a Liga lembrar quem passou pelo diretório.
                </li>
                <li>
                  <b>Certificados</b>: nome, atividade, carga horária e datas. A página de verificação mostra isso, mas nunca o seu e-mail.
                </li>
                <li>
                  <b>Proteção contra abuso</b>: dos formulários guardamos apenas um código irreversível (hash) do seu endereço de IP, para limitar envios repetidos. Não guardamos o IP em si.
                </li>
              </ul>

              <h2>Base legal</h2>
              <p>Seu consentimento, dado ao marcar a caixa dos formulários. Você pode retirá-lo quando quiser.</p>

              <h2>Quem vê seus dados</h2>
              <p>
                A equipe da Liga e, no caso de candidaturas e membros, a coordenação do diretório escolhido. Usamos serviços de hospedagem e banco de dados (Vercel e Neon) para operar o site, que
                tratam os dados apenas para isso. Não enviamos seus dados a ninguém para fins comerciais.
              </p>

              <h2>Por quanto tempo</h2>
              <ul>
                <li>
                  Candidaturas sem nenhuma atividade por {RETENTION_MONTHS} meses, que não viraram membro, são apagadas.
                </li>
                <li>Membros ficam enquanto o mandato durar e, depois, como alumni, até você pedir para sair.</li>
                <li>Pedidos de diretório e certificados ficam até você pedir a exclusão.</li>
              </ul>

              <h2>Seus direitos</h2>
              <p>
                Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir a qualquer momento: confirmação de que tratamos seus dados, acesso a eles, correção, exclusão, e a retirada do consentimento.
                Escreva para <a href={`mailto:${contactEmail}`}>{contactEmail}</a>; respondemos pessoalmente.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
