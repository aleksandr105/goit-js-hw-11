import Notiflix, { Block } from 'notiflix';
import { axiosSearch } from './axiosSearch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const refs = {
  inputEl: document.querySelector('[name=searchQuery]'),
  buttonEl: document.querySelector('[type=submit]'),
  formEl: document.querySelector('.search-form'),
  galeryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

const PER_PAGE = 40;
let maxPage = PER_PAGE;
let page = 1;
let searchElement = '';

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreEl.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  searchElement = e.target.searchQuery.value.trim();
  refs.galeryEl.innerHTML = '';
  page = 1;
  refs.loadMoreEl.style.display = 'none';

  axiosSearch(searchElement, page, PER_PAGE)
    .then(function (response) {
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`,
        );
        return;
      }

      if (response.data.hits.length !== 0) {
        refs.loadMoreEl.style.display = 'block';
        refs.galeryEl.innerHTML = onRander(response.data.hits);
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
        e.target.reset();
      }
    })
    .catch(function (error) {
      Notiflix.Notify.failure(`error`);
    });
}

function onRander(response) {
  return response
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) =>
        `<a class="gallery__item photo-card" href="${largeImageURL}">
        <img height="194" width="100%" class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
        </a>`,
    )
    .join('');
}

function onLoadMore() {
  page += 1;
  maxPage += PER_PAGE;

  axiosSearch(searchElement, page, PER_PAGE)
    .then(function (response) {
      refs.galeryEl.insertAdjacentHTML('beforeend', onRander(response.data.hits));

      if (maxPage >= response.data.totalHits) {
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        refs.loadMoreEl.style.display = 'none';
      }
    })
    .catch(function (error) {
      Notiflix.Notify.failure(`error response`);
    });
}
// --------SimpleLightbox-------//

// refs.galeryEl.addEventListener('click', onSimpleLightbox);

// function onSimpleLightbox(event) {
//   event.preventDefault();
//   if (event.target.nodeName !== 'IMG') {
//     return;
//   }

//   let gallery = new SimpleLightbox('.gallery a', {
//     captionsData: 'alt',
//     captionDelay: 250,
//   });
//   gallery.on('closed.simplelightbox', function () {
//     gallery.refresh();
//   });
// }
