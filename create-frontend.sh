#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Détection et auto-incrémentation du nom du projet
base_name="frontend"
project_name="${base_name}"
counter=2

while [ -d "${project_name}" ]; do
  project_name="${base_name}${counter}"
  counter=$((counter + 1))
done

echo "========================================"
echo " Vite + React (JS + React Compiler)"
echo " Tailwind v4 + React Router + Akar Icons"
echo " Bootstrap + React Bootstrap"
echo " Projet cible : ${project_name}"
echo "========================================"
echo

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERREUR] npm introuvable. Installe Node.js puis relance ce script."
  read -r -p "Appuie sur Entree pour quitter"
  exit 1
fi

echo
echo "[1/4] Creation du projet '${project_name}'..."
npm create vite@latest "${project_name}" -- --template react-compiler --eslint --overwrite --no-interactive

echo
echo "[2/4] Nettoyage, configuration de l'architecture et Tailwind..."
# Création garantie des dossiers pages et components
mkdir -p "${project_name}/src/assets" "${project_name}/public" "${project_name}/src/pages" "${project_name}/src/components"
find "${project_name}/src/assets" "${project_name}/public" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

# Configuration des fichiers CSS
: > "${project_name}/src/App.css"
echo '@import "tailwindcss";' > "${project_name}/src/index.css"

# README vide (à la place du README généré par Vite)
: > "${project_name}/README.md"

# Configuration de App.jsx avec BrowserRouter (format exact demandé)
cat > "${project_name}/src/App.jsx" << 'EOF'
import { BrowserRouter } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
      
      
      
      
      
      
      
      
      
      </BrowserRouter>
    </>
  );
}
EOF

echo
echo "[3/4] Installation des dependances et mise a jour de la configuration..."
cd "${project_name}"

# Installation de base
npm install

# Ajout des paquets demandés (Tailwind, Router, Icons)
npm install tailwindcss @tailwindcss/vite react-router-dom
npm install --save-dev akar-icons

# Ajout des paquets Bootstrap et dépendances
npm install bootstrap react-bootstrap @popperjs/core
npm install popper.js --save
npm install tooltip.js --save

# Mise à jour de package.json, injection de Tailwind/Serveur dans vite.config et imports Bootstrap dans main.jsx
node -e "
const fs = require('fs');

// 1. Configuration de Vite
const viteFile = fs.readdirSync('.').find(f => f.startsWith('vite.config.'));
if (viteFile) {
  let code = fs.readFileSync(viteFile, 'utf8');
  
  // Ajout de l'import
  code = 'import tailwindcss from \"@tailwindcss/vite\";\n' + code;
  
  // Ajout de tailwind() dans le tableau plugins sans toucher au reste
  code = code.replace(/plugins:\s*\[/, 'plugins: [\n    tailwindcss(),');
  
  // Ajout des blocs server et preview à la fin de l'objet de configuration (en parallèle de plugins)
  code = code.replace(/\}\s*\)\s*;?\s*$/, '  server: {\n    port: 5173,\n    strictPort: true,\n  },\n  preview: {\n    port: 5173,\n    strictPort: true,\n  },\n});\n');
  
  fs.writeFileSync(viteFile, code);
}

// 2. Mise à jour des scripts de package.json
const pkgPath = 'package.json';
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = {
    start: 'vite',
    dev: 'vite',
    build: 'vite build',
    lint: 'eslint .',
    preview: 'vite preview'
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

// 3. Ajout des imports Bootstrap dans main.jsx
const mainPath = 'src/main.jsx';
if (fs.existsSync(mainPath)) {
  let mainCode = fs.readFileSync(mainPath, 'utf8');
  const bootstrapImports = 'import \"bootstrap/dist/css/bootstrap.min.css\";\nimport \"bootstrap/dist/js/bootstrap.bundle.js\";\nimport \"bootstrap/dist/js/bootstrap.esm.js\";\nimport \"bootstrap/dist/js/bootstrap.js\";\n';
  fs.writeFileSync(mainPath, bootstrapImports + mainCode);
}
"

echo
echo "[4/4] Lancement du serveur de developpement..."
echo "Ouvre http://localhost:5173 dans le navigateur."
echo
npm run dev