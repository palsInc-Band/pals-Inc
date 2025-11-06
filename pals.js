function injectHeadElements() {
    const head = document.head;

    const metaCharset = document.createElement("meta");
    metaCharset.setAttribute("charset", "UTF-8");
    head.appendChild(metaCharset);

    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1.0";
    head.appendChild(metaViewport);

    const metaCompat = document.createElement("meta");
    metaCompat.httpEquiv = "X-UA-Compatible";
    metaCompat.content = "ie=edge";
    head.appendChild(metaCompat);

    const title = document.createElement("title");
    title.textContent = "pals Inc.";
    head.appendChild(title);

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "style.css";
    head.appendChild(stylesheet);

    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = "images/hug.ico";
    favicon.type = "image/x-icon";
    head.appendChild(favicon);
}

async function loadBandData() {
    try {
        const response = await fetch("data/band.xml");
        if (!response.ok) throw new Error("Failed to load XML file");
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const members = xml.getElementsByTagName("member");
        const container = document.getElementById("band-container");
        Array.from(members).forEach(member => {
            const id = member.getElementsByTagName("id")[0].textContent;
            const name = member.getElementsByTagName("name")[0].textContent;
            const age = member.getElementsByTagName("age")[0]?.textContent || "";
            const pronouns = member.getElementsByTagName("pronouns")[0]?.textContent || "";
            const avatar = member.getElementsByTagName("avatar")[0].textContent;
            const info = member.getElementsByTagName("info")[0].textContent;
            const section = document.createElement("div");
            section.classList.add("member-card");
            section.innerHTML = `
                <div class="member-header">
                    <h2 id="${id.toLowerCase().replace(/\s+/g, '')}">${name}</h2>
                    - <i>${age}</i>
                    - <i>${pronouns}</i>
                    - <img src="images/${avatar}" alt="${name}">
                </div>
                <p>“${info}”</p>
            `;
            container.appendChild(section);
        });
    } catch (err) {
        console.error("Error loading band data:", err);
    }
}

async function loadTrackData() {
    try {
        const response = await fetch("data/tracks.json");
        if (!response.ok) throw new Error("Failed to load JSON file");
        const data = await response.json();
        const container = document.getElementById("track-container");
        Object.values(data).forEach(track => {
            const { title, image, audio_file, links } = track;
            let linksHTML = "";
            if (links) {
                for (const [key, url] of Object.entries(links)) {
                    if (url) linksHTML += `<a href="${url}" target="_blank" rel="noopener noreferrer">${key}</a>`;
                }
            }
            const section = document.createElement("div");
            section.classList.add("track-card");
            section.innerHTML = `
                <div class="track-header">
                    <h2>${title}</h2>
                    <img src="${image}" alt="${title}">
                </div>
                <audio controls preload="metadata">
                    <source src="${audio_file}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <div class="track-links">${linksHTML}</div>
            `;
            container.appendChild(section);
        });
    } catch (err) {
        console.error(err);
    }
}

function addNavbar() {
    const navItems = [
        { href: "index.html", label: "Homepage" },
        { href: "projects.html", label: "Our Projects" },
        { href: "s&p.html", label: "Socials & Platforms" },
        { href: "about.html", label: "About Us" },
        { href: "credits.html", label: "Credits" }
    ];
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const nav = document.querySelector("nav");
    if (!nav) return;
    const ul = document.createElement("ul");
    ul.className = "nav";
    ul.style = "list-style-type: none; padding: 0; margin: 0;";
    navItems.forEach((item, i) => {
        const li = document.createElement("li");
        const isCurrent = item.href === currentPage;
        li.innerHTML = isCurrent
            ? `<span class="nav-disabled">${item.label}</span>`
            : `<a href="${item.href}">${item.label}</a>`;
        ul.appendChild(li);
        if (i < navItems.length - 1) ul.appendChild(document.createTextNode(" | "));
    });
    nav.appendChild(ul);
}

function addFooters() {
    const footerRight = document.createElement("footer");
    footerRight.className = "footer-right";
    footerRight.innerHTML = `<a href="mailto:palsinc@musican.org">palsInc@musician.org</a>`;
    const footerLeft = document.createElement("footer");
    footerLeft.className = "footer-left";
    footerLeft.innerHTML = `
        <p>© 2025 pals Inc., All rights reserved. <br>
        Released under Creative Commons <br>
        Attribution-NonCommercial-ShareAlike 4.0 International <br>
        (CC BY-NC-SA 4.0).
        </p>
    `;
    document.body.appendChild(footerLeft);
    document.body.appendChild(footerRight);
}

document.addEventListener("DOMContentLoaded", () => {
    injectHeadElements();
    addNavbar();
    loadBandData();
    loadTrackData();
    addFooters();
});
