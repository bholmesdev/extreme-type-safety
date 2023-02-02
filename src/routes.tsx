import { useLoaderInstance } from "@tanstack/react-loaders";
import { Outlet, ReactRouter, useParams } from "@tanstack/react-router";
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

const blogPostRoute = new Route({
  path: "$postId",
  component: BlogPostPage,
  onLoad: async ({ params: { postId }, preload, context }) =>
    context.loaderClient.getLoader({ key: "post" }).load({
      variables: postId,
      preload,
    }),
  getParentRoute: () => blogRoute,
});

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

function BlogPostPage() {
  const { postId } = useParams({ from: blogPostRoute.id });
  const {
    state: { data: post },
  } = useLoaderInstance({ key: "post", variables: postId });

  return (
    <>
      <h1>{post.data.title}</h1>
      <p>{post.body}</p>
    </>
  );
}

export const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute.addChildren([blogPostRoute]),
]);

export const router = new ReactRouter({ routeTree, context: { loaderClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
