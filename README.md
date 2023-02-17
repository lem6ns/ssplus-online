# ssplus-online
A ~~rewrite~~ port of [Chedski/ssplus-online](https://github.com/Chedski/ssplus-online) in [Fastify](https://fastify.io) & [TypeScript](https://www.typescriptlang.org).

# Public Instance (hosted by me)
[https://soundspace.embeds.video](https://soundspace.embeds.video)

# API Information
  ## Listing maps
  - `/api/all` - Gets a list of all maps
  - `/api/map/<id>` - Gets a specific map
  - `/api/filter/difficulty?filter=-1,0,1,2,3,4` - Filter by difficulty
  
  ## Downloads
  - `/maps/audio/<id>` - Downloads a map's audio as mp3 or ogg
  - `/maps/cover/<id>` - Downloads a map's cover image, if it has one
  - `/maps/download/<id>` - Downloads the map
  - `/maps/txt/<id>` - Downloads the map as a .txt

# Selfhosting
1. Clone this repository.
2. Download [ss_archive.zip](https://drive.google.com/file/d/15eCgZkmAkYbamxKOZFqCYKRg0b5OUnm2/view) and extract it somewhere.
3. Create copies of `config.json.example` and `config-fastify.json.example` and remove the `.example` extension.
4. Configure accordingly.
5. `npm i`
6. `npm run start` or `pm2 run start`
7. Profit!!!

# To Do List
- [x] .sspm file parser
- [x] ~~plugin for prefix setting~~ too lazy, just used `plugin.autoPrefix` in each route
- [x] add routes
- [x] Ratelimits
- [x] ~~Tests~~ too lazy