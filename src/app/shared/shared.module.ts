import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatIconModule } from '@angular/material';
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
