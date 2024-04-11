import * as gui from "@nodegui/nodegui";
import { QEvent } from "@nodegui/nodegui/dist/lib/QtGui/QEvent/QEvent";
import { createEffect, onCleanup, splitProps } from "solid-js";

export type EventProps<T> = Partial<{
  [K in keyof T as K extends string ? `on:${K}` : never]: T[K];
}>;

export type WidgetEventProps = EventProps<{
  [key in gui.WidgetEventTypes]: (event: unknown) => void;
}>;

export function handleEvents<EventProps extends WidgetEventProps>(
  ref: () => gui.QWidget,
  props: EventProps
) {
  type EventPropNames = Array<keyof EventProps>;
  const eventNames = Object.keys(props).filter((key) =>
    key.startsWith("on:")
  ) as EventPropNames;
  const [local, rest] = splitProps(props, eventNames);

  for (const propName of eventNames) {
    createEffect(() => {
      const handler = local[propName];
      if (!handler) {
        return;
      }
      const node = ref();

      const eventName = (propName as string).slice(3) as gui.WidgetEventTypes;

      node.addEventListener(eventName, handler as any);

      onCleanup(() => {
        node.removeEventListener(eventName, handler as any);
      });
    });
  }

  return rest;
}
