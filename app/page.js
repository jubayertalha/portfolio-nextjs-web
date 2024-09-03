// app/page.js
import { fetchPosts } from './api';
import Ask from './ask'; // Import the Search component

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white w-full py-4 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-center">Talha | Blog</h1>
      </header>

      <main className="w-full max-w-4xl">
        {/* Include the Search component here */}
        <Ask />

        <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">{post.attributes.title}</h3>
              <p className="text-gray-700">{post.attributes.details}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
