import { Component, OnInit } from '@angular/core';
import { UserAccess } from 'src/app/services/authentication/usersAccess';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  date: any;
  
  constructor(private userAccess: UserAccess) { }

  ngOnInit() {
    this.date = new Date().getFullYear();
    console.log(this.userAccess.isTeller);
  }

}
