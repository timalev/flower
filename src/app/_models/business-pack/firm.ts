export interface Firm extends Bank {
  Object?: string;
  Self: boolean;
  ShortName: string;
  FullName: string;
  Address: string;
  NoNDS: boolean;
  INN: string;
  KPP: string;
  RasDep: string;
  Custom1: string;
  Custom2: string;
  OKPO: string;
  NoSeal: boolean;
  No2ndSign: boolean;
  OKDP: string;
  ExtraName: string;
  PersonalDep: string;
  OrgEMail: string;
  OrgPhone: string;
  OrgUrl: string;
}

export interface Individual {
  FullName: string;
  Address: string;
}

export interface Bank {
  BIK: string;
  Bank: string;
  CorDep: string;
}
