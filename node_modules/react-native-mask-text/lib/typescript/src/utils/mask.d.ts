import type { AutoCapitalizeOptions } from 'src/@types/AutoCapitalizeOptions';
import type { FormatType } from '../@types/FormatType';
/**
 * function unMask(
 * @param {string} value
 * @param {'custom' | 'currency'} type
 * @returns {string}
 */
declare function unMask(value: string, type?: 'custom' | 'currency'): string;
declare function mask(value: string | number, pattern?: string | string[], type?: FormatType, options?: any, autoCapitalize?: AutoCapitalizeOptions): string;
export { mask, unMask };
