import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricesComponent } from './prices.component';
import { IndividualComponent } from './individual/individual.component';

const routes: Routes = [
  { path: '', component: PricesComponent },
  { path: 'individual', component: IndividualComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricesRoutingModule {}
