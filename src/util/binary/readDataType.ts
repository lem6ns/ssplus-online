const DT_UNKNOWN = 0;
const DT_INT_8 = 1;
const DT_INT_16 = 2;
const DT_INT_32 = 3;
const DT_INT_64 = 4;
const DT_FLOAT_32 = 5;
const DT_FLOAT_64 = 6;
const DT_POSITION = 7;
// const DT_BUFFER = 8;
// const DT_STRING = 9;
// const DT_BUFFER_LONG = 10;
// const DT_STRING_LONG = 11;
// const DT_ARRAY = 12;

// const resize = (
// 	arr: ({ x: number; y: number } | string | number)[],
// 	newSize: number,
// ) => {
// 	return [...arr, ...Array(Math.max(newSize - arr.length, 0)).fill(0)];
// };

const readDataType = (
	file: Buffer,
	offset: number,
	skipType: boolean = false,
	skipArrayType: boolean = false,
	type: number = DT_UNKNOWN,
	arrayType: number = DT_UNKNOWN,
): {
	result: string | number | { x: number; y: number } | string[] | number[];
	off: number;
} => {
	if (!skipType) {
		type = file.readUInt8(0);
		offset++;
	}

	switch (type) {
		case DT_INT_8: {
			return {
				result: file.readUInt8(offset),
				off: offset + 1,
			};
		}

		case DT_INT_16: {
			return {
				result: file.readUInt16LE(offset),
				off: offset + 2,
			};
		}

		case DT_INT_32: {
			return {
				result: file.readUInt32LE(offset),
				off: offset + 4,
			};
		}

		case DT_INT_64: {
			return {
				result: Number(file.readBigUInt64LE()),
				off: offset + 8,
			};
		}

		case DT_FLOAT_32: {
			return {
				result: file.readFloatLE(offset),
				off: offset + 4,
			};
		}

		case DT_FLOAT_64: {
			return {
				result: file.readDoubleLE(),
				off: offset + 8,
			};
		}

		case DT_POSITION: {
			const value = { x: 5, y: 3 };
			const t = file.readUInt8(offset);
			offset += 1;
			if (t === 0) {
				value.x = file.readUInt8(offset);
				offset += 1;
				value.y = file.readUInt8(offset);
				offset += 1;
			} else if (t === 1) {
				value.x = file.readFloatLE(offset);
				offset += 4;
				value.y = file.readFloatLE(offset);
				offset += 4;
			} else {
				throw new Error("invalid position value type");
			}

			return {
				result: value,
				off: offset,
			};
		}

        /* below is all commented because they don't work... will fix maybe
		case DT_BUFFER: {
			const size = file.readUInt16LE(offset);
			offset += 2;
			return {
				result: file.get_buffer(size),
				off: offset + size,
			};
		}

		case DT_STRING: {
			const size = file.readUInt16LE(offset);
			offset += 2;
			const buf = file.get_buffer(size);
			return {
				result: buf.toString("utf8"),
				off: offset + size,
			};
		}

		case DT_BUFFER_LONG: {
			const size = file.readUInt32LE(offset);
			offset += 4;
			return {
				result: file.get_buffer(size),
				off: offset + size,
			};
		}

		case DT_STRING_LONG: {
			const size = file.readUInt32LE(offset);
			offset += 4;
			const buf = file.get_buffer(size);
			return {
				result: buf.toString("utf8"),
				off: offset + size,
			};
		}

		case DT_ARRAY: {
			if (!skipArrayType) {
				arrayType = file.readUInt8(offset);
				offset += 1;
			}
			const arr: ({ x: number; y: number } | string | number)[] = [];
			const size = file.readUInt16LE(offset);
			offset += 2;
			const resizedArray = resize(arr, size);
			for (let i = 0; i < size; i++) {
				const r = readDataType(file, offset, true, false, arrayType);
				offset += r.off;
				arr[i] = r.result;
			}
			return {
				result: arr,
				off: offset,
			};
		} */

		default: {
			throw new Error(`unknown data type ${type}`);
		}
	}
};

export default readDataType;