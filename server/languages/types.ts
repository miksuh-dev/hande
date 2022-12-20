import * as english from "./en";
import * as finnish from "./fi";

export type ServerLanguage = typeof finnish.server | typeof english.server;
export type ClientLanguage = typeof finnish.client | typeof english.client;
