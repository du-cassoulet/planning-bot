export type ClassTime = {
	startHours: number;
	startMin: number;
	endHours: number;
	endMin: number;
};

export type RawClass = {
	time: ClassTime;
	day: number;
	textHTML: string;
};

export type Class = {
	time: ClassTime;
	day: number;
	title: string;
	room: string;
	details: string;
};
