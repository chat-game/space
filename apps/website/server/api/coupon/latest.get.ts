import type { EventHandlerRequest } from 'h3'

import type { Coupon, Profile } from '@chat-game/types'

export type CouponWithProfile = Coupon & { profile: Profile | null }

export default defineEventHandler<EventHandlerRequest, Promise<CouponWithProfile[]>>(async () => {
  const latestCoupons = (await prisma.coupon.findMany({
    where: { status: 'TAKEN' },
    orderBy: { createdAt: 'desc' },
    take: 20,
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
