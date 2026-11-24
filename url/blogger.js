(function() {
    var HOSTING_URL = 'https://arbd24.github.io/url';

    // ⚠️ আপনার ব্লগের নিজস্ব পেজগুলো বাদ দিন (যেমন: /p/, /search, /feeds ইত্যাদি)
    var path = window.location.pathname;
    var host = window.location.hostname;

    // Blogger এর রিজার্ভড পাথ বাদ দিন
    var reservedPrefixes = ['/p/', '/search', '/feeds', '/static/', '/favicon', '/sitemap'];
    var isReserved = reservedPrefixes.some(function(p) { return path.indexOf(p) === 0; });

    if (!isReserved && path !== '/' && path !== '') {
        var pathParts = path.split('/').filter(Boolean);
        var code = pathParts[pathParts.length - 1];

        // ফাইল এক্সটেনশন বা blogger.js বাদ দিন
        if (code && code.length > 0 && !code.includes('.') && code !== 'blogger.js') {
            window.location.href = HOSTING_URL + '/index.html?code=' + encodeURIComponent(code);
            return;
        }
    }
})();
