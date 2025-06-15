import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../../core/models/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← これが必要！

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss'],
  imports: [CommonModule,FormsModule]
})
export class StaffManagementComponent {
  @Input() employees: Employee[] = [];
  @Output() addEmployee = new EventEmitter<{name: string, position: string}>();
  @Output() removeEmployee = new EventEmitter<Employee>();

  // フォーム表示状態の管理
  showAddForm = false;
  newEmployeeName = '';
  newEmployeePosition = '';

  // 定義済みの役職リスト
  predefinedPositions = [
    '主任',
    'リーダー', 
    'スタッフ',
    'アシスタント',
    'マネージャー',
    'チーフ'
  ];

  // フォームの表示/非表示を切り替え
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  // フォームをリセット
  resetForm(): void {
    this.newEmployeeName = '';
    this.newEmployeePosition = '';
  }

  // スタッフを追加
  onAddEmployee(): void {
    const name = this.newEmployeeName.trim();
    const position = this.newEmployeePosition.trim();

    if (!name || !position) {
      alert('名前と役職を入力してください');
      return;
    }

    // 同じ名前のスタッフが既に存在するかチェック
    if (this.employees.some(emp => emp.name === name)) {
      alert('同じ名前のスタッフが既に存在します');
      return;
    }

    this.addEmployee.emit({ name, position });
    this.resetForm();
    this.showAddForm = false;
  }

  // スタッフを削除
  onRemoveEmployee(employee: Employee): void {
    if (confirm(`${employee.name}さんを削除しますか？`)) {
      this.removeEmployee.emit(employee);
    }
  }

  // アバターの生成
  generateAvatar(name: string): string {
    return name.charAt(0);
  }

  // フォームの妥当性をチェック
  isFormValid(): boolean {
    return this.newEmployeeName.trim().length > 0 && 
           this.newEmployeePosition.trim().length > 0;
  }
}