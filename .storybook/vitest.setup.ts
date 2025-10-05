import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";

// Apply Storybook's preview configuration to Vitest-powered story tests.
// https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([projectAnnotations]);
