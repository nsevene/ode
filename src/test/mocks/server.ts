import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'admin@odefoodhall.com',
    full_name: 'System Administrator',
    phone: '+62-XXX-XXXX-XXXX',
    role: 'admin',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'tenant@example.com',
    full_name: 'Test Tenant',
    phone: '+62-XXX-XXXX-XXXX',
    role: 'tenant',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockBookings = [
  {
    id: '1',
    user_id: '1',
    space_id: '1',
    date: '2024-12-01T10:00:00Z',
    time_slot: '10:00',
    duration: 2,
    guests: 4,
    special_requests: 'Vegetarian options',
    status: 'confirmed',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockTenantApplications = [
  {
    id: '1',
    company_name: 'Test Restaurant',
    contact_person: 'John Doe',
    email: 'john@testrestaurant.com',
    phone: '+62-XXX-XXXX-XXXX',
    business_type: 'Restaurant',
    cuisine_type: 'Italian',
    description: 'Authentic Italian cuisine',
    space_name: 'Kitchen A',
    space_area: 50,
    floor_number: 1,
    lease_duration: '12 months',
    lease_start_date: '2024-12-01T00:00:00Z',
    investment_budget: '100000000',
    expected_revenue: '200000000',
    has_food_license: true,
    previous_experience: '5 years in restaurant business',
    special_requirements: 'Halal certification',
    status: 'pending',
    admin_notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock handlers
export const handlers = [
  // Auth endpoints
  http.post('/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'new-user-id',
        email: 'newuser@example.com',
        created_at: '2024-01-01T00:00:00Z'
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    });
  }),

  http.post('/auth/v1/token', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'admin@odefoodhall.com',
        created_at: '2024-01-01T00:00:00Z'
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    });
  }),

  // Users endpoints
  http.get('/rest/v1/profiles', () => {
    return HttpResponse.json(mockUsers);
  }),

  http.post('/rest/v1/profiles', async ({ request }) => {
    const body = await request.json();
    const newUser = {
      id: 'new-user-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return HttpResponse.json(newUser);
  }),

  http.patch('/rest/v1/profiles/:id', async ({ params, request }) => {
    const body = await request.json();
    const userIndex = mockUsers.findIndex(user => user.id === params.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
      return HttpResponse.json(mockUsers[userIndex]);
    }
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  http.delete('/rest/v1/profiles/:id', ({ params }) => {
    const userIndex = mockUsers.findIndex(user => user.id === params.id);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  // User roles endpoints
  http.get('/rest/v1/user_roles', () => {
    return HttpResponse.json([
      { id: '1', user_id: '1', role: 'admin' },
      { id: '2', user_id: '2', role: 'tenant' }
    ]);
  }),

  http.post('/rest/v1/user_roles', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'new-role-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }),

  // Bookings endpoints
  http.get('/rest/v1/bookings', () => {
    return HttpResponse.json(mockBookings);
  }),

  http.post('/rest/v1/bookings', async ({ request }) => {
    const body = await request.json();
    const newBooking = {
      id: 'new-booking-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockBookings.push(newBooking);
    return HttpResponse.json(newBooking);
  }),

  // Tenant applications endpoints
  http.get('/rest/v1/tenant_applications', () => {
    return HttpResponse.json(mockTenantApplications);
  }),

  http.post('/rest/v1/tenant_applications', async ({ request }) => {
    const body = await request.json();
    const newApplication = {
      id: 'new-application-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockTenantApplications.push(newApplication);
    return HttpResponse.json(newApplication);
  }),

  // Error handlers
  http.get('/rest/v1/error', () => {
    return HttpResponse.json({ error: 'Test error' }, { status: 500 });
  }),

  http.get('/rest/v1/not-found', () => {
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.get('/rest/v1/unauthorized', () => {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),

  http.get('/rest/v1/forbidden', () => {
    return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
  })
];

// Create server
export const server = setupServer(...handlers);
