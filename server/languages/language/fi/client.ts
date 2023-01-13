export default {
  navigation: {
    theme: {
      tooltip: "Vaihda sivun teemaa",
      brightness: "Kirkkaus",
      color: "Väri",
    },
    user: {
      logout: "Kirjaudu ulos",
    },
    language: {
      tooltip: "Vaihda kieltä",
    },
  },
  search: {
    placeholder: "Hae...",
    song: {
      name: "Kappale",
      placeholder: "Hae kappaletta Youtubesta...",
    },
    playlist: {
      name: "Soittolista",
      placeholder: "Hae soittolistaa Youtubesta...",
    },
    radio: {
      name: "Radio",
      placeholder: "Hae radiokanavaa...",
    },
  },
  guestLogin: {
    title: "Syötä nimimerkki",
  },
  actions: {
    addToQueue: "Lisää jonoon",
    viewPlaylist: "Näytä soittolista",
    addSelected: "Lisää valitut",
    selectAll: "Valitse kaikki",
    clearSelections: "Tyhjennä valinnat",
    continue: "Jatka",
    cancel: "Peruuta",
  },
  tooltip: {
    common: {
      clearPlaylist: "Tyhjennä soittolista",
    },
    source: {
      song: {
        playNext: "Soita seuraavaksi",
        skip: "Ohita kappale",
        skipInPlaylist: "Poista kappale jonosta",
      },
      radio: {
        playNext: "Toista seuraavaksi",
        skip: "Ohita radiokanava",
        skipInPlaylist: "Poista radiokanava jonosta",
      },
    },
  },
  error: {
    common: "Virhe: {{ error }}",
    notLoggedIn: "Et ole kirjautunut sisään",
    endingSong: "Virhe kappaletta lopetettaessa",
    videoInfo: "Virhe haettaessa videon tietoja",
    playlistTooLong:
      "Soittolista on liian pitkä (max 50 kappaletta on sallittu)",
  },
  snackbar: {
    common: {
      clearedPlaylist: "Soittolista tyhjennetty",
    },
    source: {
      song: {
        addedToQueue: 'Lisättiin kappale "{{ item }}" jonoon',
        addedManyToQueue: "Lisättiin {{ count }} kappaletta jonoon",
        skipped: 'Ohitettiin kappale "{{ item }}"',
        skippedInPlaylist: 'Poistettiin kappale "{{ item }}" jonosta',
        setAsNext: 'Siirrettiin kappale "{{ item }}" seuraavaksi',
      },
      radio: {
        addedToQueue: 'Lisättiin radiokanava "{{ item }}" jonoon',
        skipped: 'Ohitettiin radiokanava "{{ item }}"',
        setAsNext: 'Siirrettiin radiokanava "{{ item }}" seuraavaksi',
      },
    },
  },
  common: {
    requester: "Toivoja",
    inQueue: "Jonossa",
    connectionClosed: "Yhteys huoneeseen päätettiin",
  },
  datetime: {
    today: "Tänään",
    yesterday: "Eilen",
  },
  player: {
    title: "Soi tällä hetkellä",
    empty: {
      title: "Tällä hetkellä ei soi mitään",
      subtitle: "Lisää uusia kappaleita jonoon aloittaaksesi toiston",
    },
  },
  playlist: {
    title: "Seuraavana vuorossa",
  },
  playlistDialog: {
    title: "Soittolista: {{ name }}",
  },
  playlistClearDialog: {
    title: "Tyhjennä soittolista",
    description:
      "Haluatko varmasti poistaa {{ count }} kappaletta soittolistasta?",
  },
  chat: {
    title: "Chat",
    message: {
      joined: "liittyi huoneeseen.",
      left: "poistui huoneesta.",
    },
    placeholder: "Kirjoita viestisi tähän...",
  },
  event: {
    retry:
      'Virhe kappaleen "{{ item }}" toistossa. Yritetään toistoa uudelleen 5 sekunnin kuluttua. ({{ error }})',
    error:
      'Virhe kappaleen "{{ item }}" toistossa. Siirrytään seuraavaan kappaleeseen 5 sekunnin kuluttua. ({{ error }})',
    common: {
      clearedPlaylist: "tyhjensi soittolistan.",
    },
    source: {
      song: {
        start: 'Soitetaan kappale "{{ item }}"',
        end: 'Kappale "{{ item }}" päättyi.',

        added: 'lisäsi kappaleen "{{ item }}" jonoon.',
        addedMany: "lisäsi {{ count }} kappaletta jonoon.",
        started: 'aloitti kappaleen "{{ item }}".',
        skipped: 'ohitti kappaleen "{{ item }}".',
        skippedQueue: 'poisti kappaleen "{{ item }}" jonosta.',
        setAsNext: 'siirsi kappaleen "{{ item }}" jonon kärkeen.',
      },
      radio: {
        start: 'Toistetaan radiokanavaa "{{ item }}"',
        end: 'Radiokanavan toisto "{{ item }}" päättyi.',

        added: 'lisäsi radiokanavan "{{ item }}" jonoon.',
        started: 'aloitti radiokanavan "{{ item }} toiston".',
        skipped: 'ohitti radiokanavan "{{ item }}".',
        skippedQueue: 'ohitti radiokanavan "{{ item }}" jonosta.',
        setAsNext: 'siirsi radiokanavan "{{ item }}" jonon kärkee.n',
      },
    },
  },
  users: {
    title: "Käyttäjät",
  },
  badges: {
    verified: "Tämä käyttäjä on kirjautunut käyttäen Mumble-tunnusta",
    system: "Hallitkoon kuningas omaa huonettaan ennen kuin muihin puuttuu",
  },
  language: {
    fi: "Suomi",
    en: "Englanti",
  },
};
