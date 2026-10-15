// FaqAcordeao · Criado por FlowCore Soluções LTDA · flowcoresolucoes.com.br/codigos · licença MIT
// Perguntas frequentes em acordeão acessível (aria-expanded / aria-controls),
// com busca que filtra pergunta e resposta e destaca o termo encontrado.
// Props: tema ("claro" padrão | "escuro"), accent, title, subtitle, perguntas,
// multiplas, contato.
// Requisitos: React 18+ e Tailwind CSS 3+. Zero dependências.

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type Pergunta = { pergunta: string; resposta: string };

type Tema = "claro" | "escuro";

type Props = {
  /** Tema visual. Padrão "claro". */
  tema?: Tema;
  /** Cor de destaque (qualquer cor CSS). */
  accent?: string;
  title?: string;
  subtitle?: string;
  perguntas?: Pergunta[];
  /** Permite várias respostas abertas ao mesmo tempo. */
  multiplas?: boolean;
  contato?: { label: string; href: string };
};

// Paleta do tema aplicada como CSS vars na raiz (não depende do tailwind.config).
const TEMAS: Record<Tema, Record<string, string>> = {
  claro: {
    "--fc-bg": "#F7F8FB", "--fc-surface": "#FFFFFF", "--fc-surface-2": "#F1F4F9",
    "--fc-border": "#E3E8F0", "--fc-border-strong": "#CBD3E1",
    "--fc-text": "#0B1220", "--fc-muted": "#4B5565", "--fc-subtle": "#8A94A6",
    "--fc-pos": "#059669", "--fc-neg": "#E11D48", "--fc-warn": "#D97706",
    "--fc-shadow": "0 1px 2px rgba(16,24,40,.06), 0 12px 32px -16px rgba(16,24,40,.18)",
    "--fc-text-2": "#1F2937",
    "--fc-mark": "color-mix(in srgb, var(--accent) 18%, transparent)",
    "--fc-list": "#FFFFFF",
  },
  escuro: {
    "--fc-bg": "#0B0F17", "--fc-surface": "rgba(255,255,255,0.03)", "--fc-surface-2": "rgba(255,255,255,0.06)",
    "--fc-border": "rgba(255,255,255,0.10)", "--fc-border-strong": "rgba(255,255,255,0.25)",
    "--fc-text": "#FFFFFF", "--fc-muted": "rgba(255,255,255,0.60)", "--fc-subtle": "rgba(255,255,255,0.40)",
    "--fc-pos": "#34D399", "--fc-neg": "#FB7185", "--fc-warn": "#FBBF24",
    "--fc-shadow": "0 24px 48px -24px rgba(0,0,0,.6)",
    "--fc-text-2": "rgba(255,255,255,0.85)",
    "--fc-mark": "rgba(255,255,255,0.15)",
    "--fc-list": "rgba(255,255,255,0.02)",
  },
};

const CORES = ["var(--accent)", "#7C3AED", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];

const PADRAO: Pergunta[] = [
  { pergunta: "Quanto tempo leva a implantação?", resposta: "Entre 3 e 8 semanas, conforme o número de integrações. Você recebe um cronograma fechado na proposta, com marcos semanais e responsável de cada lado." },
  { pergunta: "Vocês migram os dados do sistema atual?", resposta: "Sim. Importamos cadastros, histórico financeiro e pedidos de planilhas ou do ERP anterior, validamos com a sua equipe e só então desligamos o processo antigo." },
  { pergunta: "Integra com o meu ERP e com o banco?", resposta: "Integramos via API com os principais ERPs do mercado, bancos com Open Finance e gateways de pagamento. Para sistemas legados, construímos o conector sob medida." },
  { pergunta: "Como fica a LGPD?", resposta: "Dados criptografados em repouso e em trânsito, servidores no Brasil, controle de acesso por perfil e trilha de auditoria. Assinamos o DPA junto com o contrato." },
  { pergunta: "Existe fidelidade ou multa de cancelamento?", resposta: "Não no plano mensal. No anual, o desconto é aplicado no pagamento e você pode cancelar a renovação a qualquer momento." },
  { pergunta: "Qual o suporte depois da entrega?", resposta: "Suporte por WhatsApp, e-mail e telefone, com SLA de primeira resposta de até 30 minutos em horário comercial e gerente de sucesso nos planos Crescimento e Corporativo." },
  { pergunta: "Emite nota fiscal?", resposta: "Sim. Toda cobrança gera NFS-e automaticamente para o CNPJ contratante." },
];

function realcar(texto: string, termo: string): ReactNode {
  if (!termo) return texto;
  const i = texto.toLowerCase().indexOf(termo.toLowerCase());
  if (i < 0) return texto;
  return (
    <>
      {texto.slice(0, i)}
      <mark className="rounded bg-[var(--fc-mark)] px-0.5 text-[var(--fc-text)]">{texto.slice(i, i + termo.length)}</mark>
      {texto.slice(i + termo.length)}
    </>
  );
}

