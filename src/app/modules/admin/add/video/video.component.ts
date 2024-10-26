import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from '../../../../_services/back/video.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Video } from '../../../../_models/video';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
  public videoGroup: FormGroup;
  public isLinkCopied: boolean = false;
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder, private videoService: VideoService, private router: Router) {
    this.videoGroup = fb.group({
      src: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public addVideo(): void {
    if (isFormInvalid(this.videoGroup)) return;
    this.isLoading = true;
    const video = this.videoGroup.getRawValue();
    this.videoService.addItem<Video>(video).subscribe(() => {
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
