module.exports = {
  root: true,
  plugins: ['@tanstack/query'],
  extends: '@react-native',
  overrides: [
    {
      'prettier/prettier': [
        'off',
        {},
        {
          usePrettierrc: false,
        },
      ],
      files: ['**/*.tsx'],
      rules: {
        'react/jsx-max-props-per-line': [1, { when: 'multiline' }],
        'react/jsx-wrap-multilines': 'error',
        'no-multi-spaces': 'error',
        'react-native/no-inline-styles': 0,
        'max-len': [
          'off',
          {
            code: 120,
          },
        ],
        'sort-keys': [
          'error',
          'asc',
          {
            allowLineSeparatedGroups: true,
            caseSensitive: false,
          },
        ],
      },
    },
  ],
};
