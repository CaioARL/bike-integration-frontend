// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers';

export default defineConfig(() => {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['register-components'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      vueRouterMode: 'history',
      minify: true,
      terserOptions: {
        compress: {
          drop_console: true, // Remove todos os console.* (log, warn, etc)
          drop_debugger: true, // Remove todos os debuggers
        },
        output: {
          comments: false, // Remove comentários do código
        },
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      env: {
        VUE_APP_API_URL: process.env.VUE_APP_API_URL || 'http://localhost:8080/bike-integration/v1',
        VUE_APP_API_X_ACCESS_KEY:
          process.env.VUE_APP_API_X_ACCESS_KEY ||
          '754SQn98HiZRrqUYM9ZLsbP0gvhG7Z92kjgD6AME9rIuHC1g22',
        VUE_APP_API_WS_URL:
          process.env.VUE_APP_API_WS_URL || 'ws://localhost:8080/bike-integration/ws',
      },
      vueOptions: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('custom-'),
        },
      },
      typescript: {
        strict: true,
        vueShim: true,
      },
      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      port: 9000,
      open: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {
        dark: false, // Define o tema padrão (false = claro, true = escuro)
      },
      iconSet: 'material-icons', // Define o conjunto de ícones a ser usado
      plugins: ['Notify'],
    },

    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
    //   pwaServiceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    //   bexManifestFile: 'src-bex/manifest.json
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000,
      middlewares: [
        'render', // keep this as last one
      ],
      pwa: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'Bicity',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: [],
    },
  };
});
