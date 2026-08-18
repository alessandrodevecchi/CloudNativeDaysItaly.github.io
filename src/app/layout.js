import { promises as fs } from 'fs';
import path from 'path';
import { Poppins, Anton } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import config from "@/config/website.json";
import "@/styles/globals.css";

// Brand fonts — vedi docs/design-system.md.
// Anton è il fallback di Extenda 50 Mega finché non disponiamo dei webfont licenziati.
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-poppins",
});
const anton = Anton({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-display",
});

// Titolo e descrizione di riserva: valgono per le pagine che non ne
// dichiarano uno proprio. Dalla config, così seguono l'edizione.
export const metadata = {
    title: `${config.general.event.name} ${config.general.edition}`,
    description: config.general.event.description,
};

async function getEditions() {
    try {
        const editionsDir = path.join(process.cwd(), 'src', 'config', 'editions');
        const files = await fs.readdir(editionsDir);
        return files.map(file => file.replace('.json', ''));
    } catch (error) {
        console.error("Could not read editions directory:", error);
        return [];
    }
}

export default async function RootLayout({ children }) {
    const availableEditions = await getEditions();

    return (
        <html lang="it" className={`${poppins.variable} ${anton.variable}`} suppressHydrationWarning>
        <head>
            {/* Sceglie la composizione decorativa del hero PRIMA del primo paint:
                nessuno switch visibile e niente scroll anchoring (vedi heroVariants.js). */}
            <script
                dangerouslySetInnerHTML={{
                    __html: 'document.documentElement.dataset.decor=Math.floor(Math.random()*10);',
                }}
            />
            <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
            <link rel="manifest" href="/favicons/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" />
            <meta name="theme-color" content="#ffffff" />
        </head>
        <body className="bg-white font-sans text-ink">
        <Navbar
            data={config}
            editions={availableEditions}
        />
        <main className="pt-20">{children}</main>
        <Footer
            data={config}
            editions={availableEditions}
        />
        </body>
        </html>
    );
}
