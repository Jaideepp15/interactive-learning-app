export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transform .js and .jsx files
      '^.+\\.tsx?$': 'ts-jest', // Transform .ts and .tsx files
    },
    transformIgnorePatterns: [
        "/node_modules/(?!lucide-react)" // Allow transformation of lucide-react
      ],
  };

