/// <reference types="react" />
import { TextProps } from 'react-native';
import type { MaskOptions, StyleObj, TextDecorationOptions } from 'src/@types';
export interface MaskedTextProps {
    children: string;
    mask?: string;
    type?: 'custom' | 'currency';
    options?: MaskOptions;
    textBold?: boolean;
    textItalic?: boolean;
    textDecoration?: TextDecorationOptions;
    style?: StyleObj;
}
export declare function MaskedText({ children: text, mask: pattern, type, options, textBold, textItalic, textDecoration, style, ...rest }: MaskedTextProps & TextProps): JSX.Element;
