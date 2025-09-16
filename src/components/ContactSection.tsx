import { Clock, MapPin, Footprints, ParkingSquare } from "lucide-react";

/* Contact / Hours / Location */
const ContactSection = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-charcoal mb-6">Contact Information</h3>
    
    {/* Hours */}
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
        <Clock className="h-5 w-5 text-white" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-charcoal mb-1">Hours</h4>
        <p className="text-charcoal/80 text-lg">Daily 07:00 – 23:00</p>
      </div>
    </div>

    {/* Address */}
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
        <MapPin className="h-5 w-5 text-white" />
      </div>
      <div>
        <address className="text-charcoal not-italic leading-relaxed text-lg">
          Jl. Monkey Forest No.15,<br />
          Ubud, Bali 80571, Indonesia
        </address>
      </div>
    </div>

    {/* Walk-in entrance */}
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
        <Footprints className="h-5 w-5 text-white" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-charcoal mb-1">Walk-in</h4>
        <p className="text-charcoal/80">Taste Alley arch on Monkey Forest</p>
      </div>
    </div>

    {/* Drive-in + parking */}
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
        <ParkingSquare className="h-5 w-5 text-white" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-charcoal mb-1">Drive-in & Parking</h4>
        <p className="text-charcoal/80">behind central lot – 80 cars / 150 bikes</p>
      </div>
    </div>
  </div>
);

export default ContactSection;