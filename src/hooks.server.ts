import { type Handle, type RequestEvent, error, redirect } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import type { Profile } from '$lib/types'
import { type Locale, defaultLocale, supportedLocales } from '$lib/translations'

export const handle: Handle = async ({ event, resolve }) => {
  handleJWT(event)
  handleLang(event)

  return resolve(event)
}

function handleJWT(event: RequestEvent) {
  const cookieKey = publicEnv.PUBLIC_COOKIE_KEY
  const jwtSecret = privateEnv.PRIVATE_JWT_SECRET_KEY

  if (jwtSecret && cookieKey && event.cookies.get(cookieKey)) {
    const token = event.cookies.get(cookieKey)
    if (!token) {
      event.locals.profile = null
      return
    }

    try {
      const payload = jwt.verify(token, jwtSecret)
      if (typeof payload === 'string') {
        error(400, 'Something went wrong')
      }
      if (!payload.profile) {
        error(400, 'Token is not valid')
      }

      const profile = payload.profile as Profile

      event.locals.profile = {
        ...profile,
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        event.cookies.delete(cookieKey, { path: '/' })
      }
    }
  }
}

function handleLang(event: RequestEvent) {
  const { pathname, search } = new URL(event.request.url)

  const pathLang = pathname.match(/[^/]+(?=\/|$)/)
  const pathnameWithoutLang = pathLang ? pathname.replace(`/${pathLang}`, '') : pathname
  const matchedLang = pathLang ? pathLang[0].toLowerCase() : null

  // First time on website? Let's find locale
  if (!matchedLang) {
    const browserLocale = `${`${event.request.headers.get('accept-language')}`.match(/[a-z]+(?=[\-_,;])/i)}`.toLowerCase()
    const locale = supportedLocales.find((locale) => locale === browserLocale) ? browserLocale : defaultLocale

    event.locals.locale = locale as Locale
    redirect(301, `/${locale}${pathnameWithoutLang}${search}`)
  }

  // We don't have this locale?
  if (!supportedLocales.find((locale) => locale === matchedLang)) {
    redirect(301, `/${defaultLocale}${pathnameWithoutLang}${search}`)
  }

  event.locals.locale = matchedLang as Locale
}
