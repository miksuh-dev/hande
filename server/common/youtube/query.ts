import axios from "axios";
import { SearchListResult } from "./types";

export const searchList = async (content: string) => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=none&type=video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}&q=${content}`;

    const { data }: SearchListResult = await axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    return data.items;
  } catch (error) {
    console.error(error);

    throw new Error("Youtube haku epäonnistui");
  }
};
