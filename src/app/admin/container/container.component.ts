import { Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./container.component.css']
})
export class ContainerComponent{
  constructor() { }
}
