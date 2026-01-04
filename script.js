// ======================
// CONSTANTS AND CONFIGURATION
// ======================
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample events data (in a real app, this would come from a backend)
const SAMPLE_EVENTS = {
    "2024-01-15": [
        {
            id: "1",
            name: "College Fest Opening",
            summary: "Annual college fest inauguration ceremony with guest speakers",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop"
        }
    ],
    "2024-01-20": [
        {
            id: "2",
            name: "Tech Symposium",
            summary: "Annual technical symposium showcasing student projects",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w-400&h=300&fit=crop"
        }
    ],
    "2024-01-25": [
        {
            id: "3",
            name: "Sports Day",
            summary: "Inter-department sports competition",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        },
        {
            id: "4",
            name: "Cultural Night",
            summary: "Cultural performances by students",
            image: "https://images.unsplash.com/photo-1492684223066-e9e1a0f4a8e3?w=400&h=300&fit=crop"
        }
    ],
    "2024-01-26": [
        {
            id: "5",
            name: "Republic Day Celebration",
            summary: "Flag hoisting ceremony and cultural program",
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop"
        }
    ]
};

// Sample students data
const SAMPLE_STUDENTS = [
    {
        id: "1",
        name: "Rahul Sharma",
        batch: "24-25",
        department: "Computer Science",
        company: "Google",
        package: "18.5",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: "2",
        name: "Priya Patel",
        batch: "23-24",
        department: "Electronics",
        company: "Microsoft",
        package: "16.2",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: "3",
        name: "Amit Kumar",
        batch: "22-23",
        department: "Mechanical",
        company: "Tesla",
        package: "22.0",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: "4",
        name: "Sneha Reddy",
        batch: "24-25",
        department: "Civil",
        company: "L&T",
        package: "12.5",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: "5",
        name: "Vikram Singh",
        batch: "23-24",
        department: "Computer Science",
        company: "Amazon",
        package: "20.8",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: "6",
        name: "Anjali Gupta",
        batch: "22-23",
        department: "Electrical",
        company: "Infosys",
        package: "14.3",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
    }
];

// ======================
// CALENDAR MANAGEMENT
// ======================
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.events = { ...SAMPLE_EVENTS };
    }

    getEventsByDate(dateStr) {
        return this.events[dateStr] || [];
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthYearDisplay = document.getElementById('current-month-year');
        
        if (!calendarGrid || !monthYearDisplay) return;
        
        calendarGrid.innerHTML = '';
        monthYearDisplay.textContent = `${MONTH_NAMES[this.currentMonth]} ${this.currentYear}`;
        
        // Get first day and days in month
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Previous month days
        const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const dayElement = this.createDayElement(daysInPrevMonth - firstDay + i + 1, true, false);
            calendarGrid.appendChild(dayElement);
        }
        
        // Current month days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayDate = new Date(this.currentYear, this.currentMonth, i);
            dayDate.setHours(0, 0, 0, 0);
            
            const isToday = dayDate.getTime() === today.getTime();
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            const events = this.getEventsByDate(dateStr);
            const hasEvents = events.length > 0;
            
            const dayElement = this.createDayElement(i, false, isToday, isWeekend, hasEvents, events.length);
            dayElement.dataset.date = dateStr;
            
            dayElement.addEventListener('click', () => this.showEventsModal(dateStr));
            calendarGrid.appendChild(dayElement);
        }
        
        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = this.createDayElement(i, true, false);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(dayNumber, isEmpty, isToday = false, isWeekend = false, hasEvents = false, eventCount = 0) {
        const dayElement = document.createElement('div');
        
        let className = 'calendar-day';
        if (isEmpty) className += ' empty';
        if (isToday) className += ' today';
        if (isWeekend) className += ' weekend';
        
        dayElement.className = className;
        
        const dayNumberSpan = document.createElement('div');
        dayNumberSpan.className = 'calendar-day-number';
        dayNumberSpan.textContent = dayNumber;
        dayElement.appendChild(dayNumberSpan);
        
        if (hasEvents && !isEmpty) {
            if (eventCount === 1) {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                dayElement.appendChild(eventDot);
            } else if (eventCount > 1) {
                const eventCountSpan = document.createElement('div');
                eventCountSpan.className = 'multiple-events';
                eventCountSpan.textContent = eventCount;
                dayElement.appendChild(eventCountSpan);
            }
        }
        
        return dayElement;
    }

    showEventsModal(dateStr) {
        const modal = document.getElementById('events-modal');
        const dateTitle = document.getElementById('modal-date-title');
        const eventsList = document.getElementById('events-list');
        const noEventsMsg = document.getElementById('no-events-msg');
        
        if (!modal || !dateTitle || !eventsList || !noEventsMsg) return;
        
        const date = new Date(dateStr);
        dateTitle.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const events = this.getEventsByDate(dateStr);
        eventsList.innerHTML = '';
        
        if (events.length > 0) {
            noEventsMsg.style.display = 'none';
            events.forEach(event => {
                const eventElement = this.createEventElement(event);
                eventsList.appendChild(eventElement);
            });
        } else {
            noEventsMsg.style.display = 'block';
        }
        
        modal.style.display = 'block';
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item animate__animated animate__fadeIn';
        
        let content = `
            <h3><i class="fas fa-calendar-check"></i> ${event.name}</h3>
            <p>${event.summary}</p>
        `;
        
        if (event.image) {
            content += `<img src="${event.image}" alt="${event.name}" style="width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-top:10px;">`;
        }
        
        eventElement.innerHTML = content;
        return eventElement;
    }

    navigateMonth(direction) {
        if (direction === 'prev') {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
        } else {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
        }
        this.renderCalendar();
    }
}

