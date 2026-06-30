(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var appEl = document.getElementById('app');
        if (!appEl) return;

        function navigateTo(url, replace) {
            fetch(url)
                .then(function(r) { return r.text(); })
                .then(function(html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var newApp = doc.getElementById('app');
                    if (!newApp) { window.location.href = url; return; }
                    appEl.innerHTML = newApp.innerHTML;
                    var scripts = doc.querySelectorAll('body > script:not([src])');
                    scripts.forEach(function(oldScript) {
                        var newScript = document.createElement('script');
                        newScript.textContent = oldScript.textContent;
                        document.body.appendChild(newScript);
                        document.body.removeChild(newScript);
                    });
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
            if (!href) return;
            if (href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || link.hasAttribute('download') || link.hasAttribute('target')) return;
            if (!href.endsWith('.html') && !href.endsWith('/')) return;
            if (href === window.location.pathname.split('/').pop() || href === window.location.pathname.slice(1)) return;
            e.preventDefault();
            var base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            navigateTo(base + href);
        });

        window.addEventListener('popstate', function() {
            navigateTo(window.location.href, true);
        });
    });
})();
