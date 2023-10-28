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
    changelog: "Muutoshistoria",
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
    refreshPage: "Päivitä sivu",
  },
  tooltip: {
    common: {
      shufflePlaylist: "Sekoita soittolista",
      clearPlaylist: "Tyhjennä soittolista",
      showVideo: "Näytä video",
      hideVideo: "Piilota video",
      noSelections: "Ei valintoja",
      addRandomSong: "Lisää satunnainen kappale",
      randomSong: "Satunnaisesti lisätty kappale",
      autoplayOn: "Aseta automaatinen toisto päälle",
      autoplayOff: "Aseta automaatinen toisto pois päältä",
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
    unknown: "Tuntematon virhe",
    notLoggedIn: "Et ole kirjautunut sisään",
    endingSong: "Virhe kappaletta lopetettaessa",
    videoInfo: "Virhe haettaessa videon tietoja",
    playlistTooLong:
      "Soittolista on liian pitkä (max 50 kappaletta on sallittu)",
    youtubeEmbeddingScript: "Virhe haettaessa Youtube-embed-koodia",
    tokenExpired: "Kirjautumisesi on vanhentunut",
    oldVersion: "Vanhentunut versio",
    stillListening: "Kuunteletko vielä?",
    socketReconnecting: "Yhteys palvelimeen katkesi. Yhdistetään uudelleen...",
    alreadyVoted: "Olet jo äänestänyt tätä kappaletta",
    songNotFound: "Kappaletta ei löytynyt",
  },
  snackbar: {
    common: {
      clearedPlaylist: "Soittolista tyhjennetty",
      shuffledPlaylist: "Soittolista sekoitettu",
      movedSong: "Kappaleen sijaintia vaihdettu",
      addedRandom: "Lisättiin satunnainen kappale",
      voted: "Ääni annettu",
      autoplayOn: "Asetettiin automaattinen toisto päälle",
      autoplayOff: "Asetettiin automaattinen toisto pois päältä",
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
        skipped: 'Ohitettiin radiokanava "{{ item }}".',
        setAsNext: 'Siirrettiin radiokanava "{{ item }}" seuraavaksi',
      },
    },
  },
  common: {
    requester: "Toivoja",
    requesterWithOriginal:
      "Toivoja: {{ requester }} (alkuperäinen: {{ original }})",
    requestedAt: "Toivottu",
    inQueue: "Jonossa",
    connectionClosed: "Yhteys huoneeseen päätettiin",
    refreshPage: "Päivitä sivu muodostaaksesi yhteys uudelleen",
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
    title: "Soittolista",
  },
  history: {
    title: "Historia",
    user: "Käyttäjä",
    text: "Otsikko",
  },
  statistics: {
    title: "Top 100",
    playCount: "Toistettu {{ count }} kertaa",
    filter: {
      last7days: "Viimeiset 7 päivää",
      lastMonth: "Viimeisin kuukausi",
      last3months: "Viimeiset 3 kuukautta",
      lastYear: "Viimeisin vuosi",
      allTime: "Kaikilta ajoilta",
    },
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
      shuffledPlaylist: "sekoitti soittolistan.",
      movedSong: 'vaihtoi kappaleen "{{ item }}" sijaintia jonossa.',
      addedRandom: 'lisäsi sattumanvaraisen kappaleen "{{ item }}" jonoon.',
      addedRandomAutoplay:
        'lisäsi sattumanvaraisen kappaleen "{{ item }}" jonoon (automaattinen toisto).',
      changedVolume: 'vaihtoi kappaleen "{{ item }}" äänenvoimakkuutta.',
      autoplayOn: "asetti automaattisen toiston päälle.",
      autoplayOff: "asetti automaattisen toiston pois päältä.",
      autoplayExpired: {
        timeout: "Automaattinen toisto päättyi (aika päättyi).",
        emptyRoom: "Automaattinen toisto päättyi (huone on tyhjä).",
      },
    },
    source: {
      song: {
        start: 'Soitetaan kappale "{{ item }}".',
        end: 'Kappale "{{ item }}" päättyi.',

        added: 'lisäsi kappaleen "{{ item }}" jonoon.',
        addedMany: "lisäsi {{ count }} kappaletta jonoon.",
        started: 'aloitti kappaleen "{{ item }}".',
        skipped: 'ohitti kappaleen "{{ item }}".',
        skippedQueue: 'poisti kappaleen "{{ item }}" jonosta.',
        setAsNext: 'siirsi kappaleen "{{ item }}" jonon kärkeen.',
      },
      radio: {
        start: 'Toistetaan radiokanavaa "{{ item }}".',
        end: 'Radiokanavan toisto "{{ item }}" päättyi.',

        added: 'lisäsi radiokanavan "{{ item }}" jonoon.',
        started: 'aloitti radiokanavan "{{ item }} toiston".',
        skipped: 'ohitti radiokanavan "{{ item }}".',
        skippedQueue: 'ohitti radiokanavan "{{ item }}" jonosta.',
        setAsNext: 'siirsi radiokanavan "{{ item }}" jonon kärkeen.',
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
