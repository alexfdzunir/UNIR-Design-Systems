/**
 * Minimal stand-in for `@storybook/angular`, mapped through `paths` in tsconfig.app.json.
 * It lets the explorer import the real stories as data without pulling the Storybook runtime.
 */
export interface ModuleMetadata {
  imports?: unknown[];
  providers?: unknown[];
  declarations?: unknown[];
}

export interface StoryDecorator {
  (storyFn: () => unknown): unknown;
  moduleMetadata?: ModuleMetadata;
}

export function moduleMetadata(metadata: ModuleMetadata): StoryDecorator {
  return Object.assign((storyFn: () => unknown) => storyFn(), { moduleMetadata: metadata });
}

export interface ArgType {
  control?: string | { type: string; min?: number; max?: number };
  options?: unknown[];
  description?: string;
  action?: string;
  table?: { category?: string; defaultValue?: { summary?: string } };
}

export interface StoryRender {
  props?: Record<string, unknown>;
  template?: string;
}

export interface Meta {
  title: string;
  decorators?: StoryDecorator[];
  parameters?: Record<string, any>;
  args?: Record<string, any>;
  argTypes?: Record<string, ArgType>;
  render: (args: Record<string, any>) => StoryRender;
}

export interface StoryObj {
  /** Display name of the story (its export name by default). */
  name?: string;
  args?: Record<string, any>;
}
