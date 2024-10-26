import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: {
      main: true,
      title:
        ' Рассада оптом от производителя из подмосковной теплицы — тепличное хозяйство Агрофирма «Цветочная Долина',
      keywords:
        'рассада оптом, многолетняя рассада, купить рассаду в Москве, питомник, теплица, островцы',
      description:
        'Тепличное хозяйство Агрофирма «Цветочная Долина» занимается выращиванием и продажей рассады оптом и в розницу, питомник рассады в Островцах',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
