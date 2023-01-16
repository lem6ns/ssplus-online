const readGodotLine = (buffer: Buffer, offset: number) => {
	let endPos = buffer.byteLength;
	for (let i = offset; i < buffer.byteLength; i++) {
		if (buffer[i] === 10) {
			endPos = i;
			break;
		}
	}

	const value = buffer.subarray(offset, endPos);
	return {
		text: value.toString("utf-8"),
		off: endPos + 1,
	};
};

export default readGodotLine;
