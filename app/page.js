// app/page.js
import { fetchPosts } from './api';
import Ask from './ask'; // Import the Search component
import Header from './header'; // Import the Header component

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Include the Header component */}
      <Header />

      {/* Add padding to the top to avoid overlap with the fixed header */}
      <main className="w-full max-w-4xl pt-24 md:pt-32">
        {/* Include the Search component here */}
        <Ask />

        <h2 className="text-2xl mb-6 text-indigo-600">Blog Posts</h2>
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-indigo-200 bg-opacity-20 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">{post.attributes.title}</h3>
              <p className="text-gray-700">{post.attributes.details}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
