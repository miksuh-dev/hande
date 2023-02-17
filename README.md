# Hande

[Mumble](https://www.mumble.info/) music bot with a web interface. Supports Youtube and radio stations.

## Under development

This project is still under development and has some major missing features. See [TODO](docs/TODO.md) for more information about missing and planned features and known bugs. If you find any new bugs or have new feature ideas feel free to open an issue!

## Screenshots

| ![youtube](https://user-images.githubusercontent.com/11806132/210383776-650c5ac9-5d50-43a1-a35a-5a1c28dd7874.gif) |
| :---------------------------------------------------------------------------------------------------------------: |
|                                <b>Youtube search support with playlist actions</b>                                |

| ![themes and languages](https://user-images.githubusercontent.com/11806132/210380520-3689fc16-7ac3-45c8-8035-5e609f3b6d9a.gif) |
| :----------------------------------------------------------------------------------------------------------------------------: |
|                                           <b>Multiple color themes and languages</b>                                           |

## Available commands

The following commands are currently available and can be used through the Mumble client:
| Command | Description |
|--------------- | --------------- |
| `hande www` | Generates a link to the web interface |
| `hande help` | Shows a list of available commands |

## Dependencies

Before running the bot, you need to have the following dependencies met:

- [Youtube Data API key](https://developers.google.com/youtube/registering_an_application)
- `yt-dlp` and `ffmpeg` installed

## Installation

After the dependencies, run the following commands:

```bash
git clone https://github.com/miksuh-dev/hande
cd hande && npm install
cd client && npm install
```

## Starting the bot

### Development

Run the following commands in seperate terminals:

```bash
npm run client
npm run server
```

### Production

```bash
npm run build
npm run start:prod
```

## Configuration

Copy `.env.example` to `.env` and fill in the values. The following variables are supported.
| Variable: | Details: |
|--------------- | --------------- |
| `PORT` | Target port where the bot will be running |
| `DATABASE_URL` | Location where the database is stored. The bot currently uses SQLite to store playlists |
| `AUTH_TOKEN_SECRET` | Add lengthy random secret used for JWT token |
| `MUMBLE_ADDRESS` | Target mumble server address |
| `MUMBLE_PORT` | Target mumble server port |
| `MUMBLE_PASSWORD` | Target mumble server password |
| `MUMBLE_USERNAME` | Username that the bot will be using |
| `TOKEN_URL` | Target URL that bot will be using when generating web-interface auth URL |
| `YOUTUBE_API_KEY` | Bot uses youtube data API to fetch search results, obtain your api key [here](https://developers.google.com/youtube/registering_an_application) |
| `YOUTUBE_DL_LOCATION` | Bot uses yt-dlp to stream videos on youtube. |
| `RADIO_SEARCH_URL` | Bot searches radio stations from [radio-browser.info](https://radio-browser.info). Insert desired API endpoint URL here |
| `SERVER_LANGUAGE` | Currently supported languages are: `en` (English) and `fi` (Finnish) |
