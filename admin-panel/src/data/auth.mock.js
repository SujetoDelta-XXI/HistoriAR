// Usuario administrador único
export const MOCK_ADMINS = [
  {
    id: '1',
    email: 'admin@historiar.pe',
    password: 'admin123',
    name: 'Administrador Principal',
    role: 'super_admin',
  },
];

export function findUserByCredentials(email, password) {
  return (
    MOCK_ADMINS.find((u) => u.email === email && u.password === password) || null
  );
}

// Datos separados para gráficos de pastel (pie charts)
// Puedes usar estos datos en tus componentes de analytics
export const USER_ANALYTICS_DATA = {
  totalUsers: 1250,
  activeUsers: 890,
  newUsersThisMonth: 156,
  usersByPlatform: [
    { name: 'Android', value: 650, percentage: 52 },
    { name: 'iOS', value: 600, percentage: 48 }
  ],
  usersByAge: [
    { name: '18-25', value: 375, percentage: 30 },
    { name: '26-35', value: 437, percentage: 35 },
    { name: '36-45', value: 250, percentage: 20 },
    { name: '46+', value: 188, percentage: 15 }
  ]
};

export const MONUMENT_ANALYTICS_DATA = {
  totalMonuments: 45,
  totalVisits: 5420,
  averageRating: 4.5,
  monumentsByCategory: [
    { name: 'Huacas', value: 18, percentage: 40 },
    { name: 'Museos', value: 12, percentage: 27 },
    { name: 'Sitios Arqueológicos', value: 10, percentage: 22 },
    { name: 'Monumentos Históricos', value: 5, percentage: 11 }
  ],
  visitsByMonth: [
    { name: 'Enero', visits: 420 },
    { name: 'Febrero', visits: 380 },
    { name: 'Marzo', visits: 520 },
    { name: 'Abril', visits: 650 },
    { name: 'Mayo', visits: 590 },
    { name: 'Junio', visits: 710 },
    { name: 'Julio', visits: 820 },
    { name: 'Agosto', visits: 780 },
    { name: 'Septiembre', visits: 640 },
    { name: 'Octubre', visits: 910 }
  ]
};

export const ENGAGEMENT_DATA = {
  quizCompletions: 3420,
  toursCompleted: 2150,
  averageTimePerVisit: '12:30', // minutos:segundos
  interactionsByType: [
    { name: 'Realidad Aumentada', value: 2100, percentage: 35 },
    { name: 'Tours Virtuales', value: 1800, percentage: 30 },
    { name: 'Quizzes', value: 1500, percentage: 25 },
    { name: 'Lectura de Contenido', value: 600, percentage: 10 }
  ]
};
