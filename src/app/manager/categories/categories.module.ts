import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { MatTableModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatPaginatorModule, MatRippleModule, MatTabsModule } from '@angular/material';
import { CategoriesComponent } from './categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CategoryRegistryComponent } from './category-registry/category-registry.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FuseSharedModule,
    MatProgressBarModule,
    FuseConfirmDialogModule,
    MatRippleModule,
    MatTabsModule
  ],
  entryComponents: [
    CategoryRegistryComponent,
    FuseConfirmDialogComponent
  ],
  declarations: [
    CategoriesComponent,
    CategoryRegistryComponent,
    CategoryComponent
  ]
})
export class CategoriesModule { }
