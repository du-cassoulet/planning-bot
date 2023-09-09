import axios from "axios";
import moment from "moment";
import { Class, RawClassSen, RawClassFbl } from "../types";

export async function fetchPlanningSenart(
	nextWeek: number,
	id: number
): Promise<{ planning: Class[]; url: string }> {
	const { data } = await axios.get(
		`https://dynasis.iutsf.org/index.php?group_id=6&id=${id}`
	);

	const jsonData = `{${
		data.split("$('#calendar').fullCalendar({")[1].split("});")[0]
	}}`
		.replace(/\/\/.*/g, "")
		.replace(/"/g, '\\"')
		.replace(/'/g, '"')
		.replace(/(\w+):\s/g, '"$1": ');

	const { events }: RawClassSen = JSON.parse(jsonData);

	const startOfWeek = moment(Date.now() + 6.048e8 * nextWeek).startOf("week");
	const endOfWeek = moment(Date.now() + 6.048e8 * nextWeek).endOf("week");

	const rawClasses = events.filter((event) =>
		moment(event.start).isBetween(startOfWeek, endOfWeek)
	);

	const classes = rawClasses.map((c) => {
		const start = new Date(c.start);
		const end = new Date(c.end);

		const lines = c.title.split("\r\n");
		const title = lines[0].replace(/\s+/g, " ").trim();
		const room = lines[1].replace(/\s+/g, " ").trim();
		const details = lines[2].replace(/\s+/g, " ").trim();

		return {
			day: start.getDay(),
			time: {
				startHours: start.getHours(),
				startMin: start.getMinutes(),
				endHours: end.getHours(),
				endMin: end.getMinutes(),
			},
			title,
			room,
			details,
		};
	});

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

	const rawClasses: RawClassFbl[] = data
		.filter((d: RawClassFbl) => d.numero === group.toString())
		.sort(
			(a: RawClassFbl, b: RawClassFbl) =>
				new Date(a.start).getTime() - new Date(b.start).getTime()
		);

	const classes = rawClasses.map((c) => {
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
