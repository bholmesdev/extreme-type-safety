import { Loader, LoaderClient } from "@tanstack/react-loaders";
import { CollectionEntry, getEntryBySlug } from "astro:content";

export function createLoaderClient() {
  const postLoader = new Loader({
    key: "post",
    maxAge: Infinity,
    loader: async (postId: string) => {
      const post = await getEntryBySlug("blog", postId);
      if (!post) {
        throw new Error(`Post not found: ${postId}`);
      }
      return post;
    },
  });

  return new LoaderClient({
    getLoaders: () => [postLoader],
  });
}

/** For use on the client */
export const loaderClient = createLoaderClient();

// Register things for typesafety
declare module "@tanstack/react-loaders" {
  interface Register {
    loaderClient: typeof loaderClient;
  }
}
