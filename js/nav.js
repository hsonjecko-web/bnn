// ===== ملف مشترك - التنقل والوظائف المشتركة =====

// ===== أدوات مساعدة =====
function loadFromStorage(key, def) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; }
}

// ===== إدارة السمة (Light/Dark Mode) =====
function initTheme() {
    const saved = localStorage.getItem('bunean-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefersLight)) {
        document.documentElement.classList.add('light-mode');
    }
}

function toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('bunean-theme', isLight ? 'light' : 'dark');
    return isLight;
}

function getThemeIcon() {
    const isLight = document.documentElement.classList.contains('light-mode');
    return isLight ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    `;
}

function getUserName() {
    var auth = localStorage.getItem('bunean-user-auth');
    if (auth) {
        var data = localStorage.getItem('bunean-user-data');
        if (data) { try { var d = JSON.parse(data); if (d.name) return d.name; } catch(e) {} }
        return auth;
    }
    return localStorage.getItem('bunean-user') || 'مستخدم';
}

// ===== رسالة تنبيه موحدة =====
function showBrandAlert(message) {
    var existing = document.querySelector('.brand-alert-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'brand-alert-overlay';
    overlay.setAttribute('onclick', 'this.remove()');

    var modal = document.createElement('div');
    modal.className = 'brand-alert-modal';
    modal.setAttribute('onclick', 'event.stopPropagation()');

    var icon = document.createElement('div');
    icon.className = 'brand-alert-icon-wrap';
    icon.innerHTML = '<span class="material-symbols-outlined brand-alert-icon">info</span>';

    var text = document.createElement('p');
    text.className = 'brand-alert-text';
    text.textContent = message;

    var btn = document.createElement('button');
    btn.className = 'brand-alert-btn';
    btn.textContent = 'حسناً';
    btn.setAttribute('onclick', 'this.closest(\'.brand-alert-overlay\').remove()');

    modal.appendChild(icon);
    modal.appendChild(text);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// ===== رسالة تأكيد موحدة =====
function showBrandConfirm(message, callback) {
    var existing = document.querySelector('.brand-alert-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'brand-alert-overlay';

    var modal = document.createElement('div');
    modal.className = 'brand-alert-modal';
    modal.setAttribute('onclick', 'event.stopPropagation()');

    var icon = document.createElement('div');
    icon.className = 'brand-alert-icon-wrap';
    icon.innerHTML = '<span class="material-symbols-outlined brand-alert-icon" style="color:#e74c3c;">warning</span>';

    var text = document.createElement('p');
    text.className = 'brand-alert-text';
    text.textContent = message;

    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display:flex;gap:8px;width:100%;';

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'brand-alert-btn';
    cancelBtn.textContent = 'إلغاء';
    cancelBtn.style.cssText = 'flex:1;padding:10px;border-radius:10px;border:1px solid var(--border-light);background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:Cairo,sans-serif;';
    cancelBtn.setAttribute('onclick', 'this.closest(\'.brand-alert-overlay\').remove()');

    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'brand-alert-btn';
    confirmBtn.textContent = 'تأكيد';
    confirmBtn.style.cssText = 'flex:1;padding:10px;border-radius:10px;border:none;background:#e74c3c;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif;';
    confirmBtn.addEventListener('click', function(e) {
        overlay.remove();
        if (typeof callback === 'function') callback();
    });

    btnWrap.appendChild(cancelBtn);
    btnWrap.appendChild(confirmBtn);

    modal.appendChild(icon);
    modal.appendChild(text);
    modal.appendChild(btnWrap);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// ===== السلة العائمة عبر الصفحات =====
function initFloatingCart() {
    if (document.querySelector('.mkt-floating-cart')) return;
    var saved = localStorage.getItem('bunean-market-cart');
    if (!saved) return;
    try {
        var cart = JSON.parse(saved);
        if (!cart || !cart.length) return;
        var valid = cart.filter(function(c) { return c && c.qty > 0; });
        if (!valid.length) {
            localStorage.removeItem('bunean-market-cart');
            return;
        }
        var count = valid.reduce(function(s, c) { return s + (c.qty || 0); }, 0);
        if (count < 1) { localStorage.removeItem('bunean-market-cart'); return; }
        var div = document.createElement('div');
        div.className = 'mkt-floating-cart';
        div.style.cssText = 'position:fixed;bottom:calc(80px + env(safe-area-inset-bottom, 0px));left:16px;width:56px;height:56px;background:#3a6a95;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 20px rgba(58,106,149,0.4);cursor:pointer;z-index:90;';
        div.innerHTML = '<span class="material-symbols-outlined" style="font-size:26px;">shopping_cart</span><span class="mkt-cart-badge" style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;background:#e74c3c;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;">' + count + '</span>';
        div.addEventListener('click', function() { window.location.href = 'market.html?cart=1'; });
        document.body.appendChild(div);
    } catch(e) {}
}
