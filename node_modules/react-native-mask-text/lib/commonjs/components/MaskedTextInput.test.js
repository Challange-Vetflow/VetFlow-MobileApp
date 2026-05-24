"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("@testing-library/react-native");

var _MaskedTextInput = require("./MaskedTextInput");

var _reactNative2 = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<MaskedTextInput />', () => {
  const mockedOnChangeText = jest.fn();
  test('should render correctly without a mask', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      value: "with space and special* characters;",
      onChangeText: mockedOnChangeText
    }));
    expect(container).toMatchSnapshot();
  });
  test('should renders correctly with custom mask', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      mask: "AAA-999",
      onChangeText: mockedOnChangeText
    }));
    expect(container).toMatchSnapshot();
  });
  test('should renders correctly with custom mask default value', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      mask: "AAA-999",
      onChangeText: mockedOnChangeText,
      defaultValue: "ABC-123"
    }));
    expect(container.getByDisplayValue('ABC-123')).toBeTruthy();
  });
  test('should renders correctly with currency mask', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      type: "currency",
      options: {
        prefix: '$',
        decimalSeparator: '.',
        groupSeparator: ',',
        precision: 2
      },
      onChangeText: mockedOnChangeText
    }));
    expect(container).toMatchSnapshot();
  });
  test('should mask input text with custom mask', async () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      mask: "AAA-999",
      onChangeText: mockedOnChangeText,
      testID: "masked-text-input"
    }));

    _reactNative.fireEvent.changeText(container.getByTestId('masked-text-input'), 'RCT777');

    await (0, _reactNative.waitFor)(() => {
      expect(container.getByDisplayValue('RCT-777')).toBeTruthy();
    });
  });
  test('should mask input text with currency mask', async () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      type: "currency",
      options: {
        prefix: '$',
        decimalSeparator: '.',
        groupSeparator: ',',
        precision: 2
      },
      onChangeText: mockedOnChangeText,
      testID: "masked-text-input"
    }));

    _reactNative.fireEvent.changeText(container.getByTestId('masked-text-input'), '5999');

    await (0, _reactNative.waitFor)(() => {
      expect(container.getByDisplayValue('$59.99')).toBeTruthy();
    });
  });
  test('should renders correctly with an accessory view', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      type: "currency",
      options: {
        prefix: '$',
        decimalSeparator: '.',
        groupSeparator: ',',
        precision: 2
      },
      onChangeText: mockedOnChangeText,
      inputAccessoryViewID: "Done",
      inputAccessoryView: /*#__PURE__*/_react.default.createElement(_reactNative2.InputAccessoryView, {
        nativeID: "Done"
      }, /*#__PURE__*/_react.default.createElement(_reactNative2.Button, {
        onPress: () => _reactNative2.Keyboard.dismiss(),
        title: "Clear text"
      }))
    }));
    const tree = container.toJSON();
    expect(tree[0].props.inputAccessoryViewID).toBe('Done');
    expect(tree[1].props.nativeID).toBe('Done');
  });
  test('should be bold when the textBold attribute is added', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      testID: "masked-text-input",
      onChangeText: mockedOnChangeText,
      textBold: true,
      mask: "99/99/9999"
    }));
    expect(container.getByTestId('masked-text-input')).toHaveStyle({
      fontWeight: 'bold'
    });
  });
  test('should be italic when the textItalic attribute is added', () => {
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      testID: "masked-text-input",
      onChangeText: mockedOnChangeText,
      textItalic: true,
      mask: "99/99/9999"
    }));
    expect(container.getByTestId('masked-text-input')).toHaveStyle({
      fontStyle: 'italic'
    });
  });
  test('should be the line style added to the text when the textDecoration attribute has a non-null value', () => {
    const textDecorationLine = 'underline';
    const container = (0, _reactNative.render)( /*#__PURE__*/_react.default.createElement(_MaskedTextInput.MaskedTextInput, {
      testID: "masked-text-input",
      onChangeText: mockedOnChangeText,
      textDecoration: textDecorationLine,
      mask: "99/99/9999"
    }));
    expect(container.getByTestId('masked-text-input')).toHaveStyle({
      textDecorationLine: textDecorationLine
    });
  });
});
//# sourceMappingURL=MaskedTextInput.test.js.map