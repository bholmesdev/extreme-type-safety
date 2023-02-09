import { useLoaderInstance } from "@tanstack/react-loaders";
import { Outlet, ReactRouter, useParams } from "@tanstack/react-router";
import type { RegisteredLoaderClient } from "@tanstack/react-loaders";
import { RootRoute, Route } from "@tanstack/router";
import { loaderClient, NotFoundError } from "./loaders";

interface RouterContext {
  loaderClient: RegisteredLoaderClient;
}

const rootRoute = RootRoute.withRouterContext<RouterContext>()();

const indexRoute = new Route({
  path: "/",
  async onLoad({ params, context }) {
    return context.loaderClient.getLoader({ key: "blog" }).load();
  },
  component() {
    const {
      state: { data: blog },
      // Hard code variables for now
    } = useLoaderInstance({ key: "blog" });
    return (
      <main>
        <h1>Blog</h1>
        <ul>
          {blog.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`}>{post.data.title}</a>
            </li>
          ))}
        </ul>
      </main>
    );
  },
  getParentRoute: () => rootRoute,
});

const error404Route = new Route({
  path: "404",
  component() {
    return <p>404!</p>;
  },
  getParentRoute: () => rootRoute,
});

const blogPostRoute = new Route({
  path: "/blog/$postId",
  getParentRoute: () => rootRoute,
  async onLoad({ params, context }) {
    const result = await context.loaderClient
      .getLoader({ key: "blogPost" })
      .load({ variables: params.postId });
    return result;
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) {
      return <div>Post with id "{error.data}" found!</div>;
    }

    return (
      <div>
        Oops! <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  },
});

function BlogPostPage() {
  const { postId } = useParams({ from: blogPostRoute.id });
  const {
    state: { data: post },
    // Hard code variables for now
  } = useLoaderInstance({ key: "blogPost", variables: postId });
  return (
    <article>
      <h2>{post.data.title}</h2>
      <pre>{post.body}</pre>
    </article>
  );
}

export const routeTree = rootRoute.addChildren([
  indexRoute,
  error404Route,
  blogPostRoute,
  // blogRoute.addChildren([blogPostRoute]),
]);

export const router = new ReactRouter({ routeTree, context: { loaderClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
