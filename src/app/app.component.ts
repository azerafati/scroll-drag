import {Component} from '@angular/core';
import {NgxScrollDragModule} from "ngx-scroll-drag";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NgxScrollDragModule
  ]
})
export class AppComponent {
  title = 'scroll-drag';
}
