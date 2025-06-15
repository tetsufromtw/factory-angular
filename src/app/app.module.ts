
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular CDK
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';

// Core Services
import { EmployeeService } from './core/services/employee.service';
import { RoomService } from './core/services/room.service';
import { AssignmentService } from './core/services/assignment.service';

// Shared Components (Original)
import { AssignmentSummaryComponent } from './shared/components/assignment-summary/assignment-summary.component';
import { RoomControlButtonsComponent } from './shared/components/room-control-buttons/room-control-buttons.component';
import { HelpSectionComponent } from './shared/components/help-section/help-section.component';

// CDK Components (New)
import { MemberCardComponent } from './shared/components/member-card/member-card.component';
import { RoomContainerComponent } from './shared/components/room-container/room-container.component';

// Layout Components
import { HeaderComponent } from './layout/header/header.component';

// Feature Components
import { AssignmentBoardComponent } from './features/assignments/components/assignment-board/assignment-board.component';
import { StaffManagementComponent } from './shared/components/staff-management/staff-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    DragDropModule,
    AppComponent,
    // Shared Components
    MemberCardComponent,
    RoomContainerComponent,
    AssignmentSummaryComponent,
    RoomControlButtonsComponent,
    HelpSectionComponent,
    StaffManagementComponent,
    // Layout Components
    HeaderComponent,
    // Feature Components
    AssignmentBoardComponent,
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    EmployeeService,
    RoomService,
    AssignmentService
  ],
})
export class AppModule { }