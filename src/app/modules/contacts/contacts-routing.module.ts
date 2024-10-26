import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    data: {
      title: 'Контакты',
      keywords: 'контакты, рассада, цветы, карты, дорога, путь, маршрут, телефон, почта',
      description: 'Полные контактные данные Агрофирмы - телефоны, почта, адреса, время работы',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
