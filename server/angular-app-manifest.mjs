
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Invideo-quiz-manager/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/Invideo-quiz-manager/quiz",
    "route": "/Invideo-quiz-manager"
  },
  {
    "renderMode": 2,
    "route": "/Invideo-quiz-manager/quiz"
  },
  {
    "renderMode": 2,
    "route": "/Invideo-quiz-manager/quiz-viewer"
  },
  {
    "renderMode": 2,
    "route": "/Invideo-quiz-manager/preview-dialog"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7951, hash: '2aa2eb23528048b5cfcd532a6ba797c63f2b0dac7b3aaaa8f44a0967b7e5dc7e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1336, hash: 'e1144b8422b3466bff2de1b7bb5b7adbc74d77f279a85d8a6e3c165e74b9402c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'quiz-viewer/index.html': {size: 32106, hash: '3ae5856ec17190c52e710e452c350350ed07b73b5143af6d695b3ed5305c1d22', text: () => import('./assets-chunks/quiz-viewer_index_html.mjs').then(m => m.default)},
    'quiz/index.html': {size: 32959, hash: '6230bfa678a9f5b0185b75aa47c64f0168a930be4559733e8fc7843ed19e0c45', text: () => import('./assets-chunks/quiz_index_html.mjs').then(m => m.default)},
    'preview-dialog/index.html': {size: 32865, hash: 'fba8f1a4514ef0f62eee94d8c6c367ec6bbd92750a06eb25d4a9e94686710782', text: () => import('./assets-chunks/preview-dialog_index_html.mjs').then(m => m.default)},
    'styles-ZMJF4XPH.css': {size: 7442, hash: 'dw+zGWfxjNI', text: () => import('./assets-chunks/styles-ZMJF4XPH_css.mjs').then(m => m.default)}
  },
};
