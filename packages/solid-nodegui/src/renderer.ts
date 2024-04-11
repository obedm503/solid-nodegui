import * as gui from "@nodegui/nodegui";
import { createRenderer } from "solid-js/universal";
import { WidgetRegistry } from "./registry";

const {
  render: solidRender,
  createComponent,
  createElement,
  createTextNode,
  effect,
  insert,
  insertNode,
  memo,
  mergeProps,
  setProp,
  spread,
  use,
} = createRenderer<gui.QWidget>({
  createElement(tag) {
    const config = WidgetRegistry.get(tag);
    return new config.widget();
  },
  createTextNode(value) {
    const label = new gui.QLabel();
    label.setText(value);
    return label;
  },
  getFirstChild(node) {
    const layout = node.layout() as gui.FlexLayout;
    if (!layout) {
      return;
    }
    return node.children().at(0) as gui.QWidget;
  },
  getNextSibling(node) {
    const parent = node.parentWidget();
    const layout = parent.layout() as gui.FlexLayout;
    if (!layout) {
      return;
    }
    return layout.getNextSibling(node) ?? undefined;
  },
  getParentNode(node) {
    return node.parentWidget();
  },
  insertNode(parent, node, anchor) {
    const g = global as any;

    if (node instanceof gui.QMainWindow) {
      if (!Array.isArray(g.windows)) {
        g.windows = [];
      }
      g.windows.push(node);

      node.show();

      return;
    }

    if (parent instanceof gui.QMainWindow) {
      if (parent.centralWidget()) {
        throw new Error("QMainWindow can only have one child");
      }
      parent.setCentralWidget(node);
      return;
    }

    let layout = parent.layout();
    if (!layout) {
      const flexLayout = new gui.FlexLayout();
      flexLayout.setFlexNode(parent.getFlexNode());
      parent.setLayout(flexLayout);
      layout = flexLayout;
    }

    layout.addWidget(node, node.getFlexNode());
  },
  isTextNode(node) {
    return node instanceof gui.QLabel;
  },
  removeNode(parent, node) {
    const layout = parent.layout();
    if (!layout) {
      return;
    }
    layout.removeWidget(node);
  },
  replaceText(textNode: gui.QLabel, value) {
    textNode.setText(value);
  },
  setProperty(node, name, value, prev) {
    if (name === "id") {
      node.setObjectName(value as string);
      return;
    }

    const config = WidgetRegistry.get(node);

    const handled = config.setProperty(node, name, value, prev);
    if (handled) {
      return;
    }

    throw new Error(
      `Unsupported prop ${name} for node ${node.constructor.name}`
    );
  },
});

export {
  createComponent,
  createElement,
  createTextNode,
  effect,
  insert,
  insertNode,
  memo,
  mergeProps,
  setProp,
  spread,
  use,
};

export function render(code: () => gui.QWidget) {
  return solidRender(code, null as any);
}
