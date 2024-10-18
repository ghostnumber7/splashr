/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
  render, cleanup, waitFor, getByTestId, fireEvent, act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import SplashrSuspense from '../SplashrSuspense';

afterEach(cleanup);
jest.useFakeTimers();

const simulateDynamicImport = (component, delay) => () => (delay
  ? new Promise((resolve) => {
    setTimeout(() => resolve({ default: component }), delay);
  })
  : Promise.resolve({ default: component })
);

const splash = <div data-testid="splash">splash!</div>;
const Children = () => <div data-testid="children">children</div>;

const LazyChildren = React.lazy(simulateDynamicImport(Children, 10000));

describe('SplashrSuspense', () => {
  test('accepts lazy loaded children', async () => {
    const { container } = render(
      <SplashrSuspense
        transitionTime={700}
        splash={splash}
      >
        <LazyChildren />
      </SplashrSuspense>
    );
    const transitionEl = container.children[0];

    expect(container.children[0].children.length).toBe(1);
    act(() => jest.advanceTimersByTime(10000));
    expect(container.children[0].children.length).toBe(1);

    const lazySplashElement = await waitFor(() => getByTestId(container, 'splash'));
    expect(lazySplashElement).toBeInTheDocument();

    fireEvent.transitionEnd(transitionEl);
    expect(container.children.length).toBe(1);
  });
});
