import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from "$lib/server/db/db.client";

export const load: PageServerLoad = async () => {
  const characters = await db.character.findMany();
  if (!characters) {
    error(404, 'Not found');
  }

  return {
    characters
  }
};