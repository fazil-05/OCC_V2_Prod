import { deleteR2ObjectByPublicUrl } from "@/lib/r2";

/** Remove stored image from R2 when a post is removed or image replaced. Fire-and-forget safe. */
export async function removeStoredPostImage(url: string | null | undefined): Promise<void> {
  await deleteR2ObjectByPublicUrl(url);
}
