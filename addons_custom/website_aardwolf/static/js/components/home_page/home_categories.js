import './home_categories_item.js';

const categories = [
  {
    id: 1,
    name: "A-Frames",
    url: './categories-detail.html?id=1',
    img: './assets/imgs/home_page/categories/img-1.png'
  },
  {
    id: 2,
    name: "crane, forklift & workshop accessories",
    url: './categories-detail.html?id=2',
    img: './assets/imgs/home_page/categories/img-2.png'
  },
  {
    id: 3,
    name: "Cranes",
    url: './categories-detail.html?id=3',
    img: './assets/imgs/home_page/categories/img-3.png'
  },
  {
    id: 4,
    name: "Forklift equipment",
    url: './categories-detail.html?id=4',
    img: './assets/imgs/home_page/categories/img-4.png'
  },
  {
    id: 5,
    name: "Mechanical Lifting Devices",
    url: './categories-detail.html?id=5',
    img: './assets/imgs/home_page/categories/img-5.png'
  },
  {
    id: 6,
    name: "Slab Racks & Posts",
    url: './categories-detail.html?id=6',
    img: './assets/imgs/home_page/categories/img-6.png'
  },
  {
    id: 7,
    name: "Trolleys",
    url: './categories-detail.html?id=7',
    img: './assets/imgs/home_page/categories/img-7.png'
  },
  {
    id: 8,
    name: "A-Frames",
    url: './categories-detail.html?id=8',
    img: './assets/imgs/home_page/categories/img-8.png'
  },
  {
    id: 9,
    name: "vacuum tube lifting equipment",
    url: './categories-detail.html?id=9',
    img: './assets/imgs/home_page/categories/img-9.png'
  },
  {
    id: 10,
    name: "workshop equipment",
    url: './categories-detail.html?id=10',
    img: './assets/imgs/home_page/categories/img-10.png'
  },
  {
    id: 11,
    name: "Workwear",
    url: './categories-detail.html?id=11',
    img: './assets/imgs/home_page/categories/img-11.png'
  },
]

class HomeCategories extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const $ = shadow.querySelector.bind(shadow);
    const $$ = shadow.querySelectorAll.bind(shadow);

    Promise.all([
      fetch("./components/home_page/home_categories.html").then((response) => response.text()),
      fetch("./assets/css/style.css").then((response) => response.text()),
    ])
      .then(([html, css]) => {
        const style = document.createElement("style");
        style.textContent = css;

        const container = document.createElement("div");
        container.innerHTML = html;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.categoriesList = $(".toolrange__categories__list");

        this.renderItems();
      })
      .catch((error) => {
        console.error("Lỗi khi tải HTML hoặc CSS:", error);
      });
  }

  renderItems() {
    if(!this.categoriesList) return;

    this.categoriesList.innerHTML = '';

    categories.forEach((item) => {
      const categoryItem = document.createElement('home-categories-item');
      categoryItem.setAttribute('itemId', item.id);
      categoryItem.setAttribute('name', item.name);
      categoryItem.setAttribute('url', item.url);
      categoryItem.setAttribute('img', item.img);
      
      this.categoriesList.appendChild(categoryItem);
    })
  }
}

customElements.define("home-categories", HomeCategories);
