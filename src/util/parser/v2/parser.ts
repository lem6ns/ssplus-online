import * as util from "../../binary/index";
import { SSPM } from "../Types";

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

const parse = (file: Buffer, path: string) => {
	let info = baseFile;
	let offset = 6;
	if (file.readInt32LE(offset) !== 0) {
		throw "Header reserved space is not 0";
	}
	offset += 4;

	offset += 20; // marker hash

	info.length_ms = file.readUInt32LE(offset);
	offset += 4;
	info.note_count = file.readUInt32LE(offset);
	offset += 4;
	info.marker_count = file.readUInt32LE(offset);
	offset += 4;
	// @ts-ignore
	info.difficulty = file.readUInt8(offset) - 1;
	offset += 1;
	info.stars = file.readUInt16LE(offset);
	offset += 2;
	info.broken = !file.readUInt8(offset);
	offset += 1;
	info.has_cover = Boolean(file.readUInt8(offset));
	offset += 1;
	if (file.readUInt8(offset) - 1) {
		info.tags.push("modded");
	}
	offset += 1;

	const cdb_offset = Number(file.readBigInt64LE(offset));
	offset += 8;
	// const cdb_length = Number(file.readBigInt64LE(offset)); // commented due to being not in use
	offset += 8;
	info.music_offset = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.music_length = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.cover_offset = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.cover_length = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.marker_def_offset = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.marker_def_length = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.note_data_offset = Number(file.readBigUInt64LE(offset));
	offset += 8;
	info.note_data_length = Number(file.readBigUInt64LE(offset));
	offset += 8;

	// Metadata
	let len = file.readUInt16LE(offset);
	offset += 2;
	info.id = file.subarray(offset, offset + len).toString("utf8");
	offset += len;

	len = file.readUInt16LE(offset);
	offset += 2;
	info.name = file.subarray(offset, offset + len).toString("utf8");
	offset += len;
	len = file.readUInt16LE(offset);
	offset += 2;
	info.song = file.subarray(offset, offset + len).toString("utf8");
	offset += len;

	info.author = [];
	const num = file.readUInt16LE(offset);
	offset += 2;
	for (let i = 0; i < num; i++) {
		len = file.readUInt16LE(offset);
		offset += 2;
		info.author.push(file.subarray(offset, offset + len).toString("utf8"));
		offset += len;
	}

	offset = cdb_offset;
	const field_count = file.readUInt16LE(offset);
	offset += 2;

	// @ts-ignore
	info.difficulty_name = DifficultyName[info.difficulty];
	for (let i = 0; i < field_count; i++) {
		len = file.readUInt16LE(offset);
		offset += 2;
		const n = file.subarray(offset, offset + len).toString("utf8");
		offset += len;
		const r = util.readDataType(file, offset, false, false);
		offset = r.off;
		if (n === "difficulty_name") {
			// @ts-ignore
			info.difficulty_name = r.result;
		}
	}

	offset = info.marker_def_offset;

	info.marker_types = [];
	const marker_type_count = file.readUInt8(offset);
	offset += 1;

	for (let i = 0; i < marker_type_count; i++) {
		const t: (string | number)[] = [];
		info.marker_types[i] = t;
		const len = file.readUInt16LE(offset);
		offset += 2;
		const name = file.subarray(offset, offset + len).toString("utf8");
		offset += len;
		t.push(name);

		const typecount = file.readUInt8(offset);
		offset += 1;

		for (let j = 1; j < typecount + 1; j++) {
			const type = file.readUInt8(offset);
			offset += 1;
			t.push(type);
		}
		offset += 1;
	}
    return info;
};

export default parse;
