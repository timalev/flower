import { ActivatedRoute } from '@angular/router';

export interface CategoryMenu {
  id: number;
  name: string;
  routerLink: any;
  relativeTo: ActivatedRoute | null;
  isTulip: boolean;
  items?: CategoryMenu[];
}
