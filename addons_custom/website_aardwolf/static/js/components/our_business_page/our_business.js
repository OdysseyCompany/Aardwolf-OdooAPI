import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

import "../contact_form.js";

class HomeOurBusiness extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.addSwiperCSS();

    Promise.all([
      fetch("../components/our_business_page/our_business.html").then((resp) => resp.text()),
      fetch("../assets/css/style.css").then((resp) => resp.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.innerHTML = html;
        shadow.appendChild(container);

        this.renderItems();

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

  renderItems() {
    const contactWrapper = this.shadowRoot.querySelector(".toolrange__our-business__contact");

    if (contactWrapper) {
      contactWrapper.innerHTML = "";

      const contact = document.createElement("contact-form");

      contactWrapper.appendChild(contact);
    } else {
      console.error(
        "Không tìm thấy phần tử .toolrange__our-business__contact bên trong shadow DOM!"
      );
    }
  }

  initializeSwiper() {
    const swiperContainer = this.shadowRoot.querySelector(".historySwiper");
    const swiperContainer2 = this.shadowRoot.querySelector(".historySwiper2");

    if (swiperContainer && swiperContainer2) {
      const swiper = new Swiper(swiperContainer, {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
      });

      const swiper2 = new Swiper(swiperContainer2, {
        initialSlide: 1,
        grabCursor: false,
        centeredSlides: true,
        slidesPerView: 3,
        thumbs: {
          swiper: swiper,
        },
      });
      
      this.swiperInstance = swiper;
      this.swiperInstance2 = swiper2;
    } else {
      console.error(
        "LỖI QUAN TRỌNG: Không tìm thấy phần tử container chính của Swiper"
      );
    }
  }
}

customElements.define("home-our-business", HomeOurBusiness);
