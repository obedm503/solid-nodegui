import type * as gui from "@nodegui/nodegui";
import { camelCase, upperFirst } from "lodash-es";

type WidgetConfig<Widget extends gui.QWidget> = {
  widget: new () => Widget;
  setProperty(
    node: Widget,
    name: string,
    value: unknown,
    prev?: unknown
  ): boolean | void;
};
const registry = new Map<string, WidgetConfig<any> & { tag: string }>();

export class WidgetRegistry {
  static registerWidget<Widget extends gui.QWidget>(
    tag: string,
    config: WidgetConfig<Widget>
  ): void {
    const name = upperFirst(camelCase(tag));
    if (registry.has(name)) {
      throw new Error(`Widget ${name} is already registered for tag ${tag}`);
    }

    registry.set(name, {
      ...config,
      tag,
    });
  }

  static get<Widget extends gui.QWidget>(node: Widget): WidgetConfig<Widget>;
  static get<Widget extends gui.QWidget>(node: string): WidgetConfig<Widget>;
  static get<Widget extends gui.QWidget>(
    node: Widget | string
  ): WidgetConfig<Widget> {
    if (typeof node === "string") {
      for (const [_name, config] of registry.entries()) {
        if (config.tag === node) {
          return config as WidgetConfig<Widget>;
        }
      }

      throw new Error(`Unknown widget ${node}`);
    }

    const name = node.constructor.name;
    const config = registry.get(name) as WidgetConfig<Widget>;

    if (!config) {
      throw new Error(`Unknown widget ${name}`);
    }

    return config;
  }
}
