// বাংলা মাসের নাম
const banglaMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 
    'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 
    'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

// বাংলা সপ্তাহের দিন
const banglaWeekDays = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 
    'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// ইংরেজি মাসের বাংলা নাম
const englishMonthsBangla = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 
    'মে', 'জুন', 'জুলাই', 'আগস্ট', 
    'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
function enToBnNumber(number) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().replace(/\d/g, digit => bnDigits[digit]);
}

// ইংরেজি থেকে বাংলা তারিখ কনভার্টার (সঠিক সংস্করণ)
function getBanglaDate(englishDate) {
    const date = new Date(englishDate);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    
    // বাংলা বছরের শুরু ১৪ এপ্রিল (বা ১৫ এপ্রিল লিপ ইয়ারে)
    // সহজ হিসাব: ইংরেজি বছর - 593 (সাধারণত)
    let banglaYear = year - 593;
    let banglaMonth = 0;
    let banglaDay = 0;
    
    // বাংলা মাসের দিন সংখ্যা
    const daysInBanglaMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
    
    // ১৪ এপ্রিল থেকে বাংলা বছর শুরু
    let startDate = new Date(year, 3, 14); // এপ্রিল ১৪
    
    // লিপ ইয়ার চেক (ফেব্রুয়ারি ২৯ দিন থাকলে)
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        startDate = new Date(year, 3, 15); // লিপ ইয়ারে ১৫ এপ্রিল
    }
    
    // যদি তারিখ ১৪ এপ্রিলের আগে হয়
    if (date < startDate) {
        banglaYear--;
        startDate = new Date(year - 1, 3, 14);
        if (((year - 1) % 4 === 0 && (year - 1) % 100 !== 0) || ((year - 1) % 400 === 0)) {
            startDate = new Date(year - 1, 3, 15);
        }
    }
    
    // দিনের পার্থক্য নির্ণয়
    const diffTime = date - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // মাস ও দিন নির্ণয়
    let remainingDays = diffDays;
    for (let i = 0; i < daysInBanglaMonths.length; i++) {
        if (remainingDays < daysInBanglaMonths[i]) {
            banglaMonth = i;
            banglaDay = remainingDays + 1;
            break;
        }
        remainingDays -= daysInBanglaMonths[i];
    }
    
    // যদি কোনো মাস না পাওয়া যায় (শেষ মাসের জন্য)
    if (banglaMonth === 0 && banglaDay === 0) {
        banglaMonth = 11;
        banglaDay = daysInBanglaMonths[11];
    }
    
    return {
        day: banglaDay,
        month: banglaMonth + 1,
        monthName: banglaMonths[banglaMonth],
        year: banglaYear,
        weekDay: banglaWeekDays[date.getDay()]
    };
}

// অথবা আরও সহজ সংস্করণ (BanglaCalendar লাইব্রেরি ব্যবহার)
// অথবা নিচের সহজ ফাংশন ব্যবহার করুন:

function getBanglaDateSimple(englishDate) {
    const date = new Date(englishDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // বাংলা মাসের সূচনা (ইংরেজি তারিখে)
    const banglaMonthStart = [
        {month: 3, day: 14},  // বৈশাখ - ১৪ এপ্রিল
        {month: 4, day: 14},  // জ্যৈষ্ঠ - ১৪ মে
        {month: 5, day: 14},  // আষাঢ় - ১৪ জুন
        {month: 6, day: 15},  // শ্রাবণ - ১৫ জুলাই (আসল হিসাবে ১৬ জুলাই, কিন্তু সহজ হিসাবে)
        {month: 7, day: 15},  // ভাদ্র - ১৫ আগস্ট
        {month: 8, day: 15},  // আশ্বিন - ১৫ সেপ্টেম্বর
        {month: 9, day: 15},  // কার্তিক - ১৫ অক্টোবর
        {month: 10, day: 14}, // অগ্রহায়ণ - ১৪ নভেম্বর
        {month: 11, day: 14}, // পৌষ - ১৪ ডিসেম্বর
        {month: 0, day: 13},  // মাঘ - ১৩ জানুয়ারি
        {month: 1, day: 12},  // ফাল্গুন - ১২ ফেব্রুয়ারি
        {month: 2, day: 13}   // চৈত্র - ১৩ মার্চ
    ];
    
    let banglaYear = year - 593;
    let banglaMonth = 0;
    let banglaDay = 0;
    
    // লিপ ইয়ার চেক
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    // বর্তমান মাসের শুরু নির্ণয়
    let currentMonthStart = new Date(year, banglaMonthStart[0].month, banglaMonthStart[0].day);
    
    // যদি তারিখ ১৪ এপ্রিলের আগে হয়
    if (date < currentMonthStart) {
        banglaYear--;
        // পূর্ববর্তী বছরের ডিসেম্বর মাসের জন্য
        currentMonthStart = new Date(year - 1, 11, 31);
        // বৈশাখের জন্য এপ্রিল ১৪
        currentMonthStart = new Date(year - 1, 3, 14);
        if ((year - 1) % 4 === 0 && (year - 1) % 100 !== 0) {
            currentMonthStart = new Date(year - 1, 3, 15);
        }
    }
    
    // মাস নির্ণয় (সরলীকৃত)
    for (let i = 0; i < 12; i++) {
        let start = new Date(year, banglaMonthStart[i].month, banglaMonthStart[i].day);
        let end = new Date(year, banglaMonthStart[(i + 1) % 12].month, banglaMonthStart[(i + 1) % 12].day);
        
        if (i === 11) {
            end = new Date(year + 1, banglaMonthStart[0].month, banglaMonthStart[0].day);
        }
        
        if (date >= start && date < end) {
            banglaMonth = i;
            banglaDay = Math.floor((date - start) / (1000 * 60 * 60 * 24)) + 1;
            break;
        }
    }
    
    return {
        day: banglaDay,
        month: banglaMonth + 1,
        monthName: banglaMonths[banglaMonth],
        year: banglaYear,
        weekDay: banglaWeekDays[date.getDay()]
    };
}

// তারিখ আপডেট ফাংশন
function updateDates() {
    const now = new Date();
    
    // বাংলা তারিখ (সঠিক সংস্করণ ব্যবহার করুন)
    const banglaDate = getBanglaDate(now);
    const banglaDateStr = `${enToBnNumber(banglaDate.day)} ${banglaDate.monthName} ${enToBnNumber(banglaDate.year)} বঙ্গাব্দ`;
    document.getElementById('banglaDate').textContent = banglaDateStr;
    
    // ইংরেজি তারিখ
    const englishDateStr = `${banglaWeekDays[now.getDay()]}, ${enToBnNumber(now.getDate())} ${englishMonthsBangla[now.getMonth()]} ${enToBnNumber(now.getFullYear())} খ্রিস্টাব্দ`;
    document.getElementById('englishDate').textContent = englishDateStr;
}

// পেজ লোড হলে তারিখ আপডেট করুন
updateDates();

// প্রতিদিন তারিখ আপডেট করার জন্য
setInterval(updateDates, 86400000); // 24 ঘন্টা পর পর আপডেট
