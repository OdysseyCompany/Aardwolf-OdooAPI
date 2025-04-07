import "../contact_form.js";

class ContactPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    Promise.all([
      fetch("../components/contact_page/contact.html").then((resp) => resp.text()),
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
      })
      .catch((e) => console.error("Lỗi fetch HTML/CSS:", e));
  }

  renderItems() {
    const contactWrapper = this.shadowRoot.querySelector(".toolrange__contact-page__contact");

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
}

customElements.define("contact-page", ContactPage);
