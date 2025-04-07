class HomeBanner extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);
    const $$ = shadow.querySelectorAll.bind(shadow);

    Promise.all([
      fetch("./components/home_page/home_banner.html").then((response) => response.text()),
      fetch("./assets/css/style.css").then((response) => response.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;

        const container = document.createElement("div");
        container.innerHTML = html;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.content = $(".toolrange__banner__content-text");
        this.link = $(".toolrange__banner__content-btn");

        this.updateAttributes();
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }

  static get observedAttributes() {
    return ["content", "link"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.updateAttributes();
  }

  updateAttributes() {
    if (this.content)
      this.content.innerText = this.getAttribute("content") || "Top-Tier Equipment Cost-Effective Solutions Global Leader In Industry";
    if (this.link)
      this.link.pathname = this.getAttribute("link") || "/";
  }
}

customElements.define("home-banner", HomeBanner);
