import { Injectable } from '@angular/core';
import { Room, RoomModel } from '../models/room.model';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  // 初期部屋データを取得
  getInitialRooms(): { [key: string]: Room } {
    return {
      waiting: RoomModel.create('waiting', '待機所', Infinity, 'yellow'),
      roomA: RoomModel.create('roomA', '部屋A', 6, 'blue'),
      roomB: RoomModel.create('roomB', '部屋B', 6, 'green')
    };
  }

  // 部屋にメンバーを追加可能かチェック
  canAddMember(room: Room, members: Employee[]): boolean {
    return members.length < room.capacity;
  }

  // 部屋の容量状況を取得
  getRoomCapacityStatus(room: Room, members: Employee[]): { isFull: boolean; isNearFull: boolean } {
    const memberCount = members?.length ?? 0;
    const isFull = memberCount >= room.capacity;
    const isNearFull = memberCount >= room.capacity * 0.8;

    return { isFull, isNearFull };
  }

  // 新しい部屋を作成
  createNewRoom(roomCount: number): Room {
    const roomId = `room${String.fromCharCode(67 + roomCount - 3)}`;
    const roomName = `部屋${String.fromCharCode(67 + roomCount - 3)}`;
    const colors = ['purple', 'orange', 'pink', 'indigo', 'teal', 'red'];
    const color = colors[(roomCount - 3) % colors.length];

    return RoomModel.create(roomId, roomName, 6, color);
  }

  // 部屋の背景色クラスを取得
  getColorClasses(color: string): string {
    switch (color) {
      case 'yellow': return 'bg-yellow-50 border-yellow-300';
      case 'blue': return 'bg-blue-50 border-blue-300';
      case 'green': return 'bg-green-50 border-green-300';
      case 'purple': return 'bg-purple-50 border-purple-300';
      case 'orange': return 'bg-orange-50 border-orange-300';
      case 'pink': return 'bg-pink-50 border-pink-300';
      case 'indigo': return 'bg-indigo-50 border-indigo-300';
      case 'teal': return 'bg-teal-50 border-teal-300';
      case 'red': return 'bg-red-50 border-red-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  }

  // アイコンの背景色クラスを取得
  getIconBgColor(color: string): string {
    switch (color) {
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      case 'pink': return 'bg-pink-500';
      case 'indigo': return 'bg-indigo-500';
      case 'teal': return 'bg-teal-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  // バッジの色クラスを取得
  getBadgeColor(color: string, isFull: boolean): string {
    if (isFull) return 'bg-red-100 text-red-800';
    switch (color) {
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'pink': return 'bg-pink-100 text-pink-800';
      case 'indigo': return 'bg-indigo-100 text-indigo-800';
      case 'teal': return 'bg-teal-100 text-teal-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // サマリー表示用の色クラスを取得
  getSummaryColor(color: string): string {
    switch (color) {
      case 'yellow': return 'bg-yellow-50 text-yellow-600';
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'green': return 'bg-green-50 text-green-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      case 'orange': return 'bg-orange-50 text-orange-600';
      case 'pink': return 'bg-pink-50 text-pink-600';
      case 'indigo': return 'bg-indigo-50 text-indigo-600';
      case 'teal': return 'bg-teal-50 text-teal-600';
      case 'red': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }
}