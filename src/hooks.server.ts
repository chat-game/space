import { type Handle, redirect } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { sequence } from '@sveltejs/kit/hooks'
import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import type { Profile } from '$lib/types'
import { type Locale, defaultLocale, supportedLocales } from '$lib/translations'

const handleJWT: Handle = ({ event, resolve }) => {
  const cookieKey = publicEnv.PUBLIC_COOKIE_KEY ?? ''
  const jwtSecret = privateEnv.PRIVATE_JWT_SECRET_KEY

  const token = event.cookies.get(cookieKey)
  if (!token || !jwtSecret) {
    event.locals.profile = null
    return resolve(event)
  }

  try {
    const { profile } = jwt.verify(token, jwtSecret) as { profile: Profile }
    event.locals.profile = { ...profile }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      event.cookies.delete(cookieKey, { path: '/' })
    }
  }

  return resolve(event)
}

const handleLocale: Handle = async ({ event, resolve }) => {
  const { pathname, search } = event.url

  const browserLang = `${`${event.request.headers.get('accept-language')}`.match(/[a-z]+(?=[\-_,;])/i)}`.toLowerCase()
  const browserLocale = supportedLocales.find((locale) => locale === browserLang) ? browserLang as Locale : defaultLocale
  const locale = supportedLocales.find((locale) => locale === event.params.lang) ? event.params.lang as Locale : browserLocale

  event.locals.locale = locale

  if (pathname === '/') {
    redirect(301, `/${defaultLocale}${search}`)
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', locale),
  })
}

export const handle = sequence(handleJWT, handleLocale)
