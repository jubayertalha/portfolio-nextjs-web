import axios from 'axios';

export const fetchPosts = async () => {
  try {
    const response = await axios.get('http://ai.trahman.me:1337/api/blogs');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
