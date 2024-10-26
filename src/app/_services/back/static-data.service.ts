import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { About, AboutEnum } from '../../_models/static-data/about';
import { Advantages, AdvantagesEnum } from '../../_models/static-data/advantages';
import {
  AdminFooter,
  AdminFooterEnum,
  Footer,
  FooterEnum,
  Header,
  HeaderEnum,
  Logo,
  LogoEnum,
} from '../../_models/static-data/header';
import { Contacts, ContactsEnum } from '../../_models/static-data/contacts';
import {
  Cart,
  CartEnum,
  DownloadInvoice,
  DownloadInvoiceEnum,
} from '../../_models/static-data/cart';
import {
  CartVariables,
  CartVariablesEnum,
  MobileButtons,
  MobileButtonsEnum,
  Variables,
} from '../../_models/static-data/variables';
import { Animation, AnimationEnum } from '../../_models/static-data/animation';
import { ProductBlock, ProductBlockEnum } from '../../_models/static-data/product-block';
import { PrivatePolicy, PrivatePolicyEnum } from '../../_models/static-data/private-policy';
import {
  PriceListHeaders,
  PriceList,
  PriceListEnum,
  PriceListHeadersEnum,
} from '../../_models/static-data/price-list';
import { MailsEnum, MailsTexts } from '../../_models/static-data/mails';

interface StaticResponse {
  id: number;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl = 'static-values';

  private postUrl = 'static-value';

  constructor(protected http: HttpClient) {}

  public getHeaderContent(): Observable<Header> {
    return this.generateGetRequest<Header>(HeaderEnum);
  }

  public getFooterContent(): Observable<Footer> {
    return this.generateGetRequest<Footer>(FooterEnum);
  }

  public getLogo(): Observable<Logo> {
    return this.generateGetRequest<Logo>(LogoEnum);
  }

  public getPriceListText(): Observable<PriceList> {
    return this.generateGetRequest<PriceList>(PriceListEnum);
  }

  public setPriceListText(text: PriceList): Observable<any> {
    return this.generatePostRequest(PriceListEnum, text);
  }

  public getPriceListHeaders(): Observable<PriceListHeaders> {
    return this.generateGetRequest<PriceListHeaders>(PriceListHeadersEnum);
  }

  public setPriceListHeaders(headers: PriceListHeaders): Observable<any> {
    return this.generatePostRequest(PriceListHeadersEnum, headers);
  }

  public getAdminFooterContent(): Observable<AdminFooter> {
    return this.generateGetRequest<AdminFooter>(AdminFooterEnum);
  }

  public setHeaderContent(header: Header): Observable<any> {
    return this.generatePostRequest(HeaderEnum, header);
  }

  public setFooterContent(footer: AdminFooter): Observable<any> {
    return this.generatePostRequest(AdminFooterEnum, footer);
  }

  public getAboutContent(): Observable<About> {
    return this.generateGetRequest<About>(AboutEnum);
  }

  public setAboutContent(about: About): Observable<any> {
    return this.generatePostRequest(AboutEnum, about);
  }

  public getPrivatePolicyContent(): Observable<PrivatePolicy> {
    return this.generateGetRequest<PrivatePolicy>(PrivatePolicyEnum);
  }

  public setPrivatePolicyContent(privatePolicy: PrivatePolicy): Observable<any> {
    return this.generatePostRequest(PrivatePolicyEnum, privatePolicy);
  }

  public getAdvantagesContent(): Observable<Advantages> {
    return this.generateGetRequest<Advantages>(AdvantagesEnum);
  }

  public setAdvantagesContent(advantages: Advantages): Observable<any> {
    return this.generatePostRequest(AdvantagesEnum, advantages);
  }

  public getProductBlockContent(): Observable<ProductBlock> {
    return this.generateGetRequest<ProductBlock>(ProductBlockEnum);
  }

  public setProductBlockContent(productBlock: ProductBlock): Observable<any> {
    return this.generatePostRequest(ProductBlockEnum, productBlock);
  }

  public getContactsContent(): Observable<Contacts> {
    return this.generateGetRequest<Contacts>(ContactsEnum);
  }

  public setContactsContent(contacts: Contacts): Observable<any> {
    return this.generatePostRequest(ContactsEnum, contacts);
  }

