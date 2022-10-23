import { JSX } from "solid-js";
import type { Component } from "solid-js";
import { AuthProvider } from "./auth";
import { SnackbarProvider } from "./snackbar";

const BaseProviders: Component<{
  children: JSX.Element;
}> = (props) => {
  return (
    <SnackbarProvider>
      <AuthProvider>{props.children}</AuthProvider>
    </SnackbarProvider>
  );
};

export default BaseProviders;