// ======================
// STUDENTS MANAGEMENT
// ======================
class StudentsManager {
    constructor() {
        this.students = [...SAMPLE_STUDENTS];
    }

    getAllStudents() {
        return this.students;
    }

    getStudentsByBatch(batch) {
        if (batch === 'all') return this.students;
        return this.students.filter(student => student.batch === batch);
    }

    renderStudentGallery(containerId, batch = 'all') {
        const gallery = document.getElementById(containerId);
        if (!gallery) return;
        
        const students = this.getStudentsByBatch(batch);
        gallery.innerHTML = '';
        
        if (students.length === 0) {
            gallery.innerHTML = `
                <div class="no-students" style="text-align:center; padding:2rem; color:#666;">
                    <i class="fas fa-user-slash fa-3x" style="margin-bottom:1rem;"></i>
                    <p>No students found for this batch</p>
                </div>
            `;
            return;
        }
        
        students.forEach(student => {
            const card = this.createStudentCard(student);
            gallery.appendChild(card);
        });
    }

    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card animate__animated animate__fadeIn';
        card.dataset.batch = student.batch;
        
        let content = `
            <div class="student-image-container">
                <img src="${student.image}" alt="${student.name}" loading="lazy">
                ${student.company ? `<div class="company-badge">${student.company}</div>` : ''}
            </div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <div class="student-meta">
                    <span><i class="fas fa-graduation-cap"></i> ${student.batch}</span>
                    ${student.department ? `<span><i class="fas fa-building"></i> ${student.department}</span>` : ''}
                </div>
                ${student.package ? `<div class="package-info"><i class="fas fa-rupee-sign"></i> ${student.package} LPA</div>` : ''}
            </div>
        `;
        
        card.innerHTML = content;
        return card;
    }
}

// ======================
// UI MANAGEMENT
// ======================
class UIManager {
    static init() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('events-modal');
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('events-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
        
        // Setup notification toggle
        this.setupNotificationToggle();
        
        // Setup upcoming events
        this.setupUpcomingEvents();
    }
    
    static setupNotificationToggle() {
        const toggle = document.getElementById('notification-toggle');
        if (!toggle) return;
        
        const updateToggleState = () => {
            const isEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
            const icon = toggle.querySelector('i');
            const text = toggle.querySelector('.info-text');
            
            icon.className = isEnabled ? 'fas fa-bell' : 'fas fa-bell-slash';
            text.textContent = isEnabled ? 'Notifications ON' : 'Notifications OFF';
        };
        
        toggle.addEventListener('click', () => {
            const currentlyEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
            localStorage.setItem('notificationsEnabled', (!currentlyEnabled).toString());
            updateToggleState();
            
            // Show notification
            if (!currentlyEnabled) {
                this.showNotification('Notifications enabled', 'You will now receive event reminders.');
            }
        });
        
        updateToggleState();
    }
    
