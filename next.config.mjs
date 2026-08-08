const nextConfig = {
    output: "export",
    // Nessun distDir custom: il dev server usa .next (isolato nel container),
    // la build con output "export" genera comunque out/.
    basePath: "",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
