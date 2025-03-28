
export const arrayToMapKeys = (arr, keyFn) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    map[key] = keyFn(key, i);
  }
  return map;
}


///////////////////
// SmartMap stuff:
//
// SmartMaps are plain objects whose keys are stringified json.
// This lets you e.g. have a bunch of {x, y} points that can be keys
// into a dictionary (by having them turned to strings first).
//
// Encode/Decode the keys manually with the to/from-Key methods.
// Or just use the smartGet and smartSet methods if you can't
// be bothered to keep track of whether your key is already stringified
// or not.

export const toKey = (someJSON) => {
  return JSON.stringify(someJSON);
}

export const fromKey = (someStr) => {
  return JSON.parse(someStr);
}

export const smartGet = (smartMap, strOrJSON) => {
  if (typeof strOrJSON == "string") {
    return smartMap[strOrJSON];
  } else {
    return smartMap[toKey(strOrJSON)];
  }
}

export const smartSet = (smartMap, strOrJSON, value) => {
  if (typeof strOrJSON == "string") {
    smartMap[strOrJSON] = value;
  } else {
    smartMap[toKey(strOrJSON)] = value;
  }
}
