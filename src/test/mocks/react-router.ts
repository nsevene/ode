import { vi } from 'vitest';

// Mock React Router
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'test-key',
};

export const mockSearchParams = new URLSearchParams();

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useSearchParams: () => [mockSearchParams, vi.fn()],
    useParams: () => ({}),
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  };
});
