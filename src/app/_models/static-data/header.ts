export interface Logo {
  img: string;
}

interface GeneralData extends Logo {
  title: string;
  subTitle: string;
  workTime: string[];
  address: string[];
  whatsAppNumber: string;
  mail: string;
}

export interface AdminFooter {
  phones: string[];
  roots: string;
}

export interface Header extends GeneralData {
  phone: string;
}

export interface AddressData {
  address: string;
  workTime: string;
  addrname: any;
  lonlan: any;
}

export interface Footer extends GeneralData, AdminFooter {}

export enum HeaderEnum {
  img = 1,
  title,
  subTitle,
  workTime,
  address,
  whatsAppNumber,
  phone,
  mail,
}

export enum FooterEnum {
  img = 1,
  title,
  subTitle,
  workTime,
  address,
  whatsAppNumber,
  mail = 8,
  phones = 35,
  roots = 36,
}

export enum AdminFooterEnum {
  phones = 35,
  roots,
}

export enum LogoEnum {
  img = 1,
}
