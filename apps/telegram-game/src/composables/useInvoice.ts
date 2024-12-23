import { invoice, openInvoice } from '@telegram-apps/sdk-vue'

function open(url: string) {
  if (invoice.open.isAvailable()) {
    return openInvoice(url, 'url') as Promise<'paid' | 'failed' | 'pending' | 'cancelled'>
  }
}

export function useInvoice() {
  return { open }
}
