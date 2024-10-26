import { NgModule } from '@angular/core';
import { RouterModule,  UrlSegment, Routes } from '@angular/router';
import { AdminGuard } from './_guards/admin.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { CategoryComponent } from './modules/catalog/category/category.component';
import { ProductComponent } from './modules/catalog/product/product.component';
import { SeedlingsComponent } from './modules/catalog/seedlings/seedlings.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/main-page/main-page.module').then((m) => m.MainPageModule),
  },
  {
    path: 'branch',
    loadChildren: () => import('./modules/branch/branch.module').then((m) => m.BranchModule),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./modules/contacts/contacts.module').then((m) => m.ContactsModule),
  },
  {
    path: 'catalog',
    loadChildren: () => import('./modules/catalog/catalog.module').then((m) => m.CatalogModule),
  },

	

  {
    path: 'private-policy',
    loadChildren: () =>
      import('./modules/private-policy/private-policy.module').then((m) => m.PrivatePolicyModule),
  },
  
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
		{
    path: 'seedlings',
    component: SeedlingsComponent,
    data: {
      title: 'Рассады',
      description:
        'Агрофирма Цветочная Долина представляет широкий ассортимент разнообраных рассад - ампельные, ягоды, однолетние и многолетние растения',
    },
  },
			 {

			 /*
			   matcher: (url) => {
        if (url.length === 1 && url[0].path.match(/^@[\w]+$/gm)) {
        return {
            consumed: url,
            posParams: {
            username: new UrlSegment(url[0].path.slice(1), {})
            }
        };
        }

        return null;
    },
*/
    path: ':category',
     component: CategoryComponent,
	
  },
   { path: ':category/:id', component: ProductComponent },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
