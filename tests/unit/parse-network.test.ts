import { describe, expect, it } from "vitest";
import parseNetwork from "../../src/components/Network/parseNetwork";

describe("parseNetwork", () => {
  it("parses nodes, links, and max flow values from flow output", () => {
    const result = parseNetwork(`
*Vertices 2
1 "alpha" 0.4
2 "beta" 0.6
*Links
1 2 0.2
`);

    expect(result.nodes).toHaveLength(2);
    expect(result.links).toHaveLength(1);
    expect(result.maxNodeFlow).toBe(0.6);
    expect(result.maxLinkFlow).toBe(0.2);
  });
});
