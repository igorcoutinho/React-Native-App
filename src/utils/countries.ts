import { CountryCode } from "libphonenumber-js";

export interface ICountryDataItem {
  name: string;
  internationalCode: string;
  countryCode: CountryCode;
  flag: string;
}

export const countriesData: ICountryDataItem[] = [
  {
    name: 'United Kingdom',
    internationalCode: '+44',
    countryCode: 'GB',
    flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1280px-Flag_of_the_United_Kingdom.svg.png',
  },
  {
    name: 'Spain',
    internationalCode: '+34',
    countryCode: 'ES',
    flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png',
  },
  {
    name: 'Brazil',
    internationalCode: '+55',
    countryCode: 'BR',
    flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png',
  },
];