import { Senart } from "../constants";
import axios from "axios";
import moment from "moment";

import { launch } from "puppeteer";
import he from "he";
import { Class, RawClass } from "../types";

const dev = process.argv.includes("--dev");

export async function fetchPlanningSenart(
	nextWeek: number
): Promise<{ planning: Class[]; url: string }> {
	const browser = await launch({
		headless: dev ? false : "new",
	});

	const page = await browser.newPage();
	await page.goto("https://dynasis.iutsf.org/index.php?group_id=6&id=14");

	const weekButton = await page.waitForSelector(Senart.WEEK_BUTTON);
	await weekButton?.click();

	for (let i = 0; i < nextWeek; i++) {
		const nextWeekButton = await page.waitForSelector(Senart.NEXT_BUTTON);
		await nextWeekButton?.click();
	}

	await page.waitForSelector(Senart.TABLE_CONTAINER);
	const rawClasses = await page.evaluate(
		({ TABLE_CONTAINER, DAY_CONTENT, CLASS_TIME, CLASS_CONTENT }) => {
			const classes: RawClass[] = [];
			const table = document.querySelector(TABLE_CONTAINER);
			if (!table) return classes;

			for (let i = 1; i < table.children.length; i++) {
				const dayPath =
					TABLE_CONTAINER + ` td:nth-child(${i + 1}) ` + DAY_CONTENT;

				const dayElement = document.querySelector(dayPath);
				if (!dayElement) break;

				for (let j = 0; j < dayElement.children.length; j++) {
					const classPath =
						dayPath +
						` a.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end:nth-child(${
							j + 1
						}) `;

					const timeElement = document.querySelector(classPath + CLASS_TIME);
					const titleElement = document.querySelector(
						classPath + CLASS_CONTENT
					);

					if (!timeElement || !titleElement) break;

					const timeString = timeElement.getAttribute("data-full");
					const groups = timeString?.match(
						/(?<sh>\d{2}):(?<sm>\d{2})\s-\s(?<eh>\d{2}):(?<em>\d{2})/
					)?.groups;

					const startHours = Number(groups?.sh);
					const startMin = Number(groups?.sm);
					const endHours = Number(groups?.eh);
					const endMin = Number(groups?.em);

					classes.push({
						time: {
							startHours,
							startMin,
							endHours,
							endMin,
						},
						day: i,
						textHTML: titleElement.textContent ?? "",
					});
				}
			}

			return classes;
		},
		Senart
	);

	const classes = rawClasses.map((c) => {
		const [titleHTML, roomHTML, detailsHTML] = c.textHTML.split("\n");

		return {
			day: c.day,
			time: c.time,
			title: he.decode(titleHTML).trim(),
			room: he.decode(roomHTML).trim(),
			details: he.decode(detailsHTML).trim().replace(/\s+/g, " "),
		};
	});

	await browser.close();

	return {
		planning: classes,
		url: "https://dynasis.iutsf.org/index.php?group_id=6&id=14",
	};
}

export async function fetchPlanningFontainebleau(
	nextWeek: number,
	id: number,
	group: number
): Promise<{ planning: Class[]; url: string }> {
	const startOfWeek = moment(Date.now() + 6.048e8 * nextWeek)
		.startOf("week")
		.toDate();

	const endOfWeek = moment(Date.now() + 6.048e8 * nextWeek)
		.endOf("week")
		.toDate();

	const formatedStart = startOfWeek.toJSON().slice(0, -5);
	const formatedEnd = endOfWeek.toJSON().slice(0, -5);

	const { data } = await axios.get(
		`http://www.iut-fbleau.fr/EDT/consulter/ajax/ep.php?p=${id}&start=${encodeURIComponent(
			formatedStart
		)}&end=${encodeURIComponent(formatedEnd)}`
	);

	const rawClasses = data
		.filter((d: any) => d.numero === group.toString())
		.sort(
			(a: any, b: any) =>
				new Date(a.start).getTime() - new Date(b.start).getTime()
		);

	const classes = rawClasses.map((c: any) => {
		const start = new Date(c.start);
		const end = new Date(c.end);

		return {
			day: start.getDay(),
			time: {
				startHours: start.getHours(),
				startMin: start.getMinutes(),
				endHours: end.getHours(),
				endMin: end.getMinutes(),
			},
			title: c.title,
			room: c.salle,
			details: c.nomADE + ` (Grp.${c.numero})`,
		};
	});

	return { planning: classes, url: "http://www.iut-fbleau.fr/EDT/consulter" };
}
