import React from 'react';
import { render } from '@testing-library/react-native';
import { MaskedText } from './MaskedText';
describe('<MaskedText />', () => {
  test('should renders correctly with custom mask', () => {
    const container = render( /*#__PURE__*/React.createElement(MaskedText, {
      mask: "AAA-999"
    }, "RCT777"));
    expect(container.getByText('RCT-777')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  test('should renders correctly with currency mask', () => {
    const container = render( /*#__PURE__*/React.createElement(MaskedText, {
      type: "currency",
      options: {
        prefix: '$',
        decimalSeparator: '.',
        groupSeparator: ',',
        precision: 2
      }
    }, "5999"));
    expect(container.getByText('$59.99')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  test('should be bold when the textBold attribute is added', () => {
    const container = render( /*#__PURE__*/React.createElement(MaskedText, {
      textBold: true,
      mask: "99/99/9999"
    }, "30081990"));
    expect(container.getByText('30/08/1990')).toHaveStyle({
      fontWeight: 'bold'
    });
  });
  test('should be italic when the textItalic attribute is added', () => {
    const container = render( /*#__PURE__*/React.createElement(MaskedText, {
      textItalic: true,
      mask: "99/99/9999"
    }, "30081990"));
    expect(container.getByText('30/08/1990')).toHaveStyle({
      fontStyle: 'italic'
    });
  });
  test('should be the line style added to the text when the textDecoration attribute has a non-null value', () => {
    const textDecorationLine = 'underline';
    const container = render( /*#__PURE__*/React.createElement(MaskedText, {
      textDecoration: textDecorationLine,
      mask: "99/99/9999"
    }, "30081990"));
    expect(container.getByText('30/08/1990')).toHaveStyle({
      textDecorationLine: textDecorationLine
    });
  });
});
//# sourceMappingURL=MaskedText.test.js.map