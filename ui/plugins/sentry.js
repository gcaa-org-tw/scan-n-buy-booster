import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

const SentryPlugin = {
  install (Vue) {
    const dsn = process.env.SENTRY_DSN
    if (dsn) {
      Sentry.init({
        dsn,
        integrations: [
          new Integrations.Vue({ Vue, attachProps: true }),
          new Integrations.CaptureConsole({
            levels: ['error']
          })
        ]
      })
      Vue.prototype.$sentry = {
        self: Sentry,
        setUser: (user) => {
          Sentry.configureScope((scope) => {
            scope.setUser(user)
          })
        }
      }
    } else {
      Vue.prototype.$sentry = {
        self: {
          captureMessage: (...args) => {
            // eslint-disable-next-line
            console.error(...args)
          }
        },
        setUser: () => {}
      }
    }
  }
}

Vue.use(SentryPlugin)
