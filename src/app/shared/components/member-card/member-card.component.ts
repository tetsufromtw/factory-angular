import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../../core/models/employee.model';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-cdk-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
  imports: [DragDropModule]
})
export class MemberCardComponent {
  @Input() member!: Employee;

  // CDK Drag イベント
  @Output() cdkDragStarted = new EventEmitter<any>();
  @Output() cdkDragEnded = new EventEmitter<any>();

  // CDKイベントハンドラー
  onDragStarted(event: any): void {
    console.log('Member drag started:', this.member.name);
    this.cdkDragStarted.emit(event);
  }

  onDragEnded(event: any): void {
    console.log('Member drag ended:', this.member.name);
    this.cdkDragEnded.emit(event);
  }
}