import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../_models/order';
import { StaticDataService } from './static-data.service';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private baseUrl = environment.baseUrl;

  private apiUrl: string = 'mails';

  private signature: string = '';

  private individualText: string = '';

  private businessText: string = '';

  private businessNotificationText: string = '';

  constructor(private http: HttpClient, private staticData: StaticDataService) {
    staticData.getMailTexts().subscribe((data) => {
      this.individualText = data.individualText;
      this.businessText = data.businessText;
      this.signature = data.signature;
      this.businessNotificationText = data.businessNotificationText;
    });
  }

  public sendIndividualMail(data: FormData, order: Order): Observable<any> {
    this.sendCopyToAdmin(false, data, order);
    data.append('sign', this.signature);
    data.append('text', this.individualText);
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/individual`, data);
  }

  public sendBusinessMail(data: FormData, order: Order, firmName: string): Observable<any> {
    this.sendCopyToAdmin(true, data, order, firmName);
    data.append('sign', this.signature);
    data.append('text', this.businessText);
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/business`, data);
  }

  public sendBusinessNotificationMail(order: Order): Observable<any> {
    this.sendAdminNotificationMail(order).subscribe();
    const data = new FormData();
    data.append('orderId', order.id.toString());
    data.append('email', order.clientEmail);
    data.append('sign', this.signature);
    data.append('text', this.businessNotificationText);
	console.log(`${this.baseUrl}/${this.apiUrl}/business-notification`);
	//console.log(this.http.post(`${this.baseUrl}/${this.apiUrl}/business-notification`, data));
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/business-notification`, data);
  }

  public sendEditOrderMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/edit-order`, data);
  }

  private sendAdminMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/admin`, data);
  }







  private sendAdminNotificationMail(order: Order): Observable<any> {
    const data = new FormData();
    data.append('orderId', order.id.toString());
    data.append('contactName', order.clientName);
    data.append('contactPhone', order.clientPhone);
    data.append('contactEmail', order.clientEmail);
    data.append('contactAddress', order.clientAddress);

	console.log("adminu sended!!");
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/admin-notification`, data);
  }

  public sendPricesMail(data: any): Observable<any> {
    data.append('sign', this.signature);
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/price-list`, data);
  }

  private sendCopyToAdmin(
    isBusiness: boolean,
    formData: FormData,
    order: Order,
    firmName?: string,
  ): void {
    const data = new FormData();
    data.append('isBusiness', `${isBusiness}`);
    data.append('sum', order.orderSum.toString());
    data.append('orderId', order.id.toString());
    data.append('accountNumber', order.accountNumber || '');
    data.append('clientName', firmName || order.clientName);
    data.append('contactName', order.clientName);
    data.append('contactPhone', order.clientPhone);
    data.append('contactEmail', order.clientEmail);
    data.append('contactAddress', order.clientAddress);
    const file = formData.get('file');
    if (file) {
      data.append('file', file);
    }
    this.sendAdminMail(data).subscribe();
  }
}
