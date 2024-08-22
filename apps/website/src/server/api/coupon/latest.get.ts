import type { EventHandlerRequest } from 'h3'
import { db } from '@chat-game/prisma-client'
import type { Coupon, Profile } from '@chat-game/types'

export type CouponWithProfile = Coupon & { profile: Profile | null }

export default defineEventHandler<EventHandlerRequest, Promise<CouponWithProfile[]>>(async () => {
  const latestCoupons = (await db.coupon.findMany({
    where: { status: 'TAKEN' },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })) as CouponWithProfile[]

  for (const coupon of latestCoupons) {
    if (!coupon.profileId) {
      continue
    }

    coupon.profile = await db.profile.findFirst({
      where: { id: coupon.profileId },
    })
  }

  return latestCoupons
})
