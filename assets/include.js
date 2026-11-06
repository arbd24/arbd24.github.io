document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-include]");
    let loaded = 0;
    const total = elements.length;

    if (total === 0) {
        window.__includesLoaded = true;
        document.dispatchEvent(new Event("includesLoaded"));
        return;
    }

    elements.forEach(async function (el) {
        const file = el.getAttribute("data-include");
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(file + " not found (" + response.status + ")");
            const html = await response.text();
            el.innerHTML = html;

            // inline <script> চালাও
            el.querySelectorAll("script").forEach(function (oldScript) {
                const newScript = document.createElement("script");
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
        } catch (err) {
            el.innerHTML = "<!-- Include error: " + file + " -->";
            console.error(err);
        } finally {
            loaded++;
            if (loaded === total) {
                window.__includesLoaded = true;
                document.dispatchEvent(new Event("includesLoaded"));
            }
        }
    });
});
