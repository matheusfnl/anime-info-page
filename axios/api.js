import axios from 'axios';

const url = 'https://api.jikan.moe/v4';

export const fetchRandomAnime = async () => {
  const { data } = await axios.get(`${url}/random/anime`, {
    params: { sfw: true }
  });

  const rating = data.data.rating.toLowerCase();

  if(rating.includes('hentai')) {
    return fetchRandomAnime();
  }

  return data;
}

export const fetchAnimeById = async (id) => {
  const { data } = await axios.get(`${url}/anime/${id}`)

  return data;
}

export const fetchAnimeByWord = async (anime) => {
  const { data } = await axios.get(`${url}/anime`, {
    params: {
      letter: anime,
      order_by: 'popularity',
      sfw: true,
      min_score: 5,
    }
  });

  return data;
}
