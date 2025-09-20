import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  LoadingSpinner,
  FullPageLoading,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  LoadingButton,
  LoadingOverlay,
  StatusIndicator,
  ProgressBar,
  RefreshButton,
} from '@/components/LoadingStates';

describe('LoadingStates Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('renders with text', () => {
      render(<LoadingSpinner text="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('FullPageLoading', () => {
    it('renders with default message', () => {
      render(<FullPageLoading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<FullPageLoading message="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('Skeleton', () => {
    it('renders with default variant', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with circular variant', () => {
      render(<Skeleton variant="circular" />);
      const skeleton = screen.getByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
      render(<Skeleton width={200} height={100} />);
      const skeleton = screen.getByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('CardSkeleton', () => {
    it('renders card skeleton', () => {
      render(<CardSkeleton />);
      const skeleton = screen.getByRole('status', { hidden: true });
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('TableSkeleton', () => {
    it('renders table skeleton with default rows', () => {
      render(<TableSkeleton />);
      const skeletons = screen.getAllByRole('status', { hidden: true });
      expect(skeletons).toHaveLength(5); // 5 rows by default
    });

    it('renders table skeleton with custom rows and columns', () => {
      render(<TableSkeleton rows={3} columns={2} />);
      const skeletons = screen.getAllByRole('status', { hidden: true });
      expect(skeletons).toHaveLength(3); // 3 rows
    });
  });

  describe('LoadingButton', () => {
    it('renders button with children', () => {
      render(<LoadingButton>Click me</LoadingButton>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(
        <LoadingButton loading loadingText="Loading...">
          Click me
        </LoadingButton>
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('is disabled when loading', () => {
      render(<LoadingButton loading>Click me</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('LoadingOverlay', () => {
    it('renders children when not loading', () => {
      render(
        <LoadingOverlay loading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders loading overlay when loading', () => {
      render(
        <LoadingOverlay loading loadingText="Loading...">
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('StatusIndicator', () => {
    it('renders loading status', () => {
      render(<StatusIndicator status="loading" message="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders success status', () => {
      render(<StatusIndicator status="success" message="Success!" />);
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('renders error status', () => {
      render(<StatusIndicator status="error" message="Error!" />);
      expect(screen.getByText('Error!')).toBeInTheDocument();
    });

    it('renders nothing when idle', () => {
      render(<StatusIndicator status="idle" />);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('ProgressBar', () => {
    it('renders progress bar with percentage', () => {
      render(<ProgressBar progress={50} />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders progress bar without percentage', () => {
      render(<ProgressBar progress={50} showPercentage={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('clamps progress to 0-100 range', () => {
      render(<ProgressBar progress={150} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('RefreshButton', () => {
    it('renders refresh button', () => {
      render(<RefreshButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows spinning icon when refreshing', () => {
      render(<RefreshButton refreshing />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });
});
