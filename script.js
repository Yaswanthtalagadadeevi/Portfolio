/* =============================================
   PORTFOLIO SCRIPT — Premium Interactions
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ── THEME ─────────────────────────────────── */
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("portfolio-theme", next);
        });
    }

    /* ── CUSTOM CURSOR ────────────────────────── */
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (dot && ring && window.matchMedia("(hover: hover)").matches) {
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let animFrame;

        document.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + "px";
            ring.style.top = ringY + "px";
            animFrame = requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = document.querySelectorAll(
            "a, button, .project-card, .skill-tab, .activity-card, .contact-card"
        );
        hoverTargets.forEach(el => {
            el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hovering"));
            el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hovering"));
        });
    }

    /* ── HEADER SCROLL ──────────────────────── */
    const header = document.getElementById("header");
    function onScroll() {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── MOBILE NAV ─────────────────────────── */
    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener("click", function () {
            this.classList.toggle("active");
            mobileNav.classList.toggle("open");
        });

        // Close on link click
        mobileNav.querySelectorAll(".mobile-nav-link").forEach(link => {
            link.addEventListener("click", function () {
                mobileToggle.classList.remove("active");
                mobileNav.classList.remove("open");
            });
        });
    }

    /* ── SMOOTH SCROLL ──────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                const offset = header ? header.offsetHeight + 16 : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    /* ── LOGO SCROLL TO TOP ─────────────────── */
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ── SKILLS TABS ────────────────────────── */
    const skillTabs = document.querySelectorAll(".skill-tab");
    const skillPanels = document.querySelectorAll(".skills-panel");

    skillTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const target = this.getAttribute("data-target");

            skillTabs.forEach(t => t.classList.remove("active"));
            skillPanels.forEach(p => p.classList.remove("active"));

            this.classList.add("active");
            const panel = document.getElementById(target);
            if (panel) panel.classList.add("active");
        });
    });

    /* ── SCROLL REVEAL ──────────────────────── */
    const revealElements = document.querySelectorAll(
        ".project-card, .skill-tab, .skills-tabs, .timeline-item, .activity-card, .edu-card, .contact-card, .section-header"
    );

    revealElements.forEach((el, i) => {
        el.classList.add("scroll-reveal");
        // Stagger siblings
        const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains(el.classList[0]));
        const sibIdx = siblings.indexOf(el);
        if (sibIdx > 0 && sibIdx < 4) {
            el.classList.add("scroll-reveal-delay-" + Math.min(sibIdx, 3));
        }
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    /* ── FOOTER YEAR ────────────────────────── */
    const yearEl = document.querySelector(".footer .year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    } else {
        // If no .year span, update dynamically
        const footerCopy = document.querySelector(".footer-copy");
        if (footerCopy) {
            footerCopy.innerHTML = footerCopy.innerHTML.replace(
                /© \d{4}/,
                "© " + new Date().getFullYear()
            );
        }
    }

    /* ── ACTIVE NAV ON SCROLL ───────────────── */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveNav() {
        let current = "";
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.style.color = "";
            const href = link.getAttribute("href");
            if (href === "#" + current) {
                link.style.color = "var(--fg)";
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });

    /* ── PROJECT CARD 3D TILT (subtle) ──────── */
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach(card => {
        card.addEventListener("mousemove", function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const tiltX = ((y - cy) / cy) * 3;
            const tiltY = ((x - cx) / cx) * -3;
            this.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener("mouseleave", function () {
            this.style.transform = "";
        });
    });

    /* ── TIMELINE ANIMATION ─────────────────── */
    const timelineItems = document.querySelectorAll(".timeline-item");
    const timelineObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = (i * 0.15) + "s";
                entry.target.classList.add("visible");
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    /* ── CONTACT CARD HOVER SOUND (visual only) */
    const contactCards = document.querySelectorAll(".contact-card");
    contactCards.forEach(card => {
        const val = card.querySelector(".contact-value");
        if (val && val.textContent.includes("@")) {
            card.style.cursor = "pointer";
            card.addEventListener("click", function () {
                const email = val.textContent.trim();
                window.location.href = "mailto:" + email;
            });
        }
        if (val && val.textContent.startsWith("+")) {
            card.style.cursor = "pointer";
            card.addEventListener("click", function () {
                window.location.href = "tel:" + val.textContent.trim().replace(/\s/g, "");
            });
        }
    });

});
