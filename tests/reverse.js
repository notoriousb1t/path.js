import test from 'ava';
import Path from '../dist/path';

test('works on method', t => {
	const path0 = new Path('M 100 200 L 300 400');

	t.is(path0.reverse().toString(), 'M300,400l-200,-200');
	t.is(path0.toString(), 'M100,200l200,200'); // should have left original alone

	t.pass();
});

test('works on static function', t => {
	t.is(Path.reverse('M 100 200 L 300 400'), 'M300,400l-200,-200');

	t.is(Path.reverse('M0,0c40,-10,50,10,60,0'), 'M60,0c-10,10,-20,-10,-60,0');
	t.is(Path.reverse('M 0 0 S 50 -10, 60 0'), 'M60,0c-10,-10,-60,0,-60,0');
	t.is(Path.reverse('M 0 0 S 50 -10, 60 0c40,-10,50,10,60,0'), 'M120,0c-10,10,-20,-10,-60,0c-10,-10,-60,0,-60,0');

	t.pass();
});
