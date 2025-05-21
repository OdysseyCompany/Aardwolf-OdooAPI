class HomeVideo extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);
    const $$ = shadow.querySelectorAll.bind(shadow);

    Promise.all([
      fetch("./components/home_page/home_video.html").then((response) => response.text()),
      fetch("./assets/css/style.css").then((response) => response.text()),
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
        
        $('.toolrange__video-icon').addEventListener('click', function() {
          $('#home-video').play();
//          $('#home-video').classList.add('play');
          this.classList.add('hidden');
        })

        this.updateAttributes();
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }

  static get observedAttributes() {
    return ["thumb", "source"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.updateAttributes();
  }

  updateAttributes() {
    if (this.thumbnail)
      this.thumbnail.poster = this.getAttribute("thumb") || "./assets/imgs/home_page/image_video.png";
    if (this.video)
      this.video.src = this.getAttribute("source") || "./assets/imgs/common/videos/video-demo.mp4";
  }
}

customElements.define("home-video", HomeVideo);
