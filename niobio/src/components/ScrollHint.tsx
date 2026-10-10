/** Indicador de scroll com a linha dourada pulsando. */
export function ScrollHint({ label = 'ROLE PARA ENTRAR' }: { label?: string }) {
  return (
    <div className="scroll-hint">
      <span>{label}</span>
      <span className="scroll-hint__line" aria-hidden="true" />
    </div>
  );
}
