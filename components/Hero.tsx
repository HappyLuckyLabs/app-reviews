import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <h1 className="text-7xl font-bold tracking-tight text-gray-900 sm:text-8xl lg:text-9xl leading-none">
              Find what
              <br />
              works
            </h1>

            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
              Deep-dive into the UX patterns, growth tactics, and monetization strategies behind successful apps
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <Image
                src="/hero-image.png"
                alt="App interface showcase"
                width={800}
                height={600}
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
