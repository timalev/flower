import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
// @ts-ignore
import watermark from 'watermarkjs/dist/watermark';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { StaticDataService } from '../../_services/back/static-data.service';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'flower-valley-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
  providers: [NgxImageCompressService],
})
export class FilesUploadComponent {
  @ViewChild('fileUpload')
  public fileUpload: FileUpload | undefined;
  @Input()
  public multi: boolean = true;
  @Input()
  public label: string = 'Загрузить изображения';
  @Input()
  public showOnlyButton: boolean = false;
  @Input()
  public autoUpload: boolean = false;
  @Output()
  public uploaded: EventEmitter<File[]> = new EventEmitter<File[]>();
  public localUrl: string[] = [];
  public localCompressedUrl: string[] = [];
  private compressedFiles: File[] = [];
  public isWatermark: boolean = false;
  public isUploadingProcess: boolean = false;
  private initialFiles: File[] = [];
  constructor(
    private imageCompress: NgxImageCompressService,
    private staticData: StaticDataService,
  ) {}

  public async uploadFiles(files: File[]): Promise<void> {
    this.initialFiles = files;
    files.map((file) => {
      this.genLocalUrl(file);
    });
    this.fileUpload?.clear();
  }

  public setWatermark(file: File, logoUrl?: string): Promise<Blob> {
    return watermark([file, logoUrl ? logoUrl : 'assets/images/logo.png']).blob(
      (img: any, logo: any) => {
        let context = img.getContext('2d');
        context.save();
        context.globalAlpha = 0.7;
        const logoHeight = img.height * 0.25;
        context.drawImage(logo, 10, 10, logoHeight, logoHeight * 0.8237);

        context.restore();
        return img;
      },
    );
  }

  public removeImage(i: number): void {
    this.localUrl.splice(i, 1);
    this.localCompressedUrl.splice(i, 1);
    this.compressedFiles.splice(i, 1);
    this.uploaded.emit(this.compressedFiles);
  }

  private genLocalUrl(file: File) {
    this.isUploadingProcess = true;
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (!this.multi && this.localUrl.length) {
        this.localUrl = [event.target.result];
      } else {
        this.localUrl = this.localUrl.concat(event.target.result);
      }
      this.compressFile(event.target.result, fileName);
    };
    reader.readAsDataURL(file);
  }
  private async compressFile(image: string, fileName: string) {
    let orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 100).then(async (result) => {
      let file = new File([this.dataURItoBlob(result.split(',')[1])], fileName);
      if (this.isWatermark) {
        const logo$ = this.staticData.getLogo();
        const { img } = await lastValueFrom(logo$);
        const watermarked = await (environment.production
          ? this.setWatermark(file, img)
          : this.setWatermark(file));
        const reader = new FileReader();
        reader.onload = (event: any) => {
          file = new File([watermarked], fileName);
          this.uploadEmit(file, event.target.result);
        };
        reader.readAsDataURL(watermarked);
      } else {
        this.uploadEmit(file, result);
      }
    });
  }

  private uploadEmit(file: File, result: string): void {
    if (!this.multi && this.localUrl.length) {
      this.localCompressedUrl = [result];
      this.compressedFiles = [file];
    } else {
      this.localCompressedUrl = this.localCompressedUrl.concat(result);
      this.compressedFiles = this.compressedFiles.concat(file);
    }
    if (this.autoUpload) {
      if (this.compressedFiles.length === this.initialFiles.length) {
        this.isUploadingProcess = false;
        this.uploaded.emit(this.compressedFiles);
        this.localUrl = [];
        this.localCompressedUrl = [];
        this.compressedFiles = [];
      }
    } else {
      this.isUploadingProcess = false;
      this.uploaded.emit(this.compressedFiles);
    }
  }

  private dataURItoBlob(dataURI: DataUrl): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
