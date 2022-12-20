import { JSX } from "solid-js";
import type { Component } from "solid-js";
import { AuthProvider } from "./auth";
import { SnackbarProvider } from "./snackbar";
import { ThemeProvider } from "./theme";
import { I18nProvider } from "./i18n";

const BaseProviders: Component<{
  children: JSX.Element;
}> = (props) => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SnackbarProvider>
          <AuthProvider>{props.children}</AuthProvider>
        </SnackbarProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default BaseProviders;
