import { createSignal } from "solid-js";

const STORAGE_ITEM = "latestVersion";

const [getVersion, setVersion] = createSignal(
  localStorage.getItem(STORAGE_ITEM),
);

export const setLastVersion = (version: string) => {
  localStorage.setItem(STORAGE_ITEM, version);
  setVersion(version);
};

export const isLatestVersion = (version: string) => {
  return version === getVersion();
};

export { getVersion };
