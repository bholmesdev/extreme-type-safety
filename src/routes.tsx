import { useLoaderInstance } from "@tanstack/react-loaders";
import { z } from "astro:content";
import { Outlet, ReactRouter } from "@tanstack/react-router";
import type { RegisteredLoaderClient } from "@tanstack/react-loaders";
import { RootRoute, Route } from "@tanstack/router";
import { loaderClient } from "./loaders";

interface RouterContext {
  loaderClient: RegisteredLoaderClient;
}

const rootRoute = RootRoute.withRouterContext<RouterContext>()();

const indexRoute = new Route({
  path: "/",
  component: IndexPage,
  getParentRoute: () => rootRoute,
});

const blogRoute = new Route({
  path: "blog",
  component: BlogPage,
  getParentRoute: () => rootRoute,
});

const blogSearchRoute = new Route({
  path: "search",
  component: BlogSearchPage,
  validateSearch: (unparsedSearch: Record<string, unknown>) => {
    // TODO: pull from object map
    // Not exposed by Astro content today!
    const search = {
      postId: z.enum(["first", "second"]).parse(unparsedSearch.postId),
    };
    return search;
  },
  onLoad: async ({ search: { postId }, preload, context }) =>
    context.loaderClient.getLoader({ key: "post" }).load({
      variables: postId,
      preload,
    }),
  getParentRoute: () => blogRoute,
});

const error404Route = new Route({
  path: "404",
  component: Error404Page,
  getParentRoute: () => rootRoute,
});

function Error404Page() {
  return <p>404!</p>;
}

function IndexPage() {
  return <p>Index!</p>;
}

function BlogPage() {
  return (
    <>
      <h1>Blog</h1>
      <Outlet />
    </>
  );
}

function BlogSearchPage() {
  // TODO: circle back to useSearch when SSR is fixed
  // const { postId } = useSearch({ from: blogSearchRoute.id });
  const {
    state: { data: post },
    // Hard code variables for now
  } = useLoaderInstance({ key: "post", variables: "first" });

  return (
    <>
      <h1>{post.data.title}</h1>
      <p>{post.body}</p>
    </>
  );
}

export const routeTree = rootRoute.addChildren([
  indexRoute,
  error404Route,
  blogRoute.addChildren([blogSearchRoute]),
]);

export const router = new ReactRouter({ routeTree, context: { loaderClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
