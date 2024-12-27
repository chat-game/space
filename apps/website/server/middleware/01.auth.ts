export default defineEventHandler(async (event) => {
  // Payment webhook dont need auth
  if (event.path.startsWith('/api/payment/webhook')) {
    return
  }

  if (event.method === 'OPTIONS') {
    event.headers.set('Access-Control-Allow-Origin', '*')
    event.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    return event
  }

  const session = await getUserSession(event)
  if (session?.user) {
    // Already authenticated
  }
})
