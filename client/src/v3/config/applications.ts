export interface ApplicationOption {
  id: string;
  label: string;
  categorySlugs: string[];
}

export const APPLICATION_OPTIONS: ApplicationOption[] = [
  {
    id: 'trucks',
    label: 'Load/unload trucks',
    categorySlugs: ['scissor-lift', 'dock-leveler', 'zero-lift']
  },
  {
    id: 'height',
    label: 'Work at height',
    categorySlugs: ['aerial-access-platform', 'scissor-lift']
  },
  {
    id: 'floors',
    label: 'Move material between floors',
    categorySlugs: ['goods-lift', 'scissor-lift']
  },
  {
    id: 'dies',
    label: 'Machine and die loading',
    categorySlugs: ['hydraulic-floor-crane-light-duty', 'scissor-lift']
  },
  {
    id: 'pallets',
    label: 'Pallets and stacking',
    categorySlugs: ['stacker', 'pallet-truck', 'zero-lift']
  },
  {
    id: 'drums',
    label: 'Drum and barrel handling',
    categorySlugs: ['hydraulic-barrel-lifter-tilter']
  },
  {
    id: 'aircraft',
    label: 'Aircraft maintenance',
    categorySlugs: ['aircraft-jacks']
  },
  {
    id: 'custom',
    label: 'Custom requirement',
    categorySlugs: ['scissor-lift', 'aerial-access-platform', 'goods-lift']
  }
];
