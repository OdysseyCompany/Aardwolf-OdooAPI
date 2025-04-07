import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

import "../home_page/home_section_slider_item.js";

const productInfo = {
  name: "Aardwolf Slab Lifter",
  group: "Aardwolf Slab Lifters",
  category: "MECHANICAL LIFTING DEVICES",
  quantity: 1,
  images: [
    {
      id: 1,
      src: "./assets/imgs/common/product/img-1.png",
      type: 'image',
    },
    {
      id: 2,
      src: "./assets/imgs/common/product/img-2.png",
      type: 'image',
    },
    {
      id: 3,
      src: "./assets/imgs/common/product/img-3.png",
      type: 'image',
    },
    {
      id: 4,
      src: "./assets/imgs/common/product/img-4.png",
      type: 'image',
    },
    {
      id: 5,
      src: "./assets/imgs/common/product/img-1.png",
      type: 'video',
    },
  ],
  favourite: false,
  options: {
    title: 'Grip Range Options',
    data: [
      {
        id: 1,
        value: 'Slab Lifter AL30 (0 - 30mm / 0 - 1.2")'
      },
      {
        id: 2,
        value: 'Slab Lifter AL50 (10 - 50mm / 0.4 - 2")'
      },
      {
        id: 3,
        value: 'Slab Lifter AL60 (15 - 60mm / 0.6 - 2.4")'
      },
      {
        id: 4,
        value: 'Slab Lifter AL30 (0 - 30mm / 0 - 1.2")'
      },
    ]
  }
};

const products = [
  {
    id: 1,
    name: "AARDWOLF Slab Lifter",
    url: "./product-detail.html?id=1",
    img: "./assets/imgs/common/products/product-24.png",
  },
  {
    id: 2,
    name: "Drill Guide Assembly",
    url: "./product-detail.html?id=2",
    img: "./assets/imgs/common/products/product-25.png",
  },
  {
    id: 3,
    name: "Hydraulic brick scissor grab",
    url: "./product-detail.html?id=3",
    img: "./assets/imgs/common/products/product-26.png",
  },
  {
    id: 4,
    name: "Kitchen Installation Cart- Pro Version",
    url: "./product-detail.html?id=4",
    img: "./assets/imgs/common/products/product-27.png",
  },
  {
    id: 5,
    name: "Vacuum Glass Lifter",
    url: "./product-detail.html?id=5",
    img: "./assets/imgs/common/products/product-28.png",
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
    img: "./assets/imgs/common/products/product-29.png",
  },
  {
    id: 2,
    name: "Aardwolf Brick Grab Lifter",
    url: "./product-detail.html?id=2",
    img: "./assets/imgs/common/products/product-30.png",
  },
  {
    id: 3,
    name: "Carton Box Lifter",
    url: "./product-detail.html?id=3",
    img: "./assets/imgs/common/products/product-31.png",
  },
  {
    id: 4,
    name: "Master Trolly",
    url: "./product-detail.html?id=4",
    img: "./assets/imgs/common/products/product-32.png",
  },
  {
    id: 5,
    name: "Swiftlift",
    url: "./product-detail.html?id=5",
    img: "./assets/imgs/common/products/product-33.png",
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

class ProductDetail extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.addSwiperCSS();

    Promise.all([
      fetch("./components/product_detail_page/product_detail.html").then((r) =>
        r.text()
      ),
      fetch("./assets/css/style.css").then((r) => r.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.innerHTML = html;
        shadow.appendChild(container);

        this.handleChoseOption(shadow.querySelectorAll(".toolrange__prod-detail__prod-option"));

        this.handleQuantity(shadow);

        this.renderSliderItems();

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

  handleChoseOption(options) {
    options?.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((optionNonEvent) => {
            optionNonEvent.classList.remove("option-active");
          });

        this.classList.add("option-active");
      });
    });
  }

  handleQuantity(shadow) {
    shadow.querySelectorAll(".product-quantity-action > button")?.forEach((btn) => {
      btn.addEventListener("click", function () {
        const quantityEl = shadow.querySelector(".quantity");
        let quantity = quantityEl.innerText * 1;

        if (this.classList.contains("increase-quantity")) {
          quantity += 1;
          quantityEl.innerText = quantity;
          shadow.querySelector(".decrease-quantity").classList.remove("disable");
        } else {
          if (quantity > 1) {
            quantity -= 1;
            quantityEl.innerText = quantity;

            if (quantity < 2) {
              shadow.querySelector(".decrease-quantity").classList.add("disable");
            }
          }
        }
      });
    });
  }

  renderSliderItems() {
    const swiperWrapper = this.shadowRoot.querySelector(
      ".recommendedCombinationsSwiper .swiper-wrapper"
    );
    const swiperWrapper2 = this.shadowRoot.querySelector(
      ".ymalSwiper .swiper-wrapper"
    );

    if (swiperWrapper && swiperWrapper2) {
      swiperWrapper.innerHTML = "";
      swiperWrapper2.innerHTML = "";

      products.forEach((item) => {
        const productItem = document.createElement("home-section-slider-item");

        productItem.classList.add("swiper-slide");

        productItem.setAttribute("itemId", item.id);
        productItem.setAttribute("name", item.name);
        productItem.setAttribute("url", item.url);
        productItem.setAttribute("img", item.img);

        swiperWrapper.appendChild(productItem);
      });

      products2.forEach((item) => {
        const productItem = document.createElement("home-section-slider-item");

        productItem.classList.add("swiper-slide");

        productItem.setAttribute("itemId", item.id);
        productItem.setAttribute("name", item.name);
        productItem.setAttribute("url", item.url);
        productItem.setAttribute("img", item.img);

        swiperWrapper2.appendChild(productItem);
      });
    } else {
      console.error(
        "LỖI QUAN TRỌNG: Không tìm thấy phần tử .swiper-wrapper bên trong shadow DOM. Hãy kiểm tra file home_section_slider.html!"
      );
    }
  }

  initializeSwiper() {
    const swiperContainer = this.shadowRoot.querySelector(
      ".recommendedCombinationsSwiper"
    );
    const swiperContainer2 = this.shadowRoot.querySelector(".ymalSwiper");

    const slideAction1 = {
      el: this.shadowRoot.querySelectorAll(".swiper-pagination")[0],
      nextEl: this.shadowRoot.querySelectorAll(".swiper-button-next")[0],
      prevEl: this.shadowRoot.querySelectorAll(".swiper-button-prev")[0],
    };

    const slideAction2 = {
      el: this.shadowRoot.querySelectorAll(".swiper-pagination")[1],
      nextEl: this.shadowRoot.querySelectorAll(".swiper-button-next")[1],
      prevEl: this.shadowRoot.querySelectorAll(".swiper-button-prev")[1],
    };

    if (swiperContainer && swiperContainer2) {
      const swiper = new Swiper(swiperContainer, {
        slidesPerView: 5,
        spaceBetween: 20,
        pagination: {
          el: slideAction1.el,
          clickable: true,
        },
        navigation: {
          nextEl: slideAction1.nextEl,
          prevEl: slideAction1.prevEl,
        },
      });

      const swiper2 = new Swiper(swiperContainer2, {
        slidesPerView: 5,
        spaceBetween: 20,
        pagination: {
          el: slideAction2.el,
          clickable: true,
        },
        navigation: {
          nextEl: slideAction2.nextEl,
          prevEl: slideAction2.prevEl,
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

customElements.define("product-detail", ProductDetail);
