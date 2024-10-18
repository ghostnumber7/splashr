/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Dummy from '../Dummy';

afterEach(cleanup);

describe('useDummy', () => {
  test('renders nothing`', () => {
    const cb = jest.fn();
    const { container } = render(<Dummy onUnmount={cb} />);
    expect(container).toBeEmptyDOMElement();
  });
  test('calls the callback funtion on unmount`', () => {
    const cb = jest.fn();
    const { unmount } = render(<Dummy onUnmount={cb} />);
    expect(cb).not.toHaveBeenCalled();
    unmount();
    expect(cb).toHaveBeenCalled();
  });
});
