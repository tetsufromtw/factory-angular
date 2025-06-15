import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Room } from '../models/room.model';
import { Assignment, AssignmentModel } from '../models/assignment.model';
import { RoomService } from './room.service';

export interface MoveResult {
  fromMembers: Employee[];
  toMembers: Employee[];
  assignment: Assignment;
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(private roomService: RoomService) {}

  // 従業員を部屋間で移動
  moveEmployee(
    employee: Employee, 
    fromRoom: Room | null, 
    toRoom: Room, 
    fromMembers: Employee[], 
    toMembers: Employee[]
  ): MoveResult {
    if (!this.roomService.canAddMember(toRoom, toMembers)) {
      throw new Error(`${toRoom.name}は満員です（最大${toRoom.capacity}人）`);
    }

    const newFromMembers = fromMembers.filter(m => m.id !== employee.id);
    const newToMembers = [...toMembers, employee];

    return {
      fromMembers: newFromMembers,
      toMembers: newToMembers,
      assignment: AssignmentModel.create(employee.id, toRoom.id, new Date())
    };
  }
}