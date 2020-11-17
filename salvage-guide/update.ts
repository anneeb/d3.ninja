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

import { RawItemData, RawBuildData } from "./output/types";
import { delay } from "./utils/delay";
import { saveFileToDirectory } from "./utils/fileSystem";

const SALVAGE_GUIDE_URL =
  "https://www.icy-veins.com/d3/legendary-item-salvage-guide";

const BAD_ITEMS = {
  "belt-of-the-trove-P2_Unique_Belt_008":
    "belt-of-the-trove-P610_Unique_Belt_008",
  "blade-of-the-tribes-P4_Unique_Mighty_2H_101":
    "blade-of-the-tribes-P610_Unique_Mighty_2H_101",
  "etched-sigil-P61_Unique_Orb_002": "etched-sigil-P610_Unique_Orb_002",
  "fragment-of-destiny-P4_Unique_Wand_010":
    "fragment-of-destiny-P610_Unique_Wand_010",
  "gungdo-gear-P2_Unique_Bracer_006": "gungdo-gear-P610_Unique_Bracer_006",
  "scrimshaw-Unique_Spear_004_p3": "scrimshaw-P610_Unique_Spear_004",
  "the-mortal-drama-Unique_Flail_2H_101_x1":
    "the-mortal-drama-P610_Unique_Flail_2H_101",
  "the-twisted-sword-Unique_Sword_1H_107_x1":
    "the-twisted-sword-P610_Unique_Sword_1H_107",
};

const SAVE_DIR = path.resolve(__dirname, "output");

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

// getters
async function getItemData(el: WebElement): Promise<RawItemData> {
  let label = "";
  let link = "";

  const linkEl = await getElement(el, By.tagName("a"));
  if (linkEl) {
    const [linkText, linkRef] = await Promise.all([
      linkEl.getText(),
      linkEl.getAttribute("href"),
    ]);
    label = linkText;
    link = linkRef.replace("http", "https");
    const badItem = Object.keys(BAD_ITEMS).find((old) => link.includes(old));
    if (badItem) {
      link = link.replace(badItem, BAD_ITEMS[badItem]);
    }
  } else {
    return null;
  }

  return { label, link };
}

async function getBuildData(el: WebElement): Promise<RawBuildData> {
  let id = "";
  let label = "";
  let link = "";
  let tags = "";

  const linkEl = await getElement(el, By.tagName("a"));
  if (linkEl) {
    const [linkText, linkRef] = await Promise.all([
      linkEl.getText(),
      linkEl.getAttribute("href"),
    ]);
    id = linkRef.replace("https://www.icy-veins.com/d3/", "");
    label = linkText;
    link = linkRef;
  } else {
    return;
  }

  const buildText = await el.getText();
  tags = buildText.substr(label.length).trim().replace(/\(|\)/g, "");

  return { id, label, link, tags };
}

async function getBuildsData(el: WebElement): Promise<RawBuildData[]> {
  const buildEls = await getElements(el, By.tagName("li"));
  return await Promise.all<RawBuildData>(
    buildEls.map<Promise<RawBuildData>>(getBuildData)
  );
}

async function getResults(driver: WebDriver) {
  const rows = await getElements(driver, By.css(".salvage_table tr"));
  const results: RawItemData[] = [];

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

async function saveFile(results: RawItemData[]) {
  const itemData = JSON.stringify(results, null, 2);
  const data = `// Last updated on ${new Date().toLocaleString()}

import { RawItemData } from "./types";

export const RAW_SALVAGE_GUIDE: RawItemData[] = \n${itemData};
`;

  return saveFileToDirectory(SAVE_DIR, "raw-salvage-guide.ts", data);
}

async function update() {
  try {
    console.log("Updating salvage guide...");
    const driver = await getBuilder();
    await driver.get(SALVAGE_GUIDE_URL);
    await delay(5000);
    await driver.wait(until.elementLocated(By.className("salvage_table")));

    const results = await getResults(driver);
    const target = await saveFile(results);
    console.log(`Saved raw salvage guide to ${target}`);

    await driver.quit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

update();
