import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'ngx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() formats: string[] = []; // acceptable file formats
  @Input() maximum_file_count: number = 1; // maximum number of upload file count
  @Input() maximum_file_limit: number = 100; // maximum upload file limit in Mega Bites

  @Output() fileChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileUploadDropbox', { static: false }) dropbox: ElementRef | undefined;
  @ViewChild('fileUploadField', { static: false }) upload_field: ElementRef | undefined;

  invalid_init: boolean = false;
  is_dragging: boolean = false;
  drag_counter: number = 0;
  files: any[] = [];
  has_errors: boolean = false;
  ERRORS = {
    FORMAT: {
      status: false,
      message: '',
    },
    MAX_COUNT: {
      status: false,
      message: '',
    },
    MAX_LIMIT: {
      status: false,
      message: '',
    }
  };

  // file upload dropbox events
  private unlistenClick: (() => void) | undefined;
  private unlistenDragEnter: (() => void) | undefined;
  private unlistenDragLeave: (() => void) | undefined;
  private unlistenDragOver: (() => void) | undefined;
  private unlistenDrop: (() => void) | undefined;

  constructor(private renderer2: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const dropbox_el = this.dropbox?.nativeElement;
    this.unlistenClick = this.renderer2.listen(dropbox_el, 'click', this.onClick.bind(this));
    this.unlistenDragEnter = this.renderer2.listen(dropbox_el, 'dragenter', this.onDragEnter.bind(this));
    this.unlistenDragLeave = this.renderer2.listen(dropbox_el, 'dragleave', this.onDragLeave.bind(this));
    this.unlistenDragOver = this.renderer2.listen(dropbox_el, 'dragover', this.onDragOver);
    this.unlistenDrop = this.renderer2.listen(dropbox_el, 'drop', this.onDrop.bind(this));

    this.ERRORS.FORMAT.message = `Allowed file formats are ${this.formats.join(', ')}.`;
    this.ERRORS.MAX_COUNT.message = `Maximum of ${this.maximum_file_count} files are allowed.`;
    this.ERRORS.MAX_LIMIT.message = `Maximum upload limit is ${this.maximum_file_limit} MB.`;

  }

  ngOnDestroy(): void {
    this.unlistenClick!();
    this.unlistenDragEnter!();
    this.unlistenDragLeave!();
    this.unlistenDragOver!();
    this.unlistenDrop!();

  }

  onClick(event: any) {
    event.stopPropagation();
    this.upload_field?.nativeElement.click();

  }

  onDragEnter(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.drag_counter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      this.is_dragging = true;
    }

  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.drag_counter--;
    if (this.drag_counter > 0) {
      return;
    }
    this.is_dragging = false;

  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();

  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files && files.length > 0 ) {
      this.is_dragging = false;
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
      this.validateInput(this.files);
    }

  }

  validateInput(files: any[]) {
    let error_count_1: number = 0;
    let error_count_2: number = 0;
    let sum_size: number = 0;

    // check upload number of file count
    if (files.length > this.maximum_file_count) {
      this.ERRORS.MAX_COUNT.status = true;
      error_count_1++;
    } else {
      this.ERRORS.MAX_COUNT.status = false;
    }

    // check file limit
    this.files.forEach(f => {
      sum_size += f.size;
      if (!this.formats.includes(f.type.split('/').slice(-1).pop())) {
        error_count_2++;
      }
    });

    if (sum_size > this.maximum_file_limit * (10 ** 6)) {
      this.ERRORS.MAX_LIMIT.status = true;
      error_count_1++;
    } else {
      this.ERRORS.MAX_LIMIT.status = false;
    }

    // check file formats
    if (this.formats && this.formats.length > 0) {
      if (error_count_2 > 0) {
        this.ERRORS.FORMAT.status = true;
        error_count_1++;
      } else {
        this.ERRORS.FORMAT.status = false;
      }
    }

    if (error_count_1 > 0) {
      this.has_errors = true;
      this.fileChange.emit(null);
      return;
    } else {
      this.has_errors = false;
      if (this.maximum_file_count > 1) {
        this.fileChange.emit(files);
      } else {
        this.fileChange.emit(files[0]);
      }
    }

  }

  formatFileSize(size: number) {
    let formated_size = '';

    if (size > 10 ** 9) {
      formated_size = (size / 10 ** 9).toFixed(2).toString() + ' GB';
    } else if (size > 10 ** 6) {
      formated_size = (size / 10 ** 6).toFixed(2).toString() + ' MB';
    } else if (size > 10 ** 3) {
      formated_size = (size / 10 ** 3).toFixed(2).toString() + ' KB';
    } else {
      formated_size = size.toFixed(2).toString() + ' Bytes';
    }

    return formated_size;

  }

  onRemoveFile(event: any, index: number) {
    event.stopPropagation();
    // this.files.splice(index, 1);
    this.files=[]
    this.validateInput(this.files);
  }

  onFileChange(event: any) {
    console.log(event)
    const files = event.target.files;
console.log(files.length)
    if (files  && files.length < 2 && this.files.length< 1) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }

      this.validateInput(this.files);
    }

  }

}
