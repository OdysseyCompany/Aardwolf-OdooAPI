const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slideAction1 = {
  nextEl: document.querySelectorAll(".swiper-button-next"),
  prevEl: document.querySelectorAll(".swiper-button-prev"),
};

const swiperThumbs = new Swiper(".swiperThumbs", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperView = new Swiper(".swiperView", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: slideAction1.nextEl[0],
    prevEl: slideAction1.prevEl[0],
  },
  thumbs: {
    swiper: swiperThumbs,
  },
});

const swiperThumbs2 = new Swiper(".swiperThumbs2", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperView2 = new Swiper(".swiperView2", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: slideAction1.nextEl[1],
    prevEl: slideAction1.prevEl[1],
  },
  thumbs: {
    swiper: swiperThumbs2,
  },
});

const swiperThumbs3 = new Swiper(".swiperThumbs3", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperView3 = new Swiper(".swiperView3", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: slideAction1.nextEl[2],
    prevEl: slideAction1.prevEl[2],
  },
  thumbs: {
    swiper: swiperThumbs3,
  },
});

const swiperThumbs4 = new Swiper(".swiperThumbs4", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperView4 = new Swiper(".swiperView4", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: slideAction1.nextEl[3],
    prevEl: slideAction1.prevEl[3],
  },
  thumbs: {
    swiper: swiperThumbs4,
  },
});

const swiperThumbs5 = new Swiper(".swiperThumbs5", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperView5 = new Swiper(".swiperView5", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: slideAction1.nextEl[4],
    prevEl: slideAction1.prevEl[4],
  },
  thumbs: {
    swiper: swiperThumbs5,
  },
});

// Handle request form
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
