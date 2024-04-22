import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { CrudQuestionComponent } from './pages/crud-question/crud-question.component';
import { CrudSurveyComponent } from './pages/crud-survey/crud-survey.component';
import { CrudUserComponent } from './pages/crud-user/crud-user.component';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminHomeComponent,
    CrudQuestionComponent,
    CrudSurveyComponent,
    CrudUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule,
    SharedModule,
    HttpClientModule,
    FormsModule
  ]
})
export class AdminModule { }
