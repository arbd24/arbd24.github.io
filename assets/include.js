// assets/include.js
// HTML include system: <div data-include="components/header.html"></div>

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-include]");

    let loaded = 0;
    const total = elements.length;

    elements.forEach(async function (el) {
        const file = el.getAttribute("data-include");
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(file + " not found");
            const html = await response.text();
            el.innerHTML = html;

            // Inject inline <script> tags from included file
            el.querySelectorAll("script").forEach(function (oldScript) {
                const newScript = document.createElement("script");
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
            });
        } catch (err) {
            el.innerHTML = "<!-- Include error: " + file + " -->";
            console.error(err);
        } finally {
            loaded++;
            if (loaded === total) {
                document.dispatchEvent(new Event("includesLoaded"));
            }
        }
    });
});