import { Loader, LoaderClient } from "@tanstack/react-loaders";
import { CollectionEntry, getEntryBySlug } from "astro:content";
import { router } from "./routes";

export function createLoaderClient() {
  const postLoader = new Loader({
    key: "post",
    maxAge: Infinity,
    async loader(postId: CollectionEntry<"blog">["slug"]) {
      const post = await getEntryBySlug("blog", postId);
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
