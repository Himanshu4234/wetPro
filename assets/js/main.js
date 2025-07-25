window.addEventListener("load", () => {
  // Loader Hide (if loader exists)
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

// === COMPONENT LOADING ===
window.onload = () => {
  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith("/") || currentPath.endsWith("index.html");
  const basePath = isHome ? "" : "./";

  const loadComponent = (id, path) => {
    fetch(path)
      .then(res => res.text())
      .then(data => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = data;
      });
  };

  loadComponent("header", basePath + "/components/header.html");
  loadComponent("footer", basePath + "/components/footer.html");

  if (isHome) {
    loadComponent("hero", "components/hero.html");
    loadComponent("about", "components/about.html");
    loadComponent("services", "components/services.html");
    loadComponent("products", "components/products.html");
    loadComponent("contact", "components/contact.html");
  }
};

// === SMOOTH SCROLL TO HASH AFTER COMPONENT LOAD ===
function handleProductHashPopup() {
  const hash = window.location.hash;

  if (hash.startsWith("#product=")) {
    const productKey = hash.replace("#product=", "").toLowerCase();

    const popupMap = {
      "jaw-crusher": "popup1",
      "cone-crusher": "popup2",
      "vsi-crusher": "popup3",
      "vibrating-screen": "popup4",
      "vibrating-feeder": "popup5",
      "sand-washer": "popup6",
      "high-rate-thickener": "popup7"
    };

    const popupId = popupMap[productKey];

    if (popupId) {
      const tryScrollAndPopup = () => {
        const productSection = document.getElementById("products");
        const popup = document.getElementById(popupId);

        if (productSection && popup) {
          productSection.scrollIntoView({ behavior: "smooth" });

          setTimeout(() => {
            popup.classList.add("active");
            document.body.classList.add("noscroll");
          }, 500);
        } else {
          setTimeout(tryScrollAndPopup, 100);
        }
      };

      tryScrollAndPopup();
    }
  }
}

// Handle first load
window.addEventListener('load', handleProductHashPopup);

// Handle clicks on same-page links (hash changes)
window.addEventListener('hashchange', handleProductHashPopup);



// === STICKY HEADER ===
window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header");
  header?.classList.toggle("sticky", window.scrollY > 100);
});

// === HERO SLIDER ===
const heroImages = [
  "assets/img/hero1.jpg", "assets/img/hero2.jpg", "assets/img/hero3.jpg",
  "assets/img/hero4.jpg", "assets/img/hero5.jpg", "assets/img/hero6.jpg"
];
const heroHeadings = [
  "Welcome to Wetpro", "Innovate with Water", "Smart Solutions, Smart Future",
  "Flow with Nature", "Elevate with Technology", "Future is Fluid"
];
const heroSubtexts = [
  "Optimized Solutions for Industrial & Mining Applications",
  "Technology meets nature in every drop.",
  "Solutions that matter. Today and tomorrow.",
  "Eco-conscious innovation starts here.",
  "Precision-engineered water solutions.",
  "We build what the future flows with."
];
heroImages.forEach(src => new Image().src = src);
let index = 0, slideInterval;
function changeSlide(i) {
  const bg = document.getElementById("heroBackground");
  const heading = document.getElementById("heroHeading");
  const subtext = document.getElementById("heroSubtext");

  if (!bg || !heading || !subtext) return;

  // Update background image
  bg.style.backgroundImage = `url(${heroImages[i]})`;

  // Remove animation classes
  heading.classList.remove("show", "hero-fade-up");
  subtext.classList.remove("show", "hero-fade-up");

  // Delay to allow reflow and retrigger animation
  setTimeout(() => {
    // Update text
    heading.textContent = heroHeadings[i];
    subtext.textContent = heroSubtexts[i];

    // Add animation classes back
    heading.classList.add("hero-fade-up");
    subtext.classList.add("hero-fade-up");

    // Force reflow and re-add 'show' class to trigger transition
    requestAnimationFrame(() => {
      heading.classList.add("show");
      subtext.classList.add("show");
    });
  }, 50);
}


function startSlideShow() {
  slideInterval = setInterval(() => {
    index = (index + 1) % heroImages.length;
    changeSlide(index);
  }, 4000);
}
function showPrevSlide() {
  clearInterval(slideInterval);
  index = (index - 1 + heroImages.length) % heroImages.length;
  changeSlide(index);
  startSlideShow();
}
function showNextSlide() {
  clearInterval(slideInterval);
  index = (index + 1) % heroImages.length;
  changeSlide(index);
  startSlideShow();
}
const observer = new MutationObserver(() => {
  if (document.getElementById("heroBackground")) {
    changeSlide(index);
    startSlideShow();
    document.getElementById("prevSlide")?.addEventListener("click", showPrevSlide);
    document.getElementById("nextSlide")?.addEventListener("click", showNextSlide);
    observer.disconnect();
  }
});
observer.observe(document.getElementById("hero") || document.body, { childList: true, subtree: true });

