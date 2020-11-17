import { StashItemMap, SelectedStashItem } from "constants/stash";
import { StashItemVersion } from "constants/salvage-guide/types";
import { stashItemVersions } from "constants/salvage-guide/versions";

const DICTIONARY =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz¼½ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

const CHAR_TO_NUM = DICTIONARY.split("").reduce((acc, char, idx) => {
  acc[char] = idx;
  return acc;
}, {});

function binaryToBase128(binary: string) {
  let result = "";
  for (let i = 0; i < binary.length; i += 7) {
    const str = binary.substr(i, 7);
    const num = parseInt(`${str}${"0000000".substr(0, 7 - str.length)}`, 2);
    result += DICTIONARY[num];
  }
  return result.replace(/0*$/, "");
}

function base128ToBinary(base128: string = "") {
  let result = "";
  for (let char of [...base128]) {
    const str = CHAR_TO_NUM[char].toString(2);
    const num = `${"0000000".substr(0, 7 - str.length)}${str}`;
    result += num;
  }
  return result;
}

export function encodeStashItems(items: StashItemMap) {
  const [setIds, legendaryIds] = stashItemVersions[
    stashItemVersions.length - 1
  ];

  const setBinary = setIds.reduce(
    (acc, itemId) => `${acc}${items[itemId].isSelected ? 1 : 0}`,
    ""
  );

  const legendaryBinary = legendaryIds.reduce(
    (acc, itemId) =>
      `${acc}${items[itemId].isSelected ? 1 : 0}${
        items[itemId].isCubeSelected ? 1 : 0
      }`,
    ""
  );

  if (parseInt(setBinary) + parseInt(legendaryBinary) === 0) {
    return undefined;
  }

  const encodedSet =
    parseInt(setBinary) === 0 ? "" : binaryToBase128(setBinary);

  const encodedBinary =
    parseInt(legendaryBinary) === 0 ? "" : binaryToBase128(legendaryBinary);

  const results = `${
    stashItemVersions.length - 1
  }_${encodedSet}_${encodedBinary}`;

  return results;
}

export function decodeStashItems(result: string) {
  const [version, encodedSets, encodedLegendaries] = result.split("_");
  const setBinary = base128ToBinary(encodedSets);
  const legendaryBinary = base128ToBinary(encodedLegendaries);

  const results: SelectedStashItem[] = [];
  const [sets, legendaries] = stashItemVersions[version] as StashItemVersion;
  sets.forEach((id, idx) => {
    results.push({
      id,
      isSet: true,
      isSelected: setBinary[idx] === "1",
      isCubeSelected: false,
    });
  });
  legendaries.forEach((id, idx) => {
    results.push({
      id,
      isSet: false,
      isSelected: legendaryBinary[idx * 2] === "1",
      isCubeSelected: legendaryBinary[idx * 2 + 1] === "1",
    });
  });

  return results;
}
