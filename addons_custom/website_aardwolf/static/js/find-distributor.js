const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$$(".toolrange__find-distributor__tabs-item")?.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    let thisTab = this.dataset.country;

    $$(".toolrange__find-distributor__tabs-item")?.forEach((tab2, i2) => {
      if (i !== i2) {
        tab2.classList.remove("tab-active");
      }
    });

    this.classList.add("tab-active");

    $$(".toolrange__find-distributor__view")?.forEach((view) => {
      console.log("view: ", view);

      let thisView = view.dataset.country;
      if (thisTab === thisView) {
        view.classList.add("view-active");
      } else {
        view.classList.remove("view-active");
      }
    });
  });
});

function handleSelectCommon(options, type) {
  options?.forEach((option) => {
    option.addEventListener("click", function () {
      let thisOption = this.value;

      options?.forEach((option2) => {
        if (thisOption !== option2.value) {
          option2.classList.remove("option-active");
        }
      });

      this.classList.toggle("option-active");
      console.log(`${type === 1 ? 'state' : type === 2 ? 'city' : 'brand'}: ${thisOption}`);
      
    });
  });
}

handleSelectCommon($$(".select-state .find-distributor__select-option"), 1);

handleSelectCommon($$(".select-city .find-distributor__select-option"), 2);

handleSelectCommon($$(".select-brand .find-distributor__select-option"), 3);
