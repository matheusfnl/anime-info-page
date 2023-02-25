import axios from 'axios';

const url = 'https://api.jikan.moe/v4';

export const fetchRandomAnime = async () => {
  const { data } = await axios.get(`${url}/random/anime`);

  if (data.data.rating.includes('RX')) {
    return this.fetchRandomAnime();
  }

  return data;
}

export const fetchAnimeById = async (id) => {
  const { data } = await axios.get(`${url}/anime/${id}`)

  return data;
}
