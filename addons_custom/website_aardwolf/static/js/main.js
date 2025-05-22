document.addEventListener("DOMContentLoaded", async function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const video = document.getElementById('home-video');

   if (video) {
      video.addEventListener('click', function () {
          if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
   };

  // Menu Category Header Handler
  const menuCategoryHandler = {
    async init() {
      const categoriesList = $(".product-drop-down__list.drop-down__list");
      if (!categoriesList) return;
      const categoriesListHomepage = $(".toolrange__categories__list");
      if (!categoriesList && !categoriesListHomepage) return;

      try {
        const response = await fetch('/api/v1/get-data-categories', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch categories');

        const data = await response.json();
        const categories = data.result || [];

        if (categoriesList) this.renderCategories(categories, categoriesList);
        if (categoriesListHomepage) this.renderCategoriesHomepage(categories, categoriesListHomepage);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    },

    renderCategoriesHomepage(categories, container) {
      const isHomepageStyle = container.classList.contains("toolrange__categories__list");

      categories.forEach(category => {
        if (isHomepageStyle) {
          // Render kiểu homepage
          const a = document.createElement("a");
          a.className = "toolrange__categories__item";
          a.href = `/category-detail/${category.slug}`;
          a.setAttribute("categorieItemId", category.id || "");

          const divImg = document.createElement("div");
          divImg.className = "categorie-img";

          const img = document.createElement("img");
          img.src = category.image;
          img.alt = "";

          divImg.appendChild(img);

          const p = document.createElement("p");
          p.className = "categorie-name";
          p.textContent = category.name;

          a.appendChild(divImg);
          a.appendChild(p);

          container.appendChild(a);
        } else {
          // Render kiểu danh sách thả
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `/category-detail/${category.slug}`;
          a.textContent = category.name;
          a.className = "category-parent";

          li.appendChild(a);
          container.appendChild(li);
        }
      });
    },


    renderCategories(categories, container) {
      categories.forEach(category => {
        const li = document.createElement("li");

        // Tạo thẻ <a> cho category cha
        const a = document.createElement("a");
        a.href = `/category-detail/${category.slug}`;
        a.textContent = category.name;

        // Thêm class hoặc style nếu cần
        a.className = "category-parent";

        // Nếu có children
        if (category.children?.length) {
          const subUl = document.createElement("ul");
          subUl.className = "sub-drop-down__list";

          category.children.forEach(child => {
            const subLi = document.createElement("li");
            const childA = document.createElement("a");
            childA.href = `/category-detail/${child.slug}`;
            childA.textContent = child.name;

            subLi.appendChild(childA);
            subUl.appendChild(subLi);
          });

          li.appendChild(a);      // Gắn thẻ <a> (cha)
          li.appendChild(subUl);  // Gắn danh sách con
        } else {
          li.appendChild(a);
        }

        container.appendChild(li);
      });
    }
  };

  // Menu INDUSTRIES Header Handler
  const menuIndustriesHandler = {
    async init() {
      const industriesListHomepage = $(".toolrange__industries__grid");
      if (!industriesListHomepage) return;

      try {
        const response = await fetch('/api/v1/get-data-industries', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch categories');

        const data = await response.json();
        const categories = data.result || [];

        this.renderIndustriesHomepage(categories, industriesListHomepage);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    },

    renderIndustriesHomepage(categories, container) {
      const isHomepageStyle = container.classList.contains("toolrange__industries__grid");

      categories.forEach(category => {
        if (isHomepageStyle) {
          // Render kiểu homepage
          const a = document.createElement("a");
          a.className = "toolrange__industries__item";
          a.href = `/product?industries=${category.id}`;
          a.setAttribute("categorieItemId", category.id || "");

          const divImg = document.createElement("div");
          divImg.className = "categorie-img";

          const img = document.createElement("img");
          img.src = category.image || "/website_aardwolf/static/imgs/home_page/categories/img-1.png";
          img.alt = "";

          divImg.appendChild(img);

          const p = document.createElement("p");
          p.className = "categorie-name";
          p.textContent = category.name;

          a.appendChild(divImg);
          a.appendChild(p);

          container.appendChild(a);
        }
      });
    },
  };

  // Search Handler
  const searchHandler = {
    init() {
      this.handleSearchInput();
      this.handleHeaderSearch();
      this.handleCloseSearch();
      this.handleSearchSuggestions();
    },

    handleSearchInput() {
      const searchInput = $(".toolrange__input-search");
      if (searchInput) {
        searchInput.addEventListener("input", () => {
          console.log("input search value: ", searchInput.value);
        });
      }
    },

    handleHeaderSearch() {
      const headerInput = $(".toolrange__header__search > input");
      if (headerInput) {
        headerInput.addEventListener("focus", () => {
          $(".toolrange__header__search-wrapper")?.classList.add("show");
        });
      }
    },

    handleCloseSearch() {
      const closeSearch = $(".box-input-wrapper > img");
      if (closeSearch) {
        closeSearch.addEventListener("click", () => {
          $(".toolrange__header__search-wrapper")?.classList.remove("show");
        });
      }
    },

    handleSearchSuggestions() {
      $$(".toolrange__header__search-suggestions > li").forEach((item) => {
        item.addEventListener("click", () => {
          const input = $(".toolrange__input-search");
          if (input) input.value = item.innerText;
        });
      });
    }
  };

  // Language Selector Handler
  const languageHandler = {
    init() {
      const langSelector = $(".select-language");
      if (langSelector) {
        langSelector.addEventListener("click", (e) => {
          langSelector.classList.toggle("show");
          e.stopPropagation();
        });
      }

      $$(".select-language__option").forEach((element) => {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          this.updateLanguage(element);
        });
      });
    },

    updateLanguage(element) {
      const img = element.firstElementChild;
      if (!img) return;

      const selectValue = $(".select-language")?.firstElementChild?.firstElementChild;
      if (selectValue) {
        selectValue.src = img.currentSrc;
        selectValue.alt = img.alt;
        $(".select-language")?.classList.remove("show");
      }
    }
  };

  // Handle menu sp
    $('.toolrange__header__navbar-icon')?.addEventListener('click', function () {
        console.log('toolrange__header__navbar');
      this.classList.toggle('show');
      $('.toolrange__menu-sp').classList.toggle('show');
    });

    // Handle submenu sp
    $$('.toolrange__menu-sp__item.item-dropdown').forEach((item) => {
      item.addEventListener('click', function () {
        $$('.toolrange__menu-sp__item.item-dropdown').forEach((item2) =>
          item2 !== this && item2.classList.remove('show')
        );
        this.classList.toggle('show');
      });
    });

  // Video Handler
  const videoHandler = {
    init() {
      const videoIcon = $(".toolrange__video-icon");
      if (videoIcon) {
        videoIcon.addEventListener("click", () => {
          const video = $("#home-video");
          if (video) {
            video.play();
            video.classList.add("play");
          }
          videoIcon.classList.add("hidden");
        });
      }
    }
  };

//  $("#home-video")?.classList.add("play");
  $(".toolrange__video-icon")?.classList.add("hidden");

  // Tabs Handler
  const tabHandler = {
    init() {
      this.handleTabs(".toolrange__tab", ".toolrange__view", "viewTab");
      this.handleTabs(
        ".toolrange__prod-detail__description-tab",
        ".toolrange__prod-detail__description-view",
        "view"
      );
    },

    handleTabs(tabSelector, viewSelector, viewDataAttr) {
      $$(tabSelector).forEach((tab) => {
        tab.addEventListener("click", () => {
          const tabId = tab.dataset.tab;

          $$(tabSelector).forEach((otherTab) => {
            otherTab.classList.toggle("tab-active", otherTab === tab);
          });

          $$(viewSelector).forEach((view) => {
            view.classList.toggle("view-active", view.dataset[viewDataAttr] === tabId);
          });
        });
      });
    }
  };

  // Categories Handler
  const categoryHandler = {
    init() {
      const btnMore = $(".categories-page__button-more");
      if (btnMore) {
        btnMore.addEventListener("click", () => {
          $(".toolrange__categories-page__content")?.classList.add("show-all");
          btnMore.classList.add("hide");
        });
      }
    }
  };

  // Select and Sort Handler
  const selectHandler = {
    init() {
      this.handleCommonSelect();
      this.handleSortBox();
      this.clickSubCategories();
    },

    clickSubCategories() {
      const wrapper = document.querySelector(".toolrange__categories-detail__list-wrapper");
      const subCategories = document.querySelectorAll(".toolrange__categories-detail__sub-categories-item");

      subCategories.forEach((select) => {
        select.addEventListener("click", (e) => {
          e.preventDefault();

          const isActive = select.classList.contains("active");

          // Remove active tất cả
          subCategories.forEach((item) => item.classList.remove("active"));

          if (isActive) {
            // Nếu click vào item đang active => trở về All products
            renderProducts(JSON.parse(wrapper.getAttribute("data-products-all")));
          } else {
            // Highlight item
            select.classList.add("active");

            // Render sản phẩm thuộc sub category
            const productsData = select.getAttribute("data-products");
            if (!productsData) return;
            try {
              const products = JSON.parse(productsData);
              renderProducts(products);
            } catch (error) {
              console.error("Invalid JSON data:", error);
            }
          }
        });
      });

      function renderProducts(products) {
        wrapper.innerHTML = "";
        products.forEach((prd) => {
          const html = `
            <a href="${prd.website_url}" class="toolrange__categories-detail__item">
              <div class="product-img">
                <img src="${prd.image_url}" alt="${prd.name}" loading="lazy" />
              </div>
              <div class="product-info">
                <p>${prd.name}</p>
              </div>
            </a>
          `;
          wrapper.insertAdjacentHTML("beforeend", html);
        });
      }
    },

    handleCommonSelect() {
      $$(".select-common").forEach((select) => {
        select.addEventListener("click", (e) => {
          select.classList.toggle("show");
          e.stopPropagation();
          if (e.target.tagName === "DATA") {
            select.firstElementChild.value = e.target.value;
          }
        });
      });
    },

    handleSortBox() {
      const sortBox = $(".toolrange__categories-detail__sort");
      if (sortBox) {
        sortBox.addEventListener("click", (e) => {
          sortBox.classList.toggle("show");
          e.stopPropagation();
          if (e.target.tagName === "DATA") {
            sortBox.querySelector(".sort-by__value").innerText = e.target.value;
          }
        });
      }
    }
  };

  // Pagination Handler
  const paginationHandler = {
    itemsPerPage: 9,
    currentPage: 1,

    init(totalProducts) {
      this.totalProducts = totalProducts || parseInt($(".total-item")?.textContent) || 0;
      this.categorySlug = $("#category-data")?.dataset.categorySlug || 'default-slug';
      this.currentPage = this.getCurrentPageFromUrl();
      if (this.totalProducts > 0) {
        this.renderPagination();
        this.setupEventListeners();
      } else {
        this.setupBasicPagination();
      }
    },

    getCurrentPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return parseInt(urlParams.get('page')) || 1;
    },

    setupBasicPagination() {
      $$(".btn-page-number").forEach((page) => {
        page.addEventListener("click", () => {
          $$(".btn-page-number").forEach((otherPage) => {
            otherPage.classList.remove("btn-active");
          });
          page.classList.add("btn-active");
        });
      });
    },

    renderPagination() {
      const paginationContainer = $(".toolrange__categories-detail__pagination");
      if (!paginationContainer) return;

      const totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
      let paginationHTML = '';

      paginationHTML += `
        <button class="pagination-btn btn-prev ${this.currentPage === 1 ? 'btn-disable' : ''}">

        </button>
      `;

      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        paginationHTML += `
          <button class="pagination-btn btn-page-number">1</button>
          ${startPage > 2 ? '<button class="pagination-btn btn-event-none">...</button>' : ''}
        `;
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
          <button class="pagination-btn btn-page-number ${i === this.currentPage ? 'btn-active' : ''}">
            ${i}
          </button>
        `;
      }

      if (endPage < totalPages) {
        paginationHTML += `
          ${endPage < totalPages - 1 ? '<button class="pagination-btn btn-event-none">...</button>' : ''}
          <button class="pagination-btn btn-page-number">${totalPages}</button>
        `;
      }

      paginationHTML += `
        <button class="pagination-btn btn-next ${this.currentPage === totalPages ? 'btn-disable' : ''}">

        </button>
      `;

      paginationContainer.innerHTML = paginationHTML;
    },

    setupEventListeners() {
      $$(".btn-page-number").forEach((pageBtn) => {
        pageBtn.addEventListener("click", () => {
          const pageNumber = parseInt(pageBtn.textContent);
          this.navigateToPage(pageNumber);
        });
      });

      $(".btn-prev")?.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.navigateToPage(this.currentPage - 1);
        }
      });

      $(".btn-next")?.addEventListener("click", () => {
        const totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.navigateToPage(this.currentPage + 1);
        }
      });
    },

    navigateToPage(pageNumber) {
      const url = `/category-detail/${this.categorySlug}?limit=${this.itemsPerPage}&page=${pageNumber}`;
      window.location.href = url;
    },

    updatePagination() {
      this.renderPagination();
      this.setupEventListeners();
    }
  };

  // Product Options Handler
  const productOptionsHandler = {
    init() {
      $$(".toolrange__prod-detail__prod-option").forEach((option) => {
        option.addEventListener("click", () => {
          $$(".toolrange__prod-detail__prod-option").forEach((otherOption) => {
            otherOption.classList.remove("option-active");
          });
          option.classList.add("option-active");
        });
      });
    }
  };

  // Product Quantity Handler
  const productQuantityHandler = {
    init() {
      $$(".product-quantity-action > button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const quantityEl = $(".quantity");
          if (!quantityEl) return;

          let quantity = parseInt(quantityEl.innerText);
          const decreaseBtn = $(".decrease-quantity");

          if (btn.classList.contains("increase-quantity")) {
            quantity += 1;
            decreaseBtn?.classList.remove("disable");
          } else if (quantity > 1) {
            quantity -= 1;
            if (quantity < 2) {
              decreaseBtn?.classList.add("disable");
            }
          }

          quantityEl.innerText = quantity;
        });
      });
    }
  };

  // Checkout Info Form Handler
  const checkoutFormHandler = {
    init() {
      this.handleEditButton();
      this.handleFormSubmit();
    },

    handleEditButton() {
      const editBtn = $(".form-view__btn-edit");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          const checkoutInfo = $(".toolrange__cart__checkout-info");
          checkoutInfo?.classList.remove("view");
          checkoutInfo?.classList.add("edit");
        });
      }
    },

    handleFormSubmit() {
      const form = $(".toolrange__cart__checkout-info__form.form-edit");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();

          if (e.submitter.classList.contains("form__btn-save")) {
            const formData = this.getFormData(form);
            console.log("after loop: ", formData);
          }

          const checkoutInfo = $(".toolrange__cart__checkout-info");
          checkoutInfo?.classList.remove("edit");
          checkoutInfo?.classList.add("view");
        });
      }
    },

    getFormData(form) {
      const formData = {};
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        formData[input.name] = input.value;
      });
      return formData;
    }
  };

  // Contact Form Handler
  const contactFormHandler = {
    init() {
      const form = $(".toolrange__contact__form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = this.getFormData(form);
          console.log("formData: ", formData);
        });
      }
    },

    getFormData(form) {
      const formData = {};
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        formData[input.name] = input.value;
      });
      return formData;
    }
  };

  // Handle select custom
    function handleSelectCommon(e) {
      console.log('e: ', e.target);
      const allSelects = document?.querySelectorAll(".select-custom");

      if (e.target.closest(".select-custom__mask") || e.target.closest(".combobox-field")) {
        const currentSelect = e.target.closest(".select-custom") || e.target.closest(".combobox-common");

        allSelects.forEach((select) => {
          if (select !== currentSelect) {
            select.classList.remove("show");
          }
        });

        currentSelect.classList.toggle("show");
      } else if (e.target.tagName === "DATA") {
        const parentSelect = e.target.closest(".select-custom") || e.target.closest(".combobox-common");
        parentSelect.querySelector("input").value = e.target.innerText;
        parentSelect.classList.remove("show");

      } else {
        allSelects.forEach((select) => {
          select.classList.remove("show");
        });
      }
    }

  // Handle combobox
    const countries = ["Technical", "Sales", "Support"];

    function createOption(option) {
      const optionEl = document.createElement("data");
      optionEl.classList.add("select-custom__option");
      optionEl.setAttribute("value", option);
      optionEl.innerText = option;

      return optionEl;
    }

    function updateOptions(options) {
      const container = document.querySelector(
        ".select-custom__options.select-country"
      );
      if (!container) return;
      container.innerHTML = "";
      const optionElements = options.map((option) => createOption(option));
      optionElements.forEach((optionEl) => container.appendChild(optionEl));
    }

    updateOptions(countries);

    (function handleCombobox() {
      $$('.combobox-common').forEach((combobox) => {
        const comboboxInput = combobox.querySelector('input');
        const comboboxOptions = combobox.querySelectorAll('.select-custom__option');

        comboboxOptions.forEach((option) => {
          option.addEventListener('click', function(e) {
            comboboxInput.value = e.target.value;
          })
        })
      })
    })()

    $$(".combobox-common > input")?.forEach((input) => {
      input.addEventListener("input", function (e) {
        const value = e.target.value.toLowerCase();
        const filteredCountries = countries.filter((country) =>
          country.toLowerCase().includes(value)
        );
        if (filteredCountries.length) {
          updateOptions(filteredCountries);
        } else {
          updateOptions([]);
        }
      });
    });

    // Handle input phone
    $$('input[name="phone"]').forEach((field) => {
      field.addEventListener("focus", function (e) {
        if(e.target.value.trim() === "") e.target.value = "+";
      });

      field.addEventListener("input", function (e) {
        const value = e.target.value;
        e.target.value = value.replace(/[^+\d]/g, "");
      });

      field.addEventListener("blur", function (e) {
        if(e.target.value.trim() === "+") e.target.value = "";
      });
    });

    document.addEventListener("click", function (e) {
      handleSelectCommon(e);
    });


  // Initialize all handlers
  await menuCategoryHandler.init();
  await menuIndustriesHandler.init();
  searchHandler.init();
  languageHandler.init();
  videoHandler.init();
  tabHandler.init();
  categoryHandler.init();
  selectHandler.init();
  const totalProduct = parseInt($(".total-item")?.textContent) || 0;
  paginationHandler.init(totalProduct);
  productOptionsHandler.init();
  productQuantityHandler.init();
  checkoutFormHandler.init();
//  contactFormHandler.init();
});
