import { Component, Input, OnInit } from '@angular/core';
import { Video } from '../../../_models/video';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VideoService } from '../../../_services/back/video.service';
import { Router } from '@angular/router';
import { SortOrderService } from '../../../_services/front/sort-order.service';

@Component({
  selector: 'flower-valley-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  providers: [DialogService],
})
export class VideoComponent implements OnInit {
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public videos: Video[] = [];
  public textHidden: { id: number; isHidden: boolean }[] = [];
  constructor(
    private ds: DialogService,
    private ms: MessageService,
    private cs: ConfirmationService,
    private videoService: VideoService,
    private sortOrder: SortOrderService<Video>,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.videos.map((video) => {
      this.textHidden.push({
        id: video.id,
        isHidden: true,
      });
    });
  }

  public getHidden(id: number): boolean | undefined {
    return this.textHidden.find((item) => item.id === id)?.isHidden;
  }

  public hiddenToggle(id: number): void {
    const element = this.textHidden.find((item) => item.id === id);
    if (element) element.isHidden = !element.isHidden;
  }

  public editVideo(id: number): void {
    this.router.navigate(['admin/edit/video', id]);
  }

  public deleteVideo(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление ссылки',
      message: 'Вы действительно хотите удалить ссылку на видео?',
      accept: () => {
        this.videoService.deleteItem(id).subscribe(() => {
          const index = this.videos.findIndex((video) => video.id === id);
          this.videos.splice(index, 1);
          this.ms.add({
            severity: 'success',
            summary: 'Запрос выполнен',
            detail: 'Ссылка на видео успешно удалена',
          });
        });
      },
    });
  }

  public dragStart(draggedItem: Video, i: number): void {
    this.sortOrder.dragStart(this.videos, draggedItem, i);
  }
  public dragEnd(): void {
    this.videos = this.sortOrder.dragEnd(this.videos);
  }
  public drop(): void {
    this.videoService.setOrder(this.sortOrder.drop(this.videos)).subscribe();
  }
  public setPosition(index: number): void {
    this.videos = this.sortOrder.setPosition(this.videos, index);
  }
}
