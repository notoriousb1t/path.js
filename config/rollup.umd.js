import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'src/main.ts',
	dest: 'dist/path.js',
	sourceMap: true,
	plugins: [
		typescript({
			typescript: require('typescript')
		}),
		nodeResolve({
			module: true,
			jsnext: true,
			main: true,
			browser: true,
			extensions: ['.js', '.json'],
			preferBuiltins: false
		})
	],
	format: 'umd',
	moduleName: 'Path'
};
