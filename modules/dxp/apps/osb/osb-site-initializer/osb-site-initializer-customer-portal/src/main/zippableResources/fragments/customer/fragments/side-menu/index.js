/* eslint-disable no-undef */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const getAccountSubscriptionGroupsByFilter = (filter) => ({
  query: `{
      c {
        accountSubscriptionGroups(filter: "accountKey eq '${filter}' and hasActivation eq true") {
            items {
              name
            }
          }
        }
  }`});

const doFetch = async (query) => {
  const queryString = JSON.stringify(query);

  const response = await fetch(`${window.location.origin}/o/graphql`, {
    body: queryString,
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': Liferay.authToken,
    },
    method: 'POST',
  });

  const { data } = await response.json();

  return data.c.accountSubscriptionGroups.items;
}

const getSubscriptionKey = (name) => {
  return name.split(" ")[0].toLowerCase();
}

const htmlElement = (name, key) => {
  return `<li><a href="#" class="btn-sm text-link-md d-flex text-decoration-none text-neutral-10 pr-0">
  <img class="mr-2" width="16" src="http://localhost:8080/webdav/cp-3.0/document_library/assets/navigation-menu/${key}_icon_gray.svg" alt="" />
  ${name}
</a></li>`;
}

const buttonStyle = "bg-brand-primary-lighten-5 btn btn-borderless btn-primary btn-sm d-flex font-weight-bolder text-brand-primary py-2 rounded";
const linkStyle = "btn-sm text-link-md d-flex text-decoration-none text-neutral-10 pr-0";

const koroneikiApplicationIdKey = 'customer-portal-koroneiki-application';
const koroneikiApplication = sessionStorage.getItem(koroneikiApplicationIdKey);
const currentProducts = fragmentElement.querySelector("#customer-portal-products");
let expandedHeightProducts;

(async () => {
  try {
    if (koroneikiApplication) {
      let koroneiki = JSON.parse(koroneikiApplication);

      const accountSubscriptionGroups = await doFetch(getAccountSubscriptionGroupsByFilter(koroneiki.accountKey)) || [];
      expandedHeightProducts = accountSubscriptionGroups.length * 40;

      currentProducts.innerHTML = accountSubscriptionGroups.map(
        ({ name }) => htmlElement(name, getSubscriptionKey(name))
      ).join("\n");
    }
  }
  catch (error) {
    console.error(error.message);
  }
})();

fragmentElement.addEventListener("click", (event) => {
  if (event.target.id === "customer-portal-toggle-products" || event.target.id === "customer-portal-arrow") {
    const products = fragmentElement.querySelector("#customer-portal-products");
    const heightProducts = products.offsetHeight;

    if (heightProducts < expandedHeightProducts) {
      currentProducts.style.height = `${expandedHeightProducts}px`;
    } else {
      currentProducts.style.height = "0px";
    }

    const arrow = fragmentElement.querySelector("#customer-portal-arrow");
    arrow.classList.toggle("left");
    arrow.classList.toggle("down");
  } else if (event.target.classList.contains("text-link-md") || event.target.tagName === "IMG") {
    const lastButton = fragmentElement.querySelector(".btn");
    let currentButton = event.target;

    if (currentButton.tagName === "IMG") {
      currentButton = currentButton.parentElement;
    }

    lastButton.className = linkStyle;
    currentButton.className = buttonStyle;

    if (currentButton.children[0]) {
      let srcIcon = currentButton.children[0].src;
      if (srcIcon.substr(srcIcon.length - 3) !== "svg") {
        srcIcon = srcIcon.split("/");
        srcIcon.pop();
        srcIcon = srcIcon.join("/");
      }

      currentButton.children[0].src = srcIcon.replace("_gray", "");
    }

    if (lastButton !== currentButton && lastButton.children[0]) {
      let srcIcon = lastButton.children[0].src;

      if (srcIcon.substr(srcIcon.length - 3) !== "svg") {
        srcIcon = srcIcon.split("/");
        srcIcon.pop();
        srcIcon = srcIcon.join("/");
      }

      lastButton.children[0].src = srcIcon.replace(".svg", "_gray.svg");
    }

    const toggleProducts = fragmentElement.querySelector("#customer-portal-toggle-products");
    const grandParentElementId = currentButton.parentElement.parentElement.id;
    if ((grandParentElementId === "customer-portal-products" && toggleProducts.classList.contains("text-neutral-10")) || (toggleProducts.classList.contains("text-brand-primary") && grandParentElementId !== "customer-portal-products")) {
      toggleProducts.classList.toggle("text-neutral-10");
      toggleProducts.classList.toggle("text-brand-primary");
    }
  }
});