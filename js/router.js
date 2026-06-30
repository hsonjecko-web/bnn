(function() {
    var appEl = document.getElementById('app');

    function navigateTo(url, replace) {
        if (url === window.location.href) return;
        // Clear all intervals from previous page
        var maxId = window.setInterval(function(){}, 0);
        for (var i = 0; i <= maxId; i++) clearInterval(i);
        // Loading state
        appEl.style.opacity = '0.3';
        appEl.style.transition = 'opacity 0.2s ease';
        fetch(url)
            .then(function(r) { return r.text(); })
            .then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                var newApp = doc.getElementById('app');
                if (!newApp) { window.location.href = url; return; }
                appEl.innerHTML = newApp.innerHTML;
                doc.querySelectorAll('body > script').forEach(function(oldScript) {
                    if (oldScript.src) return;
                    var newScript = document.createElement('script');
                    newScript.textContent = oldScript.textContent;
                    document.body.appendChild(newScript);
                    document.body.removeChild(newScript);
                });
                appEl.style.opacity = '1';
                if (replace) history.replaceState({}, '', url);
                else history.pushState({}, '', url);
            })
            .catch(function() {
                window.location.href = url;
            });
    }

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || link.hasAttribute('download')) return;
        if (href.endsWith('.html') || href.endsWith('/')) {
            e.preventDefault();
            var base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            navigateTo(base + href);
        }
    });

    window.addEventListener('popstate', function() {
        navigateTo(window.location.href, true);
    });
})();
