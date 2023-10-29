import axios from 'axios';

const url = 'https://api.jikan.moe/v4';

export const fetchRandomAnime = async () => {
  const { data } = await axios.get(`${url}/random/anime`, {
    params: {
      sfw: true,
      min_score: 7,
    }
  });

  const rating = data?.data?.rating?.toLowerCase() || '';
  const score = data?.data?.score

  if(rating.includes('hentai') || !rating || !score || score < 7) {
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
      q: anime,
      order_by: 'popularity',
      sfw: true,
      min_score: 6,
    }
  });

  return data;
}
