import { Play } from "lucide-react";

export interface VideoItem {
  id: string;
  src: string;
  title: string;
}

export function VideoGallery({ videos }: { videos: VideoItem[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-[2.75rem]">Featured Reels</h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">Get inspired by our beautiful community spaces</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="group relative aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-black/5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <video
              src={video.src}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <Play className="size-6 ml-1 fill-white text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow-md">{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
