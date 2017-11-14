var modules = (window.modules = window.modules || {});

modules["contacts"] = (function() {
  "use strict";

  let elements, methods, state, contactItems;

  elements = {};
  methods = {};
  state = {};
  const selectors = {
    viewport: "body",
    container: '.container[variant~="contacts"]',
    contactListItemsContainer: ".contact-list-items.container",
    contactListItemsUnit: ".contact-list-items.unit",
    contactListItemsSearchContainer: ".contact-list-search.container",
    contactItemContainer: ".contact-item.wrapper",
    contactItemUnit: ".contact-item.unit",
    contactButtonContainer: ".contact-button.container",
  };

  contactItems = {};

  methods.data = {
    getContactsFromApi: function() {
      fetch("http://localhost:3000/posts").then(function(response) {
        if (response.ok && response.status === 200) {
          response.json().then(function(json) {
            methods.data.setContacts(json);
            methods.data.showContacts();
          });
        } else {
          console.log(
            "Network request for products.json failed with response " +
              response.status +
              ": " +
              response.statusText
          );
        }
      });
    },

    setContacts: function(data) {
      contactItems = data;
    },

    getContacts: function() {
      if (contactItems.length === 0) {
        methods.data.getContactsFromApi();
      }
      return contactItems;
    },

    getContactById: function(contactId) {
      if (contactItems.length === 0) {
        methods.data.getContactsFromApi();
      }
      let contactItem;
      Object.keys(contactItems).some(function(key) {
        if (contactItems[key].id == contactId) {
          return (contactItem = contactItems[key]);
        }
      });

      return contactItem;
    },
    showContacts: function() {
      const contacts = methods.data.getContacts();
      const contactItemsUnit = elements.contactListItemsContainer.getElementsByClassName(
        "contact-list-items unit"
      );

      if (!contactItemsUnit) {
        return false;
      }
      let contactsToHTML = contacts.reduce(function(
        newContactContainer,
        currentContact,
        currentIndex,
        array
      ) {
        if (currentIndex === 0) {
          // create content-items container when the reducer index = 0
          const dataContactItemsContainer = {
            className: "contact-list-items unit",
            nodeName: "article",
          };
          newContactContainer = modules["general"].htmlElement.createElement(
            dataContactItemsContainer
          );
        }

        // Contact item container
        const dataContactItemContainer = {
          className: "contact-list-item wrapper",
          nodeName: "section",
        };
        let currentContainerElement = modules[
          "general"
        ].htmlElement.createElement(dataContactItemContainer);

        let contactListItemHtml = `
          <button type="button" value="${currentContact.id}" class="contact-list-item container">
            <figure class="contact-list-item unit" variant="contact-item-avatar">
              <img class="image" src="${currentContact.file[0].dataUrl}" />
            </figure>
            <div class="contact-list-item unit" variant="contact-item-name">
              ${currentContact.firstname + " " + currentContact.lastname}
            </div>
            ${currentContact.favorite
              ? `
              <div class="contact-list-item unit" variant="contact-item-favorite">
                <i class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <title>icons</title>
                    <path d="M39.986,47.6L25.141,39.8,10.3,47.6l2.835-16.53L1.122,19.366l16.6-2.412L25.141,1.915l7.423,15.039,16.6,2.412L37.151,31.073Z" fill="#676767"/>
                  </svg>
                </i>
              </div>`
              : ""}
            </button>`;

        currentContainerElement.innerHTML = contactListItemHtml;

        newContactContainer.appendChild(currentContainerElement);
        return newContactContainer;
      }, []);

      methods.eventListener.contactListButton(
        contactsToHTML.getElementsByClassName("contact-list-item container"),
        methods.data.showContact,
        "add",
        "click"
      );

      new Promise(function(resolve, reject) {
        const oldContentItemUnit = contactItemsUnit[0];
        let replacedNode = elements.contactListItemsContainer.replaceChild(
          contactsToHTML,
          oldContentItemUnit
        );

        if (
          contactItemsUnit[0].childElementCount ===
          contactsToHTML.childElementCount
        ) {
          resolve(replacedNode);
        }
      }).then(function(data) {
        methods.elementWidth.fixedContainer();

        methods.eventListener.contactListButton(
          data.getElementsByClassName("contact-list-item container"),
          methods.data.showContact,
          "remove",
          "click"
        );
      });
    },
    showContact: function(event) {
      const currentContact = methods.data.getContactById(
        event.currentTarget.value
      );
      const dataContactListWrapper = {
        className: "contact-list wrapper",
        nodeName: "action",
        addAttributes: [
          {
            attributeKey: "variant",
            aattributeValue: "contact-item",
          },
        ],
      };
      let currentContainerElement = modules[
        "general"
      ].htmlElement.createElement(dataContactListWrapper);
      let contentItemWrapper = document.createElement("div");

      const contactItem = `
<article class="contact-item wrapper" variant="contact-item">
  <section class="contact-item container" variant="contact-item-header">
    <figure class="contact-item unit" variant="contact-item-avatar">
      <img class="image" src="${currentContact.file[0].dataUrl}">
    </figure>
    <div class="contact-item unit" variant="contact-item-name">
      ${currentContact.firstname + " " + currentContact.lastname}
    </div>

  </section>

  <section class="contact-item container" variant="contact-item-body-container">
    <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label">
        <label for="phoneWork">work</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <input class="input" id="phoneWork" name="phoneWork" type="phone" value="${currentContact.phoneWork}" disabled />
      </div>
    </div>

    <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label">
        <label for="phonePrivate">home</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <input class="input" id="phonePrivate" name="phonePrivate" type="phone" value="${currentContact.phonePrivate}" disabled />
      </div>
    </div>
  </section>

  <section class="contact-item container" variant="contact-item-body-container">
    <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label">
        <label for="emailWork">work</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <input class="input" id="emailWork" name="emailWork" type="email" value="${currentContact.emailWork}" disabled />
      </div>
    </div>

    <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label">
        <label for="emailPrivate">home</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <input class="input" id="emailPrivate" name="emailPrivate" type="email" value="${currentContact.emailPrivate}" disabled />
      </div>
    </div>
  </section>

  <section class="contact-item container" variant="contact-item-body-container">
      <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label textarea">
        <label for="adress">home</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <textarea class="input textarea" id="adress" name="adress" wrap="hard" rows="4" disabled>
${currentContact.adres}
        </textarea>
      </div>
    </div>
  </section>

  <section class="contact-item container is-last" variant="contact-item-body-container">
      <div class="contact-item unit" variant="contact-item-body">
      <div class="input container" variant="contact-label textarea">
        <label for="adress">note</label>
      </div>
      <div class="input container" variant="contact-inputfield">
        <textarea class="input textarea" id="adress" name="adress" wrap="hard" rows="4" disabled>
${currentContact.note}
        </textarea>
      </div>
    </div>
  </section>

  <section class="contact-button container" variant="contact-button">
    <ul class="contact-button unit">
      <li>
          <a href="tel:${currentContact.phoneWork}">
            <i class="icon">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M36.43,47.2a4.2,4.2,0,0,1-.736-0.065l-0.542-.091c-0.5-.083-1.025-0.168-1.543-0.306a47.2,47.2,0,0,1-16.423-8.2A42.95,42.95,0,0,1,6.233,26.261,44.811,44.811,0,0,1,2.27,17.453L2.229,17.33l0.012-1.639a11.642,11.642,0,0,1,1.464-3.935,26.147,26.147,0,0,1,5.51-6.415C9.36,5.214,9.492,5.1,9.629,4.988a2.467,2.467,0,0,1,3.436.186,72.6,72.6,0,0,1,6.989,8.275,2.21,2.21,0,0,1-.429,3.022,24.714,24.714,0,0,0-4.092,4.17,0.577,0.577,0,0,0-.057.856,39.065,39.065,0,0,0,13.1,12.388c0.535,0.3,1.11.589,1.709,0.873,0.467,0.222.514,0.168,0.737-.091,0.771-.9,1.506-1.869,2.217-2.808l0.083-.11c0.247-.326.47-0.677,0.705-1.048l0.258-.4a2.379,2.379,0,0,1,3.417-.8c0.548,0.33,1.082.683,1.616,1.036,0.26,0.172.52,0.344,0.781,0.513l1.363,0.882q2.428,1.571,4.865,3.13a3.094,3.094,0,0,1,1.388,1.51L47.771,36.7v1.133l-0.163.288a3.477,3.477,0,0,1-.192.322,26.449,26.449,0,0,1-7.444,7.4A6.554,6.554,0,0,1,36.43,47.2ZM3.843,17.071a43.137,43.137,0,0,0,3.778,8.368A41.345,41.345,0,0,0,18.166,37.259a45.6,45.6,0,0,0,15.862,7.923c0.44,0.117.9,0.193,1.385,0.272l0.565,0.1c1.075,0.189,1.933-.3,3.119-1.063a24.884,24.884,0,0,0,6.992-6.959c0.025-.037.048-0.076,0.069-0.115V37.02a1.93,1.93,0,0,0-.691-0.6q-2.445-1.556-4.875-3.136L39.229,32.4c-0.267-.172-0.531-0.347-0.8-0.522-0.515-.34-1.03-0.681-1.558-1a0.783,0.783,0,0,0-1.231.3l-0.249.39c-0.243.383-.494,0.778-0.781,1.157l-0.084.11c-0.725.958-1.476,1.949-2.278,2.885a2,2,0,0,1-2.654.5c-0.628-.3-1.233-0.607-1.8-0.919a40.63,40.63,0,0,1-13.648-12.88,2.15,2.15,0,0,1,.1-2.759,26.335,26.335,0,0,1,4.358-4.443,0.606,0.606,0,0,0,.139-0.814,71.065,71.065,0,0,0-6.835-8.093,0.859,0.859,0,0,0-1.274-.065c-0.121.1-.237,0.2-0.353,0.3A24.62,24.62,0,0,0,5.1,12.574,10.061,10.061,0,0,0,3.843,15.9v1.173Z" fill="#fff"/></svg>
            </i>
            <span>call</span>
          </a>
      </li>
      <li class="flex-auto">
          <a href="mailto:r.kallan@upcmail.nl">
            <i class="icon">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M1.513,36.568V15.721a0.949,0.949,0,0,0,.021-0.114,4.642,4.642,0,0,1,.309-1.386,5.3,5.3,0,0,1,4.929-3.339q18.233,0.007,36.466,0a5.33,5.33,0,0,1,.77.051,5.147,5.147,0,0,1,2.758,1.286,4.928,4.928,0,0,1,1.721,3.8q0,10.149,0,20.3a4.887,4.887,0,0,1-1.372,3.406,5.189,5.189,0,0,1-3.89,1.675q-9.439,0-18.879,0-8.754,0-17.509,0A5.7,5.7,0,0,1,5.9,41.331a5.2,5.2,0,0,1-3.13-1.742,4.875,4.875,0,0,1-1.2-2.557C1.55,36.877,1.533,36.722,1.513,36.568ZM25,12.672q-9.072,0-18.144,0a3.435,3.435,0,0,0-1.519.308,3.253,3.253,0,0,0-2.028,3.115q0,10.1,0,20.2a3.076,3.076,0,0,0,.862,2.181A3.47,3.47,0,0,0,6.8,39.608h15.3q10.54,0,21.08,0a3.419,3.419,0,0,0,1.614-.361A3.239,3.239,0,0,0,46.695,36.2q0-10.11,0-20.219a3.065,3.065,0,0,0-.813-2.122,3.509,3.509,0,0,0-2.716-1.192H25Z" fill="#fff"/><path d="M25,30.553a0.759,0.759,0,0,1-.593-0.209q-3.455-2.681-6.919-5.351-6.418-4.959-12.834-9.921a1.03,1.03,0,0,1-.435-0.867,0.57,0.57,0,0,1,.084-0.295A1.108,1.108,0,0,1,5.2,13.4a0.6,0.6,0,0,1,.4.137Q7.358,14.9,9.115,16.266L24.522,28.217c0.126,0.1.257,0.191,0.377,0.3a0.133,0.133,0,0,0,.2,0q1.662-1.3,3.33-2.587L44.281,13.636a2.053,2.053,0,0,1,.2-0.155,0.676,0.676,0,0,1,.548-0.055,1.246,1.246,0,0,1,.608.392,0.65,0.65,0,0,1,.122.635,1.163,1.163,0,0,1-.414.625L25.652,30.3a0.846,0.846,0,0,0-.085.066A0.648,0.648,0,0,1,25,30.553Z" fill="#fff"/><path d="M8.773,35.081a0.974,0.974,0,0,1-.859-0.51,0.66,0.66,0,0,1-.028-0.621A1.214,1.214,0,0,1,8.3,33.392q2.811-2.105,5.62-4.214a0.584,0.584,0,0,0,.054-0.041,0.7,0.7,0,0,1,.867-0.1,1.7,1.7,0,0,1,.416.3,0.641,0.641,0,0,1,.137.691,1.166,1.166,0,0,1-.424.607L9.36,34.839a0.82,0.82,0,0,1-.392.225C8.9,35.071,8.838,35.076,8.773,35.081Z" fill="#fff"/><path d="M41.206,35.075a0.729,0.729,0,0,1-.52-0.2C39.861,34.245,39.029,33.626,38.2,33c-1.064-.8-2.132-1.592-3.191-2.4a1.033,1.033,0,0,1-.433-0.877,0.543,0.543,0,0,1,.137-0.358,1.137,1.137,0,0,1,.862-0.434,0.6,0.6,0,0,1,.372.128Q37.184,30,38.423,30.931c1.105,0.831,2.216,1.655,3.316,2.492a1,1,0,0,1,.425.935,0.494,0.494,0,0,1-.081.227A0.977,0.977,0,0,1,41.206,35.075Z" fill="#fff"/></svg>
            </i>
            <span>email</span>
          </a>
      </li>
      <li>
          <button type="button" value="edit-${currentContact.id}">
            <i class="icon">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M8.98,44.5l-1.022-.034A2.479,2.479,0,0,1,6.351,42.98l-0.065-.152,0.009-.971L6.4,41.148c0.079-.514.159-1.027,0.23-1.542l0.3-2.188c0.221-1.636.442-3.271,0.682-4.9a2.475,2.475,0,0,1,.658-1.257C8.875,30.62,9.5,30,10.122,29.383l5.211-5.206q7.3-7.3,14.592-14.6A5.506,5.506,0,0,1,32.866,7.8l0.14-.012L34.119,7.8a5.7,5.7,0,0,1,2.992,1.873C38.4,11,39.74,12.339,41.087,13.648a5.7,5.7,0,0,1,1.9,3.016L43,16.817l-0.012,1.1a5.587,5.587,0,0,1-1.827,2.99C34.436,27.611,27.273,34.76,20.122,41.963a4.586,4.586,0,0,1-2.889,1.378c-1.993.238-4.018,0.518-5.977,0.79l-2.118.295ZM8.325,42.884h0.3a0.961,0.961,0,0,1,.193-0.046l2.212-.3c1.966-.273,4-0.554,6.006-0.794a2.991,2.991,0,0,0,1.936-.913C26.131,33.621,33.3,26.47,40.02,19.763A4.216,4.216,0,0,0,41.386,17.7V16.9a4.386,4.386,0,0,0-1.423-2.094c-1.358-1.32-2.707-2.669-4.009-4.01a4.219,4.219,0,0,0-2.07-1.4h-0.8a4.014,4.014,0,0,0-2.014,1.315q-7.288,7.312-14.594,14.607l-5.216,5.211c-0.612.607-1.225,1.215-1.819,1.839a0.894,0.894,0,0,0-.231.379C8.969,34.375,8.749,36,8.529,37.634l-0.3,2.192C8.159,40.35,8.079,40.872,8,41.394l-0.1.644v0.441A0.841,0.841,0,0,0,8.325,42.884Z" fill="#fff"/><rect x="30.779" y="12.77" width="1.613" height="12.908" transform="translate(-4.287 28.188) rotate(-45.356)" fill="#fff"/></svg>
            </i>
            <span>edit</span>
          </button>
      </li>
    </ul>
  </section>
</article>`;
      contentItemWrapper.innerHTML = contactItem;
      contentItemWrapper = contentItemWrapper.querySelector("article");
      let mainWrapper = document.querySelector(selectors.container);
      let oldContent = mainWrapper.querySelector(".contact-item.wrapper");

      new Promise(function(resolve, reject) {
        let oldContent = mainWrapper.querySelector(".contact-item.wrapper");
        let replacedNode = mainWrapper.replaceChild(
          contentItemWrapper,
          oldContent
        );
        resolve(replacedNode);
      }).then(function(data) {
        methods.elementWidth.fixedContainer();
      });
    },
  };

  methods.eventListener = {
    contactListButton: function(
      elementNode,
      callFunction,
      listener = "add",
      type = "click"
    ) {
      if (elementNode && elementNode.length > 0) {
        Object.keys(elementNode).forEach(function(key) {
          methods.eventListener[listener](elementNode[key], callFunction, type);
        });
      }
    },
    add: function(element, callFunction, type = "click") {
      element.addEventListener(type, callFunction);
    },
    remove: function(element, callFunction, type = "click") {
      element.removeEventListener(type, callFunction);
    },
  };

  methods.setElements = function() {
    if (elements.contactListItemsContainer) {
      elements.contactListItemsUnit = elements.contactListItemsContainer.querySelector(
        selectors.contactListItemsUnit
      );
      elements.contactListItemsContainerButton = elements.contactListItemsContainer.querySelector(
        selectors.contactButtonContainer
      );

      elements.contactListItemsSearchContainer = elements.contactListItemsContainer.querySelector(
        selectors.contactListItemsSearchContainer
      );
    }

    elements.contactItemContainer = document.querySelector(
      selectors.contactItemContainer
    );
    if (elements.contactItemContainer) {
      elements.contactItemUnit = elements.contactItemContainer.querySelector(
        selectors.contactItemUnit
      );
      elements.contactItemContainerButton = elements.contactItemContainer.querySelector(
        selectors.contactButtonContainer
      );
    }
  };

  methods.elementWidth = {
    fixedContainer: function() {
      methods.setElements();
      methods.elementWidth.contactListItems();
      methods.elementWidth.buttonContainerListItems();
      methods.elementWidth.buttonContainerItem();
    },
    contactListItems: function() {
      elements.contactListItemsUnit.style.width =
        elements.contactListItemsContainer.clientWidth + "px";
    },
    buttonContainerListItems: function() {
      if (elements.contactListItemsUnit) {
        let contactListItemsUnitWidth =
          elements.contactListItemsUnit.clientWidth;
        elements.contactListItemsContainerButton.style.width =
          contactListItemsUnitWidth + "px";
        elements.contactListItemsSearchContainer.style.width =
          contactListItemsUnitWidth + "px";
      }
    },
    buttonContainerItem: function() {
      if (
        elements.contactItemContainer &&
        elements.contactItemContainerButton
      ) {
        let contactItemContainerWidth =
          elements.contactItemContainer.clientWidth;

        elements.contactItemContainerButton.style.width =
          contactItemContainerWidth + "px";
      }
    },
  };

  methods.mount = function(viewport) {
    viewport = viewport || document.querySelector(selectors.viewport);
    var found = document.querySelector(selectors.container);

    if (found) {
      elements.window = window;
      elements.body = document.querySelector("body");
      elements.viewport =
        viewport || document.querySelectorAll(selectors.viewport);
      elements.contactsContainer = found;

      return true;
    } else {
      return false;
    }
  };

  methods.init = function(viewport) {
    if (elements.contactsContainer) {
      window.addEventListener("resize", methods.elementWidth.fixedContainer);

      // get and show contact list
      elements.contactListItemsContainer = elements.contactsContainer.querySelector(
        selectors.contactListItemsContainer
      );
      elements.contactItemContainer = elements.contactsContainer.querySelector(
        selectors.contactItemContainer
      );

      if (elements.contactListItemsContainer) {
        methods.data.getContactsFromApi();
      }

      return true;
    } else {
      return false;
    }
  };

  methods.render = function(viewport) {
    if (elements.contactsContainer) {
      return true;
    } else {
      return false;
    }
  };

  methods.unmount = function() {
    if (elements.contactsContainer) {
      let data = {
        element: document.documentElement,
        attributeValue: "no-scroll",
        attributeKey: "class",
      };
      modules["general"].htmlElement.removeAttributeValue(data);
    }
  };

  return {
    mount: methods.mount,
    init: methods.init,
    unmount: methods.unmount,
    render: methods.render,

    selector: selectors.container,
  };
})();
