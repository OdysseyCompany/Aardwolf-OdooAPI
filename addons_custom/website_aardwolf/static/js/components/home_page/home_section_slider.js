import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

import "./home_section_slider_item.js";

const products = [
  {
    id: 1,
    name: "AARDWOLF Slab Lifter",
    url: "./product-detail.html?id=1",
    img: "./assets/imgs/common/products/product-29.png",
  },
  {
    id: 2,
    name: "Drill Guide Assembly",
    url: "./product-detail.html?id=2",
    img: "./assets/imgs/common/products/product-33.png",
  },
  {
    id: 3,
    name: "Hydraulic brick scissor grab",
    url: "./product-detail.html?id=3",
    img: "./assets/imgs/common/products/product-32.png",
  },
  {
    id: 4,
    name: "Kitchen Installation Cart- Pro Version",
    url: "./product-detail.html?id=4",
    img: "./assets/imgs/common/products/product-31.png",
  },
  {
    id: 5,
    name: "Vacuum Glass Lifter",
    url: "./product-detail.html?id=5",
    img: "./assets/imgs/common/products/product-30.png",
  },
  {
    id: 6,
    name: "AARDWOLF Slab Lifter",
    url: "./product-detail.html?id=6",
    img: "./assets/imgs/common/products/product-29.png",
  },
  {
    id: 7,
    name: "Drill Guide Assembly",
    url: "./product-detail.html?id=7",
    img: "./assets/imgs/common/products/product-33.png",
  },
  {
    id: 8,
    name: "Hydraulic brick scissor grab",
    url: "./product-detail.html?id=8",
    img: "./assets/imgs/common/products/product-32.png",
  },
  {
    id: 9,
    name: "Kitchen Installation Cart- Pro Version",
    url: "./product-detail.html?id=9",
    img: "./assets/imgs/common/products/product-31.png",
  },
];

const products2 = [
  {
    id: 1,
    name: "Aardwolf Barrier Lifter",
    url: "./product-detail.html?id=1",
    img: "./assets/imgs/common/products/product-34.png",
  },
  {
    id: 2,
    name: "Aardwolf Brick Grab Lifter",
    url: "./product-detail.html?id=2",
    img: "./assets/imgs/common/products/product-35.png",
  },
  {
    id: 3,
    name: "Carton Box Lifter",
    url: "./product-detail.html?id=3",
    img: "./assets/imgs/common/products/product-36.png",
  },
  {
    id: 4,
    name: "Master Trolly",
    url: "./product-detail.html?id=4",
    img: "./assets/imgs/common/products/product-37.png",
  },
  {
    id: 5,
    name: "Swiftlift",
    url: "./product-detail.html?id=5",
    img: "./assets/imgs/common/products/product-38.png",
  },
  {
    id: 6,
    name: "Aardwolf Barrier Lifter",
    url: "./product-detail.html?id=6",
    img: "./assets/imgs/common/products/product-34.png",
  },
  {
    id: 7,
    name: "Aardwolf Brick Grab Lifter",
    url: "./product-detail.html?id=7",
    img: "./assets/imgs/common/products/product-35.png",
  },
  {
    id: 8,
    name: "Carton Box Lifter",
    url: "./product-detail.html?id=8",
    img: "./assets/imgs/common/products/product-36.png",
  },
  {
    id: 9,
    name: "Master Trolly",
    url: "./product-detail.html?id=9",
    img: "./assets/imgs/common/products/product-37.png",
  },
];

class HomeSectionSlider extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.addSwiperCSS();

    Promise.all([
      fetch("./components/home_section_slider.html").then((r) => r.text()),
      fetch("./assets/css/style.css").then((r) => r.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.innerHTML = html;
        shadow.appendChild(container);

        this.titleElement = shadow.querySelector(".toolrange__recomment-slider-title");

        this.renderItems(); // Phải hoàn tất trước khi khởi tạo Swiper

        this.initializeSwiper();

        this.updateAttributes();

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

  static get observedAttributes() {
    return ["sliderId", "title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.updateAttributes();
  }

  updateAttributes() {
    if (this.titleElement)
      this.titleElement.innerText = this.getAttribute("title") || "PRODUCTS";
  }

  renderItems() {
    const swiperWrapper = this.shadowRoot.querySelector(".swiper-wrapper");

    if (swiperWrapper) {
      swiperWrapper.innerHTML = "";

      const id = this.getAttribute("sliderId");
      let data = [];

      id === '1' ? data = products : data = products2;

      data.forEach((item) => {
        const productItem = document.createElement("home-section-slider-item");

        productItem.classList.add("swiper-slide");

        productItem.setAttribute("itemId", item.id);
        productItem.setAttribute("name", item.name);
        productItem.setAttribute("url", item.url);
        productItem.setAttribute("img", item.img);

        swiperWrapper.appendChild(productItem);
      });
    } else {
      console.error(
        "LỖI QUAN TRỌNG: Không tìm thấy phần tử .swiper-wrapper bên trong shadow DOM. Hãy kiểm tra file home_section_slider.html!"
      );
    }
  }

  initializeSwiper() {
    const swiperContainer = this.shadowRoot.querySelector(".recommendedSwiper");

    if (swiperContainer) {
      const swiper = new Swiper(swiperContainer, {
        slidesPerView: 5,
        spaceBetween: 20,
        pagination: {
          el: this.shadowRoot.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: this.shadowRoot.querySelector(".swiper-button-next"),
          prevEl: this.shadowRoot.querySelector(".swiper-button-prev"),
        },
        // Cân nhắc thêm observer và observeParents nếu nội dung thay đổi sau khi khởi tạo
        // observer: true,
        // observeParents: true,
      });
      
      // Lưu lại instance swiper nếu bạn cần gọi update sau này
      this.swiperInstance = swiper;
    } else {
      console.error(
        "LỖI QUAN TRỌNG: Không tìm thấy phần tử container chính của Swiper"
      );
    }
  }
}

customElements.define("home-section-slider", HomeSectionSlider);
