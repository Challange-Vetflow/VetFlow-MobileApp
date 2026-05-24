import React, { ForwardRefRenderFunction } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import type { FormatType, MaskOptions, StyleObj, TextDecorationOptions } from 'src/@types';
declare type TIProps = Omit<TextInputProps, 'onChangeText'>;
export interface MaskedTextInputProps extends TIProps {
    mask?: string;
    type?: FormatType;
    options?: MaskOptions;
    defaultValue?: string;
    onChangeText: (text: string, rawText: string) => void;
    inputAccessoryView?: JSX.Element;
    textBold?: boolean;
    textItalic?: boolean;
    textDecoration?: TextDecorationOptions;
    style?: StyleObj;
}
export declare const MaskedTextInputComponent: ForwardRefRenderFunction<TextInput, MaskedTextInputProps>;
export declare const MaskedTextInput: React.ForwardRefExoticComponent<MaskedTextInputProps & React.RefAttributes<TextInput>>;
export {};
