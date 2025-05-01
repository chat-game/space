import process from 'node:process'
import { PrismaClient } from '@prisma/client'

function prismaClientSingleton() {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export type CustomPrismaClient = ReturnType<typeof prismaClientSingleton>

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
