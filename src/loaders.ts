import { Loader, LoaderClient } from "@tanstack/react-loaders";
import { CollectionEntry, getCollection, getEntryBySlug } from "astro:content";

export class NotFoundError extends Error {
  data: string;
  constructor(public postId: string) {
    super(`Post with id "${postId}" not found!`);
    this.data = postId;
  }
}

const postLoader = new Loader({
  key: "blogPost",
  maxAge: Infinity,
  async loader(postId: string) {
    const post = await getEntryBySlug("blog", postId);
    if (!post) {
      throw new NotFoundError(postId);
    }
    return post;
  },
});

const blogLoader = new Loader({
  key: "blog",
  maxAge: Infinity,
  async loader() {
    const blog = await getCollection("blog");
    return blog;
  },
});

export function createLoaderClient() {
  return new LoaderClient({
    getLoaders: () => [postLoader, blogLoader],
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
