"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaskedText = MaskedText;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _mask = require("../utils/mask");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function MaskedText(_ref) {
  let {
    children: text,
    mask: pattern = '',
    type = 'custom',
    options = {},
    textBold,
    textItalic,
    textDecoration,
    style,
    ...rest
  } = _ref;
  const styleSheet = [{
    fontWeight: textBold && 'bold',
    fontStyle: textItalic && 'italic',
    textDecorationLine: textDecoration
  }, style];
  return /*#__PURE__*/_react.default.createElement(_reactNative.Text, _extends({}, rest, {
    style: styleSheet
  }), (0, _mask.mask)(text, pattern, type, options));
}
//# sourceMappingURL=MaskedText.js.map