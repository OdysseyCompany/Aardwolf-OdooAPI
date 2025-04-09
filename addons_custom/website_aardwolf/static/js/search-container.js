document.addEventListener("DOMContentLoaded", function () {
    const searchContainer = document.getElementById("search-container");
    const mainSearch = document.getElementById("main-search");
    const subSearch = document.getElementById("sub-search");
    const searchWrapper = document.getElementById("search-wrapper");
    const suggestionList = document.getElementById("suggestion-list");
    const searchClose = document.getElementById("search-close");

    let debounceTimer;

    subSearch.addEventListener("input", function () {
        const keyword = subSearch.value.trim();
        console.log(keyword);
        clearTimeout(debounceTimer);
        if (!keyword) {
            suggestionList.innerHTML = "";
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSuggestions(keyword);
        }, 300); // debounce 300ms
    });

    function fetchSuggestions(keyword) {
        const payload = { search: keyword };
        console.log("Sending keyword to API:", payload);

        fetch("/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Received data:", data);
            suggestionList.innerHTML = "";

            if (!data.result.length) {
                suggestionList.innerHTML = "<li>Không tìm thấy sản phẩm</li>";
                return;
            }

            data.result.forEach(product => {
                const li = document.createElement("li");
                li.classList.add("search-result-item");
                li.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <img src="${product.image_url}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                        <span>${product.name}</span>
                    </div>
                `;
                li.addEventListener("click", () => {
                    window.location.href = product.url;
                });
                suggestionList.appendChild(li);
            });
        });
    }


    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (!searchContainer.contains(e.target)) {
            searchWrapper.style.display = "none";
        }
    });

    // Mở khi focus
    mainSearch.addEventListener("focus", () => {
        searchWrapper.style.display = "block";
        subSearch.focus();
    });

    searchClose.addEventListener("click", () => {
        subSearch.value = "";
        suggestionList.innerHTML = "";
        searchWrapper.style.display = "none";
    });

    // Tự động submit khi Enter
    subSearch.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (suggestionList.firstChild) {
                suggestionList.firstChild.click();  // Click vào sản phẩm đầu tiên
            }
        }
    });
});
