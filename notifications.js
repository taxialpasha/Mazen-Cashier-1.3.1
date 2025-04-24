/**
 * ملف الإشعارات
 * يحتوي على وظائف التعامل مع الإشعارات
 */

/**
 * تحميل الإشعارات
 */
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    // عرض رسالة تحميل
    notificationsList.innerHTML = '<div class="loading-message">جاري تحميل الإشعارات...</div>';
    
    // التحقق من وجود المستخدم
    if (typeof currentUser === 'undefined' || !currentUser) {
        notificationsList.innerHTML = '<div class="empty-message">يرجى تسجيل الدخول لعرض الإشعارات</div>';
        return;
    }
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref('notifications')
            .orderByChild('userId')
            .equalTo(currentUser.id)
            .limitToLast(50)
            .once('value')
            .then(snapshot => {
                notificationsList.innerHTML = '';
                
                if (snapshot.exists()) {
                    let notifications = [];
                    
                    snapshot.forEach(childSnapshot => {
                        const notification = childSnapshot.val();
                        notification.id = childSnapshot.key;
                        notifications.push(notification);
                    });
                    
                    // ترتيب الإشعارات حسب التاريخ (الأحدث أولاً)
                    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // عرض الإشعارات
                    notifications.forEach(notification => {
                        const notificationElement = createNotificationElement(notification);
                        notificationsList.appendChild(notificationElement);
                    });
                    
                    // تحديث عدد الإشعارات غير المقروءة
                    updateUnreadNotificationsCount();
                } else {
                    notificationsList.innerHTML = '<div class="empty-message">لا توجد إشعارات</div>';
                }
            })
            .catch(error => {
                console.error('خطأ في تحميل الإشعارات:', error);
                notificationsList.innerHTML = '<div class="error-message">حدث خطأ أثناء تحميل الإشعارات</div>';
            });
    } else {
        notificationsList.innerHTML = '<div class="error-message">قاعدة البيانات غير متاحة</div>';
    }
}

/**
 * إنشاء عنصر إشعار
 * @param {Object} notification بيانات الإشعار
 * @returns {HTMLElement} عنصر الإشعار
 */
