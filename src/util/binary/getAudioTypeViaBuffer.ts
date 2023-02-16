function getAudioTypeViaBuffer(buffer: Buffer): "unknown" | "ogg" | "mp3" {
	if (buffer.toString().startsWith("OggS")) {
		// OggS = 0x4F,0x67,0x67,0x53
		return "ogg";
	}

	const mp3HeaderList: Buffer[] = [
		// not sure what to name this, hopefully this is correct?
		Buffer.from([0xff, 0xfb]),
		Buffer.from([0xff, 0xf3]),
		Buffer.from([0xff, 0xfa]),
		Buffer.from([0xff, 0xf2]),
		Buffer.from([0x49, 0x44, 0x33]),
	];
	for (const header of mp3HeaderList) {
		if (buffer.subarray(0, 2).equals(header)) {
			return "mp3";
		}
	}

	return "unknown";
}

export default getAudioTypeViaBuffer;
