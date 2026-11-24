// Blogger URL Shortener Integration
(function() {

    var HOSTING_URL = 'https://arbd24.github.io/url'; // আপনার হোস্টিং URL দিন ###############
    
    // বর্তমান URL থেকে শর্ট কোড বের করুন
    var currentUrl = window.location.href;
    var path = window.location.pathname;
    
    // Blogspot URL চেক করুন (যেমন: arbd99.blogspot.com/anything)

    if (window.location.hostname.includes('blogspot.com') || window.location.hostname.includes('blogger.com')) {
        var pathParts = path.split('/');
        var code = pathParts[pathParts.length - 1];
        
        // যদি কোড থাকে এবং এটি ফাইল এক্সটেনশন না হয়
        if (code && code.length > 0 && !code.includes('.') && code !== '' && code !== 'blogger.js') {
            // হোস্টিং এ রিডাইরেক্ট করুন
            window.location.href = HOSTING_URL + '/index.html?code=' + code;
        }
    }
    
    // সাবডোমেইন চেক (যেমন: code.arbd99.blogspot.com)
    var subdomain = window.location.hostname.split('.')[0];
    if (subdomain && subdomain.length > 0 && subdomain !== 'www' && subdomain !== 'arbd99') {
        // এটি শর্ট কোড হতে পারে
        window.location.href = HOSTING_URL + '/index.php?code=' + subdomain;
    }
})();