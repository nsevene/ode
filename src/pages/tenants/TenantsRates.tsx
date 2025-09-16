import React from "react";

export default function TenantsRates() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Условия аренды и комиссии</h1>
        <p className="text-sm text-muted-foreground">Долгосрочные резиденты — базовая модель. Pop-Up — отдельный формат.</p>
      </header>

      <RatesTable />

      <div className="rounded-xl border p-4">
        <h2 className="text-lg font-medium mb-2">Примечания</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Электроэнергия учитывается по индивидуальному счётчику.</li>
          <li>Все корнеры имеют подключения: вода, канализация, вентиляция/вытяжка, 7–16 кВт.</li>
          <li>Газ — опционально; баллонное оборудование ставит арендатор.</li>
        </ul>
      </div>

      <div className="pt-2 flex gap-3">
        <a className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted" href="/tenants/apply">Подать заявку</a>
        {/* ⚠️ Replace with real PDF from Supabase Storage */}
        <a className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted" href="/storage/rate-card.pdf" target="_blank" rel="noreferrer">Скачать Rate Card (PDF)</a>
      </div>
    </section>
  );
}

function RatesTable() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">Тип</th>
            <th className="p-3 text-left">Фиксированная ставка</th>
            <th className="p-3 text-left">Процент с оборота</th>
            <th className="p-3 text-left">Срок</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">Долгосрочный резидент</td>
            <td className="p-3">от 5 000 000 IDR / мес</td>
            <td className="p-3">от 12%</td>
            <td className="p-3">6–24 мес</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">Pop-Up Open Kitchen</td>
            <td className="p-3">по запросу ⚠️</td>
            <td className="p-3">по запросу ⚠️</td>
            <td className="p-3">1–4 недели</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
