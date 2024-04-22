import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../interfaces/answer.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this._baseUrl}/api/answers`);
  }

  getAnswer(idAnswer: number): Observable<Answer> {
    return this.http.get<Answer>(`${this._baseUrl}/api/get-answer/${idAnswer}`);
  }

  createAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this._baseUrl}/api/create-answer`, answer);
  }

  deleteAnswer(idAnswer: number): Observable<Answer> {
    return this.http.delete<Answer>(`${this._baseUrl}/api/delete-answer/${idAnswer}`);
  }

  updateAnswer(idAnswer: number, answer: Answer): Observable<Answer> {
    return this.http.put<Answer>(`${this._baseUrl}/api/update-answer/${idAnswer}`, answer);
  }

  getOptionAnswers(idQuestion: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this._baseUrl}/api/get-option-answers/${idQuestion}`);
  }
}
