import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-center min-h-[700px]">
          {/* Left: Text Content - 40% */}
          <div className="space-y-8">
            <h1 className="text-8xl font-black tracking-tight text-gray-900 sm:text-9xl lg:text-[10rem] leading-[0.85]">
              Find what works
            </h1>

            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
              Deep-dive into the UX patterns, growth tactics, and monetization strategies behind successful apps
            </p>
          </div>

          {/* Right: Hero Image - 60% */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full">
              <Image
                src="/hero-image.png"
                alt="App interface showcase"
                width={1000}
                height={750}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
