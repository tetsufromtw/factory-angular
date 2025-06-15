import { Injectable, OnDestroy } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DragDropCoordinatorService implements OnDestroy {
    private dropLists: CdkDropList[] = [];
    private destroy$ = new Subject<void>();

    registerDropList(dropList: CdkDropList): void {
        this.dropLists.push(dropList);
        this.updateConnections();
    }

    unregisterDropList(dropList: CdkDropList): void {
        const index = this.dropLists.indexOf(dropList);
        if (index > -1) {
            this.dropLists.splice(index, 1);
            this.updateConnections();
        }
    }

    private updateConnections(): void {
        this.dropLists.forEach(dropList => {
            dropList.connectedTo = this.dropLists.filter(dl => dl !== dropList);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}