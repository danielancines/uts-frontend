import { CategoryComponent } from './category/category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { Roles } from 'app/auth/roles';
import { CategoriesComponent } from './categories.component';

const routes: Routes = [{
  path: 'categories',
  component: CategoriesComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.AccessCategories,
    errorMessageKey: 'CATEGORIES_ERRORS.ACCESS_CATEGORY.MESSAGE',
    errorTitleKey: 'CATEGORIES_ERRORS.ACCESS_CATEGORY.TITLE'
  }
},
{
  path: 'categories/new',
  component: CategoryComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.InsertCategory,
    errorMessageKey: 'CATEGORIES_ERRORS.INSERT_CATEGORY.MESSAGE',
    errorTitleKey: 'CATEGORIES_ERRORS.INSERT_CATEGORY.TITLE'
  }
},
{
  path: 'categories/:id',
  component: CategoryComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.UpdateCategory,
    errorMessageKey: 'CATEGORIES_ERRORS.UPDATE_CATEGORY.MESSAGE',
    errorTitleKey: 'CATEGORIES_ERRORS.UPDATE_CATEGORY.TITLE'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
