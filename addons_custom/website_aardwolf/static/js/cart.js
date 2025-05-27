document.addEventListener('DOMContentLoaded', function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // Handle request form
    $(".cart__btn-request").addEventListener("click", function (e) {
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

    // Handle select in form request
    function handleCountryStateSelect(e) {
      const selectState = document.querySelector(".select-state");

      if (e.target.tagName === "DATA" && e.target.closest(".select-country")) {
        const selectedValue = e.target.value;

        if (selectedValue === "usa") {
          selectState?.classList.add("visible");
        } else {
          selectState?.classList.remove("visible");
        }
      }
    }

    document.addEventListener("click", function (e) {
      handleCountryStateSelect(e);
    });
});
