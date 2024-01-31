<div align="center">
  <img src="assets/logo.svg" width="80" alt="Wouter — a super-tiny React router (logo by Katya Simacheva)" />
</div>

<br />

<div align="center">
  <a href="https://npmjs.org/package/wouter"><img alt="npm" src="https://img.shields.io/npm/v/wouter.svg?color=black&labelColor=888" /></a>
  <a href="https://travis-ci.org/molefrog/wouter"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/molefrog/wouter/size.yml?color=black&labelColor=888&label=2.5KB+limit" /></a>
  <a href="https://codecov.io/gh/molefrog/wouter"><img alt="Coverage" src="https://img.shields.io/codecov/c/github/molefrog/wouter.svg?color=black&labelColor=888" /></a>
  <a href="https://www.npmjs.com/package/wouter"><img alt="Coverage" src="https://img.shields.io/npm/dm/wouter.svg?color=black&labelColor=888" /></a>
  <a href="https://pr.new/molefrog/wouter"><img alt="Edit in StackBlitz IDE" src="https://img.shields.io/badge/StackBlitz-New%20PR-black?labelColor=888" /></a>
</div>

<div align="center">
  <b>wouter</b> is a tiny router for modern React and Preact apps that relies on Hooks. <br />
  A router you wanted so bad in your project!<br>
</div>

## Features

<img src="assets/wouter.svg" align="right" width="250" alt="by Katya Simacheva" />

