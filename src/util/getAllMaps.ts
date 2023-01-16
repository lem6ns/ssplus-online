import { getClean, getMetadata } from "./parser";
import { Clean, SSPM } from "./parser/Types";
import * as config from "../../config.json";
import * as fs from "node:fs";
import * as path from "node:path";

const findMapsInFolder = (dir: string) => {
	const maps: SSPM[] = [];
	const files = fs.readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		if (file.isDirectory()) {
			const res = findMapsInFolder(path.join(dir, file.name));
			res.forEach((map) => maps.push(map));
		}
		if (file.isFile() && path.extname(file.name) === ".sspm") {
			const map = getMetadata(path.join(dir, file.name)) ?? {
				id: "_ERROR",
				path: "",
				version: 1,
				name: "Unknown Artist - Unknown Song",
				song: "Unknown Artist - Unknown Song",
				author: [],
				difficulty: -1,
				difficulty_name: "N/A",
				stars: 0,
				length_ms: 0,
				note_count: 0,
				has_cover: false,
				cover_path: "",
				broken: false,
				tags: [],
				content_warnings: [],
				note_data_offset: 0,
				note_data_length: 0,
				note_data_hash: "",
				music_format: null,
				marker_def_offset: 0,
				marker_def_length: 0,
				marker_count: 0,
				marker_types: [],
			};
			maps.push(structuredClone(map));
		}
	}

	return maps;
};

console.log("Loading maps...")
const startLoadTime = Date.now()
const mapsArray = findMapsInFolder(config.mapPath);
const maps: Record<string, SSPM> = {};
const mapsClean: Record<string, Clean> = {};
mapsArray.forEach((map) => {
	maps[map.id] = map;
	mapsClean[map.id] = getClean(map);
});
console.log(`Done! Loaded maps in ${Date.now()-startLoadTime}ms`);

export { maps, mapsClean }