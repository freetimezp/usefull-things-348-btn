import { initUpgradeShader } from "./upgradeShader.js";

initUpgradeShader();

const upgradeBtn = document.querySelector(".theme-upgrade");
const btn = document.querySelector(".btn");
const splash = document.querySelector(".splash");
const body = document.body;
const toggle = document.querySelector(".theme-toggle");

btn.addEventListener("click", (e) => {
    e.preventDefault();

    splash.classList.add("active");

    setTimeout(() => {
        body.classList.add("loaded");
        splash.classList.remove("active");
    }, 500);
});

toggle.addEventListener("click", () => {
    body.classList.toggle("spring");

    body.style.transition = "0.3s";
});

const glow = document.createElement("div");
glow.className = "cursor-glow";

upgradeBtn.addEventListener("click", (e) => {
    if (body.classList.contains("premium")) return;

    const x = e.clientX / window.innerWidth;
    const y = 1.0 - e.clientY / window.innerHeight;

    body.classList.add("upgrading");

    initUpgradeShader(x, y);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    //1
    tl.to(
        {},
        {
            duration: 0.7,
            onComplete: () => body.classList.add("premium"),
        }
    );

    //2
    tl.to(
        {},
        {
            duration: 0.5,
            onComplete: () => body.classList.add("reveal-cards"),
        },
        "-=0.2"
    );

    //3
    tl.to(
        {},
        {
            duration: 0.5,
            onComplete: () => body.classList.add("reveal-stats"),
        },
        "+=0.2"
    );

    //4
    tl.to(
        {},
        {
            duration: 0.4,
            onComplete: () => body.classList.remove("upgrading"),
        }
    );
});

document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});

window.addEventListener("mousemove", (e) => {
    if (!body.classList.contains("premium")) return;

    body.appendChild(glow);

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
    if (!body.classList.contains("premium") && !body.classList.contains("spring")) {
        body.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], {
            duration: 300,
        });

        return;
    }

    body.classList.remove("premium", "spring", "upgrading");
});
