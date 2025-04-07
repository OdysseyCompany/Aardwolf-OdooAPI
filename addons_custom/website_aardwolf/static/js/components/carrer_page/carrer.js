class CarrerPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    Promise.all([
      fetch("../components/carrer_page/carrer.html").then((resp) => resp.text()),
      fetch("../assets/css/style.css").then((resp) => resp.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);

        const container = document.createElement("div");
        container.innerHTML = html;
        shadow.appendChild(container);

      })
      .catch((e) => console.error("Lỗi fetch HTML/CSS:", e));
  }
}

customElements.define("carrer-page", CarrerPage);
