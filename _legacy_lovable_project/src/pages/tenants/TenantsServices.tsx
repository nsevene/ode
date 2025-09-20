import React from 'react';

export default function TenantsServices() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Что входит в аренду</h1>
        <p className="text-sm text-muted-foreground">
          Пакет услуг для резидентов и pop-up команд.
        </p>
      </header>

      <ul className="grid gap-3">
        {[
          'Официанты (общая сервисная команда)',
          'Мойка посуды (централизованная)',
          'Клининг (плановый)',
          'Интеграция в POS / Unified Menu / отчёты',
          'Маркетинговая поддержка (PR, digital, афиши, ивенты)',
          'Коммуникации: вода, канализация, вентиляция/вытяжка, 7–16 кВт',
          'Газ — опционально (баллоны ставит арендатор)',
        ].map((t) => (
          <li key={t} className="rounded-xl border p-4">
            {t}
          </li>
        ))}
      </ul>

      <div className="pt-2">
        <a
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted"
          href="/tenants/apply"
        >
          Подать заявку
        </a>
      </div>
    </section>
  );
}
