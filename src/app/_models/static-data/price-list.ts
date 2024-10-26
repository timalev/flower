export interface PriceList {
  textTop?: string;
  textBottom?: string;
}

export interface PriceListHeaders {
  name: string;
  pack: string;
  price: string;
}

export enum PriceListEnum {
  textTop = 56,
  textBottom,
}

export enum PriceListHeadersEnum {
  name = 65,
  pack,
  price,
}
