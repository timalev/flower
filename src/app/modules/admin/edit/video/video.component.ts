import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from '../../../../_services/back/video.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Video } from '../../../../_models/video';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  public videoGroup: FormGroup;
  private videoId: number = 0;
  public isLinkCopied: boolean = false;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private router: Router,
    private route: ActivatedRoute,
    private ls: LoadingService,
  ) {
    this.videoGroup = fb.group({
      id: [''],
      src: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    route.params.subscribe((params) => {
      this.videoId = params['id'];
    });
  }

  public ngOnInit(): void {
    const sub = this.videoService.getItemById<Video>(this.videoId).subscribe((video) => {
      this.videoGroup.patchValue(video);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public editVideo(): void {
    if (isFormInvalid(this.videoGroup)) return;
    this.isLoading = true;
    const video = this.videoGroup.getRawValue();
    this.videoService.updateItem<Video>(video).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([''], { fragment: 'video' });
    });
  }

  public convertLink(link: string): void {
    if (link && link.includes('youtu.be')) {
      link = link.replace('.be', 'be.com/embed');
    } else if (!link) {
      this.isLinkCopied = false;
    }
    this.isLinkCopied = true;
    this.videoGroup.get('src')?.setValue(link);
  }
}
