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

// Handle request form
$(".btn-request").addEventListener("click", function (e) {
    e.preventDefault();
    $(".toolrange-dialog").classList.add("show");
    $(".form-request__demo").classList.add("show");
});

$(".form-request-close")?.addEventListener(
  "click",
  function () {
    $(".form-request__demo").classList.remove(
      "show"
    );
    setTimeout(() => {
      $(".toolrange-dialog").classList.remove(
        "show"
      );
    }, 100);
  }
);

const countries = ["Technical", "Sales", "Support", "Message"];

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
  $$(".combobox-common").forEach((combobox) => {
    const comboboxInput = combobox.querySelector("input");
    const comboboxOptions = combobox.querySelectorAll(".select-custom__option");

    comboboxOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        comboboxInput.value = e.target.value;
      });
    });
  });
})();

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

$$('input[name="phone"]').forEach((field) => {
  field.addEventListener("focus", function (e) {
    e.target.value = "+";
  });

  field.addEventListener("input", function (e) {
    const value = e.target.value;
    if (!/^\+?\d*$/.test(value)) {
      e.target.value = value.replace(/[^+\d]/g, "");
    } else {
      value = "+";
    }
  });

  field.addEventListener("blur", function (e) {
    e.target.value = "";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  $(".video-icon").classList.add("hidden");
  $("#b-distributor-video").classList.remove("pause");
});