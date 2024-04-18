import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SurveyRoutingModule } from './survey-routing.module';
import { AnswerSurveyComponent } from './pages/answer-survey/answer-survey.component';
import { HomeSurveyComponent } from './pages/home-survey/home-survey.component';
import { ListSurveyComponent } from './pages/list-survey/list-survey.component';
import { PrimengModule } from '../primeng/primeng.module';


@NgModule({
  declarations: [
    AnswerSurveyComponent,
    HomeSurveyComponent,
    ListSurveyComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SurveyModule { }
