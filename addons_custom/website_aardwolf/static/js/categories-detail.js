import { createPagination } from "./pagination.js";

const pagination = createPagination({
  totalPages: 10,
  visiblePages: 6,
  currentPage: 1,
  onChange: (page) => {
    console.log('page: ', page);
  },
});
