// Risoluzione e caricamento dei font brand per il canvas, condivisi tra
// generator interattivo e batch. Le family arrivano dalle CSS variable di
// next/font: lo swap Anton→Extenda resterà trasparente.
export function resolveFonts() {
  const styles = getComputedStyle(document.documentElement);
  const display = styles.getPropertyValue('--font-display').trim() || 'Anton';
  const sans = styles.getPropertyValue('--font-poppins').trim() || 'Poppins';
  return { display: `${display}, Anton, sans-serif`, sans: `${sans}, Poppins, sans-serif` };
}

export async function ensureFontsLoaded(fonts) {
  try {
    await Promise.all([
      document.fonts.load(`80px ${fonts.display}`),
      document.fonts.load(`700 40px ${fonts.sans}`),
      document.fonts.load(`400 40px ${fonts.sans}`),
      document.fonts.ready,
    ]);
  } catch {
    // senza font caricati si disegna coi fallback di sistema
  }
}
