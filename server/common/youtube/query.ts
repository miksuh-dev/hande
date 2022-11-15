import axios from "axios";
import { SearchListResult, VideoDetail } from "./types";
import { parseDuration } from "./utils";

export const searchList = async (content: string) => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=none&type=playlist,video&maxResults=25&key=${process.env.YOUTUBE_API_KEY}&q=${content}`;

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

    throw new Error("Failed to search");
  }
};

export const getVideoDetails = async (id: string) => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`;

    const { data }: VideoDetail = await axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    const contentDetails = data.items[0]?.contentDetails;
    if (!contentDetails) {
      throw new Error("No content details found");
    }

    return {
      ...contentDetails,
      duration: parseDuration(contentDetails.duration),
    };
  } catch (error) {
    console.error(error);

    throw new Error("No content details found");
  }
};
