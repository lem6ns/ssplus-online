# ssplus-online
A ~~rewrite~~ port of [Chedski/ssplus-online](https://github.com/Chedski/ssplus-online) in [Fastify](https://fastify.io) & [TypeScript](https://www.typescriptlang.org).

# API Information
  ## Listing maps
  - `/api/all` - Gets a list of all maps
  - `/api/filter/difficulty?filter=-1,0,1,2,3,4` - Filter by difficulty
  
  ## Downloads
  - `/maps/audio/<id>` - Downloads a map's audio as mp3 or ogg
  - `/maps/cover/<id>` - Downloads a map's cover image, if it has one
  - `/maps/download/<id>` - Downloads the map
  - `/maps/txt/<id>` - Downloads the map as a .txt

# To Do List
- [ ] .sspm file parser
- [x] ~~plugin for prefix setting~~ too lazy, just used `plugin.autoPrefix` in each route
- [ ] ???