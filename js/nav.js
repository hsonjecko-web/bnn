// ===== ملف مشترك - التنقل والوظائف المشتركة =====

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
