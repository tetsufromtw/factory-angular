// 配置履歴データモデル
export interface Assignment {
  employeeId: number;
  roomId: string;
  timestamp: Date;
}

// 配置履歴作成ファクトリ
export class AssignmentModel {
  static create(employeeId: number, roomId: string, timestamp: Date): Assignment {
    return { employeeId, roomId, timestamp };
  }
}