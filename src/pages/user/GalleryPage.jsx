import React, { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { Image, Video, Newspaper, ExternalLink, Play } from "lucide-react";

const TYPES = [
  { value: "all", label: "All" },
  { value: "photo", label: "📸 Photos", icon: <Image size={14} /> },
  { value: "video", label: "🎬 Videos", icon: <Video size={14} /> },
  { value: "pressRelease", label: "📰 Press", icon: <Newspaper size={14} /> },
];

export default function GalleryPage() {
  const { docs: media, loading } = useCollection("mediaGallery", "order");
  const [activeType, setActiveType] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const published = media.filter(m => m.isPublished);
  const filtered = activeType === "all" ? published : published.filter(m => m.type === activeType);

  const photos = filtered.filter(m => m.type === "photo");
  const videos = filtered.filter(m => m.type === "video");
  const press = filtered.filter(m => m.type === "pressRelease");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Our Hospital</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Media Gallery</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Photos, videos, and press coverage from Mafaza tul Hayat Hospital.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeType === t.value ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Image size={48} className="mx-auto mb-4 opacity-30" />
            <p>No media available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Photos grid */}
            {photos.length > 0 && (activeType === "all" || activeType === "photo") && (
              <div>
                {activeType === "all" && <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Photos</h2>}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map(item => (
                    <button key={item.id} onClick={() => setLightbox(item)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-teal-50 hover:shadow-lg transition-all">
                      {item.url ? (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (activeType === "all" || activeType === "video") && (
              <div>
                {activeType === "all" && <h2 className="text-xl font-bold text-gray-800 mb-4">🎬 Videos</h2>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {videos.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                      <div className="h-44 bg-teal-50 relative overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-teal-600/20 flex items-center justify-center">
                              <Play size={24} className="text-teal-600 ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
                        {item.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:text-teal-700 transition">
                            <Play size={14} /> Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Press Releases */}
            {press.length > 0 && (activeType === "all" || activeType === "pressRelease") && (
              <div>
                {activeType === "all" && <h2 className="text-xl font-bold text-gray-800 mb-4">📰 Press Coverage</h2>}
                <div className="space-y-4">
                  {press.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center hover:shadow-md transition">
                      <div>
                        <div className="font-bold text-gray-800 mb-1">{item.title}</div>
                        <div className="flex gap-3 text-xs text-gray-400">
                          {item.source && <span>{item.source}</span>}
                          {item.publishedDate && <span>{item.publishedDate}</span>}
                          {item.category && <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">{item.category}</span>}
                        </div>
                        {item.description && <p className="text-sm text-gray-500 mt-2 line-clamp-1">{item.description}</p>}
                      </div>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="ml-4 shrink-0 flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:text-teal-700 transition">
                          Read <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="text-center mt-3">
              <p className="text-white font-medium">{lightbox.title}</p>
              {lightbox.description && <p className="text-gray-400 text-sm mt-1">{lightbox.description}</p>}
              <button onClick={() => setLightbox(null)} className="mt-3 text-gray-400 hover:text-white text-sm transition">
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}