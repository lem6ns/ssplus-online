// @ts-nocheck because i'm too lazy to add types
import * as fs from "node:fs";
import * as util from "../../binary";
import { SSPM } from "../types";

const DT_POSITION = 7;

const getNotes = (metadata: SSPM) => {
	// i'd convert these 1 & 2 letter variables into readable variable names but i DONT KNOW WHAT THEY MEAN
	const file = fs.readFileSync(metadata.path, { encoding: null });
	let offset = metadata.note_data_offset;
	let markers = {};

	const mt_name = [];
	const mt_type = [];
	const mt_size = [];

	for (let i = 0; i < metadata.marker_types.length; i++) {
		const mt = metadata.marker_types[i];
		mt_name[i] = mt[0];
		mt_size[i] = 0;
		markers[mt[0]] = [];

		const mtt = [];
		mt_type[i] = mtt;

		for (var j = 1; j < mt.length; j++) {
			mtt[j - 1] = mt[j];

			if (mt[j] === DT_POSITION) {
				mt_size[i] += 2;
			} else {
				mt_size[i] += 1;
			}
		}
	}

	for (let i = 0; i < metadata.marker_count; i++) {
		const m = [];
		const ms = file.readUInt32LE(offset);
		offset += 4;
		const type_id = file.readUInt8(offset);
		offset += 1;

		const name = mt_name[type_id];
		const data = mt_type[type_id];

		offset = 1;
		m[0] = ms;

		for (var ti = 0; ti < data.length; ti++) {
			var r = util.readDataType(file, offset, true, false, data[ti]);
			offset = r.off;
			var v = r.result;

			if (data[ti] === DT_POSITION) {
				m[ti + offset] = v.x;
				offset += 1;
				m[ti + offset] = v.y;
			} else {
				m[ti + offset] = v;
			}
		}
		markers[name].push(m);
	}
};

export default getNotes;
