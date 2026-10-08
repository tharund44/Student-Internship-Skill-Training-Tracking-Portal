import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../utils/axios';

// Mock the zustand store and axios
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Login Page', () => {
  it('renders login form and role selector', () => {
    vi.mocked(useAuthStore).mockReturnValue(vi.fn() as any);
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome Back')).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByText('STUDENT')).toBeDefined();
    expect(screen.getByText('ADMIN')).toBeDefined();
    expect(screen.getByText('COMPANY')).toBeDefined();
  });

  it('shows error on failed login', async () => {
    vi.mocked(useAuthStore).mockReturnValue(vi.fn() as any);
    vi.mocked(api.post).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    const errorMessage = await screen.findByText('Invalid credentials');
    expect(errorMessage).toBeDefined();
  });
});
