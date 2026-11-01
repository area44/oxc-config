import { area44Options } from "./area44/index";
import { upstreamOxfmt } from "./upstream/index";

export const composeOxfmtConfig = (): Record<string, unknown> => ({
  $schema: "./node_modules/oxfmt/configuration_schema.json",
  ...upstreamOxfmt,
  ...area44Options,
});
