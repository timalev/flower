import { Component } from '@angular/core';
import { ProductService } from '../../_services/back/product.service';
import { Router } from '@angular/router';
import { slugify } from 'transliteration';

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  categoryId: number;
  boxId: number;
  categoryName: string;
}

@Component({
  selector: 'flower-valley-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public product: SearchProduct | undefined;
  public searchResults: SearchProduct[] = [];
  constructor(private productService: ProductService, private router: Router) {}

  public searchProducts(searchString: string): void {
    this.productService.search<SearchProduct[]>(searchString).subscribe((res) => {
      this.searchResults = res;
    });
  }

  public navigate(product: SearchProduct): void {
    this.router.navigate(['catalog', slugify(product.categoryName), product.id]);
    this.product = undefined;
  }
}
