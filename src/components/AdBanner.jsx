export default function AdBanner() {
  return (
    <div className="w-full flex justify-center py-4">
      {/* AdSense placeholder — replace with <ins class="adsbygoogle"> snippet */}
      <div className="hidden sm:flex items-center justify-center w-[728px] h-[90px] max-w-full border border-dashed border-white/10 rounded-lg text-zinc-600 text-sm bg-surface/40">
        Ad space (728x90)
      </div>
      <div className="flex sm:hidden items-center justify-center w-[320px] h-[50px] max-w-full border border-dashed border-white/10 rounded-lg text-zinc-600 text-sm bg-surface/40">
        Ad space (320x50)
      </div>
    </div>
  )
}
