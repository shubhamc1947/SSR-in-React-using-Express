import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";  // Import StaticRouter for SSR
import App from "../src/App";

const PORT = 8000;
const app = express();

app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }

    const context = {}; // Used to track redirects or status codes
    
    const appMarkup = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>  {/* Use StaticRouter for SSR */}
        <App />
      </StaticRouter>
    );

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${appMarkup}</div>`
      )
    );
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});
