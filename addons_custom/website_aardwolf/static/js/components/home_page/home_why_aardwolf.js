class HomeWhyAardwolf extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    Promise.all([
      fetch("./components/home_page/home_why_aardwolf.html").then((response) => response.text()),
      fetch("./assets/css/style.css").then((response) => response.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;

        const container = document.createElement("div");
        container.innerHTML = html;

        shadow.appendChild(style);
        shadow.appendChild(container);
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }
}

customElements.define("home-why-aardwolf", HomeWhyAardwolf);
