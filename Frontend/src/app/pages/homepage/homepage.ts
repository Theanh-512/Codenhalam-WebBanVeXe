import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-homepage',
    imports: [RouterLink, CommonModule, ScrollingModule, FormsModule],
    templateUrl: './homepage.html',
    styleUrl: './homepage.css',
})
export class Homepage implements AfterViewInit {
    showingHotline = false;

    tripType: 'oneWay' | 'roundTrip' = 'oneWay';

    provinces: string[] = [
        'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 'Bắc Ninh', 'Bến Tre', 'Bình Dương',
        'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông',
        'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương',
        'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hồ Chí Minh', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum',
        'Lai Châu', 'Lạng Sơn', 'Lào Cai', 'Lâm Đồng', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận',
        'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
        'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
        'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
    ];

    origin: string = '';
    destination: string = '';

    showOriginDropdown: boolean = false;
    showDestinationDropdown: boolean = false;

    get filteredOrigins(): string[] {
        return this.provinces.filter(p => !this.origin || p.toLowerCase().includes(this.origin.toLowerCase())).filter(p => p !== this.destination);
    }

    get filteredDestinations(): string[] {
        return this.provinces.filter(p => !this.destination || p.toLowerCase().includes(this.destination.toLowerCase())).filter(p => p !== this.origin);
    }

    setTripType(type: 'oneWay' | 'roundTrip') {
        this.tripType = type;
    }

    selectOrigin(province: string) {
        this.origin = province;
        this.showOriginDropdown = false;
    }

    selectDestination(province: string) {
        this.destination = province;
        this.showDestinationDropdown = false;
    }

    swapLocations() {
        const temp = this.origin;
        this.origin = this.destination;
        this.destination = temp;
    }

    onBlurOrigin() {
        setTimeout(() => this.showOriginDropdown = false, 200);
    }

    onBlurDestination() {
        setTimeout(() => this.showDestinationDropdown = false, 200);
    }

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
