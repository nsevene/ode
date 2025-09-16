import { BRAND_CANON } from "@/lib/brand";

export default function FooterPolicy() {
  return (
    <div className="text-xs opacity-70 space-y-2 leading-relaxed max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 opacity-90">Зонирование напитков</h4>
          <p>1F AC-зона — Halal / 0% ABV. 2F — Alcohol Lounge; кальяны только 2F. Wine Staircase — бутылки на распитие на месте; хранения и розничной продажи нет. BYO запрещён.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 opacity-90">Дегустации и события</h4>
          <p>Дегустации и Chef's Table: пн/ср/пт, прибытие 17:00–17:15, окончание до 19:00, площадка — Veranda (2F). 21+ для вина. Service fee 5%.</p>
        </div>
      </div>
      <div className="text-center pt-4 border-t border-white/10">
        <p>Каноничное название бренда: <strong>{BRAND_CANON}</strong></p>
      </div>
    </div>
  );
}