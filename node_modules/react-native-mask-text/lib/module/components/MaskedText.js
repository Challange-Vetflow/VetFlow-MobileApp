function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { Text } from 'react-native';
import { mask } from '../utils/mask';
export function MaskedText(_ref) {
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
  return /*#__PURE__*/React.createElement(Text, _extends({}, rest, {
    style: styleSheet
  }), mask(text, pattern, type, options));
}
//# sourceMappingURL=MaskedText.js.map