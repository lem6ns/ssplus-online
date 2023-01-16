import { SSPM } from "./Types";
import v1Parser from "./v1/parser";
import v2Parser from "./v2/parser";
import v1Notes from "./v1/notes";
import v2Notes from "./v2/notes";
import * as fs from "node:fs";
import * as config from "../../../config.json";
const parser = {
	v1: v1Parser,
	v2: v2Parser,
};
const notes = {
	v1: v1Notes,
	v2: v2Notes,
};

const sspmSignature = Buffer.from([0x53, 0x53, 0x2b, 0x6d]);

const getMetadata = (path: string) => {
	const file = fs.readFileSync(path, { encoding: null });

	const sig = file.subarray(0, 4);
	if (!sspmSignature.equals(sig)) {
		throw "Invalid file signature";
	}

	const version = file.readInt16LE(4);

	let metadata: SSPM = {
		id: "_ERROR",
		path: "",
		version: 2,
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
	switch (version) {
		case 1:
			metadata = parser.v1(file, path);
			break;
		case 2:
			metadata = parser.v2(file, path);
			break;
		default:
			console.log("Unknown .sspm version");
			return;
	}

	metadata.tags = []; // do metadata because of pass-by-reference stuff (idk what pass-by-reference is!!)
	if (metadata.id.startsWith("ss_archive")) {
		metadata.tags.unshift("ss_archive");
	}
	return metadata;
};

const getAudio = (metadata: SSPM) => {
	if (!metadata.path) {
		throw "No file loaded";
	}
	if (!(metadata.broken && metadata.music_offset && metadata.music_length)) {
		const file = fs.readFileSync(metadata.path, { encoding: null });
		return file.subarray(
			metadata.music_offset,
			// @ts-ignore, we already check if it's defined or not
			metadata.music_offset + metadata.music_length,
		);
	}

	throw "File does not have audio";
};

const getBuffer = (metadata: SSPM) => {
	if (!metadata.path) {
		throw "No file loaded";
	}

	return fs.readFileSync(metadata.path, { encoding: null });
};

const getCover = (metadata: SSPM) => {
	if (!metadata.path) {
		throw "No file loaded";
	}

	if (metadata.has_cover && !metadata.cover_offset && !metadata.cover_length) {
		const file = fs.readFileSync(metadata.path, { encoding: null });
		return file.subarray(
			metadata.cover_offset,
			// @ts-ignore, we already checked this
			metadata.cover_offset + metadata.cover_length,
		);
	}

	throw "File does not have a cover";
};

const getNotes = (metadata: SSPM) => {
	switch (metadata.version) {
		case 1:
			return notes.v1(metadata);
		case 2:
			return notes.v2(metadata);
		default:
			throw "Unknown .sspm version";
	}
};

const getTxt = (metadata: SSPM) => {
	let str = metadata.id;
	const notes = getNotes(metadata) ?? [];
	for (const note of notes) {
		str += `,${note[1]}|${note[2]}|${note[0]}`;
	}
	return str;
};

const getClean = (metadata: SSPM) => {
	const data = {
		id: metadata.id,
		download: `${config.domain}${config.siteRoutes.download}/${metadata.id}`,
		txt: `${config.domain}${config.siteRoutes.txt}/${metadata.id}`,
		audio: `${config.domain}${config.siteRoutes.audio}/${metadata.id}`,
		cover: metadata.has_cover
			? `${config.domain}${config.siteRoutes.audio}/${metadata.id}`
			: null,
		version: metadata.version,
		name: metadata.name,
		song: metadata.song,
		author: metadata.author,
		difficulty: metadata.difficulty,
		difficulty_name: metadata.difficulty_name,
		stars: metadata.stars,
		length_ms: metadata.length_ms,
		note_count: metadata.note_count,
		has_cover: metadata.has_cover,
		broken: metadata.broken,
		tags: metadata.tags,
		content_warnings: metadata.content_warnings,
		note_data_offset: metadata.note_data_offset,
		note_data_length: metadata.note_data_length,
		cover_offset: metadata.cover_offset,
		cover_length: metadata.cover_length,
		music_format: metadata.music_format,
		music_offset: metadata.music_offset,
		music_length: metadata.music_length,
	};
	// if (metadata.broken) console.log(`${metadata.id} has broken audio!`)

	return data;
};

export { getMetadata, getAudio, getBuffer, getCover, getTxt, getClean };
