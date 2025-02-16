export default {
  commands: {
    common: {
      unknownCommand: (action: string) =>
        `Tuntematon komento ${action}. Lähetä "hande apua" nähdäksesi komennot.`,
    },
    www: {
      command: "www",
      description: "Generoi liittymislinkin hallintapaneeliin.",
      reply: (link: string) => `Siirry hallintapaneeliin ${link}`,
      replyGuest: (link: string) => `Siirry hallintapaneeliin vieraana ${link}`,
      here: "tästä",
    },
    help: {
      command: "apua",
      description: "Näyttää komennot.",
      header: "Käytössä olevat komennot",
      wipCaution:
        "Huom! Handen yksityisviestit toimivat vain jos käyttäjällä ei ole (liian pitkää) kommenttia",
    },
  },
};
