(function () {
    "use strict";

    var JSON_URL = "https://raw.githubusercontent.com/arbd24/arbd24.github.io/refs/heads/main/components/blogs.json";
    var PER_PAGE = 15;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var listView    = document.getElementById("listView");
        var postView    = document.getElementById("postView");
        var blogStatus  = document.getElementById("blogStatus");
        var blogList    = document.getElementById("blogList");
        var blogPager   = document.getElementById("blogPager");
        var postStatus  = document.getElementById("postStatus");
        var postArticle = document.getElementById("postArticle");
        var postTitle   = document.getElementById("postTitle");
        var postMeta    = document.getElementById("postMeta");
        var postContent = document.getElementById("postContent");

        if (!listView) return;

        var params   = new URLSearchParams(window.location.search);
        var wantedId = params.get("id");

        // -------- হেল্পার --------

        function removeBlock(html, openTag, closeTag) {
            var out = "";
            var i = 0;
            while (i < html.length) {
                var openIdx = html.indexOf(openTag, i);
                if (openIdx === -1) { out += html.substring(i); break; }
                out += html.substring(i, openIdx);
                var closeIdx = html.indexOf(closeTag, openIdx);
                if (closeIdx === -1) break;
                i = closeIdx + closeTag.length;
            }
            return out;
        }

        function stripWrapperTags(html) {
            var out = "";
            var i = 0;
            while (i < html.length) {
                if (html.charAt(i) === "<") {
                    var j = html.indexOf(">", i);
                    if (j !== -1) {
                        var tag = html.substring(i + 1, j).replace(/^\//, "").split(/\s/)[0].toLowerCase();
                        if (tag === "html" || tag === "body" || tag === "head") {
                            i = j + 1;
                            continue;
                        }
                    }
                }
                out += html.charAt(i);
                i++;
            }
            return out;
        }

        function stripDoctype(html) {
            var lower = html.toLowerCase();
            var out = "";
            var i = 0;
            while (i < html.length) {
                var idx = lower.indexOf("<!doctype", i);
                if (idx === -1) { out += html.substring(i); break; }
                out += html.substring(i, idx);
                var j = html.indexOf(">", idx);
                if (j === -1) break;
                i = j + 1;
            }
            return out;
        }

        function scopeCss(css) {
            if (!css) return "";
            return css.replace(/([^{}]+)\{/g, function (full, selectorPart) {
                var trimmed = selectorPart.trim();
                if (!trimmed || trimmed.charAt(0) === "@") return full;
                var sels = trimmed.split(",");
                var mapped = [];
                for (var k = 0; k < sels.length; k++) {
                    var s = sels[k].trim();
                    if (!s) continue;
                    if (/^html$/i.test(s) || /^body$/i.test(s)) mapped.push("#postContent");
                    else if (/^(html|body)\b/i.test(s)) mapped.push(s.replace(/^(html|body)\b/i, "#postContent"));
                    else mapped.push("#postContent " + s);
                }
                return mapped.join(", ") + " {";
            });
        }

        function scopeStyles(html) {
            var STYLE_OPEN = "<style";
            var STYLE_CLOSE = "<" + "/style" + ">";
            var out = "";
            var i = 0;
            while (i < html.length) {
                var openIdx = html.indexOf(STYLE_OPEN, i);
                if (openIdx === -1) { out += html.substring(i); break; }
                var gtIdx = html.indexOf(">", openIdx);
                if (gtIdx === -1) { out += html.substring(i); break; }
                var head = html.substring(openIdx, gtIdx + 1);
                var closeIdx = html.indexOf(STYLE_CLOSE, gtIdx + 1);
                if (closeIdx === -1) { out += html.substring(i); break; }
                var css = html.substring(gtIdx + 1, closeIdx);
                out += html.substring(i, openIdx);
                out += head + scopeCss(css) + STYLE_CLOSE;
                i = closeIdx + STYLE_CLOSE.length;
            }
            return out;
        }

        function preparePostHtml(raw) {
            if (!raw) return "";
            var S_OPEN  = "<" + "script";
            var S_CLOSE = "<" + "/script" + ">";
            var N_OPEN  = "<" + "noscript";
            var N_CLOSE = "<" + "/noscript" + ">";
            var H_OPEN  = "<" + "head";
            var H_CLOSE = "<" + "/head" + ">";

            var html = raw;
            html = removeBlock(html, S_OPEN, S_CLOSE);
            html = removeBlock(html, N_OPEN, N_CLOSE);
            html = removeBlock(html, H_OPEN, H_CLOSE);
            html = stripDoctype(html);
            html = stripWrapperTags(html);
            html = scopeStyles(html);
            return html.trim();
        }

        function getThumb(raw) {
            if (!raw) return "";
            var m = raw.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
            return m ? m[1] : "";
        }

        // -------- স্টেট --------
        var ALL_IDS  = [];
        var DATA     = {};
        var FILTERED = [];
        var PAGE     = 1;

        function renderList() {
            blogList.innerHTML  = "";
            blogPager.innerHTML = "";

            var total = FILTERED.length;
            var pages = Math.max(1, Math.ceil(total / PER_PAGE));
            if (PAGE > pages) PAGE = pages;
            if (PAGE < 1)     PAGE = 1;

            var start = (PAGE - 1) * PER_PAGE;
            var end   = Math.min(start + PER_PAGE, total);

            if (!total) {
                blogStatus.style.display = "block";
                blogStatus.textContent = "কোনো ব্লগ পাওয়া যায়নি।";
                return;
            }
            blogStatus.style.display = "none";

            for (var i = start; i < end; i++) {
                var id   = FILTERED[i];
                var post = DATA[id];

                var li = document.createElement("li");
                li.className = "blog-card";

                var link = document.createElement("a");
                link.href = "?id=" + encodeURIComponent(id);
                link.className = "blog-card-link";

                var thumbSrc = getThumb(post.text);
                if (thumbSrc) {
                    var img = document.createElement("img");
                    img.className = "blog-card-thumb";
                    img.src = thumbSrc;
                    img.alt = post.name || "";
                    img.loading = "lazy";
                    img.onerror = function () { if (this.parentNode) this.parentNode.removeChild(this); };
                    link.appendChild(img);
                }

                var info = document.createElement("div");
                info.className = "blog-card-info";

                var titleEl = document.createElement("div");
                titleEl.className = "blog-card-title";
                titleEl.textContent = post.name || ("Untitled #" + id);
                info.appendChild(titleEl);

                if (post.category) {
                    var cat = document.createElement("div");
                    cat.className = "blog-card-cat";
                    cat.textContent = post.category;
                    info.appendChild(cat);
                }

                var dateText = post.date || (post.created_at ? post.created_at.slice(0, 10) : "");
                if (dateText) {
                    var dateEl = document.createElement("div");
                    dateEl.className = "blog-card-date";
                    dateEl.innerHTML = '<i class="far fa-calendar-alt"></i> ' + dateText;
                    info.appendChild(dateEl);
                }

                link.appendChild(info);
                li.appendChild(link);
                blogList.appendChild(li);
            }

            if (pages > 1) {
                var prev = document.createElement("button");
                prev.className = "blog-page-btn";
                prev.textContent = "« আগের";
                prev.disabled = PAGE === 1;
                prev.onclick = function () { PAGE--; renderList(); window.scrollTo({top:0, behavior:"smooth"}); };
                blogPager.appendChild(prev);

                var pageBtns = [];
                var push = function (n) { pageBtns.push(n); };
                if (pages <= 7) {
                    for (var n1 = 1; n1 <= pages; n1++) push(n1);
                } else {
                    push(1);
                    if (PAGE > 3) push("…");
                    for (var n2 = Math.max(2, PAGE - 1); n2 <= Math.min(pages - 1, PAGE + 1); n2++) push(n2);
                    if (PAGE < pages - 2) push("…");
                    push(pages);
                }

                pageBtns.forEach(function (n) {
                    if (n === "…") {
                        var sp = document.createElement("span");
                        sp.className = "blog-page-dots";
                        sp.textContent = "…";
                        blogPager.appendChild(sp);
                        return;
                    }
                    var b = document.createElement("button");
                    b.className = "blog-page-btn" + (n === PAGE ? " active" : "");
                    b.textContent = n;
                    b.onclick = function () { PAGE = n; renderList(); window.scrollTo({top:0, behavior:"smooth"}); };
                    blogPager.appendChild(b);
                });

                var next = document.createElement("button");
                next.className = "blog-page-btn";
                next.textContent = "পরের »";
                next.disabled = PAGE === pages;
                next.onclick = function () { PAGE++; renderList(); window.scrollTo({top:0, behavior:"smooth"}); };
                blogPager.appendChild(next);
            }
        }

        function applySearch(q) {
            var needle = (q || "").trim().toLowerCase();
            if (!needle) {
                FILTERED = ALL_IDS.slice();
            } else {
                FILTERED = ALL_IDS.filter(function (id) {
                    var p = DATA[id];
                    return (p.name || "").toLowerCase().indexOf(needle) !== -1 ||
                           (p.category || "").toLowerCase().indexOf(needle) !== -1;
                });
            }
            PAGE = 1;
            renderList();
        }

        function renderDetail() {
            listView.style.display = "none";
            postView.style.display = "block";

            var post = DATA[wantedId];
            if (!post) {
                postStatus.textContent = "পোস্টটি খুঁজে পাওয়া যায়নি।";
                return;
            }

            postTitle.textContent = post.name || "Untitled";

            var parts = [];
            if (post.category) parts.push(post.category);
            if (post.date)     parts.push(post.date);
            postMeta.textContent = parts.join(" • ");
            if (!parts.length) postMeta.style.display = "none";

            postContent.innerHTML = preparePostHtml(post.text) ||
                                    "<p><em>কনটেন্ট নেই</em></p>";

            document.title = (post.name || "Blog") + " — Blog";

            postStatus.style.display  = "none";
            postArticle.style.display = "block";

            var back = document.getElementById("backToList");
            if (back) back.href = "?";
        }

        function bindSearchBox() {
            var searchInput = document.getElementById("search");
            if (!searchInput) return false;

            if (searchInput.value) applySearch(searchInput.value);

            var t;
            searchInput.addEventListener("input", function (e) {
                clearTimeout(t);
                var val = e.target.value;
                t = setTimeout(function () { applySearch(val); }, 150);
            });
            return true;
        }

        fetch(JSON_URL)
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(function (data) {
                DATA    = data;
                ALL_IDS = Object.keys(data);

                ALL_IDS.sort(function (a, b) {
                    var da = data[a].created_at || data[a].date || "";
                    var db = data[b].created_at || data[b].date || "";
                    return db.localeCompare(da);
                });

                if (wantedId) {
                    renderDetail();
                    return;
                }

                FILTERED = ALL_IDS.slice();
                blogStatus.style.display = "none";
                renderList();

                if (!bindSearchBox()) {
                    var obs = new MutationObserver(function () {
                        if (bindSearchBox()) obs.disconnect();
                    });
                    obs.observe(document.body, { childList: true, subtree: true });
                    setTimeout(function () { obs.disconnect(); }, 5000);
                }
            })
            .catch(function (err) {
                console.error(err);
                var el = wantedId ? postStatus : blogStatus;
                if (el) el.textContent = "লোড করা যায়নি: " + err.message;
            });
    });
})();
