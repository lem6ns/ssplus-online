import * as util from "../../binary/index";
import { SSPM } from "../types";

const DifficultyName = {
	[-1]: "N/A",
	[0]: "Easy",
	[1]: "Medium",
	[2]: "Hard",
	[3]: "LOGIC?",
	[4]: "助 (Tasukete)",
};

const baseFile: SSPM = {
	id: "_ERROR",
	path: "",
	version: -1,
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

const parse = (file: Buffer, path: string) => {
	let info = baseFile;
	let offset = 6;
	if (file.readInt16LE(offset) !== 0) {
		throw "Header reserved space is not 0";
	}
	offset += 2;

	// Metadata
	const fileId = util.readGodotLine(file, offset);
	offset = fileId.off;
	info.id = fileId.text;

	const fileTitle = util.readGodotLine(file, offset);
	offset = fileTitle.off;
	info.name = fileTitle.text;
	info.song = fileTitle.text;

	const fileAuthors = util.readGodotLine(file, offset);
	offset = fileAuthors.off;
	info.author = fileAuthors.text.split(/[,\s]*(?:&|and|\+)\s*|,\s*/g);

	info.length_ms = file.readInt32LE(offset);
	offset += 4;
	info.note_count = file.readInt32LE(offset);
	info.marker_count = info.note_count;
	offset += 4;
	// @ts-ignore
	info.difficulty = file.readInt8(offset) - 1;
	offset += 1;
	// @ts-ignore
	info.difficulty_name = DifficultyName[info.difficulty];

	// Cover
	const cover_type = file.readInt8(offset);
	offset += 1;
	info.has_cover = cover_type === 2; // We can't display Godot's raw image data.

	if (cover_type === 1 || cover_type === 2) {
		if (cover_type === 1) {
			offset += 6; // Skip Godot raw image values (h/w/etc)
		}

		// This will work fine as long as the .sspm is less than 2 GB.
		// While it is possible to have files that large, we're not
		// going to allow them in the map database for obvious reasons.
		let buffer_length = Number(file.readBigInt64LE(offset));
		offset += 8;
		if (cover_type === 2) {
			info.cover_offset = offset;
			info.cover_length = buffer_length;
		}
		offset += buffer_length;
	}

	// Music
	const music_type = file.readInt8(offset);
	offset += 1;
	if (music_type !== 1) {
		info.broken = true;
	} else {
		// See above
		let buffer_length = Number(file.readBigInt64LE(offset));
		offset += 8;
		const music_format = util.getAudioTypeViaBuffer(
			file.subarray(offset, offset + 5),
		);

		if (music_format === "unknown") {
			info.broken = true;
		} else {
			info.music_format = music_format;
			info.music_offset = offset;
			info.music_length = buffer_length;
		}

		offset += buffer_length;
	}

	// Notes
	info.note_data_offset = offset;
	info.note_data_length = file.byteLength - offset;

    return info;
};

export default parse;
