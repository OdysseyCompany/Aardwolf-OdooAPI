document.addEventListener("DOMContentLoaded", async function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // Search functionality
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

  // Language selector
  const languageHandler = {
    init() {
      const langSelector = $(".select-language");
      if (!langSelector) return;

      langSelector.addEventListener("click", (e) => {
        langSelector.classList.toggle("show");
        e.stopPropagation();
      });

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

  // Tabs handler
  const tabHandler = {
    init() {
      $$(".toolrange__tab").forEach((tab) => {
        tab.addEventListener("click", () => this.switchTab(tab));
      });
    },

    switchTab(activeTab) {
      const tabId = activeTab.dataset.tab;

      $$(".toolrange__tab").forEach((tab) => {
        tab.classList.toggle("tab-active", tab === activeTab);
      });

      $$(".toolrange__view").forEach((view) => {
        view.classList.toggle("view-active", view.dataset.viewTab === tabId);
      });
    }
  };

  // Categories handler
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

  // Select and sort handler
  const selectHandler = {
    init() {
      this.handleCommonSelect();
      this.handleSortBox();
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

  // Pagination handler
  const paginationHandler = {
    itemsPerPage: 9, // Đặt limit=9 theo yêu cầu
    currentPage: 1,

    init(totalProducts) {
      this.totalProducts = totalProducts || parseInt($(".total-item")?.textContent) || 0;
      // Lấy categorySlug từ data attribute
      this.categorySlug = $("#category-data")?.dataset.categorySlug || 'default-slug';
      // Lấy currentPage từ query string
      this.currentPage = this.getCurrentPageFromUrl();
      if (this.totalProducts > 0) {
        this.renderPagination();
        this.setupEventListeners();
      } else {
        this.setupBasicPagination();
      }
    },

    // Hàm lấy page từ query string
    getCurrentPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get('page')) || 1; // Mặc định là 1 nếu không có page
      return page;
    },

    setupBasicPagination() {
      $$(".btn-page-number").forEach((page) => {
        page.addEventListener("click", () => {
          $$(".btn-page-number").forEach((p) => p.classList.remove("btn-active"));
          page.classList.add("btn-active");
        });
      });
    },

    renderPagination() {
      const paginationContainer = $(".toolrange__categories-detail__pagination");
      if (!paginationContainer) return;

      const totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
      let paginationHTML = '';

      // Previous button
      paginationHTML += `
        <button class="pagination-btn btn-prev ${this.currentPage === 1 ? 'btn-disable' : ''}">

        </button>
      `;

      // Page numbers
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

      // Next button
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
      window.location.href = url; // Chuyển hướng đến URL mới
    },

    updatePagination() {
      this.renderPagination();
      this.setupEventListeners();
    }
  };

  // Initialize all handlers
  searchHandler.init();
  languageHandler.init();
  tabHandler.init();
  categoryHandler.init();
  selectHandler.init();

  // Khởi tạo pagination với total_product từ template
  const totalProduct = parseInt($(".total-item")?.textContent) || 0;
  paginationHandler.init(totalProduct);
});