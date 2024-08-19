import { api } from '$lib/server/api'

export async function load() {
  const latestCoupons = await api.coupon.getLatestList()
  if (latestCoupons instanceof Error) {
    return {
      latestCoupons: [],
    }
  }

  return {
    latestCoupons,
  }
}
