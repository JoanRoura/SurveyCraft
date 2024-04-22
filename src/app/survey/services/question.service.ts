import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Question } from '../interfaces/question.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private _baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this._baseUrl}/api/questions`);
  }

  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(`${this._baseUrl}/api/get-question/${id}`);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this._baseUrl}/api/create-question`, question);
  }

  deleteQuestion(id: number): Observable<Question> {
    return this.http.delete<Question>(`${this._baseUrl}/api/delete-question/${id}`);
  }

  updateQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this._baseUrl}/api/update-question/${id}`, question);
  }

  assignQuestionToSurvey(idSurvey: number, idQuestion: number): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/api/survey/${idSurvey}/assign-question/${idQuestion}`, '');
  }

  getQuestionsBySurvey(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this._baseUrl}/api/questions-by-survey/${id}`);
  }
}
