function renderHeader(options) {
    options = options || {};
    var showBack = options.showBack || false;
    var backLink = options.backLink || 'home.html';
    var searchPlaceholder = options.searchPlaceholder || 'ابحث عن مواد أو خدمات...';
    var searchVModel = options.searchVModel || null;
    var cartBadge = options.cartBadge || false;

    var backBtn = showBack
        ? '<a href="' + backLink + '" class="nav-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></a>'
        : '';

    var searchInput = searchVModel
        ? '<input type="text" v-model="' + searchVModel + '" placeholder="' + searchPlaceholder + '">'
        : '<input type="text" placeholder="' + searchPlaceholder + '">';

    var notifHtml = '<a href="notifications.html" class="nav-icon material-symbols-outlined" id="headerNotifBtn">notifications</a>';

    return '<header class="top-nav">'
        + backBtn
        + '<div class="nav-brand" style="display:flex;align-items:center;gap:10px;">'
        + '<img src="logo-small-transparent.png" alt="بنيان" style="width:36px;height:36px;">'
        + '<span style="font-size:18px;font-weight:700;color:var(--text-white);">بنيان</span></div>'
        + '<div class="search-bar">'
        + '<span class="material-symbols-outlined">search</span>'
        + searchInput
        + '</div>'
        + '<div class="nav-actions">'
        + notifHtml
        + '</div>'
        + '</header>';
}
