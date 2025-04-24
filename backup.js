/**
 * ملف النسخ الاحتياطي
 * يحتوي على وظائف النسخ الاحتياطي واستعادة البيانات
 */

/**
 * تحميل سجل النسخ الاحتياطي
 */
function loadBackupHistory() {
    const backupHistoryBody = document.getElementById('backup-history-body');
    if (!backupHistoryBody) return;
    
    // عرض مؤشر التحميل
    showLoading('جاري تحميل سجل النسخ الاحتياطي...');
    
    // تفريغ الجدول
    backupHistoryBody.innerHTML = '';
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref('backup_history')
            .orderByChild('timestamp')
            .limitToLast(10)
            .once('value')
            .then(snapshot => {
                hideLoading();
                
                if (snapshot.exists()) {
                    let backups = [];
                    
                    snapshot.forEach(childSnapshot => {
                        const backup = childSnapshot.val();
                        backup.id = childSnapshot.key;
                        backups.push(backup);
                    });
                    
                    // ترتيب النسخ حسب التاريخ (الأحدث أولاً)
                    backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // عرض النسخ
                    renderBackupHistory(backups);
                } else {
                    backupHistoryBody.innerHTML = '<tr><td colspan="6" class="empty-table">لا توجد نسخ احتياطية</td></tr>';
                }
            })
            .catch(error => {
                console.error('خطأ في تحميل سجل النسخ الاحتياطي:', error);
                hideLoading();
                backupHistoryBody.innerHTML = '<tr><td colspan="6" class="empty-table">حدث خطأ أثناء تحميل سجل النسخ الاحتياطي</td></tr>';
            });
    } else {
        hideLoading();
        backupHistoryBody.innerHTML = '<tr><td colspan="6" class="empty-table">قاعدة البيانات غير متاحة</td></tr>';
    }
}

/**
 * عرض سجل النسخ الاحتياطي
 * @param {Array} backups قائمة النسخ الاحتياطية
 */
