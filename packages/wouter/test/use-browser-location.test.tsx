import { useEffect } from "react";
import { it, expect, describe, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useBrowserLocation,
  navigate,
  useSearch,
  useHistoryState,
} from "wouter/use-browser-location";

it("returns a pair [value, update]", () => {
  const { result, unmount } = renderHook(() => useBrowserLocation());
  const [value, update] = result.current;

  expect(typeof value).toBe("string");
  expect(typeof update).toBe("function");
  unmount();
});

describe("`value` first argument", () => {
  beforeEach(() => history.replaceState(null, "", "/"));

  it("reflects the current pathname", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    expect(result.current[0]).toBe("/");
    unmount();
  });

  it("reacts to `pushState` / `replaceState`", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());

    act(() => history.pushState(null, "", "/foo"));
    expect(result.current[0]).toBe("/foo");

    act(() => history.replaceState(null, "", "/bar"));
    expect(result.current[0]).toBe("/bar");
    unmount();
  });

  it("supports history.back() navigation", async () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());

    act(() => history.pushState(null, "", "/foo"));
    await waitFor(() => expect(result.current[0]).toBe("/foo"));

    act(() => {
      history.back();
    });

    await waitFor(() => expect(result.current[0]).toBe("/"));
    unmount();
  });

  it("returns a pathname without a basepath", () => {
    const { result, unmount } = renderHook(() =>
      useBrowserLocation({ base: "/app" })
    );

    act(() => history.pushState(null, "", "/app/dashboard"));
    expect(result.current[0]).toBe("/dashboard");
    unmount();
  });

  it("returns `/` when URL contains only a basepath", () => {
    const { result, unmount } = renderHook(() =>
      useBrowserLocation({ base: "/app" })
    );

    act(() => history.pushState(null, "", "/app"));
    expect(result.current[0]).toBe("/");
    unmount();
  });

  it("basepath should be case-insensitive", () => {
    const { result, unmount } = renderHook(() =>
      useBrowserLocation({ base: "/MyApp" })
    );

    act(() => history.pushState(null, "", "/myAPP/users/JohnDoe"));
    expect(result.current[0]).toBe("/users/JohnDoe");
    unmount();
  });

  it("returns an absolute path in case of unmatched base path", () => {
    const { result, unmount } = renderHook(() =>
      useBrowserLocation({ base: "/MyApp" })
    );

    act(() => history.pushState(null, "", "/MyOtherApp/users/JohnDoe"));
    expect(result.current[0]).toBe("~/MyOtherApp/users/JohnDoe");
    unmount();
  });

  it("supports search url", () => {
    // count how many times each hook is rendered
    const locationRenders = { current: 0 };
    const searchRenders = { current: 0 };

    // count number of rerenders for each hook
    const { result, unmount } = renderHook(() => {
      useEffect(() => {
        locationRenders.current += 1;
      });
      return useBrowserLocation();
    });

    const { result: searchResult, unmount: searchUnmount } = renderHook(() => {
      useEffect(() => {
        searchRenders.current += 1;
      });
      return useSearch();
    });

    expect(result.current[0]).toBe("/");
    expect(locationRenders.current).toBe(1);
    expect(searchResult.current).toBe("");
    expect(searchRenders.current).toBe(1);

    act(() => navigate("/foo"));

    expect(result.current[0]).toBe("/foo");
    expect(locationRenders.current).toBe(2);

    act(() => navigate("/foo"));

    expect(result.current[0]).toBe("/foo");
    expect(locationRenders.current).toBe(2); // no re-render

    act(() => navigate("/foo?hello=world"));

    expect(result.current[0]).toBe("/foo");
    expect(locationRenders.current).toBe(2);
    expect(searchResult.current).toBe("?hello=world");
    expect(searchRenders.current).toBe(2);

    act(() => navigate("/foo?goodbye=world"));

    expect(result.current[0]).toBe("/foo");
    expect(locationRenders.current).toBe(2);
    expect(searchResult.current).toBe("?goodbye=world");
    expect(searchRenders.current).toBe(3);

    unmount();
    searchUnmount();
  });

  it("supports history state", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    const { result: state, unmount: unmountState } = renderHook(() =>
      useHistoryState()
    );

    const navigate = result.current[1];

    act(() => navigate("/path", { state: { hello: "world" } }));

    expect(state.current).toStrictEqual({ hello: "world" });

    unmount();
    unmountState();
  });
});

describe("`update` second parameter", () => {
  it("rerenders the component", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    const update = result.current[1];

    act(() => update("/about"));
    expect(result.current[0]).toBe("/about");
    unmount();
  });

  it("changes the current location", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    const update = result.current[1];

    act(() => update("/about"));
    expect(location.pathname).toBe("/about");
    unmount();
  });

  it("saves a new entry in the History object", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    const update = result.current[1];

    const histBefore = history.length;
    act(() => update("/about"));

    expect(history.length).toBe(histBefore + 1);
    unmount();
  });

  it("replaces last entry with a new entry in the History object", () => {
    const { result, unmount } = renderHook(() => useBrowserLocation());
    const update = result.current[1];

    const histBefore = history.length;
    act(() => update("/foo", { replace: true }));

    expect(history.length).toBe(histBefore);
    expect(location.pathname).toBe("/foo");
    unmount();
  });

  it("stays the same reference between re-renders (function ref)", () => {
    const { result, rerender, unmount } = renderHook(() =>
      useBrowserLocation()
    );

    const updateWas = result.current[1];
    rerender();
    const updateNow = result.current[1];

    expect(updateWas).toBe(updateNow);
    unmount();
  });

  it("supports a basepath", () => {
    const { result, unmount } = renderHook(() =>
      useBrowserLocation({ base: "/app" })
    );
    const update = result.current[1];

    act(() => update("/dashboard"));
    expect(location.pathname).toBe("/app/dashboard");
    unmount();
  });
});