export default function FaqAcordeao({
  tema = "claro",
  accent = "#0057FF",
  title = "Perguntas frequentes",
  subtitle = "O que os gestores mais perguntam antes de fechar o projeto.",
  perguntas = PADRAO,
  multiplas = false,
  contato = { label: "Falar com um especialista", href: "#contato" },
}: Props) {
  const id = useId();
  const [abertas, setAbertas] = useState<number[]>([0]);
  const [busca, setBusca] = useState("");
  const termo = busca.trim();
  const escuro = tema === "escuro";

  const visiveis = useMemo(
    () =>
      perguntas
        .map((p, i) => ({ ...p, i }))
        .filter((p) => !termo || `${p.pergunta} ${p.resposta}`.toLowerCase().includes(termo.toLowerCase())),
    [perguntas, termo],
  );

  const alternar = (i: number) =>
    setAbertas((a) => (a.includes(i) ? a.filter((x) => x !== i) : multiplas ? [...a, i] : [i]));

  return (
    <section
      style={{ ...TEMAS[tema], "--accent": accent } as CSSProperties}
      className="relative isolate overflow-hidden bg-[var(--fc-bg)] px-6 py-20 text-[var(--fc-text)] sm:py-28 lg:px-8"
    >
      {!escuro && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[var(--accent)] opacity-[0.10] blur-[110px]" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#7C3AED] opacity-[0.08] blur-[110px]" />
        </div>
      )}
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          {!escuro && (
            <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              FAQ
            </span>
          )}
          <h2 className={`${escuro ? "" : "mt-4 "}text-balance text-3xl font-semibold tracking-tight sm:text-4xl`}>{title}</h2>
          <p className="mt-4 text-pretty text-[var(--fc-muted)]">{subtitle}</p>

          <label htmlFor={`${id}-busca`} className="mt-8 block text-xs font-medium uppercase tracking-[0.15em] text-[var(--fc-subtle)]">
            Buscar
          </label>
          <div className="relative mt-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fc-subtle)]">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id={`${id}-busca`}
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: LGPD, integração, prazo"
              className="h-12 w-full rounded-xl border border-[var(--fc-border)] bg-[var(--fc-surface)] pl-11 pr-4 text-sm text-[var(--fc-text)] shadow-[var(--fc-shadow)] placeholder:text-[var(--fc-subtle)] transition-colors hover:border-[var(--fc-border-strong)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-[var(--fc-subtle)]" aria-live="polite">
            {termo ? `${visiveis.length} de ${perguntas.length} perguntas` : `${perguntas.length} perguntas`}
          </p>

          <div className={`mt-8 hidden rounded-2xl border border-[var(--fc-border)] p-6 lg:block ${escuro ? "bg-[var(--fc-surface)]" : "bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_8%,white)] to-white shadow-[var(--fc-shadow)]"}`}>
            {!escuro && (
              <span aria-hidden className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-[0_8px_20px_-8px_var(--accent)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
                </svg>
              </span>
            )}
            <p className="text-sm font-medium">Não encontrou o que procurava?</p>
            <p className="mt-1 text-sm text-[var(--fc-muted)]">Um especialista responde em até 30 minutos.</p>
            <a href={contato.href} className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:underline focus-visible:outline-none">
              {contato.label} →
            </a>
          </div>
        </div>

        <div>
          {visiveis.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--fc-border-strong)] bg-[var(--fc-surface)] p-10 text-center">
              <p className="text-sm text-[var(--fc-muted)]">Nenhuma pergunta encontrada para “{termo}”.</p>
              <a href={contato.href} className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline">
                {contato.label} →
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--fc-border)] overflow-hidden rounded-2xl border border-[var(--fc-border)] bg-[var(--fc-list)] shadow-[var(--fc-shadow)]">
              {visiveis.map((p) => {
                const aberta = abertas.includes(p.i) || (!!termo && visiveis.length <= 2);
                const bId = `${id}-b-${p.i}`;
                const pId = `${id}-p-${p.i}`;
                const cor = CORES[p.i % CORES.length];
                return (
                  <li key={p.i} className="relative">
                    {!escuro && aberta && <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: cor }} />}
                    <h3>
                      <button
                        id={bId}
                        type="button"
                        aria-expanded={aberta}
                        aria-controls={pId}
                        onClick={() => alternar(p.i)}
                        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium transition-colors hover:text-[var(--fc-text)] focus-visible:bg-[var(--fc-surface-2)] focus-visible:outline-none"
                      >
                        <span className="flex items-center gap-3">
                          {!escuro && (
                            <span
                              aria-hidden
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums"
                              style={{ background: `color-mix(in srgb, ${cor} 12%, transparent)`, color: cor }}
                            >
                              {String(p.i + 1).padStart(2, "0")}
                            </span>
                          )}
                          <span className={aberta ? "text-[var(--fc-text)]" : "text-[var(--fc-text-2)]"}>{realcar(p.pergunta, termo)}</span>
                        </span>
                        <span
                          aria-hidden
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            aberta ? "rotate-45 border-[var(--accent)] text-[var(--accent)]" : "border-[var(--fc-border-strong)] text-[var(--fc-subtle)]"
                          }`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={pId}
                      role="region"
                      aria-labelledby={bId}
                      hidden={!aberta}
                      className={`px-6 pb-6 text-sm leading-relaxed text-[var(--fc-muted)] ${escuro ? "" : "pl-16"}`}
                    >
                      {realcar(p.resposta, termo)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-16 text-center text-[11px] text-[var(--fc-subtle)]">
        <a href="https://flowcoresolucoes.com.br/codigos" target="_blank" rel="noopener" className="transition-colors hover:text-[var(--fc-text)]">
          Criado por FlowCore Soluções LTDA
        </a>
      </p>
    </section>
  );
}
