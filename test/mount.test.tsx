import { mountDom } from '../src';

test('createElement', () => {
  const node = <div>hello, world</div>;
  expect(node).toEqual({
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