// === CARD SCROLL ANIMATION ===
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle("animate-visible", entry.isIntersecting);
  });
}, { threshold: 0.3 });
const sectionObserver = new MutationObserver(() => {
  document.querySelectorAll(".card.animate-on-scroll").forEach(card => cardObserver.observe(card));
  sectionObserver.disconnect();
});
sectionObserver.observe(document.getElementById("about") || document.body, { childList: true, subtree: true });

// === ABOUT SECTION ANIMATION ===
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle("animate-visible", entry.isIntersecting);
  });
}, { threshold: 0.2 });
const checkAboutSection = new MutationObserver(() => {
  const left = document.querySelector(".about-text");
  const right = document.querySelector(".about-video");
  if (left && right) {
    aboutObserver.observe(left);
    aboutObserver.observe(right);
    checkAboutSection.disconnect();
  }
});
checkAboutSection.observe(document.getElementById("about") || document.body, { childList: true, subtree: true });

// === VIDEO POPUP ===
document.addEventListener("click", (e) => {
  const popup = document.getElementById("videoPopup");
  const iframe = document.getElementById("youtubePlayer");

  if (e.target.closest("#playVideo")) {
    const container = document.createElement("div");
    container.id = "videoContainer";
    container.style.cssText = "width:90vw;max-width:960px;max-height:70vh;aspect-ratio:16/9;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center";

    const video = document.createElement("video");
    video.src = "assets/img/about-us.mp4";
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = "width:100%;height:100%;object-fit:contain";

    iframe.replaceWith(container);
    container.appendChild(video);
    popup.style.display = "flex";
  }

  if (e.target.id === "closePopup" || e.target.id === "videoPopup") {
    const container = document.getElementById("videoContainer");
    if (container) {
      const newIframe = document.createElement("iframe");
      newIframe.id = "youtubePlayer";
      newIframe.width = "100%";
      newIframe.height = "100%";
      newIframe.frameBorder = "0";
      newIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      newIframe.allowFullscreen = true;
      container.replaceWith(newIframe);
    }
    popup.style.display = "none";
  }
});

// === POPUP GENERIC ===
function openPopup(id) {
  document.getElementById(id)?.classList.add("active");
  document.body.classList.add("noscroll");
}
function closePopup() {
  document.querySelectorAll(".popup").forEach(p => p.classList.remove("active"));
  document.body.classList.remove("noscroll");
}


// === SCROLL TO TOP ===
const scrollBtnObserver = new MutationObserver(() => {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.style.display = (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) ? "block" : "none";
    });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    scrollBtnObserver.disconnect();
  }
});
scrollBtnObserver.observe(document.body, { childList: true, subtree: true });

// ==================== COUNTER ANIMATION ====================
function animateCountUp(id, endValue, duration) {
  const element = document.getElementById(id);
  if (!element) return;
  clearInterval(element._counterTimer);
  let start = 0;
  const increment = Math.ceil(endValue / (duration / 20));
  element.innerText = "0";

  const timer = setInterval(() => {
    start += increment;
    if (start >= endValue) {
      element.innerText = endValue.toLocaleString() + "+";
      clearInterval(timer);
    } else {
      element.innerText = start.toLocaleString();
    }
  }, 20);

  element._counterTimer = timer;
}

// === COUNTER ANIMATION ===
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      animateCountUp(el.id, 5000, 1500);
    } else {
      el.innerText = "0";
      clearInterval(el._counterTimer);
    }
  });
}, { threshold: 0.6 });

const waitForCounter = new MutationObserver(() => {
  const counterElement = document.getElementById("capacityCounter");
  if (counterElement) {
    counterObserver.observe(counterElement);
    waitForCounter.disconnect();
  }
});
waitForCounter.observe(document.body, { childList: true, subtree: true });
function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobileNav");
  const menuIcon = document.querySelector(".mobile-menu-icon");
  const whatsappIcon = document.querySelector(".whatsapp-float");

  mobileNav.classList.toggle("active");
  menuIcon.classList.toggle("hidden");
  whatsappIcon.classList.toggle("shiftleft");

}