import {
	DAY_WIDTH,
	TIME_HEIGHT,
	DAYS,
	HOURS,
	TIME_LABEL_SPACE,
	DAY_LABEL_SPACE,
	START_HOUR,
} from "../constants";

import Canvas from "canvas";
import wrapText from "./wrapText";
import { Class } from "../types";
import colorByTitle from "./colorByTitle";

const Days = Object.freeze([
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
]);

export default function makeCanvas(planning: Class[]) {
	const canvas = Canvas.createCanvas(
		DAY_WIDTH * DAYS + TIME_LABEL_SPACE,
		TIME_HEIGHT * HOURS + DAY_LABEL_SPACE
	);

	const ctx = canvas.getContext("2d");

	ctx.fillStyle = "#1b1d21";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#2a2c30";
	ctx.fillRect(
		TIME_LABEL_SPACE,
		DAY_LABEL_SPACE,
		canvas.width - TIME_LABEL_SPACE,
		canvas.height - DAY_LABEL_SPACE
	);

	ctx.strokeStyle = "#aaaaaa";
	for (let i = 1; i < DAYS - 1; i++) {
		ctx.strokeRect(
			TIME_LABEL_SPACE + i * DAY_WIDTH,
			-10,
			DAY_WIDTH,
			DAY_LABEL_SPACE + 10
		);
	}

	ctx.fillStyle = "#eeeeee";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "30px Arial";

	for (let i = 0; i < DAYS; i++) {
		ctx.fillText(
			Days[i],
			TIME_LABEL_SPACE + i * DAY_WIDTH + DAY_WIDTH / 2,
			DAY_LABEL_SPACE / 2
		);
	}

	for (let i = 0; i < HOURS; i++) {
		ctx.fillText(
			`${START_HOUR + i}:00 -`,
			TIME_LABEL_SPACE / 2,
			DAY_LABEL_SPACE + i * TIME_HEIGHT
		);
	}

	ctx.strokeStyle = "#666666";
	for (let i = 0; i < DAYS; i++) {
		for (let j = 0; j < HOURS; j++) {
			ctx.strokeRect(
				TIME_LABEL_SPACE + i * DAY_WIDTH,
				DAY_LABEL_SPACE + j * TIME_HEIGHT,
				DAY_WIDTH,
				TIME_HEIGHT
			);
		}
	}

	ctx.strokeStyle = "#aaaaaa";
	ctx.strokeRect(
		TIME_LABEL_SPACE,
		DAY_LABEL_SPACE,
		canvas.width,
		canvas.height
	);

	planning.forEach((classData) => {
		const [clear, dark] = colorByTitle(
			classData.title.split(/\./).slice(0, -1).join(".")
		);

		const left = TIME_LABEL_SPACE + (classData.day - 1) * DAY_WIDTH + 1;
		const width = DAY_WIDTH - 2;

		const top =
			DAY_LABEL_SPACE +
			(classData.time.startHours - START_HOUR + classData.time.startMin / 60) *
				TIME_HEIGHT +
			1;

		const height =
			(classData.time.endHours +
				classData.time.endMin / 60 -
				(classData.time.startHours + classData.time.startMin / 60)) *
				TIME_HEIGHT -
			2;

		ctx.fillStyle = clear;
		ctx.strokeStyle = dark;

		ctx.beginPath();
		ctx.roundRect(left, top, width, height, 20);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = "#1b1d21";
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";
		ctx.font = "30px Arial";
		wrapText(
			ctx,
			classData.title + " - " + classData.room,
			left + 20,
			top + 50,
			width - 40,
			35
		);

		ctx.font = "15px Arial";
		wrapText(
			ctx,
			classData.details,
			left + 20,
			top + height - 40,
			width - 40,
			20
		);
	});

	return canvas;
}
