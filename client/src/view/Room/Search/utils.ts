import { SearchTerms } from ".";

export const hasSearchChanged = (
  prevSearch: SearchTerms | undefined,
  newSearch: SearchTerms
) => {
  if (!prevSearch) return true;

  return (
    prevSearch.text !== newSearch.text || prevSearch.source !== newSearch.source
  );
};
