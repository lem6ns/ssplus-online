import * as fs from "node:fs";
import { SSPM } from "../Types";

const getNotes = (metadata: SSPM) => {
	const file = fs.readFileSync(metadata.path, { encoding: null });
	const dv = file.subarray(
		metadata.note_data_offset,
		metadata.note_data_offset + metadata.note_data_length,
	); // i'd convert these dv, n, st stuff into readable variable names but i DONT KNOW WHAT THEY MEAN

	let offset = 0;

	const array = [];

	while (offset < dv.byteLength) {
		const n = [dv.readUInt32LE(offset)];
		offset += 4;
		const st = dv.readUInt8(offset);
		offset += 1;
		if (st === 0) {
			n.push(dv.readUInt8(offset));
			offset += 1;
			n.push(dv.readUInt8(offset));
			offset += 1;
		} else if (st === 1) {
			n.push(dv.readFloatLE(offset));
			offset += 4;
			n.push(dv.readFloatLE(offset));
			offset += 4;
		} else {
			return [];
		}
		array.push(n);
	}
	return array;
};

export default getNotes;