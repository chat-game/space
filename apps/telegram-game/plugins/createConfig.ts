import type { Plugin } from 'vite'
import fs from 'node:fs/promises'

export function createConfig(): Plugin {
  return {
    name: 'create-config',
    apply: 'build',
    configResolved: (config) => {
      if (!config.isProduction) {
        return
      }

      const filePath = `${config.publicDir}/config.js`
      const fileBody = `window.config = ${JSON.stringify(config.env)}`

      return fs.writeFile(filePath, fileBody)
    },
    transformIndexHtml(html) {
      return html.replace(/<!-- config-script -->/, '<script src="/config.js"></script>')
    },
  }
}
