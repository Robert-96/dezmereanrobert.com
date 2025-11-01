---
title: "How to Create PDFs from Web Pages with Puppeteer"
subtitle: ""
description: ""
date: 2025-10-29T23:55:03Z
tags: [ "node", "snippet", "puppeteer" ]
keywords: [ "node", "snippet", "puppeteer", "pdf", "web-scraping" ]
draft: false
featured: false
---

Generating PDFs from web pages can be incredibly useful for archiving content, creating reports, or sharing information in a portable format.

Puppeteer, a Node.js library that provides a high-level API to control Chrome or Chromium over the DevTools Protocol, makes this task straightforward.

<!--more-->

## TL;DR

Here's a simple example of how to use Puppeteer to generate a PDF from a specified URL:

```js
const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://archive.org/');

    // Generate PDF from the page
    const outputPath = './page.pdf';
    await page.pdf({
        path: outputPath,
    });

    console.log("PDF generated successfully at: " + outputPath);

    await browser.close();
})();
```

Here you can find all the options available for generating PDFs with Puppeteer: <https://pptr.dev/api/puppeteer.pdfoptions>

## Setup

To get started, you'll need to have Node.js installed on your machine. Then, you can create a new project and install Puppeteer:

```bash
mkdir pdf-generator
cd pdf-generator
npm init -y
npm install puppeteer
```

To run the script, save it to a file named `generate-pdf.js` and execute it using Node.js:

```bash
node generate-pdf.js
```

## Generate PDF rom HTML Content

If you want to generate a PDF from raw HTML content instead of a URL, you can use the `page.setContent()` method:

```js
const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Sample PDF</title>
      </head>
      <body>
          <h1>Hello, PDF!</h1>
          <p>This PDF was generated from HTML content.</p>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);

    // Generate PDF from the HTML content
    const outputPath = './page.pdf';
    await page.pdf({
        path: outputPath,
    });

    console.log("PDF generated successfully at: " + outputPath);

    await browser.close();
})();
```

## Additional Options

You can customize the PDF generation by providing additional options to the `page.pdf()` method. Here are some commonly used options:

### Include/Exclude Background

```js
await page.pdf({
  path: outputPath,
  printBackground: true,
});
```

### Set Landscape Orientation

```js
await page.pdf({
  path: outputPath,
  landscape: true,
});
```

### Set Margins

```js
await page.pdf({
  path: outputPath,
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  }
});
```

### Set Page Format

```js
await page.pdf({
    path: outputPath,
    format: 'Letter',
});
```

Here you can found a list of all supported formats: <https://pptr.dev/api/puppeteer.paperformat#remarks>

### Set Custom Width and Height

```js
await page.pdf({
    path: outputPath,
    width: '800px',
    height: '600px',
});
```

### Set Scale

```js
await page.pdf({
    path: outputPath,
    scale: 0.75,
});
```

## Conclusion

Puppeteer provides a powerful and flexible way to generate PDFs from web pages or HTML content. By leveraging its API, you can customize the output to meet your specific needs, making it a valuable tool for developers looking to automate PDF generation tasks.
