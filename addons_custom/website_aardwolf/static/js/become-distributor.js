const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Handle video
$(".video-icon")?.addEventListener("click", function () {
  $("#b-distributor-video").play();
  $("#b-distributor-video").classList.remove("pause");
  this.classList.add("hidden");
});

const swiperDistributors = new Swiper(".distributorsSwiper2", {
  spaceBetween: 135,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});