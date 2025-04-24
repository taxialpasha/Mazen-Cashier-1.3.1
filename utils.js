/**
 * ملف الوظائف المساعدة
 * يحتوي على وظائف مساعدة متنوعة للتطبيق
 */

/**
 * تنسيق العملة
 * @param {number} amount المبلغ
 * @returns {string} المبلغ المنسق
 */
function formatCurrency(amount, settings = null) {
    if (!settings && typeof appSettings !== 'undefined') {
        settings = appSettings.general;
    }
    
    if (!settings) {
        // إعدادات افتراضية
        return `${amount} دينار`;
    }
    
    // تقريب المبلغ
    amount = parseFloat(amount).toFixed(settings.decimalPlaces || 0);
    
    // تقسيم المبلغ إلى جزء صحيح وجزء عشري
    let [integerPart, decimalPart] = amount.split('.');
    
    // إضافة فواصل الآلاف
    if (settings.thousandSeparator) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousandSeparator);
    }
    
    // إعادة تكوين المبلغ
    amount = decimalPart !== undefined
        ? `${integerPart}${settings.decimalSeparator || '.'}${decimalPart}`
        : integerPart;
    
    // إضافة رمز العملة
    return settings.currencyPosition === 'before'
        ? `${settings.currencySymbol || 'دينار'} ${amount}`
        : `${amount} ${settings.currencySymbol || 'دينار'}`;
}

/**
 * تنسيق التاريخ
 * @param {Date} date كائن التاريخ
 * @returns {string} التاريخ المنسق
 */
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diff / (1000 * 60));
    
    if (diffMinutes < 1) {
        return 'الآن';
    } else if (diffMinutes < 60) {
        return `منذ ${diffMinutes} دقيقة${diffMinutes > 1 && diffMinutes < 11 ? '' : ''}`;
    } else if (diffHours < 24) {
        return `منذ ${diffHours} ساعة${diffHours > 1 && diffHours < 11 ? '' : ''}`;
    } else if (diffDays < 30) {
        return `منذ ${diffDays} يوم${diffDays > 1 && diffDays < 11 ? '' : ''}`;
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

/**
 * توليد رقم عشوائي
 * @param {number} min القيمة الدنيا
 * @param {number} max القيمة القصوى
 * @returns {number} رقم عشوائي
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * توليد رمز عشوائي
 * @param {number} length طول الرمز
 * @param {boolean} includeLetters تضمين الحروف
 * @param {boolean} includeNumbers تضمين الأرقام
 * @returns {string} رمز عشوائي
 */
function generateRandomCode(length, includeLetters = true, includeNumbers = true) {
    let chars = '';
    if (includeLetters) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
}

/**
 * توليد باركود عشوائي
 * @param {string} type نوع الباركود
 * @returns {string} باركود عشوائي
 */
function generateBarcode(type = 'EAN13') {
    let prefix = '200';
    let length = 0;
    
    if (typeof appSettings !== 'undefined' && appSettings.pos && appSettings.pos.barcodePrefix) {
        prefix = appSettings.pos.barcodePrefix;
    }
    
    switch (type) {
        case 'EAN13':
            length = 13;
            break;
        case 'CODE128':
        case 'CODE39':
            length = 12;
            break;
        case 'UPC':
            length = 12;
            prefix = '0';
            break;
        default:
            length = 13;
    }
    
    // توليد الأرقام العشوائية
    let barcode = prefix;
    for (let i = 0; i < length - prefix.length - 1; i++) {
        barcode += Math.floor(Math.random() * 10);
    }
    
    // حساب رقم التحقق (للرموز التي تحتاج إلى ذلك)
    if (type === 'EAN13' || type === 'UPC') {
        let sum = 0;
        for (let i = 0; i < barcode.length; i++) {
            sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        barcode += checkDigit;
    } else {
        // إضافة رقم عشوائي في حالة الرموز الأخرى
        barcode += Math.floor(Math.random() * 10);
    }
    
    return barcode;
}

/**
 * تنسيق حجم الملف
 * @param {number} bytes حجم الملف بالبايت
 * @returns {string} الحجم المنسق
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * إنشاء ترقيم صفحات
 * @param {string} containerId معرف حاوية الترقيم
 * @param {number} currentPage الصفحة الحالية
 * @param {number} totalPages إجمالي عدد الصفحات
 * @param {Function} callback دالة الاستدعاء عند تغيير الصفحة
 */
function createPagination(containerId, currentPage, totalPages, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // زر الصفحة السابقة
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            callback(currentPage - 1);
        }
    });
    container.appendChild(prevBtn);
    
    // الصفحات
    const maxButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // إضافة زر الصفحة الأولى إذا لزم الأمر
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'pagination-btn';
        firstPageBtn.textContent = '1';
        firstPageBtn.addEventListener('click', function() {
            callback(1);
        });
        container.appendChild(firstPageBtn);
        
        // إضافة زر الفاصل إذا لزم الأمر
        if (startPage > 2) {
            const ellipsisBtn = document.createElement('span');
            ellipsisBtn.className = 'pagination-ellipsis';
            ellipsisBtn.textContent = '...';
            container.appendChild(ellipsisBtn);
        }
    }
    
    // إضافة أزرار الصفحات
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            callback(i);
        });
        container.appendChild(pageBtn);
    }
    
    // إضافة زر الصفحة الأخيرة إذا لزم الأمر
    if (endPage < totalPages) {
        // إضافة زر الفاصل إذا لزم الأمر
        if (endPage < totalPages - 1) {
            const ellipsisBtn = document.createElement('span');
            ellipsisBtn.className = 'pagination-ellipsis';
            ellipsisBtn.textContent = '...';
            container.appendChild(ellipsisBtn);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'pagination-btn';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.addEventListener('click', function() {
            callback(totalPages);
        });
        container.appendChild(lastPageBtn);
    }
    
    // زر الصفحة التالية
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            callback(currentPage + 1);
        }
    });
    container.appendChild(nextBtn);
}

// تصدير الدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        getRandomNumber,
        generateRandomCode,
        generateBarcode,
        formatFileSize,
        createPagination
    };
}