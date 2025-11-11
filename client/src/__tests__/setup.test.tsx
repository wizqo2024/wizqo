import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

// Example test to verify Jest setup is working
describe('Testing Infrastructure Setup', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Test Works!</div>;
    render(<TestComponent />);
    expect(screen.getByText('Test Works!')).toBeInTheDocument();
  });

  it('should perform basic math', () => {
    expect(1 + 1).toBe(2);
  });
});

// Example test for a utility function
describe('Utility Functions', () => {
  it('should handle string operations', () => {
    const str = 'hello';
    expect(str.toUpperCase()).toBe('HELLO');
  });
});