- Zero dependency, only **2.1 KB** gzipped vs 18.7KB
  [React Router](https://github.com/ReactTraining/react-router).
- Supports both **React** and **[Preact](https://preactjs.com/)**! Read
  _["Preact support" section](#preact-support)_ for more details.
- No top-level `<Router />` component, it is **fully optional**.
- Mimics [React Router](https://github.com/ReactTraining/react-router)'s best practices by providing
  familiar **[`Route`](#route-pathpattern-)**, **[`Link`](#link-hrefpath-)**,
  **[`Switch`](#switch-)** and **[`Redirect`](#redirect-topath-)** components.
- Has hook-based API for more granular control over routing (like animations):
  **[`useLocation`](#uselocation-hook-working-with-the-history)**,
  **[`useRoute`](#useroute-the-power-of-hooks)** and
  **[`useRouter`](#userouter-accessing-the-router-object)**.

## developers :sparkling_heart: wouter

> ... I love Wouter. It’s tiny, fully embraces hooks, and has an intuitive and barebones API. I can
> accomplish everything I could with react-router with Wouter, and it just feels **more minimalist
> while not being inconvenient.**
>
> [**Matt Miller**, _An exhaustive React ecosystem for 2020_](https://medium.com/@mmiller42/an-exhaustive-react-guide-for-2020-7859f0bddc56)

Wouter provides a simple API that many developers and library authors appreciate. Some notable
projects that use wouter: **[Ultra](https://ultrajs.dev/)**,
**[React-three-fiber](https://github.com/react-spring/react-three-fiber)**,
**[Sunmao UI](https://sunmao-ui.com/)**, **[Million](https://millionjs.org/)** and many more.

## Table of Contents

- [Getting Started](#getting-started)
  - [Browser Support](#browser-support)
- [Wouter API](#wouter-api)
  - [The list of methods available](#the-list-of-methods-available)
- [Hooks API](#hooks-api)
  - [`useRoute`: the power of HOOKS!](#useroute-the-power-of-hooks)
  - [`useLocation` hook: working with the history](#uselocation-hook-working-with-the-history)
    - [Additional navigation parameters](#additional-navigation-parameters)
    - [Customizing the location hook](#customizing-the-location-hook)
  - [`useParams` hook: working with parameters](#useparams-hook-working-with-parameters)
  - [`useRouter`: accessing the router object](#userouter-accessing-the-router-object)
- [Component API](#component-api)
  - [`<Route path={pattern} />`](#route-pathpattern-)
  - [`<Link href={path} />`](#link-hrefpath-)
  - [`<Switch />`](#switch-)
  - [`<Redirect to={path} />`](#redirect-topath-)
  - [`<Router hook={hook} matcher={matchFn} base={basepath} />`](#router-hookhook-matchermatchfn-basebasepath-)
    - [Matching Dynamic Segments](#matching-dynamic-segments)
    - [Using a `path-to-regexp`-based matcher](#using-a-path-to-regexp-based-matcher)
- [FAQ and Code Recipes](#faq-and-code-recipes)
  - [I deploy my app to the subfolder. Can I specify a base path?](#i-deploy-my-app-to-the-subfolder-can-i-specify-a-base-path)
  - [How do I make a default route?](#how-do-i-make-a-default-route)
  - [How do I make a link active for the current route?](#how-do-i-make-a-link-active-for-the-current-route)
  - [Are strict routes supported?](#are-strict-routes-supported)
  - [Are relative routes and links supported?](#are-relative-routes-and-links-supported)
  - [Is it possible to match an array of paths?](#is-it-possible-to-match-an-array-of-paths)
  - [Can I initiate navigation from outside a component?](#can-i-initiate-navigation-from-outside-a-component)
  - [Can I use _wouter_ in my TypeScript project?](#can-i-use-wouter-in-my-typescript-project)
  - [Preact support?](#preact-support)
  - [Server-side Rendering support (SSR)?](#server-side-rendering-support-ssr)
  - [1KB is too much, I can't afford it!](#1kb-is-too-much-i-cant-afford-it)
- [Acknowledgements](#acknowledgements)

## Getting Started

Check out this simple demo app below. It doesn't cover hooks and other features such as nested routing, but it's a good starting point for those who are migrating from React Router.

```js
import { Link, Route, Switch } from "wouter";

const App = () => (
  <>
    <Link href="/users/1">Profile</Link>

    <Route path="/about">About Us</Route>

    {/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
    <Switch>
      <Route path="/inbox" component={InboxPage} />

      <Route path="/users/:name">
        {(params) => <>Hello, {params.name}!</>}
      </Route>

      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </>
);
```

### Browser Support

This library is designed for **ES2019+** compatibility. If you need to support older browsers, make sure that you transpile `node_modules`. Additionally, the minimum supported TypeScript version is 4.1 in order to support route parameter inference.

## Wouter API

Wouter comes with three kinds of APIs: low-level **standalone location hooks**, hooks for **routing and pattern matching** and more traditional **component-based
API** similar to React Router's one.

You are free to choose whatever works for you: use location hooks when you want to keep your app as small as
possible and don't need pattern matching; use routing hooks when you want to build custom routing components; or if you're building a traditional app
with pages and navigation — components might come in handy.

Check out also [FAQ and Code Recipes](#faq-and-code-recipes) for more advanced things like active
links, default routes, server-side rendering etc.

### The list of methods available

**Location Hooks**

These can be used separately from the main module and have an interface similar to `useState`. These hooks don't support nesting, base path, route matching.

- **[`import { useBrowserLocation } from "wouter/use-browser-location"`](https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-browser-location.js)** —
  allows to manipulate current location in the browser's address bar, a tiny wrapper around the History API.

- **[`import { useHashLocation } from "wouter/use-hash-location"`](https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-hash-location.js)** — similarly, gets location from the hash part of the address, i.e. the string after a `#`.

- **[`import { memoryLocation } from "wouter/memory-location"`](#uselocation-hook-working-with-the-history)** — an in-memory location hook with history support, external navigation and immutable mode for testing. **Note** the module name because it is a high-order hook.

**Routing Hooks**

Import from `wouter` module.

- **[`useLocation`](#uselocation-hook-working-with-the-history)** — allows to manipulate current
  router's location, by default subscribes to browser location. **Note:** this isn't the same as `useBrowserLocation`, read below.
- **[`useRoute`](#useroute-the-power-of-hooks)** — shows whether or not current page matches the
  pattern provided.

- **[`useRouter`](#userouter-accessing-the-router-object)** — returns a global router object that
  holds the configuration. Only use it if you want to customize the routing.

**Components**

Import from `wouter` module.

- **[`<Route />`](#route-pathpattern-)** — conditionally renders a component based on a pattern.
- **[`<Link />`](#link-hrefpath-)** — wraps `<a>`, allows to perfom a navigation.
- **[`<Switch />`](#switch-)** — exclusive routing, only renders the first matched route.
- **[`<Redirect />`](#redirect-topath-)** — when rendered, performs an immediate navigation.
- **[`<Router />`](#router-hookhook-matchermatchfn-basebasepath-)** — an optional top-level
  component for advanced routing configuration.

## Hooks API

### `useRoute`: route patterns and parameters

Checks if current location matches the pattern provided and returns an object with parameters. This is powered by a wounderful [`regexparam`](https://github.com/lukeed/regexparam) library, so all its pattern syntax is fully supported.

You can use `useRoute` to perform manual routing or implement custom logic such as route transitions etc.

```js
import { useRoute } from "wouter";

const Users = () => {
  // `match` is a boolean
  const [match, params] = useRoute("/users/:name");

  if (match) {
    return <>Hello, {params.name}!</>;
  } else {
    return null;
  }
};
```

### `useLocation` hook: working with the history

The low-level navigation in wouter is powered by the `useLocation` hook, which is basically a
wrapper around the native browser location object. The hook rerenders when the location changes and
you can also perform a navigation with it, this is very similar to how you work with values returned
from the `useState` hook:

```js
import { useLocation } from "wouter";

const CurrentLocation = () => {
  const [location, setLocation] = useLocation();

  return (
    <div>
      {`The current page is: ${location}`}
      <a onClick={() => setLocation("/somewhere")}>Click to update</a>
    </div>
  );
};
```

All the components including the `useRoute` rely on `useLocation` hook, so normally you only need
the hook to perform the navigation using a second value `setLocation`. You can check out the source
code of the [`Redirect` component](https://github.com/molefrog/wouter/blob/master/index.js#L142) as
a reference.

#### Additional navigation parameters

The setter method of `useLocation` can also accept an optional object with parameters to control how
the navigation update will happen.

It is not mandatory for custom location hooks to support this, however the built-in
`pushState`-powered `useLocation` hook accepts `replace` flag to tell the hook to modify the current
history entry instead of adding a new one. It is the same as calling `replaceState`. Example:

```jsx
const [location, navigate] = useLocation();

navigate("/jobs"); // `pushState` is used
navigate("/home", { replace: true }); // `replaceState` is used
```

#### Customizing the location hook

By default, **wouter** uses `useLocation` hook that reacts to `pushState` and `replaceState`
navigation and observes the current pathname including the leading slash e.g. **`/app/users`**.

If you do need a custom history observer, for example, for hash-based routing, you can
[implement your own hook](https://github.com/molefrog/wouter/blob/master/use-location.js) and
customize it in a `<Router />` component.

As an exercise, let's implement a simple location hook that listens to hash changes:

```js
import { useState, useEffect } from "react";
import { Router, Route } from "wouter";
import { useLocationProperty, navigate } from "wouter/use-location";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to) => navigate("#" + to);

const useHashLocation = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

const App = () => (
  <Router hook={useHashLocation}>
    <Route path="/about" component={About} />
    ...
  </Router>
);
```

**[▶ Demo Sandbox: hash-based routing](https://codesandbox.io/s/wouter-hash-based-hook-5fp9g)**

### `useRouter`: accessing the router object

If you're building an advanced integration, for example custom location hook, you might want to get
access to the global router object. The router is a simple object that holds current matcher
function and a custom location hook function.

Normally, router is constructed internally on demand, but it can also be customized via a top-level
`Router` component (see [the section above](#uselocation-hook-working-with-the-history)). The
`useRouter` hook simply returns a current router object:

```js
import { useRouter } from "wouter";
import useLocation from "wouter/use-location";

const Custom = () => {
  const router = useRouter();

  // router.hook is useLocation by default

  // you can also use router as a mediator object
  // and store arbitrary data on it:
  router.lastTransition = { path: "..." };
};
```

## Component API

### `<Route path={pattern} />`

`Route` represents a piece of the app that is rendered conditionally based on a pattern. Pattern is
a string, which may contain special characters to describe dynamic segments, see
[**Matching Dynamic Segments** section](#matching-dynamic-segments) below for details.

The library provides multiple ways to declare a route's body:

```js
import { Route } from "wouter";

// simple form
<Route path="/home"><Home /></Route>

// render-prop style
<Route path="/users/:id">
  {params => <UserPage id={params.id} />}
</Route>

// the `params` prop will be passed down to <Orders />
<Route path="/orders/:status" component={Orders} />
```

### `<Link href={path} />`

Link component renders an `<a />` element that, when clicked, performs a navigation. You can
customize the link appearance by providing your own component or a link element as `children`:

```js
import { Link } from "wouter"

// All of these will produce the same html:
// <a href="/foo" class="active">Hello!</a>

// lazy form: `a` element is constructed around children
<Link href="/foo" className="active">Hello!</Link>

// when using your own component or jsx the `href` prop
// will be passed down to an element
<Link href="/foo"><a className="active">Hello!</a></Link>
<Link href="/foo"><A>Hello!</A></Link>
```

If you wrap a custom component with `Link`, wouter won't install event listeners so make sure the
component handles `onClick` and `href` props properly:

```jsx
import { Link } from "wouter";

const MyButton = (props) => {
  // it is recommended to use <a>'s when possible (they play nicely with SSR and are SEO-friendly),
  // but wouter's Links should work with almost anything, as long as the `onClick` is handled.
  return (
    <div title={props.href}>
      <button onClick={props.onClick}>Home</button>
    </div>
  );
};

// in your app
<Link href="/home">
  <MyButton />
</Link>;
```

### `<Switch />`

There are cases when you want to have an exclusive routing: to make sure that only one route is
rendered at the time, even if the routes have patterns that overlap. That's what `Switch` does: it
only renders **the first matching route**.

```js
import { Route, Switch } from "wouter";

<Switch>
  <Route path="/orders/all" component={AllOrders} />
  <Route path="/orders/:status" component={Orders} />

  {/* 
     in wouter, any Route with empty path is considered always active. 
     This can be used to achieve "default" route behaviour within Switch. 
     Note: the order matters! See examples below.
  */}
  <Route>This is rendered when nothing above has matched</Route>
</Switch>;
```

Check out [**FAQ and Code Recipes** section](#how-do-i-make-a-default-route) for more advanced use
of `Switch`.

### `<Redirect to={path} />`

When mounted performs a redirect to a `path` provided. Uses `useLocation` hook internally to trigger
the navigation inside of a `useEffect` block.

If you need more advanced logic for navigation, for example, to trigger the redirect inside of an
event handler, consider using
[`useLocation` hook instead](#uselocation-hook-working-with-the-history):

```js
import { useLocation } from "wouter";

const [location, setLocation] = useLocation();

fetchOrders().then((orders) => {
  setOrders(orders);
  setLocation("/app/orders");
});
```

### `<Router hook={hook} matcher={matchFn} base={basepath} />`

Unlike _React Router_, routes in wouter **don't have to be wrapped in a top-level component**. An
internal router object will be constructed on demand, so you can start writing your app without
polluting it with a cascade of top-level providers. There are cases however, when the routing
behaviour needs to be customized.

These cases include hash-based routing, basepath support, custom matcher function etc.

A router is a simple object that holds the routing configuration options. You can always obtain this
object using a [`useRouter` hook](#userouter-accessing-the-router-object). The list of currently
available options:

- **`hook: () => [location: string, setLocation: fn]`** — is a React Hook function that subscribes
  to location changes. It returns a pair of current `location` string e.g. `/app/users` and a
  `setLocation` function for navigation. You can use this hook from any component of your app by
  calling [`useLocation()` hook](#uselocation-hook-working-with-the-history).

Read more → [Customizing the location hook](#customizing-the-location-hook).

- **`matcher: (pattern: string, path: string) => [match: boolean, params: object]`** — a custom
  function used for matching the current location against the user-defined patterns like
  `/app/users/:id`. Should return a match result and an hash of extracted parameters. It should
  return `[false, null]` when there is no match.

- **`base: string`** — an optional setting that allows to specify a base path, such as `/app`. All
  application routes will be relative to that path. Prefixing a route with `~` will make it
  absolute, bypassing the base path.

#### Matching Dynamic Segments

Just like in React Router, you can make dynamic matches either with `Route` component or `useRoute`
hook. `useRoute` returns a second parameter which is a hash of all dynamic segments matched.
Similarily, the `Route` component passes these parameters down to its children via a function prop.

```js
import { useRoute } from "wouter";

// /users/alex => [true, { name: "alex "}]
// /anything   => [false, null]
const [match, params] = useRoute("/users/:name");

// or with Route component
<Route path="/users/:name">
  {(params) => {
    /* { name: "alex" } */
  }}
</Route>;
```

**wouter** implements a limited subset of
[`path-to-regexp` package](https://github.com/pillarjs/path-to-regexp) used by React Router or
Express, and it supports the following patterns:

- Named dynamic segments: `/users/:foo`.
- Dynamic segments with modifiers: `/foo/:bar*`, `/foo/baz?` or `/foo/bar+`.

The library was designed to be as small as possible, so most of the additional matching features
were left out (see [this issue](https://github.com/molefrog/wouter/issues/1) for more info).

#### Using a `path-to-regexp`-based matcher

The `<Router />` component accepts an optional prop called `matcher` which allows to customize how a
path is matched against the pattern. By default, a built-in matcher function is used, which
implements basic functionality such as wildcard parameters (see above).

However, if you do need to have more advanced functionality, you can specify your own matcher which
should look like:

```js
/*
 * accepts a pattern and a path as strings, should return a pair of values:
 * [success, params]
 */

// returns [false, null] when there is no match
matcher("/users", "/");

// [true, { id: "101" }]
matcher("/users/:id", "/users/101");
```

Most of the packages for parsing route patterns work with regular expressions (see
[`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) or a super-tiny alternative
[`regexparam`](https://github.com/lukeed/regexparam)), so to make it easier for you wouter provides
[a factory function](https://github.com/molefrog/wouter/blob/master/matcher.js#L2) for transforming
a regexp-based pattern builder into a matcher. It also makes sure that the expensive transform
operation isn't called on each render by utilizing a simple cache.

```js
import { Router } from "wouter";

import makeCachedMatcher from "wouter/matcher";

/*
 * This function specifies how strings like /app/:users/:items* are
 * transformed into regular expressions.
 *
 * Note: it is just a wrapper around `pathToRegexp`, which uses a
 * slightly different convention of returning the array of keys.
 *
 * @param {string} path — a path like "/:foo/:bar"
 * @return {{ keys: [], regexp: RegExp }}
 */
const convertPathToRegexp = (path) => {
  let keys = [];

  // we use original pathToRegexp package here with keys
  const regexp = pathToRegexp(path, keys, { strict: true });
  return { keys, regexp };
};

const customMatcher = makeCachedMatcher(convertPathToRegexp);

function App() {
  return (
    <Router matcher={customMatcher}>
      {/* at the moment wouter doesn't support inline regexps, but path-to-regexp does! */}
      <Route path="/(resumes|cover-letters)/:id" component={Dashboard} />
    </Router>
  );
}
```

**[▶ Demo Sandbox](https://codesandbox.io/s/wouter-path-to-regexp-matcher-fhg2h)**

## FAQ and Code Recipes

### I deploy my app to the subfolder. Can I specify a base path?

You can! Wrap your app with `<Router base="/app" />` component and that should do the trick:

```js
import { Router, Route, Link } from "wouter";

const App = () => (
  <Router base="/app">
    {/* the link's href attribute will be "/app/users" */}
    <Link href="/users">Users</Link>

    <Route path="/users">The current path is /app/users!</Route>
  </Router>
);
```

**Note:** _the base path feature is only supported by the default browser History API location hook
(the one exported from `"wouter/use-location"`). If you're implementing your own location hook,
you'll need to add base path support yourself._

### How do I make a default route?

One of the common patterns in application routing is having a default route that will be shown as a
fallback, in case no other route matches (for example, if you need to render 404 message). In
**wouter** this can easily be done as a combination of `<Switch />` component and a default route:

```js
import { Switch, Route } from "wouter";

<Switch>
  <Route path="/about">...</Route>
  <Route>404, Not Found!</Route>
</Switch>;
```

_Note:_ the order of switch children matters, default route should always come last. If you want to
have access to the matched segment of the path you can use `:param*`:

```js
<Switch>
  <Route path="/users">...</Route>

  {/* will match anything that starts with /users/, e.g. /users/foo, /users/1/edit etc. */}
  <Route path="/users/:rest*">...</Route>

  {/* will match everything else */}
  <Route path="/:rest*">
    {(params) => `404, Sorry the page ${params.rest} does not exist!`}
  </Route>
</Switch>
```

**[▶ Demo Sandbox](https://codesandbox.io/s/oqk302k2y)**

### How do I make a link active for the current route?

There are cases when you need to highlight an active link, for example, in the navigation bar. While
this functionality isn't provided out-of-the-box, you can easily write your own `<Link />` wrapper
and detect if the path is active by using the `useRoute` hook. The `useRoute(pattern)` hook returns
a pair of `[match, params]`, where `match` is a boolean value that tells if the pattern matches
current location:

```js
const [isActive] = useRoute(props.href);

return (
  <Link {...props}>
    <a className={isActive ? "active" : ""}>{props.children}</a>
  </Link>
);
```

**[▶ Demo Sandbox](https://codesandbox.io/s/5zjpj19yz4)**

### Are strict routes supported?

If a trailing slash is important for your app's routing, you could specify a custom matcher that
implements the `strict` option support.

```js
import makeMatcher from "wouter/matcher";
import { pathToRegexp } from "path-to-regexp";

const customMatcher = makeMatcher((path) => {
  let keys = [];
  const regexp = pathToRegexp(path, keys, { strict: true });
  return { keys, regexp };
});

const App = () => (
  <Router matcher={customMatcher}>
    <Route path="/foo">...</Route>
    <Route path="/foo/">...</Route>
  </Router>
);
```

**[▶ Demo Sandbox](https://codesandbox.io/s/wouter-path-to-regexp-strict-rq72c)**

### Are relative routes and links supported?

Unlike [React Router](https://reach.tech/router/nesting), there is no first-class support for route
nesting. However, thanks to the
[base path support](#i-deploy-my-app-to-the-subfolder-can-i-specify-a-base-path), you can easily
implement a nesting router yourself!

```js
const NestedRoutes = (props) => {
  const router = useRouter();
  const [parentLocation] = useLocation();

  const nestedBase = `${router.base}${props.base}`;

  // don't render anything outside of the scope
  if (!parentLocation.startsWith(nestedBase)) return null;

  // we need key to make sure the router will remount when base changed
  return (
    <Router base={nestedBase} key={nestedBase}>
      {props.children}
    </Router>
  );
};

const App = () => (
  <Router base="/app">
    <NestedRoutes base="/dashboard">
      {/* the real url is /app/dashboard/users */}
      <Link to="/users" />
      <Route path="/users" />
    </NestedRoutes>
  </Router>
);
```

**[▶ Demo Sandbox](https://codesandbox.io/s/wouter-demo-nested-routes-ffd5h)**

### Is it possible to match an array of paths?

While wouter doesn't currently support multipath routes, you can achieve that in your app by
specifying a custom [`matcher` function](#router-hookhook-matchermatchfn-basebasepath-):

```js
import makeMatcher from "wouter/matcher";

const defaultMatcher = makeMatcher();

/*
 * A custom routing matcher function that supports multipath routes
 */
const multipathMatcher = (patterns, path) => {
  for (let pattern of [patterns].flat()) {
    const [match, params] = defaultMatcher(pattern, path);
    if (match) return [match, params];
  }

  return [false, null];
};

const App = () => (
  <Router matcher={multipathMatcher}>
    <Route path={["/app", "/home"]}>...</Route>
  </Router>
);
```

**[▶ Demo Sandbox](https://codesandbox.io/s/wouter-demo-multipath-routes-42bi3)**

### Can I use _wouter_ in my TypeScript project?

Yes! Although the project isn't written in TypeScript, the type definition files are bundled with
the package.

### Preact support?

Preact exports are available through a separate package named `wouter-preact` (or within the
`wouter/preact` namespace, however this method isn't recommended as it requires React as a peer
dependency):

```diff
- import { useRoute, Route, Switch } from "wouter";
+ import { useRoute, Route, Switch } from "wouter-preact";
```

You might need to ensure you have the latest version of
[Preact X](https://github.com/preactjs/preact/releases/tag/10.0.0-alpha.0) with support for hooks.

**[▶ Demo Sandbox](https://codesandbox.io/s/wouter-preact-0lr3n)**

### Server-side Rendering support (SSR)?

In order to render your app on the server, you'll need to wrap your app with top-level Router and
specify `ssrPath` prop (usually, derived from current request).

```js
import { renderToString } from "react-dom/server";
import { Router } from "wouter";

const handleRequest = (req, res) => {
  // top-level Router is mandatory in SSR mode
  const prerendered = renderToString(
    <Router ssrPath={req.path}>
      <App />
    </Router>
  );

  // respond with prerendered html
};
```

On the client, the static markup must be hydrated in order for your app to become interactive. Note
that to avoid having hydration warnings, the JSX rendered on the client must match the one used by
the server, so the `Router` component must be present.

```js
import { hydrateRoot } from "react-dom/client";

const root = hydrateRoot(
  domNode,
  // during hydration `ssrPath` is set to `location.pathname`
  <Router>
    <App />
  </Router>
);
```

### 1KB is too much, I can't afford it!

We've got some great news for you! If you're a minimalist bundle-size nomad and you need a damn
simple routing in your app, you can just use the
[`useLocation` hook](#uselocation-hook-working-with-the-history) which is only **400 bytes gzipped**
and manually match the current location with it:

```js
import useLocation from "wouter/use-location";

const UsersRoute = () => {
  const [location] = useLocation();

  if (location !== "/users") return null;

  // render the route
};
```

Wouter's motto is **"Minimalist-friendly"**.

## Acknowledgements

Wouter illustrations and logos were made by [Katya Simacheva](https://simachevakatya.com/) and
[Katya Vakulenko](https://katyavakulenko.com/).