    static showNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification animate__animated animate__fadeInRight';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    static setupUpcomingEvents() {
        const upcomingEventsList = document.getElementById('upcoming-events-list');
        if (!upcomingEventsList) return;
        
        this.renderUpcomingEvents();
    }
    
    static renderUpcomingEvents() {
        const upcomingEventsList = document.getElementById('upcoming-events-list');
        if (!upcomingEventsList) return;
        
        const calendar = new CalendarManager();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = [];
        
        // Get events for the next 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const events = calendar.getEventsByDate(dateStr);
            events.forEach(event => {
                upcomingEvents.push({
                    date: dateStr,
                    dateObj: new Date(date),
                    event: event
                });
            });
        }
        
        upcomingEventsList.innerHTML = '';
        
        if (upcomingEvents.length === 0) {
            upcomingEventsList.innerHTML = `
                <div class="no-upcoming-events">
                    <i class="fas fa-calendar-times"></i>
                    No upcoming events found
                </div>
            `;
            return;
        }
        
        // Sort by date and take first 5
        upcomingEvents.sort((a, b) => a.dateObj - b.dateObj);
        const eventsToShow = upcomingEvents.slice(0, 5);
        
        eventsToShow.forEach(item => {
            const eventElement = document.createElement('div');
            eventElement.className = 'upcoming-event-item animate__animated animate__fadeIn';
            eventElement.innerHTML = `
                <div class="upcoming-event-date">
                    <i class="far fa-calendar"></i>
                    ${item.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div class="upcoming-event-name">${item.event.name}</div>
                <i class="fas fa-chevron-right"></i>
            `;
            
            eventElement.addEventListener('click', () => {
                const calendar = new CalendarManager();
                calendar.showEventsModal(item.date);
            });
            
            upcomingEventsList.appendChild(eventElement);
        });
    }
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Manager
    UIManager.init();
    
    // Initialize Calendar
    if (document.getElementById('calendar-grid')) {
        const calendar = new CalendarManager();
        calendar.renderCalendar();
        
        // Navigation buttons
        document.getElementById('prev-month')?.addEventListener('click', () => {
            calendar.navigateMonth('prev');
        });
        
        document.getElementById('next-month')?.addEventListener('click', () => {
            calendar.navigateMonth('next');
        });
        
        // Close modal button
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            document.getElementById('events-modal').style.display = 'none';
        });
    }
    
    // Initialize Student Gallery
    if (document.getElementById('student-gallery')) {
        const studentsManager = new StudentsManager();
        studentsManager.renderStudentGallery('student-gallery', 'all');
        
        // Batch filter buttons
        document.querySelectorAll('.batch-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.batch-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const batch = this.dataset.batch;
                studentsManager.renderStudentGallery('student-gallery', batch);
            });
        });
    }
    
    // Initialize Admin Login (simple frontend only)
    if (document.getElementById('admin-login')) {
        document.getElementById('admin-login').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            
            // Simple frontend validation
            if (username && password) {
                alert('Login successful! (This is a demo - no actual authentication)');
            } else {
                const errorMsg = document.getElementById('login-error');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.querySelector('.error-text').textContent = 'Please fill in all fields';
                }
            }
        });
        
        // Password toggle
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('password');
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }
    }
    
    // Initialize Admin Panel (demo only)
    if (document.getElementById('add-event-form')) {
        // Demo only - forms won't actually submit
        document.getElementById('add-event-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Event added successfully! (This is a demo - no actual data storage)');
            e.target.reset();
        });
        
        document.getElementById('add-student-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Student added successfully! (This is a demo - no actual data storage)');
            e.target.reset();
        });
        
        // Render sample data
        const calendar = new CalendarManager();
        const eventsContainer = document.getElementById('events-folder-view');
        if (eventsContainer) {
            eventsContainer.innerHTML = `
                <div style="text-align:center; padding:2rem; color:#666;">
                    <i class="fas fa-calendar-alt fa-3x" style="margin-bottom:1rem;"></i>
                    <p>Events management panel (Demo Mode)</p>
                    <p class="small">In a real application, events would be managed here</p>
                </div>
            `;
        }
        
        const studentsContainer = document.getElementById('students-list');
        if (studentsContainer) {
            const studentsManager = new StudentsManager();
            studentsManager.renderStudentGallery('students-list', 'all');
        }
    }
});