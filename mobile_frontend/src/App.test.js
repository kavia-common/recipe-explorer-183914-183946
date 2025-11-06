import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header and tabs', () => {
  render(<App />);
  // Header on Home should show "Recipe Explorer"
  const title = screen.getByText(/Recipe Explorer/i);
  expect(title).toBeInTheDocument();

  // Tabs present
  expect(screen.getByRole('link', { name: /Browse/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Favorites/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Add Recipe/i })).toBeInTheDocument();
});
