export interface CartVariables {
  minOrderSum: number;
  moscowDelivery: number;
  deliveryPerKm: number;
}

export interface MobileButtons {
  mobileWhatsApp: string;
  mobilePhone: string;
}

export interface Variables extends CartVariables, MobileButtons {}

export enum CartVariablesEnum {
  minOrderSum = 30,
  moscowDelivery,
  deliveryPerKm,
  nearestDelivery = 33,
  middleDelivery,
}

export enum MobileButtonsEnum {
  mobileWhatsApp = 37,
  mobilePhone,
}
