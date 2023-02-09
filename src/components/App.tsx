import { LoaderClientProvider } from "@tanstack/react-loaders";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../routes";
import { loaderClient } from "../loaders";
import { useState } from "react";

export default function App(props: {
  dehydratedRouter: ReturnType<typeof router.dehydrate>;
  dehydratedLoaderClient: ReturnType<typeof loaderClient.dehydrate>;
}) {
  useState(() => {
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
