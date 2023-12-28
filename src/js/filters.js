import axios from 'axios';
import { common } from './common';
import { refs } from './refs';
import { productMarkup, notFoundMarkup } from './markupFunctions';
import { getCategories } from './api_service';
import { save, load } from './storage';
import { renderProducts } from './products';
import { createCategoryMarkup, createSortMarkup } from './markupFunctions';
import SlimSelect from 'slim-select';
import '../../node_modules/slim-select/dist/slimselect.css';

import { loadPaginationData } from './pagination';

new SlimSelect({
  select: '#abcField',
  settings: {
    showSearch: false,
  },
});

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



// const renderSelects = async () => {

//   const data = await getCategories();

//   categories = [...data, 'Show_all'];

//   const markup = createCategoryMarkup(categories);

//   refs.categoryField.insertAdjacentHTML('beforeend', markup);

//   refs.abcField.innerHTML = createSortMarkup(sortArrey);


//   new SlimSelect({
//     select: '#categoryField',
//     settings: {
//       placeholderText: 'Categories',
//       showSearch: false,
//     },
//   });
// };



let mask = document.querySelector('.mask');

const renderSelects = async () => {

  document.querySelector('.loaderr').style.display = 'flex';
  
  try {
    const data = await getCategories();
    categories = [...data, 'Show_all'];
  
    const markup = createCategoryMarkup(categories);
    refs.categoryField.insertAdjacentHTML('beforeend', markup);
  
    refs.abcField.innerHTML = createSortMarkup(sortArrey);
  
    new SlimSelect({
      select: '#categoryField',
      settings: {
        placeholderText: 'Categories',
        showSearch: false,
      },
    });
  } catch (error) {
   
    console.error('Error:', error);
  } finally {
   
    mask.style.opacity = '1';
    document.querySelector('.loaderr').style.display = 'none';
    
  }
};


// window.addEventListener('load', () => {
//   let mask = document.querySelector('.mask');
//   if (mask) {
  
//     setTimeout(() => {
//       mask.style.opacity = '1';
//     }, 600);
//   }

//   const loaderr = document.querySelector('.loaderr');
//   if (loaderr) {
   
//     setTimeout(() => {
//       loaderr.parentNode.removeChild(loaderr);
//     }, 300);
//   }
   
  
// });



const onCategoryField = async evt => {
  const currentCategory = evt.target.value;
  const currQuery = load(common.LOCAL_QUERY_KEY);
  currQuery.page = '1';
  if (currentCategory === 'Show_all') {
    currQuery.category = null;
  } else {
    currQuery.category = currentCategory;
  }
  save(common.LOCAL_QUERY_KEY, currQuery);
  const query = load(common.LOCAL_SORT);
  const URL = load(common.LOCAL_QUERY_KEY);

  let sortUrl = buildSortUrl(common.BASE_URL, URL);
  sortUrl = buildSortByQuery(sortUrl, query);

  const result = await get(sortUrl);

  renderProductsSort(result);
};

const onForm = async evt => {
  evt.preventDefault();

  const currentValue = refs.searchField.value;
  const currQuery = load(common.LOCAL_QUERY_KEY);
  currQuery.page = '1';
  if (!currentValue) {
    currQuery.keyword = null;
  } else {
    currQuery.keyword = currentValue;
  }
  save(common.LOCAL_QUERY_KEY, currQuery);
  const query = load(common.LOCAL_SORT);
  const URL = load(common.LOCAL_QUERY_KEY);

  let sortUrl = buildSortUrl(common.BASE_URL, URL);
  sortUrl = buildSortByQuery(sortUrl, query);

  const result = await get(sortUrl);

  renderProductsSort(result);
};
//2e1
const buildSortUrl = (baseURL, URL) => {
  let sortUrl = `${baseURL}/products?page=${URL.page}&limit=${URL.limit}`;

  if (URL.keyword) {
    sortUrl += `&keyword=${URL.keyword}`;
  }

  if (URL.category && URL.category !== 'all') {
    sortUrl += `&category=${formatCategory(URL.category)}`;
  }

  return sortUrl;
};

const formatCategory = category => {
  switch (category) {
    case 'Meat_&_Seafood':
      return 'Meat_%26_Seafood';
    case 'Breads_&_Bakery':
      return 'Breads_%26_Bakery';
    default:
      return category;
  }
};

const buildSortByQuery = (sortUrl, query) => {
  if (query && query !== 'all') {
    switch (query) {
      case 'alphabetical':
        sortUrl += `&byABC=true`;
        break;
      case 'reverse-alphabetical':
        sortUrl += `&byABC=false`;
        break;
      case 'cheap':
        sortUrl += `&byPrice=true`;
        break;
      case 'expensive':
        sortUrl += `&byPrice=false`;
        break;
      case 'popular':
        sortUrl += `&byPopularity=false`;
        break;
      case 'not-popular':
        sortUrl += `&byPopularity=true`;
        break;
    }
  }

  return sortUrl;
};

const onAbcField = async evt => {

  const currentCategory = evt.target.value;
  save(common.LOCAL_SORT, currentCategory);
  const query = load(common.LOCAL_SORT);
  const URL = load(common.LOCAL_QUERY_KEY);

  let sortUrl = buildSortUrl(common.BASE_URL, URL);
  sortUrl = buildSortByQuery(sortUrl, query);

  const result = await get(sortUrl);

  renderProductsSort(result);

};

//wfw
async function get(sortUrl) {
  try {
    const response = await axios({
      url: `${sortUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
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
  loadPaginationData();
};

const onSearchField = evt => {
  if (evt.target.value === '') {
    const currentQuery = load(common.LOCAL_QUERY_KEY);
    currentQuery.page = '1';
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
