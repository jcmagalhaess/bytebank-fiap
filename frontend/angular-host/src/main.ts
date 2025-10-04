import { initFederation } from '@angular-architects/native-federation';

initFederation({
  // Define estaticamente onde encontrar o micro-frontend 'angular-remote'
  'angular-remote': 'http://localhost:4201/remoteEntry.json',
})
  .catch((err) => console.error(err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
