# Changelog
All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
## [1.1.0](https://github.com/miksuh-dev/hande/compare/v1.0.1...v1.1.0) (2022-12-04)


### Features

* add chat collapse on lower than xl screen breakpoints ([af17305](https://github.com/miksuh-dev/hande/commit/af173054c900993e0f40180f8f4565ed561ec3e2))
* add fav icon and nav icon ([78c4ad1](https://github.com/miksuh-dev/hande/commit/78c4ad1884917768dbb9d74ab539d8af3ec104a9))
* add reusable click outside util function ([7a8e01c](https://github.com/miksuh-dev/hande/commit/7a8e01c56ac1c1624576cc04c613e3fba446c82a))
* add tooltips to site's buttons ([03816bd](https://github.com/miksuh-dev/hande/commit/03816bd8631518027c22145daff3bf0e6de0e9c8))
* move theme select and darktheme select behind one menu ([8dc283a](https://github.com/miksuh-dev/hande/commit/8dc283ab6f5cd8c9a2173e30bfee64ce2065d6c9))
* use portals with tooltips to make them appear on top of everything else ([8adf9c3](https://github.com/miksuh-dev/hande/commit/8adf9c36568763a359c5a28dd7b76f60e97bf302))


### Bug Fixes

* change search translation as playlist search is yet not supported ([ae8feb8](https://github.com/miksuh-dev/hande/commit/ae8feb853ffadb0c6dcc8a0b2e9b292acf614bb2))
* chat badge on top search results ([7bcc1b7](https://github.com/miksuh-dev/hande/commit/7bcc1b7527d39a91e54b4a35eced5883135d7808))
* chrome was unable to login using token ([98d7665](https://github.com/miksuh-dev/hande/commit/98d76657759e8d269c359e800cafe91e24ac18e7))
* guest users having same hash ([eb80ea1](https://github.com/miksuh-dev/hande/commit/eb80ea12ea8560a2e4ce4da10ac4875116ffd229))
* use hash everywhere as session changes when mumble restarts ([324e3a6](https://github.com/miksuh-dev/hande/commit/324e3a6c99d5ef8f1773590e58d03623cc10e37f))

### [1.0.1](https://github.com/miksuh-dev/hande/compare/v1.0.0...v1.0.1) (2022-11-30)


### Bug Fixes

* tooltip added hidden space to the bottom of chat ([1d1a24e](https://github.com/miksuh-dev/hande/commit/1d1a24e4dd963a17d839645d10fd20cf9871b2ec))

## 1.0.0 (2022-11-30)


### Features

* add crown icon for system messages ([31635da](https://github.com/miksuh-dev/hande/commit/31635da57ddf5cf884c10c75d5b099b71f45cdee))
* add delay to postpone song end ([a8df524](https://github.com/miksuh-dev/hande/commit/a8df524eab36b2e6e5a3bcc49835d3ae1ce33435))
* add initial playlist container and fix styling ([33368c7](https://github.com/miksuh-dev/hande/commit/33368c74385f01bc928251bf477f04bc1f5d0977))
* add more color themes ([77a9055](https://github.com/miksuh-dev/hande/commit/77a905535f3a8eea5f5de1452a4ae21d0083860d))
* add more core feature ([0b71b3c](https://github.com/miksuh-dev/hande/commit/0b71b3ca307eb339251eae70243c60c63a5d6b83))
* add pong to keep clients alive ([ddaa159](https://github.com/miksuh-dev/hande/commit/ddaa1597be9a6c3accac1458d55743fcf49e08c0))
* add token endpoint and use main as default endpoint ([8355baf](https://github.com/miksuh-dev/hande/commit/8355baf4cfac4c538bd5cd9c2f35210cc395a781))
* allow guest register on generated links ([c533c53](https://github.com/miksuh-dev/hande/commit/c533c53956b7e859ed012c45cb3a3bc86ad81bf0))
* autohide snackbar after 5 seconds ([7b382b1](https://github.com/miksuh-dev/hande/commit/7b382b16d4542b703577093288b23c888c948938))
* chat acitons as user messsages ([3ecf410](https://github.com/miksuh-dev/hande/commit/3ecf4106c38c24c19184de22c7b8c35eae212148))
* combine chat and users online ([875db2d](https://github.com/miksuh-dev/hande/commit/875db2d0ece27057bbb78e89479f2c024a665c2a))
* dark theme support ([5d17810](https://github.com/miksuh-dev/hande/commit/5d178108169a4f6040a68195274ef4d774d5797c))
* default name and prevent crash if no sender found ([009e9e5](https://github.com/miksuh-dev/hande/commit/009e9e59940a75ee57dfeed4380c641bcc63c0ac))
* handle next song and error events ([d5f6d1c](https://github.com/miksuh-dev/hande/commit/d5f6d1ceeafeb92554abd0356bf7189b6c8995bc))
* improve auth redirects ([bb75295](https://github.com/miksuh-dev/hande/commit/bb75295f96620c95c5dc409689a78e4f55e7abbe))
* improve song change and error handling ([5d109a6](https://github.com/miksuh-dev/hande/commit/5d109a676f822fdb6b02bbdb2effb40b717fb642))
* loosely type noodlejs ([770ee87](https://github.com/miksuh-dev/hande/commit/770ee8718347d152a0f4ed008501252e56451c4d))
* remove old client as its no longer used ([a72cd12](https://github.com/miksuh-dev/hande/commit/a72cd1276f2bd1a7644f8961f0c8652c44757fb9))
* reply if possible else fallback to channel ([0a24e96](https://github.com/miksuh-dev/hande/commit/0a24e96b4f383c41ac34324f2ccfdfd1c6dab21a))
* search, request, playlist, currently playing ([39d975e](https://github.com/miksuh-dev/hande/commit/39d975e1b789e45ef729f12efe520f448cb537e1))
* show if song is on playlist in search result ([5c1fd15](https://github.com/miksuh-dev/hande/commit/5c1fd15bdc84908164b9d7186f2f7c95e6473b68))
* show system as different color in chat ([5289849](https://github.com/miksuh-dev/hande/commit/5289849a5647cdbc0e107be1afbb43f2d64b64c8))
* show verified icon if user is logged using mumble user ([c26638a](https://github.com/miksuh-dev/hande/commit/c26638ad373eb2f0f3dae17dfde3043da71407e9))
* skip, select, play and ([5c81775](https://github.com/miksuh-dev/hande/commit/5c81775524b3f2b118fe139e8ffd64874bc041f8))
* theme color toggle ([e0dbef3](https://github.com/miksuh-dev/hande/commit/e0dbef39046e3cf6e3f79110fd7a7f2df295b1a1))
* use NoodleJS partially typed client ([3dad106](https://github.com/miksuh-dev/hande/commit/3dad10667b6704c908829996b07072bb71a86904))
* use timeout to track song end ([1e089a7](https://github.com/miksuh-dev/hande/commit/1e089a7d23e8612e8fb1979fca931420fc0d3d18))
* use youtube-dl to fetch video duration ([070ec3d](https://github.com/miksuh-dev/hande/commit/070ec3daf1190262b5f61025f778cb7a04ef74a4))
* user color selection and broadcast to other users ([5645c17](https://github.com/miksuh-dev/hande/commit/5645c170ee4fe32dcf3921d6623ac68e1d04e19f))


### Bug Fixes

* add missing type definitions ([f02a39b](https://github.com/miksuh-dev/hande/commit/f02a39bd3378bfb945e9be42632cb031ba3e4602))
* add slash to end of basepath ([2d68432](https://github.com/miksuh-dev/hande/commit/2d68432f5a56d8bb02144a6da9c97433827692df))
* adding song on empty playlist shows song twice ([0719fcd](https://github.com/miksuh-dev/hande/commit/0719fcd34a0e57d493d80c8fe96a859376569220))
* after login refresh required ([04d313f](https://github.com/miksuh-dev/hande/commit/04d313f2b17d38a0c56a3371b00299f35cb26f20))
* also remove song from playlist in case of playback error ([ae519dc](https://github.com/miksuh-dev/hande/commit/ae519dc98a110f2246ac4b5800fbf6861ff90977))
* always prefer main over root ([6820da3](https://github.com/miksuh-dev/hande/commit/6820da37ef9fc75f3fcd2b6c4ccc2828d30dd40d))
* auth rerouting issues issues ([c80216c](https://github.com/miksuh-dev/hande/commit/c80216ce5038b435fdd9e3137a78cff6e725e1b0))
* authorized and unauthorized pages routing ([f6dc80c](https://github.com/miksuh-dev/hande/commit/f6dc80ca0c9b3f37fddc46bca4f955e350c387bd))
* badge was in center if multiline message ([d7c655b](https://github.com/miksuh-dev/hande/commit/d7c655be74d62a071d996ab87526952e63e9c6e1))
* do not clear interval when song ends, only when unmounts ([a3a846e](https://github.com/miksuh-dev/hande/commit/a3a846eb953544028cb4bcb7cab52bbdb7c1a66d))
* do not throw error if channel is not found ([ddc6d86](https://github.com/miksuh-dev/hande/commit/ddc6d8620263c97d82c996847e4754af117c00d0))
* do not try to play playlists for now ([c97bb8a](https://github.com/miksuh-dev/hande/commit/c97bb8acefc17b952f65ebca9810ba78f4f5871d))
* escape html entries from song names ([fbc8431](https://github.com/miksuh-dev/hande/commit/fbc8431b54697e33263ce280eecbe677563841fc))
* html decode search result titles ([019473e](https://github.com/miksuh-dev/hande/commit/019473e3bcb068c151f8da73da1999c18aecf70d))
* join messages not being sent ([6bc9bbb](https://github.com/miksuh-dev/hande/commit/6bc9bbbc76d7d03febf840b6557cdb46e6e48e61))
* main menu mobile responsiveness ([0a8b856](https://github.com/miksuh-dev/hande/commit/0a8b856fff2d2be89a54373500b76ba6ba8ef2f0))
* minor improvements ([cae4c22](https://github.com/miksuh-dev/hande/commit/cae4c22481a31cdba16fe6999a17cf296e3d3df4))
* missing dark theme color for no messages in chat ([8e2162f](https://github.com/miksuh-dev/hande/commit/8e2162f3da0e0667be4fc4f6bfa002808b225c4e))
* missing dark theme on search ([ded67d2](https://github.com/miksuh-dev/hande/commit/ded67d21d94ceb49fab9e1b4b75de73d58f1bdba))
* multiple user me fetch on page load ([882ec2d](https://github.com/miksuh-dev/hande/commit/882ec2d3d3729aaa52e0f8953c0a404b755787d6))
* online status with multiple tabs open ([fc38247](https://github.com/miksuh-dev/hande/commit/fc382470dedcf2e00bc04e2d904ee59610aa33d7))
* ping spam if multiple tabs open ([2a430df](https://github.com/miksuh-dev/hande/commit/2a430df6ce1e036a8052e471ef20630d1e2e2b1a))
* prevent search if no search term is entered ([a1c63d5](https://github.com/miksuh-dev/hande/commit/a1c63d5c051796c97e7bbc6ea5c657324e05654d))
* register validation and mobile responsiveness ([cee325d](https://github.com/miksuh-dev/hande/commit/cee325d4cf5c04b043ae02f5a3d4ee17a42a84da))
* route change on refresh ([da9d023](https://github.com/miksuh-dev/hande/commit/da9d023ea0fd5d81c8389faf63d6d13e1a7b1904))
* skip broken for songs coming from socket ([1b88c44](https://github.com/miksuh-dev/hande/commit/1b88c44e384b8fd9a6dbdc73d60a62f7cceeee8c))
* skip delay ([d3af304](https://github.com/miksuh-dev/hande/commit/d3af304a00c3c2262729bebf56f7548280087d67))
* skipping current song not clearing if playlist empty ([da81657](https://github.com/miksuh-dev/hande/commit/da8165740699fec656523a3895e6c9cef5f61315))
* socket connection failing on first login ([4f43f0b](https://github.com/miksuh-dev/hande/commit/4f43f0b229991f9f4b76a7a03927711653303788))
* styling imporovements ([8049a3a](https://github.com/miksuh-dev/hande/commit/8049a3abf3f530be10e47a03af3749dfa7a0d93a))
* typo ([250f263](https://github.com/miksuh-dev/hande/commit/250f263c327e34b64035b36d2c71a2733ca17fd1))
* use youtube-dl from env instead of hard coded ([8611347](https://github.com/miksuh-dev/hande/commit/8611347694598bf85e9729da9a82bd919e2e55fe))
* user list badge is too up ([0471268](https://github.com/miksuh-dev/hande/commit/047126884ba8c2f542e5fcccc4324281a27cf146))
