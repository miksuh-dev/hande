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
    youtube: {
      name: "YouTube",
      placeholder: "Hae kappaletta",
    },
    radio: {
      name: "Radio",
      placeholder: "Hae radiokanavaa",
    },
  },
  guestLogin: {
    title: "Syötä nimimerkki",
  },
  actions: {
    addToQueue: "Lisää jonoon",
    continue: "Jatka",
  },
  tooltip: {
    source: {
      youtube: {
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
  },
  snackbar: {
    source: {
      youtube: {
        addedToQueue: 'Lisättiin kappale "{{ item }}" jonoon',
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
    source: {
      youtube: {
        start: 'Soitetaan kappale "{{ item }}"',
        end: 'Kappale "{{ item }}" päättyi.',

        added: 'lisäsi kappaleen "{{ item }}" jonoon.',
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
