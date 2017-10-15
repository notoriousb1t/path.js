import test from 'ava';
import Path from '../dist/path';

test('works', (t) => {
	const a = 'M 100 100 L 200 200';
	const b = 'M 200 100 L 100 200';

	t.is(Path.mix(a, b, 0).toString(), 'M100,100l100,100');
	t.is(Path.mix(a, b, 0.25).toString(), 'M125,100l50,100');
	t.is(Path.mix(a, b, 0.5).toString(), 'M150,100l0,100');
	t.is(Path.mix(a, b, 0.75).toString(), 'M175,100l-50,100');
	t.is(Path.mix(a, b, 1).toString(), 'M200,100l-100,100');

	t.pass();
});

test('defaults x to a value of 0.5', (t) => {
	const a = 'M 100 100 L 200 200';
	const b = 'M 200 100 L 100 200';

	t.is(Path.mix(a, b).toString(), 'M150,100l0,100');

	t.pass();
});

test('supports mixing S and C after S and C', (t) => {
	const a = 'M 0 0 C 10 10, 20 -10, 30 0 S 50 -10, 60 0';
	const b = 'M 0 0 C 10 10, 20 -10, 30 0 C 40 -10, 50 10, 60 0';

	t.is(Path.mix(a, b, 0).toString(), 'M0,0c10,10,20,-10,30,0c10,10,20,-10,30,0');
	t.is(Path.mix(a, b, 0.25).toString(), 'M0,0c10,10,20,-10,30,0c10,5,20,-5,30,0');
	t.is(Path.mix(a, b, 0.5).toString(), 'M0,0c10,10,20,-10,30,0c10,0,20,0,30,0');
	t.is(Path.mix(a, b, 0.75).toString(), 'M0,0c10,10,20,-10,30,0c10,-5,20,5,30,0');
	t.is(Path.mix(a, b, 1).toString(), 'M0,0c10,10,20,-10,30,0c10,-10,20,10,30,0');

	t.is(Path.mix(b, a, 0.25).toString(), 'M0,0c10,10,20,-10,30,0c10,-5,20,5,30,0');
	t.is(Path.mix(b, a, 0.75).toString(), 'M0,0c10,10,20,-10,30,0c10,5,20,-5,30,0');

	t.pass();
});

test('supports mixing S and C after M', (t) => {
	const a = 'M 0 0 S 50 -10, 60 0';
	const b = 'M 0 0 C 40 -10, 50 10, 60 0';

	t.is(Path.mix(a, b, 0).toString(), 'M0,0c0,0,50,-10,60,0');
	t.is(Path.mix(a, b, 0.25).toString(), 'M0,0c10,-2.5,50,-5,60,0');
	t.is(Path.mix(a, b, 0.5).toString(), 'M0,0c20,-5,50,0,60,0');
	t.is(Path.mix(a, b, 0.75).toString(), 'M0,0c30,-7.5,50,5,60,0');
	t.is(Path.mix(a, b, 1).toString(), 'M0,0c40,-10,50,10,60,0');

	t.pass();
});