import { GoodsInvoice } from './goods-invoice';

export interface Invoice {
  num?: string;
  date?: string;
  firm_id: string;
  partner_id: string;
  partner_clip?: string;
  partner_flag: 'A' | 'AO' | 'N';
  goods: GoodsInvoice[];
}
