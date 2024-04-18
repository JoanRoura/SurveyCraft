import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSurveyComponent } from './pages/home-survey/home-survey.component';
import { ListSurveyComponent } from './pages/list-survey/list-survey.component';
import { AnswerSurveyComponent } from './pages/answer-survey/answer-survey.component';

const routes: Routes = [
  {
    path: '',
    component: HomeSurveyComponent,
    children: [
      {
        path: 'list-survey',
        component: ListSurveyComponent
      },
      {
        path: 'answer-survey/:id',
        component: AnswerSurveyComponent
      },
      {
        path: '**',
        redirectTo: 'list-survey'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
