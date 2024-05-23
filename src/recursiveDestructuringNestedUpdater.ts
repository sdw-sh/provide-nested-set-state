
// TODO what about optional fields?
export function recursiveDestructuringNestedUpdater(
  prevState: object | any[],
  keyArray: (string | number | symbol)[],
  finalNestedState: any,
) {
  const [key, ...remainingKeys] = keyArray;
  const nextNestedState: any =
    remainingKeys.length === 0
      ? finalNestedState
      : recursiveDestructuringNestedUpdater(
        // @ts-ignore
        prevState[key],
        remainingKeys,
        finalNestedState,
      );
  if (Array.isArray(prevState)) {
    return prevState.map((item, index) =>
      index === key ? nextNestedState : item,
    );
  } else {
    // TODO check if this is an object, throw if it is not?
    return { ...prevState, [key]: nextNestedState };
  }
}
