import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() totalMembers: number = 0;

  // 現在の日付を取得
  getCurrentDate(): string {
    return '2025年6月11日';
  }
}