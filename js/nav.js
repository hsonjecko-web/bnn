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
        div.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span><span class="mkt-cart-badge">' + count + '</span>';
        div.addEventListener('click', function() {
            if (typeof window.__openCart === 'function') {
                window.__openCart();
            } else {
                window.location.href = 'market.html?cart=1';
            }
        });
        document.body.appendChild(div);
    } catch(e) {}
}

// ===== السحب للتحديث (Pull-to-Refresh) =====
(function() {
    var startY = 0, pulling = false;
    var indicator = null;

    function createIndicator() {
        indicator = document.createElement('div');
        indicator.id = 'ptr-indicator';
        indicator.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:0;overflow:hidden;transition:height 0.12s;background:linear-gradient(180deg,var(--bg-dark,#1a1a2e),transparent);padding-bottom:8px;';
        indicator.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;transform:translateY(10px);">'
            + '<img src="logo-small-transparent.png" alt="بنيان" class="ptr-logo" style="width:36px;height:36px;filter:drop-shadow(0 0 6px rgba(201,162,67,0.4));transition:transform 0.2s,opacity 0.2s;">'
            + '<div style="width:50px;height:2px;background:rgba(201,162,67,0.15);border-radius:2px;overflow:hidden;">'
            + '<div class="ptr-bar" style="width:0%;height:100%;background:var(--accent-gold,#c9a243);border-radius:2px;transition:width 0.1s;"></div>'
            + '</div></div>';
        document.body.appendChild(indicator);
    }

    function showIndicator(dist) {
        if (!indicator) createIndicator();
        var h = Math.min(dist * 0.8, 80);
        indicator.style.height = h + 'px';
        var pct = Math.min(dist / 80, 1);
        var logo = indicator.querySelector('.ptr-logo');
        var bar = indicator.querySelector('.ptr-bar');
        if (logo) {
            logo.style.transform = 'translateY(' + (10 - pct * 10) + 'px) scale(' + (0.7 + pct * 0.3) + ')';
            logo.style.opacity = pct;
        }
        if (bar) bar.style.width = (pct * 100) + '%';
    }

    function hideIndicator() {
        if (indicator) { indicator.style.height = '0'; }
        pulling = false;
    }

    // Inject animations once
    if (!document.getElementById('ptr-style')) {
        var s = document.createElement('style');
        s.id = 'ptr-style';
        s.textContent = '@keyframes ptr-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.8}}';
        document.head.appendChild(s);
    }

    function isAtTop() {
        var el = document.querySelector('.page-content');
        if (el) return el.scrollTop <= 0;
        return window.scrollY <= 0;
    }
    function hasOverlay() {
        return !!document.querySelector('.notif-overlay, .project-modal, .brand-alert-overlay, .modal-overlay, .image-viewer');
    }

    document.addEventListener('touchstart', function(e) {
        if (isAtTop() && !hasOverlay()) {
            startY = e.touches[0].clientY;
            pulling = true;
        }
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
        if (pulling && isAtTop() && !hasOverlay()) {
            var diff = e.touches[0].clientY - startY;
            if (diff > 0) showIndicator(diff);
            if (diff > 80) {
                pulling = false;
                if (indicator) {
                    indicator.style.transition = 'none';
                    indicator.style.height = '90px';
                    indicator.style.background = 'linear-gradient(180deg,var(--bg-dark,#1a1a2e),transparent)';
                    var logo = indicator.querySelector('.ptr-logo');
                    var bar = indicator.querySelector('.ptr-bar');
                    if (bar) bar.style.width = '100%';
                    if (logo) {
                        logo.style.transform = 'translateY(0) scale(1)';
                        logo.style.animation = 'ptr-pulse 0.6s ease-in-out infinite';
                    }
                }
                setTimeout(function() { location.reload(); }, 400);
            }
        }
    }, { passive: true });
    document.addEventListener('touchend', function() {
        if (pulling) hideIndicator();
        pulling = false;
    }, { passive: true });
})();
