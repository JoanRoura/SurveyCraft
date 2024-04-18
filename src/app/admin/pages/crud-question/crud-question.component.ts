import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Question } from '../../../survey/interfaces/question.interface';
import { QuestionService } from '../../../survey/services/question.service';
import { Survey } from '../../../survey/interfaces/survey.interface';
import { SurveyService } from '../../../survey/services/survey.service';

@Component({
  selector: 'app-crud-question',
  templateUrl: './crud-question.component.html',
  styleUrls: ['./crud-question.component.css'],
  providers: [MessageService]
})
export class CrudQuestionComponent {

  surveys!: Survey[];

  selectedSurveyQuestion!: Survey;

  loadingQuestions: boolean = true;

  questionDialog: boolean = false;

  deleteQuestionDialog: boolean = false;

  deleteQuestionsDialog: boolean = false;

  questions: Question[] = [];

  question!: Question;

  selectedQuestions: Question[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private questionService: QuestionService, private surveyService: SurveyService, private messageService: MessageService) { }

  ngOnInit() {

    this.questionService.getQuestions().subscribe(questions => {
      console.log(questions);
      this.loadingQuestions = false;
      this.questions = questions
    });

    this.surveyService.getSurveys()
      .subscribe(surveys => {
        console.log(surveys);
        this.surveys = surveys;
      });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'question', header: 'Question' },
      { field: 'idQuestionType', header: 'Id Type ' },
    ];
  }

  openNew() {
    this.question = {};
    this.submitted = false;
    this.questionDialog = true;
  }

  deleteSelectedQuestions() {
    this.deleteQuestionsDialog = true;
  }

  editQuestion(question: Question) {
    this.question = { ...question };
    this.questionDialog = true;
  }

  deleteQuestion(question: Question) {
    this.deleteQuestionDialog = true;
    this.question = { ...question };
  }

  confirmDeleteSelected() {
    this.deleteQuestionsDialog = false;

    const deletedQuestionIds: number[] = [];

    this.selectedQuestions.forEach(question => {
      this.questionService.deleteQuestion(question.id!).subscribe({
        next: () => {
          deletedQuestionIds.push(question.id!);
          this.questions = this.questions.filter(val => val.id !== question.id);

          if (deletedQuestionIds.length === this.selectedQuestions.length) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Questions Deleted', life: 3000 });
            this.selectedQuestions = [];
          }
        },
        error: error => {
          console.error('Error deleting question:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete questions', life: 3000 });
        }
      });
    });
  }

  confirmDelete() {
    this.deleteQuestionDialog = false;

    const questionTmp = { ...this.question };

    console.log({ questionTmp });

    this.questionService.deleteQuestion(this.question.id!).subscribe({
      next: () => {
        this.questions = this.questions.filter(val => val.id !== questionTmp.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Deleted', life: 3000 });
      },
      error: error => {
        console.error('Error deleting question:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete question', life: 3000 });
      }
    });

    this.question = {};
  }

  hideDialog() {
    this.questionDialog = false;
    this.submitted = false;
  }

  saveQuestion() {

    this.submitted = true;

    if (this.question.question?.trim()) {
      // Hacer una copia del usuario antes de enviarlo al servidor
      const questionTmp = { ...this.question };

      if (this.question.id) {
        this.questionService.updateQuestion(this.question.id, questionTmp)
          .subscribe({
            next: (resp) => {
              this.questions[this.findIndexById(questionTmp.id!)] = questionTmp;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Updated', life: 3000 });
            },
            error: (error) => {
              console.error('Error updating question:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update question', life: 3000 });
            }
          });

      } else {
        this.questionService.createQuestion(questionTmp)
          .subscribe({
            next: (question) => {
              this.questions.push({ ...questionTmp });
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Question Created', life: 3000 });

               // Aquí llamamos a la función para asignar la encuesta al usuario seleccionado
               this.questionService.assignQuestionToSurvey(this.selectedSurveyQuestion.id!, question.id!)
               .subscribe({
                 next: () => {
                   console.log('Question assigned to survey successfully');
                 },
                 error: (error) => {
                   console.error('Error assigning question to survey:', error);
                 }
               });
            },
            error: (error) => {
              console.error('Error creating question:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create question', life: 3000 });
            }
          });
      }

      this.questionDialog = false;
      this.question = {};
      this.submitted = false;
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
