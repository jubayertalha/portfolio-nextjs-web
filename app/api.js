import axios from 'axios';

export const fetchPosts = async () => {
  try {
    const response = await axios.get('http://api.trahman.me/api/blogs');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
