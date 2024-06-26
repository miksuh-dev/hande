export default {
  navigation: {
    theme: {
      tooltip: "Change theme",
      brightness: "Brightness",
      color: "Color",
    },
    user: {
      logout: "Log out",
    },
    language: {
      tooltip: "Change language",
    },
    changelog: "Changelog",
  },
  search: {
    placeholder: "Search...",
    song: {
      name: "Song",
      placeholder: "Search for a song from Youtube...",
    },
    playlist: {
      name: "YouTube",
      placeholder: "Search for a playlist from Youtube...",
    },
    radio: {
      name: "Radio",
      placeholder: "Search for a radio station...",
    },
  },
  guestLogin: {
    title: "Enter nickname",
  },
  actions: {
    addToQueue: "Add to queue",
    viewPlaylist: "View playlist",
    addSelected: "Add selected",
    selectAll: "Select all",
    clearSelections: "Clear selections",
    continue: "Continue",
    cancel: "Cancel",
    refreshPage: "Refresh page",
    reportSongBroken: "Report as broken",
  },
  tooltip: {
    common: {
      shufflePlaylist: "Shuffle playlist",
      clearPlaylist: "Clear playlist",
      showVideo: "Show video",
      hideVideo: "Hide video",
      showLyrics: "Show video",
      hideLyrics: "Hide video",
      noSongDetails: "No song details available",
      noSelections: "No selections",
      addRandomSong: "Add random song",
      randomSong: "Randomly added song",
      autoplayOn: "Set autoplay on",
      autoplayOff: "Set autoplay off",
    },
    source: {
      song: {
        playNext: "Play next",
        skip: "Skip song",
        skipInPlaylist: "Remove song from queue",
      },
      radio: {
        playNext: "Play next",
        skip: "Skip radio station",
        skipInPlaylist: "Remove radio station from queue",
      },
    },
  },
  error: {
    common: "Error: {{ error }}",
    unknown: "Unknown error",
    notLoggedIn: "You are not logged in",
    endingSong: "Error ending song",
    videoInfo: "Error getting video info",
    playlistTooLong: "Playlist is too long (max 50 songs allowed)",
    youtubeEmbeddingScript: "Error loading Youtube embedding script",
    tokenExpired: "Token expired",
    stillListening: "Still listening?",
    oldVersion: "Your session is outdated",
    socketReconnecting: "Socket connection lost. Reconnecting...",
    alreadyVoted: "You have already voted",
    songNotFound: "Song not found",
    lyricsNotFound: "Lyrics not found",
    lyricsApiError: "Error getting lyrics",
    reportedSongNotBroken: "Song was not broken. Report rejected!",
  },
  snackbar: {
    common: {
      clearedPlaylist: "Playlist cleared",
      shuffledPlaylist: "Playlist shuffled",
      movedSong: "Moved song",
      addedRandom: "Added random song",
      voted: "Vote given",
      autoplayOn: "Autoplay turned on",
      autoplayOff: "Autoplay turned off",
    },
    source: {
      song: {
        addedToQueue: 'Added song "{{ item }}" to queue',
        addedManyToQueue: "Added {{ count }} songs to queue",
        skipped: 'Skipped song "{{ item }}".',
        skippedInPlaylist: 'Removed song "{{ item }}" from queue',
        setAsNext: 'Moved song "{{ item }}" to next',
        reportedSong: "Song reported as broken. Checking...",
        reportedSongBroken: "Reported song was broken and it was deleted.",
      },
      radio: {
        addedToQueue: 'Added radio station "{{ item }}" to queue',
        skipped: 'Skipped radio station "{{ item }}".',
        setAsNext: 'Moved radio station "{{ item }}" to next',
      },
    },
  },
  common: {
    requester: "Requester",
    requesterWithOriginal:
      "Requester: {{ requester }} (original: {{ original }})",
    requestedAt: "Requested at",
    inQueue: "In queue",
    connectionClosed: "Connection closed",
    refreshPage: "Please refresh page to reconnect",
  },
  datetime: {
    today: "Today",
    yesterday: "Yesterday",
  },
  player: {
    title: "Playing currently",
    empty: {
      title: "Nothing is playing currently",
      subtitle: "Add something to the queue to start playing",
    },
  },
  playlist: {
    title: "Playlist",
  },
  history: {
    title: "History",
    user: "User",
    text: "Title",
  },
  statistics: {
    title: "Top 100",
    playCount: "Played {{ count }} times",
    filter: {
      last7days: "Last 7 days",
      lastMonth: "Last month",
      last3months: "Last 3 months",
      lastYear: "Last year",
      allTime: "All time",
    },
  },
  randomStatistics: {
    skipProbability: "Skip probability",
    rating: "Rating",
    skipCount: "Skip count",
    playCount: "Play count",
  },
  playlistDialog: {
    title: "Playlist: {{ name }}",
  },
  playlistClearDialog: {
    title: "Clear playlist",
    description:
      "Are you sure you want to remove {{ count }} songs from playlist?",
  },
  chat: {
    title: "Chat",
    message: {
      joined: "joined the room.",
      left: "left the room.",
    },
    placeholder: "Type a message...",
  },
  event: {
    retry:
      'Error playing song "{{ item }}". Retrying in 5 seconds. ({{ error }})',
    error:
      'Error playing song "{{ item }}". Skipping to next song in 5 seconds. ({{ error }})',
    common: {
      clearedPlaylist: "cleared playlist.",
      shuffledPlaylist: "shuffled playlist.",
      movedSong: 'changed song "{{ item }}" position in queue.',
      addedRandom: 'added "{{ statistics }}" song "{{ item }}" to queue.',
      addedRandomAutoplay:
        'added "{{ statistics }}" song "{{ item }}" to queue (autoplay).',
      changedVolume: 'changed volume of song "{{ item }}".',
      autoplayOn: "set autoplay on.",
      autoplayOff: "set autoplay on.",
      autoplayExpired: {
        timeout: "Autoplay expired (out of time).",
        emptyRoom: "Autoplay expired (room is empty).",
      },
      randomSong: "random",
    },
    source: {
      song: {
        start: 'Playing song "{{ item }}".',
        end: 'Finished playing song "{{ item }}".',

        added: 'added song "{{ item }}" to queue.',
        addedMany: "added {{ count }} songs to queue.",
        started: 'started playing song "{{ item }}".',
        skipped: 'skipped song "{{ item }}".',
        skippedQueue: 'skipped song "{{ item }}" from queue.',
        setAsNext: 'moved song "{{ item }}" to next.',
        reportedSongNotBroken:
          'reported song "{{ item }}" as broken. Song was not broken.',
        reportedSongBroken:
          'reported song "{{ item }}" as broken. Song was broken and was removed',
      },
      radio: {
        start: 'Playing radio station "{{ item }}".',
        end: 'Finished playing radio station "{{ item }}".',

        added: 'added radio station "{{ item }}" to queue.',
        started: 'started playing radio station "{{ item }}".',
        skipped: 'skipped radio station "{{ item }}".',
        skippedQueue: 'skipped radio station "{{ item }}" from queue.',
        setAsNext: 'moved radio station "{{ item }}" to next.',
      },
    },
  },
  users: {
    title: "Users",
  },
  badges: {
    verified: "This user is logged in using a Mumble account",
    system: "This user is the ruler of the room",
  },
  language: {
    fi: "Finnish",
    en: "English",
  },
};
