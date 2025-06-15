import { Component, Input } from '@angular/core';
import { Room } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';
import { CommonModule } from '@angular/common';

export interface RoomSummaryData {
  room: Room;
  count: number;
}

@Component({
  selector: 'app-assignment-summary',
  templateUrl: './assignment-summary.component.html',
  styleUrls: ['./assignment-summary.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // ここを必ず入れる！
    // もし他のコンポーネントやパイプを使っていればここに追加
  ]
})
export class AssignmentSummaryComponent {
  @Input() roomsData!: RoomSummaryData[];

  constructor(private roomService: RoomService) {}

  // サマリー表示用の色クラスを取得
  getSummaryColor(color: string): string {
    return this.roomService.getSummaryColor(color);
  }

  // 部屋名の表示テキストを取得
  getRoomDisplayName(room: Room): string {
    return room.id === 'waiting' ? '待機中' : room.name;
  }
}