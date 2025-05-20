
const historySwiper2Settings = {
  initialSlide: 1,
  spaceBetween: 160,
  grabCursor: false,
  centeredSlides: true,
  slidesPerView: 3,
  thumbs: {
    swiper: historySwiper,
  },
}

function handleCheckScreen(screenWidth) {
    if(!historySwiper2) return;

  if (screenWidth <= 1024 && screenWidth > 490) {
    historySwiper2.params.slidesPerView = 2;
  } else if (screenWidth <= 490) {
    historySwiper2.params.slidesPerView = 1;
  } else {
    historySwiper2.params.slidesPerView = 3;
  }

  historySwiper2.update();
}

window.addEventListener("beforeunload", (event) => {
  const screenWidth = event.target.defaultView.innerWidth;

  handleCheckScreen(screenWidth);
});

window.addEventListener("resize", (event) => {
  const screenWidth = event.target.innerWidth;

  handleCheckScreen(screenWidth);
});

const swiperR1 = new Swiper(".recommendedSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperR2 = new Swiper(".recommendedSwiper2", {
  slidesPerView: 5,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperDistributors = new Swiper(".distributorsSwiper", {
  spaceBetween: 135,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var historySwiper = new Swiper(".historySwiper", {
  spaceBetween: 10,
  slidesPerView: 5,
  freeMode: true,
  watchSlidesProgress: true,
});

const historySwiper2 = new Swiper(".historySwiper2", historySwiper2Settings);

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

// Slider 4
const swiper4 = new Swiper(".recommendedCombinationsSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// Slider 5
const swiper5 = new Swiper(".ymalSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
