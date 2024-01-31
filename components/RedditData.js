import axios from 'axios';

export const fetchRedditData = async (after) => {
  try {
    const response = await axios.get(`https://www.reddit.com/r/memes.json?limit=100&after=${after}`);
    const data = response.data;

    const posts = data.data.children.map((child) => child.data);
    const newAfter = data.data.after;

    return { posts, after: newAfter };
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return { posts: [], after: null };
  }
};