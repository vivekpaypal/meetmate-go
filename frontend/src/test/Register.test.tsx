import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Register from '../pages/Register'

// Mock the toast hook
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

// Mock fetch
global.fetch = vi.fn()

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form', () => {
    renderWithRouter(<Register />)
    
    expect(screen.getByText('Join TechMeet 2024')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument()
    expect(screen.getByLabelText('Company *')).toBeInTheDocument()
    expect(screen.getByLabelText('Department *')).toBeInTheDocument()
    expect(screen.getByLabelText('Role *')).toBeInTheDocument()
    expect(screen.getByText('Complete Registration')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    renderWithRouter(<Register />)
    
    const submitButton = screen.getByText('Complete Registration')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful', id: 1 }),
    })
    global.fetch = mockFetch

    renderWithRouter(<Register />)
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Company *'), { target: { value: 'Test Company' } })
    fireEvent.change(screen.getByLabelText('Department *'), { target: { value: 'Engineering' } })
    fireEvent.change(screen.getByLabelText('Role *'), { target: { value: 'Developer' } })
    
    // Select interested track
    const trackSelect = screen.getByRole('combobox')
    fireEvent.click(trackSelect)
    fireEvent.click(screen.getByText('Software Engineering'))
    
    // Accept terms
    fireEvent.click(screen.getByRole('checkbox', { name: /terms/i }))
    
    // Submit form
    fireEvent.click(screen.getByText('Complete Registration'))
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Test Company',
          department: 'Engineering',
          role: 'Developer',
          interested_track: 'software-engineering',
          newsletter: false,
          terms: true,
        }),
      })
    })
  })
})
