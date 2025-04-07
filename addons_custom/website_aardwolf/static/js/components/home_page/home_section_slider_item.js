export class HomeSectionSliderItem extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);

    Promise.all([
      fetch("./components/home_section_slider_item.html").then((response) =>
        response.text()
      ),
      fetch("./assets/css/style.css").then((response) => response.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;

        const container = document.createElement("div");
        container.innerHTML = html;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.item = $(".toolrange__recomment-slider-slide");
        this.img = $(".slide-img img");
        this.name = $(".img-content p");

        this.updateAttributes();
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }

  static get observedAttributes() {
    return ["itemId", "name", "url", "img"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.updateAttributes();
  }

  updateAttributes() {
    if (this.item)
      this.item?.setAttribute(
        "productItemId",
        this.getAttribute("itemId") || ""
      );
    this.item?.setAttribute(
      "href",
      this.getAttribute("url") || "./product-detail.html"
    );
    if (this.img)
      this.img.src =
        this.getAttribute("img") ||
        "./assets/imgs/common/products/product-29.png";
    if (this.name)
      this.name.innerText = this.getAttribute("name") || "Category";
  }
}

customElements.define("home-section-slider-item", HomeSectionSliderItem);
