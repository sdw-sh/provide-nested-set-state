import memoize from "memoize";
import ManyKeysMap from "many-keys-map";
function getByKeyArray(original, ...keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    let result = original;
    for (const key of keys) {
        // @ts-ignore
        result = result[key];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result;
}
function isFunction(value) {
    return typeof value === "function";
}
// TODO what about optional fields?
function recursiveDestructuringNestedUpdater(prevState, keyArray, finalNestedState) {
    const [key, ...remainingKeys] = keyArray;
    const nextNestedState = remainingKeys.length === 0
        ? finalNestedState
        : recursiveDestructuringNestedUpdater(
        // @ts-ignore
        prevState[key], remainingKeys, finalNestedState);
    if (Array.isArray(prevState)) {
        return prevState.map((item, index) => index === key ? nextNestedState : item);
    }
    else {
        // TODO check if this is an object, throw if it is not?
        return Object.assign(Object.assign({}, prevState), { [key]: nextNestedState });
    }
}
//--
export function rawProvideNestedSetState(rootUpdater, ...keys) {
    console.debug(1);
    // @ts-ignore
    return function (setNestedStateAction) {
        console.debug(2);
        // @ts-ignore
        rootUpdater((prevRootState) => {
            console.debug(3);
            let nextNestedState;
            if (isFunction(setNestedStateAction)) {
                console.debug(4);
                nextNestedState = setNestedStateAction(getByKeyArray(prevRootState, ...keys));
            }
            else {
                console.debug(5);
                nextNestedState = setNestedStateAction;
            }
            console.debug(6);
            const finalState = recursiveDestructuringNestedUpdater(prevRootState, keys, nextNestedState);
            console.debug("finalState", finalState);
            return finalState;
        });
    };
}
export const provideNestedSetState = memoize(rawProvideNestedSetState, {
    cacheKey: (arguments_) => arguments_,
    cache: new ManyKeysMap(),
});
