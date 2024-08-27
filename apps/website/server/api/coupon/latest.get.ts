import type { Coupon, Profile } from '@chat-game/types'

export type CouponWithProfile = Coupon & { profile: Profile | null }

export default defineEventHandler(async () => {
  const latestCoupons = (await prisma.coupon.findMany({
    where: { status: 'TAKEN' },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })) as CouponWithProfile[]

  for (const coupon of latestCoupons) {
    if (!coupon.profileId) {
      continue
    }

    coupon.profile = await prisma.profile.findFirst({
      where: { id: coupon.profileId },
    })
  }

  return latestCoupons
})
