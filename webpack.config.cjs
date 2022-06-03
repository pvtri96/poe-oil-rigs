const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/cli.ts',
  output: {
    filename: 'cli.js',
    path: path.join(process.cwd(), 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.__NAME__': `"${require(path.join(process.cwd(), 'package.json')).name}"`,
      'process.env.__VERSION__': `"${require(path.join(process.cwd(), 'package.json')).version}"`,
    }),
  ],
};
