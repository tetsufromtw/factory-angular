import { Employee } from './employee.model';

// 部屋データモデル
export interface Room {
  id: string;
  name: string;
  capacity: number;
  color: string;
  members: Employee[];
}

// 部屋データ作成ファクトリ
export class RoomModel {
  static create(id: string, name: string, capacity: number, color: string): Room {
    return { id, name, capacity, color, members: [] };
  }
}