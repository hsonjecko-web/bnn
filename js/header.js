function renderHeader(options) {
    options = options || {};
    var showBack = options.showBack || false;
    var backLink = options.backLink || 'home.html';
    var searchPlaceholder = options.searchPlaceholder || 'ابحث عن مواد أو خدمات...';
    var searchVModel = options.searchVModel || null;
    var cartBadge = options.cartBadge || false;
    var userNameVue = options.userNameVue || false;

    var backBtn = showBack
        ? '<a href="' + backLink + '" class="nav-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></a>'
        : '';

    var searchInput = searchVModel
        ? '<input type="text" v-model="' + searchVModel + '" placeholder="' + searchPlaceholder + '">'
        : '<input type="text" placeholder="' + searchPlaceholder + '">';

    var userNameHtml;
    if (userNameVue) {
        userNameHtml = '<div style="font-size:12px;color:var(--text-light);line-height:1.3;" id="userNameDisplay">{{ user.name }}</div>';
    } else {
        userNameHtml = '<div style="font-size:12px;color:var(--text-light);line-height:1.3;" id="userNameDisplay">' + getUserName() + '</div>';
    }

    var cartHtml = cartBadge
        ? '<button class="nav-icon" style="position:relative;"><span class="material-symbols-outlined">shopping_cart</span><span v-if="cartCount > 0" class="badge">{{ cartCount }}</span></button>'
        : '<a href="market.html" class="nav-icon material-symbols-outlined">shopping_cart</a>';

    return '<header class="top-nav">'
        + backBtn
        + '<div class="nav-brand" style="display:flex;align-items:center;gap:10px;">'
        + '<img src="logo-small-transparent.png" alt="بنيان" style="width:36px;height:36px;">'
        + '<div>'
        + '<div style="font-size:14px;font-weight:600;color:var(--text-white);line-height:1.3;">أهلاً</div>'
        + userNameHtml
        + '</div></div>'
        + '<div class="search-bar">'
        + '<span class="material-symbols-outlined">search</span>'
        + searchInput
        + '</div>'
        + '<div class="nav-actions">'
        + cartHtml
        + '</div>'
        + '</header>';
}
