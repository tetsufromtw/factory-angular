import { Injectable } from '@angular/core';
import { Employee, EmployeeModel } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  // 次のIDを管理するためのカウンター
  private nextId = 9;

  // 初期従業員データを取得
  getInitialEmployees(): Employee[] {
    return [
      EmployeeModel.create(1, '田中太郎', '主任', 'T'),
      EmployeeModel.create(2, '佐藤花子', 'スタッフ', 'S'),
      EmployeeModel.create(3, '山田次郎', 'リーダー', 'Y'),
      EmployeeModel.create(4, '鈴木美咲', 'スタッフ', 'Su'),
      EmployeeModel.create(5, '高橋健一', 'スタッフ', 'Ta'),
      EmployeeModel.create(6, '渡辺麻衣', 'スタッフ', 'W'),
      EmployeeModel.create(7, '伊藤大輔', 'スタッフ', 'I'),
      EmployeeModel.create(8, '中村由美', 'スタッフ', 'N')
    ];
  }

  // 従業員データの妥当性をチェック
  validateEmployee(employee: Employee): boolean {
    return !!(employee && employee.id && employee.name && employee.position);
  }

  // 新しい従業員を作成
  createEmployee(name: string, position: string): Employee {
    const avatar = this.generateAvatar(name);
    const employee = EmployeeModel.create(this.nextId++, name, position, avatar);
    return employee;
  }

  // 名前からアバターを生成
  private generateAvatar(name: string): string {
    // 名前の最初の文字を使用（カタカナ、ひらがな、漢字に対応）
    const firstChar = name.charAt(0);
    
    // 漢字の場合は読み方の最初の文字を推測（簡単な例）
    const kanjiToRomaji: { [key: string]: string } = {
      '田': 'Ta', '中': 'N', '佐': 'S', '藤': 'F', '山': 'Y', '川': 'K',
      '鈴': 'Su', '木': 'Ki', '高': 'Ta', '橋': 'H', '渡': 'W', '辺': 'Be',
      '伊': 'I', '東': 'H', '松': 'M', '小': 'Ko', '大': 'O', '加': 'Ka',
      '安': 'A', '井': 'I', '森': 'Mo', '池': 'I', '石': 'I', '吉': 'Y',
      '村': 'Mu', '本': 'Mo', '長': 'N', '西': 'N', '野': 'No', '原': 'H'
    };

    // 漢字の場合は変換、それ以外はそのまま使用
    if (kanjiToRomaji[firstChar]) {
      return kanjiToRomaji[firstChar];
    }
    
    // ひらがな・カタカナの場合は最初の文字を使用
    return firstChar.toUpperCase();
  }
}