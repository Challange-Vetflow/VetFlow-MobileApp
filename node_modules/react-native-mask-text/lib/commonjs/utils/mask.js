"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mask = mask;
exports.unMask = unMask;

var _bignumber = require("bignumber.js");

var _toPattern = _interopRequireDefault(require("./toPattern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-confusing-arrow */

/**
 * function unMask(
 * @param {string} value
 * @param {'custom' | 'currency'} type
 * @returns {string}
 */
function unMask(value) {
  let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'custom';

  if (type === 'currency') {
    if (!value) return '0';
    const unMaskedValue = value.replace(/\D/g, '');
    const number = parseInt(unMaskedValue.trimStart());
    return number.toString();
  }

  return value.replace(/\W/g, '');
}
/**
 * function masker(
 * @param {string} value
 * @param {string} patterns
 * @param {any} options
 * @returns {string}
 */


function masker(value, pattern, options) {
  const {
    autoCapitalize
  } = options;
  const sentence = (0, _toPattern.default)(value, {
    pattern,
    ...options
  });

  switch (autoCapitalize) {
    case 'characters':
      sentence.toUpperCase();
      break;

    case 'words':
      sentence.replace(/(?:^|\s)\S/g, text => text.toUpperCase());
      break;

    case 'sentences':
      {
        const lower = sentence.toLowerCase();
        lower.charAt(0).toUpperCase() + lower.substring(1);
        break;
      }
  }

  return sentence;
}
/**
 * function masker(
 * @param {string} value
 * @param {any} options
 * @returns {string}
 */


function currencyMasker() {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0';
  let options = arguments.length > 1 ? arguments[1] : undefined;
  const {
    prefix,
    decimalSeparator,
    groupSeparator,
    precision,
    groupSize,
    secondaryGroupSize,
    fractionGroupSeparator,
    fractionGroupSize,
    suffix
  } = options;
  const precisionDivider = parseInt(1 + '0'.repeat(precision || 0));
  const number = parseInt(value) / precisionDivider;
  const formatter = {
    prefix,
    decimalSeparator,
    groupSeparator,
    groupSize: groupSize || 3,
    secondaryGroupSize,
    fractionGroupSeparator,
    fractionGroupSize,
    suffix
  };
  const bigNumber = new _bignumber.BigNumber(number);

  _bignumber.BigNumber.config({
    FORMAT: formatter
  });

  return bigNumber.toFormat(precision);
}

function dateMasker() {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let options = arguments.length > 1 ? arguments[1] : undefined;
  const {
    dateFormat = 'yyyy/mm/dd'
  } = options;
  const regex = /[a-zA-Z]/gi;
  const pattern = dateFormat.replaceAll(regex, '9');
  return masker(value, pattern, {});
}

function timeMasker() {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let options = arguments.length > 1 ? arguments[1] : undefined;
  const {
    timeFormat = 'HH:mm:ss'
  } = options;
  const pattern = timeFormat;
  return masker(value, pattern, {});
}
/**
 * function multimasker(
 * @param {string} value
 * @param {string[]} patterns
 * @param {any} options
 * @returns {string}
 */


function multimasker(value, patterns, options) {
  return masker(value, patterns.reduce((memo, pattern) => value.length <= unMask(memo).length ? memo : pattern, patterns[0]), options);
}

function mask(value) {
  let pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'custom';
  let options = arguments.length > 3 ? arguments[3] : undefined;
  let autoCapitalize = arguments.length > 4 ? arguments[4] : undefined;

  if (type === 'currency') {
    return currencyMasker(String(value), options);
  }

  if (type === 'date') {
    return dateMasker(String(value), options);
  }

  if (type === 'time') {
    return timeMasker(String(value), options);
  }

  if (typeof pattern === 'string') {
    return masker(String(value), pattern || '', {
      autoCapitalize: autoCapitalize
    });
  }

  return multimasker(String(value), pattern, {});
}
//# sourceMappingURL=mask.js.map