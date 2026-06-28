function renderNav(activePage) {
    var items = [
        { page: 'home', label: 'الرئيسية', icon: 'home', href: 'home.html' },
        { page: 'ideas', label: 'تنفيذ', icon: 'engineering', href: 'ideas.html' },
        { page: 'market', label: 'سوق البناء', icon: 'shopping_cart', href: 'market.html' },
        { page: 'execute', label: 'أفكار', icon: 'lightbulb', href: 'execute.html' },
        { page: 'account', label: 'حسابي', icon: 'person', href: 'account.html' }
    ];

    var html = '<nav class="bottom-nav">';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var activeClass = activePage === item.page ? ' active' : '';
        html += '<a href="' + item.href + '" class="nav-item' + activeClass + '">'
            + '<span class="material-symbols-outlined">' + item.icon + '</span>'
            + '<span>' + item.label + '</span>'
            + '</a>';
    }

    html += '</nav>';
    return html;
}
