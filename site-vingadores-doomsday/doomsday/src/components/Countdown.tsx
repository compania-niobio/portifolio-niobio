import { useRef } from 'react';
import { getLenis } from '../hooks/useLenis';
import { useCountdown } from '../hooks/useCountdown';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';
import './Countdown.css';

// 18/12/2026 às 00:00 em America/Sao_Paulo (UTC-3)
const ESTREIA = new Date('2026-12-18T00:00:00-03:00');

const AGENDA_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Niobio//Vingadores Doomsday//PT-BR',
  'BEGIN:VEVENT',
  'UID:vingadores-doomsday-2026@niobio',
  'DTSTAMP:20260101T000000Z',
  'DTSTART;VALUE=DATE:20261218',
  'DTEND;VALUE=DATE:20261219',
  'SUMMARY:Estreia de Vingadores: Doomsday',
  'DESCRIPTION:Apenas nos cinemas.',
  'BEGIN:VALARM',
  'TRIGGER:-P1D',
  'ACTION:DISPLAY',
  'DESCRIPTION:Vingadores: Doomsday estreia amanhã',
  'END:VALARM',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

const AGENDA_HREF = `data:text/calendar;charset=utf-8,${encodeURIComponent(AGENDA_ICS)}`;
const GOOGLE_HREF =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent('Estreia de Vingadores: Doomsday')}` +
  '&dates=20261218/20261219' +
  `&details=${encodeURIComponent('Apenas nos cinemas.')}`;

/** Um dígito que desliza de cima para baixo sempre que muda. */
function Digito({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const primeiro = useRef(true);

  useGSAP(
    () => {
      if (primeiro.current) {
        primeiro.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      );
    },
    { dependencies: [char] },
  );

  return (
    <span ref={ref} className="cd__digit">
      {char}
    </span>
  );
}

function Unidade({ valor, rotulo, pulsa = false }: { valor: number; rotulo: string; pulsa?: boolean }) {
  const texto = String(valor).padStart(2, '0');
  return (
    <div className={pulsa ? 'cd__unit cd__unit--pulse' : 'cd__unit'}>
      <span className="cd__num" aria-hidden="true">
        {[...texto].map((char, i) => (
          <Digito key={texto.length - i} char={char} />
        ))}
      </span>
      <span className="cd__label" aria-hidden="true">
        {rotulo}
      </span>
    </div>
  );
}

export default function Countdown() {
  const { dias, horas, minutos, segundos, encerrado } = useCountdown(ESTREIA);
  const modal = useRef<HTMLDialogElement>(null);

  const abrir = () => {
    getLenis()?.stop();
    modal.current?.showModal();
  };

  return (
    <div id="relogio" className="cd">
      <h2 className="cd__title display">A hora se aproxima</h2>

      {encerrado ? (
        <p className="cd__done display green">Já em cartaz.</p>
      ) : (
        <div
          className="cd__clock"
          role="timer"
          aria-label={`Faltam ${dias} dias, ${horas} horas e ${minutos} minutos para a estreia`}
        >
          <Unidade valor={dias} rotulo="Dias" />
          <span className="cd__sep" aria-hidden="true">:</span>
          <Unidade valor={horas} rotulo="Horas" />
          <span className="cd__sep" aria-hidden="true">:</span>
          <Unidade valor={minutos} rotulo="Minutos" />
          <span className="cd__sep" aria-hidden="true">:</span>
          <Unidade valor={segundos} rotulo="Segundos" pulsa />
        </div>
      )}

      <button type="button" className="cd__cta" onClick={abrir}>
        Quero ser avisado
      </button>
      <p className="cd__note">18 de dezembro de 2026 — apenas nos cinemas</p>

      <dialog
        ref={modal}
        className="cd__modal"
        aria-labelledby="modal-titulo"
        onClose={() => getLenis()?.start()}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="cd__modal-body">
          <h3 id="modal-titulo" className="display">
            Marque a data
          </h3>
          <p>
            Coloque a estreia na sua agenda e receba um lembrete um dia antes. Nada é enviado para
            nenhum servidor.
          </p>
          <div className="cd__modal-actions">
            <a className="cd__cta" href={AGENDA_HREF} download="vingadores-doomsday.ics">
              Baixar lembrete (.ics)
            </a>
            <a className="cd__ghost" href={GOOGLE_HREF} target="_blank" rel="noreferrer">
              Abrir no Google Agenda
            </a>
          </div>
          <form method="dialog">
            <button className="cd__close" aria-label="Fechar">
              ×
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
