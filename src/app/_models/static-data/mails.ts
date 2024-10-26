export interface MailsTexts {
  signature: string;
  individualText: string;
  businessText: string;
  businessNotificationText: string;
}

export enum MailsEnum {
  signature = 64,
  individualText = 68,
  businessText,
  businessNotificationText,
}
