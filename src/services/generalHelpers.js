import _ from 'lodash';
/**
 * @param {string} [str]
 * @returns {boolean}
 */
const isNullOrWhiteSpace = (str) => {
  if (str !== null && str !== undefined && typeof str !== 'string') {
    str = str.toString();
  }
  return !str || str.trim() === '';
};

/**
 * @param {any[]} [list]
 * @returns {boolean}
 */
const isNullOrEmpty = (list) => {
  return !list || list.length === 0;
};

/**
 * @param {number[]} list
 * @returns {number}
 */
const max = (list) => {
  let maxValue = 0;
  list.forEach((v) => {
    if (v > maxValue) maxValue = v;
  });

  return maxValue;
};

/**
 * @param {number[]} arr
 * @returns {boolean}
 */

const allEqual = (arr) => {
  if (arr.length > 0) {
    return arr.every((v) => v === arr[0]);
  } else {
    return false;
  }
};

/**
 * @param {any} object
 * @param {string[]} properties
 */

const removePropertiesFromObject = (object, properties) => {
  if (!properties || !object) return;
  properties.forEach((p) => {
    delete object[p];
  });
};

/**
 * @param {string} str
 * @returns {boolean}
 */

function isDecimal(str) {
  var match = str.match(/(\d+\.?\d*|\.\d+)/g);
  return match && str === match[0];
}

/**
 * @param {string} str
 * @returns {boolean}
 */

function isInteger(str) {
  if (str === undefined) return false;
  if (typeof str !== 'string') {
    str = str.toString();
  }
  var match = str.match(/(\d+)/g);
  return match && str === match[0];
}

/**
 * @param {number} value
 * @returns {string}
 */
const formatToTwoDigitsMax = (value) => {
  let twoDigitValue = value.toFixed(2);

  twoDigitValue = twoDigitValue.replace(/[.,]00$/, '');

  if (twoDigitValue.includes('.')) {
    twoDigitValue = twoDigitValue.replace(/0$/, '');
  }

  return twoDigitValue;
};

const checkAllObjectParametersAreZero = (object) => {
  return Object.values(object).every((v) =>
    v && typeof v === 'object'
      ? checkAllObjectParametersAreZero(v)
      : v === 0 || v === null
  );
};

const getIdFromLookupByCode = (lookupList, code) => {
  return lookupList.find((item) => item?.Code === code)?.Id;
};

const getIdFromLookupByName = (lookupList, name) => {
  return lookupList.find((item) => item?.Name === name)?.Id;
};

const isTwoArraysEqualBy = (arr1, arr2, func) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((e1) => {
    return arr2.some((e2) => {
      return func(e1, e2);
    });
  });
};

const compareObjectsByPropertyStatus = (obj1, obj2, property) => {
  const clonedObj1 = _.cloneDeep(obj1);
  const clonedObj2 = _.cloneDeep(obj2);

  const clonedObj1WithoutProperty = _.cloneDeep(obj1);
  delete clonedObj1WithoutProperty[property];
  const clonedObj2WithoutProperty = _.cloneDeep(obj2);
  delete clonedObj2WithoutProperty[property];

  return {
    propertyChanged: !_.isEqual(clonedObj1[property], clonedObj2[property]),
    anyOtherPropertiesChanged: !_.isEqual(
      clonedObj1WithoutProperty,
      clonedObj2WithoutProperty
    ),
  };
};

const handleKeyPress = (target, executeOn = [], callback) => {
  if (executeOn.includes(target.charCode)) {
    return callback;
  }
  return () => {};
};

export {
  isNullOrWhiteSpace,
  isNullOrEmpty,
  max,
  allEqual,
  removePropertiesFromObject,
  isDecimal,
  isInteger,
  formatToTwoDigitsMax,
  checkAllObjectParametersAreZero,
  getIdFromLookupByCode,
  getIdFromLookupByName,
  isTwoArraysEqualBy,
  compareObjectsByPropertyStatus,
  handleKeyPress,
};
