import { useEffect, useState } from 'react';

export type Countdown = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  encerrado: boolean;
};

function calcular(alvo: number): Countdown {
  const restante = Math.max(0, alvo - Date.now());
  const total = Math.floor(restante / 1000);
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
    encerrado: restante === 0,
  };
}

/** Tempo restante até `targetDate`, atualizado a cada segundo. Nunca fica negativo. */
export function useCountdown(targetDate: Date): Countdown {
  const alvo = targetDate.getTime();
  const [estado, setEstado] = useState(() => calcular(alvo));

  useEffect(() => {
    const id = window.setInterval(() => setEstado(calcular(alvo)), 1000);
    return () => window.clearInterval(id);
  }, [alvo]);

  return estado;
}
