import { JSX } from "solid-js";
import type { Component } from "solid-js";
import { AuthProvider } from "./auth";
import { SnackbarProvider } from "./snackbar";
import { ThemeProvider } from "./theme";

const BaseProviders: Component<{
  children: JSX.Element;
}> = (props) => {
  return (
    <SnackbarProvider>
      <ThemeProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default BaseProviders;
