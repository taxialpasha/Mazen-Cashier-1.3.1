/**
     * إعداد أحداث النوافذ المنبثقة
     */
    function setupModalEvents() {
        // أزرار إغلاق النوافذ المنبثقة
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay');
                if (modal) {
                    closeModal(modal.id);
                }
            });
        });
        
        // النقر خارج النافذة المنبثقة لإغلاقها
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this.id);
                }
            });
        });
        
        // منع انتشار النقر من داخل النافذة
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    }
    
    /**
     * تهيئة أحداث البحث في الموظفين
     */
    function setupEmployeeSearch() {
        const searchInput = document.querySelector('#employees-page .search-input');
        if (searchInput) {
            // إزالة مستمعات الأحداث القديمة لتجنب التكرار
            searchInput.removeEventListener('input', searchEmployees);
            
            // إضافة مستمع جديد
            searchInput.addEventListener('input', function() {
                searchEmployees(this.value);
            });
        }
    }
    
    /**
     * تهيئة أحداث تصفية الموظفين
     */
    function setupEmployeeFilters() {
        const filterButtons = document.querySelectorAll('#employees-page .btn-group .btn[data-filter]');
        filterButtons.forEach(button => {
            // إزالة مستمعات الأحداث القديمة
            button.removeEventListener('click', handleFilterClick);
            
            // إضافة مستمع جديد
            button.addEventListener('click', handleFilterClick);
        });
        
        // دالة معالجة النقر على زر التصفية
        function handleFilterClick() {
            // تحديث حالة الأزرار
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // تصفية القائمة
            const filter = this.getAttribute('data-filter');
            filterEmployees(filter);
        }
    }
    
    /**
     * تهيئة أحداث أزرار الموظفين
     */
    function setupEmployeeButtons() {
        // زر إضافة موظف جديد
        const addEmployeeBtn = document.getElementById('add-employee-btn');
        if (addEmployeeBtn) {
            // إزالة مستمعات الأحداث القديمة
            addEmployeeBtn.removeEventListener('click', handleAddEmployeeClick);
            
            // إضافة مستمع جديد
            addEmployeeBtn.addEventListener('click', handleAddEmployeeClick);
        }
        
        // زر حفظ الموظف
        const saveEmployeeBtn = document.getElementById('save-employee-btn');
        if (saveEmployeeBtn) {
            // إزالة مستمعات الأحداث القديمة
            saveEmployeeBtn.removeEventListener('click', addNewEmployee);
            
            // إضافة مستمع جديد
            saveEmployeeBtn.addEventListener('click', addNewEmployee);
        }
        
        // زر تصدير قائمة الموظفين
        const exportEmployeesBtn = document.getElementById('export-employees-btn');
        if (exportEmployeesBtn) {
            // إزالة مستمعات الأحداث القديمة
            exportEmployeesBtn.removeEventListener('click', exportEmployees);
            
            // إضافة مستمع جديد
            exportEmployeesBtn.addEventListener('click', exportEmployees);
        }
    }
    
    /**
     * معالجة النقر على زر إضافة موظف
     */
    function handleAddEmployeeClick() {
        // إعادة تعيين النموذج
        const form = document.getElementById('add-employee-form');
        if (form) form.reset();
        
        // تعيين تاريخ اليوم كتاريخ افتراضي للتعيين
        const hireDateInput = document.getElementById('employee-hire-date');
        if (hireDateInput) hireDateInput.value = new Date().toISOString().split('T')[0];
        
// تغيير عنوان النافذة وزر الحفظ
        const modalTitle = document.querySelector('#add-employee-modal .modal-title');
        if (modalTitle) modalTitle.textContent = 'إضافة موظف جديد';
        
        const saveBtn = document.getElementById('save-employee-btn');
        if (saveBtn) {
            saveBtn.textContent = 'إضافة';
            saveBtn.onclick = addNewEmployee;
        }
        
        // فتح النافذة المنبثقة
        openModal('add-employee-modal');
    }
    
    /**
     * تهيئة أحداث كشف الرواتب
     */
    function setupPayrollEvents() {
        // زر إنشاء كشف الرواتب
        const generatePayrollBtn = document.getElementById('generate-payroll-btn');
        if (generatePayrollBtn) {
            // إزالة مستمعات الأحداث القديمة
            generatePayrollBtn.removeEventListener('click', generatePayroll);
            
            // إضافة مستمع جديد
            generatePayrollBtn.addEventListener('click', generatePayroll);
        }
        
        // زر تصدير كشف الرواتب
        const exportPayrollBtn = document.getElementById('export-payroll-btn');
        if (exportPayrollBtn) {
            // إزالة مستمعات الأحداث القديمة
            exportPayrollBtn.removeEventListener('click', exportPayroll);
            
            // إضافة مستمع جديد
            exportPayrollBtn.addEventListener('click', exportPayroll);
        }
        
        // مستمع تغيير قيمة المبيعات
        const salesAmountInput = document.getElementById('salary-sales-amount');
        if (salesAmountInput) {
            // إزالة مستمعات الأحداث القديمة
            salesAmountInput.removeEventListener('input', calculateCommission);
            
            // إضافة مستمع جديد
            salesAmountInput.addEventListener('input', calculateCommission);
        }
        
        // مستمعات تغيير البدلات والاستقطاعات
        const allowanceInput = document.getElementById('salary-allowance');
        const deductionInput = document.getElementById('salary-deduction');
        
        if (allowanceInput) {
            // إزالة مستمعات الأحداث القديمة
            allowanceInput.removeEventListener('input', calculateNetSalary);
            
            // إضافة مستمع جديد
            allowanceInput.addEventListener('input', calculateNetSalary);
        }
        
        if (deductionInput) {
            // إزالة مستمعات الأحداث القديمة
            deductionInput.removeEventListener('input', calculateNetSalary);
            
            // إضافة مستمع جديد
            deductionInput.addEventListener('input', calculateNetSalary);
        }
        
        // زر حفظ الراتب
        const saveSalaryBtn = document.getElementById('save-salary-btn');
        if (saveSalaryBtn) {
            // إزالة مستمعات الأحداث القديمة
            saveSalaryBtn.removeEventListener('click', saveEmployeeSalary);
            
            // إضافة مستمع جديد
            saveSalaryBtn.addEventListener('click', saveEmployeeSalary);
        }
    }
    
    /**
     * عرض جدول الموظفين
     */
    function renderEmployeesTable() {
        const tableBody = document.querySelector('#employees-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // ترتيب الموظفين حسب تاريخ التعيين (الأحدث أولاً)
        const sortedEmployees = [...window[MODULE_NAME].employees].sort((a, b) => {
            return new Date(b.hireDate) - new Date(a.hireDate);
        });
        
        if (sortedEmployees.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="8" class="text-center">لا يوجد موظفين</td>';
            tableBody.appendChild(emptyRow);
            return;
        }
        
        sortedEmployees.forEach(employee => {
            const row = document.createElement('tr');
            
            // تنسيق التاريخ للعرض
            const hireDate = new Date(employee.hireDate).toLocaleDateString();
            
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">${employee.name.charAt(0)}</div>
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-email">${employee.email || employee.phone}</div>
                        </div>
                    </div>
                </td>
                <td>${employee.position}</td>
                <td>${employee.phone}</td>
                <td>${hireDate}</td>
                <td>${formatCurrency(employee.salary)}</td>
                <td><span class="badge badge-${employee.status === 'active' ? 'success' : 'danger'}">${employee.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <div class="employee-actions">
                        <button class="employee-action-btn view-employee" data-id="${employee.id}" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="employee-action-btn edit edit-employee" data-id="${employee.id}" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="employee-action-btn delete delete-employee" data-id="${employee.id}" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // إضافة مستمعات الأحداث للأزرار بعد إنشاء الجدول
        addEmployeeActionListeners();
    }
    
    /**
     * إضافة مستمعات الأحداث لأزرار الإجراءات في جدول الموظفين
     */
    function addEmployeeActionListeners() {
        // أزرار عرض التفاصيل
        document.querySelectorAll('.view-employee').forEach(button => {
            button.addEventListener('click', function() {
                const employeeId = this.getAttribute('data-id');
                showEmployeeDetails(employeeId);
            });
        });
        
        // أزرار التعديل
        document.querySelectorAll('.edit-employee').forEach(button => {
            button.addEventListener('click', function() {
                const employeeId = this.getAttribute('data-id');
                editEmployee(employeeId);
            });
        });
        
        // أزرار الحذف
        document.querySelectorAll('.delete-employee').forEach(button => {
            button.addEventListener('click', function() {
                const employeeId = this.getAttribute('data-id');
                deleteEmployee(employeeId);
            });
        });
    }
    
    /**
     * البحث في الموظفين
     */
    function searchEmployees(query) {
        console.log(`البحث عن الموظفين: ${query}`);
        
        query = query.trim().toLowerCase();
        
        if (!query) {
            // إذا كان البحث فارغًا، نعيد عرض جميع الموظفين
            renderEmployeesTable();
            return;
        }
        
        // تصفية الموظفين حسب البحث
        const filtered = window[MODULE_NAME].employees.filter(employee => {
            return employee.name.toLowerCase().includes(query) ||
                   employee.phone.toLowerCase().includes(query) ||
                   (employee.email && employee.email.toLowerCase().includes(query)) ||
                   employee.position.toLowerCase().includes(query) ||
                   employee.department.toLowerCase().includes(query) ||
                   employee.id.toLowerCase().includes(query);
        });
        
        // عرض النتائج المصفاة
        const tableBody = document.querySelector('#employees-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (filtered.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="8" class="text-center">لم يتم العثور على نتائج للبحث: "${query}"</td>`;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // عرض الموظفين المصفاة
        filtered.forEach(employee => {
            const row = document.createElement('tr');
            
            // تنسيق التاريخ للعرض
            const hireDate = new Date(employee.hireDate).toLocaleDateString();
            
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">${employee.name.charAt(0)}</div>
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-email">${employee.email || employee.phone}</div>
                        </div>
                    </div>
                </td>
                <td>${employee.position}</td>
                <td>${employee.phone}</td>
                <td>${hireDate}</td>
                <td>${formatCurrency(employee.salary)}</td>
                <td><span class="badge badge-${employee.status === 'active' ? 'success' : 'danger'}">${employee.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <div class="employee-actions">
                        <button class="employee-action-btn view-employee" data-id="${employee.id}" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="employee-action-btn edit edit-employee" data-id="${employee.id}" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="employee-action-btn delete delete-employee" data-id="${employee.id}" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // إضافة مستمعات الأحداث للأزرار
        addEmployeeActionListeners();
    }
    
    /**
     * تصفية الموظفين
     */
    function filterEmployees(filter) {
        console.log(`تصفية الموظفين: ${filter}`);
        
        // تصفية الموظفين
        let filteredEmployees = [...window[MODULE_NAME].employees];
        
        if (filter === 'active') {
            filteredEmployees = filteredEmployees.filter(emp => emp.status === 'active');
        } else if (filter === 'inactive') {
            filteredEmployees = filteredEmployees.filter(emp => emp.status === 'inactive');
        }
        
        // عرض النتائج المصفاة
        const tableBody = document.querySelector('#employees-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (filteredEmployees.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="8" class="text-center">لا يوجد موظفين مطابقين للتصفية</td>';
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // ترتيب الموظفين حسب تاريخ التعيين (الأحدث أولاً)
        filteredEmployees.sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate));
        
        // عرض الموظفين المصفاة
        filteredEmployees.forEach(employee => {
            const row = document.createElement('tr');
            
            // تنسيق التاريخ للعرض
            const hireDate = new Date(employee.hireDate).toLocaleDateString();
            
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">${employee.name.charAt(0)}</div>
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-email">${employee.email || employee.phone}</div>
                        </div>
                    </div>
                </td>
                <td>${employee.position}</td>
                <td>${employee.phone}</td>
                <td>${hireDate}</td>
                <td>${formatCurrency(employee.salary)}</td>
                <td><span class="badge badge-${employee.status === 'active' ? 'success' : 'danger'}">${employee.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                    <div class="employee-actions">
                        <button class="employee-action-btn view-employee" data-id="${employee.id}" title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="employee-action-btn edit edit-employee" data-id="${employee.id}" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="employee-action-btn delete delete-employee" data-id="${employee.id}" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // إضافة مستمعات الأحداث للأزرار
        addEmployeeActionListeners();
    }
    
    /**
     * إضافة موظف جديد
     */
    function addNewEmployee() {
        console.log('إضافة موظف جديد...');
        
        // الحصول على قيم النموذج
        const name = document.getElementById('employee-name').value;
        const phone = document.getElementById('employee-phone').value;
        const address = document.getElementById('employee-address').value;
        const email = document.getElementById('employee-email').value;
        const idNumber = document.getElementById('employee-id-number').value;
        const hireDate = document.getElementById('employee-hire-date').value;
        const position = document.getElementById('employee-position').value;
        const department = document.getElementById('employee-department').value;
        const salary = parseFloat(document.getElementById('employee-salary').value);
        const commissionRate = parseFloat(document.getElementById('employee-commission-rate').value) || 0;
        const allowance = parseFloat(document.getElementById('employee-allowance').value) || 0;
        const status = document.getElementById('employee-status').value;
        
        // التحقق من إدخال البيانات الإلزامية
        if (!name || !phone || !idNumber || !hireDate || !position || !department || isNaN(salary)) {
            if (typeof showNotification === 'function') {
                showNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
            } else {
                alert('يرجى إدخال جميع البيانات المطلوبة');
            }
            return;
        }
        
        // إنشاء موظف جديد
        const newEmployee = {
            id: Date.now().toString(),
            name,
            phone,
            address,
            email,
            idNumber,
            hireDate,
            position,
            department,
            salary,
            commissionRate,
            allowance,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // إضافة الموظف إلى المصفوفة
        window[MODULE_NAME].employees.push(newEmployee);
        
        // حفظ البيانات
        saveEmployeesData();
        
        // تحديث العرض
        renderEmployeesTable();
        
        // إغلاق النافذة المنبثقة
        closeModal('add-employee-modal');
        
        // عرض إشعار
        if (typeof showNotification === 'function') {
            showNotification(`تمت إضافة الموظف ${name} بنجاح!`, 'success');
        } else {
            alert(`تمت إضافة الموظف ${name} بنجاح!`);
        }
    }
    
    /**
     * عرض تفاصيل الموظف
     */
    function showEmployeeDetails(employeeId) {
        console.log(`عرض تفاصيل الموظف: ${employeeId}`);
        
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === employeeId);
        if (!employee) {
            if (typeof showNotification === 'function') {
                showNotification('لم يتم العثور على الموظف', 'error');
            } else {
                alert('لم يتم العثور على الموظف');
            }
            return;
        }
        
        // الحصول على تاريخ التوظيف كتاريخ
        const hireDate = new Date(employee.hireDate);
        const today = new Date();
        const employmentDuration = Math.floor((today - hireDate) / (1000 * 60 * 60 * 24 * 30)); // بالأشهر
        
        // الحصول على رواتب الموظف
        const employeeSalaries = window[MODULE_NAME].salaries.filter(salary => salary.employeeId === employeeId);
        
        // حساب الإحصائيات
        const totalSalaries = employeeSalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
        const averageSalary = employeeSalaries.length > 0 ? totalSalaries / employeeSalaries.length : 0;
        const lastSalary = employeeSalaries.length > 0 ? 
            employeeSalaries.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
        
        // إنشاء محتوى التفاصيل
        const content = `
            <div class="employee-profile">
                <div class="employee-avatar large">${employee.name.charAt(0)}</div>
                <h2 class="employee-fullname">${employee.name}</h2>
                <span class="badge badge-${employee.status === 'active' ? 'success' : 'danger'}">
                    ${employee.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
                <div class="employee-position">${employee.position} - ${employee.department}</div>
            </div>
            
            <div class="employee-stats">
                <div class="stat-item">
                    <div class="stat-value">${employmentDuration}</div>
                    <div class="stat-label">أشهر الخدمة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatCurrency(employee.salary)}</div>
                    <div class="stat-label">الراتب الأساسي</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${employee.commissionRate}%</div>
                    <div class="stat-label">نسبة العمولة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatCurrency(employee.allowance)}</div>
                    <div class="stat-label">البدلات</div>
                </div>
            </div>
            
            <div class="detail-group">
                <h3 class="detail-group-title">معلومات الاتصال</h3>
                <div class="detail-item">
                    <div class="detail-label">رقم الهاتف</div>
                    <div class="detail-value">${employee.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">البريد الإلكتروني</div>
                    <div class="detail-value">${employee.email || 'غير محدد'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">العنوان</div>
                    <div class="detail-value">${employee.address || 'غير محدد'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">رقم الهوية</div>
                    <div class="detail-value">${employee.idNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">تاريخ التعيين</div>
                    <div class="detail-value">${new Date(employee.hireDate).toLocaleDateString()}</div>
                </div>
            </div>
            
            <div class="detail-group">
                <h3 class="detail-group-title">إحصائيات الرواتب</h3>
                <div class="detail-item">
                    <div class="detail-label">عدد الرواتب المدفوعة</div>
                    <div class="detail-value">${employeeSalaries.length}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">إجمالي الرواتب المدفوعة</div>
                    <div class="detail-value">${formatCurrency(totalSalaries)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">متوسط الراتب</div>
                    <div class="detail-value">${formatCurrency(averageSalary)}</div>
                </div>
                ${lastSalary ? `
                <div class="detail-item">
                    <div class="detail-label">آخر راتب</div>
                    <div class="detail-value">${formatCurrency(lastSalary.netSalary)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">تاريخ آخر راتب</div>
                    <div class="detail-value">${new Date(lastSalary.date).toLocaleDateString()}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="detail-group">
                <h3 class="detail-group-title">آخر الرواتب</h3>
                <div class="mini-table-container">
                    <table class="mini-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>الشهر/السنة</th>
                                <th>صافي الراتب</th>
                                <th>العمولة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employeeSalaries.length > 0 ? 
                                employeeSalaries.slice(0, 5).map(salary => `
                                    <tr>
                                        <td>${new Date(salary.date).toLocaleDateString()}</td>
                                        <td>${getMonthName(salary.month)}/${salary.year}</td>
                                        <td>${formatCurrency(salary.netSalary)}</td>
                                        <td>${formatCurrency(salary.commission)}</td>
                                    </tr>
                                `).join('') : 
                                '<tr><td colspan="4">لا توجد رواتب مسجلة</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // عرض النافذة المنبثقة
        const detailsContent = document.getElementById('employee-details-content');
        if (detailsContent) {
            detailsContent.innerHTML = content;
        }
        
        // فتح النافذة المنبثقة
        openModal('employee-details-modal');
        
        // تعيين وظائف الأزرار
        const editEmployeeBtn = document.getElementById('edit-employee-btn');
        const paySalaryBtn = document.getElementById('pay-salary-btn');
        const deleteEmployeeBtn = document.getElementById('delete-employee-btn');
        
        if (editEmployeeBtn) {
            editEmployeeBtn.onclick = () => {
                closeModal('employee-details-modal');
                editEmployee(employeeId);
            };
        }
        
        if (paySalaryBtn) {
            paySalaryBtn.onclick = () => {
                closeModal('employee-details-modal');
                openSalaryModal(employeeId);
            };
        }
        
        if (deleteEmployeeBtn) {
            deleteEmployeeBtn.onclick = () => {
                closeModal('employee-details-modal');
                deleteEmployee(employeeId);
            };
        }
    }
    
    
    
    
    /**
     * تعديل بيانات موظف
     */
    function editEmployee(employeeId) {
        console.log(`تعديل بيانات الموظف: ${employeeId}`);
        
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === employeeId);
        if (!employee) {
            if (typeof showNotification === 'function') {
                showNotification('لم يتم العثور على الموظف', 'error');
            } else {
                alert('لم يتم العثور على الموظف');
            }
            return;
        }
        
        // ملء النموذج ببيانات الموظف
        document.getElementById('employee-name').value = employee.name;
        document.getElementById('employee-phone').value = employee.phone;
        document.getElementById('employee-address').value = employee.address || '';
        document.getElementById('employee-email').value = employee.email || '';
        document.getElementById('employee-id-number').value = employee.idNumber;
        document.getElementById('employee-hire-date').value = employee.hireDate;
        document.getElementById('employee-position').value = employee.position;
        document.getElementById('employee-department').value = employee.department;
        document.getElementById('employee-salary').value = employee.salary;
        document.getElementById('employee-commission-rate').value = employee.commissionRate || 0;
        document.getElementById('employee-allowance').value = employee.allowance || 0;
        document.getElementById('employee-status').value = employee.status;
        
        // تغيير عنوان النافذة
        const modalTitle = document.querySelector('#add-employee-modal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'تعديل بيانات الموظف';
        }
        
        // تغيير نص زر الحفظ
        const saveBtn = document.getElementById('save-employee-btn');
        if (saveBtn) {
            saveBtn.textContent = 'حفظ التعديلات';
            
            // تغيير وظيفة زر الحفظ
            saveBtn.onclick = function() {
                // جمع البيانات المحدثة
                const updatedEmployee = {
                    ...employee,
                    name: document.getElementById('employee-name').value,
                    phone: document.getElementById('employee-phone').value,
                    address: document.getElementById('employee-address').value,
                    email: document.getElementById('employee-email').value,
                    idNumber: document.getElementById('employee-id-number').value,
                    hireDate: document.getElementById('employee-hire-date').value,
                    position: document.getElementById('employee-position').value,
                    department: document.getElementById('employee-department').value,
                    salary: parseFloat(document.getElementById('employee-salary').value),
                    commissionRate: parseFloat(document.getElementById('employee-commission-rate').value) || 0,
                    allowance: parseFloat(document.getElementById('employee-allowance').value) || 0,
                status: document.getElementById('employee-status').value,
                    updatedAt: new Date().toISOString()
                };
                
                // التحقق من البيانات المطلوبة
                if (!updatedEmployee.name || !updatedEmployee.phone || !updatedEmployee.idNumber || 
                    !updatedEmployee.hireDate || !updatedEmployee.position || !updatedEmployee.department || 
                    isNaN(updatedEmployee.salary)) {
                    if (typeof showNotification === 'function') {
                        showNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                    } else {
                        alert('يرجى إدخال جميع البيانات المطلوبة');
                    }
                    return;
                }
                
                // تحديث بيانات الموظف
                const index = window[MODULE_NAME].employees.findIndex(emp => emp.id === employeeId);
                if (index !== -1) {
                    window[MODULE_NAME].employees[index] = updatedEmployee;
                    
                    // حفظ البيانات
                    saveEmployeesData();
                    
                    // تحديث العرض
                    renderEmployeesTable();
                    
                    // إغلاق النافذة المنبثقة
                    closeModal('add-employee-modal');
                    
                    // عرض إشعار
                    if (typeof showNotification === 'function') {
                        showNotification(`تم تحديث بيانات الموظف ${updatedEmployee.name} بنجاح!`, 'success');
                    } else {
                        alert(`تم تحديث بيانات الموظف ${updatedEmployee.name} بنجاح!`);
                    }
                }
                
                // استعادة الإعدادات الافتراضية للنافذة
                if (modalTitle) {
                    modalTitle.textContent = 'إضافة موظف جديد';
                }
                
                saveBtn.textContent = 'إضافة';
                saveBtn.onclick = addNewEmployee;
            };
        }
        
        // فتح النافذة المنبثقة
        openModal('add-employee-modal');
    }
    
    /**
     * حذف موظف
     */
    function deleteEmployee(employeeId) {
        console.log(`حذف الموظف: ${employeeId}`);
        
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === employeeId);
        if (!employee) {
            if (typeof showNotification === 'function') {
                showNotification('لم يتم العثور على الموظف', 'error');
            } else {
                alert('لم يتم العثور على الموظف');
            }
            return;
        }
        
        // طلب تأكيد الحذف
        if (!confirm(`هل أنت متأكد من رغبتك في حذف الموظف ${employee.name}؟\nسيتم حذف جميع البيانات المتعلقة به.`)) {
            return;
        }
        
        // حذف الموظف
        window[MODULE_NAME].employees = window[MODULE_NAME].employees.filter(emp => emp.id !== employeeId);
        
        // حذف رواتب الموظف
        window[MODULE_NAME].salaries = window[MODULE_NAME].salaries.filter(salary => salary.employeeId !== employeeId);
        
        // حفظ البيانات
        saveEmployeesData();
        
        // تحديث العرض
        renderEmployeesTable();
        
        // عرض إشعار
        if (typeof showNotification === 'function') {
            showNotification(`تم حذف الموظف ${employee.name} بنجاح`, 'success');
        } else {
            alert(`تم حذف الموظف ${employee.name} بنجاح`);
        }
    }
    
    /**
     * فتح نافذة إضافة راتب
     */
    function openSalaryModal(employeeId) {
        console.log(`فتح نافذة إضافة راتب للموظف: ${employeeId}`);
        
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === employeeId);
        if (!employee) {
            if (typeof showNotification === 'function') {
                showNotification('لم يتم العثور على الموظف', 'error');
            } else {
                alert('لم يتم العثور على الموظف');
            }
            return;
        }
        
        // تعيين قيم النموذج
        document.getElementById('salary-employee-id').value = employee.id;
        document.getElementById('salary-employee-name').value = employee.name;
        document.getElementById('salary-base').value = employee.salary;
        document.getElementById('salary-commission-rate').value = employee.commissionRate || 0;
        document.getElementById('salary-allowance').value = employee.allowance || 0;
        document.getElementById('salary-sales-amount').value = 0;
        document.getElementById('salary-deduction').value = 0;
        
        // حساب العمولة وصافي الراتب
        calculateCommission();
        
        // فتح النافذة المنبثقة
        openModal('add-salary-modal');
    }
    
    /**
     * حساب العمولة بناءً على المبيعات ونسبة العمولة
     */
    function calculateCommission() {
        const salesAmount = parseFloat(document.getElementById('salary-sales-amount').value) || 0;
        const commissionRate = parseFloat(document.getElementById('salary-commission-rate').value) || 0;
        
        // حساب مبلغ العمولة
        const commissionAmount = salesAmount * (commissionRate / 100);
        
        // تعيين مبلغ العمولة
        const commissionAmountInput = document.getElementById('salary-commission-amount');
        if (commissionAmountInput) {
            commissionAmountInput.value = commissionAmount;
        }
        
        // حساب صافي الراتب
        calculateNetSalary();
    }
    
    /**
     * حساب صافي الراتب
     */
    function calculateNetSalary() {
        const baseSalary = parseFloat(document.getElementById('salary-base').value) || 0;
        const commissionAmount = parseFloat(document.getElementById('salary-commission-amount').value) || 0;
        const allowance = parseFloat(document.getElementById('salary-allowance').value) || 0;
        const deduction = parseFloat(document.getElementById('salary-deduction').value) || 0;
        
        // حساب صافي الراتب
        const netSalary = baseSalary + commissionAmount + allowance - deduction;
        
        // تعيين صافي الراتب
        const netSalaryInput = document.getElementById('salary-net');
        if (netSalaryInput) {
            netSalaryInput.value = netSalary;
        }
    }
    
    /**
     * حفظ راتب الموظف
     */
    function saveEmployeeSalary() {
        // الحصول على بيانات النموذج
        const employeeId = document.getElementById('salary-employee-id').value;
        const employeeName = document.getElementById('salary-employee-name').value;
        const month = parseInt(document.getElementById('add-salary-month').value);
        const year = parseInt(document.getElementById('add-salary-year').value);
        const baseSalary = parseFloat(document.getElementById('salary-base').value) || 0;
        const commissionRate = parseFloat(document.getElementById('salary-commission-rate').value) || 0;
        const salesAmount = parseFloat(document.getElementById('salary-sales-amount').value) || 0;
        const commission = parseFloat(document.getElementById('salary-commission-amount').value) || 0;
        const allowance = parseFloat(document.getElementById('salary-allowance').value) || 0;
        const deduction = parseFloat(document.getElementById('salary-deduction').value) || 0;
        const netSalary = parseFloat(document.getElementById('salary-net').value) || 0;
        const notes = document.getElementById('salary-notes').value || '';
        
        // التحقق من البيانات
        if (!employeeId || isNaN(month) || isNaN(year) || isNaN(baseSalary)) {
            if (typeof showNotification === 'function') {
                showNotification('يرجى التحقق من البيانات المدخلة', 'error');
            } else {
                alert('يرجى التحقق من البيانات المدخلة');
            }
            return;
        }
        
        // التحقق من وجود راتب سابق لنفس الشهر والسنة
        const existingSalary = window[MODULE_NAME].salaries.find(salary => 
            salary.employeeId === employeeId && 
            salary.month === month && 
            salary.year === year
        );
        
        if (existingSalary) {
            const confirmUpdate = confirm(
                `يوجد راتب مسجل بالفعل للموظف ${employeeName} لشهر ${getMonthName(month)} ${year}.\n` +
                `هل تريد تحديث بيانات الراتب؟`
            );
            
            if (!confirmUpdate) {
                return;
            }
            
            // تحديث الراتب الموجود
            existingSalary.baseSalary = baseSalary;
            existingSalary.commissionRate = commissionRate;
            existingSalary.salesAmount = salesAmount;
            existingSalary.commission = commission;
            existingSalary.allowance = allowance;
            existingSalary.deduction = deduction;
            existingSalary.netSalary = netSalary;
            existingSalary.notes = notes;
            existingSalary.updatedAt = new Date().toISOString();
            
            if (typeof showNotification === 'function') {
                showNotification(`تم تحديث راتب ${employeeName} لشهر ${getMonthName(month)} ${year} بنجاح`, 'success');
            } else {
                alert(`تم تحديث راتب ${employeeName} لشهر ${getMonthName(month)} ${year} بنجاح`);
            }
        } else {
            // إنشاء راتب جديد
            const newSalary = {
                id: Date.now().toString(),
                employeeId,
                employeeName,
                month,
                year,
                date: new Date().toISOString(),
                baseSalary,
                commissionRate,
                salesAmount,
                commission,
                allowance,
                deduction,
                netSalary,
                notes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // إضافة الراتب إلى المصفوفة
            window[MODULE_NAME].salaries.push(newSalary);
            
            if (typeof showNotification === 'function') {
                showNotification(`تم إضافة راتب ${employeeName} لشهر ${getMonthName(month)} ${year} بنجاح`, 'success');
            } else {
                alert(`تم إضافة راتب ${employeeName} لشهر ${getMonthName(month)} ${year} بنجاح`);
            }
        }
        
        // حفظ البيانات
        saveEmployeesData();
        
        // إغلاق النافذة المنبثقة
        closeModal('add-salary-modal');
        
        // إذا كان كشف الرواتب معروضاً، قم بتحديثه
        const payrollTable = document.getElementById('payroll-table');
        if (payrollTable && payrollTable.closest('.section').style.display !== 'none') {
            generatePayroll();
        }
    }
    
    /**
     * إنشاء كشف الرواتب
     */
    function generatePayroll() {
        console.log('إنشاء كشف الرواتب...');
        
        // الحصول على الشهر والسنة المحددة
        const month = parseInt(document.getElementById('salary-month').value);
        const year = parseInt(document.getElementById('salary-year').value);
        
        // الحصول على رواتب الشهر المحدد
        const monthSalaries = window[MODULE_NAME].salaries.filter(salary => 
            salary.month === month && salary.year === year
        );
        
        // تهيئة الجدول
        const tableBody = document.querySelector('#payroll-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // إذا لم تكن هناك رواتب، أضف جميع الموظفين النشطين بدون رواتب
        if (monthSalaries.length === 0) {
            const activeEmployees = window[MODULE_NAME].employees.filter(emp => emp.status === 'active');
            
            if (activeEmployees.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="11" class="text-center">لا يوجد موظفين نشطين</td>';
                tableBody.appendChild(emptyRow);
            } else {
                activeEmployees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.className = 'no-salary';
                    row.innerHTML = `
                        <td>${employee.id}</td>
                        <td>
                            <div class="employee-info">
                                <div class="employee-avatar">${employee.name.charAt(0)}</div>
                                <div>
                                    <div class="employee-name">${employee.name}</div>
                                    <div class="employee-email">${employee.email || employee.phone}</div>
                                </div>
                            </div>
                        </td>
                        <td>${employee.position}</td>
                        <td>${formatCurrency(employee.salary)}</td>
                        <td>${employee.commissionRate}%</td>
                        <td>-</td>
                        <td>-</td>
                        <td>${formatCurrency(employee.allowance)}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <button class="btn btn-sm btn-primary add-salary-btn" data-id="${employee.id}">
                                <i class="fas fa-plus"></i>
                                <span>إضافة راتب</span>
                            </button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // إضافة مستمعات الأحداث لأزرار إضافة الرواتب
                document.querySelectorAll('.add-salary-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const employeeId = this.getAttribute('data-id');
                        openSalaryModal(employeeId);
                    });
                });
            }
        } else {
            // عرض الرواتب المسجلة
            monthSalaries.forEach(salary => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${salary.employeeId}</td>
                    <td>
                        <div class="employee-info">
                            <div class="employee-avatar">${salary.employeeName.charAt(0)}</div>
                            <div>
                                <div class="employee-name">${salary.employeeName}</div>
                            </div>
                        </div>
                    </td>
                    <td>${getEmployeePosition(salary.employeeId)}</td>
                    <td>${formatCurrency(salary.baseSalary)}</td>
                    <td>${salary.commissionRate}%</td>
                    <td>${formatCurrency(salary.salesAmount)}</td>
                    <td>${formatCurrency(salary.commission)}</td>
                    <td>${formatCurrency(salary.allowance)}</td>
                    <td>${formatCurrency(salary.deduction)}</td>
                    <td>${formatCurrency(salary.netSalary)}</td>
                    <td>
                        <div class="employee-actions">
                            <button class="employee-action-btn view-salary" data-id="${salary.id}" title="عرض التفاصيل">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="employee-action-btn edit edit-salary" data-id="${salary.employeeId}" title="تعديل">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // إضافة مستمعات الأحداث للأزرار
            document.querySelectorAll('.view-salary').forEach(button => {
                button.addEventListener('click', function() {
                    const salaryId = this.getAttribute('data-id');
                    showSalaryDetails(salaryId);
                });
            });
            
            document.querySelectorAll('.edit-salary').forEach(button => {
                button.addEventListener('click', function() {
                    const employeeId = this.getAttribute('data-id');
                    openSalaryModal(employeeId);
                });
            });
            
            // تحديث إجماليات الجدول
            updatePayrollTotals(monthSalaries);
        }
    }
    
    /**
     * تحديث إجماليات كشف الرواتب
     */
    function updatePayrollTotals(salaries) {
        // حساب المجاميع
        const totalBaseSalary = salaries.reduce((sum, salary) => sum + salary.baseSalary, 0);
        const totalSales = salaries.reduce((sum, salary) => sum + salary.salesAmount, 0);
        const totalCommission = salaries.reduce((sum, salary) => sum + salary.commission, 0);
        const totalAllowances = salaries.reduce((sum, salary) => sum + salary.allowance, 0);
        const totalDeductions = salaries.reduce((sum, salary) => sum + salary.deduction, 0);
        const totalNetSalary = salaries.reduce((sum, salary) => sum + salary.netSalary, 0);
        
        // تحديث الخلايا بالمجاميع
        document.getElementById('total-base-salary').textContent = formatCurrency(totalBaseSalary);
        document.getElementById('total-sales').textContent = formatCurrency(totalSales);
        document.getElementById('total-commission').textContent = formatCurrency(totalCommission);
        document.getElementById('total-allowances').textContent = formatCurrency(totalAllowances);
        document.getElementById('total-deductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('total-net-salary').textContent = formatCurrency(totalNetSalary);
    }
    
    /**
     * عرض تفاصيل الراتب
     */
    function showSalaryDetails(salaryId) {
        console.log(`عرض تفاصيل الراتب: ${salaryId}`);
        
        // البحث عن الراتب
        const salary = window[MODULE_NAME].salaries.find(s => s.id === salaryId);
        if (!salary) {
            if (typeof showNotification === 'function') {
                showNotification('لم يتم العثور على الراتب', 'error');
            } else {
                alert('لم يتم العثور على الراتب');
            }
            return;
        }
        
        // البحث عن الموظف
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === salary.employeeId);
        
        // إنشاء محتوى التفاصيل
        const content = `
            <div class="salary-details">
                <div class="salary-header">
                    <h3 class="salary-title">راتب شهر ${getMonthName(salary.month)} ${salary.year}</h3>
                    <div class="salary-date">تاريخ الصرف: ${new Date(salary.date).toLocaleDateString()}</div>
                </div>
                
                <div class="employee-info">
                    <div class="employee-avatar">${salary.employeeName.charAt(0)}</div>
                    <div class="employee-details">
                        <div class="employee-name">${salary.employeeName}</div>
                        <div class="employee-position">${employee ? `${employee.position} - ${employee.department}` : ''}</div>
                    </div>
                </div>
                
                <div class="salary-components">
                    <div class="component-group">
                        <h4 class="component-group-title">المستحقات</h4>
                        <div class="salary-component">
                            <div class="component-name">الراتب الأساسي</div>
                            <div class="component-value">${formatCurrency(salary.baseSalary)}</div>
                        </div>
                        <div class="salary-component">
                            <div class="component-name">عمولة المبيعات (${salary.commissionRate}%)</div>
                            <div class="component-value">${formatCurrency(salary.commission)}</div>
                        </div>
                        <div class="salary-component">
                            <div class="component-name">البدلات</div>
                            <div class="component-value">${formatCurrency(salary.allowance)}</div>
                        </div>
                        <div class="salary-component total">
                            <div class="component-name">إجمالي المستحقات</div>
                            <div class="component-value">${formatCurrency(salary.baseSalary + salary.commission + salary.allowance)}</div>
                        </div>
                    </div>
                    
                    <div class="component-group">
                        <h4 class="component-group-title">الاستقطاعات</h4>
                        <div class="salary-component">
                            <div class="component-name">الاستقطاعات</div>
                            <div class="component-value">${formatCurrency(salary.deduction)}</div>
                        </div>
                        <div class="salary-component total">
                            <div class="component-name">إجمالي الاستقطاعات</div>
                            <div class="component-value">${formatCurrency(salary.deduction)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="salary-summary">
                    <div class="summary-label">صافي الراتب:</div>
                    <div class="summary-value">${formatCurrency(salary.netSalary)}</div>
                </div>
                
                ${salary.notes ? `
                <div class="salary-notes">
                    <div class="notes-label">ملاحظات:</div>
                    <div class="notes-content">${salary.notes}</div>
                </div>
                ` : ''}
            </div>
        `;
        
        // عرض النافذة المنبثقة
        const detailsContent = document.getElementById('salary-details-content');
        if (detailsContent) {
            detailsContent.innerHTML = content;
        }
        
        // فتح النافذة المنبثقة
        openModal('salary-details-modal');
        
        // تعيين وظيفة زر الطباعة
        const printSalaryBtn = document.getElementById('print-salary-btn');
        if (printSalaryBtn) {
            printSalaryBtn.onclick = () => printSalaryDetails(salary, employee);
        }
    }
    
    /**
     * طباعة تفاصيل الراتب
     */
    function printSalaryDetails(salary, employee) {
        console.log('طباعة تفاصيل الراتب...');
        
        // إنشاء نافذة الطباعة
        const printWindow = window.open('', '', 'width=800,height=600');
        
        // إنشاء محتوى صفحة الطباعة
        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>راتب ${salary.employeeName} - ${getMonthName(salary.month)} ${salary.year}</title>
                <style>
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background: #fff;
                        margin: 0;
                        padding: 20px;
                        direction: rtl;
                    }
                    .salary-slip {
                        border: 1px solid #ccc;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .title {
                        font-size: 18px;
                        margin-bottom: 5px;
                    }
                    .subtitle {
                        font-size: 14px;
                        color: #666;
                    }
                    .employee-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 10px;
                    }
                    .employee-details, .salary-details {
                        flex: 1;
                    }
                    .info-row {
                        margin-bottom: 5px;
                    }
                    .label {
                        font-weight: bold;
                        margin-left: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        padding: 10px;
                        text-align: right;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    .total-row {
                        font-weight: bold;
                    }
                    .net-salary {
                        font-size: 18px;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 20px;
                        padding: 10px;
                        border: 2px solid #333;
                    }
                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 40px;
                    }
                    .signature {
                        flex: 1;
                        text-align: center;
                    }
                    .sign-label {
                        margin-bottom: 30px;
                    }
                    .sign-line {
                        border-top: 1px solid #333;
                        width: 150px;
                        margin: 0 auto;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="salary-slip">
                    <div class="header">
                        <div class="logo">نظام الاستثمار المتكامل</div>
                        <div class="title">إيصال راتب</div>
                        <div class="subtitle">شهر ${getMonthName(salary.month)} ${salary.year}</div>
                    </div>
                    
                    <div class="employee-info">
                        <div class="employee-details">
                            <div class="info-row"><span class="label">اسم الموظف:</span> ${salary.employeeName}</div>
                            <div class="info-row"><span class="label">رقم الموظف:</span> ${salary.employeeId}</div>
                            <div class="info-row"><span class="label">المسمى الوظيفي:</span> ${employee ? employee.position : ''}</div>
                            <div class="info-row"><span class="label">القسم:</span> ${employee ? employee.department : ''}</div>
                        </div>
                        <div class="salary-details">
                            <div class="info-row"><span class="label">تاريخ الصرف:</span> ${new Date(salary.date).toLocaleDateString()}</div>
                            <div class="info-row"><span class="label">تاريخ التعيين:</span> ${employee ? new Date(employee.hireDate).toLocaleDateString() : ''}</div>
                            <div class="info-row"><span class="label">رقم الهاتف:</span> ${employee ? employee.phone : ''}</div>
                            <div class="info-row"><span class="label">البريد الإلكتروني:</span> ${employee ? employee.email || '-' : '-'}</div>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th colspan="2">المستحقات</th>
                                <th colspan="2">الاستقطاعات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>الراتب الأساسي</td>
                                <td>${formatCurrency(salary.baseSalary)}</td>
                                <td>الاستقطاعات</td>
                                <td>${formatCurrency(salary.deduction)}</td>
                            </tr>
                            <tr>
                                <td>عمولة المبيعات (${salary.commissionRate}%)</td>
                                <td>${formatCurrency(salary.commission)}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>البدلات</td>
                                <td>${formatCurrency(salary.allowance)}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr class="total-row">
                                <td>إجمالي المستحقات</td>
                                <td>${formatCurrency(salary.baseSalary + salary.commission + salary.allowance)}</td>
                                <td>إجمالي الاستقطاعات</td>
                                <td>${formatCurrency(salary.deduction)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="net-salary">
                        صافي الراتب: ${formatCurrency(salary.netSalary)}
                    </div>
                    
                    ${salary.notes ? `
                    <div style="margin-top: 20px;">
                        <strong>ملاحظات:</strong>
                        <p>${salary.notes}</p>
                    </div>
                    ` : ''}
                    
                    <div class="signatures">
                        <div class="signature">
                            <div class="sign-label">توقيع المدير</div>
                            <div class="sign-line"></div>
                        </div>
                        <div class="signature">
                            <div class="sign-label">توقيع الموظف</div>
                            <div class="sign-line"></div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        تم إنشاء هذا الإيصال بواسطة نظام إدارة الموظفين - ${new Date().toLocaleDateString()}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // كتابة المحتوى في نافذة الطباعة
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // انتظار تحميل الصفحة ثم طباعتها
        printWindow.onload = function() {
            printWindow.print();
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        };
    }
    
    /**
     * تصدير كشف الرواتب
     */
    function exportPayroll() {
        console.log('تصدير كشف الرواتب...');
        
        // الحصول على الشهر والسنة المحددة
        const month = parseInt(document.getElementById('salary-month').value);
        const year = parseInt(document.getElementById('salary-year').value);
        
        // الحصول على رواتب الشهر المحدد
        const monthSalaries = window[MODULE_NAME].salaries.filter(salary => 
            salary.month === month && salary.year === year
        );
        
        if (monthSalaries.length === 0) {
            if (typeof showNotification === 'function') {
                showNotification('لا توجد رواتب للتصدير', 'warning');
            } else {
                alert('لا توجد رواتب للتصدير');
            }
            return;
        }
        
        // إنشاء مصفوفة البيانات للتصدير
        const csvRows = [];
        
        // إضافة عناوين الأعمدة
        const headers = [
            'المعرف', 'الموظف', 'المسمى الوظيفي', 'القسم', 'الراتب الأساسي', 'نسبة العمولة',
            'قيمة المبيعات', 'مبلغ العمولة', 'البدلات', 'الاستقطاعات', 'صافي الراتب'
        ];
        csvRows.push(headers.join(','));
        
        // إضافة الصفوف
        monthSalaries.forEach(salary => {
            const employee = window[MODULE_NAME].employees.find(emp => emp.id === salary.employeeId);
            
            const row = [
                salary.employeeId,
                salary.employeeName,
                employee ? employee.position : '',
                employee ? employee.department : '',
                salary.baseSalary,
                salary.commissionRate,
                salary.salesAmount,
                salary.commission,
                salary.allowance,
                salary.deduction,
                salary.netSalary
            ];
            
            // تنظيف القيم للتصدير CSV
            const cleanedRow = row.map(value => {
                // إذا كانت القيمة تحتوي على فواصل، نضعها بين علامات اقتباس
                value = String(value).replace(/"/g, '""');
                return value.includes(',') ? `"${value}"` : value;
            });
            
            csvRows.push(cleanedRow.join(','));
        });
        
        // إضافة صف المجاميع
        const totalRow = [
            '99999', // معرف خاص للمجموع
            'المجموع', // اسم المجموع
            '', // المسمى الوظيفي
            '', // القسم
            // حساب المجاميع
            monthSalaries.reduce((sum, salary) => sum + salary.baseSalary, 0),
            '', // نسبة العمولة
            monthSalaries.reduce((sum, salary) => sum + salary.salesAmount, 0),
            monthSalaries.reduce((sum, salary) => sum + salary.commission, 0),
            monthSalaries.reduce((sum, salary) => sum + salary.allowance, 0),
            monthSalaries.reduce((sum, salary) => sum + salary.deduction, 0),
            monthSalaries.reduce((sum, salary) => sum + salary.netSalary, 0)
        ];
        
        // تنظيف قيم المجموع للتصدير CSV
        const cleanedTotalRow = totalRow.map(value => {
            value = String(value).replace(/"/g, '""');
            return value.includes(',') ? `"${value}"` : value;
        });
        
        csvRows.push(cleanedTotalRow.join(','));
        
        // إنشاء ملف CSV
        const csvContent = csvRows.join('\n');
        
        // إنشاء Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // إنشاء رابط التنزيل
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `كشف_رواتب_${getMonthName(month)}_${year}.csv`;
        
        // إضافة الرابط وتنفيذ النقر
        document.body.appendChild(link);
        link.click();
        
        // تنظيف
        document.body.removeChild(link);
        
        if (typeof showNotification === 'function') {
            showNotification(`تم تصدير كشف رواتب ${getMonthName(month)} ${year} بنجاح`, 'success');
        } else {
            alert(`تم تصدير كشف رواتب ${getMonthName(month)} ${year} بنجاح`);
        }
    }
    
    /**
     * تصدير قائمة الموظفين
     */
    function exportEmployees() {
        console.log('تصدير قائمة الموظفين...');
        
        if (window[MODULE_NAME].employees.length === 0) {
            if (typeof showNotification === 'function') {
                showNotification('لا يوجد موظفين للتصدير', 'warning');
            } else {
                alert('لا يوجد موظفين للتصدير');
            }
            return;
        }
        
        // إنشاء مصفوفة البيانات للتصدير
        const csvRows = [];
        
        // إضافة عناوين الأعمدة
        const headers = [
            'المعرف', 'الاسم', 'رقم الهاتف', 'البريد الإلكتروني', 'العنوان', 
            'رقم الهوية', 'المسمى الوظيفي', 'القسم', 'تاريخ التعيين',
            'الراتب الأساسي', 'نسبة العمولة', 'البدلات', 'الحالة'
        ];
        csvRows.push(headers.join(','));
        
        // إضافة بيانات الموظفين
        window[MODULE_NAME].employees.forEach(employee => {
            const row = [
                employee.id,
                employee.name,
                employee.phone,
                employee.email || '',
                employee.address || '',
                employee.idNumber,
                employee.position,
                employee.department,
                employee.hireDate,
                employee.salary,
                employee.commissionRate || 0,
                employee.allowance || 0,
                employee.status
            ];
            
            // تنظيف القيم للتصدير CSV
            const cleanedRow = row.map(value => {
                // إذا كانت القيمة تحتوي على فواصل، نضعها بين علامات اقتباس
                value = String(value).replace(/"/g, '""');
                return value.includes(',') ? `"${value}"` : value;
            });
            
            csvRows.push(cleanedRow.join(','));
        });
        
        // إنشاء ملف CSV
        const csvContent = csvRows.join('\n');
        
        // إنشاء Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // إنشاء رابط التنزيل
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `قائمة_الموظفين_${new Date().toISOString().split('T')[0]}.csv`;
        
        // إضافة الرابط وتنفيذ النقر
        document.body.appendChild(link);
        link.click();
        
        // تنظيف
        document.body.removeChild(link);
        
        if (typeof showNotification === 'function') {
            showNotification('تم تصدير قائمة الموظفين بنجاح', 'success');
        } else {
            alert('تم تصدير قائمة الموظفين بنجاح');
        }
    }
    
    /**
     * الحصول على المسمى الوظيفي للموظف
     * @param {string} employeeId - معرف الموظف
     * @return {string} - المسمى الوظيفي
     */
    function getEmployeePosition(employeeId) {
        const employee = window[MODULE_NAME].employees.find(emp => emp.id === employeeId);
        return employee ? employee.position : '';
    }
    
    /**
     * الحصول على اسم الشهر بالعربية
     * @param {number} month - رقم الشهر (1-12)
     * @return {string} - اسم الشهر بالعربية
     */
    function getMonthName(month) {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        
        // تحويل الشهر إلى رقم من 0 إلى 11
        const monthIndex = parseInt(month) - 1;
        
        // التحقق من صحة الرقم
        if (monthIndex >= 0 && monthIndex < 12) {
            return months[monthIndex];
        }
        
        return 'غير معروف';
    }
    
    /**
     * تنسيق المبلغ كعملة
     * @param {number} amount - المبلغ
     * @return {string} - المبلغ بتنسيق العملة
     */
    function formatCurrency(amount) {
        // التأكد من أن المبلغ رقم
        amount = parseFloat(amount);
        
        // التحقق من أن المبلغ ليس NaN
        if (isNaN(amount)) {
            amount = 0;
        }
        
        // تنسيق المبلغ بإضافة فواصل للآلاف وتقريب الأرقام العشرية
        return amount.toLocaleString('ar-SA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' دينار';
    }
    
    /**
     * فتح نافذة منبثقة
     * @param {string} modalId - معرف النافذة المنبثقة
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            
            // تأخير إضافة الكلاس للحصول على تأثير الظهور
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal');
                if (modalContent) {
                    modalContent.classList.add('animate__fadeInUp');
                    modalContent.classList.remove('animate__fadeOutDown');
                }
            }, 10);
        }
    }
    
    /**
     * إغلاق نافذة منبثقة
     * @param {string} modalId - معرف النافذة المنبثقة
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalContent = modal.querySelector('.modal');
            if (modalContent) {
                modalContent.classList.remove('animate__fadeInUp');
                modalContent.classList.add('animate__fadeOutDown');
                
                // انتظار انتهاء التأثير قبل الإخفاء
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300); // مدة التأثير
            } else {
                modal.style.display = 'none';
            }
        }
    }
    
    // إتاحة الدوال المطلوبة للاستخدام في ملفات أخرى
    return {
        // دوال الموظفين
        addEmployeesNavItem,
        addEmployeesPage,
        addEmployeesStyles,
        initEmployeesSystem,
        renderEmployeesTable,
        
        // دوال مساعدة
        getMonthName,
        formatCurrency
    };
})();