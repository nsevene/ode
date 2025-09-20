import React from 'react';

export default function TenantsOpenKitchen() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Pop-Up Open Kitchen</h1>
        <p className="text-sm text-muted-foreground">
          Краткосрочная аренда готовой кухни для шефов и брендов.
        </p>
      </header>

      <div className="grid gap-4">
        <Row label="Минимальный срок аренды" value="от 1 недели" />
        <Row label="Размер кухни" value="~16 м² (полностью оборудовано)" />
        <Row
          label="Инфраструктура"
          value="Кафель, вода, слив, вытяжка, освещение; газ при необходимости (баллоны — арендатор)"
        />
        <Row
          label="Что входит"
          value="Официанты, мойка, клининг, интеграция в систему заказов, маркетинг, отчётность"
        />
      </div>

      <div className="rounded-xl border p-4">
        <div className="text-sm">
          <b>Важно:</b> условия стоимости pop-up уточняются индивидуально. Для
          бронирования — оставьте заявку.
        </div>
      </div>

      <div className="pt-2">
        <a
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted"
          href="/tenants/apply"
        >
          Забронировать Open Kitchen
        </a>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="text-base">{value}</div>
    </div>
  );
}
