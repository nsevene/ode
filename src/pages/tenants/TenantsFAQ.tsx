import React from "react";

const faqData = [
  {
    question: "Какой минимальный срок аренды?",
    answer: "Для долгосрочной аренды — от 6 месяцев. Для Pop-Up Open Kitchen — от 1 недели."
  },
  {
    question: "Что входит в стоимость аренды?",
    answer: "Официанты, мойка посуды, клининг, интеграция в POS-систему, маркетинговая поддержка, коммуникации (вода, канализация, вентиляция, электричество)."
  },
  {
    question: "Нужно ли свое оборудование?",
    answer: "Базовое кухонное оборудование включено. Специализированное оборудование и газовые баллоны арендатор устанавливает самостоятельно."
  },
  {
    question: "Как рассчитывается комиссия?",
    answer: "Комиссия с оборота от 12% для долгосрочных резидентов. Прогрессивная шкала — чем больше оборот, тем ниже процент."
  },
  {
    question: "Можно ли протестировать концепцию?",
    answer: "Да, через формат Pop-Up Open Kitchen на 1-4 недели. Успешные поп-апы могут перейти на долгосрочную аренду."
  },
  {
    question: "Какие документы нужны для подачи заявки?",
    answer: "Описание концепции, бизнес-план, информация о команде, примеры блюд, финансовые показатели."
  },
  {
    question: "Есть ли ограничения по кухне/концепции?",
    answer: "Мы отдаем предпочтение уникальным концепциям, которые дополняют существующую линейку. Избегаем дублирования форматов."
  },
  {
    question: "Как происходит интеграция с системой заказов?",
    answer: "Все корнеры подключены к единой POS-системе и мобильному приложению ODE. Обучение персонала включено."
  },
  {
    question: "Какая поддержка в маркетинге?",
    answer: "PR, digital-реклама, афиши, участие в ивентах, продвижение в соцсетях ODE, включение в Unified Menu."
  },
  {
    question: "Сколько времени рассматривается заявка?",
    answer: "Первичный ответ — в течение 24 часов. Полное рассмотрение с презентацией — до 7 рабочих дней."
  }
];

export default function TenantsFAQ() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">FAQ — Часто задаваемые вопросы</h1>
        <p className="text-sm text-muted-foreground">Топ-10 вопросов от потенциальных арендаторов.</p>
      </header>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <FAQItem key={index} number={index + 1} question={item.question} answer={item.answer} />
        ))}
      </div>

      <div className="rounded-xl border p-4 bg-muted/30">
        <h3 className="font-medium mb-2">Не нашли ответ?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Свяжитесь с нами для получения персональной консультации.
        </p>
        <div className="flex gap-3">
          <a className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted text-sm" href="/tenants/apply">
            Подать заявку
          </a>
          <a className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-muted text-sm" href="mailto:tenants@ode-foodhall.com">
            Написать email
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ number, question, answer }: { number: number; question: string; answer: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0 mt-0.5">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-2">{question}</h3>
          <p className="text-sm text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}