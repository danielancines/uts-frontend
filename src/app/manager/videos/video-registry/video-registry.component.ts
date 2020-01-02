import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IVideo } from '../video.model';
import { ICategory } from '../../categories/category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { GroupsService } from '../../groups/groups.service';
import { IGroup } from '../../groups/group.model';
import { IUser } from 'app/manager/users/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'app/manager/users/users.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-video-registry',
  templateUrl: './video-registry.component.html',
  styleUrls: ['./video-registry.component.scss']
})
export class VideoRegistryComponent implements OnInit {
  videoForm: FormGroup;
  dialogTitle: string = 'Vídeos';
  categories: ICategory[] = [];
  groups: IGroup[] = [];
  editing: Boolean = false;
  filteredUsers: Observable<IUser[]>;

  constructor(
    public _dialogRef: MatDialogRef<VideoRegistryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVideo,
    private _formBuilder: FormBuilder,
    private _categoriesService: CategoriesService,
    private _groupsService: GroupsService,
    private _userService: UsersService
  ) {
    this.videoForm = this.createVideoForm();
  }

  ngOnInit() {
    this.filteredUsers = this._userService.get('?limit=10&orderBy=name').pipe(map(response => response.data));
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

    this.editing = this.data._id ? true : false;
  }

  updateSelectedGroup() {
    if (!this.data || !this.data.group)
      return;
    const selectedGroup = this.groups.find(c => c._id === this.data.group._id);
    this.videoForm.patchValue({ group: selectedGroup });
  }

  updateSelectedCategory() {
    if (!this.data || !this.data.category)
      return;
    const selectedCategory = this.categories.find(c => c._id === this.data.category._id);
    this.videoForm.patchValue({ category: selectedCategory });
  }

  createVideoForm(): FormGroup {
    return this._formBuilder.group({
      _id: [this.data._id],
      name: [this.data.name, [Validators.required, Validators.minLength(5)]],
      category: [this.data.category],
      group: [this.data.group],
      duration: [this.data.duration],
      description: [this.data.description],
      url: [this.data.url],
      details: [this.data.details],
      instructor: [this.data.instructor]
    });
  }

  displayInstructorName(user?: IUser): string | undefined {
    return user ? `${user.name} ${user.lastName}` : undefined;
  }
}
