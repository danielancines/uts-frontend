import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    FuseSharedModule
  ],
  exports: [
    MatExpansionModule,
    MatIconModule,
    FuseSharedModule]
})
export class SharedModule { }
