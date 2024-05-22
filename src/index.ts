import memoize from "memoize";
import ManyKeysMap from "many-keys-map";

/* React types*/
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type SetState<T> = Dispatch<SetStateAction<T>>;

function getByKeyArray<OriginalType extends object>(
  original: OriginalType,
  ...keys: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  let result = original;
  for (const key of keys) {
    // @ts-ignore
    result = result[key];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result;
}

function isFunction<S>(
  value: SetStateAction<S>,
): value is (prevState: S) => S {
  return typeof value === "function";
}

// TODO what about optional fields?
function recursiveDestructuringNestedUpdater(
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

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
): Dispatch<SetStateAction<OriginalType[Key1]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
): Dispatch<SetStateAction<OriginalType[Key1][Key2]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
  Key3 extends keyof OriginalType[Key1][Key2],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
  key3: Key3,
): Dispatch<SetStateAction<OriginalType[Key1][Key2][Key3]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
  Key3 extends keyof OriginalType[Key1][Key2],
  Key4 extends keyof OriginalType[Key1][Key2][Key3],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
): Dispatch<SetStateAction<OriginalType[Key1][Key2][Key3][Key4]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
  Key3 extends keyof OriginalType[Key1][Key2],
  Key4 extends keyof OriginalType[Key1][Key2][Key3],
  Key5 extends keyof OriginalType[Key1][Key2][Key3][Key4],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
): Dispatch<SetStateAction<OriginalType[Key1][Key2][Key3][Key4][Key5]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
  Key3 extends keyof OriginalType[Key1][Key2],
  Key4 extends keyof OriginalType[Key1][Key2][Key3],
  Key5 extends keyof OriginalType[Key1][Key2][Key3][Key4],
  Key6 extends keyof OriginalType[Key1][Key2][Key3][Key4][Key5],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
): Dispatch<SetStateAction<OriginalType[Key1][Key2][Key3][Key4][Key5][Key6]>>;

export function rawProvideNestedSetState<
  OriginalType extends object,
  Key1 extends keyof OriginalType,
  Key2 extends keyof OriginalType[Key1],
  Key3 extends keyof OriginalType[Key1][Key2],
  Key4 extends keyof OriginalType[Key1][Key2][Key3],
  Key5 extends keyof OriginalType[Key1][Key2][Key3][Key4],
  Key6 extends keyof OriginalType[Key1][Key2][Key3][Key4][Key5],
  Key7 extends keyof OriginalType[Key1][Key2][Key3][Key4][Key5][Key6],
>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
): Dispatch<
  SetStateAction<OriginalType[Key1][Key2][Key3][Key4][Key5][Key6][Key7]>
>;

//--

export function rawProvideNestedSetState<OriginalType extends object>(
  rootUpdater: Dispatch<SetStateAction<OriginalType>>,
  ...keys: any[]
): Dispatch<SetStateAction<any>> {
  console.debug(1);
  // @ts-ignore
  return function (setNestedStateAction: SetStateAction<any>) {
    console.debug(2);
    // @ts-ignore
    rootUpdater((prevRootState) => {
      console.debug(3);
      let nextNestedState: any;
      if (isFunction(setNestedStateAction)) {
        console.debug(4);
        nextNestedState = setNestedStateAction(
          getByKeyArray(prevRootState, ...keys),
        );
      } else {
        console.debug(5);
        nextNestedState = setNestedStateAction;
      }
      console.debug(6);
      const finalState = recursiveDestructuringNestedUpdater(
        prevRootState,
        keys,
        nextNestedState,
      );
      console.debug("finalState", finalState);
      return finalState;
    });
  };
}

export const provideNestedSetState = memoize(rawProvideNestedSetState, {
  cacheKey: (arguments_: unknown[]) => arguments_,
  cache: new ManyKeysMap(),
});
