import { VideosService } from 'app/manager/videos/videos.service';
import { Component, OnInit } from '@angular/core';
import { IVideo } from '../video.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'app/manager/users/user.model';
import { ICategory } from 'app/manager/categories/category.model';
import { IGroup } from 'app/manager/groups/group.model';
import { CategoriesService } from 'app/manager/categories/categories.service';
import { GroupsService } from 'app/manager/groups/groups.service';
import { UsersService } from 'app/manager/users/users.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { fuseAnimations } from '@fuse/animations';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { IEmailData } from 'app/shared/model/IEmailData';
import { EmailService } from 'app/shared/email.service';
import { ComponentBase } from 'app/shared/base/ComponentBase';
import { Location } from '@angular/common';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  animations: fuseAnimations
})
export class VideoComponent extends ComponentBase implements OnInit {
  video: IVideo = this.getNewVideo();
  videoId: string;
  videoForm: FormGroup;
  editing: Boolean = false;
  filteredUsers: Observable<IUser[]>;
  categories: ICategory[] = [];
  groups: IGroup[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _categoriesService: CategoriesService,
    private _groupsService: GroupsService,
    private _userService: UsersService,
    private _videoService: VideosService,
    private _messageService: MessageService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _emailService: EmailService,
    private _location: Location
  ) { 
    super();
  }

  ngOnInit() {
    this.videoId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.videoId ? true : false;
    this.videoForm = this.createVideoForm();

    if (this.videoId) {
      this.loadVideo();
    } else {
      this.createFormAndLoadData();
    }
  }

  addVideo() {
    if (!this.validateForm(this.videoForm)) {
      this._messageService.showMessage(MessageType.Error, 'VIDEOS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._videoService.add(this.videoForm.getRawValue())
      .subscribe((newvideo: IVideo) => {
        this._messageService.showMessage(MessageType.Success, 'VIDEOS_MAIN.INSERT_MESSAGES.SUCCESS', '');
        this.sendEmails(newvideo);
        this.back();
      });
  }

  saveVideo(){
    if (!this.validateForm(this.videoForm)) {
      this._messageService.showMessage(MessageType.Error, 'VIDEOS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._videoService.update(this.videoForm.getRawValue())
    .subscribe((response) => {
      this._messageService.showMessage(MessageType.Success, 'VIDEOS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
      this.back();
    });
  }

  deleteVideo(video: IVideo) {
    this._rolesValidatorService.validate(Roles.DeleteVideo, 'VIDEOS_ERRORS.DELETE_VIDEO.MESSAGE', 'VIDEOS_ERRORS.DELETE_VIDEO.TITLE')
      .subscribe(result => {
        if (!result) return;

        this._translateService
          .get('GLOBAL.DELETE_QUESTION_MESSAGE')
          .subscribe(translation => {
            this.confirmDialogRef = this._dialog.open(ConfirmDialogComponent, {
              disableClose: false
            });

            this.confirmDialogRef.componentInstance.confirmMessage = translation.MESSAGE;
            this.confirmDialogRef.componentInstance.title = translation.TITLE;
            this.confirmDialogRef.componentInstance.confirmButtonText = translation.CONFIRM_BUTTON_TEXT;
            this.confirmDialogRef.componentInstance.cancelButtonText = translation.CANCEL_BUTTON_TEXT;

            this.confirmDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._videoService.delete(video)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'VIDEOS_MAIN.DELETE_MESSAGES.SUCCESS', '');
                    this.back();
                  });
              }
              this.confirmDialogRef = null;
            });
          });
      });
  }

  displayInstructorName(user?: IUser): string | undefined {
    return user ? `${user.name} ${user.lastName}` : undefined;
  }

  private back(){
    this._location.back();
  }

  private createFormAndLoadData() {
    this.videoForm = this.createVideoForm();
    this.filteredUsers = this._userService.get('?limit=10&orderBy=name')
      .pipe(
        map(response => response.data));

    this._categoriesService.get()
      .subscribe(
        (categories) => {
          this.categories = categories.data;
          this.updateSelectedCategory();
        }
      );

    this._groupsService.get()
      .subscribe(
        response => {
          this.groups = response.data;
          this.updateSelectedGroup();
        }
      );

    this.videoForm.get('instructor').valueChanges
      .pipe(
        map(value => _.isEmpty(value) ? this._userService.get('?limit=10&orderBy=name').pipe(map(response => response.data)) : this._userService.get(`?name=~${value}&orderBy=name`).pipe(map(response => response.data)))
      )
      .subscribe(users => {
        this.filteredUsers = users;
      });
  }

  private loadVideo() {
    this._videoService.getById(this.videoId)
      .subscribe(video => {
        this.video = video;
        this.createFormAndLoadData();
      }, error => {

      })
  }

  private updateSelectedGroup() {
    if (!this.video || !this.video.group)
      return;
    const selectedGroup = this.groups.find(c => c._id === this.video.group._id);
    this.videoForm.patchValue({ group: selectedGroup });
  }

  private updateSelectedCategory() {
    if (!this.video || !this.video.category)
      return;
    const selectedCategory = this.categories.find(c => c._id === this.video.category._id);
    this.videoForm.patchValue({ category: selectedCategory });
  }

  private createVideoForm(): FormGroup {
    return this._formBuilder.group({
      _id: [this.video._id],
      name: [this.video.name, [Validators.required, Validators.minLength(5)]],
      category: [this.video.category, [Validators.required]],
      group: [this.video.group, [Validators.required]],
      duration: [this.video.duration, [Validators.required, Validators.pattern("^[0-9]*$")]],
      description: [this.video.description],
      url: [this.video.url],
      details: [this.video.details],
      instructor: [this.video.instructor, [Validators.required]]
    });
  }

  private getNewVideo(): IVideo {
    const newVideo: IVideo = {
      _id: '',
      name: '',
      category: null,
      group: null,
      duration: 0,
      description: '',
      url: '',
      instructor: null,
      date: null,
      details: ''
    };

    return newVideo;
  }

  private sendEmails(newVideo: IVideo) {
    const baseUrl = location.href.replace('/videos/new', '/watchvideo');
    const emailData: IEmailData = {
      message: `<p><b>Título:</b> <a href="${baseUrl}/${newVideo._id}">${newVideo.name}</a></p>
      <p><b>Descrição:</b> ${newVideo.description}</p><br>
      <p>*Sujeito a liberação por parte do administrador</p>`,
      subject: 'Novo vídeo disponível na sua biblioteca!'
    };

    this._emailService.sendEmailToAllActiveUsers(emailData).subscribe();
  }
}
