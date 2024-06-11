import { db } from "$lib/server/db/db.client"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
  const id = params.slug

  const character = await db.character.findFirst({
    where: { id },
  })
  if (!character) {
    error(404, "Not found")
  }

  return {
    character,
  }
}
