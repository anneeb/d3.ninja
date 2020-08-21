import * as fs from "fs";
import * as ora from "ora";
import * as path from "path";
import {
  Builder,
  By,
  Locator,
  WebDriver,
  until,
  WebElement,
} from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

const SALVAGE_GUIDE_URL =
  "https://www.icy-veins.com/d3/legendary-item-salvage-guide";

const CONSTANTS_DIR = path.resolve(__dirname, "..", "src", "constants");

interface ItemData {
  label: string;
  link: string;
  type: string;
  img: string;
  buildsData?: BuildData[];
}

interface BuildData {
  label: string;
  link: string;
  tags: string;
}

// helpers
async function getBuilder() {
  return await new Builder()
    .forBrowser("firefox")
    .setChromeOptions(
      new Options().headless().windowSize({
        width: 800,
        height: 1200,
      })
    )
    .build();
}

async function getElement(el: WebDriver | WebElement, locator: Locator) {
  try {
    const element = await el.findElement(locator);
    if (element) {
      return element;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

async function getElements(el: WebDriver | WebElement, locator: Locator) {
  try {
    const elements = await el.findElements(locator);
    if (elements) {
      return elements;
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
}

async function delay(timeout: number = 100) {
  await new Promise((res) => setTimeout(res, timeout));
}

// getters
async function getItemData(el: WebElement): Promise<ItemData> {
  let label = "";
  let link = "";
  let type = "";

  const linkEl = await getElement(el, By.tagName("a"));
  if (linkEl) {
    const [linkText, linkRef, linkClass] = await Promise.all([
      linkEl.getText(),
      linkEl.getAttribute("href"),
      linkEl.getAttribute("class"),
    ]);
    label = linkText;
    link = linkRef;
    type = linkClass;
  } else {
    return null;
  }

  let img = "";
  const imgEl = await getElement(el, By.tagName("img"));
  if (imgEl) {
    const imgSrc = await imgEl.getAttribute("src");
    img = `${imgSrc}`;
  }

  return { label, link, type, img };
}

async function getBuildData(el: WebElement): Promise<BuildData> {
  let label = "";
  let link = "";
  let tags = "";

  const linkEl = await getElement(el, By.tagName("a"));
  if (linkEl) {
    const [linkText, linkRef] = await Promise.all([
      linkEl.getText(),
      linkEl.getAttribute("href"),
    ]);
    label = linkText;
    link = linkRef;
  }

  const buildText = await el.getText();
  tags = buildText.substr(label.length).trim();

  return { label, link, tags };
}

async function getBuildsData(el: WebElement): Promise<BuildData[]> {
  const buildEls = await getElements(el, By.tagName("li"));
  return await Promise.all<BuildData>(
    buildEls.map<Promise<BuildData>>(getBuildData)
  );
}

async function getResults(driver: WebDriver) {
  const rows = await getElements(driver, By.css(".salvage_table tr"));
  const results: ItemData[] = [];

  const spinner = ora("Loading items");
  spinner.spinner = "simpleDotsScrolling";
  spinner.start();

  const total = rows.length;
  for (let i = 0; i < total; i++) {
    spinner.text = `Loading ${i + 1}/${total} items`;

    const cells = await getElements(rows[i], By.tagName("td"));
    if (cells.length !== 2) {
      continue;
    }

    const [itemCell, buildCell] = cells;
    const itemData = await getItemData(itemCell);
    if (!itemData) {
      continue;
    }

    const buildsData = await getBuildsData(buildCell);

    results.push({
      ...itemData,
      buildsData,
    });
  }

  spinner.succeed(`Loaded ${total} items`);
  return results;
}

async function saveFile(results: ItemData[]) {
  const itemData = JSON.stringify(results, null, 2);
  const data = `// Last updated on ${new Date().toLocaleString()}

export interface ItemData {
  label: string;
  link: string;
  type: string;
  img: string;
  buildsData?: BuildData[];
}

interface BuildData {
  label: string;
  link: string;
  tags: string;
}

export const SALVAGE_GUIDE: ItemData[] = \n${itemData};`;

  // make the directory
  await new Promise((res, rej) =>
    fs.mkdir(CONSTANTS_DIR, { recursive: true }, (err) => {
      if (err) {
        rej();
      } else {
        res();
      }
    })
  );

  // create the file
  const target = path.resolve(CONSTANTS_DIR, "salvage-guide.ts");
  return new Promise<string>((res, rej) =>
    fs.writeFile(target, data, (err) => {
      if (err) {
        rej(err);
      } else {
        res(target);
      }
    })
  );
}

async function run() {
  console.log("Updating salvage guide...");

  const driver = await getBuilder();
  await driver.get(SALVAGE_GUIDE_URL);
  await delay(5000);
  await driver.wait(until.elementLocated(By.className("salvage_table")));

  const results = await getResults(driver);
  const target = await saveFile(results);
  console.log(`Saved salvage guide to ${target}`);

  await driver.quit();
}

run();
