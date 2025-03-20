#!/bin/bash

# Création des répertoires de sortie s'ils n'existent pas
mkdir -p output

echo "Démarrage de l'extraction du contenu des fichiers..."

# Extraction du contenu des fichiers frontend
echo "===== EXTRACTION DES FICHIERS FRONTEND =====" > output/contenu_frontend.txt
for file in $(find frontend -type f \( -name "*.js" -o -name "*.json" -o -name "*.css" -o -name "*.mjs" -o -name ".gitignore" -o -name "Dockerfile" \) -not -path "*/node_modules/*" -not -name "package-lock.json"); do
  echo "===== $file =====" >> output/contenu_frontend.txt
  cat "$file" >> output/contenu_frontend.txt
  echo -e "\n\n" >> output/contenu_frontend.txt
  echo "Fichier traité: $file"
done

# Extraction du contenu des fichiers backend
echo "===== EXTRACTION DES FICHIERS BACKEND =====" > output/contenu_backend.txt
for file in $(find backend -type f \( -name "*.js" -o -name "*.json" -o -name ".env" -o -name "README.md" -o -name "Dockerfile" \) -not -path "*/node_modules/*" -not -name "package-lock.json"); do
  echo "===== $file =====" >> output/contenu_backend.txt
  cat "$file" >> output/contenu_backend.txt
  echo -e "\n\n" >> output/contenu_backend.txt
  echo "Fichier traité: $file"
done

# Création d'un fichier complet avec tous les contenus
cat output/contenu_frontend.txt output/contenu_backend.txt > output/contenu_projet_complet.txt

echo "Extraction terminée!"
echo "Les fichiers suivants ont été créés:"
echo "- output/contenu_frontend.txt"
echo "- output/contenu_backend.txt"
echo "- output/contenu_projet_complet.txt"