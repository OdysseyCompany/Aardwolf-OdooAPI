const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// Handle request form (categories page)
$$(".toolrange__categories-page .btn-request").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    $(".toolrange__categories-page .toolrange-dialog").classList.add("show");
    $(".toolrange__categories-page .form-request__demo").classList.add("show");
  });
});

$(".toolrange__categories-page .form-request-close")?.addEventListener(
  "click",
  function () {
    $(".toolrange__categories-page .form-request__demo").classList.remove(
      "show"
    );
    setTimeout(() => {
      $(".toolrange__categories-page .toolrange-dialog").classList.remove(
        "show"
      );
    }, 100);
  }
);


//const slideAction1 = {
//  nextEl: document.querySelectorAll(".swiper-button-next"),
//  prevEl: document.querySelectorAll(".swiper-button-prev"),
//};

const swiperThumbs = new Swiper(".swiperThumbs", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperThumbs2 = new Swiper(".swiperThumbs2", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperThumbs3 = new Swiper(".swiperThumbs3", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperThumbs4 = new Swiper(".swiperThumbs4", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperThumbs5 = new Swiper(".swiperThumbs5", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

$('.toolrange__categories-page__btn-link')?.addEventListener('click', function(e) {
  e.preventDefault();
  this.style.display = 'none';
})

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