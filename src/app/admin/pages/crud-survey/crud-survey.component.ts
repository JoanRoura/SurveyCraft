import { Component } from '@angular/core';
import { Survey } from '../../../survey/interfaces/survey.interface';
import { SurveyService } from '../../../survey/services/survey.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-crud-survey',
  templateUrl: './crud-survey.component.html',
  styleUrl: './crud-survey.component.css',
  providers: [MessageService]
})
export class CrudSurveyComponent {

  currentUser!: User;

  users!: User[];

  selectedUserSurvey!: User;

  loadingSurveys: boolean = true;

  surveyDialog: boolean = false;

  deleteSurveyDialog: boolean = false;

  deleteSurveysDialog: boolean = false;

  surveys: Survey[] = [];

  survey: Survey = {};

  surveytmp: Survey = {};

  selectedSurveys: Survey[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private surveyService: SurveyService,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser = this.currentUser;

    console.log(this.currentUser);

    this.surveyService.getSurveys().subscribe(surveys => {
      console.log(surveys);
      this.loadingSurveys = false;
      this.surveys = surveys;
    });

    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        console.log(this.users);
      });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'descr', header: 'Name' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
    ];
  }

  openNew() {
    this.survey = {};
    this.submitted = false;
    this.surveyDialog = true;
  }

  deleteSelectedSurveys() {
    this.deleteSurveysDialog = true;
  }

  editSurvey(survey: Survey) {
    this.survey = { ...survey };
    this.surveyDialog = true;
  }

  deleteSurvey(survey: Survey) {
    this.deleteSurveyDialog = true;
    this.survey = { ...survey };
  }

  confirmDeleteSelected() {
    this.deleteSurveysDialog = false;

    const deletedSurveyIds: number[] = [];

    this.selectedSurveys.forEach(survey => {
      this.surveyService.deleteSurvey(survey.id!).subscribe({
        next: () => {
          deletedSurveyIds.push(survey.id!);
          this.surveys = this.surveys.filter(val => val.id !== survey.id);

          if (deletedSurveyIds.length === this.selectedSurveys.length) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Surveys Deleted', life: 3000 });
            this.selectedSurveys = [];
          }
        },
        error: error => {
          console.error('Error deleting survey:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete surveys', life: 3000 });
        }
      });
    });
  }

  confirmDelete() {
    this.deleteSurveyDialog = false;

    const surveyTmp = { ...this.survey };

    console.log({ surveyTmp });
    console.log(this.selectedUserSurvey);

    this.surveyService.deleteSurvey(this.survey.id!).subscribe({
      next: () => {
        this.surveys = this.surveys.filter(val => val.id !== surveyTmp.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Survey Deleted', life: 3000 });
      },
      error: error => {
        console.error('Error deleting survey:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete survey', life: 3000 });
      }
    });

    this.survey = {};
  }

  hideDialog() {
    this.surveyDialog = false;
    this.submitted = false;
  }

  saveSurvey() {
    this.submitted = true;

    if (this.survey.descr?.trim()) {
      // Hacer una copia de la encuesta antes de enviarla al servidor
      const surveyTmp = { ...this.survey };

      console.log(surveyTmp);

      console.log(this.selectedUserSurvey);

      if (this.survey.id) {
        this.surveyService.updateSurvey(this.survey.id, surveyTmp)
          .subscribe({
            next: (resp) => {

              this.surveys[this.findIndexById(surveyTmp.id!)] = surveyTmp;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Survey Updated', life: 3000 });
            },
            error: (error) => {
              console.error('Error updating survey:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update survey', life: 3000 });
            }
          });

      } else {
        this.surveyService.createSurvey(surveyTmp)
          .subscribe({
            next: (resp) => {
              console.log(resp);
              this.surveys.push({ ...surveyTmp });
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Survey Created', life: 3000 });

              // Aquí llamamos a la función para asignar la encuesta al usuario seleccionado
              this.surveyService.assignSurveyToUser(resp.id!, this.selectedUserSurvey.id!)
                .subscribe({
                  next: () => {
                    console.log('Survey assigned to user successfully');
                  },
                  error: (error) => {
                    console.error('Error assigning survey to user:', error);
                  }
                });
            },
            error: (error) => {
              console.error('Error creating survey:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create survey', life: 3000 });
            }
          });
      }

      this.surveyDialog = false;
      this.survey = {};
      this.submitted = false;
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.surveys.length; i++) {
      if (this.surveys[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    console.log(table, event);
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
