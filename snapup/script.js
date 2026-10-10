
/* =========================================
   SNAPUP STUDIOS
   Shared JavaScript — Part 1
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* 1. AUTOMATIC FOOTER COPYRIGHT YEAR */

    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = currentYear;
    });


    /* 2. MOBILE NAVIGATION */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-navigation");

    if (menuToggle && navigation) {

        const closeMenu = () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");

            navigation.classList.remove("is-open");
            document.body.classList.remove("menu-open");
        };

        const openMenu = () => {
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");

            navigation.classList.add("is-open");
            document.body.classList.add("menu-open");
        };

        menuToggle.addEventListener("click", () => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (
                isExpanded &&
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });

    }


    /* 3. GRACEFUL MISSING-IMAGE HANDLING */

    const images = document.querySelectorAll("img");

    const handleMissingImage = (image) => {
        if (image.dataset.fallbackHandled === "true") {
            return;
        }

        image.dataset.fallbackHandled = "true";
        image.classList.add("image-unavailable");

        /*
         * Keep the image's original dimensions and layout.
         * Remove only the broken image element's visible content.
         * The CSS fallback provides a neutral background and label.
         */

        image.removeAttribute("srcset");
        image.alt = "Photograph currently unavailable";

        image.style.visibility = "hidden";
    };

    images.forEach((image) => {

        image.addEventListener("error", () => {
            handleMissingImage(image);
        });

        /*
         * Handle images that failed before the listener was attached.
         */

        if (image.complete && image.naturalWidth === 0) {
            handleMissingImage(image);
        }

    });


    /* 4. CURRENT PAGE NAVIGATION STATE */

    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    document.querySelectorAll(".primary-navigation .nav-link").forEach((link) => {

        const linkPage = (
            link.getAttribute("href") || ""
        ).split("/").pop().toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }

    });

});
