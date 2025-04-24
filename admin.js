/**
 * ملف الإدارة
 * يحتوي على وظائف إدارة المستخدمين والفروع وإعدادات النظام
 */

/**
 * تحديث صفحة الإدارة
 */
function refreshAdminPage() {
    // تحميل البيانات حسب علامة التبويب النشطة
    const activeTab = document.querySelector('.admin-tab.active');
    if (activeTab) {
        const tabName = activeTab.dataset.tab;
        
        switch (tabName) {
            case 'users':
                loadUsers();
                break;
            case 'branches':
                loadBranches();
                break;
            case 'settings':
                loadSystemSettings();
                break;
            case 'backup':
                loadBackupHistory();
                break;
            case 'logs':
                loadActivityLogs();
                break;
        }
    }
}

/**
 * تحميل قائمة المستخدمين
 */
function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    // عرض مؤشر التحميل
    showLoading('جاري تحميل المستخدمين...');
    
    // تفريغ الجدول
    usersTableBody.innerHTML = '';
    
    // تحميل المستخدمين من قاعدة البيانات عندما تكون متاحة
    if (typeof dbRef !== 'undefined') {
        dbRef.ref('users').once('value')
            .then(snapshot => {
                hideLoading();
                
                if (snapshot.exists()) {
                    let users = [];
                    
                    snapshot.forEach(childSnapshot => {
                        const user = childSnapshot.val();
                        user.id = childSnapshot.key;
                        users.push(user);
                    });
                    
                    // عرض المستخدمين في الجدول
                    renderUsersTable(users);
                } else {
                    usersTableBody.innerHTML = '<tr><td colspan="9" class="empty-table">لا يوجد مستخدمين</td></tr>';
                }
            })
            .catch(error => {
                console.error('خطأ في تحميل المستخدمين:', error);
                hideLoading();
                usersTableBody.innerHTML = '<tr><td colspan="9" class="empty-table">حدث خطأ أثناء تحميل المستخدمين</td></tr>';
            });
    } else {
        hideLoading();
        usersTableBody.innerHTML = '<tr><td colspan="9" class="empty-table">قاعدة البيانات غير متاحة</td></tr>';
    }
}

/**
 * عرض جدول المستخدمين
 * @param {Array} users قائمة المستخدمين
 */
function renderUsersTable(users) {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="9" class="empty-table">لا يوجد مستخدمين</td></tr>';
        return;
    }
    
    // تفريغ الجدول
    usersTableBody.innerHTML = '';
    
    // عرض كل مستخدم في الجدول
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // الحصول على اسم الصلاحية
        const roleName = getRoleName(user.role);
        
        // تنسيق تاريخ آخر تسجيل دخول
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'لم يسجل الدخول بعد';
        
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${roleName}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${getBranchName(user.lastBranch) || '-'}</td>
            <td>${lastLogin}</td>
            <td><span class="status-badge ${user.status === 'active' ? 'active' : 'disabled'}">${user.status === 'active' ? 'نشط' : 'معطل'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" data-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn ${user.status === 'active' ? 'disable' : 'enable'}" data-id="${user.id}" title="${user.status === 'active' ? 'تعطيل' : 'تفعيل'}">
                        <i class="fas ${user.status === 'active' ? 'fa-ban' : 'fa-check-circle'}"></i>
                    </button>
                    <button class="action-btn delete" data-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // إضافة مستمعي الأحداث للأزرار
        const editBtn = row.querySelector('.edit');
        const statusBtn = row.querySelector('.disable, .enable');
        const deleteBtn = row.querySelector('.delete');
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                editUser(user.id);
            });
        }
        
        if (statusBtn) {
            statusBtn.addEventListener('click', function() {
                toggleUserStatus(user.id, user.status);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                confirmDeleteUser(user.id);
            });
        }
        
        usersTableBody.appendChild(row);
    });
}

/**
 * الحصول على اسم الصلاحية
 * @param {string} role رمز الصلاحية
 * @returns {string} اسم الصلاحية
 */
function getRoleName(role) {
    switch (role) {
        case 'admin':
            return 'مدير';
        case 'manager':
            return 'مشرف';
        case 'cashier':
            return 'كاشير';
        case 'inventory':
            return 'مسؤول مخزون';
        case 'accountant':
            return 'محاسب';
        case 'viewer':
            return 'مراقب';
        default:
            return 'غير معروف';
    }
}

/**
 * الحصول على اسم الفرع
 * @param {string} branchId معرف الفرع
 * @returns {string} اسم الفرع
 */
function getBranchName(branchId) {
    // هذه الدالة تحتاج إلى تنفيذ عندما تكون بيانات الفروع متاحة
    return branchId ? branchId : 'غير محدد';
}

/**
 * إعداد مستمعي أحداث صفحة الإدارة
 */
function setupAdminEventListeners() {
    // أزرار تبديل التبويبات
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التبويبات
            adminTabs.forEach(t => t.classList.remove('active'));
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            // إخفاء جميع لوحات الإدارة
            const adminPanels = document.querySelectorAll('.admin-panel');
            adminPanels.forEach(panel => panel.classList.remove('active'));
            
            // إظهار اللوحة المناسبة
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-panel`).classList.add('active');
            
            // تحميل البيانات المناسبة
            switch (tabId) {
                case 'users':
                    loadUsers();
                    break;
                case 'branches':
                    loadBranches();
                    break;
                case 'settings':
                    loadSystemSettings();
                    break;
                case 'backup':
                    loadBackupHistory();
                    break;
                case 'logs':
                    loadActivityLogs();
                    break;
            }
        });
    });
    
    // زر إضافة مستخدم جديد
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showAddUserModal();
        });
    }
    
    // إضافة المزيد من مستمعي الأحداث حسب الحاجة
}