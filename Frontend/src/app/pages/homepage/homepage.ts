import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-homepage',
    imports: [RouterLink, CommonModule, ScrollingModule],
    templateUrl: './homepage.html',
    styleUrl: './homepage.css',
})
export class Homepage implements AfterViewInit {
    showingHotline = false;

    // Date Slider Properties
    @ViewChild('scrollWrapper', { static: false }) scrollWrapper!: ElementRef;
    datesGroupList: Array<Array<{ date: Date; dayName: string; dateNum: number; dotType: string }>> = [];
    selectedDate: Date = new Date();
    currentMonthYearStr: string = '';

    ngOnInit() {
        this.generateDates(new Date());
    }

    ngAfterViewInit() {
        this.scrollToCenter();
    }

    toggleHotline() {
        this.showingHotline = !this.showingHotline;
    }

    generateDates(centerDate: Date) {
        this.selectedDate = new Date(centerDate.getFullYear(), centerDate.getMonth(), centerDate.getDate()); // Normalize
        const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
        this.currentMonthYearStr = formatter.format(this.selectedDate);

        this.datesGroupList = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dotTypes = ['', 'red', 'teal', 'mix', '', 'red', ''];

        // Find the Monday of the current selectedDate's week
        const d = new Date(this.selectedDate);
        const day = d.getDay(); // 0 is Sunday
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const startMonday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);

        // Generate exactly 7 weeks (49 days) starting from that Monday
        let currentGroup: any[] = [];
        for (let i = 0; i < 49; i++) {
            const date = new Date(startMonday.getFullYear(), startMonday.getMonth(), startMonday.getDate() + i);
            currentGroup.push({
                date: date,
                dayName: dayNames[date.getDay()],
                dateNum: date.getDate(),
                dotType: dotTypes[Math.abs(date.getDate()) % 7]
            });
            if (currentGroup.length === 7) {
                this.datesGroupList.push([...currentGroup]);
                currentGroup = [];
            }
        }

        // Wait for Angular to re-render DOM items before scrolling to the correct week
        setTimeout(() => {
            // Scroll to the left start position (since selected is in first week)
            if (this.scrollWrapper) {
                this.scrollWrapper.nativeElement.scrollLeft = 0;
            }
        }, 50);
    }

    selectDate(dateObj: any) {
        this.selectedDate = dateObj.date;
        const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
        this.currentMonthYearStr = formatter.format(this.selectedDate);
    }

    onNativeDateChange(event: any) {
        const value = event.target.value;
        if (value) {
            const newDate = new Date(value);
            this.generateDates(newDate);
        }
    }

    showDatePicker(dateInput: HTMLInputElement) {
        if ('showPicker' in HTMLInputElement.prototype) {
            try {
                dateInput.showPicker();
            } catch (e) {
                // Ignore fallback
            }
        }
    }

    scrollToCenter() {
        if (this.scrollWrapper) {
            const element = this.scrollWrapper.nativeElement;
            const activeItem = element.querySelector('.active');
            if (activeItem) {
                // Focus active week group precisely
                const weekGroup = activeItem.closest('.week-group');
                if (weekGroup) {
                    element.scrollLeft = weekGroup.offsetLeft;
                } else {
                    const scrollPos = activeItem.offsetLeft - (element.clientWidth / 2) + (activeItem.clientWidth / 2);
                    element.scrollLeft = scrollPos;
                }
            }
        }
    }
}
