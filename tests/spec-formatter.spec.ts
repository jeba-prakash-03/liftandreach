import { test, expect } from '@playwright/test';
import { extractProductKeySpecs, extractProductCodes } from '../client/src/ui-v4/utils/specFormatter';

test.describe('Part C3 & C4 - Spec Formatter & Model Code Rules', () => {
  test('Exact 5 product outputs match requirements', () => {
    // 1. Pit Mounted / Floor Mounted
    const pit = extractProductKeySpecs({ slug: 'pit-mounted-floor-mounted', name: 'Pit Mounted / Floor Mounted' });
    expect(pit.capacity).toBe('1 - 3 ton');
    expect(pit.maxHeight).toBe('1500 - 4500 mm');

    // 2. Towable-Customized
    const towable = extractProductKeySpecs({ slug: 'towable-customized', name: 'Towable-Customized' });
    expect(towable.capacity).toBe('300 - 500 kg');
    expect(towable.maxHeight).toBe('6000 / 9000 / 11000 mm');

    // 3. Scissor Lift - Self Propelled
    const selfPropelled = extractProductKeySpecs({ slug: 'scissor-lift-self-propelled', name: 'Scissor Lift - Self Propelled' });
    expect(selfPropelled.capacity).toBe('300 - 400 kg');
    expect(selfPropelled.maxHeight).toBe('8000 - 10000 mm');

    // 4. Die Loader
    const dieLoader = extractProductKeySpecs({ slug: 'die-loader', name: 'Die Loader' });
    expect(dieLoader.capacity).toBe('500 - 1000 kg');
    expect(dieLoader.maxHeight).toBe('900 - 1000 mm');

    // 5. Truck Mounted
    const truckMounted = extractProductKeySpecs({ slug: 'truck-mounted', name: 'Truck Mounted' });
    expect(truckMounted.capacity).toBe('1500 kg');
    expect(truckMounted.maxHeight).toBe('7500 mm');
  });

  test('Model codes never split on slash and validate regex', () => {
    const p1 = {
      code: 'LRSTW-0.3T-6.0/9.0/11.0M, LRSTW-0.5T-6.0/9.0/11.0M',
      specTables: []
    };
    const codes = extractProductCodes(p1);
    expect(codes).toHaveLength(2);
    for (const code of codes) {
      expect(code).toMatch(/^[A-Z0-9][A-Z0-9.\-\/*]+$/);
      expect(code.includes('-')).toBeTruthy();
      expect(code).not.toBe('9.0');
    }
  });
});
