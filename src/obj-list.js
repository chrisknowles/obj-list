/**
 * A module to handle managing changes to an array of objects
 */
import {
  whereEq,
  propEq,
  filter,
  toPairs,
  findIndex,
  omit,
} from 'ramda';

const getKeyVal = (key, value) =>
  value
    ? {key, value}
    : {key: 'id', value: key};

const getKeyValItem = (item, key, value) =>
  value
    ? {key, value}
    : {key: 'id', value: item.id};

const getIndex = (arr, key, value) =>
  value
    ? findIndex(propEq(key, value))(arr)
    : getIndexFromKeys(arr, key);

const getIndexFromKeys = (arr, pairs) =>
  findIndex(getItemFromKeys(arr, pairs));

const getItemFromKeys = (arr, pairs) =>
  toPairs(pairs).reduce((acc, pair) =>
    filter(propEq(pair[0], pair[1]))(acc)
  , arr)[0];

// get an item
const getItem = arr => keyVals => {
  if (isObject(keyVals)) {
    return getAllItems(arr)(keyVals)[0];
  }
  return getAllItems(arr)({id: keyVals})[0];
}

const get = (arr, keyVals) =>
  keyVals
    ? getItem(arr)(keyVals)
    : getItem(arr);

// get all items
const getAllItems = arr => keyVals => {
  return arr.filter(item =>
    whereEq(keyVals)(item)
  );
}
const getAll = (arr, keyVals) =>
  keyVals
    ? getAllItems(arr)(keyVals)
    : getAllItems(arr);

// contains
const containsItem = arr => (keyVals) => {
  return arr
    ? get(arr, keyVals)
      ? true
      : false
    : false;
}
const contains = (arr, keyVals) =>
keyVals
    ? containsItem(arr)(keyVals)
    : containsItem(arr);

// replace an item with a new item
const replaceItem = arr => (item, k, v) => {
  const {key, value} = getKeyValItem(item, k, v);
  arr[getIndex(arr, key, value)] = item;
  return arr;
};

const replace = (arr, item, key, value) =>
  item
    ? replaceItem(arr)(item, key, value)
    : replaceItem(arr);

// remove an item
const removeItem = arr => (k, v) => {
  const {key, value} = getKeyVal(k, v);
  arr.splice(getIndex(arr, key, value), 1);
  return arr;
};
const remove = (arr, key, value) =>
  key
    ? removeItem(arr)(key, value)
    : removeItem(arr);

// remove properties from an item
const removeProps = (arr, props, key, val) =>
  props
    ? replace(arr, omit(props, get(arr, key, val)), key, val)
    : replace(arr);

// update a whole item
const updateItem = arr => (item, k, v) => {
  const {key, value} = getKeyValItem(item, k, v);
  arr[getIndex(arr, key, value)] = {
    ...arr[getIndex(arr, key, value)],
    ...item
  };
  return arr;
}
const update = (arr, item, key, value) =>
  item
    ? updateItem(arr)(item, key, value)
    : updateItem(arr)

// update properties of an item
const updateItemProperties = arr => (updates, k, v) => {
  const {key, value} = getKeyVal(k, v);
  replace(arr, {...get(arr, {[key]: value}), ...updates}, key, value);
  return arr;
};
const updateProperties = (arr, updates, key, val) =>
  updates
    ? updateItemProperties(arr)(updates, key, val)
    : updateItemProperties(arr);

// add an item
const addItem = arr => (item, sortfield) => {
  arr.unshift(item);
  sort(arr, sortfield);
  return arr;
}
const add = (arr, item, sortfield) =>
  item
    ? addItem(arr)(item, sortfield)
    : addItem(arr);

const order = (arr, key, newOrder) => {
  return newOrder.reduce((acc, item) => {
    acc.push(get(arr, item));
    return acc;
  }, []);
};

const sort = (arr, key) => {
  if (isObject(key)) {
    const k = Object.keys(key)[0];
    return key[k] === 'DESC'
      ? sortDescending(arr, k)
      : sortAscending(arr, k);
  }
  return sortAscending(arr, key);
};

const sortAscending = (arr, key) =>
  arr.sort((a, b) => {
    if (isNumeric(a[key])) {
      a = Number(a[key]);
      b = Number(b[key]);
    } else {
      a = a[key].toLowerCase();
      b = b[key].toLowerCase();
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

const sortDescending = (arr, key) =>
  arr.sort((a, b) => {
    if (isNumeric(a[key])) {
      a = Number(a[key]);
      b = Number(b[key]);
    } else {
      a = a[key].toLowerCase();
      b = b[key].toLowerCase();
    }
    if (a > b) {
      return -1;
    }
    if (a < b) {
      return 1;
    }
    return 0;
  });

/**
 * Determines if a value is an object.
 * Many things are objects in Javascript but this checks
 * for an actual Object object!
 *
 * @param   {Mixed}   value  The value to test
 * @returns {Boolean}
 */
const isObject = value =>
  value != null &&
  typeof value === 'object' &&
  Array.isArray(value) === false;

/**
 * Determines if a value is numeric.
 * This is a strict test for integers and floats and
 * does not consider a numeric string as numeric.
 *
 * @param   {Mixed}   value  The value to test
 * @returns {Boolean}
 */
const isNumeric = n =>
  !isNaN(parseFloat(n)) && isFinite(n);

export {
  getKeyVal,
  getKeyValItem,
  getIndex,
  getItem,
  getAllItems,
  getAll,
  replaceItem,
  updateItemProperties,
  add,
  get,
  replace,
  remove,
  update,
  updateProperties,
  removeProps,
  sort,
  isObject,
  isNumeric,
};

export const objList = {
  add,
  get,
  getAll,
  replace,
  remove,
  update,
  updateProperties,
  removeProps,
  sort,
  isObject,
  isNumeric,
  contains,
  order,
};