  public getCartContent(): Observable<Cart> {
    return this.generateGetRequest<Cart>(CartEnum);
  }

  public setCartContent(cart: Cart): Observable<any> {
    return this.generatePostRequest(CartEnum, cart);
  }

  public getDownloadInvoiceContent(): Observable<DownloadInvoice> {
    return this.generateGetRequest<DownloadInvoice>(DownloadInvoiceEnum);
  }

  public setDownloadInvoiceContent(data: DownloadInvoice): Observable<any> {
    return this.generatePostRequest(DownloadInvoiceEnum, data);
  }

  public getMailTexts(): Observable<MailsTexts> {
    return this.generateGetRequest<MailsTexts>(MailsEnum);
  }

  public setMailsTexts(data: MailsTexts): Observable<any> {
    return this.generatePostRequest(MailsEnum, data);
  }

  public getVariables(): Observable<Variables> {
    return this.generateGetRequest<Variables>({ ...CartVariablesEnum, ...MobileButtonsEnum }).pipe(
      map((vars) => {
        vars.minOrderSum = Number(vars.minOrderSum);
        vars.moscowDelivery = Number(vars.moscowDelivery);
        vars.deliveryPerKm = Number(vars.deliveryPerKm);
        return vars;
      }),
    );
  }

  public getCartVariables(): Observable<CartVariables> {
    return this.generateGetRequest<CartVariables>(CartVariablesEnum).pipe(
      map((vars) => {
        vars.minOrderSum = Number(vars.minOrderSum);
        vars.moscowDelivery = Number(vars.moscowDelivery);
        vars.deliveryPerKm = Number(vars.deliveryPerKm);
        return vars;
      }),
    );
  }

  public getMobileVariables(): Observable<MobileButtons> {
    return this.generateGetRequest<MobileButtons>(MobileButtonsEnum);
  }

  public setVariables(vars: Variables): Observable<any> {
    return this.generatePostRequest({ ...CartVariablesEnum, ...MobileButtonsEnum }, vars);
  }

  public getAnimations(): Observable<Animation> {
    return this.generateGetRequest<Animation>(AnimationEnum).pipe(
      map((animation) => {
        animation.firstNumber = Number(animation.firstNumber);
        animation.secondNumber = Number(animation.secondNumber);
        animation.thirdNumber = Number(animation.thirdNumber);
        animation.fourthNumber = Number(animation.fourthNumber);
        return animation;
      }),
    );
  }

  public setAnimations(animations: Animation): Observable<any> {
    return this.generatePostRequest(AnimationEnum, animations);
  }

  private getQueryParams(enumObject: any): string {
    const params: string[] = [];
    Object.values(enumObject)
      .filter((value) => typeof value === 'number')
      .map((value) => {
        params.push(`valueIds[]=${value}`);
      });
    return params.join('&');
  }

  private getPostIndexes(enumObject: any, keys: string[]): number[] {
    const keysArray: unknown[] = Object.values(enumObject).filter(
      (value) => typeof value === 'string',
    );
    const valuesArray: unknown[] = Object.values(enumObject).filter(
      (value) => typeof value === 'number',
    );
    const numbersArray: number[] = [];
    keys.map((key) => {
      const index = keysArray.findIndex((el) => el === key);
      numbersArray.push(<number>valuesArray[index]);
    });
    return numbersArray;
  }

  private generateGetRequest<T>(enumObject: any): Observable<T> {
    const values = this.getQueryParams(enumObject);
    return this.http.get<StaticResponse[]>(`${this.baseUrl}/${this.apiUrl}?${values}`).pipe(
      map((response) => {
        let header: Record<string, any> = {};
        response.map((element) => {
          const key = enumObject[element.id];
          header[key] = JSON.parse(element.value);
        });
        return header as T;
      }),
    );
  }

  private generatePostRequest(enumObject: any, requestObject: any): Observable<any> {
    const ids: number[] = this.getPostIndexes(enumObject, Object.keys(requestObject));
    const values = Object.values(requestObject);
    const requests = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      requests.push(
        this.http.post(`${this.baseUrl}/${this.postUrl}/${id}`, {
          value: JSON.stringify(values[i]),
        }),
      );
    }
    return forkJoin(requests);
  }

  public uploadFile(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/save-file`, formData);
  }
}
