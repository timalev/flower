export interface MainBanner<T> {
  id: number;
  title?: string;
  routerLink?: string;
  description?: string;
  label?: string;
  autoPlay: number;
  isUserCanLeaf: boolean;
  photos: BannerPhotos[];
  items?: T;
}

export interface BannerPhotos {
  id: number;
  src: string;
  sortOrder: number;
}