function createNotificationElement(notification) {
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item ${notification.isRead ? '' : 'unread'}`;
    notificationItem.dataset.id = notification.id;
    
    // تحديد الأيقونة حسب نوع الإشعار
    let iconClass = 'fa-info-circle';
    switch (notification.type) {
        case 'success':
            iconClass = 'fa-check-circle';
            break;
        case 'error':
            iconClass = 'fa-times-circle';
            break;
        case 'warning':
            iconClass = 'fa-exclamation-triangle';
            break;
    }
    
    // تنسيق التاريخ
    const date = new Date(notification.timestamp);
    const formattedDate = typeof formatDate === 'function' ? formatDate(date) : date.toLocaleString();
    
    notificationItem.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${formattedDate}</div>
        </div>
        <div class="notification-actions">
            <button class="action-btn mark-read" title="تعيين كمقروء" ${notification.isRead ? 'style="display:none"' : ''}>
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn delete" title="حذف">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // إضافة مستمعي الأحداث
    const markReadBtn = notificationItem.querySelector('.mark-read');
    const deleteBtn = notificationItem.querySelector('.delete');
    
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            markNotificationAsRead(notification.id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteNotification(notification.id);
        });
    }
    
    // تعيين الإشعار كمقروء عند النقر عليه
    notificationItem.addEventListener('click', function() {
        if (!notification.isRead) {
            markNotificationAsRead(notification.id);
        }
    });
    
    return notificationItem;
}

/**
 * تعيين إشعار كمقروء
 * @param {string} notificationId معرف الإشعار
 */
function markNotificationAsRead(notificationId) {
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref(`notifications/${notificationId}`).update({
            isRead: true,
            readAt: new Date().toISOString()
        })
        .then(() => {
            const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.remove('unread');
                const markReadBtn = notificationItem.querySelector('.mark-read');
                if (markReadBtn) {
                    markReadBtn.style.display = 'none';
                }
            }
            
            // تحديث عدد الإشعارات غير المقروءة
            updateUnreadNotificationsCount();
        })
        .catch(error => {
            console.error('خطأ في تعيين الإشعار كمقروء:', error);
        });
    } else {
        console.error('قاعدة البيانات غير متاحة');
    }
}

/**
 * حذف إشعار
 * @param {string} notificationId معرف الإشعار
 */
function deleteNotification(notificationId) {
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref(`notifications/${notificationId}`).remove()
        .then(() => {
            const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.remove();
            }
            
            // تحديث عدد الإشعارات غير المقروءة
            updateUnreadNotificationsCount();
            
            // عرض رسالة "لا توجد إشعارات" إذا لم يتبق أي إشعارات
            const notificationsList = document.getElementById('notifications-list');
            if (notificationsList && notificationsList.childElementCount === 0) {
                notificationsList.innerHTML = '<div class="empty-message">لا توجد إشعارات</div>';
            }
        })
        .catch(error => {
            console.error('خطأ في حذف الإشعار:', error);
        });
    } else {
        console.error('قاعدة البيانات غير متاحة');
    }
}

/**
 * تحديث عدد الإشعارات غير المقروءة
 */
function updateUnreadNotificationsCount() {
    // التحقق من وجود المستخدم
    if (typeof currentUser === 'undefined' || !currentUser) {
        return;
    }
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref('notifications')
            .orderByChild('userId')
            .equalTo(currentUser.id)
            .once('value')
            .then(snapshot => {
                let unreadCount = 0;
                
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        const notification = childSnapshot.val();
                        if (!notification.isRead) {
                            unreadCount++;
                        }
                    });
                }
                
                const notificationCount = document.getElementById('notification-count');
                if (notificationCount) {
                    notificationCount.textContent = unreadCount;
                    notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
                }
            })
            .catch(error => {
                console.error('خطأ في تحديث عدد الإشعارات غير المقروءة:', error);
            });
    } else {
        console.error('قاعدة البيانات غير متاحة');
    }
}

/**
 * تعيين جميع الإشعارات كمقروءة
 */
function markAllNotificationsAsRead() {
    // التحقق من وجود المستخدم
    if (typeof currentUser === 'undefined' || !currentUser) {
        return;
    }
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        dbRef.ref('notifications')
            .orderByChild('userId')
            .equalTo(currentUser.id)
            .once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const updates = {};
                    
                    snapshot.forEach(childSnapshot => {
                        const notification = childSnapshot.val();
                        if (!notification.isRead) {
                            updates[`${childSnapshot.key}/isRead`] = true;
                            updates[`${childSnapshot.key}/readAt`] = new Date().toISOString();
                        }
                    });
                    
                    if (Object.keys(updates).length > 0) {
                        return dbRef.ref('notifications').update(updates);
                    }
                    
                    return Promise.resolve();
                }
                
                return Promise.resolve();
            })
            .then(() => {
                // تحديث واجهة المستخدم
                const unreadNotifications = document.querySelectorAll('.notification-item.unread');
                unreadNotifications.forEach(item => {
                    item.classList.remove('unread');
                    const markReadBtn = item.querySelector('.mark-read');
                    if (markReadBtn) {
                        markReadBtn.style.display = 'none';
                    }
                });
                
                // تحديث عدد الإشعارات غير المقروءة
                updateUnreadNotificationsCount();
                
                // عرض رسالة
                showNotification('تم بنجاح', 'تم تعيين جميع الإشعارات كمقروءة', 'success');
            })
            .catch(error => {
                console.error('خطأ في تعيين جميع الإشعارات كمقروءة:', error);
            });
    } else {
        console.error('قاعدة البيانات غير متاحة');
    }
}

/**
 * إضافة إشعار جديد
 * @param {string} title عنوان الإشعار
 * @param {string} message نص الإشعار
 * @param {string} type نوع الإشعار (success, error, warning, info)
 * @param {string} userId معرف المستخدم المستهدف
 */
function addNotification(title, message, type = 'info', userId = null) {
    // التحقق من وجود المستخدم
    if (!userId && (typeof currentUser === 'undefined' || !currentUser)) {
        return;
    }
    
    const targetUserId = userId || currentUser.id;
    
    // التحقق من توفر قاعدة البيانات
    if (typeof dbRef !== 'undefined') {
        const notification = {
            title: title,
            message: message,
            type: type,
            userId: targetUserId,
            branchId: typeof currentBranch !== 'undefined' && currentBranch ? currentBranch.id : null,
            isRead: false,
            timestamp: new Date().toISOString()
        };
        
        dbRef.ref('notifications').push(notification)
            .then(() => {
                // تحديث عدد الإشعارات غير المقروءة إذا كان الإشعار للمستخدم الحالي
                if (targetUserId === currentUser.id) {
                    updateUnreadNotificationsCount();
                }
            })
            .catch(error => {
                console.error('خطأ في إضافة إشعار:', error);
            });
    } else {
        console.error('قاعدة البيانات غير متاحة');
    }
}

/**
 * إعداد مستمعي أحداث الإشعارات
 */
function setupNotificationsEventListeners() {
    // زر تعيين الكل كمقروء
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // زر حذف الكل
    const clearAllNotificationsBtn = document.getElementById('clear-all-notifications');
    if (clearAllNotificationsBtn) {
        clearAllNotificationsBtn.addEventListener('click', function() {
            // هذه الميزة تحتاج إلى تنفيذ
            showNotification('تنبيه', 'جاري تطوير هذه الميزة...', 'info');
        });
    }
    
    // أزرار تبديل التبويبات
    const notificationTabs = document.querySelectorAll('.notification-tab');
    notificationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التبويبات
            notificationTabs.forEach(t => t.classList.remove('active'));
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            // تصفية الإشعارات حسب التبويب المحدد
            const tabId = this.dataset.tab;
            filterNotifications(tabId);
        });
    });
    
    // زر إعدادات الإشعارات
    const notificationSettingsBtn = document.getElementById('notification-settings-btn');
    if (notificationSettingsBtn) {
        notificationSettingsBtn.addEventListener('click', function() {
            // هذه الميزة تحتاج إلى تنفيذ
            showNotification('تنبيه', 'جاري تطوير هذه الميزة...', 'info');
        });
    }
}

/**
 * تصفية الإشعارات حسب النوع
 * @param {string} tabId معرف التبويب
 */
function filterNotifications(tabId) {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    switch (tabId) {
        case 'all':
            // عرض جميع الإشعارات
            notificationItems.forEach(item => {
                item.style.display = 'flex';
            });
            break;
        case 'unread':
            // عرض الإشعارات غير المقروءة فقط
            notificationItems.forEach(item => {
                if (item.classList.contains('unread')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            break;
        case 'important':
            // عرض الإشعارات المهمة فقط (الأخطاء والتحذيرات)
            notificationItems.forEach(item => {
                const iconElement = item.querySelector('.notification-icon i');
                if (iconElement && (iconElement.classList.contains('fa-times-circle') || iconElement.classList.contains('fa-exclamation-triangle'))) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            break;
    }
}