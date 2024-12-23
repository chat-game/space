import { createId } from '@paralleldrive/cuid2'

export async function activateProduct(id: string, profileId: string) {
  if (id === 'jehj4mxo0g6fp1eopf3jg641') {
    // 10 coins
    return activateProduct1(profileId)
  }
  if (id === 'w0895g3t9q75ys2maod0zd1a') {
    // 50+10 coins
    return activateProduct2(profileId)
  }
  if (id === 'nar1acws8c3s4w3cxs6i8qdn') {
    // 150+30 coins
    return activateProduct3(profileId)
  }
  if (id === 'tp5w874gchf6hjfca9vory2r') {
    // 250+80 coins
    return activateProduct4(profileId)
  }
  if (id === 'izh5v4vxztqi55gquts9ukn2') {
    // 500+150 coins
    return activateProduct5(profileId)
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
      patronPoints: {
        increment: 110,
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
      patronPoints: {
        increment: 450,
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
      patronPoints: {
        increment: 1250,
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
      patronPoints: {
        increment: 2150,
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
      patronPoints: {
        increment: 3900,
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
