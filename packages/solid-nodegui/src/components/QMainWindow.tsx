import * as gui from "@nodegui/nodegui";
import { JSX } from "solid-js";
import { WidgetRegistry } from "../registry";
import { EventProps, WidgetEventProps, handleEvents } from "../events";

type SignalProps = EventProps<gui.QMainWindowSignals>;

export function QMainWindow(
  props: {
    id?: string;
    title: string;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    style?: string;
    children: JSX.Element;
  } & SignalProps &
    WidgetEventProps
) {
  let node: gui.QMainWindow;
  const local = handleEvents(() => node, props);
  // @ts-expect-error
  return <q-main-window ref={node} {...local} />;
}

WidgetRegistry.registerWidget("q-main-window", {
  widget: gui.QMainWindow,
  setProperty(node, name, value, prev) {
    if (name === "title") {
      node.setWindowTitle(value as string);
      return true;
    }

    if (name === "maxWidth") {
      node.setMaximumWidth(value as number);
      return true;
    }
    if (name === "maxHeight") {
      node.setMaximumHeight(value as number);
      return true;
    }
    if (name === "minWidth") {
      node.setMinimumWidth(value as number);
      return true;
    }
    if (name === "minHeight") {
      node.setMinimumHeight(value as number);
      return true;
    }
    if (name === "style") {
      node.setStyleSheet(value as string);
      return true;
    }
  },
});
