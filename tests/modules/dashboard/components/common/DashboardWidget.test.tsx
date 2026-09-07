import { render, screen } from '../../../../test-utils';
import { DashboardWidget } from '@/modules/dashboard/components/common/DashboardWidget';

describe('DashboardWidget', () => {
  it('renders title and children', () => {
    render(
      <DashboardWidget title="Розклад">
        <p>Немає занять</p>
      </DashboardWidget>
    );

    expect(screen.getByText('Розклад')).toBeInTheDocument();
    expect(screen.getByText('Немає занять')).toBeInTheDocument();
  });

  it('renders extra content in the card header', () => {
    render(
      <DashboardWidget title="Події" extra={<button type="button">Оновити</button>}>
        <p>Список подій</p>
      </DashboardWidget>
    );

    expect(screen.getByRole('button', { name: 'Оновити' })).toBeInTheDocument();
  });
});
