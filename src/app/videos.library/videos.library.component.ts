import { GroupsService } from './../manager/groups/groups.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as portuguese } from './i18n/pt';
import { CategoriesService } from '../manager/categories/categories.service';
import { ICategory } from '../manager/categories/category.model';
import { UsersService } from '../manager/users/users.service';
import { AuthenticationService } from '../auth/authentication.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { IFilterGroup } from 'app/controls/filter/model/group.model';
import { IFilterOption } from 'app/controls/filter/model/option.model';
import { CookieService } from 'ngx-cookie-service';
import { QueryHelper } from 'app/controls/filter/helper/query.helper';
import { HttpParams } from '@angular/common/http';
import { IGroup } from 'app/manager/groups/group.model';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.library.component.html',
  styleUrls: ['./videos.library.component.scss'],
  animations: fuseAnimations
})
export class VideosLibraryComponent implements OnInit {
  test: string;
  items: any[];
  categories: ICategory[];
  groups: IGroup[];
  searchTerm: String = '';
  loading: Boolean = false;
  selectedCategory: ICategory;
  selectedGroup: IGroup;
  filterGroups: IFilterGroup[] = [];
  selectedFilterOptions: IFilterOption[];

  private _videoLibraryFilterOptions = 'videoLibraryFilterOptions';
  private _queryHelper: QueryHelper = new QueryHelper();

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _categoriesService: CategoriesService,
    private _groupsService: GroupsService,
    private _usersService: UsersService,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _cookieService: CookieService,
    private _translateService: TranslateService) {
    this._fuseTranslationLoaderService.loadTranslations(english, portuguese);
  }

  ngOnInit(): void {
    this.loadData();
  }

  filterVideosByCategory(category: ICategory): void {
    if (!category || !category._id) {
      this.loadVideos();
    } else {
      this.loadVideosByCategory(category._id);
    }
  }

  filterVideosByGroup(group: IGroup): void {
    if (!group || !group._id) {
      this.loadVideos();
    } else {
      this.loadVideosByGroup(group._id);
    }
  }

  filterVideosByTerm(): void {
    if (this.searchTerm){
      this.loadVideosByTerm(this.searchTerm);
    } else {
      this.loadVideos();
    }
  }

  onKeyUp(event: any): void {
    if (_.isEqual(event.key, 'Enter')) {
      this.filterVideosByTerm();
    } else if (_.includes(['Delete', 'Backspace'], event.key)) {
      if (_.isEmpty(this.searchTerm)) { this.loadVideos(); }
      else { this.filterVideosByTerm(); }
    }
  }

  loadVideosByTerm(term): void {
    this.selectedCategory = null;
    this.selectedGroup = null;
    this.loading = true;

    const params = this._queryHelper.optionsToQueryParams(this.selectedFilterOptions);   
    this._usersService.getVideosByTerm(this._authenticationService.user._id, term, params)
      .subscribe(data => {
        this.items = data;
        this.loading = false;
      });
  }

  loadVideosByCategory(id): void {
    this.searchTerm = '';
    this.loading = true;
    const params = this._queryHelper.optionsToQueryParams(this.selectedFilterOptions);   
    this._usersService.getVideosByCategory(this._authenticationService.user._id, id, params)
      .subscribe(data => {
        this.items = data;
        this.loading = false;
      });
  }

  loadVideos(): Promise<void> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this._usersService.getVideos(this._authenticationService.user._id, this._queryHelper.optionsToQueryParams(this.selectedFilterOptions))
        .subscribe(response => {
          this.items = response.data;
          this.loading = false;
          resolve();
        });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._categoriesService.get('?orderBy=name')
        .subscribe(categories => {
          this.categories = categories.data;
          resolve();
        });
    });
  }

  // tslint:disable-next-line:typedef
  async loadData() {
    if (this._cookieService.check(this._videoLibraryFilterOptions)){
      this.selectedFilterOptions = <IFilterOption[]>JSON.parse(this._cookieService.get(this._videoLibraryFilterOptions));
    }
    
    this.loadFilterGroups();
    this.loading = true;
    await Promise.all([this.loadVideos(), this.loadCategories(), this.loadGroups()]);
    this.loading = false;
  }

  startVideo(videoId: string): void {
    this._router.navigate([`watchvideo/${videoId}`]);
  }

  optionSelected(selectedOptions: IFilterOption[]): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedGroup = null;
    this.selectedFilterOptions = selectedOptions;
    this._cookieService.set(this._videoLibraryFilterOptions, JSON.stringify(selectedOptions));
    this.loadVideos();
  }

  private loadGroups(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._groupsService.get('?orderBy=name')
        .subscribe(groups => {
          this.groups = groups.data;
          resolve();
        });
    });
  }

  private loadVideosByGroup(id): void {
    this.searchTerm = '';
    this.loading = true;
    const params = this._queryHelper.optionsToQueryParams(this.selectedFilterOptions);   
    this._usersService.getVideosByGroup(this._authenticationService.user._id, id, params)
      .subscribe(data => {
        this.items = data;
        this.loading = false;
      });
  }

  private loadFilterGroups(): void {
    this._translateService.get('VIDEOS_LIBRARY_MAIN.FILTER_OPTIONS')
    .subscribe(translation => {
      this.filterGroups.push(
        <IFilterGroup>{
          name: translation.CLASSIFY_BY.TITLE,
          options: [
            <IFilterOption>{
              name: translation.CLASSIFY_BY.BY_NAME,
              query: {
                operation: 'orderBy',
                value: 'name'
              }
            },
            <IFilterOption>{
              name: translation.CLASSIFY_BY.BY_ADD_DATE,
              query: {
                operation: 'orderBy',
                value: 'date'
              }
            }
          ]
        },
        <IFilterGroup>{
          name: translation.LIST.TITLE,
          options: [
            <IFilterOption>{
              name: translation.LIST.USER_CAN_WATCH,
              query: {
                operation: 'userCanWatch',
                value: 'true'
              }
            },
            <IFilterOption>{
              name: translation.LIST.WATCHED,
              query: {
                operation: 'watched',
                value: 'true'
              }
            },
            <IFilterOption>{
              name: translation.LIST.NOT_WATCHED,
              query: {
                operation: 'watched',
                value: 'false'
              }
            },
            <IFilterOption>{
              name: translation.LIST.FAVORITES,
              query: {
                operation: 'favorites',
                value: 'true'
              }
            }
          ]
        });
    });
  }
}
