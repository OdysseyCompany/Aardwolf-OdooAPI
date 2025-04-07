export class HomeCategoriesItem extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);
    const $$ = shadow.querySelectorAll.bind(shadow);

    Promise.all([
      fetch("./components/home_page/home_categories_item.html").then((response) =>
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

        this.item = $(".toolrange__categories__item");
        this.img = $(".categorie-img img");
        this.name = $(".categorie-name");

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
        "categorieItemId",
        this.getAttribute("itemId") || ""
      );
    this.item?.setAttribute(
      "href",
      this.getAttribute("url") || "./categories-detail.html"
    );
    if (this.img)
      this.img.src =
        this.getAttribute("img") ||
        "./assets/imgs/home_page/categories/img-1.png";
    if (this.name)
      this.name.innerText = this.getAttribute("name") || "Category";
  }
}

customElements.define("home-categories-item", HomeCategoriesItem);
