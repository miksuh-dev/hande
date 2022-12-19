import axios from "axios";
import { SearchListResult } from "./types";
import { generateUserAgentString } from "./utils";

export const searchList = async (content: string) => {
  if (!process.env.RADIO_SEARCH_URL) {
    throw new Error("RADIO_SEARCH_URL is not set");
  }

  try {
    const url = `${process.env.RADIO_SEARCH_URL}/json/stations/search`;

    const { data }: SearchListResult = await axios({
      method: "POST",
      url,
      data: {
        name: content,
        limit: 100,
        hidebroken: true,
      },
      headers: {
        "User-Agent": generateUserAgentString(),
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    // TODO: Add Icecast support
    return data.filter((item) => item.url.endsWith("m3u8")).splice(0, 10);
  } catch (error) {
    console.error(error);

    throw new Error("Radio haku epäonnistui");
  }
};
