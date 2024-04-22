import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Survey } from '../interfaces/survey.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private _baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this._baseUrl}/api/surveys`);
  }

  getSurvey(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this._baseUrl}/api/get-survey/${id}`);
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(`${this._baseUrl}/api/create-survey`, survey);
  }

  deleteSurvey(id: number): Observable<Survey> {
    return this.http.delete<Survey>(`${this._baseUrl}/api/delete-survey/${id}`);
  }

  updateSurvey(id: number, survey: Survey): Observable<Survey> {
    return this.http.put<Survey>(`${this._baseUrl}/api/update-survey/${id}`, survey);
  }

  assignSurveyToUser(surveyId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/api/survey/${surveyId}/assign/${userId}`, '');
  }
}
