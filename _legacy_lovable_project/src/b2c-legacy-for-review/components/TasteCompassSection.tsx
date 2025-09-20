const TasteCompassSection = () => {
  return (
    <section
      id="taste-compass"
      className="py-20 px-5 text-center bg-burgundy-primary text-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h2 className="text-4xl md:text-5xl font-bold mb-5">TASTE COMPASS</h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 opacity-90">
          Walk through 7 taste zones — earn your VIP access to ODE Food Hall
        </p>

        {/* Taste Zone Pills */}
        <div className="flex justify-center flex-wrap gap-4 max-w-4xl mx-auto mb-10">
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🌶️ SPICE
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🔥 SMOKE
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🧪 FERMENT
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🌊 UMAMI
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🍯 SWEET
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🌿 FRESH
          </span>
          <span className="bg-mustard-accent text-charcoal-dark px-5 py-3 rounded-full font-semibold">
            🥃 BITTER
          </span>
        </div>

        {/* Instagram Link */}
        <a
          href="https://instagram.com/odefoodhall"
          className="text-mustard-accent hover:text-mustard-light transition-colors underline text-lg"
        >
          📸 Follow on Instagram
        </a>
      </div>
    </section>
  );
};

export default TasteCompassSection;
