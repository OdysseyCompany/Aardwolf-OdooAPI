const swiper = new Swiper(".bannerSwiper", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Slider 2
const swiper2 = new Swiper(".productsSwiper", {
  slidesPerView: 4,
  spaceBetween: 12,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Slider 3
const swiper3 = new Swiper(".galleriesSwiper", {
  slidesPerView: 2,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
