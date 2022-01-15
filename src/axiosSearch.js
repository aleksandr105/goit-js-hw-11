export { axiosSearch };
const axios = require('axios').default;

const KEY_API = '25247412-9500f48d0650be6be45f9accb';
const URL = 'pixabay.com/api/';

async function axiosSearch(searchElement, page, PER_PAGE) {
  try {
    const response = await axios.get(
      `https://${URL}?key=${KEY_API}&q=${searchElement}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`,
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
