import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/obj-list.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
  ],
  plugins: [resolve()],
};
