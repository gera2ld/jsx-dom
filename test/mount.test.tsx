import { mount } from '../src';

test('createElement', () => {
  const node = <div>hello, world</div>;
  expect(node).toEqual({
    vtype: 1,
    type: 'div',
    props: { children: 'hello, world' },
  });
});

test('mount', () => {
  const vnode = <div>hello, world</div>;
  const el = mount(vnode);
  const node = el.node as HTMLElement;
  expect(node).toBeInstanceOf(HTMLDivElement);
  expect(node.innerHTML).toEqual('hello, world');
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
  const el = mount(vnode);
  const node = el.node as HTMLElement;
  expect(node).toBeInstanceOf(HTMLDivElement);
  expect(span).toBeInstanceOf(HTMLSpanElement);
  expect(span.innerHTML).toEqual('hello');
});
