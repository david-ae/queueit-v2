import { Component, ChangeDetectionStrategy} from '@angular/core';
import { UserAccess } from 'src/app/services/authentication/usersAccess';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./container.component.css']
})
export class ContainerComponent{
  constructor(private userAccess: UserAccess, private authService: AuthService,
    private _router: Router) { }

  logout(){
    this.logout();
    this._router.navigate(['/auth/login']);
  }
}
