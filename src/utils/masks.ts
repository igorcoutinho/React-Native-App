import { maskitoTransform } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import IMask from 'imask';
import metadata from 'libphonenumber-js/mobile/metadata';

export const phoneNumberMask = IMask.createMask({
  mask: [
    // {
    //   country: 'Uk',
    //   mask: '+44 00000000000',
    //   startsWith: '44',
    // },
    {
      country: 'Unknown',
      mask: '+0000000000000000',
      startsWith: '',
    },
  ],
});

phoneNumberMask.dispatch = (appended, dynamicMasked) => {
  const number = (dynamicMasked.value + appended).replace(/\D/g, '');
  return (
    dynamicMasked.compiledMasks.find((mask: any) => {
      return number.includes(mask.startsWith);
    }) || dynamicMasked.compiledMasks[3]
  );
};

export const currencyMask = IMask.createMask({
  mask: '£ num',
  blocks: {
    num: {
      mask: Number,
      scale: 2,
      thousandsSeparator: '.',
      radix: ',',
    },
  },
});

export const toCurrency = (number: number, currency?: string) =>
  number !== undefined
    ? number.toLocaleString('en-GB', {
      currency: currency || 'GBP',
      style: 'currency',
    })
    : '';

export const toNumericFormat = (number: number, minimumFractionDigits?: number) =>
  number
    ? number.toLocaleString('en-GB', {
      minimumFractionDigits: minimumFractionDigits || 2,
    })
    : '';

export const toCurrencyV2 = (value: string, hidePrefix?: boolean, decimalZeroPadding?: boolean) => {
  const masked = maskitoTransform(
    value || '',
    maskitoNumberOptionsGenerator({
      prefix: hidePrefix ? '' : '£ ',
      decimalSeparator: '.',
      thousandSeparator: ',',
      min: 0,
      precision: 2,
      decimalZeroPadding,
    }),
  );
  return masked;
};

export const toCurrencyPresentation = (value: string | number) => {
  const valueAsString = String(value);
  const masked = maskitoTransform(
    valueAsString || '',
    maskitoNumberOptionsGenerator({
      prefix: '£ ',
      decimalSeparator: '.',
      thousandSeparator: ',',
      min: 0,
      precision: 2,
      decimalZeroPadding: true,
    }),
  );
  return masked;
};

export const formatPhoneNumber = (value: string) => {
  const masked = maskitoTransform(
    value || '',
    maskitoPhoneOptionsGenerator({ countryIsoCode: 'GB', strict: true, metadata }),
  );
  return masked;
};

export const unmaskedCurrency = (masked: string) => {
  return Number(masked.replace('£ ', '').replace(/,/g, '')).toFixed(2);
};
