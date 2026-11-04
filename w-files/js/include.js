// include.js - পেজের যেকোনো জায়গায় কাজ করবে
(function() {
    // ===== আপনার HTML কোড =====
    var MY_HTML = `
        <center style="padding:3px;"></center>
        <div style="border: 1px solid #7c0000 ; padding:4px; border-radius:4px;background-color:#bcd7f0;">
            <center> 
                ⭐ All Software or Files is Premium and Cracked ⭐<br>
                ⚠️If Software Doesn't Support/Open, Please Install 
                <a href="https://arbd24.github.io/f/WinRar_5.50+crack.zip">
                    Win Rar
                </a>
                <img style="display: inline-block; vertical-align: middle; width: 24px; height: auto; margin: 0 6px;" src="https://arbd24.github.io/icon/arrow.gif">
            </center> 
        </div>
        <center style="padding:2px;"></center>
    `;
    
    // ===== স্ক্রিপ্টের লোকেশন খুঁজে বের করা =====
    function getScriptPosition() {
        var scripts = document.getElementsByTagName('script');
        var currentScript = scripts[scripts.length - 1]; // সবশেষ স্ক্রিপ্ট
        
        // স্ক্রিপ্টের আগের এলিমেন্ট খুঁজে বের করুন
        var parent = currentScript.parentNode;
        return {
            parent: parent,
            script: currentScript
        };
    }
    
    // ===== HTML ইনজেক্ট করা =====
    function injectHTML() {
        try {
            // স্ক্রিপ্টের অবস্থান নির্ণয়
            var position = getScriptPosition();
            var parent = position.parent;
            var script = position.script;
            
            // টেম্প ডিভি তৈরি
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = MY_HTML;
            
            // সমস্ত চাইল্ড নোড নেওয়া
            var nodes = [];
            while (tempDiv.firstChild) {
                nodes.push(tempDiv.firstChild);
            }
            
            // স্ক্রিপ্টের আগে ইনজেক্ট
            nodes.forEach(function(node) {
                parent.insertBefore(node, script);
            });
            
            console.log('✅ HTML injected successfully at script position!');
            
        } catch(e) {
            console.error('❌ Injection failed:', e);
            // ফেলব্যাক: বডির শুরুতে ইনজেক্ট
            try {
                document.body.insertAdjacentHTML('afterbegin', MY_HTML);
                console.log('✅ Fallback injection successful');
            } catch(e2) {
                console.error('❌ Fallback also failed:', e2);
            }
        }
    }
    
    // ===== ইমেজ লোডিং চেক =====
    function checkImages() {
        var images = document.querySelectorAll('img[src="https://arbd24.github.io/icon/arrow.gif"]');
        images.forEach(function(img) {
            img.onerror = function() {
                this.style.display = 'none';
            };
        });
    }
    
    // ===== এক্সিকিউট =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectHTML();
            checkImages();
        });
    } else {
        injectHTML();
        checkImages();
    }
    
})();