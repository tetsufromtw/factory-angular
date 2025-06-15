import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-room-control-buttons',
  templateUrl: './room-control-buttons.component.html',
  styleUrls: ['./room-control-buttons.component.scss']
})
export class RoomControlButtonsComponent {
  @Input() canRemove: boolean = false;
  @Output() addRoom = new EventEmitter<void>();
  @Output() removeRoom = new EventEmitter<void>();

  // 部屋追加ボタンクリック時の処理
  onAddRoom(): void {
    this.addRoom.emit();
  }

  // 部屋削除ボタンクリック時の処理
  onRemoveRoom(): void {
    this.removeRoom.emit();
  }
}