import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { Room } from '../../../../core/models/room.model';
import { Employee } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { RoomService } from '../../../../core/services/room.service';

import { RoomSummaryData, AssignmentSummaryComponent } from '../../../../shared/components/assignment-summary/assignment-summary.component';
import { RoomContainerComponent } from "../../../../shared/components/room-container/room-container.component";
import { HeaderComponent } from "../../../../layout/header/header.component";
import { RoomControlButtonsComponent } from "../../../../shared/components/room-control-buttons/room-control-buttons.component";
import { HelpSectionComponent } from "../../../../shared/components/help-section/help-section.component";
import { StaffManagementComponent } from "../../../../shared/components/staff-management/staff-management.component";
import { MemberCardComponent } from "../../../../shared/components/member-card/member-card.component";

@Component({
  standalone: true,
  selector: 'app-assignment-board',
  templateUrl: './assignment-board.component.html',
  styleUrls: ['./assignment-board.component.scss'],
  imports: [
    CommonModule,
    DragDropModule,
    RoomContainerComponent,
    MemberCardComponent,
    HeaderComponent,
    RoomControlButtonsComponent,
    AssignmentSummaryComponent,
    HelpSectionComponent,
    StaffManagementComponent
  ]
})
export class AssignmentBoardComponent implements OnInit {
  rooms: { [key: string]: Room } = {};
  roomMembers: { [key: string]: Employee[] } = {};
  allEmployees: Employee[] = [];

  connectedDropLists: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.updateConnectedDropLists();
  }

  private initializeData(): void {
    this.rooms = this.roomService.getInitialRooms();
    this.allEmployees = this.employeeService.getInitialEmployees();
    this.roomMembers = {
      waiting: [...this.allEmployees],
      roomA: [],
      roomB: []
    };
  }

  private updateConnectedDropLists(): void {
    this.connectedDropLists = Object.keys(this.roomMembers);
  }

  onDrop(event: CdkDragDrop<Employee[]>): void {
    const fromRoomId = event.previousContainer.id;
    const toRoomId = event.container.id;
    const employee = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const targetRoom = this.rooms[toRoomId];
      if (targetRoom.capacity !== Infinity) {
        const currentCount = event.container.data.length;
        if (currentCount >= targetRoom.capacity) {
          alert(`${targetRoom.name}は満員です（最大${targetRoom.capacity}人）`);
          return;
        }
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

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

  onRemoveRoom(): void {
    const roomKeys = Object.keys(this.rooms);
    const lastRoomKey = roomKeys[roomKeys.length - 1];

    if (['waiting', 'roomA', 'roomB'].includes(lastRoomKey)) {
      alert('基本の部屋（待機所、部屋A、部屋B）は削除できません');
      return;
    }

    if (this.roomMembers[lastRoomKey]?.length > 0) {
      alert(`${this.rooms[lastRoomKey].name}にメンバーがいるため削除できません。先にメンバーを移動してください。`);
      return;
    }

    const newRooms = { ...this.rooms };
    const newRoomMembers = { ...this.roomMembers };
    delete newRooms[lastRoomKey];
    delete newRoomMembers[lastRoomKey];

    this.rooms = newRooms;
    this.roomMembers = newRoomMembers;

    this.updateConnectedDropLists();
  }

  onDragStarted(event: any): void { }
  onDragEnded(event: any): void { }
  onDragEntered(event: any): void {
    const toRoomId = event.container.id;
    const targetRoom = this.rooms[toRoomId];

    if (targetRoom && targetRoom.capacity !== Infinity) {
      const currentCount = event.container.data.length;
      if (currentCount >= targetRoom.capacity) {
        console.log(`Room ${targetRoom.name} is full!`);
      }
    }
  }

  onAddEmployee(data: { name: string, position: string }): void {
    const newEmployee = this.employeeService.createEmployee(data.name, data.position);
    this.allEmployees = [...this.allEmployees, newEmployee];
    this.roomMembers = {
      ...this.roomMembers,
      waiting: [...this.roomMembers['waiting'], newEmployee]
    };
  }

  onRemoveEmployee(employee: Employee): void {
    this.allEmployees = this.allEmployees.filter(emp => emp.id !== employee.id);
    const newRoomMembers = { ...this.roomMembers };
    Object.keys(newRoomMembers).forEach(roomId => {
      newRoomMembers[roomId] = newRoomMembers[roomId].filter(emp => emp.id !== employee.id);
    });
    this.roomMembers = newRoomMembers;
  }

  getTotalMembers(): number {
    return this.allEmployees.length;
  }

  getRoomsArray(): Array<[string, Room]> {
    return Object.entries(this.rooms);
  }

  getNonWaitingRooms(): Array<[string, Room]> {
    return this.getRoomsArray().filter(([id]) => id !== 'waiting');
  }

  canRemoveRoom(): boolean {
    return this.getNonWaitingRooms().length > 2;
  }

  getSummaryData(): RoomSummaryData[] {
    return this.getRoomsArray().map(([roomId, room]) => ({
      room,
      count: this.roomMembers[roomId]?.length || 0
    }));
  }

  getWaitingRoom(): Room {
    return this.rooms['waiting'];
  }

  getWaitingMembers(): Employee[] {
    return this.roomMembers['waiting'] || [];
  }

  getRoomMembers(roomId: string): Employee[] {
    return this.roomMembers[roomId] || [];
  }

  getAllEmployees(): Employee[] {
    return this.allEmployees;
  }

  getDropListClass(id: string): string {
    const room = this.rooms[id];
    const members = this.roomMembers[id];
    if (!room || !members) return 'drop-list';
    if (room.capacity !== Infinity && members.length >= room.capacity) {
      return 'drop-list drop-list-full';
    }
    return 'drop-list';
  }

  canDrop = (drag: any, drop: any): boolean => {
    const room = this.rooms[drop.id];
    const members = this.roomMembers[drop.id];
    if (!room || !members) return false;
    if (room.capacity === Infinity) return true;
    return members.length < room.capacity;
  };

  trackByMemberId(index: number, member: Employee): number {
    return member.id;
  }

  getEmptyMessage(room: Room): string {
    return room.id === 'waiting' ? '待機中のメンバーはいません' : '配置されたメンバーはいません';
  }

  getEmptySubMessage(room: Room): string {
    return room.id !== 'waiting' ? '待機所からドラッグ&ドロップしてください' : '';
  }
}
