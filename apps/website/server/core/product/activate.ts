import { createId } from '@paralleldrive/cuid2'

export async function activateProduct({ profileId, productId }: { productId: string, profileId: string }) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: {
      items: true,
    },
  })

  // Patron points
  const itemPatronPoints = product?.items.find(({ type }) => type === 'PATRON_POINT')
  if (itemPatronPoints) {
    const increment = itemPatronPoints.amount
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        patronPoints: {
          increment,
        },
        points: {
          increment,
        },
      },
    })
  }

  if (productId === 'jehj4mxo0g6fp1eopf3jg641') {
    // 10 coins
    return activateProduct1(profileId)
  }
  if (productId === 'w0895g3t9q75ys2maod0zd1a') {
    // 50+10 coins
    return activateProduct2(profileId)
  }
  if (productId === 'nar1acws8c3s4w3cxs6i8qdn') {
    // 150+30 coins
    return activateProduct3(profileId)
  }
  if (productId === 'tp5w874gchf6hjfca9vory2r') {
    // 250+80 coins
    return activateProduct4(profileId)
  }
  if (productId === 'izh5v4vxztqi55gquts9ukn2') {
    // 500+150 coins
    return activateProduct5(profileId)
  }
  if (productId === 'xo7wmjsmawgb2rfxfzr7sexb') {
    // Christmas pack 2024
    return activateProduct6(profileId)
  }
}

function activateProduct1(profileId: string) {
  // 10 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 10,
      },
    },
  })
}

function activateProduct2(profileId: string) {
  // 50+10 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 60,
      },
    },
  })
}

function activateProduct3(profileId: string) {
  // 150+30 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 180,
      },
    },
  })
}

function activateProduct4(profileId: string) {
  // 250+80 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 330,
      },
    },
  })
}

async function activateProduct5(profileId: string) {
  // 500+150 coins
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 650,
      },
    },
  })

  // Gentleman: check if already have char
  const char = await prisma.characterEdition.findFirst({
    where: { profileId, characterId: 'w22vo3qzgfmvgt85ncfg398i' },
  })
  if (!char) {
    await prisma.characterEdition.create({
      data: {
        id: createId(),
        profileId,
        characterId: 'w22vo3qzgfmvgt85ncfg398i',
      },
    })
  }
}

async function activateProduct6(profileId: string) {
  // 50 coins
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 50,
      },
    },
  })

  // Trophy
  const trophy = await prisma.trophyEdition.findFirst({
    where: { profileId, trophyId: 'iadp4l86kc84hwz0culhig91' },
  })
  if (!trophy) {
    await prisma.trophyEdition.create({
      data: {
        id: createId(),
        profileId,
        trophyId: 'iadp4l86kc84hwz0culhig91',
      },
    })
  }

  // Santa: check if already have char
  const char = await prisma.characterEdition.findFirst({
    where: { profileId, characterId: 'ytyz0rtl2s84x2gmbvzl3r5h' },
  })
  if (!char) {
    await prisma.characterEdition.create({
      data: {
        id: createId(),
        profileId,
        characterId: 'ytyz0rtl2s84x2gmbvzl3r5h',
      },
    })
  }
}
