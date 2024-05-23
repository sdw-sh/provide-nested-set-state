import { expect, test } from "vitest";
import { getByKeyArray } from "./getByKeyArray";

const nestedObject = {
  a: 5,
  b: {
    ba: 7,
    bb: {
      bba: 9,
      bbb: { bbba: 109 },
      bbc: ["bbc0", "bbc1", "bbc2"],
    },
  },
};

const testParams = [
  {
    obj: ["a", "b", "c"],
    keyArray: [1],
    target: "b",
  },
  {
    obj: ["a", "b", "c"],
    keyArray: [3],
    target: undefined,
  },
  {
    obj: nestedObject,
    keyArray: ["b", "bb", "bbb"],
    target: nestedObject.b.bb.bbb,
  },
  {
    obj: nestedObject,
    keyArray: ["b", "bb", "bbc", 1],
    target: nestedObject.b.bb.bbc[1],
  },
  {
    obj: nestedObject,
    keyArray: ["b", "bb", "bbx"],
    target: undefined,
  },
];

testParams.forEach(({ obj, keyArray, target }) => {
  test("adds 1 + 2 to equal 3", () =>
    expect(getByKeyArray(obj, ...keyArray)).toBe(target));
});
