import { log } from "../utils/logger"

export default defineNitroPlugin(() => {
  log('Server started!')

  setInterval(() => {
    log('Server is OK...')
  }, 60000)
})