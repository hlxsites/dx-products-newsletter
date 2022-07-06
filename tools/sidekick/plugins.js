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


const sk = document.querySelector('helix-sidekick');
sk.addEventListener('custom:generate-email-template', () => {
  const resp = await fetch(`./export-template.html`);
  const template = document.createElement('html');
  template.innerHTML = await resp.text();

  // Make images url's absolute.. Not sure why this works.. else it's relative
  document.querySelectorAll('img').forEach((img) => {
    img.src = `${img.src}`;
  });

  const content = document.querySelector('body > div').cloneNode(true);
  template.querySelector('body').append(content);

  navigator.clipboard.writeText(template.outerHTML).then(() => {
    alert('Copied to clipboard');
  });
});
