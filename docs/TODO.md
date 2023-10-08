## TODO:

### Features:

Common:

- [x] Language select support
- [x] English translation
- [x] Validation of languages, so that there are no missing translations keys
- [ ] Find way to type enums (Song.type) using Prisma and SQLite
- [x] Improve random song selection algorithm

To Mumble:

- [ ] Search song
- [ ] Play song (first result)
- [ ] Skip song
- [ ] Get currently playing song (+ requester)
- [ ] Get queue

To website:

- [x] Playlist support
- [x] Statistics
- [x] View changelog
- [x] Disconnect timeout so refreshing page doesn't instantly send leave message
- [ ] Make playlist show better in smaller screens
- [ ] Improve light theme

### Bugs:

- [ ] NoodleJS can't get user states if user has lengthy comment (can't reply these users)
- [ ] NoodleJS can't get channel states if channel has lengthy comment (can't send messages to these channels)
- [x] User drawer in nav bar doesn't close when clicking outside of it
- [x] Chat badges come through search results if chat overlaps with search results
- [x] Tooltips overflow and are sometimes cut off
- [x] Chat scrolls to bottom when changing tabs
