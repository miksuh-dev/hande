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
  },
  search: {
    placeholder: "Search...",
    youtube: {
      name: "YouTube",
      placeholder: "Search for a song",
    },
    radio: {
      name: "Radio",
      placeholder: "Search for a radio station",
    },
  },
  guestLogin: {
    title: "Enter nickname",
  },
  actions: {
    addToQueue: "Add to queue",
    continue: "Continue",
  },
  tooltip: {
    source: {
      youtube: {
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
    notLoggedIn: "You are not logged in",
    endingSong: "Error ending song",
    videoInfo: "Error getting video info",
  },
  snackbar: {
    source: {
      youtube: {
        addedToQueue: 'Added song "{{ item }}" to queue',
        skipped: 'Skipped song "{{ item }}"',
        skippedInPlaylist: 'Removed song "{{ item }}" from queue',
        setAsNext: 'Moved song "{{ item }}" to next',
      },
      radio: {
        addedToQueue: 'Added radio station "{{ item }}" to queue',
        skipped: 'Skipped radio station "{{ item }}"',
        setAsNext: 'Moved radio station "{{ item }}" to next',
      },
    },
  },
  common: {
    requester: "Requester",
    inQueue: "In queue",
    connectionClosed: "Connection closed",
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
    title: "Next in queue",
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
    source: {
      youtube: {
        start: 'Playing song "{{ item }}".',
        end: 'Finished playing song "{{ item }}".',

        added: 'added song "{{ item }}" to queue.',
        started: 'started playing song "{{ item }}".',
        skipped: 'skipped song "{{ item }}".',
        skippedQueue: 'skipped song "{{ item }}" from queue.',
        setAsNext: 'moved song "{{ item }}" to next.',
      },
      radio: {
        start: 'Playing radio station "{{ item }}"',
        end: 'Finished playing radio station "{{ item }}"',

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
