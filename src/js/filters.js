// import { getCategories } from './api_service';
// import { save, load } from './storage';
// import { common } from './common';
// import { renderProducts } from './products';
// import SlimSelect from 'slim-select';
// import '../../node_modules/slim-select/dist/slimselect.css';

// new SlimSelect({
//   select: '#abcField',
//   settings: {
//     placeholderText: 'A to Z',
//     showSearch: false,
//   },
// });

// const refs = {
//   searchField: document.querySelector('.js-input'),
//   categoryField: document.querySelector('#categoryField'),
//   abcField: document.querySelector('#abcField'),
//   form: document.querySelector('.form'),
// };

// // const abcList = ["A to Z", "Z to A", "Cheap", "Expensive", "Popular", "Not popular", "Show all"]

// const createCategoryMarkup = arrey => {
//   if (!arrey.length) {
//     return `<option value="not_found_categories">Not found categories</option>`;
//   }
//   return arrey
//     .map(
//       category =>
//         `<option value="${category}">${category
//           .replace('_', ' ')
//           .replace('_', ' ')}</option>`
//     )
//     .join('');
// };


// const renderCategory = async () => {
//   const data = await getCategories();
//   const markup = createCategoryMarkup(data);
//   refs.categoryField.insertAdjacentHTML('beforeend', markup);

//   new SlimSelect({
//     select: '#categoryField',
//     settings: {
//       placeholderText: 'Categories',
//       showSearch: false,
//     },
//   });
// };

// renderCategory()



import axios from 'axios';
import { common } from './common';
import { refs } from './refs';
import { productMarkup, notFoundMarkup } from './markupFunctions';
import { getCategories } from './api_service';
import { save, load } from './storage';
import { renderProducts } from './products';
import { createCategoryMarkup, createSortMarkup } from './markupFunctions';

let categories = [];

const sortArrey = [
  { value: 'alphabetical', label: 'A to Z' },
  { value: 'reverse-alphabetical', label: 'Z to A' },
  { value: 'cheap', label: 'Cheap' },
  { value: 'expensive', label: 'Expensive' },
  { value: 'popular', label: 'Popular' },
  { value: 'not-popular', label: 'Not popular' },
  { value: '', label: 'Show all' },
];

const renderSelects = async () => {
  const data = await getCategories();

  categories = [...data, 'Show_all'];

  const markup = createCategoryMarkup(categories);

  refs.categoryField.insertAdjacentHTML('beforeend', markup);
  refs.abcField.innerHTML = createSortMarkup(sortArrey);
};

const onCategoryField = evt => {
  const currentCategory = evt.target.value;
  const currQuery = load(common.LOCAL_QUERY_KEY);

  if (currentCategory === 'Show_all') {
    currQuery.category = null;
  } else {
    currQuery.category = currentCategory;
  }
  save(common.LOCAL_QUERY_KEY, currQuery);
  const query = load(common.LOCAL_QUERY_KEY);
  renderProducts(query);
};

const onForm = evt => {
  evt.preventDefault();
  const currentValue = refs.searchField.value;
  const currQuery = load(common.LOCAL_QUERY_KEY);

  if (!currentValue) {
    currQuery.keyword = null;
  } else {
    currQuery.keyword = currentValue;
  }
  save(common.LOCAL_QUERY_KEY, currQuery);

  const query = load(common.LOCAL_QUERY_KEY);
  renderProducts(query);
};



const onAbcField = async evt => {
  const currentCategory = evt.target.value;
  save(common.LOCAL_SORT, currentCategory);
  const query = load(common.LOCAL_SORT);
  const getSort = SortValue(query);
  const URL = load(common.LOCAL_QUERY_KEY);

  let sortUrl = `${common.BASE_URL}/products?page=${URL.page}&limit=${URL.limit}${getSort}`;

      if (URL.keyword !== null) {
    sortUrl += `&keyword=${URL.keyword}`;
      }

      if (URL.category !== null) {
    sortUrl += `&category=${URL.category}`;
      }

  const result = await get(sortUrl);
  renderProductsSort(result);
};


const SortValue = sortCategory => {
  let getSort = {};

  switch (sortCategory) {
    case 'alphabetical':
      getSort = '&byABC=true';
      break;
    case 'reverse-alphabetical':
      getSort = '&byABC=false';
      break;
    case 'cheap':
      getSort = '&byPrice=true';
      break;
    case 'expensive':
      getSort = '&byPrice=false';
      break;
    case 'popular':
      getSort = '&byPopularity=false';
      break;
    case 'not-popular':
      getSort = '&byPopularity=true';
      break;
    default:
      break;
  }

  return getSort;
};

async function get(sortUrl) {
  try {
    const response = await axios({
      url: `${sortUrl}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },

    });
    return response.data;
  } catch (error) {
    return error;
  }
}




const renderProductsSort = async result => {
  if (!result.results.length) {
    notFoundMarkup(refs.productList);
    return;
  }
  save(common.PAGES, {
    page: result.page,
    perPage: result.perPage,
    totalPages: result.totalPages,
  });
  refs.productList.innerHTML = productMarkup(result.results);
};

const onSearchField = evt => {
  if (evt.target.value === '') {
    const currentQuery = load(common.LOCAL_QUERY_KEY);
    currentQuery.keyword = null;
    save(common.LOCAL_QUERY_KEY, currentQuery);
    const query = load(common.LOCAL_QUERY_KEY);
    renderProducts(query);
  }
};

refs.form.addEventListener('submit', onForm);
refs.categoryField.addEventListener('change', onCategoryField);
refs.abcField.addEventListener('change', onAbcField);
refs.searchField.addEventListener('input', onSearchField);

export { renderSelects };





