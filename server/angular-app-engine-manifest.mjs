
export default {
  basePath: '/Invideo-quiz-manager',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
