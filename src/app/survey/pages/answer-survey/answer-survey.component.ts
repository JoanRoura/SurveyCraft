import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Question } from '../../interfaces/question.interface';
import { QuestionService } from '../../services/question.service';
import { Survey } from '../../interfaces/survey.interface';
import { SurveyService } from '../../services/survey.service';
import { AnswerService } from '../../services/answer.service';
import { Answer } from '../../interfaces/answer.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.css'],
  providers: [MessageService]
})
export class AnswerSurveyComponent {

  surveyId!: number;
  survey!: Survey;
  questions!: Question[];
  surveyForm!: FormGroup;
  answersData!: Answer[];
  dropdownItems: any[] = []; // Objeto para almacenar las opciones de cada pregunta
  selectedOption: { [key: number]: any } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private surveyService: SurveyService,
    private answerService: AnswerService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.answerService.getOptionAnswers(3)
      .subscribe(resp => {
        // console.log(resp);
      })

    this.activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];

      this.surveyService.getSurvey(this.surveyId)
        .subscribe(survey => {
          this.survey = survey;
        });

      this.questionService.getQuestionsBySurvey(this.surveyId)
        .subscribe(questions => {
          this.questions = questions;

          this.loadOptionAnswersForOptionQuestions();
          this.buildSurveyForm();
        });
    });
  }

  loadOptionAnswersForOptionQuestions() {
    this.questions.forEach(question => {
      if (question.idQuestionType === 3) {
        this.loadOptionAnswers(question.id!);
      }
    });
  }

  loadOptionAnswers(idQuestion: number) {
    this.answerService.getOptionAnswers(idQuestion).subscribe(options => {
      this.dropdownItems[idQuestion] = options.map(option => ({ label: option.answer!, value: option.answer! }));
      this.selectedOption[idQuestion] = this.dropdownItems[idQuestion][0].value; // Asignar el primer elemento como valor inicial
    });
  }

  buildSurveyForm() {
    const formControls: { [key: string]: AbstractControl } = {};

    this.questions.forEach(question => {
      if (question.idQuestionType === 1 || question.idQuestionType === 2) {
        formControls[question.id!.toString()] = new FormControl('', Validators.required);
      } else if (question.idQuestionType === 3) {

      } else if (question.idQuestionType === 4) {
        formControls[question.id!.toString()] = new FormControl(0, Validators.required); // Valor inicial del slider
      }
    });

    this.surveyForm = this.formBuilder.group(formControls);
  }

  submitSurvey() {
    const allFormValues = {
      ...this.surveyForm.value,
      ...this.selectedOption
    };
    const totalAnswers = Object.keys(allFormValues).length;
    let successCounter = 0;

    console.log('Form Values:', allFormValues); // Registro de depuración

    Object.keys(allFormValues).forEach(key => {
      const questionId = parseInt(key);

      let answerValue = allFormValues[key];
      // Si la pregunta es de tipo slider, convierte el valor a string
      if (this.questions.find(q => q.id === questionId)?.idQuestionType === 4) {
        answerValue = answerValue.toString();
      }

      const answerData: Answer = {
        answer: answerValue,
        answeredDate: new Date().toISOString(),
        idQuestion: questionId
      };

      console.log('Answer Data:', answerData); // Registro de depuración

      this.answerService.createAnswer(answerData).subscribe({
        next: () => {
          console.log('Respuesta almacenada correctamente');
          successCounter++;

          if (successCounter === totalAnswers) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Saved' });
            this.surveyForm.reset();
          }
        },
        error: error => {
          console.error('Error al almacenar la respuesta:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Saving Form' });
        }
      });
    });
  }

  updateSliderValue(questionId: number, value: number) {
    this.surveyForm.controls[questionId.toString()].setValue(value);
  }
}
