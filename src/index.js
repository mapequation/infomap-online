import "core-js/features/object/values";
import * as Sentry from "@sentry/browser";
import "mobx-react-lite/batchingForReactDom";
import React from "react";
import { hydrate, render } from "react-dom";
import App from "./App";
import "./index.css";


Sentry.init({
  dsn:
    process.env.NODE_ENV === "production"
      ? "https://2527f14880aa45c8acbac7a5acffe71e@sentry.io/1763436"
      : undefined,
  beforeSend(event, hint) {
    const error = hint.originalException;
    // Dont show report dialog for React NotFoundErrors:
    // NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
    const hasNotFoundError = error && error.message && error.message.match(/NotFoundError/i);

    // Check if it is an exception, and if so, show the report dialog
    if (event.exception && !hasNotFoundError) {
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
