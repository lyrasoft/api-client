import { readFileSync } from 'fs';
import dts from 'rollup-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/generic.ts',
    output: {
      file: 'src/generic.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'src/ionic.ts',
    output: {
      file: 'src/ionic.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'src/sweetalert.ts',
    output: {
      file: 'src/sweetalert.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  },
];

function addMinToFilename(fileName) {
  return fileName.replace(/.js$/, '.min.js');
}

function addMinToCssFilename(fileName) {
  return fileName.replace(/.css$/, '.min.css');
}

