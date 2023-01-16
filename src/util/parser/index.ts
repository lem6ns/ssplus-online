import * as fs from "node:fs";
import { SSPM } from "./Types";
import v1Parser from "./v1/parser";
import v2Parser from "./v2/parser";
import v1Notes from "./v1/notes";
import v2Notes from "./v2/notes";
const parser = {
	v1: v1Parser,
	v2: v2Parser,
};
const notes = {
	v1: v1Notes,
	v2: v2Notes,
};

const sspmSignature = Buffer.from([0x53, 0x53, 0x2b, 0x6d]);


const load = (path: string) => {
    const file = fs.readFileSync(path, { encoding: null });
    
	const sig = file.subarray(0, 4);
	if (!sspmSignature.equals(sig)) {
        throw "Invalid file signature";
	}

	const version = file.readInt16LE(4);
    
    let metadata: SSPM;
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

	if (metadata.id.startsWith("ss_archive")) {
		metadata.tags.unshift("ss_archive");
	}
    return metadata;
};

const getAudio = (metadata: SSPM) => {
	if (!metadata.path) {
		throw "No file loaded";
	}
	if (!(metadata.broken || metadata.music_offset || metadata.music_length)) {
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
        str += `,${note[1]}|${note[2]}|${note[0]}`
    };
    return str;
};

const getClean = (metadata: SSPM) => {
    if (metadata.broken) console.log(`${metadata.id} has broken audio!`)

    return metadata;
};

export { load, getAudio, getBuffer, getTxt, getClean }