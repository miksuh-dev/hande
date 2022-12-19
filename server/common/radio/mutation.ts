import axios from "axios";
import { StationClickCountResult } from "./types";
import { generateUserAgentString } from "./utils";

export const addRadioClickCount = async (stationuuid: string) => {
  if (!process.env.RADIO_SEARCH_URL) {
    throw new Error("RADIO_SEARCH_URL is not set");
  }

  try {
    const url = `${process.env.RADIO_SEARCH_URL}/json/url/${stationuuid}`;

    const { data }: StationClickCountResult = await axios({
      method: "POST",
      url,
      data: {},
      headers: {
        "User-Agent": generateUserAgentString(),
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    return data;
  } catch (error) {
    console.error(error);

    throw new Error("Radio haku epäonnistui");
  }
};
