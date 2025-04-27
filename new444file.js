/**
 * ملف دمج نظام إدارة الموظفين مع نظام الاستثمار المتكامل
 * يقوم هذا الملف بدمج وتكامل نظام الموظفين مع التطبيق الرئيسي
 */

// استخدام نمط IIFE لتجنب تلوث النطاق العام
(function() {
    // تحديد نطاق محلي للمتغيرات لتجنب التضارب
    const MODULE_NAME = 'employeesModule';
    const EMPLOYEES_STORAGE_KEY = 'employees';
    const SALARIES_STORAGE_KEY = 'salaries';
    
    // التحقق من وجود النظام مسبقاً لتجنب التكرار
    if (window[MODULE_NAME]) {
        console.log('نظام الموظفين موجود بالفعل');
        return;
    }
    
    // تنفيذ الدمج عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        console.log('بدء دمج نظام الموظفين مع التطبيق الرئيسي...');
        
        // 1. إضافة عنصر الموظفين إلى القائمة الجانبية
        addEmployeesNavItem();
        
        // 2. إضافة صفحة الموظفين إلى التطبيق
        addEmployeesPage();
        
        // 3. إضافة أنماط CSS لصفحة الموظفين
        addEmployeesStyles();
        
        // 4. ربط وظائف نظام الموظفين بالتطبيق الرئيسي
        integrateEmployeesFunctions();
        
        console.log('تم دمج نظام الموظفين بنجاح!');
    });
    
    /**
     * إضافة عنصر الموظفين إلى القائمة الجانبية
     */
    function addEmployeesNavItem() {
        const navList = document.querySelector('.nav-list');
        if (!navList) {
            console.error('لم يتم العثور على القائمة الجانبية');
            return;
        }
        
        // عدم إضافة العنصر إذا كان موجوداً بالفعل
        if (document.querySelector('.nav-link[data-page="employees"]')) {
            return;
        }
        
        // إنشاء عنصر جديد
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        navItem.innerHTML = `
            <a class="nav-link" data-page="employees" href="#">
                <div class="nav-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <span>الموظفين</span>
            </a>
        `;
        
        // إدراج العنصر قبل عنصر الإعدادات
        const settingsItem = document.querySelector('.nav-link[data-page="settings"]');
        if (settingsItem) {
            const parentElement = settingsItem.closest('.nav-item');
            navList.insertBefore(navItem, parentElement);
        } else {
            // إضافة العنصر إلى نهاية القائمة إذا لم يتم العثور على عنصر الإعدادات
            navList.appendChild(navItem);
        }
        
        // تجنب تداخل مستمعات الأحداث
        const navLink = navItem.querySelector('.nav-link');
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تحديث حالة القائمة (إزالة الكلاس النشط من جميع الروابط)
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // إضافة الكلاس النشط للرابط المحدد
            this.classList.add('active');
            
            // إظهار صفحة الموظفين
            showPage('employees');
        });
        
        console.log('تمت إضافة عنصر الموظفين إلى القائمة الجانبية');
    }
    
    /**
     * إضافة صفحة الموظفين إلى التطبيق
     */
    function addEmployeesPage() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            console.error('لم يتم العثور على المحتوى الرئيسي');
            return;
        }
        
        // عدم إضافة الصفحة إذا كانت موجودة بالفعل
        if (document.getElementById('employees-page')) {
            return;
        }
        
        // إنشاء عنصر صفحة الموظفين
        const employeesPage = document.createElement('div');
        employeesPage.className = 'page';
        employeesPage.id = 'employees-page';
        employeesPage.style.display = 'none'; // إخفاء الصفحة افتراضياً
        employeesPage.innerHTML = `
            <div class="header">
                <button class="toggle-sidebar">
                    <i class="fas fa-bars"></i>
                </button>
                <h1 class="page-title">إدارة الموظفين</h1>
                <div class="header-actions">
                    <div class="search-box">
                        <input class="search-input" placeholder="بحث عن موظف..." type="text" />
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    <button class="btn btn-primary" id="add-employee-btn">
                        <i class="fas fa-plus"></i>
                        <span>إضافة موظف</span>
                    </button>
                </div>
            </div>
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">قائمة الموظفين</h2>
                    <div class="section-actions">
                        <div class="btn-group">
                            <button class="btn btn-outline btn-sm active" data-filter="all">الكل</button>
                            <button class="btn btn-outline btn-sm" data-filter="active">نشط</button>
                            <button class="btn btn-outline btn-sm" data-filter="inactive">غير نشط</button>
                        </div>
                        <button class="btn btn-outline btn-sm" id="export-employees-btn" title="تصدير">
                            <i class="fas fa-download"></i>
                            <span>تصدير</span>
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table id="employees-table">
                        <thead>
                            <tr>
                                <th>المعرف</th>
                                <th>الموظف</th>
                                <th>المسمى الوظيفي</th>
                                <th>رقم الهاتف</th>
                                <th>تاريخ التعيين</th>
                                <th>الراتب الأساسي</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- سيتم ملؤها ديناميكيًا -->
                        </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <div class="page-item disabled">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    <div class="page-item active">1</div>
                    <div class="page-item">2</div>
                    <div class="page-item">3</div>
                    <div class="page-item">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </div>
            </div>
            
            <!-- قسم تقارير الرواتب -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">تقارير الرواتب</h2>
                    <div class="section-actions">
                        <div class="form-group" style="display: inline-block; margin-left: 10px;">
                            <select class="form-select" id="salary-month">
                                <option value="1">يناير</option>
                                <option value="2">فبراير</option>
                                <option value="3">مارس</option>
                                <option value="4">أبريل</option>
                                <option value="5">مايو</option>
                                <option value="6">يونيو</option>
                                <option value="7">يوليو</option>
                                <option value="8">أغسطس</option>
                                <option value="9">سبتمبر</option>
                                <option value="10">أكتوبر</option>
                                <option value="11">نوفمبر</option>
                                <option value="12">ديسمبر</option>
                            </select>
                        </div>
                        <div class="form-group" style="display: inline-block; margin-left: 10px;">
                            <select class="form-select" id="salary-year">
                                <!-- سيتم ملؤها ديناميكيًا -->
                            </select>
                        </div>
                        <button class="btn btn-primary btn-sm" id="generate-payroll-btn">
                            <i class="fas fa-file-invoice-dollar"></i>
                            <span>إنشاء كشف الرواتب</span>
                        </button>
                        <button class="btn btn-outline btn-sm" id="export-payroll-btn" title="تصدير كشف الرواتب">
                            <i class="fas fa-download"></i>
                            <span>تصدير</span>
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table id="payroll-table">
                        <thead>
                            <tr>
                                <th>المعرف</th>
                                <th>الموظف</th>
                                <th>المسمى الوظيفي</th>
                                <th>الراتب الأساسي</th>
                                <th>نسبة المبيعات</th>
                                <th>قيمة المبيعات</th>
                                <th>مبلغ العمولة</th>
                                <th>البدلات</th>
                                <th>الاستقطاعات</th>
                                <th>صافي الراتب</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- سيتم ملؤها ديناميكيًا -->
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>الإجمالي</strong></td>
                                <td id="total-base-salary">0 دينار</td>
                                <td>-</td>
                                <td id="total-sales">0 دينار</td>
                                <td id="total-commission">0 دينار</td>
                                <td id="total-allowances">0 دينار</td>
                                <td id="total-deductions">0 دينار</td>
                                <td id="total-net-salary">0 دينار</td>
                                <td>-</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
        
        // إضافة الصفحة إلى المحتوى الرئيسي
        mainContent.appendChild(employeesPage);
        
        // إضافة النوافذ المنبثقة
        addEmployeesModals();
        
        console.log('تمت إضافة صفحة الموظفين إلى التطبيق');
    }
    
    /**
     * إضافة النوافذ المنبثقة لنظام الموظفين
     */
    function addEmployeesModals() {
        // التحقق من وجود النوافذ المنبثقة
        if (document.getElementById('employees-modals')) {
            return;
        }
        
        // إنشاء حاوية للنوافذ المنبثقة
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'employees-modals';
        
        // إضافة النوافذ المنبثقة
        modalsContainer.innerHTML = `
            <!-- نافذة إضافة موظف جديد -->
            <div class="modal-overlay" id="add-employee-modal">
                <div class="modal animate__animated animate__fadeInUp">
                    <div class="modal-header">
                        <h3 class="modal-title">إضافة موظف جديد</h3>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="add-employee-form">
                            <div class="grid-cols-2">
                                <div class="form-group">
                                    <label class="form-label">اسم الموظف</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-name" required="" type="text" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-name" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">رقم الهاتف</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-phone" required="" type="tel" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-phone" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">العنوان</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-address" required="" type="text" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-address" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">البريد الإلكتروني</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-email" type="email" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-email" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">رقم الهوية</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-id-number" required="" type="text" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-id-number" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">تاريخ التعيين</label>
                                    <input class="form-input" id="employee-hire-date" required="" type="date" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">المسمى الوظيفي</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-position" required="" type="text" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-position" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">القسم</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-department" required="" type="text" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-department" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">الراتب الأساسي (دينار)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-salary" min="0" required="" step="1000" type="number" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-salary" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">نسبة المبيعات (%)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-commission-rate" min="0" max="100" step="0.1" type="number" value="0" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-commission-rate" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">البدلات (دينار)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="employee-allowance" min="0" step="1000" type="number" value="0" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="employee-allowance" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">الحالة</label>
                                    <select class="form-select" id="employee-status">
                                        <option value="active">نشط</option>
                                        <option value="inactive">غير نشط</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline modal-close-btn">إلغاء</button>
                        <button class="btn btn-primary" id="save-employee-btn">إضافة</button>
                    </div>
                </div>
            </div>

            <!-- نافذة تفاصيل الموظف -->
            <div class="modal-overlay" id="employee-details-modal">
                <div class="modal animate__animated animate__fadeInUp">
                    <div class="modal-header">
                        <h3 class="modal-title">تفاصيل الموظف</h3>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body">
                        <div id="employee-details-content">
                            <!-- سيتم ملؤها ديناميكيًا -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline modal-close-btn">إغلاق</button>
                        <div class="btn-group">
                          <button class="btn btn-primary" id="edit-employee-btn">
                                <i class="fas fa-edit"></i>
                                <span>تعديل</span>
                            </button>
                            <button class="btn btn-success" id="pay-salary-btn">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>دفع الراتب</span>
                            </button>
                            <button class="btn btn-danger" id="delete-employee-btn">
                                <i class="fas fa-trash"></i>
                                <span>حذف</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- نافذة إضافة راتب -->
            <div class="modal-overlay" id="add-salary-modal">
                <div class="modal animate__animated animate__fadeInUp">
                    <div class="modal-header">
                        <h3 class="modal-title">إضافة راتب شهري</h3>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="add-salary-form">
                            <input type="hidden" id="salary-employee-id" value="" />
                            <div class="grid-cols-2">
                                <div class="form-group">
                                    <label class="form-label">الموظف</label>
                                    <input class="form-input" id="salary-employee-name" readonly type="text" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">الشهر</label>
                                    <select class="form-select" id="add-salary-month" required>
                                        <option value="1">يناير</option>
                                        <option value="2">فبراير</option>
                                        <option value="3">مارس</option>
                                        <option value="4">أبريل</option>
                                        <option value="5">مايو</option>
                                        <option value="6">يونيو</option>
                                        <option value="7">يوليو</option>
                                        <option value="8">أغسطس</option>
                                        <option value="9">سبتمبر</option>
                                        <option value="10">أكتوبر</option>
                                        <option value="11">نوفمبر</option>
                                        <option value="12">ديسمبر</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">السنة</label>
                                    <select class="form-select" id="add-salary-year" required>
                                        <!-- سيتم ملؤها ديناميكيًا -->
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">الراتب الأساسي (دينار)</label>
                                    <input class="form-input" id="salary-base" readonly type="number" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">نسبة المبيعات (%)</label>
                                    <input class="form-input" id="salary-commission-rate" readonly type="number" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">قيمة المبيعات (دينار)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="salary-sales-amount" min="0" required="" step="1000" type="number" value="0" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="salary-sales-amount" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">مبلغ العمولة (دينار)</label>
                                    <input class="form-input" id="salary-commission-amount" readonly type="number" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">البدلات (دينار)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="salary-allowance" min="0" step="1000" type="number" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="salary-allowance" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">الاستقطاعات (دينار)</label>
                                    <div class="input-group">
                                        <input class="form-input" id="salary-deduction" min="0" step="1000" type="number" value="0" />
                                        <button class="btn btn-icon-sm mic-btn" data-input="salary-deduction" type="button">
                                            <i class="fas fa-microphone"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">صافي الراتب (دينار)</label>
                                    <input class="form-input" id="salary-net" readonly type="number" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">ملاحظات</label>
                                    <textarea class="form-input" id="salary-notes" rows="3"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline modal-close-btn">إلغاء</button>
                        <button class="btn btn-primary" id="save-salary-btn">دفع الراتب</button>
                    </div>
                </div>
            </div>

            <!-- نافذة تفاصيل الراتب -->
            <div class="modal-overlay" id="salary-details-modal">
                <div class="modal animate__animated animate__fadeInUp">
                    <div class="modal-header">
                        <h3 class="modal-title">تفاصيل الراتب</h3>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body">
                        <div id="salary-details-content">
                            <!-- سيتم ملؤها ديناميكيًا -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline modal-close-btn">إغلاق</button>
                        <button class="btn btn-primary" id="print-salary-btn">
                            <i class="fas fa-print"></i>
                            <span>طباعة</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة النوافذ المنبثقة إلى الصفحة
        document.body.appendChild(modalsContainer);
        
        console.log('تمت إضافة النوافذ المنبثقة لنظام الموظفين');
    }
    
    /**
     * إضافة أنماط CSS لصفحة الموظفين
     */
    function addEmployeesStyles() {
        // التحقق من وجود أنماط مسبقة
        if (document.getElementById('employees-styles')) {
            return;
        }
        
        // إنشاء عنصر نمط جديد
        const styleElement = document.createElement('style');
        styleElement.id = 'employees-styles';
        
        // إضافة أنماط CSS
        styleElement.textContent = `
            /* أنماط صفحة الموظفين */
            #employees-page .employee-info {
                display: flex;
                align-items: center;
            }
            
            #employees-page .employee-avatar {
                width: 36px;
                height: 36px;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-left: 10px;
                font-size: 16px;
            }
            
            #employees-page .employee-avatar.large {
                width: 64px;
                height: 64px;
                font-size: 28px;
                margin: 0 auto 16px;
            }
            
            #employees-page .employee-name {
                font-weight: 600;
                margin-bottom: 2px;
            }
            
            #employees-page .employee-email,
            #employees-page .employee-phone {
                font-size: 0.85rem;
                color: #666;
            }
            
            #employees-page .employee-actions {
                display: flex;
                gap: 5px;
            }
            
            #employees-page .employee-action-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                border: 1px solid #ddd;
                background-color: white;
                color: #555;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            #employees-page .employee-action-btn:hover {
                background-color: #f5f5f5;
            }
            
            #employees-page .employee-action-btn.view-employee:hover {
                background-color: #e3f2fd;
                color: #1976d2;
                border-color: #1976d2;
            }
            
            #employees-page .employee-action-btn.edit:hover {
                background-color: #e8f5e9;
                color: #2e7d32;
                border-color: #2e7d32;
            }
            
            #employees-page .employee-action-btn.delete:hover {
                background-color: #ffebee;
                color: #c62828;
                border-color: #c62828;
            }
            
            /* أنماط الملف الشخصي */
            #employees-page .employee-profile {
                text-align: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            
            #employees-page .employee-fullname {
                font-size: 1.5rem;
                margin: 8px 0;
            }
            
            #employees-page .employee-position {
                color: #666;
                font-size: 0.9rem;
            }
            
            #employees-page .employee-stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 24px;
                flex-wrap: wrap;
            }
            
            #employees-page .stat-item {
                flex: 1;
                text-align: center;
                padding: 12px;
                background-color: #f9f9f9;
                border-radius: 8px;
                min-width: 120px;
                margin: 0 5px 10px;
            }
            
            #employees-page .stat-value {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--primary-color);
                margin-bottom: 4px;
            }
            
            #employees-page .stat-label {
                font-size: 0.8rem;
                color: #666;
            }
            
            /* أنماط مجموعات التفاصيل */
            #employees-page .detail-group {
                margin-bottom: 20px;
            }
            
            #employees-page .detail-group-title {
                font-size: 1.1rem;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid #eee;
            }
            
            #employees-page .detail-item {
                display: flex;
                margin-bottom: 8px;
            }
            
            #employees-page .detail-label {
                font-weight: bold;
                width: 150px;
                margin-left: 10px;
            }
            
            /* أنماط الجداول المصغرة */
            #employees-page .mini-table-container {
                margin-top: 10px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            #employees-page .mini-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            #employees-page .mini-table th,
            #employees-page .mini-table td {
                padding: 8px 12px;
                text-align: right;
                border: 1px solid #e0e0e0;
            }
            
            #employees-page .mini-table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            
            /* أنماط كشف الرواتب */
            #employees-page #payroll-table tr.no-salary {
                background-color: #f9f9f9;
            }
            
            #employees-page #payroll-table tfoot td {
                font-weight: bold;
                background-color: #f5f5f5;
            }
            
            /* أنماط تفاصيل الراتب */
            #salary-details-content .salary-header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            #salary-details-content .salary-title {
                font-size: 1.3rem;
                margin-bottom: 5px;
            }
            
            #salary-details-content .salary-date {
                color: #666;
                font-size: 0.9rem;
            }
            
            #salary-details-content .employee-info {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            
            #salary-details-content .employee-details {
                margin-right: 10px;
            }
            
            #salary-details-content .salary-components {
                display: flex;
                margin: 20px 0;
                gap: 20px;
            }
            
            #salary-details-content .component-group {
                flex: 1;
                padding: 0 10px;
            }
            
            #salary-details-content .component-group-title {
                font-size: 1.1rem;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid #eee;
            }
            
            #salary-details-content .salary-component {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
            }
            
            #salary-details-content .salary-component.total {
                font-weight: bold;
                border-top: 1px solid #eee;
                padding-top: 10px;
                margin-top: 5px;
            }
            
            #salary-details-content .salary-summary {
                display: flex;
                justify-content: space-between;
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                font-size: 1.2rem;
                font-weight: bold;
                margin-top: 20px;
            }
            
            #salary-details-content .salary-notes {
                margin-top: 20px;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            
            #salary-details-content .notes-label {
                font-weight: bold;
                margin-bottom: 5px;
            }
        `;
        
        // إضافة عنصر النمط إلى رأس الصفحة
        document.head.appendChild(styleElement);
        
        console.log('تمت إضافة أنماط CSS للموظفين');
    }
    
    /**
     * ربط وظائف نظام الموظفين بالتطبيق الرئيسي
     */
    function integrateEmployeesFunctions() {
        // تهيئة نظام الموظفين
        initEmployeesSystem();
        
        // ربط أحداث التنقل بين الصفحات
        setupPageNavigation();
        
        // دمج الوظائف مع النظام الرئيسي
        setupEmployeesData();
        
        console.log('تم ربط وظائف نظام الموظفين بنجاح');
    }
    
    /**
     * تهيئة نظام الموظفين
     */
    function initEmployeesSystem() {
        // إنشاء كائن النظام
        window[MODULE_NAME] = {
            // بيانات الموظفين والرواتب
            employees: [],
            salaries: [],
            
            // الدوال العامة التي يمكن استدعاؤها من خارج النظام
            addEmployee: addNewEmployee,
            editEmployee: editEmployee,
            deleteEmployee: deleteEmployee,
            showEmployeeDetails: showEmployeeDetails,
            generatePayroll: generatePayroll,
            exportPayroll: exportPayroll,
            
            // لاحقاً يتم إضافة المزيد من الدوال عند الحاجة
        };
        
        // تحميل بيانات الموظفين من التخزين المحلي
        loadEmployeesData();
    }
    
    /**
     * ربط أحداث التنقل بين الصفحات
     */
    function setupPageNavigation() {
        // حفظ الدالة الأصلية للتنقل بين الصفحات
        const originalShowPage = window.showPage || function(pageId) {
            // إخفاء جميع الصفحات
            document.querySelectorAll('.page').forEach(page => {
                page.style.display = 'none';
            });
            
            // إظهار الصفحة المطلوبة
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.style.display = 'block';
            }
        };
        
        // تعريف دالة جديدة للتنقل تدعم صفحة الموظفين
        window.showPage = function(pageId) {
            // استدعاء الدالة الأصلية
            originalShowPage(pageId);
            
            // الوظائف الإضافية لصفحة الموظفين
            if (pageId === 'employees') {
                console.log('تهيئة صفحة الموظفين...');
                
                // تهيئة قائمة السنوات
                initYearSelects();
                
                // عرض بيانات الموظفين
                renderEmployeesTable();
                
                // تهيئة أحداث البحث والتصفية
                setupEmployeeSearch();
                setupEmployeeFilters();
                
                // تهيئة أحداث الأزرار
                setupEmployeeButtons();
                
                // تهيئة أحداث كشف الرواتب
                setupPayrollEvents();
            }
        };
    }
    
    /**
     * تهيئة وإعداد بيانات الموظفين
     */
    function setupEmployeesData() {
        // إضافة مستمعات الأحداث للنوافذ المنبثقة
        setupModalEvents();
    }
    
    /**
     * تحميل بيانات الموظفين من التخزين المحلي
     */
    function loadEmployeesData() {
        try {
            // محاولة تحميل بيانات الموظفين
            const savedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
            if (savedEmployees) {
                window[MODULE_NAME].employees = JSON.parse(savedEmployees);
                console.log(`تم تحميل ${window[MODULE_NAME].employees.length} موظف من التخزين المحلي`);
            }
            
            // محاولة تحميل بيانات الرواتب
            const savedSalaries = localStorage.getItem(SALARIES_STORAGE_KEY);
            if (savedSalaries) {
                window[MODULE_NAME].salaries = JSON.parse(savedSalaries);
                console.log(`تم تحميل ${window[MODULE_NAME].salaries.length} سجل راتب من التخزين المحلي`);
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات الموظفين:', error);
            // إعادة تعيين البيانات في حالة حدوث خطأ
            window[MODULE_NAME].employees = [];
            window[MODULE_NAME].salaries = [];
        }
    }
    
    /**
     * حفظ بيانات الموظفين في التخزين المحلي
     */
    function saveEmployeesData() {
        try {
            localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(window[MODULE_NAME].employees));
            localStorage.setItem(SALARIES_STORAGE_KEY, JSON.stringify(window[MODULE_NAME].salaries));
            console.log('تم حفظ بيانات الموظفين بنجاح');
            return true;
        } catch (error) {
            console.error('خطأ في حفظ بيانات الموظفين:', error);
            if (typeof showNotification === 'function') {
                showNotification('حدث خطأ أثناء حفظ البيانات', 'error');
            }
            return false;
        }
    }
    
    /**
     * تهيئة قائمة السنوات في النماذج
     */
    function initYearSelects() {
        // الحصول على السنة الحالية
        const currentYear = new Date().getFullYear();
        
        // إنشاء قائمة بالسنوات (السنة الحالية و5 سنوات سابقة)
        const years = [];
        for (let i = 0; i < 6; i++) {
            years.push(currentYear - i);
        }
        
        // ملء قائمة السنوات في تقرير الرواتب
        const salaryYearSelect = document.getElementById('salary-year');
        if (salaryYearSelect) {
            salaryYearSelect.innerHTML = '';
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                salaryYearSelect.appendChild(option);
            });
        }
        
        // ملء قائمة السنوات في نموذج إضافة راتب
        const addSalaryYearSelect = document.getElementById('add-salary-year');
        if (addSalaryYearSelect) {
            addSalaryYearSelect.innerHTML = '';
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                addSalaryYearSelect.appendChild(option);
            });
        }
        
        // تعيين الشهر والسنة الحالية كقيم افتراضية
        const currentMonth = new Date().getMonth() + 1; // الشهور تبدأ من 0
        
        const salaryMonthSelect = document.getElementById('salary-month');
        if (salaryMonthSelect) {
            salaryMonthSelect.value = currentMonth.toString();
        }
        
        const addSalaryMonthSelect = document.getElementById('add-salary-month');
        if (addSalaryMonthSelect) {
            addSalaryMonthSelect.value = currentMonth.toString();
        }
    }