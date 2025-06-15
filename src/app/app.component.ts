import { Component } from '@angular/core';
import { AssignmentBoardComponent } from "./features/assignments/components/assignment-board/assignment-board.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [AssignmentBoardComponent]
})
export class AppComponent {
  title = 'room-assignment-system';
  
  // アプリケーションのメインコンポーネント
}