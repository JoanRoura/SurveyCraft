import { Component } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-survey',
  templateUrl: './home-survey.component.html',
  styleUrl: './home-survey.component.css'
})
export class HomeSurveyComponent {

  visibleSidebar!: boolean;

  constructor(public sharedService: SharedService, private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
