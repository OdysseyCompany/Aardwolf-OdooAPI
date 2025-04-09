document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.thumbnail-img');
    const mainImg = document.querySelector('.main-img');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const newSrc = this.getAttribute('data-src');
            if (mainImg) {
                mainImg.setAttribute('src', newSrc);
            }
        });
    });
});