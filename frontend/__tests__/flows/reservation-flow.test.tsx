import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyReservationsPage from '@/app/reservations/page';
import api from '@/lib/api';

jest.mock('@/lib/api', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div>Navbar</div>,
}));

describe('Reservation flow', () => {
  it('allows cancelling a pending reservation', async () => {
    const mockedGet = api.get as jest.Mock;
    const mockedDelete = api.delete as jest.Mock;

    mockedGet.mockResolvedValue({
      data: [
        {
          id: 'res-1',
          status: 'pending',
          createdAt: new Date().toISOString(),
          event: {
            id: 'event-1',
            title: 'Atelier React',
            location: 'Paris',
            startDate: new Date().toISOString(),
          },
        },
      ],
    });

    mockedDelete.mockResolvedValue({});

    window.confirm = jest.fn(() => true);

    render(<MyReservationsPage />);

    expect(await screen.findByText('Atelier React')).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledWith('/reservations/res-1');
    });
  });
});
