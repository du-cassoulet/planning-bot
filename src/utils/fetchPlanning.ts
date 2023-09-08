import { Fontainebleau, Senart } from "../constants";

import { launch } from "puppeteer";
import he from "he";
import { RawClass } from "../types";

const dev = process.argv.includes("--dev");

export async function fetchPlanningSenart() {
  const browser = await launch({
    headless: dev ? false : "new",
  });

  const page = await browser.newPage();
  await page.goto("https://dynasis.iutsf.org/index.php?group_id=6&id=14");

  const weekButton = await page.waitForSelector(Senart.WEEK_BUTTON);
  if (weekButton) await weekButton.click();

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

  return classes;
}

export async function fetchPlanningFontainebleau() {
  const browser = await launch({
    headless: dev ? false : "new",
  });

  const page = await browser.newPage();
  await page.goto("http://www.iut-fbleau.fr/EDT/consulter/");

  const weekButton = await page.waitForSelector(Fontainebleau.WEEK_BUTTON);
  if (weekButton) await weekButton.click();
}

fetchPlanningFontainebleau();
