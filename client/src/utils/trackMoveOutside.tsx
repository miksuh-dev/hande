import { onCleanup } from "solid-js";

export default (
  containerRef: HTMLDivElement | HTMLElement | undefined,
  onChange: (open: boolean) => void
) => {
  const onOut = () => {
    onChange(false);
  };

  containerRef?.addEventListener("mouseleave", onOut);

  onCleanup(() => {
    containerRef?.addEventListener("mouseleave", onOut);
  });
};
