const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Handle search
$(".toolrange__input-search")?.addEventListener("input", function () {
  console.log("input search value: ", this.value);
});

$(".toolrange__header__search > input")?.addEventListener("focus", function () {
  $(".toolrange__header__search-wrapper").classList.add("show");
});

$(".box-input-wrapper > img")?.addEventListener("click", function () {
  $(".toolrange__header__search-wrapper").classList.remove("show");
});

$$(".toolrange__header__search-suggestions > li")?.forEach((item) => {
  item.addEventListener("click", function () {
    $(".toolrange__input-search").value = this.innerText;
  });
});

// Handle select language
$(".select-language")?.addEventListener("click", function (e) {
  this.classList.toggle("show");
  e.stopPropagation();
});

$$(".select-language__option")?.forEach((element) => {
  element.addEventListener("click", function (e) {
    e.stopPropagation();
    const focusUrl = this.firstElementChild.currentSrc;
    const focusAlt = this.firstElementChild.alt;
    const selectValue =
      $(".select-language").firstElementChild.firstElementChild;

    selectValue.src = focusUrl;
    selectValue.alt = focusAlt;

    $(".select-language").classList.remove("show");
  });
});

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

// Handle video
$(".toolrange__video-icon")?.addEventListener("click", function () {
  $("#home-video").play();
  $("#home-video").classList.add("play");
  this.classList.add("hidden");
});

// Handle tabs
$$(".toolrange__tab")?.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    let thisTab = this.dataset.tab;

    $$(".toolrange__tab").forEach((tab2, i2) => {
      if (i !== i2) {
        tab2.classList.remove("tab-active");
      }
    });

    this.classList.add("tab-active");

    $$(".toolrange__view").forEach((view) => {
      let thisView = view.dataset.viewTab;
      if (thisTab === thisView) {
        view.classList.add("view-active");
      } else {
        view.classList.remove("view-active");
      }
    });
  });
});

$$(".toolrange__prod-detail__description-tab")?.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    let thisTab = this.dataset.tab;

    $$(".toolrange__prod-detail__description-tab").forEach((tab2, i2) => {
      if (i !== i2) {
        tab2.classList.remove("tab-active");
      }
    });

    this.classList.add("tab-active");

    $$(".toolrange__prod-detail__description-view").forEach((view) => {
      let thisView = view.dataset.view;
      if (thisTab === thisView) {
        view.classList.add("view-active");
      } else {
        view.classList.remove("view-active");
      }
    });
  });
});

// Handle show categories
$(".categories-page__button-more")?.addEventListener("click", function () {
  $(".toolrange__categories-page__content").classList.add("show-all");
  this.classList.add("hide");
});

// Handle select custom
function handleSelectCommon(e) {
  const allSelects = document?.querySelectorAll(".select-custom");

  if (e.target.closest(".select-custom__mask")) {
    const currentSelect = e.target.closest(".select-custom");

    allSelects.forEach((select) => {
      if (select !== currentSelect) {
        select.classList.remove("show");
      }
    });

    currentSelect.classList.toggle("show");
  } else if (e.target.tagName === "DATA") {
    const parentSelect = e.target.closest(".select-custom");
    parentSelect.querySelector("input").value = e.target.innerText;
    parentSelect.classList.remove("show");

  } else {
    allSelects.forEach((select) => {
      select.classList.remove("show");
    });
  }
}

// Handle select sort
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

// Handle pagination
$$(".btn-page-number")?.forEach((page) => {
  page.addEventListener("click", function () {
    $$(".btn-page-number").forEach((page2) => {
      page2.classList.remove("btn-active");
    });
    this.classList.add("btn-active");
  });
});

// Handle edit Checkout Infomation form
$(".form-view__btn-edit")?.addEventListener("click", function () {
  $(".toolrange__cart__checkout-info").classList.remove("view");
  $(".toolrange__cart__checkout-info").classList.add("edit");
});

$(".toolrange__cart__checkout-info__form.form-edit")?.addEventListener(
  "submit",
  function (e) {
    e.preventDefault();

    if (e.submitter.classList.contains("form__btn-save")) {
      const listInputs = this?.querySelectorAll("input");
      const formData = {};

      listInputs.forEach((input) => {
        const keyName = input.name;
        formData[keyName] = input.value;
      });

      console.log("after loop: ", formData);
    }

    $(".toolrange__cart__checkout-info").classList.remove("edit");
    $(".toolrange__cart__checkout-info").classList.add("view");
  }
);

// Handle edit form Contact form
$(".toolrange__contact__form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const listInputs = this?.querySelectorAll("input");
  const formData = {};

  listInputs.forEach((input) => {
    const keyName = input.name;
    formData[keyName] = input.value;
  });

  console.log("formData: ", formData);
});

document.addEventListener("click", function (e) {
  handleSelectCommon(e);
});
