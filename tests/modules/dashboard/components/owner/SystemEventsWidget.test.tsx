import { render, screen } from '../../../../test-utils';
import {
  SystemEventsWidget,
  type SystemEvent,
} from '@/modules/dashboard/components/owner/SystemEventsWidget';

const events: SystemEvent[] = [
  { id: 1, text: 'Сформовано нову групу', time: '10 хв тому', type: 'info' },
  { id: 2, text: 'Отримано нову оплату', time: '25 хв тому', type: 'success' },
];

describe('SystemEventsWidget', () => {
  it('renders the widget title and events', () => {
    render(<SystemEventsWidget events={events} />);

    expect(screen.getByText('Важливі системні події')).toBeInTheDocument();
    expect(screen.getByText('Сформовано нову групу')).toBeInTheDocument();
    expect(screen.getByText('Отримано нову оплату')).toBeInTheDocument();
    expect(screen.getByText('10 хв тому')).toBeInTheDocument();
  });
});
