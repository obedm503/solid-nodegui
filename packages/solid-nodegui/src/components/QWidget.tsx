import * as gui from "@nodegui/nodegui";
import { WidgetRegistry } from "../registry";
import { EventProps, WidgetEventProps, handleEvents } from "../events";

type SignalProps = EventProps<gui.QWidgetSignals>;

export function QWidget(
  props: {
    id?: string;
    children: gui.QWidget[];
  } & SignalProps &
    WidgetEventProps
) {
  let node: gui.QWidget;
  const local = handleEvents(() => node, props);
  // @ts-expect-error
  return <q-widget ref={node} {...local} />;
}

WidgetRegistry.registerWidget("q-widget", {
  widget: gui.QWidget,
  setProperty(node, name, value, prev) {},
});
