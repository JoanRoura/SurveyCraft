import { Component } from '@angular/core';
import { Survey } from '../../interfaces/survey.interface';
import { SurveyService } from '../../services/survey.service';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../../auth/services/user.service';
import { AnswerService } from '../../services/answer.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrl: './list-survey.component.css'
})
export class ListSurveyComponent {

  surveys!: Survey[];

  totalUsers!: Number;
  totalSurveys!: Number;
  totalQuestions!: Number;
  totalAnswers!: Number;

  chartData: any;

  chartOptions: any;

  isLoading: boolean = true;

  data: any;

  options: any;

  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private answerService: AnswerService
  ) { }

  ngOnInit() {

    forkJoin({
      surveys: this.surveyService.getSurveys(),
      users: this.userService.getUsers(),
      questions: this.questionService.getQuestions(),
      answers: this.answerService.getAnswers()
    }).subscribe({
      next: (data: any) => {
        this.surveys = data.surveys;
        this.totalSurveys = data.surveys.length;
        this.totalUsers = data.users.length;
        this.totalQuestions = data.questions.length;
        this.totalAnswers = data.answers.length;
        this.isLoading = false; // Marcamos que la carga ha terminado

        this.initChart();
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.isLoading = false; // Si ocurre un error, también marcamos que la carga ha terminado
      }
    });


  }

  initChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Users', 'Surveys', 'Questions', 'Answers'],
      datasets: [
        {
          data: [this.totalUsers, this.totalSurveys, this.totalQuestions, this.totalAnswers],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--purple-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--purple-400')]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

}
