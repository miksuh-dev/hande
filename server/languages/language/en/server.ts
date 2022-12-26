export default {
  commands: {
    common: {
      unknownCommand: (action: string) =>
        `Unknown command ${action}. Send "hande help" to see commands.`,
    },
    www: {
      command: "www",
      description: "Generates a link to the control panel.",
      reply: (link: string) => `Move to the control panel ${link}`,
      replyGuest: (link: string) =>
        `Move to the control panel as a guest ${link}`,
      here: "here",
    },
    help: {
      command: "help",
      description: "Shows commands.",
      header: "Available commands:",
      wipCaution:
        "Note! Hande's private messages only work if the user does not have (too long) comment",
    },
  },
};
