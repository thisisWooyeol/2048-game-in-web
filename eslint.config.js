import react from '@woohm402/eslint-config-react';

export default [
  {
    ignores: [
      'eslint.config.js',
      '.yarn',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
  ...react({
    tsconfigRootDir: import.meta.dirname,
  }),
];
