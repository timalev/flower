import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch.component';

const routes: Routes = [
  {
    path: '',
    component: BranchComponent,
    data: {
      title: 'Филиал',
      keywords: 'контакты, рассада, цветы, карты, дорога, путь, маршрут, телефон, почта',
      description: 'Полные контактные данные Агрофирмы - телефоны, почта, адреса, время работы',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
