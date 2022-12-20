import * as radio from "../../common/radio";
import * as youtube from "../../common/youtube";
import { Source } from "./types";

export enum SourceType {
  YOUTUBE = "youtube",
  RADIO = "radio",
}

export const SOURCES: Source[] = [
  {
    id: 1,
    value: SourceType.YOUTUBE,
  },
  {
    id: 2,
    value: SourceType.RADIO,
  },
];

export const searchFromSource = async (text: string, source: Source) => {
  if (source.value === "youtube") {
    const result = await youtube.searchList(text);

    return result.map(youtube.parseSearchListItem);
  }

  if (source.value === "radio") {
    const result = await radio.searchList(text);

    return result.map(radio.parseSearchListItem);
  }

  throw new Error("Invalid source");
};
