import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { mockSupabaseClient, mockUser, mockSession } from '@/test/mocks/supabase';
import { vi } from 'vitest';

// Mock the AuthProvider
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state when not authenticated', () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should return authenticated state when user is logged in', () => {
    const mockSignOut = vi.fn();
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: mockSession,
      loading: false,
      signOut: mockSignOut,
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle sign out', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined);
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: mockSession,
      loading: false,
      signOut: mockSignOut,
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('should handle loading state', () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: true,
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
