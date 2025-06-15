import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Room } from '../../../core/models/room.model';
import { Employee } from '../../../core/models/employee.model';
import { RoomService } from '../../../core/services/room.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cdk-room-container',
  templateUrl: './room-container.component.html',
  styleUrls: ['./room-container.component.scss'],
  imports: [CommonModule,DragDropModule, MemberCardComponent]
})
export class RoomContainerComponent {
  @Input() room!: Room;
  @Input() members!: Employee[];
  @Input() connectedDropLists: string[] = [];
  
  // CDK Drag Drop イベント
  @Output() cdkDropListDropped = new EventEmitter<CdkDragDrop<Employee[]>>();
  @Output() cdkDragStarted = new EventEmitter<any>();
  @Output() cdkDragEnded = new EventEmitter<any>();
  @Output() cdkDragEntered = new EventEmitter<any>();

  constructor(private roomService: RoomService) {}

  // 部屋の色クラスを取得
  getColorClasses(): string {
    return this.roomService.getColorClasses(this.room.color);
  }

  // アイコンの背景色を取得
  getIconBgColor(): string {
    return this.roomService.getIconBgColor(this.room.color);
  }

  // バッジの色を取得
  getBadgeColor(): string {
    const { isFull } = this.roomService.getRoomCapacityStatus(this.room, this.members);
    return this.roomService.getBadgeColor(this.room.color, isFull);
  }

  // 待機所かどうかを判定
  isWaitingRoom(): boolean {
    return this.room.id === 'waiting';
  }

  // 容量表示テキストを取得
  getCapacityText(): string {
    return this.room.capacity === Infinity 
      ? `${this.members.length}名` 
      : `${this.members.length}/${this.room.capacity}名`;
  }

  // 空の状態のメッセージを取得
  getEmptyMessage(): string {
    if (this.room.id === 'waiting') {
      return '待機中のメンバーはいません';
    }
    return '配置されたメンバーはいません';
  }

  // 空の状態のサブメッセージを取得
  getEmptySubMessage(): string {
    return this.room.id !== 'waiting' ? '待機所からドラッグ&ドロップしてください' : '';
  }

  // CDKイベントハンドラー
  onDropped(event: CdkDragDrop<Employee[]>): void {
    this.cdkDropListDropped.emit(event);
  }

  onDragStarted(event: any): void {
    this.cdkDragStarted.emit(event);
  }

  onDragEnded(event: any): void {
    this.cdkDragEnded.emit(event);
  }

  onDragEntered(event: any): void {
    this.cdkDragEntered.emit(event);
  }

  // ドロップ許可判定
  canDrop = (drag: any, drop: any): boolean => {
    // 待機所は常に受け入れ可能
    if (this.room.id === 'waiting') {
      return true;
    }

    // 他の部屋は容量チェック
    if (this.room.capacity !== Infinity) {
      return this.members.length < this.room.capacity;
    }

    return true;
  };

  // ドラッグ中の視覚的フィードバック用クラス
  getDropListClass(): string {
    let baseClass = 'drop-list';
    
    if (this.room.capacity !== Infinity && this.members.length >= this.room.capacity) {
      baseClass += ' drop-list-full';
    }
    
    return baseClass;
  }

  // TrackBy関数（パフォーマンス最適化）
  trackByMemberId(index: number, member: Employee): number {
    return member.id;
  }
}