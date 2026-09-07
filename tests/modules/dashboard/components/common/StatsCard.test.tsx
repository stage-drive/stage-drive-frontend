import { render, screen } from '../../../../test-utils';
import { StatsCard } from '@/modules/dashboard/components/common/StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Студенти" value={248} />);

    expect(screen.getByText('Студенти')).toBeInTheDocument();
    expect(screen.getByText('248')).toBeInTheDocument();
  });

  it('renders suffix when provided', () => {
    render(<StatsCard title="Оплати" value={15} suffix="тис." />);

    expect(screen.getByText('тис.')).toBeInTheDocument();
  });
});
