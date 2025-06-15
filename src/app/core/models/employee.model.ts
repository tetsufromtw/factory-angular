// 従業員データモデル
export interface Employee {
  id: number;
  name: string;
  position: string;
  avatar: string;
}

// 従業員データ作成ファクトリ
export class EmployeeModel {
  static create(id: number, name: string, position: string, avatar: string): Employee {
    return { id, name, position, avatar };
  }
}