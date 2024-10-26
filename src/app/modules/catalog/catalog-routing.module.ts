import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SeedlingsComponent } from './seedlings/seedlings.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    data: {
      title: 'Каталог',
      description:
        'Агрофирма Цветочная Долина представляет широкий ассортимент разнообраных растений и товаров цветочной тематики - от рассад однолетних и многолетних цветов, до питательных грунтов для растений',
    },
  },
  
  { path: ':category', component: CategoryComponent },
  { path: ':category/:id', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
