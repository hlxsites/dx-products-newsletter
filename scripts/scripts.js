/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { HelixApp, decorateSections, buildBlock, getMetadata } from 'https://cdn.skypack.dev/@dylandepass/helix-web-library@v1.5.2/dist/helix-web-library.esm.js';
import { convertToTable } from './utils.js';

HelixApp.init({
  lcpBlocks: [],
  makeLinksRelative: false,
  autoAppear: false,
})
  .withBuildAutoBlocks((main) => {
    main.querySelectorAll(':scope div:not(:first-child) h2').forEach((h2) => {
      const section = buildBlock('banner', { elems: [h2.cloneNode(true)] });
      h2.parentNode.replaceChild(section, h2);
    });

    main.querySelectorAll(':scope div:not(:first-child) h3').forEach((h3) => {
      const stackElements = [h3.cloneNode(true)];
      let nextElementSibling = h3.nextElementSibling;
      while (nextElementSibling && (nextElementSibling.tagName === 'H4' || nextElementSibling.tagName === 'P')) {
        stackElements.push(nextElementSibling.cloneNode(true));
        const curr = nextElementSibling;
        nextElementSibling = nextElementSibling.nextElementSibling;
        curr.remove();
      }

      const section = buildBlock('v-stack', { elems: stackElements });
      h3.parentNode.replaceChild(section, h3);
      h3.remove();
    });

    const date = getMetadata('date');
    const author = getMetadata('author');
    const authorTitle = getMetadata('author-title');

    if (author && authorTitle) {
      const dateElement = document.createElement('span');
      dateElement.textContent = ` (${date})`;
      document.querySelector('h1').appendChild(dateElement);


      const authorParagraph = document.createElement('p');
      const authorStrong = document.createElement('strong');
      authorStrong.textContent = author;
      authorParagraph.appendChild(authorStrong);
      authorParagraph.style.paddingBottom = '0px';

      const authorTitleParagraph = document.createElement('p');
      authorTitleParagraph.textContent = authorTitle;
      authorTitleParagraph.style.paddingTop = '0px';

      main.querySelector(':scope div:nth-child(1)').appendChild(authorParagraph);
      main.querySelector(':scope div:nth-child(1)').appendChild(authorTitleParagraph);
    }
  })
  .withDecorateSections((main) => {
    decorateSections(main);
    main.querySelectorAll(':scope > div > div').forEach((section) => {
      if (section.classList.length === 1) {
        const table = convertToTable(section);
        section.insertAdjacentHTML('beforebegin', table);
        section.remove();
      }
    });
  })
  .withLoadLazy(() => {
    const main = document.querySelector('main');

    main.querySelectorAll('p, h1, h2, h3, h4, h5').forEach((tag) => {
      tag.style.paddingLeft = "20px";
      tag.style.paddingRight = "20px";
      tag.style.margin = "0px";
      tag.style.webkitTextSizeAdjust = "none";
      tag.style.msTextSizeAdjust = "none";
      tag.style.msoLineHeightRule = "exactly";
      tag.style.fontFamily = "arial, 'helvetica neue', helvetica, sans-serif";
      if (tag.tagName === 'P' && !tag.style.fontSize) {
        tag.style.fontSize = "14px";
        tag.style.lineHeight = "21px";
      }
    });

    main.querySelectorAll('table').forEach((table) => {
      table.setAttribute('border', '0');
      table.setAttribute('cellpadding', '0');
      table.setAttribute('cellspacing', '0');
      table.setAttribute('role', 'presentation');
      table.style['mso-table-lspace'] = "0pt";
      table.style['mso-table-rspace'] = "0pt";
      table.style['border-collapse'] = "collapse";
      table.style['border-spacing'] = "0px";
    });

    main.querySelectorAll('h1').forEach((heading) => {
      heading.style.lineHeight = "30px";
      heading.style.color = "#333333";
      heading.style.fontSize = "24px";
    });

    main.querySelectorAll('h3').forEach((heading) => {
      heading.style.paddingBottom = "10px";
    });

    main.querySelectorAll('h4').forEach((heading) => {
      heading.style.paddingBottom = "5px";
    });

    const templateWrapper = document.createElement('div');
    templateWrapper.style.backgroundColor = '#F6F6F6';

    const emailTemplate = document.createElement('div');
    emailTemplate.classList.add('email-template');
    emailTemplate.innerHTML = main.innerHTML;
    emailTemplate.style.margin = '0px auto';
    emailTemplate.style.maxWidth = '600px';
    emailTemplate.style.width = '100%';
    emailTemplate.style.backgroundColor = '#ffffff';
    emailTemplate.style.overflowX = 'hidden';
    templateWrapper.appendChild(emailTemplate);
    document.body.appendChild(templateWrapper);

    const header = document.querySelector('header');
    emailTemplate.prepend(header);

    const footer = document.querySelector('footer');
    emailTemplate.append(footer);
    main.remove();

    const previewText = getMetadata('preview-text');
    const previewTextSpan = document.createElement('span');
    previewTextSpan.textContent = previewText;
    previewTextSpan.style.display = 'none';
    emailTemplate.prepend(previewTextSpan);

    setTimeout(() => {
      document.querySelector('body').classList.add('appear');
    }, 400);
  })
  .decorate();

// load plugins when sidekick is ready
document.addEventListener('helix-sidekick-ready', () => {
  import('../tools/sidekick/plugins.js');
}, { once: true });
