const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, './public/federation.manifest.json');
const manifestContent = fs.readFileSync(manifestPath, 'utf8');

// Substitui a variável de ambiente pelo valor real
const replacedContent = manifestContent.replace(
  'process.env.ANGULAR_REMOTE',
  process.env.ANGULAR_REMOTE || 'http://localhost:4201' // Fallback para desenvolvimento
);

fs.writeFileSync(manifestPath, replacedContent, 'utf8');

console.log('Manifest de federação atualizado com sucesso!');
