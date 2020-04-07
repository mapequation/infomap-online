import * as Sentry from "@sentry/browser";
import React from "react";
import { hydrate, render } from "react-dom";
import App from "./App";
import "./index.css";
import "katex/dist/katex.min.css";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn:
    process.env.NODE_ENV === "production"
      ? "https://2527f14880aa45c8acbac7a5acffe71e@sentry.io/1763436"
      : undefined,
  beforeSend(event) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({
        eventId: event.event_id,
        subtitle2:
          "If you'd like to help, tell us what happened below. Your network data stay on your computer.",
      });
    }
    return event;
  },
});

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
