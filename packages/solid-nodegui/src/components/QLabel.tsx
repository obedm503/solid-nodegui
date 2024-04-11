import * as gui from "@nodegui/nodegui";
import { EventProps, WidgetEventProps, handleEvents } from "../events";
import { WidgetRegistry } from "../registry";

type SignalProps = EventProps<gui.QLabelSignals>;

export function QLabel(
  props: { id?: string; text: string } & SignalProps & WidgetEventProps
) {
  let node: gui.QLabel;
  const local = handleEvents(() => node, props);
  // @ts-expect-error
  return <q-label ref={node} {...local} />;
}

WidgetRegistry.registerWidget("q-label", {
  widget: gui.QLabel,
  setProperty(node, name, value, prev) {
    if (name === "text") {
      node.setText(value as string);
      return true;
    }
  },
});
