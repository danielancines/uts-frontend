import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IVideo } from './video.model';
import { MatDialog, MatTable, MatDialogRef, MatPaginator } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { VideosService } from './videos.service';
import { Roles } from 'app/auth/roles';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  animations: fuseAnimations
})
export class VideosComponent implements AfterViewInit, OnInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?populate=category&populate=group&populate=instructor&orderBy=name';
  dataSource: CustomDataSource;
  videos: IVideo[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  searchTerm: string = '';
  loading: Boolean;
  videosCount: number = 0;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _videosServices: VideosService,
    private _rolesValidatorService: RolesValidatorService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscribePaginator();

    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._videosServices,
        this._translateService,
        this._intialQueryString
      );
      
      this.dataSource.addColumns(['name', 'group', 'category', 'url']);
    });
  }

  add() {
    this._rolesValidatorService.validate(Roles.InsertVideo, 'VIDEOS_ERRORS.INSERT_VIDEO.MESSAGE', 'VIDEOS_ERRORS.INSERT_VIDEO.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/videos/new']);
      });
  }

  edit(video: IVideo) {
    this._rolesValidatorService.validate(Roles.UpdateVideo, 'VIDEOS_ERRORS.UPDATE_VIDEO.MESSAGE', 'VIDEOS_ERRORS.UPDATE_VIDEO.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/videos/${video._id}`]);

      });

  }

  refresh() {
    this.searchTerm = '';
    this.dataSource.refresh();
  }

  startVideo(videoId: string) {
    this._router.navigate([`watchvideo/${videoId}`]);
  }

  applyFilter(term) {
    this.searchTerm = term;
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => {
      this.dataSource.refresh([{ key: 'name', value: term }]);
    }, 550);
  }

  private subscribePaginator() {
    this.paginator.pageIndex = parseInt(this._activatedRoute.snapshot.queryParamMap.get('page'));
    this.paginator.page
      .pipe(
        tap(() => {
          if (this.paginator.pageIndex && this.paginator.pageIndex > 0)
            this._router.navigate(['/videos'], { queryParams: { page: this.paginator.pageIndex } });
          else
            this._router.navigate(['/videos']);
        })).subscribe();
  }
}