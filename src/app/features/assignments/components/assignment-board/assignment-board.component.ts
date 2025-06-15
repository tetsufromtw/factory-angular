import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Room } from '../../../../core/models/room.model';
import { Employee } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { RoomService } from '../../../../core/services/room.service';
import { RoomSummaryData, AssignmentSummaryComponent } from '../../../../shared/components/assignment-summary/assignment-summary.component';
import { RoomContainerComponent } from "../../../../shared/components/room-container/room-container.component";
import { HeaderComponent } from "../../../../layout/header/header.component";
import { RoomControlButtonsComponent } from "../../../../shared/components/room-control-buttons/room-control-buttons.component";
import { HelpSectionComponent } from "../../../../shared/components/help-section/help-section.component";
import { CommonModule } from '@angular/common';
import { StaffManagementComponent } from "../../../../shared/components/staff-management/staff-management.component";

@Component({
  selector: 'app-assignment-board',
  templateUrl: './assignment-board.component.html',
  styleUrls: ['./assignment-board.component.scss'],
  imports: [CommonModule, RoomContainerComponent, HeaderComponent, RoomControlButtonsComponent, AssignmentSummaryComponent, HelpSectionComponent, StaffManagementComponent]
})
export class AssignmentBoardComponent implements OnInit {
  rooms: { [key: string]: Room } = {};
  roomMembers: { [key: string]: Employee[] } = {};
  allEmployees: Employee[] = [];
  
  // 全てのドロップリストのIDを管理
  connectedDropLists: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.updateConnectedDropLists();
  }

  // データの初期化処理
  private initializeData(): void {
    this.rooms = this.roomService.getInitialRooms();
     this.allEmployees = this.employeeService.getInitialEmployees();
    this.roomMembers = {
      waiting: [...this.allEmployees],
      roomA: [],
      roomB: []
    };
  }

  // 接続されたドロップリストを更新
  private updateConnectedDropLists(): void {
    //this.connectedDropLists = Object.keys(this.rooms);
    this.connectedDropLists = Object.keys(this.roomMembers);
  }

  // ドロップイベント処理
  onDrop(event: CdkDragDrop<Employee[]>): void {
    const fromRoomId = event.previousContainer.id;
    const toRoomId = event.container.id;
    const employee = event.previousContainer.data[event.previousIndex];

    console.log(`Moving ${employee.name} from ${fromRoomId} to ${toRoomId}`);

    // 同じコンテナ内での移動
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // 異なるコンテナ間での移動
      const targetRoom = this.rooms[toRoomId];
      
      // 容量チェック（待機所以外）
      if (targetRoom.capacity !== Infinity) {
        const currentCount = event.container.data.length;
        if (currentCount >= targetRoom.capacity) {
          alert(`${targetRoom.name}は満員です（最大${targetRoom.capacity}人）`);
          return;
        }
      }

      // アイテムを移動
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      console.log(`Successfully moved ${employee.name} to ${targetRoom.name}`);
    }
  }

  // 新しい部屋を追加
  onAddRoom(): void {
    const roomCount = Object.keys(this.rooms).length;
    const newRoom = this.roomService.createNewRoom(roomCount);
    
    this.rooms = {
      ...this.rooms,
      [newRoom.id]: newRoom
    };
    
    this.roomMembers = {
      ...this.roomMembers,
      [newRoom.id]: []
    };

    this.updateConnectedDropLists();
  }

  // 部屋を削除
  onRemoveRoom(): void {
    const roomKeys = Object.keys(this.rooms);
    const lastRoomKey = roomKeys[roomKeys.length - 1];
    
    // 基本部屋の削除を防ぐ
    if (['waiting', 'roomA', 'roomB'].includes(lastRoomKey)) {
      alert('基本の部屋（待機所、部屋A、部屋B）は削除できません');
      return;
    }

    // メンバーがいる部屋の削除を防ぐ
    if (this.roomMembers[lastRoomKey] && this.roomMembers[lastRoomKey].length > 0) {
      alert(`${this.rooms[lastRoomKey].name}にメンバーがいるため削除できません。先にメンバーを移動してください。`);
      return;
    }

    // 部屋と関連データを削除
    const newRooms = { ...this.rooms };
    const newRoomMembers = { ...this.roomMembers };
    
    delete newRooms[lastRoomKey];
    delete newRoomMembers[lastRoomKey];
    
    this.rooms = newRooms;
    this.roomMembers = newRoomMembers;

    this.updateConnectedDropLists();
  }

  // ドラッグ開始時の処理（オプション）
  onDragStarted(event: any): void {
    console.log('Drag started:', event);
  }

  // ドラッグ終了時の処理（オプション）
  onDragEnded(event: any): void {
    console.log('Drag ended:', event);
  }

  // ドラッグ中の処理（容量チェック用）
  onDragEntered(event: any): void {
    const toRoomId = event.container.id;
    const targetRoom = this.rooms[toRoomId];
    
    if (targetRoom && targetRoom.capacity !== Infinity) {
      const currentCount = event.container.data.length;
      if (currentCount >= targetRoom.capacity) {
        // 視覚的なフィードバックを提供（オプション）
        console.log(`Room ${targetRoom.name} is full!`);
      }
    }
  }
  // スタッフを追加
  onAddEmployee(data: {name: string, position: string}): void {
    const newEmployee = this.employeeService.createEmployee(data.name, data.position);
    
    // 全従業員リストに追加
    this.allEmployees = [...this.allEmployees, newEmployee];
    
    // 待機所に追加
    this.roomMembers = {
      ...this.roomMembers,
      waiting: [...this.roomMembers['waiting'], newEmployee]
    };
  }

  // スタッフを削除
  onRemoveEmployee(employee: Employee): void {
    // 全従業員リストから削除
    this.allEmployees = this.allEmployees.filter(emp => emp.id !== employee.id);
    
    // 全ての部屋から削除
    const newRoomMembers = { ...this.roomMembers };
    Object.keys(newRoomMembers).forEach(roomId => {
      newRoomMembers[roomId] = newRoomMembers[roomId].filter(emp => emp.id !== employee.id);
    });
    
    this.roomMembers = newRoomMembers;
  }
  // 総メンバー数を計算
  getTotalMembers(): number {
    return this.allEmployees.length;
  }
  // 部屋配列を取得
  getRoomsArray(): Array<[string, Room]> {
    return Object.entries(this.rooms);
  }

  // 待機所以外の部屋を取得
  getNonWaitingRooms(): Array<[string, Room]> {
    return this.getRoomsArray().filter(([id]) => id !== 'waiting');
  }

  // 部屋削除可能かどうかを判定
  canRemoveRoom(): boolean {
    return this.getNonWaitingRooms().length > 2;
  }

  // サマリー用データを準備
  getSummaryData(): RoomSummaryData[] {
    return this.getRoomsArray().map(([roomId, room]) => ({
      room,
      count: this.roomMembers[roomId]?.length || 0
    }));
  }

  // 待機所の部屋データを取得
  getWaitingRoom(): Room {
    return this.rooms['waiting'];
  }

  // 待機所のメンバーを取得
  getWaitingMembers(): Employee[] {
    return this.roomMembers['waiting'] || [];
  }

  // 指定した部屋のメンバーを取得
  getRoomMembers(roomId: string): Employee[] {
    return this.roomMembers[roomId] || [];
  }

  // 全従業員リストを取得
  getAllEmployees(): Employee[] {
    return this.allEmployees;
  }
}