import * as english from "./language/en";
import * as finnish from "./language/fi";

export type ServerLanguage = typeof finnish.server | typeof english.server;
export type ClientLanguage = typeof finnish.client | typeof english.client;
