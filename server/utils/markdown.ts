import MarkdownIt from "markdown-it";

export const getMarkdownIt = () => {
  const markdownIt = new MarkdownIt();

  const defaultRender =
    markdownIt.renderer.rules.link_open ||
    function (tokens, idx, options, _, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownIt.renderer.rules.link_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    // Add a new `target` attribute, or replace the value of the existing one.
    tokens[idx]?.attrSet("target", "_blank");

    // Pass the token to the default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  return markdownIt;
};
