// Полностью автономная система аутентификации для тестирования
// Не зависит от Supabase или внешних сервисов

export interface StandaloneUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  created_at: string;
  is_active: boolean;
}

export interface StandaloneSession {
  access_token: string;
  refresh_token: string;
  user: StandaloneUser;
  expires_at: number;
}

class StandaloneAuth {
  private readonly STORAGE_KEY = 'standalone-auth';
  private readonly USERS_KEY = 'standalone-users';
  
  // Предустановленные пользователи для тестирования
  private defaultUsers: StandaloneUser[] = [
    {
      id: 'admin-1',
      email: 'admin@test.com',
      full_name: 'Test Administrator',
      role: 'admin',
      permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: 'admin-2', 
      email: 'just0aguest@gmail.com',
      full_name: 'Guest Administrator',
      role: 'admin',
      permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: 'admin-3',
      email: 'admin@odefoodhall.com',
      full_name: 'ODE Administrator',
      role: 'admin', 
      permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      created_at: new Date().toISOString(),
      is_active: true
    }
  ];

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.defaultUsers));
      console.log('🔧 Initialized standalone users:', this.defaultUsers.map(u => u.email));
    }
  }

  private getUsers(): StandaloneUser[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : this.defaultUsers;
  }

  private saveUsers(users: StandaloneUser[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Вход с любым email/password - всегда успешный для тестирования
  async signIn(email: string, password: string): Promise<{ success: boolean; session?: StandaloneSession; error?: string }> {
    console.log('🚀 Standalone auth: signing in', email);
    
    try {
      let user = this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Если пользователь не найден, создаем его как админа
      if (!user) {
        user = {
          id: 'auto-admin-' + Date.now(),
          email: email,
          full_name: 'Auto Administrator',
          role: 'admin',
          permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
          created_at: new Date().toISOString(),
          is_active: true
        };
        
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
        console.log('✅ Created new admin user:', user.email);
      }

      const session: StandaloneSession = {
        access_token: 'standalone-token-' + Date.now(),
        refresh_token: 'standalone-refresh-' + Date.now(),
        user: user,
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      console.log('✅ Standalone auth successful:', user.email, 'Role:', user.role);
      
      return { success: true, session };
    } catch (error) {
      console.error('❌ Standalone auth error:', error);
      return { success: false, error: 'Auth error: ' + error };
    }
  }

  // Создание пользователя - всегда создает админа
  async signUp(email: string, password: string, fullName?: string): Promise<{ success: boolean; session?: StandaloneSession; error?: string }> {
    console.log('🚀 Standalone auth: signing up', email);
    
    const user: StandaloneUser = {
      id: 'signup-admin-' + Date.now(),
      email: email,
      full_name: fullName || 'Signup Administrator',
      role: 'admin',
      permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      created_at: new Date().toISOString(),
      is_active: true
    };

    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);

    const session: StandaloneSession = {
      access_token: 'standalone-signup-token-' + Date.now(),
      refresh_token: 'standalone-signup-refresh-' + Date.now(),
      user: user,
      expires_at: Date.now() + (24 * 60 * 60 * 1000)
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    console.log('✅ Standalone signup successful:', user.email, 'Role:', user.role);
    
    return { success: true, session };
  }

  // Получить текущую сессию
  getCurrentSession(): StandaloneSession | null {
    const sessionData = localStorage.getItem(this.STORAGE_KEY);
    if (!sessionData) return null;

    try {
      const session: StandaloneSession = JSON.parse(sessionData);
      
      // Проверяем не истекла ли сессия
      if (session.expires_at < Date.now()) {
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  // Выход
  async signOut(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('✅ Standalone auth: signed out');
  }

  // Мгновенно стать админом
  becomeAdmin(email?: string): StandaloneSession {
    const adminEmail = email || 'instant@admin.com';
    
    const user: StandaloneUser = {
      id: 'instant-admin-' + Date.now(),
      email: adminEmail,
      full_name: 'Instant Administrator',
      role: 'admin',
      permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage'],
      created_at: new Date().toISOString(),
      is_active: true
    };

    const session: StandaloneSession = {
      access_token: 'instant-admin-token-' + Date.now(),
      refresh_token: 'instant-admin-refresh-' + Date.now(),
      user: user,
      expires_at: Date.now() + (24 * 60 * 60 * 1000)
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    console.log('👑 Became instant admin:', user.email);
    
    return session;
  }

  // Получить всех пользователей
  getAllUsers(): StandaloneUser[] {
    return this.getUsers();
  }

  // Очистить все данные
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USERS_KEY);
    console.log('🗑️ Cleared all standalone auth data');
  }
}

export const standaloneAuth = new StandaloneAuth();
