class ContactForm extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);
    const $$ = shadow.querySelectorAll.bind(shadow);

    Promise.all([
      fetch("../components/contact_form.html").then((response) =>
        response.text()
      ),
      fetch("../assets/css/style.css").then((response) => response.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;

        const container = document.createElement("div");
        container.innerHTML = html;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.thumbnail = $("#home-video");
        this.video = $("#home-video source");

        $$(".select-common")?.forEach((select) => {
          select.addEventListener("click", function (e) {
            this.classList.toggle("show");
            e.stopPropagation();

            if (e.target.tagName === "DATA") {
              this.firstElementChild.value = e.target.value;
            }
          });
        });

        $(".toolrange__categories-detail__sort")?.addEventListener(
          "click",
          function (e) {
            this.classList.toggle("show");
            e.stopPropagation();

            if (e.target.tagName === "DATA") {
              this.querySelector(".sort-by__value").innerText = e.target.value;
            }
          }
        );

        $(".toolrange__contact__form")?.addEventListener(
          "submit",
          function (e) {
            e.preventDefault();
            const listInputs = this.querySelectorAll("input");
            const formData = {};

            listInputs.forEach((input) => {
              const keyName = input.name;
              formData[keyName] = input.value;
            });

            console.log("formData: ", formData);
          }
        );
        
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }
}

customElements.define("contact-form", ContactForm);
