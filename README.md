# @angannat/localize-js

Simple package to add localization to your javascript project.

---

[![Unit tests](https://github.com/antoine-gannat/localize-js/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/antoine-gannat/localize-js/actions/workflows/unit-tests.yml)
![bundle size](https://img.badgesize.io/https:/unpkg.com/@angannat/localize-js/lib/localize.js?compression=gzip&label=Bundle%20size)

## List of features

- String translation in any language
- Lazy loading
- Lightweight and fast

### Installation

With yarn

```shell
yarn add @angannat/localize-js
```

With npm

```shell
npm i @angannat/localize-js
```

## Usage with React

### Basic example

```jsx
import { Localize } from "@angannat/localize-js";

const localization = new Localize({
  // Use the browser locale
  locale: navigator.language,
  // or insert directly strings here.
  stringMap: {
    "en-us": {
      title: "This is a cool title !",
      timeNow: "Current time is {0}.",
    },
    "fr-fr": {
      title: "Ceci est un super titre !",
      timeNow: "Il est {0}.",
    },
  },
});

function App() {
  const [loaded, setLoaded] = React.useState(false);

  // On mount init the library
  React.useEffect(() => {
    localization.init().finally(() => setLoaded(true));
  }, []);
  if (!loaded) {
    return null;
  }
  return (
    <div>
      {/* Get the localized title. */}
      <h1>{localization.localize("title")}</h1>
      {/* Use placeholders to replace part of the localized string. */}
      <p>{localization.localize("timeNow", [Date.now()])}</p>
    </div>
  );
}
```

### Advanced example with asynchronous loading

```tsx
import React from "react";
import { Localize } from "@angannat/localize-js";

/**
 * Fetch strings from some cdn based on the locale.
 */
const fetchStringsFromCdn = async (locale: string) => {
  const strings = await fetch(`https://some-cdn.test/strings/${locale}.json`);
  return await strings.json();
};

const localization = new Localize({
  // Use the browser locale
  locale: navigator.language,
  // Use the stringsResolver to asynchronously fetch strings
  // Here we are fetching from a cdn
  stringsResolver: fetchStringsFromCdn,
});

export default function App() {
  const [loaded, setLoaded] = React.useState(false);

  // On mount init the library
  React.useEffect(() => {
    localization.init().finally(() => setLoaded(true));
  }, []);
  if (!loaded) {
    return null;
  }
  return (
    <div>
      {/* Get the localized title. */}
      <h1>{localization.localize("title")}</h1>
      {/* Use placeholders to replace part of the localized string. */}
      <p>{localization.localize("timeNow", [Date.now()])}</p>
    </div>
  );
}
```

### Contributing

Feel free to contribute, just make a PR or create an issue. I'll take a look as soon as I can.

### Authors or Acknowledgments

- Antoine GANNAT

### License

This project is licensed under the MIT License
