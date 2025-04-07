import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs"; // Sử dụng file .mjs cho import trực tiếp

class HomeDistributors extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.addSwiperCSS();

    Promise.all([
      fetch("./components/home_page/home_distributors.html").then((r) => r.text()),
      fetch("./assets/css/style.css").then((r) => r.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.innerHTML = html;
        shadow.appendChild(container);

        this.initializeSwiper();
      })
      .catch((e) => console.error("Lỗi fetch HTML/CSS:", e));
  }

  addSwiperCSS() {
    const swiperCSS = document.createElement("link");
    swiperCSS.rel = "stylesheet";
    swiperCSS.href =
      "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
    this.shadowRoot.appendChild(swiperCSS);
  }

  initializeSwiper() {
    const swiperContainer = this.shadowRoot.querySelector(
      ".distributorsSwiper"
    );

    if (swiperContainer) {
      const swiper = new Swiper(swiperContainer, {
        slidesPerView: 1,
        spaceBetween: 135,
        navigation: {
          nextEl: this.shadowRoot.querySelector(".swiper-button-next"),
          prevEl: this.shadowRoot.querySelector(".swiper-button-prev"),
        },
      });

      this.swiperInstance = swiper;
    } else {
      console.error(
        "LỖI QUAN TRỌNG: Không tìm thấy phần tử container chính của Swiper"
      );
    }
  }
}

customElements.define("home-distributors", HomeDistributors);
