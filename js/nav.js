// ===== ملف مشترك - التنقل والوظائف المشتركة =====

// ===== إعادة تعيين السكرول عند فتح الصفحة (يمنع بقاء التمرير بين الصفحات) =====
(function() {
    document.documentElement.style.scrollBehavior = 'auto';
    function resetScroll() {
        var el = document.querySelector('.page-content');
        if (el) { el.scrollTop = 0; return; }
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
    resetScroll();
    window.addEventListener('pageshow', resetScroll);
    window.addEventListener('load', function() { setTimeout(resetScroll, 50); });
    if (document.readyState !== 'loading') resetScroll();
    else document.addEventListener('DOMContentLoaded', resetScroll);
})();

// ===== ضبط ارتفاع الشاشة لمختلف الأجهزة (حل مشكلة 100vh في الموبايل) =====
(function() {
    function setHeight() {
        var vh = window.innerHeight;
        document.documentElement.style.setProperty('--app-height', vh + 'px');
    }
    setHeight();
    window.addEventListener('resize', setHeight);
    // إعادة الضبط عند تغيير الاتجاه أو ظهور لوحة المفاتيح
    window.addEventListener('orientationchange', function() { setTimeout(setHeight, 200); });
})();

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
    var startY = 0, pulling = false, released = false, locked = false;
    var indicator = null;

    function createIndicator() {
        indicator = document.createElement('div');
        indicator.id = 'ptr-indicator';
        indicator.style.cssText = 'position:fixed;top:56px;left:0;right:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;height:0;overflow:hidden;';
        indicator.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
            + '<img src="logo-small-transparent.png" alt="بنيان" class="ptr-logo" style="width:64px;height:64px;opacity:0;transform:translateY(24px) scale(0.4);transition:transform 1.5s cubic-bezier(0.34,1.56,0.64,1),opacity 1.2s;">'
            + '<div style="width:80px;height:4px;background:rgba(201,162,67,0.12);border-radius:4px;overflow:hidden;opacity:0;transition:opacity 1.2s;" class="ptr-track">'
            + '<div class="ptr-bar" style="width:0%;height:100%;background:var(--accent-gold,#c9a243);border-radius:4px;transition:width 0.1s linear;"></div>'
            + '</div></div>';
        document.body.appendChild(indicator);
    }

    function showIndicator(dist) {
        if (!indicator) createIndicator();
        indicator.style.transition = 'none';
        if (dist < 50) {
            indicator.style.height = '0';
            return;
        }
        var adjusted = dist - 50;
        var maxAdj = 150 - 50;
        var pct = Math.min(adjusted / maxAdj, 1);
        var h = Math.min(adjusted * 1.4 + 10, 200);
        indicator.style.height = h + 'px';
        var logo = indicator.querySelector('.ptr-logo');
        var bar = indicator.querySelector('.ptr-bar');
        var track = indicator.querySelector('.ptr-track');
        if (logo) {
            logo.style.opacity = Math.min(pct * 1.5, 1);
            logo.style.transform = 'translateY(' + (24 - pct * 24) + 'px) scale(' + (0.4 + pct * 0.6) + ')';
        }
        if (track) track.style.opacity = Math.min(pct * 2, 1);
        if (bar) bar.style.width = (pct * 100) + '%';
    }

    function hideIndicator() {
        if (indicator) {
            indicator.style.transition = 'height 1.2s cubic-bezier(0.34,1.56,0.64,1)';
            indicator.style.height = '0';
        }
        released = false;
        pulling = false;
    }

    function doRefresh() {
        released = true;
        if (!indicator) return;
        // Lock indicator at full height
        indicator.style.transition = 'none';
        indicator.style.height = '200px';
        var logo = indicator.querySelector('.ptr-logo');
        var bar = indicator.querySelector('.ptr-bar');
        var track = indicator.querySelector('.ptr-track');
        // Logo fully visible
        if (logo) {
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0px) scale(1)';
        }
        if (track) track.style.opacity = '1';
        // Reset bar to 0 then animate to 100
        if (bar) {
            bar.style.width = '0%';
            // Force layout then animate
            void bar.offsetWidth;
            bar.style.transition = 'width 1.5s cubic-bezier(0.34,1.56,0.64,1)';
            bar.style.width = '100%';
        }
        setTimeout(function() { location.reload(); }, 1800);
    }

    // Inject animations once
    if (!document.getElementById('ptr-style')) {
        var s = document.createElement('style');
        s.id = 'ptr-style';
        s.textContent = '@keyframes ptr-spin{to{transform:rotate(360deg)}}';
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
        if (isAtTop() && !hasOverlay() && !released) {
            startY = e.touches[0].clientY;
            pulling = true;
        }
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
        if (pulling && isAtTop() && !hasOverlay() && !released) {
            var diff = e.touches[0].clientY - startY;
            if (diff > 0) showIndicator(diff);
            if (diff > 150) {
                pulling = false;
                doRefresh();
            }
        }
    }, { passive: true });
    document.addEventListener('touchend', function() {
        if (pulling && !released) hideIndicator();
        pulling = false;
    }, { passive: true });
})();
