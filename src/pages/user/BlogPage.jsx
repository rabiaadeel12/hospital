// src/pages/user/BlogPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { ArrowRight, Clock } from "lucide-react";

const TYPE_LABELS = {
  article: "Article",
  awareness: "Awareness",
  patientStory: "Patient Story",
  seasonal: "Seasonal Guide",
  video: "Video",
};

const TYPE_COLORS = {
  article: "bg-blue-50 text-blue-600",
  awareness: "bg-pink-50 text-pink-600",
  patientStory: "bg-purple-50 text-purple-600",
  seasonal: "bg-green-50 text-green-600",
  video: "bg-orange-50 text-orange-600",
};

export function BlogPage() {
  const { docs: posts, loading } = useCollection("healthEducation", "createdAt");
  const [activeType, setActiveType] = useState("all");

  const published = posts.filter(p => p.isPublished);
  const types = ["all", ...new Set(published.map(p => p.type))];

  const filtered = activeType === "all" ? published : published.filter(p => p.type === activeType);

  const featured = filtered.find(p => p.thumbnailUrl); // first with image as hero
  const rest = filtered.filter(p => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Knowledge & Wellness</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Health Blog</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Expert health articles, awareness campaigns, and patient stories from our medical team.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${activeType === t ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}>
              {t === "all" ? "All Posts" : TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && activeType === "all" && (
              <Link to={`/blog/${featured.slug}`} className="group block mb-10">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-2">
                    <div className="h-60 md:h-auto bg-teal-100 overflow-hidden">
                      {featured.thumbnailUrl ? (
                        <img src={featured.thumbnailUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🏥</div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize inline-block w-fit mb-3 ${TYPE_COLORS[featured.type] || "bg-gray-100 text-gray-600"}`}>
                        {TYPE_LABELS[featured.type] || featured.type}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">{featured.title}</h2>
                      {featured.excerpt && <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>}
                      {featured.authorName && <p className="text-sm text-gray-400">By {featured.authorName}</p>}
                      <div className="flex items-center gap-1 text-teal-600 font-semibold mt-4 group-hover:gap-2 transition-all">
                        Read Article <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-transparent hover:border-teal-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="h-44 bg-teal-50 overflow-hidden">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-teal-200">
                        {post.type === "video" ? "🎬" : post.type === "awareness" ? "🎗️" : "📝"}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[post.type] || "bg-gray-100 text-gray-600"}`}>
                        {TYPE_LABELS[post.type] || post.type}
                      </span>
                      {post.category && <span className="text-xs text-gray-400">{post.category}</span>}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}
                    {post.authorName && <p className="text-xs text-gray-400">By {post.authorName}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Blog Post Detail ─────────────────────────────────────────────────────────
export function BlogPostPage() {
  const { slug } = useParams();
  const { docs: posts, loading } = useCollection("healthEducation", "createdAt");
  const post = posts.find(p => p.slug === slug && p.isPublished);

  // related posts
  const related = posts.filter(p => p.isPublished && p.id !== post?.id && p.type === post?.type).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">📝</div>
        <h1 className="text-2xl font-bold text-gray-700">Article not found</h1>
        <Link to="/blog" className="text-teal-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      {post.thumbnailUrl && (
        <div className="h-72 md:h-96 bg-gray-200 overflow-hidden">
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/blog" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TYPE_COLORS[post.type] || "bg-gray-100 text-gray-600"}`}>
            {TYPE_LABELS[post.type] || post.type}
          </span>
          {post.category && <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{post.category}</span>}
          {post.month && <span className="text-xs text-gray-400">{post.month}</span>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>

        {post.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed mb-6 border-l-4 border-teal-400 pl-4">{post.excerpt}</p>
        )}

        {/* Author */}
        {post.authorName && (
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              {post.authorName[0]}
            </div>
            <div>
              <p className="font-medium text-gray-800">{post.authorName}</p>
              <p className="text-xs text-gray-400">Medical Expert</p>
            </div>
          </div>
        )}

        {/* Video embed */}
        {post.type === "video" && post.videoUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <iframe
              src={post.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
              className="w-full h-full"
              allowFullScreen
              title={post.title}
            />
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div className="prose prose-gray max-w-none">
            {post.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p> : <br key={i} />
            )}
          </div>
        )}

        {/* Tags */}
        {(post.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {r.thumbnailUrl && (
                    <div className="h-28 overflow-hidden">
                      <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-teal-700 transition-colors">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";