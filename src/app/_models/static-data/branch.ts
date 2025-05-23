export interface Branch {
  address: string[];
  phones: string[];
  whatsAppNumber: string;
  mail: string;
  workTime: string[];
  mapImages: string[];
  mapFrames: string[];
}

export interface AddressData {
  address: string;
  workTime: string;
  mapImage: string;
}

export enum BranchEnum {
  workTime = 4,
  address,
  whatsAppNumber,
  mail = 8,
  phones = 35,
  mapImages = 63,
}
