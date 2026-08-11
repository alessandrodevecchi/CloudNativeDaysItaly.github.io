/*
 * Token letti dalla configurazione vera: la pagina design system non
 * ricopia nessun valore a mano. Se un valore cambia in tailwind.config.mjs
 * la pagina cambia con lui.
 */
import tailwindConfig from '../../../../tailwind.config.mjs';

const theme = tailwindConfig.theme.extend;

export const COLORS = theme.colors;
export const FONT_SIZE = theme.fontSize;
export const SHADOWS = theme.boxShadow;
export const BORDER_WIDTH = theme.borderWidth;
