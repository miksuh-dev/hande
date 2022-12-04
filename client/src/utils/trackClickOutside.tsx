import { onCleanup } from "solid-js";

export default (
  containerRef: HTMLDivElement | undefined,
  onChange: (open: boolean) => void
) => {
  const close = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onChange(false);
    }
  };

  const onClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
      if (!containerRef?.contains(e.target)) {
        onChange(false);
      }
    }
  };

  window.addEventListener("keydown", close);
  window.addEventListener("click", onClick);

  onCleanup(() => {
    window.removeEventListener("keydown", close);
    window.removeEventListener("click", onClick);
  });
};
