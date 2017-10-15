import test from 'ava';
import Path from '../dist/path';

test('works as a constructor', (t) => {
	const path0 = new Path('M 100 200 L 300 400');
	t.is(path0.d(), 'M100,200l200,200');

	const path1 = new Path(' M -20 20.5l 10,400');
	t.is(path1.d(), 'M-20,20.5l10,400');

	const path2 = new Path('M7,-1l1-.5');
	t.is(path2.toString(), 'M7,-1l1,-0.5');

	t.pass();
});

test('works as function', (t) => {
	const path0 = Path('M 100 200 L 300 400');
	t.is(path0.d(), 'M100,200l200,200');

	t.pass();
});