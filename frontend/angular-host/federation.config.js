const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'angular-host',

  remotes: {
    'angular-remote': `https://bytebank-fiap-fiii.vercel.app/remoteEntry.json`,
  },

  features: {
    // Habilita o compartilhamento de dependências "não utilizadas", como os locales.
    ignoreUnusedDeps: true,
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
