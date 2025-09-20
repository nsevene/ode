import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { vi } from 'vitest';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies correct size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByText('Large Button');
    expect(button).toHaveClass('h-12');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button disabled>Loading...</Button>);
    const button = screen.getByText('Loading...');
    expect(button).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button with ref</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
