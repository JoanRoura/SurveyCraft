import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { CrudSurveyComponent } from './pages/crud-survey/crud-survey.component';
import { CrudUserComponent } from './pages/crud-user/crud-user.component';
import { CrudQuestionComponent } from './pages/crud-question/crud-question.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      {
        path: 'user',
        component: CrudUserComponent
      },
      {
        path: 'survey',
        component: CrudSurveyComponent
      },
      {
        path: 'question',
        component: CrudQuestionComponent
      },
      {
        path: '**',
        redirectTo: 'user'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
