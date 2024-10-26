export interface Cart {
  minSumTitle: string;
  minSumInfo: string;
  infoText: string;
  address: string[];
  phones: string[];
  mail: string[];
  callText: string;
  writeText: string;
  bannerTitle: string;
  leftBannerBlock: BannerBlock;
  centerBannerBlock: BannerBlock;
  rightBannerBlock: BannerBlock;
  boxesTitle: string;
  boxesNotice: string;
  paymentInfo: string;
}

export interface BannerBlock {
  title: string;
  description: string;
}

export enum CartEnum {
  minSumTitle = 18,
  minSumInfo,
  infoText,
  address,
  phones,
  mail,
  callText,
  writeText,
  bannerTitle,
  leftBannerBlock,
  centerBannerBlock,
  rightBannerBlock,
  boxesTitle = 58,
  boxesNotice,
  paymentInfo,
}

export interface DownloadInvoice {
  title: string;
  text: string;
}

export enum DownloadInvoiceEnum {
  title = 61,
  text,
}
