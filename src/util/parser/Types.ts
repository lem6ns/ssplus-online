import * as fs from "node:fs";
import * as crypto from "node:crypto";

export interface SSPM {
	id: string;
	path: fs.PathOrFileDescriptor;
	version: number;
	name: string;
	song: string;
	author: string[];
	difficulty: Difficulty;
	difficulty_name: DifficultyName;
	stars: number;
	length_ms: number;
	note_count: number;
	has_cover: boolean;
	cover_path: fs.PathOrFileDescriptor;
	broken: boolean;
	tags: string[];
	content_warnings: string[];
	note_data_offset: number;
	note_data_length: number;
	note_data_hash: string | crypto.Hash;
	cover_offset?: number;
	cover_length?: number;
	music_format: null | "mp3" | "ogg";
	music_offset?: number;
	music_length?: number;
	marker_def_offset: number;
	marker_def_length: number;
	marker_count: number;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	marker_types: any[];
}

export interface Clean {
	id: string;
	download: string;
	version: number;
	name: string;
	song: string;
	author: string[];
	difficulty: Difficulty;
	difficulty_name: DifficultyName;
	stars: number;
	length_ms: number;
	note_count: number;
	has_cover: boolean;
	broken: boolean;
	tags: string[];
	content_warnings: string[];
	note_data_offset: number;
	note_data_length: number;
	cover_offset: number | undefined;
	cover_length: number | undefined;
	music_format: null | "mp3" | "ogg";
	music_offset: number | undefined;
	music_length: number | undefined;
}

export type Difficulty = -1 | 0 | 1 | 2 | 3 | 4;
export type DifficultyName =
	| "N/A"
	| "Easy"
	| "Medium"
	| "Hard"
	| "LOGIC?"
	| "助 (Tasukete)";
