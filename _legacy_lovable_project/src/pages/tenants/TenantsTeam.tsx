import React from 'react';

const teamMembers = [
  {
    name: 'Александр Петров',
    role: 'Managing Partner',
    bio: '15 лет в ресторанном бизнесе. Основатель 3 успешных проектов в Москве и Бали.',
    email: 'alex@ode-foodhall.com',
  },
  {
    name: 'Мария Коваленко',
    role: 'Operations Director',
    bio: 'Эксперт по food hall операциям. Бывший директор Danilovsky Market в Москве.',
    email: 'maria@ode-foodhall.com',
  },
  {
    name: 'Джон Смит',
    role: 'Culinary Director',
    bio: 'Шеф-консультант, мишленовский опыт. Помогает арендаторам с концепциями и меню.',
    email: 'john@ode-foodhall.com',
  },
  {
    name: 'Анна Сидорова',
    role: 'Marketing & PR',
    bio: 'Digital-маркетинг для F&B. Продвижение арендаторов и общего бренда ODE.',
    email: 'anna@ode-foodhall.com',
  },
];

export default function TenantsTeam() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Кто управляет ODE</h1>
        <p className="text-sm text-muted-foreground">
          Команда профессионалов с многолетним опытом в ресторанном бизнесе и
          food hall операциях.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-lg font-medium mb-3">Наш подход</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">🤝 Партнерство</h3>
            <p className="text-sm text-muted-foreground">
              Мы не просто сдаем площади — мы строим долгосрочные партнерские
              отношения с каждым арендатором.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">📈 Поддержка роста</h3>
            <p className="text-sm text-muted-foreground">
              Помогаем развивать бизнес: от концепции и меню до маркетинга и
              операционных процессов.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">🎯 Индивидуальный подход</h3>
            <p className="text-sm text-muted-foreground">
              Каждый проект уникален. Адаптируем условия под специфику вашей
              концепции и потребности.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">🚀 Инновации</h3>
            <p className="text-sm text-muted-foreground">
              Внедряем современные технологии: от POS-систем до
              digital-маркетинга и аналитики.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Готовы обсудить ваш проект? Свяжитесь с нашей командой.
        </p>
        <a
          className="inline-flex items-center rounded-lg border px-6 py-3 hover:bg-muted"
          href="/tenants/apply"
        >
          Подать заявку
        </a>
      </div>
    </section>
  );
}

function TeamMemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3">
        <h3 className="font-medium">{member.name}</h3>
        <p className="text-sm text-primary">{member.role}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
      <a
        href={`mailto:${member.email}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {member.email}
      </a>
    </div>
  );
}
