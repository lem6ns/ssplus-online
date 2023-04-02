# ssplus-online
A ~~rewrite~~ port of [Chedski/ssplus-online](https://github.com/Chedski/ssplus-online) in [Fastify](https://fastify.io) & [TypeScript](https://www.typescriptlang.org).

# API Information
  ## Listing maps
  - `/api/all` - Gets a list of all maps
  
  ## Downloads
  - `/maps/download/<id>` - Downloads the map

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
