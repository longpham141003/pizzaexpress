/* ══ Pizza Express Admin — JavaScript ══ */

// ── Sidebar Toggle (Mobile) ──
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const toggleBtns = document.querySelectorAll('.sidebar-toggle');
    const overlay = document.getElementById('sidebarOverlay');

    toggleBtns.forEach(btn => btn.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        overlay?.classList.toggle('show');
    }));

    overlay?.addEventListener('click', () => {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('show');
    });
});

// ── Delete Confirmation Modal ──
function confirmDelete(formId, itemName) {
    const modal = document.getElementById('deleteModal');
    const nameEl = document.getElementById('deleteItemName');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (!modal) return;

    nameEl.textContent = itemName || 'mục này';
    modal.classList.add('show');

    confirmBtn.onclick = () => {
        document.getElementById(formId)?.submit();
        modal.classList.remove('show');
    };
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('show');
}

// ── Toast Notifications ──
function showToast(message, type = 'success', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;margin-right:6px">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── Auto-dismiss TempData alerts ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.alert[data-auto-dismiss]').forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            alert.style.transition = 'all 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    });
});

// ── Image Preview on Upload ──
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview || !input.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
}

// ── Toggle Variants Section ──
function toggleVariants(checkbox) {
    const section = document.getElementById('variantsSection');
    const singlePrice = document.getElementById('singlePriceSection');
    if (section) section.style.display = checkbox.checked ? 'block' : 'none';
    if (singlePrice) singlePrice.style.display = checkbox.checked ? 'none' : 'block';
}

// ── Add Variant Row ──
let variantIndex = 0;
function addVariantRow() {
    const tbody = document.getElementById('variantsBody');
    if (!tbody) return;
    const idx = variantIndex++;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input name="Variants[${idx}].SizeName" class="form-control" placeholder="S/M/L" maxlength="10" required /></td>
        <td><input name="Variants[${idx}].SizeLabel" class="form-control" placeholder="20cm" maxlength="50" /></td>
        <td><input name="Variants[${idx}].Price" type="number" class="form-control" min="0" required /></td>
        <td><input name="Variants[${idx}].SalePrice" type="number" class="form-control" min="0" /></td>
        <td><input name="Variants[${idx}].SortOrder" type="number" class="form-control" value="${idx}" /></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="this.closest('tr').remove()"><span class="material-symbols-outlined">delete</span></button></td>
    `;
    tbody.appendChild(row);
}

// ── Auto Slug Generation ──
function initAutoSlug(titleId, slugId) {
    const title = document.getElementById(titleId);
    const slug = document.getElementById(slugId);
    if (!title || !slug) return;

    title.addEventListener('input', () => {
        if (!slug.dataset.manual) {
            slug.value = convertToSlug(title.value);
        }
    });

    slug.addEventListener('input', () => {
        slug.dataset.manual = slug.value ? 'true' : '';
    });
}

function convertToSlug(text) {
    return text.toString().toLowerCase()
        .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
        .replace(/í|ì|ỉ|ĩ|ị/g, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// ── Form Submit Loading Indicator ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            if (!form.checkValidity()) return;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                setTimeout(() => {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span class="material-symbols-outlined spin">sync</span> Đang xử lý...`;
                }, 10);
            }
        });
    });
});

// ── Real-time Search Filter (Client-side) ──
document.addEventListener('DOMContentLoaded', () => {
    const searchInputs = document.querySelectorAll('input[name="q"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const table = document.querySelector('.admin-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr');
            let hasVisibleRow = false;
            
            rows.forEach(row => {
                // Skip empty state row if it exists
                if (row.querySelector('.empty-state') || row.cells.length < 2) return;
                
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                    hasVisibleRow = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Handle empty state display dynamically
            let emptyRow = table.querySelector('.temp-empty-row');
            if (!hasVisibleRow && query !== '') {
                if (!emptyRow) {
                    emptyRow = document.createElement('tr');
                    emptyRow.className = 'temp-empty-row';
                    emptyRow.innerHTML = `<td colspan="100"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>Không tìm thấy kết quả phù hợp</p></div></td>`;
                    table.querySelector('tbody').appendChild(emptyRow);
                }
            } else {
                if (emptyRow) emptyRow.remove();
            }
        });
    });
});

// ── Auto-submit Select Filters on Change (All Pages) ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[method="get"] select').forEach(select => {
        select.addEventListener('change', function() {
            this.form.submit();
        });
    });
});
