import * as gui from "@nodegui/nodegui";
import { EventProps, WidgetEventProps, handleEvents } from "../events";
import { WidgetRegistry } from "../registry";

type SignalProps = EventProps<gui.QPushButtonSignals>;

export function QPushButton(
  props: {
    id?: string;
    text?: string;
    style?: string;
    enabled?: boolean;
  } & SignalProps &
    WidgetEventProps
) {
  let node: gui.QPushButton;
  const local = handleEvents(() => node, props);
  // @ts-expect-error
  return <q-push-button ref={node} {...local} />;
}

WidgetRegistry.registerWidget<gui.QPushButton>("q-push-button", {
  widget: gui.QPushButton,
  setProperty(node, name, value, prev) {
    if (name === "text") {
      node.setText(value as string);
      return true;
    }
    if (name === "enabled" && typeof value === "boolean") {
      node.setEnabled(value);
      return true;
    }
    if (name === "style") {
      node.setStyleSheet(value as string);
      return true;
    }
  },
});
