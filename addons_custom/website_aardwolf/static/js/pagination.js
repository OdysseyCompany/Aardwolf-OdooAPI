export function createPagination(options) {
  const config = {
    container: document.querySelector(".pagination-common"),
    totalPages: 10,
    visiblePages: 5,
    currentPage: 1,
    onChange: (page) => console.log("Page changed to:", page),
    ...options,
  };

  if (!config.container) {
    console.error("Pagination container not found");
    return null;
  }

  const pagesContainer = config.container.querySelector(
    ".pagination-common__pages"
  );
  const prevBtn = config.container.querySelector(".btn-prev");
  const nextBtn = config.container.querySelector(".btn-next");

  function init() {
    render();
    addEventListeners();
    return {
      update,
      getCurrentPage: () => config.currentPage,
    };
  }

  function update(newOptions) {
    Object.assign(config, newOptions);
    render();
  }

  function render() {
    pagesContainer.innerHTML = "";

    const { totalPages, visiblePages, currentPage } = config;

    createPageButton(1);

    let startPage = Math.max(
      2,
      currentPage - Math.floor((visiblePages - 3) / 2)
    );
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 3);

    if (endPage - startPage < visiblePages - 3) {
      startPage = Math.max(2, endPage - visiblePages + 3);
    }

    if (startPage > 2) {
      createEllipsis();
    }

    for (let i = startPage; i <= endPage; i++) {
      createPageButton(i);
    }

    if (endPage < totalPages - 1) {
      createEllipsis();
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      createPageButton(totalPages);
    }

    prevBtn.classList.toggle("disabled", currentPage === 1);
    nextBtn.classList.toggle("disabled", currentPage === totalPages);
  }

  function createPageButton(pageNumber) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `pagination-common__btn btn-page ${
      pageNumber === config.currentPage ? "page-active" : ""
    }`;
    pageBtn.textContent = pageNumber;
    pageBtn.dataset.page = pageNumber;
    pagesContainer.appendChild(pageBtn);
  }

  function createEllipsis() {
    const ellipsis = document.createElement("button");
    ellipsis.className = "pagination-common__btn btn-none";
    ellipsis.textContent = "...";
    ellipsis.disabled = true;
    pagesContainer.appendChild(ellipsis);
  }

  function changePage(page) {
    if (page === config.currentPage) return;

    config.currentPage = page;
    render();
    config.onChange(page);
  }

  function addEventListeners() {
    pagesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-page")) {
        changePage(parseInt(e.target.dataset.page));
      }
    });

    prevBtn.addEventListener("click", () => {
      if (config.currentPage > 1) {
        changePage(config.currentPage - 1);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (config.currentPage < config.totalPages) {
        changePage(config.currentPage + 1);
      }
    });
  }

  return init();
}
