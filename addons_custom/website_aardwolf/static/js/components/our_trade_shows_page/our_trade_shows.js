class OurTradeShows extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    Promise.all([
      fetch("../components/our_trade_shows_page/our_trade_shows.html").then((resp) => resp.text()),
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

customElements.define("our-trade-shows-page", OurTradeShows);
