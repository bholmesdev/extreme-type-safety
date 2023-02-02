import { LoaderClientProvider } from "@tanstack/react-loaders";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import { router } from "../routes";
import { loaderClient } from "../loaders";

export default function App(props: {
  dehydratedRouter: ReturnType<typeof router.dehydrate>;
  dehydratedLoaderClient: ReturnType<typeof loaderClient.dehydrate>;
}) {
  React.useState(() => {
    // This is only going to run once per lifecycle of App
    // loaderClient.hydrate(props.dehydratedLoaderClient)
    router.hydrate(props.dehydratedRouter);
    loaderClient.hydrate(props.dehydratedLoaderClient);
  });

  return (
    <>
      <LoaderClientProvider loaderClient={loaderClient}>
        <RouterProvider router={router} />
      </LoaderClientProvider>
    </>
  );
}
