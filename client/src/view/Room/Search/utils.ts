import { SongType, SourceType } from "../../../trpc/types";
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

export const sourceToSongType = (source: SourceType): SongType => {
  switch (source) {
    case SourceType.SONG:
      return SongType.SONG;
    case SourceType.RADIO:
      return SongType.RADIO;
    default:
      throw new Error("Invalid or unsupported source type");
  }
};
