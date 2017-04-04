import fs from 'fs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import image from 'rollup-plugin-image';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

let pkg = JSON.parse(fs.readFileSync('./package.json'));
let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));

export default {
  entry: 'src/app.js',
  format: 'cjs',
  plugins: [
    resolve(),
    image(),
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      contentBase: '',
      historyApiFallback: false,
      host: 'localhost',
      port: 10001
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      skip: external
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: '**/*.css'
    })
  ],
  moduleName: 'galaxy',
  dest: 'bundle.js'
};