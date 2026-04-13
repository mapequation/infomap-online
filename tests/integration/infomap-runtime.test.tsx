import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InfomapOnline from "../../src/components/Infomap/Infomap";
import { StoreProvider, createStore } from "../../src/store";

vi.mock("@mapequation/infomap", async () => {
  const actual = await vi.importActual<typeof import("@mapequation/infomap")>(
    "@mapequation/infomap"
  );

  return {
    ...actual,
    default: class MockInfomap {
      private handlers: Record<string, ((value: any) => void)[]> = {};

      on(event: string, callback: (value: any) => void) {
        this.handlers[event] ||= [];
        this.handlers[event].push(callback);
        return this;
      }

      run() {
        this.handlers.data?.forEach((callback) =>
          callback("Running mock Infomap")
        );
        this.handlers.progress?.forEach((callback) => callback(100));
        this.handlers.finished?.forEach((callback) =>
          callback({
            clu: "*Vertices 2\n1 1\n2 1\n",
            ftree: "# ftree",
            tree: "# tree",
          })
        );
      }
    },
  };
});

vi.mock("localforage", () => ({
  default: {
    config: vi.fn(),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("Infomap runtime", () => {
  beforeEach(() => {
    vi.stubGlobal("FileReader", class {
      result = "";
      onerror: null | (() => void) = null;
      onloadend: null | (() => void) = null;
      readAsText() {
        this.result = "";
        this.onloadend?.();
      }
    });
  });

  it("runs the selected example and enables downloads", async () => {
    const user = userEvent.setup();
    const store = createStore();

    render(
      <ChakraProvider>
        <StoreProvider value={store}>
          <InfomapOnline toast={vi.fn()} />
        </StoreProvider>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Run Infomap" })
      ).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "Run Infomap" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download outputs" })
      ).toBeEnabled();
    });

    const output = screen.getByPlaceholderText(
      "Cluster output will be printed here"
    ) as HTMLTextAreaElement;

    expect(output.value.length).toBeGreaterThan(0);
  });
});
