import { mountDom, hm } from '../src';

test('createElement', () => {
  const vnode = <div>hello, world</div>;
  expect(vnode).toEqual({
    vtype: 1,
    type: 'div',
    props: { children: 'hello, world' },
  });
});

test('mountDom', () => {
  const vnode = <div>hello, world</div>;
  const el = mountDom(vnode) as HTMLElement;
  expect(el).toBeInstanceOf(HTMLDivElement);
  expect(el.innerHTML).toEqual('hello, world');
});

test('ref', () => {
  let span: HTMLElement;
  const vnode = (
    <div>
      <span
        ref={(el) => {
          span = el;
        }}
      >
        hello
      </span>
    </div>
  );
  const el = mountDom(vnode) as HTMLElement;
  expect(el).toBeInstanceOf(HTMLDivElement);
  expect(span).toBeInstanceOf(HTMLSpanElement);
  expect(span.innerHTML).toEqual('hello');
});

test('null', () => {
  const vnode = <div>hello {null}</div>;
  expect(vnode).toEqual({
    vtype: 1,
    type: 'div',
    props: { children: ['hello ', null] },
  });
  const el = mountDom(vnode) as HTMLElement;
  expect(el.innerHTML).toEqual('hello ');
});

test('empty list', () => {
  const vnode = <div>{[]}</div>;
  const el = mountDom(vnode) as HTMLDivElement;
  expect(el).toBeInstanceOf(HTMLDivElement);
  expect(el.innerHTML).toEqual('');
});

test('fragment', () => {
  const vnode = (
    <>
      <div>1</div>
      <div>2</div>
    </>
  );
  const el = mountDom(vnode) as DocumentFragment;
  expect(el).toBeInstanceOf(DocumentFragment);
  expect(Array.from(el.children, (child) => child.outerHTML)).toEqual([
    '<div>1</div>',
    '<div>2</div>',
  ]);
});

test('hm', () => {
  const el = hm(
    'div',
    {},
    hm('span', {}, 'hello'),
    hm('span', {}, 'world')
  ) as HTMLDivElement;
  expect(el).toBeInstanceOf(HTMLDivElement);
  expect(el.innerHTML).toBe('<span>hello</span><span>world</span>');
});