function renderBackupHistory(backups) {
    const backupHistoryBody = document.getElementById('backup-history-body');
    if (!backupHistoryBody) return;
    
    if (backups.length === 0) {
        backupHistoryBody.innerHTML = '<tr><td colspan="6" class="empty-table">لا توجد نسخ احتياطية</td></tr>';
        return;
    }
    
    // تفريغ الجدول
    backupHistoryBody.innerHTML = '';
    
    // عرض كل نسخة احتياطية في الجدول
    backups.forEach(backup => {
        const row = document.createElement('tr');
        
        const date = new Date(backup.timestamp);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        row.innerHTML = `
            <td>${backup.name}</td>
            <td>${formattedDate}</td>
            <td>${typeof formatFileSize === 'function' ? formatFileSize(backup.size) : backup.size + ' بايت'}</td>
            <td>${backup.userName}</td>
            <td>${backup.type === 'auto' ? 'تلقائي' : 'يدوي'}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn download" data-id="${backup.id}" title="تنزيل">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn restore" data-id="${backup.id}" title="استعادة">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="action-btn delete" data-id="${backup.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // إضافة مستمعي الأحداث للأزرار
        const downloadBtn = row.querySelector('.download');
        const restoreBtn = row.querySelector('.restore');
        const deleteBtn = row.querySelector('.delete');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                downloadBackup(backup.id);
            });
        }
        
        if (restoreBtn) {
            restoreBtn.addEventListener('click', function() {
                confirmRestoreBackup(backup.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                confirmDeleteBackup(backup.id);
            });
        }
        
        backupHistoryBody.appendChild(row);
    });
}

/**
 * تنزيل نسخة احتياطية
 * @param {string} backupId معرف النسخة
 */
function downloadBackup(backupId) {
    // عرض مؤشر التحميل
    showLoading('جاري تنزيل النسخة الاحتياطية...');
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref(`backup_history/${backupId}`).once('value')
            .then(snapshot => {
                hideLoading();
                
                if (snapshot.exists()) {
                    const backup = snapshot.val();
                    
                    // فتح رابط التنزيل في نافذة جديدة
                    window.open(backup.url, '_blank');
                } else {
                    showNotification('خطأ', 'لم يتم العثور على النسخة الاحتياطية', 'error');
                }
            })
            .catch(error => {
                console.error('خطأ في تنزيل النسخة الاحتياطية:', error);
                hideLoading();
                showNotification('خطأ', 'حدث خطأ أثناء تنزيل النسخة الاحتياطية', 'error');
            });
    } else {
        hideLoading();
        showNotification('خطأ', 'قاعدة البيانات غير متاحة', 'error');
    }
}

/**
 * تأكيد استعادة نسخة احتياطية
 * @param {string} backupId معرف النسخة
 */
function confirmRestoreBackup(backupId) {
    // استخدام SweetAlert2 لعرض مربع حوار التأكيد
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'تأكيد الاستعادة',
            text: 'سيتم استبدال البيانات الحالية بالبيانات من النسخة الاحتياطية. هل أنت متأكد من الاستمرار؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، استعادة',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                restoreBackup(backupId);
            }
        });
    } else {
        // استخدام confirm العادية إذا لم يكن SweetAlert2 متاحًا
        if (confirm('سيتم استبدال البيانات الحالية بالبيانات من النسخة الاحتياطية. هل أنت متأكد من الاستمرار؟')) {
            restoreBackup(backupId);
        }
    }
}

/**
 * استعادة نسخة احتياطية
 * @param {string} backupId معرف النسخة
 */
function restoreBackup(backupId) {
    // التنفيذ سيكون عندما تكون قاعدة البيانات متاحة
    showNotification('تنبيه', 'جاري تطوير هذه الميزة...', 'info');
}

/**
 * تأكيد حذف نسخة احتياطية
 * @param {string} backupId معرف النسخة
 */
function confirmDeleteBackup(backupId) {
    // استخدام SweetAlert2 لعرض مربع حوار التأكيد
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'تأكيد الحذف',
            text: 'هل أنت متأكد من حذف هذه النسخة الاحتياطية؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، حذف',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBackup(backupId);
            }
        });
    } else {
        // استخدام confirm العادية إذا لم يكن SweetAlert2 متاحًا
        if (confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
            deleteBackup(backupId);
        }
    }
}

/**
 * حذف نسخة احتياطية
 * @param {string} backupId معرف النسخة
 */
function deleteBackup(backupId) {
    // التنفيذ سيكون عندما تكون قاعدة البيانات متاحة
    showNotification('تنبيه', 'جاري تطوير هذه الميزة...', 'info');
}

/**
 * إنشاء نسخة احتياطية جديدة
 */
function createBackup() {
    // الحصول على خيارات النسخ الاحتياطي
    const options = {
        products: document.getElementById('backup-products').checked,
        customers: document.getElementById('backup-customers').checked,
        invoices: document.getElementById('backup-sales').checked,
        settings: document.getElementById('backup-settings').checked,
        users: document.getElementById('backup-users').checked
    };
    
    // التحقق من اختيار خيار واحد على الأقل
    if (!options.products && !options.customers && !options.invoices && !options.settings && !options.users) {
        showNotification('خطأ', 'يرجى اختيار نوع واحد على الأقل من البيانات للنسخ الاحتياطي', 'error');
        return;
    }
    
    // الحصول على اسم النسخة الاحتياطية
    const backupName = document.getElementById('backup-name').value || `نسخة-احتياطية-${new Date().toISOString().split('T')[0]}`;
    
    // عرض مؤشر التحميل
    showLoading('جاري إنشاء النسخة الاحتياطية...');
    
    // التنفيذ سيكون عندما تكون قاعدة البيانات متاحة
    setTimeout(() => {
        hideLoading();
        showNotification('تنبيه', 'جاري تطوير هذه الميزة...', 'info');
    }, 1000);
}

/**
 * إعداد مستمعي أحداث النسخ الاحتياطي
 */
function setupBackupEventListeners() {
    // زر إنشاء نسخة احتياطية
    const createBackupBtn = document.getElementById('create-backup-btn');
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', createBackup);
    }
    
    // زر اختيار ملف النسخة الاحتياطية
    const selectBackupFileBtn = document.getElementById('select-backup-file');
    if (selectBackupFileBtn) {
        selectBackupFileBtn.addEventListener('click', function() {
            const backupFile = document.getElementById('backup-file');
            if (backupFile) {
                backupFile.click();
            }
        });
    }
    
    // مراقبة تغيير ملف النسخة الاحتياطية
    const backupFile = document.getElementById('backup-file');
    if (backupFile) {
        backupFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                // إظهار خيارات الاستعادة
                const restoreOptions = document.getElementById('restore-options');
                if (restoreOptions) {
                    restoreOptions.style.display = 'block';
                }
                
                // عرض اسم الملف
                const fileNameElement = this.nextElementSibling;
                if (fileNameElement) {
                    fileNameElement.textContent = this.files[0].name;
                }
            }
        });
    }
    
    // إضافة المزيد من مستمعي الأحداث حسب الحاجة
}