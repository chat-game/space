import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  redirect(301, "/")
}