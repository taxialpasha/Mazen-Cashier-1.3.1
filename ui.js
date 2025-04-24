/**
 * ملف واجهة المستخدم
 * يحتوي على وظائف التعامل مع واجهة المستخدم
 */

/**
 * إظهار نموذج تسجيل الدخول
 */
function showLoginForm() {
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.display = 'flex';
    }
}

/**
 * إخفاء نموذج تسجيل الدخول
 */
function hideLoginForm() {
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.display = 'none';
    }
}

/**
 * إظهار حاوية التطبيق
 */
function showAppContainer() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.style.display = 'flex';
    }
}

/**
 * إخفاء حاوية التطبيق
 */
function hideAppContainer() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.style.display = 'none';
    }
}

/**
 * إظهار مؤشر التحميل
 * @param {string} message رسالة التحميل
 */
function showLoading(message = 'جاري التحميل...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    if (loadingOverlay && loadingText) {
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }
}

/**
 * إخفاء مؤشر التحميل
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * إظهار إشعار للمستخدم
 * @param {string} title عنوان الإشعار
 * @param {string} message رسالة الإشعار
 * @param {string} type نوع الإشعار (success, error, warning, info)
 */
function showNotification(title, message, type = 'info') {
    // استخدام مكتبة SweetAlert2 لعرض الإشعارات
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

/**
 * إظهار مودال
 * @param {string} modalId معرف المودال
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * إخفاء مودال
 * @param {string} modalId معرف المودال
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * تحقق من قوة كلمة المرور
 * @param {string} password كلمة المرور
 * @returns {{score: number, message: string}} درجة القوة ورسالة
 */
function checkPasswordStrength(password) {
    let score = 0;
    let message = '';
    
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
        return { score: 0, message: 'ضعيفة جداً' };
    } else if (password.length >= 10) {
        score += 2;
    } else {
        score += 1;
    }
    
    // التحقق من وجود أحرف كبيرة وصغيرة
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score += 1;
    }
    
    // التحقق من وجود أرقام
    if (/\d/.test(password)) {
        score += 1;
    }
    
    // التحقق من وجود رموز خاصة
    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1;
    }
    
    // تحديد الرسالة والدرجة
    if (score < 2) {
        message = 'ضعيفة';
    } else if (score < 3) {
        message = 'متوسطة';
    } else if (score < 5) {
        message = 'قوية';
    } else {
        message = 'قوية جداً';
    }
    
    return { score, message };
}

/**
 * رفع ملف إلى التخزين
 * @param {string} path مسار الملف
 * @param {File} file الملف
 * @param {Function} progressCallback دالة رد الاتصال للتقدم
 * @returns {Promise<string>} وعد يحتوي على رابط الملف المرفوع
 */
function uploadFile(path, file, progressCallback) {
    return new Promise((resolve, reject) => {
        try {
            // الحصول على مرجع التخزين
            const storageRef = firebase.storage().ref(path);
            
            // رفع الملف
            const uploadTask = storageRef.put(file);
            
            // مراقبة تقدم الرفع
            if (progressCallback) {
                uploadTask.on('state_changed', progressCallback);
            }
            
            // معالجة الاكتمال
            uploadTask.then(snapshot => {
                // الحصول على رابط التنزيل
                return snapshot.ref.getDownloadURL();
            })
            .then(downloadURL => {
                resolve(downloadURL);
            })
            .catch(error => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// تصدير الدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoginForm,
        hideLoginForm,
        showAppContainer,
        hideAppContainer,
        showLoading,
        hideLoading,
        showNotification,
        showModal,
        hideModal,
        checkPasswordStrength,
        uploadFile
    };
}