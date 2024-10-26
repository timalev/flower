import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { Category } from '../../../../_models/category';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../_services/back/product.service';
import { forkJoin } from 'rxjs';
import { Product } from '../../../../_models/product';
import { PriceListGenerateService } from '../../../../_services/front/price-list-generate.service';
import { MailService } from '../../../../_services/back/mail.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { MessageService } from 'primeng/api';
import { StaticDataService } from '../../../../_services/back/static-data.service';

@Component({
  selector: 'flower-valley-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit {
  public catalog: Category[] = [];
  public goods: Product[] = [];
  private clonedProducts: { [s: string]: Product } = {};
  public selectedGoods: Product[] = [];
  private selectedCategories: Category[] = [];
  public isLoading: boolean = false;
  public categoryControl: FormControl;
  public email: FormControl;
  public _doc: Blob | undefined;
  public sendButtonDisabled: boolean = true;
  public sendingMail: boolean = false;
  public textGroup: FormGroup;

  private set document(value: Blob | undefined) {
    if (value) this.sendButtonDisabled = false;
    this._doc = value;
  }

  public get document(): Blob | undefined {
    return this._doc;
  }
  constructor(
    private catalogService: CatalogService,
    private productService: ProductService,
    private staticData: StaticDataService,
    private pricesPDFService: PriceListGenerateService,
    private mailService: MailService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.categoryControl = fb.control('');
    this.email = fb.control('', Validators.required);
    this.categoryControl.valueChanges.subscribe((value) => {
      this.isLoading = true;
      this.selectedGoods = [];
      this.selectedCategories = value;
      value.map((category: any) => {
        const products = this.goods.filter((product) => product.discountCategoryId === category.id);
        this.selectedGoods = this.selectedGoods.concat(products);
      });
      this.isLoading = false;
    });
    this.textGroup = fb.group({
      textTop: [''],
      textBottom: [''],
    });
  }

  ngOnInit(): void {
    const requests = [this.catalogService.getItems(true), this.productService.getItems()];
    forkJoin(requests).subscribe(([catalog, products]) => {
      this.catalog = catalog as Category[];
      this.goods = (products as Product[]).filter((product) => product.categoryId !== 1);
    });
    this.pricesPDFService.getGeneratedDocument().subscribe((doc) => {
      this.document = doc;
    });
    this.staticData.getPriceListText().subscribe((priceListData) => {
      this.textGroup.patchValue(priceListData);
    });
  }

  public onRowEditInit(product: Product): void {
    if (product.id) this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: Product) {
    if (product.id) {
      const i = this.goods.findIndex((item) => item.id === product.id);
      this.goods[i] = product;
      delete this.clonedProducts[product.id];
    }
  }

  public onRowEditCancel(product: Product, index: number) {
    if (product.id) {
      this.goods[index] = this.clonedProducts[product.id];
      delete this.clonedProducts[product.id];
    }
  }

  public showPriceList(): void {
    this.pricesPDFService.generatePriceList(
      this.selectedCategories,
      this.selectedGoods,
      this.textGroup.getRawValue(),
    );
  }

  public sendMail(): void {
    if (this.document) {
      if (isFormInvalid(this.email)) return;
      this.sendingMail = true;
      const data: FormData = new FormData();
      data.append('email', this.email.value);
      data.append(
        'priceList',
        new File([this.document], 'Прайс-лист Агрофирма Цветочная Долина.pdf'),
      );
      this.mailService.sendPricesMail(data).subscribe(() => {
        this.sendingMail = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Прайс-лист отправлен',
          detail: `Прайс-лист с выбранными позициями направлен на почту ${this.email.value}`,
        });
      });
    }
  }
}
