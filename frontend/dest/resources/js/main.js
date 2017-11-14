var modules = (window.modules = window.modules || {});

modules["api-form"] = (function() {
  "use strict";

  let elements, methods, selectors, state, contactItems;

  elements = {};
  methods = {};
  selectors = {
    viewport: "body",

    container: '.container[variant="api-form"]',

    formContainer: '.container[variant~="api-form"]',
    formElement: '[variant="api-form"] form',
    formFullForm: '[variant="full-form"]',

    formButton: ".submit-button",

    dateFieldContainer: '[variant="date"]',

    requiredFields: "input[data-required]",
    formPostedContainer: '[variant~="custom-form-posted"]',
    errorMessageContainer: '[variant~="error-message"]',
  };
  state = {};
  contactItems = {};

  methods.form = {
    addItem: function(event) {
      event.preventDefault();

      var formElements = event.currentTarget.elements;
      var postData = Array.prototype.slice
        .call(formElements)
        .reduce(function(data, item, currentIndex, array) {
          if (item && item.name) {
            if (item.name === "file") {
              data[item.name] = JSON.parse(item.value);
            } else {
              data[item.name] = item.value;
            }
          }

          return data;
        }, {});

      fetch("http://localhost:3000/posts", {
        body: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
      })
        .then(function(response) {
          return response;
        })
        .then(function(response) {
          if (response.ok === true && response.status === 201) {
            methods.data.getContacts();
          }
        })
        .catch(function(error) {
          console.warn(error);
        });
    },

    deleteItem: function(event) {
      event.preventDefault();

      var data = {
        currentElement: event.currentTarget,
        getParentElement: {
          onAttribute: "class",
          attributeValue: "contact-item container",
        },
      };

      var deletedElement = modules["general"].htmlElement.getClosestParentNode(
        data
      );

      fetch(event.currentTarget.action, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "delete",
      })
        .then(function(response) {
          return response;
        })
        .then(function(response) {
          if (response.ok === true && response.status === 200) {
            deletedElement.remove();
          }
        })
        .catch(function(error) {
          console.warn(error);
        });
    },
  };

  methods.data = {
    getContacts: function() {
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

    contacts: function() {
      if (contactItems.length === 0) {
      }
      return contactItems;
    },

    showContacts: function() {
      const contacts = methods.data.contacts();
      const contactContainer = document.querySelector(
        ".contact-items.container"
      );

      let contactsToHTML = contacts.reduce(function(
        newContactContainer,
        currentContact,
        currentIndex,
        array
      ) {
        if (currentIndex === 0) {
          // create content-items container when the reducer index = 0
          const dataContactItemsContainer = {
            className: "contact-items container",
            nodeName: "article",
          };
          newContactContainer = modules["general"].htmlElement.createElement(
            dataContactItemsContainer
          );
        }

        // Contact item container
        const dataContactItemContainer = {
          className: "contact-item container",
          nodeName: "section",
        };
        let currentContainerElement = modules[
          "general"
        ].htmlElement.createElement(dataContactItemContainer);

        // Avatar container
        const avatarContainer = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "avatar",
            },
          ],
          className: "contact-name container",
          nodeName: "div",
        };
        let currentAvatarContainer = modules[
          "general"
        ].htmlElement.createElement(avatarContainer);
        console.log(currentContact);
        currentAvatarContainer.style.backgroundImage =
          "url('" + currentContact.file[0].dataUrl + "')";

        // Contact Name container and childs
        const dataNameContainer = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "name",
            },
          ],
          className: "contact-name container",
          nodeName: "div",
        };
        let currentNameContainer = modules["general"].htmlElement.createElement(
          dataNameContainer
        );

        const currentContactName = document.createTextNode(
          currentContact.firstname + " " + currentContact.lastname
        );
        currentNameContainer.appendChild(currentContactName);

        // Contact Phone container and childs
        const dataPhoneContainer = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "phonenumber",
            },
          ],
          className: "contact-phone container",
        };
        let currentPhoneContainer = modules[
          "general"
        ].htmlElement.createElement(dataPhoneContainer);

        // Contact phone work label
        const dataPhoneLabel = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "label",
            },
          ],
          className: "contact-phone unit",
        };
        let currentPhoneLabel = modules["general"].htmlElement.createElement(
          dataPhoneLabel
        );

        let currentPhoneLabelElement = document.createElement("label");

        // Contact phone work value
        const dataPhoneValue = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "value",
            },
          ],
          className: "contact-phone unit",
        };
        let currentPhoneValueWork = modules[
          "general"
        ].htmlElement.createElement(dataPhoneValue);

        let currentPhoneLabelWorkText = document.createTextNode("work");
        let currentPhoneLabelWorkUnit = currentPhoneLabel;
        let currentPhoneLabelWork = currentPhoneLabelElement;

        currentPhoneLabelWork.appendChild(currentPhoneLabelWorkText);
        currentPhoneLabelWorkUnit.appendChild(currentPhoneLabelWork);

        const currentPhoneValueWorkText = document.createTextNode(
          currentContact.phoneWork || ""
        );

        currentPhoneValueWork.appendChild(currentPhoneValueWorkText);

        currentPhoneContainer.appendChild(currentPhoneLabelWorkUnit);
        currentPhoneContainer.appendChild(currentPhoneValueWork);

        // Contact Remove container and childs
        const dataRemoveContainer = {
          addAttributes: [
            {
              attributeKey: "variant",
              attributeValue: "delete",
            },
          ],
          className: "contact-delete container",
        };
        let currentRemoveContainer = modules[
          "general"
        ].htmlElement.createElement(dataRemoveContainer);

        const dataButton = {
          addAttributes: [
            {
              attributeKey: "type",
              attributeValue: "submit",
            },
          ],
          nodeName: "button",
        };
        let currentRemoveButton = modules["general"].htmlElement.createElement(
          dataButton
        );
        const currentRemoveButtonText = document.createTextNode(
          "Remove contact"
        );
        currentRemoveButton.appendChild(currentRemoveButtonText);

        const currentContactRemoveUrl =
          "http://localhost:3000/posts/" + currentContact.id;

        const dataRemoveForm = {
          nodeName: "form",
          className: "contact-delete container",
          addAttributes: [
            {
              attributeKey: "action",
              attributeValue: currentContactRemoveUrl,
            },
            {
              attributeKey: "method",
              attributeValue: "delete",
            },
            {
              attributeKey: "variant",
              attributeValue: "delete",
            },
          ],
        };

        let currentRemoveForm = modules["general"].htmlElement.createElement(
          dataRemoveForm
        );

        currentRemoveForm.appendChild(currentRemoveButton);

        currentRemoveForm.addEventListener("submit", methods.form.deleteItem);
        currentRemoveContainer.appendChild(currentRemoveForm);

        currentContainerElement.appendChild(currentAvatarContainer);
        currentContainerElement.appendChild(currentNameContainer);
        currentContainerElement.appendChild(currentPhoneContainer);
        currentContainerElement.appendChild(currentRemoveContainer);

        newContactContainer.appendChild(currentContainerElement);
        return newContactContainer;
      }, []);

      document
        .querySelector("main")
        .replaceChild(contactsToHTML, contactContainer);
    },
  };

  methods.mount = function(viewport) {
    viewport = viewport || document;
    var found = document.querySelector(selectors.container);

    if (found) {
      elements.window = window;
      elements.body = document.querySelector("body");
      elements.viewport =
        viewport || document.querySelector(selectors.viewport);
      elements.formContainer = found;
      return true;
    } else {
      return false;
    }
  };

  methods.init = function(viewport) {
    if (elements.formContainer) {
      elements.formElement =
        elements.formContainer.querySelectorAll(selectors.formElement) ||
        undefined;

      Object.keys(elements.formElement).forEach(function(key) {
        elements.formElement[key].addEventListener(
          "submit",
          methods.form.addItem
        );
      });

      methods.data.getContacts();

      return true;
    } else {
      return false;
    }
  };

  methods.render = function(viewport) {
    if (elements.formContainer) {
      return true;
    } else {
      return false;
    }
  };

  methods.unmount = function() {
    if (elements.formContainer) {
      Object.keys(elements.formElement).forEach(function(key) {
        elements.formElement[key].addEventListener(
          "submit",
          methods.form.addItem
        );
      });
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

var modules = (window.modules = window.modules || {});

modules["file-upload"] = (function() {
  "use strict";

  let elements, methods, selectors, state, contactItems;

  elements = {};
  methods = {};
  selectors = {
    viewport: "body",
    container: '.container[variant="file-upload"]',
  };
  state = {};

  methods.mount = function(viewport) {
    viewport = viewport || document;
    var found = document.querySelectorAll(selectors.container);

    if (found) {
      elements.window = window;
      elements.body = document.querySelector("body");
      elements.viewport =
        viewport || document.querySelector(selectors.viewport);
      elements.fileUploadContainer = found;
      return true;
    } else {
      return false;
    }
  };

  methods.init = function(viewport) {
    if (elements.fileUploadContainer) {
      Object.keys(elements.fileUploadContainer).forEach(function(key) {
        let fileUpload = new fileUploadShowPrevieuw(
          elements.fileUploadContainer[key]
        );
      });
      return true;
    } else {
      return false;
    }
  };

  methods.render = function(viewport) {
    if (elements.formContainer) {
      return true;
    } else {
      return false;
    }
  };

  methods.unmount = function() {
    if (elements.fileUpload) {
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

var modules = window.modules = window.modules || {};
var methods = {};

modules['custom-form'] = (function () {

	'use strict';

	var elements,
		methods,
		selectors,
		state;

	elements = {};
	methods = {};
	selectors = {
		'viewport': 'body',

		'container': '.container[variant="custom-form"]',

		'formContainer': '.container[variant~="custom-form"]',
		'formElement': '[variant="custom-form"] form',
		'formFullForm': '[variant="full-form"]',

		'formButton': '.submit-button',

		'dateFieldContainer': '[variant="date"]',

		'requiredFields': 'input[data-required]',
		'formPostedContainer': '[variant~="custom-form-posted"]',
		'errorMessageContainer': '[variant~="error-message"]'
	};
	state = {};

	methods.htmlElement = {
		getAttribute: function (data) {
			return (data.element.getAttribute(data.attributeKey) || false);
		},
		hasAttributeValue: function (data, attributeValue) {
			if (!attributeValue) {
				attributeValue = methods.htmlElement.getAttribute(data);
			}
			var regex = new RegExp(data.attributeValue, 'gi');
			return regex.test(attributeValue);
		},
		addAttributeValue: function (data) {
			var attributeValue = methods.htmlElement.getAttribute(data);

			if (!methods.htmlElement.hasAttributeValue(data, attributeValue)) {
				if (attributeValue) {
					attributeValue = attributeValue + ' ' + data.attributeValue;
				} else {
					attributeValue = data.attributeValue;
				}
				data.element.setAttribute(data.attributeKey, attributeValue);
			}
			return true;
		},
		removeAttributeValue: function (data) {
			var attributeValue = methods.htmlElement.getAttribute(data);
			var hasAttributeValue = methods.htmlElement.hasAttributeValue(data, attributeValue);
			var valueRemoved = false;
			if (hasAttributeValue) {
				var regex = new RegExp(data.attributeValue, 'gi');
				var newAttributeValue = attributeValue.replace(regex, '').trim();
				if (newAttributeValue) {
					data.element.setAttribute(data.attributeKey, newAttributeValue);
				} else {
					data.element.removeAttribute(data.attributeKey);
				}
				valueRemoved = true;
			}
			return valueRemoved;
		},
		toggleAttributeValue: function (data) {
			data.attributeValue = data.removeAttributeValue;
			var valueToggled = false;
			var removeAttributeValue = methods.htmlElement.removeAttributeValue(data);

			if (removeAttributeValue) {
				data.attributeValue = data.addAttributeValue;
				methods.htmlElement.addAttributeValue(data);
				valueToggled = true;
			}
			return valueToggled;
		},
		addStateValueInvalid: function (element) {
			var data = {
				element: element,
				attributeKey: 'state',
				attributeValue: 'invalid'
			};

			return methods.htmlElement.addAttributeValue(data);
		},
		removeStateValueInvalid: function (element) {
			var data = {
				element: element,
				attributeKey: 'state',
				attributeValue: 'invalid'
			};
			return methods.htmlElement.removeAttributeValue(data);
		}
	};

	methods.fieldElement = {
		focusOut: function (event) {
			var fieldData = {
				name: event.currentTarget.name,
				values: event.currentTarget.value,
				valueCheck: event.currentTarget.dataset.valueCheck || event.currentTarget.type
			};
			var validationResponse = methods.formValidation.fieldValidation(fieldData);
			if (validationResponse.hasError) {
				methods.htmlElement.addStateValueInvalid(event.currentTarget);
			}
			methods.errorMessage.setState.hidden(event.currentTarget.form);
		},
		focusIn: function (event) {
			methods.htmlElement.removeStateValueInvalid(event.currentTarget);
		}
	};

	methods.form = {
		clickHandler: function (event) {
			event.preventDefault();

			methods.dateSelector.isStateInvalid(event.currentTarget);
			var formData = methods.form.serialize(event.currentTarget);
			var errorData = methods.formValidation.formData(formData.postData);

			if (errorData || state.containerVariantDateInvalid) {
				methods.form.errorHandler(errorData, event.currentTarget);
			} else if (!errorData && !state.containerVariantDateInvalid) {
				methods.form.postHandler(formData, event.currentTarget.action);
			}
		},

		postHandler: function (formData, action) {
			methods.sendData.xhr('POST', action, formData)
				.then(function (data) {
					var callbackJsonXhr = methods.sendData.callback.success(data);
					methods.form.callbackHandler(callbackJsonXhr);
				});
		},


		callbackHandler: function (data) {
			if (data.errorData && Object.keys(data.errorData).length > 0) {
				var form = document.querySelector('form[name="' + data.formName + '"]');
				methods.form.errorHandler(data.errorData, form);
			} else if (data.succesData) {
				if (data.succesData.page !== '') {
					console.log('we go to a new page');
					// go to new page
				} else {
					methods.form.succesHandler(data);
				}
				/*
				$(elements.body).trigger(new jQuery.Event('navigate', {
					url: data.succesData.page,
					animation: 'blurin',
					windowName: null,
					target: null
				}));
				*/
			}
		},

		errorHandler: function (errorData, element) {
			Object.keys(errorData).forEach(function (key) {
				var selector = errorData[key].data.elementType + '[name="' + errorData[key].data.name + '"]';
				var input = element.querySelector(selector);

				methods.htmlElement.addStateValueInvalid(input);
			});
			methods.errorMessage.setState.active(element);
		},

		succesHandler: function (data) {

			var formSucces = elements.body.querySelector('[name*="' + data.succesData.formName + '"]');
			var formSuccesContainer = formSucces.closest('[variant~="custom-form"]');

			var dataForm = {
				element: formSucces,
				attributeKey: 'state',
				addAttributeValue: 'hidden',
				removeAttributeValue: 'active'
			};

			methods.htmlElement.toggleAttributeValue(dataForm);

			var formPosted = formSuccesContainer.querySelector(selectors.formPostedContainer);

			var dataPostedContainer = {
				element: formPosted,
				attributeKey: 'state',
				addAttributeValue: 'active',
				removeAttributeValue: 'hidden'
			};

			methods.htmlElement.toggleAttributeValue(dataPostedContainer);
		},

		getValueOfElement: {
			input: function (element) {
				var value;
				if (element.type && (element.type === 'radio' || element.type === 'checkbox')) {
					if (element.checked) {
						value = element.value.trim();
					}
				} else if (element.type) {
					value = element.value.trim();
				}
				return value;
			},

			textarea: function (element) {
				return element.value.trim();
			},

			select: function (element) {
				var value;
				if (element.type && element.type === 'select-one') {
					if (element.value) {
						value = element.value;
					}
				} else if (element.type && element.type === 'select-multiple') {
					value = [];
					if (element.value && element.options) {
						Object.keys(element.options).forEach(function (optionKey) {
							if (element.options[optionKey].selected) {
								value.push(element.options[optionKey].value);
							}
						});
					}
				}
				return value;
			}
		},

		serialize: function (form) {
			var formData = {
				formName: form.getAttribute('name') || null,
				action: form.getAttribute('action') || null,
				postData: {}
			};

			formData.postData = Array.prototype.slice.call(form.elements).reduce(function (data, item) {
				console.log(data)
				if (item && item.name) {
					if (!data[item.name]) {
						data[item.name] = {
							type: item.type,
							name: item.name,
							elementType: item.nodeName.toLowerCase(),
							required: item.dataset.required === 'true',
							valueCheck: item.dataset.valueCheck || item.type,
							valueKey: item.dataset.valueKey || 0,
							values: []
						};
					} else if (typeof data[item.name].valueKey === "number" && isFinite(data[item.name].valueKey) && Math.floor(data[item.name].valueKey) === data[item.name].valueKey) {
						data[item.name].valueKey++;
					}

					if (typeof methods.form.getValueOfElement[item.nodeName.toLowerCase()] === 'function') {
						if (methods.form.getValueOfElement[item.nodeName.toLowerCase()](item) && item.nodeName.toLowerCase() === 'select' && item.type === 'select-multiple') {
							data[item.name].values = methods.form.getValueOfElement[item.nodeName.toLowerCase()](item);
						} else if (methods.form.getValueOfElement[item.nodeName.toLowerCase()](item)) {
							if (item.dataset.valueKey) {
								data[item.name].values[item.dataset.valueKey] = methods.form.getValueOfElement[item.nodeName.toLowerCase()](item);
							} else {
								data[item.name].values.push(methods.form.getValueOfElement[item.nodeName.toLowerCase()](item));
							}
						}
					}
				}
				return data;
			}, {});
			return formData;
		}
	};

	methods.formValidation = {
		formData: function (data) {
			var errorData = {};
			Object.keys(data).forEach(function (key) {
				if (data[key].required === true) {
					var fieldData = {
						name: data[key],
						values: data[key].values[0],
						valueCheck: data[key].valueCheck
					};
					var validationResponse = methods.formValidation.fieldValidation(fieldData);
					if (validationResponse.hasError) {
						errorData[key] = {
							data: data[key],
							message: validationResponse.errorMessage
						};
					}
				}
			});
			return (Object.keys(errorData).length > 0 ? errorData : false);
		},

		fieldValidation: function (data) {
			var validationResponse = {
				hasError: false,
				errorMessage: null
			};

			if (!methods.formValidation.validationType.isNotEmpty(data.values)) {
				validationResponse.hasError = true;
				validationResponse.errorMessage = data.name + ' field is empty';
			} else if (methods.formValidation.validationType.isNotEmpty(data.values) && typeof methods.formValidation.validationType[data.valueCheck] === 'function') {
				if (!methods.formValidation.validationType[data.valueCheck](data.values)) {
					validationResponse.hasError = true;
					validationResponse.errorMessage = data.name + ' field is not correct filled';
				}
			}
			return validationResponse;
		},

		validationType: {
			isNotEmpty: function (value) {
				var valueIsNotEmpty = true;

				if (value === undefined) {
					valueIsNotEmpty = false;
				} else if ((typeof value === 'object' && Object.keys(value).length > 0) || value.length > 0) {
					valueIsNotEmpty = true;
					valueIsNotEmpty = true;
				} else {
					valueIsNotEmpty = false;
				}
				return valueIsNotEmpty;
			},

			text: function (value) {
				return true;
			},

			number: function (value) {
				var pattern = /^\d+$/;
				return pattern.test(value);
			},

			alphabetic: function (value) {
				var pattern = /^\d+$/;
				return !pattern.test(value);
			},

			email: function (value) {
				var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

				return pattern.test(value);
			},

			tel: function (value) {
				var pattern = /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/;
				return pattern.test(value);
			},

			dateFuture: function (date) {
				date.day = parseInt(date.day, 10);
				date.month = parseInt(date.month, 10) - 1;
				date.year = parseInt(date.year, 10) + 2000;

				var temp = new Date(date.year, date.month, date.day);
				var now = new Date();

				if (now < temp && temp.getDate() === date.day && temp.getMonth() === date.month && temp.getFullYear() === date.year) {
					return true;
				} else {
					return false;
				}
			}

		}
	};

	methods.sendData = {
		xhr: function (method, url, data) {
			var promise = new Promise(function (resolve, reject) {

				var request = new XMLHttpRequest();
				request.open(method, url);
				request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				request.send(JSON.stringify(data));
				request.onload = function () {
					if (request.status === 200) {
						resolve(request.response);
					} else {
						reject(request.statusText);
					}
				};
				request.onerror = function () {
					reject(request.statusText);
				};


				var responseData = {
					succesData: {
						page: '',
						formName: data.formName,
						responseTxt: 'Bedankt voor het invullen.'
					}
				};

				responseData = JSON.stringify(responseData);
				resolve(responseData);
			});
			return promise;
		},
		callback: {
			success: function (data) {
				return JSON.parse(data);
			},
			error: function (data) {
				//console.error(data);
			}
		}
	};

	methods.errorMessage = {
		setState: {
			hidden: function (element) {
				var data = {
					element: element.querySelector(selectors.errorMessageContainer),
					attributeKey: 'state',
					addAttributeValue: 'hidden',
					removeAttributeValue: 'active'
				};
				methods.errorMessage.toggleState(data);
			},
			active: function (element) {
				var data = {
					element: element.querySelector(selectors.errorMessageContainer),
					attributeKey: 'state',
					addAttributeValue: 'active',
					removeAttributeValue: 'hidden'
				};

				methods.errorMessage.toggleState(data);
			}
		},
		getState: function (element) {
			return element.querySelector(selectors.errorMessageContainer).getAttribute('state');
		},
		toggleState: function (data) {
			methods.htmlElement.toggleAttributeValue(data);
		}
	};


	methods.dateSelector = {
		fullChangeHandler: function (event) {
			var date = methods.dateSelector.convertFullToSeperated(elements.dateSelectorFullDate.value);
			elements.dateSelectorDay.value = date.day;
			elements.dateSelectorMonth.value = date.month;
			elements.dateSelectorYear.value = date.year.toString().slice(-2);
		},

		changeHandler: function (event) {
			var element;

			// cancel keyup-event if key was not a number or TAB or ENTER
			if (methods.dateSelector.testKeyUpEvent(event)) {
				methods.dateSelector.testValues();
				methods.dateSelector.applyState();

				if (event.type === 'keyup' || event.type === 'keydown') {
					element = event.currentTarget;
					if ((element.value.length >= methods.dateSelector.maxInputLength(element)) && (event.keyCode !== 16) && (event.keyCode !== 9) && (event.keyCode !== 8)) {
						methods.dateSelector.jumpToNextInput(element);
					}
				}
			} else {
				// this is a keydown being cancelled, thus no keyup occurs on this 'change'
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		},

		testValues: function (event) {
			state.age = {
				day: elements.dateSelectorDay.value,
				month: elements.dateSelectorMonth.value,
				year: elements.dateSelectorYear.value
			};

			if (state.age.day && state.age.month && state.age.year) {
				if (methods.formValidation.validationType.dateFuture(state.age)) {
					state.ageState = 'valid';
				} else {
					state.ageState = 'invalid';
				}
			} else if (state.age.day || state.age.month || state.age.year) {
				state.ageState = 'progress';
			} else {
				state.ageState = 'initial';
			}

			return (state.ageState === 'valid');
		},

		testFullDateSupport: function () {
			return (elements.dateSelectorFullDate.type === 'date');
		},

		testKeyUpEvent: function (event) {
			var isKeyUp = (event.type === 'keydown');
			var isTab = (event.keyCode === 9);
			var isEnter = (event.keyCode === 13);
			var isBackspace = (event.keyCode === 8);
			var isDelete = (event.keyCode === 46);
			var isNumeric = String.fromCharCode(event.keyCode).match(/[0-9]/);
			var isNumpad = (event.keyCode >= 96) && (event.keyCode <= 105);
			var isNumAndroid = (event.keyCode === 229);

			if (!isKeyUp) {
				return true;
			}

			if (isKeyUp && (isTab || isEnter || isNumeric || isBackspace || isDelete || isNumpad || isNumAndroid)) {
				return true;
			} else {
				return false;
			}
		},

		convertFullToSeperated: function (value) {
			value = new Date(value);
			return {
				day: value.getDate(),
				month: value.getMonth() + 1,
				year: value.getFullYear()
			};
		},

		checkInputLength: function (currentElement) {
			return currentElement.value.length;
		},

		maxInputLength: function (element) {
			return element.getAttribute('maxlength');
		},

		nextInput: function (currentElement) {
			return currentElement.getAttribute('data-nextfield');
		},

		jumpToNextInput: function (currentElement) {
			var nextInputData = methods.dateSelector.nextInput(currentElement) || undefined;
			var elementToFocus = nextInputData ? document.getElementById(nextInputData) : undefined;

			if (nextInputData && elementToFocus) {
				elementToFocus.focus();
			}
		},

		dateInput: function (options) {
			var current = options.current;
			var currentKeyCode = options.keyCode;
			var inputLength = methods.dateSelector.checkInputLength(current);
			var maxInputLength = methods.dateSelector.maxInputLength(current);

			if ((inputLength === maxInputLength) && (currentKeyCode !== 16) && (currentKeyCode !== 9)) {
				methods.dateSelector.jumpToNextInput(current);
			}
		},

		applyState: function (input) {
			if (input) {
				elements.dateSelectorContainer.setAttribute('state', input);
			} else {
				methods.dateSelector.testValues();

				elements.dateSelectorContainer.setAttribute('state', state.ageState);
			}
		},

		getContainer: function (element) {
			return element.querySelectorAll(selectors.dateFieldContainer) || false;
		},

		isStateInvalid: function (element) {
			var dateContainers = methods.dateSelector.getContainer(element);
			state.containerVariantDateInvalid = false;
			if (dateContainers) {
				[].slice.call(dateContainers).forEach(function (item) {
					if (item.getAttribute('state') !== 'valid') {
						state.containerVariantDateInvalid = true;
					}
				});
			}
			return state.containerVariantDateInvalid;
		}
	};

	methods.mount = function (viewport) {
		viewport = viewport || document;
		var found = document.querySelector(selectors.container);

		if (found) {
			elements.window = window;
			elements.body = document.querySelector('body');
			elements.viewport = viewport || document.querySelector(selectors.viewport);
			elements.formContainer = found;
			return true;
		} else {
			return false;
		}
	};

	methods.init = function (viewport) {
		if (elements.formContainer) {
			elements.formElement = elements.formContainer.querySelectorAll(selectors.formElement) || undefined;
			elements.requiredFields = elements.formContainer.querySelectorAll(selectors.requiredFields) || undefined;
			elements.postedContainers = elements.formContainer.querySelector(selectors.formPostedContainer) || undefined;
			elements.dateSelectorContainer = elements.formContainer.querySelector('[variant~="date"]');

			if (elements.dateSelectorContainer) {
				elements.dateSelectorDay = elements.dateSelectorContainer.querySelector('[variant~="day"]');
				elements.dateSelectorMonth = elements.dateSelectorContainer.querySelector('[variant~="month"]');
				elements.dateSelectorYear = elements.dateSelectorContainer.querySelector('[variant~="year"]');
				elements.dateSelectorFullDate = elements.dateSelectorContainer.querySelector('[variant~="full"]');
				elements.dateSelector = elements.dateSelectorContainer.querySelectorAll('[variant~="dateselector"]');
				elements.dateSelectorAllFields = elements.dateSelectorContainer.querySelectorAll('.input');
				state.fullDateSupport = methods.dateSelector.testFullDateSupport();

				state.isMobile = (elements.window.innerWidth < 700);
				if (elements.dateSelectorFullDate && state.fullDateSupport && state.isMobile) {

					elements.dateSelectorFullDate.setAttribute('state', 'active');
				}

				var dateSelector = [elements.dateSelectorDay, elements.dateSelectorMonth, elements.dateSelectorYear];

				Object.keys(dateSelector).forEach(function (key) {
					dateSelector[key].addEventListener('keydown', methods.dateSelector.changeHandler);
					dateSelector[key].addEventListener('keyup', methods.dateSelector.changeHandler);
					dateSelector[key].addEventListener('change', methods.dateSelector.changeHandler);
				});
			}

			Object.keys(elements.formElement).forEach(function (key) {
				elements.formElement[key].addEventListener('submit', methods.form.clickHandler);
			});

			Object.keys(elements.requiredFields).forEach(function (key) {
				elements.requiredFields[key].addEventListener('focusin', methods.fieldElement.focusIn);
				elements.requiredFields[key].addEventListener('focusout', methods.fieldElement.focusOut);
			});

			return true;
		} else {
			return false;
		}
	};

	methods.render = function (viewport) {
		if (elements.formContainer) {

			return true;
		} else {
			return false;
		}
	};

	methods.unmount = function () {
		if (elements.formContainer) {
			$(elements.formElement).off('submit', methods.form.clickHandler);
			$(elements.dateSelectorAllFields).on('click', methods.dateSelector.setFocus);
			$(elements.dateSelectorFullDate).on('change', methods.dateSelector.fullChangeHandler);
		}
	};

	return {
		mount: methods.mount,
		init: methods.init,
		unmount: methods.unmount,
		render: methods.render,

		selector: selectors.container
	};
}());

methods.modules = {
	'initAll': function (viewport) {
		Object.keys(modules).forEach( function (moduleName, key) {
			try {
				if (modules[moduleName].init) {
					var existed = modules[moduleName].init(viewport);
					if (existed) {
						// console.info('initialised module: ', moduleName);
					}
				}
			} catch (error) {
				// console.warn('failed to init module: ', moduleName);
			}
		});
	},
	'mountAll': function (viewport) {
		Object.keys(modules).forEach( function (moduleName, key) {
			try {
				if (modules[moduleName].mount) {
					var existed = modules[moduleName].mount(viewport);
					if (existed) {
						//console.info('mounted module: ', moduleName);
					}
				}
			} catch (error) {
				// console.warn('failed to mount module: ', moduleName);
			}
		});
	},
	'unmountAll': function () {
		Object.keys(modules).forEach( function (moduleName) {
			try {
				modules[moduleName].unmount();
			} catch (error) {
				//console.warn('failed to unmount module: ', moduleName);
				//console.error(error);
			}
		});
	},
	'renderAll': function () {
		Object.keys(modules).forEach( function (moduleName) {
			try {
				modules[moduleName].render();
			} catch (error) {
				//console.warn('failed to Render module: ', moduleName);
				//console.error(error);
			}
		});
	}
};
var modules = (window.modules = window.modules || {});

modules["general"] = (function() {
  "use strict";

  var elements, methods, accessibility;

  elements = {};
  methods = {};

  methods.htmlElement = {
    getAttribute: function(data) {
      if (data.element) {
        return data.element.getAttribute(data.attributeKey) || false;
      }
    },
    hasAttributeValue: function(data, attributeValue) {
      if (!attributeValue) {
        attributeValue = methods.htmlElement.getAttribute(data);
      }
      var regex = new RegExp(data.attributeValue, "gi");
      return regex.test(attributeValue);
    },
    addAttributeValue: function(data) {
      var attributeValue = methods.htmlElement.getAttribute(data);

      if (!methods.htmlElement.hasAttributeValue(data, attributeValue)) {
        if (attributeValue) {
          attributeValue = attributeValue + " " + data.attributeValue;
        } else {
          attributeValue = data.attributeValue;
        }
        data.element.setAttribute(data.attributeKey, attributeValue);
      }
      return true;
    },
    removeAttributeValue: function(data) {
      var attributeValue = methods.htmlElement.getAttribute(data);
      var hasAttributeValue = methods.htmlElement.hasAttributeValue(
        data,
        attributeValue
      );
      var valueRemoved = false;
      if (hasAttributeValue) {
        var regex = new RegExp(data.attributeValue, "gi");
        var newAttributeValue = attributeValue.replace(regex, "").trim();
        if (newAttributeValue) {
          data.element.setAttribute(data.attributeKey, newAttributeValue);
        } else {
          data.element.removeAttribute(data.attributeKey);
        }
        valueRemoved = true;
      }
      return valueRemoved;
    },
    toggleAttributeValue: function(data) {
      data.attributeValue = data.removeAttributeValue;
      var valueToggled = false;
      var removeAttributeValue = methods.htmlElement.removeAttributeValue(data);

      if (removeAttributeValue) {
        data.attributeValue = data.addAttributeValue;
        methods.htmlElement.addAttributeValue(data);
        valueToggled = true;
      }
      return valueToggled;
    },
    hasClass: function(element, value) {
      return (" " + element.className + " ").indexOf(" " + value + " ") > -1;
    },
    getClosestParentNode: function(data) {
      var element = data.currentElement;

      while (
        methods.htmlElement.hasClass(
          element,
          data.getParentElement.attributeValue
        ) === false
      ) {
        element = element.parentNode;
      }

      return element;
    },
    createElement: function(data) {
      const element = document.createElement(data.nodeName || "div");
      element.className = data.className || null;

      if (data && data.addAttributes) {
        data.addAttributes.forEach(function(attributeData) {
          attributeData.element = element;
          methods.htmlElement.addAttributeValue(attributeData);
        });
      }

      return element;
    },
  };

  methods.accessibility = {
    set: function(data) {
      methods.htmlElement.toggleAttributeValue(data);
      methods.accessibility.setLocalStore(data.element);
    },
    getFromElement: function(data) {
      return methods.htmlElement.getAttribute(data);
    },
    setLocalStore: function(data) {
      return (accessibility = methods.accessibility.getFromElement(data));
    },
    getLocalStore: function() {
      return accessibility;
    },
    dataMouse: function() {
      var data = {
        element: elements.body,
        attributeKey: "accessibility",
        addAttributeValue: "mouse",
        removeAttributeValue: "keyboard",
      };
      return data;
    },
    dataKeyboard: function() {
      var data = {
        element: elements.body,
        attributeKey: "accessibility",
        addAttributeValue: "keyboard",
        removeAttributeValue: "mouse",
      };

      return data;
    },
  };

  methods.eventListener = {
    mouse: function() {
      addEventListener("keydown", methods.eventListener.setKeyboard);
      removeEventListener("mousedown", methods.eventListener.setMouse);
    },
    keyboard: function() {
      addEventListener("mousedown", methods.eventListener.setMouse);
      removeEventListener("mousedown", methods.eventListener.setKeyboard);
    },
    setMouse: function() {
      var data = methods.accessibility.dataMouse();
      methods.accessibility.set(data);
      methods.eventListener.mouse();
    },
    setKeyboard: function() {
      var data = methods.accessibility.dataKeyboard();
      methods.accessibility.set(data);
      methods.eventListener.keyboard();
    },
  };

  methods.init = function(viewport) {
    elements.body = document.querySelector("body");
    var data = {
      element: elements.body,
      attributeKey: "accessibility",
    };

    data.addAttributeValue = methods.accessibility.getFromElement(data);

    methods.accessibility.setLocalStore(data);

    if (methods.accessibility.getLocalStore() === "mouse") {
      methods.eventListener.mouse();
    } else if (methods.accessibility.getLocalStore() === "keyboard") {
      methods.eventListener.keyboard();
    }
  };

  methods.render = function(viewport) {
    return true;
  };

  methods.mount = function(viewport) {
    return true;
  };

  methods.unmount = function() {};

  return {
    mount: methods.mount,
    init: methods.init,
    unmount: methods.unmount,
    render: methods.render,
    htmlElement: methods.htmlElement,
  };
})();

class fileUploadShowPrevieuw {
  constructor(fileUploadContainer) {
    this.fileUploadContainer = fileUploadContainer;
    this.cachedFileArray = [];

    this.inputTypeFile = fileUploadContainer.querySelector('[type="file"]');
    this.inputNameFile = fileUploadContainer.querySelector('[name="file"]');
    this.inputLabel = fileUploadContainer.querySelector(
      ".upload-field-control"
    );
    this.imagePreviewContainer = fileUploadContainer.querySelector(
      '[variant="file-preview"]'
    );
    this.eraseImageButton = fileUploadContainer.querySelector(
      ".erase-file-upload"
    );

    this.backgroundImage = {
      baseImage:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiQAAAD6CAMAAACmhqw0AAAA+VBMVEUAAAD29u3u7unt7ent7enu7uju7uihoqCio6Gio6KjpKOkpaSmpqSmp6WoqKaqq6mqq6qrq6qsrautrauur62wsa6xsa+xsrCys7GztLK0tbK1trS2t7S3t7W4uba5ure6u7e7vLm8vbu9vrvAwL3Awb3DxMHFxcPGxsPHx8TIycXLzMjLzMnMzMnNzsrPz8vP0MzQ0M3S0s/U1NDV1dLX19TY2NTY2NXZ2dba2tXb29bc3Nfc3Njc3dnd3dre3tre39vg4Nvh4dzi4t3i4t7j497k5N/k5ODl5eDl5eHl5uLm5uHn5+Lo6OPp6eTq6uXr6+bs7Oft7eh54KxIAAAAB3RSTlMAHKbl5uztvql9swAABA1JREFUeNrt3VlT01AYgOG0oEEE910URNzFBVFcqCgKirLU/P8fI3QYbEOSdtrMyJzzvHfMlFx833NBQuY0SRrN8UwqabzZSJLGaYNQVacaSdMUVF0zGTMEVTeWmIH6BYkgESSCRJAIEkEiSCRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIBIkEiSARJIJEkAgSQSJIJEgEiSARJIJEkAgSQSJBIkgEiSARJIJEkAgSCRJBIkgEiSARJIJEgkSQ5PvxbdS+tyEJuZVb0+noTV579geSQGs/SOvqxiYkYfYwra+rbUhC7NNEjUjSJ5CE2P06jaTnIAmxKwe7vb468t3N14WOki1IAuzMwWrf1HCh3Q6S95AEWGe1b0/WlSCBBBJIIAkdSXvt1aNXa21IICld7dJU5+epJUggKV7tzuzRA4/ZHUggKVrtfNdjsXlIIClY7XLPw9NlSCA5vtqLPUguQgLJsdX+zv0fZhsSSPKrXckhWSn5jV8zG5DEiuR1DsnrEiOX0vMbkESKZDWHZLXMSFqsBJIIkOz1vn40sVdqpFgJJDHc3dzsQXKzwkihEkhiQLI+2f3y+3qVkSIlkMSAJFvsQrJYbaRACSRRIMlenj0UcPZlPyPHlUASB5Jsc+7cwevMc5v9jRxTAkkkSPbb+riVZYMYySuBJB4kJRUYySmBJHYkhUZ6lUASOZISIz1KIIkbSamRbiWQxIZkvT2YkS4lkESGpDV9tz2YkX9KIIkLSWs6TY+U9DFypASSqJC0OicfHSrpa2T/k5BEh6R1eDpWR8kARtIZSGJD0jo6QW1fySBGIIkOSavrlL27PwcxAklsSFo9JzFOppBAkl9ta5jTOiGJCslQRiCJCslwRiCJCcmQRiCJCMmwRiCJB8mXoU+YhyQaJM9TSCCBBBJIIIEEEkgggQQSSCCJAsnyzLA9hiQWJCfnSpBAAgkkkATXxFCnPxfU7iB5B0mAXT5Y7Z3t0Y087SDZgCTA7tX6bZ5TGSQBtlwrkgVIgmy+RiMXdiEJsp3b9Rn5nEESaC/O1/P3yMJuBkm4bX94O2rvNiKbWXRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRIJEkAgSQSJIBIkgESQSJIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIBIkEiSARJIJEkAgSQSJIJEgEiSARJIJEkAgSCRJBIkgEiSARJIJEkEiQCBJBIkgEiSARJIJEgkSQCBJBIkgEiSARJBIkgkSQ6P8gGTMDVTeWNA1B1TWTxmlTUFWnGknSaI4bhMoabzaSv+4BHFVoHZzfAAAAAElFTkSuQmCC",
      successPdf:
        "data:image/png;base64,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",
      successVideo:
        "data:image/png;base64,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",
      successMultiple:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAD6CAYAAABXq7VOAAAABGdBTUEAALGPC/xhBQAAE3FJREFUeAHt3UtsXNd5B/AzEmmbIiVZjkjRTiJLiZ5W2jh2Ejtt0wApUDRA0EXSfTdZtat01V0eKLrtqpvE6+5qIMugQFOkSRzbkoy6UGQrekVOTUokJdF8mg9N59KRbJmv4cydmXu/+xuDMDlz77nn+31H+mvuzOXUpqbG68mNAAECBAgQKLXArlLP3uQJECBAgACBNQGBbiEQIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQIECAAAGBbg0QIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQIECAAAGBbg0QIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQIECAAAGBbg0QIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQIECAAAGBbg0QIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQIECAAAGBbg0QIECAAIEAAgI9QBOVQIAAAQIEBLo1QIAAAQIEAggI9ABNVAIBAgQIEBDo1gABAgQIEAggINADNFEJBAgQIEBAoFsDBAgQIEAggIBAD9BEJRAgQIAAAYFuDRAgQIAAgQACAj1AE5VAgAABAgQEujVAgAABAgQCCAj0AE1UAgECBAgQEOjWAAECBAgQCCAg0AM0UQkECBAgQECgWwMECBAgQCCAgEAP0EQlECBAgAABgW4NECBAgACBAAICPUATlUCAAAECBAS6NUCAAAECBAIICPQATVQCAQIECBAQ6NYAAQIECBAIICDQAzRRCQQIECBAQKBbAwQIECBAIICAQA/QRCUQ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",
    };

    this.setBackgroundPlaceholder();
    this.eventHandler();
  }

  setBackgroundPlaceholder() {
    this.imagePreviewContainer.style.backgroundImage =
      "url('" + this.backgroundImage.baseImage + "')";
  }

  eventHandler() {
    this.inputTypeFile.addEventListener("change", this.uploadFile.bind(this));
    this.eraseImageButton.addEventListener(
      "click",
      this.removeImagesAndResetBackgroundPlaceholder.bind(this)
    );
  }

  removeImagesAndResetBackgroundPlaceholder() {
    this.cachedFileArray = [];
    this.inputTypeFile.value = "";

    this.setInputNameFileValue();
    this.setInputFileLabelText();
    this.setBackgroundPreviewContainer();
  }

  uploadFile(event) {
    let inputfieldElement = event.currentTarget;
    let uploadedFiles = inputfieldElement.files;
    let totalUploadedFiles = uploadedFiles.lenght;

    this.cachedFileArray = [];

    new Promise(
      function(resolve, reject) {
        Object.keys(uploadedFiles).forEach(
          function(key) {
            this.cachedFileArray[key] = uploadedFile;

            let reader = new FileReader();
            reader.readAsDataURL(uploadedFile);
            reader.onload = function() {
              this.cachedFileArray[key]["dataUrl"] = reader.result;

              if (this.cachedFileArray.length - 1 === parseInt(key)) {
                resolve(this.cachedFileArray);
              }
            }.bind(this);
          }.bind(this)
        );
      }.bind(this)
    ).then(
      function(filesArrayAsDataUrl) {
        this.setInputNameFileValue();
        this.setInputFileLabelText();
        this.setBackgroundPreviewContainer();
      }.bind(this)
    );
  }

  setInputNameFileValue() {
    if (this.cachedFileArray.length > 0) {
      let value = [];
      Object.keys(this.cachedFileArray).forEach(
        function(key) {
          // let newArray = ['filename', data]
          value.push({
            dataUrl: this.cachedFileArray[key].dataUrl,
            name: this.cachedFileArray[key].name,
          });
        }.bind(this)
      );
      this.inputNameFile.value = JSON.stringify(value);
    } else {
      this.inputNameFile.value = "";
    }
  }

  setInputFileLabelText() {
    switch (this.cachedFileArray.length) {
      case 0:
        this.inputLabel.innerHTML = "";
        break;
      case 1:
        this.inputLabel.innerHTML = this.cachedFileArray[0].name;
        break;
      default:
        this.inputLabel.innerHTML =
          this.cachedFileArray.length + " files selected";
    }
  }

  setBackgroundPreviewContainer() {
    let backgroundUrl;

    switch (this.cachedFileArray.length) {
      case 0:
        backgroundUrl = this.backgroundImage.baseImage;
        break;
      case 1:
        if (this.cachedFileArray[0].type.match("image/")) {
          backgroundUrl = this.cachedFileArray[0]["dataUrl"];
        } else if (this.cachedFileArray[0].type.match("application/pdf")) {
          backgroundUrl = this.backgroundImage.successPdf;
        } else if (this.cachedFileArray[0].type.match("video/")) {
          backgroundUrl = this.backgroundImage.successVideo;
        }
        break;
      default:
        backgroundUrl = this.backgroundImage.successMultiple;
    }

    this.imagePreviewContainer.style.backgroundImage =
      "url('" + backgroundUrl + "')";
  }
}

export default fileUploadShowPrevieuw;

(function() {
  methods.modules.mountAll("body");
  methods.modules.initAll("body");
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRhY3RzLmpzIiwiZmlsZXVwbG9hZC5qcyIsImZvcm0uanMiLCJtb2R1bGVzLmpzIiwib3V0bGluZS5qcyIsImZpbGUtdXBsb2FkLmpzIiwiZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL3FCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XG5cbm1vZHVsZXNbXCJhcGktZm9ybVwiXSA9IChmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGVsZW1lbnRzLCBtZXRob2RzLCBzZWxlY3RvcnMsIHN0YXRlLCBjb250YWN0SXRlbXM7XG5cbiAgZWxlbWVudHMgPSB7fTtcbiAgbWV0aG9kcyA9IHt9O1xuICBzZWxlY3RvcnMgPSB7XG4gICAgdmlld3BvcnQ6IFwiYm9keVwiLFxuXG4gICAgY29udGFpbmVyOiAnLmNvbnRhaW5lclt2YXJpYW50PVwiYXBpLWZvcm1cIl0nLFxuXG4gICAgZm9ybUNvbnRhaW5lcjogJy5jb250YWluZXJbdmFyaWFudH49XCJhcGktZm9ybVwiXScsXG4gICAgZm9ybUVsZW1lbnQ6ICdbdmFyaWFudD1cImFwaS1mb3JtXCJdIGZvcm0nLFxuICAgIGZvcm1GdWxsRm9ybTogJ1t2YXJpYW50PVwiZnVsbC1mb3JtXCJdJyxcblxuICAgIGZvcm1CdXR0b246IFwiLnN1Ym1pdC1idXR0b25cIixcblxuICAgIGRhdGVGaWVsZENvbnRhaW5lcjogJ1t2YXJpYW50PVwiZGF0ZVwiXScsXG5cbiAgICByZXF1aXJlZEZpZWxkczogXCJpbnB1dFtkYXRhLXJlcXVpcmVkXVwiLFxuICAgIGZvcm1Qb3N0ZWRDb250YWluZXI6ICdbdmFyaWFudH49XCJjdXN0b20tZm9ybS1wb3N0ZWRcIl0nLFxuICAgIGVycm9yTWVzc2FnZUNvbnRhaW5lcjogJ1t2YXJpYW50fj1cImVycm9yLW1lc3NhZ2VcIl0nLFxuICB9O1xuICBzdGF0ZSA9IHt9O1xuICBjb250YWN0SXRlbXMgPSB7fTtcblxuICBtZXRob2RzLmZvcm0gPSB7XG4gICAgYWRkSXRlbTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBmb3JtRWxlbWVudHMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmVsZW1lbnRzO1xuICAgICAgdmFyIHBvc3REYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAgIC5jYWxsKGZvcm1FbGVtZW50cylcbiAgICAgICAgLnJlZHVjZShmdW5jdGlvbihkYXRhLCBpdGVtLCBjdXJyZW50SW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBcImZpbGVcIikge1xuICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBKU09OLnBhcnNlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YVtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSwge30pO1xuXG4gICAgICBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0c1wiLCB7XG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLm9rID09PSB0cnVlICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBkZWxldGVJdGVtOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGN1cnJlbnRFbGVtZW50OiBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICBnZXRQYXJlbnRFbGVtZW50OiB7XG4gICAgICAgICAgb25BdHRyaWJ1dGU6IFwiY2xhc3NcIixcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVsZXRlZEVsZW1lbnQgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5nZXRDbG9zZXN0UGFyZW50Tm9kZShcbiAgICAgICAgZGF0YVxuICAgICAgKTtcblxuICAgICAgZmV0Y2goZXZlbnQuY3VycmVudFRhcmdldC5hY3Rpb24sIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiZGVsZXRlXCIsXG4gICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgPT09IHRydWUgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGRlbGV0ZWRFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgfTtcblxuICBtZXRob2RzLmRhdGEgPSB7XG4gICAgZ2V0Q29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHNcIikudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uub2sgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNwb25zZS5qc29uKCkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuc2V0Q29udGFjdHMoanNvbik7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3RzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIk5ldHdvcmsgcmVxdWVzdCBmb3IgcHJvZHVjdHMuanNvbiBmYWlsZWQgd2l0aCByZXNwb25zZSBcIiArXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyArXG4gICAgICAgICAgICAgIFwiOiBcIiArXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c1RleHRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0Q29udGFjdHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGNvbnRhY3RJdGVtcyA9IGRhdGE7XG4gICAgfSxcblxuICAgIGNvbnRhY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGFjdEl0ZW1zO1xuICAgIH0sXG5cbiAgICBzaG93Q29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29udGFjdHMgPSBtZXRob2RzLmRhdGEuY29udGFjdHMoKTtcbiAgICAgIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIi5jb250YWN0LWl0ZW1zLmNvbnRhaW5lclwiXG4gICAgICApO1xuXG4gICAgICBsZXQgY29udGFjdHNUb0hUTUwgPSBjb250YWN0cy5yZWR1Y2UoZnVuY3Rpb24oXG4gICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIsXG4gICAgICAgIGN1cnJlbnRDb250YWN0LFxuICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgIGFycmF5XG4gICAgICApIHtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgIC8vIGNyZWF0ZSBjb250ZW50LWl0ZW1zIGNvbnRhaW5lciB3aGVuIHRoZSByZWR1Y2VyIGluZGV4ID0gMFxuICAgICAgICAgIGNvbnN0IGRhdGFDb250YWN0SXRlbXNDb250YWluZXIgPSB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1pdGVtcyBjb250YWluZXJcIixcbiAgICAgICAgICAgIG5vZGVOYW1lOiBcImFydGljbGVcIixcbiAgICAgICAgICB9O1xuICAgICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb250YWN0IGl0ZW0gY29udGFpbmVyXG4gICAgICAgIGNvbnN0IGRhdGFDb250YWN0SXRlbUNvbnRhaW5lciA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiLFxuICAgICAgICAgIG5vZGVOYW1lOiBcInNlY3Rpb25cIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRDb250YWluZXJFbGVtZW50ID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YUNvbnRhY3RJdGVtQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBBdmF0YXIgY29udGFpbmVyXG4gICAgICAgIGNvbnN0IGF2YXRhckNvbnRhaW5lciA9IHtcbiAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImF2YXRhclwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LW5hbWUgY29udGFpbmVyXCIsXG4gICAgICAgICAgbm9kZU5hbWU6IFwiZGl2XCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50QXZhdGFyQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoYXZhdGFyQ29udGFpbmVyKTtcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudENvbnRhY3QpO1xuICAgICAgICBjdXJyZW50QXZhdGFyQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAgICAgXCJ1cmwoJ1wiICsgY3VycmVudENvbnRhY3QuZmlsZVswXS5kYXRhVXJsICsgXCInKVwiO1xuXG4gICAgICAgIC8vIENvbnRhY3QgTmFtZSBjb250YWluZXIgYW5kIGNoaWxkc1xuICAgICAgICBjb25zdCBkYXRhTmFtZUNvbnRhaW5lciA9IHtcbiAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcIm5hbWVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1uYW1lIGNvbnRhaW5lclwiLFxuICAgICAgICAgIG5vZGVOYW1lOiBcImRpdlwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudE5hbWVDb250YWluZXIgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgIGRhdGFOYW1lQ29udGFpbmVyXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudENvbnRhY3ROYW1lID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXG4gICAgICAgICAgY3VycmVudENvbnRhY3QuZmlyc3RuYW1lICsgXCIgXCIgKyBjdXJyZW50Q29udGFjdC5sYXN0bmFtZVxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50TmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50Q29udGFjdE5hbWUpO1xuXG4gICAgICAgIC8vIENvbnRhY3QgUGhvbmUgY29udGFpbmVyIGFuZCBjaGlsZHNcbiAgICAgICAgY29uc3QgZGF0YVBob25lQ29udGFpbmVyID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwicGhvbmVudW1iZXJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1waG9uZSBjb250YWluZXJcIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUNvbnRhaW5lciA9IG1vZHVsZXNbXG4gICAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgICAgXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KGRhdGFQaG9uZUNvbnRhaW5lcik7XG5cbiAgICAgICAgLy8gQ29udGFjdCBwaG9uZSB3b3JrIGxhYmVsXG4gICAgICAgIGNvbnN0IGRhdGFQaG9uZUxhYmVsID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwibGFiZWxcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1waG9uZSB1bml0XCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbCA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgZGF0YVBob25lTGFiZWxcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuXG4gICAgICAgIC8vIENvbnRhY3QgcGhvbmUgd29yayB2YWx1ZVxuICAgICAgICBjb25zdCBkYXRhUGhvbmVWYWx1ZSA9IHtcbiAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcInZhbHVlXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtcGhvbmUgdW5pdFwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudFBob25lVmFsdWVXb3JrID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVBob25lVmFsdWUpO1xuXG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbFdvcmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJ3b3JrXCIpO1xuICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxXb3JrVW5pdCA9IGN1cnJlbnRQaG9uZUxhYmVsO1xuICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxXb3JrID0gY3VycmVudFBob25lTGFiZWxFbGVtZW50O1xuXG4gICAgICAgIGN1cnJlbnRQaG9uZUxhYmVsV29yay5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVMYWJlbFdvcmtUZXh0KTtcbiAgICAgICAgY3VycmVudFBob25lTGFiZWxXb3JrVW5pdC5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVMYWJlbFdvcmspO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQaG9uZVZhbHVlV29ya1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICBjdXJyZW50Q29udGFjdC5waG9uZVdvcmsgfHwgXCJcIlxuICAgICAgICApO1xuXG4gICAgICAgIGN1cnJlbnRQaG9uZVZhbHVlV29yay5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVWYWx1ZVdvcmtUZXh0KTtcblxuICAgICAgICBjdXJyZW50UGhvbmVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudFBob25lTGFiZWxXb3JrVW5pdCk7XG4gICAgICAgIGN1cnJlbnRQaG9uZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVWYWx1ZVdvcmspO1xuXG4gICAgICAgIC8vIENvbnRhY3QgUmVtb3ZlIGNvbnRhaW5lciBhbmQgY2hpbGRzXG4gICAgICAgIGNvbnN0IGRhdGFSZW1vdmVDb250YWluZXIgPSB7XG4gICAgICAgICAgYWRkQXR0cmlidXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJkZWxldGVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1kZWxldGUgY29udGFpbmVyXCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50UmVtb3ZlQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVJlbW92ZUNvbnRhaW5lcik7XG5cbiAgICAgICAgY29uc3QgZGF0YUJ1dHRvbiA9IHtcbiAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ0eXBlXCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcInN1Ym1pdFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5vZGVOYW1lOiBcImJ1dHRvblwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudFJlbW92ZUJ1dHRvbiA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgZGF0YUJ1dHRvblxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjdXJyZW50UmVtb3ZlQnV0dG9uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgIFwiUmVtb3ZlIGNvbnRhY3RcIlxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UmVtb3ZlQnV0dG9uLmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVCdXR0b25UZXh0KTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Q29udGFjdFJlbW92ZVVybCA9XG4gICAgICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHMvXCIgKyBjdXJyZW50Q29udGFjdC5pZDtcblxuICAgICAgICBjb25zdCBkYXRhUmVtb3ZlRm9ybSA9IHtcbiAgICAgICAgICBub2RlTmFtZTogXCJmb3JtXCIsXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtZGVsZXRlIGNvbnRhaW5lclwiLFxuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcImFjdGlvblwiLFxuICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogY3VycmVudENvbnRhY3RSZW1vdmVVcmwsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGN1cnJlbnRSZW1vdmVGb3JtID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICBkYXRhUmVtb3ZlRm9ybVxuICAgICAgICApO1xuXG4gICAgICAgIGN1cnJlbnRSZW1vdmVGb3JtLmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVCdXR0b24pO1xuXG4gICAgICAgIGN1cnJlbnRSZW1vdmVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbWV0aG9kcy5mb3JtLmRlbGV0ZUl0ZW0pO1xuICAgICAgICBjdXJyZW50UmVtb3ZlQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVGb3JtKTtcblxuICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50QXZhdGFyQ29udGFpbmVyKTtcbiAgICAgICAgY3VycmVudENvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoY3VycmVudE5hbWVDb250YWluZXIpO1xuICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVDb250YWluZXIpO1xuICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50UmVtb3ZlQ29udGFpbmVyKTtcblxuICAgICAgICBuZXdDb250YWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRDb250YWluZXJFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIG5ld0NvbnRhY3RDb250YWluZXI7XG4gICAgICB9LCBbXSk7XG5cbiAgICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKVxuICAgICAgICAucmVwbGFjZUNoaWxkKGNvbnRhY3RzVG9IVE1MLCBjb250YWN0Q29udGFpbmVyKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XG4gICAgdmFyIGZvdW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuICAgIGlmIChmb3VuZCkge1xuICAgICAgZWxlbWVudHMud2luZG93ID0gd2luZG93O1xuICAgICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgICAgZWxlbWVudHMudmlld3BvcnQgPVxuICAgICAgICB2aWV3cG9ydCB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy52aWV3cG9ydCk7XG4gICAgICBlbGVtZW50cy5mb3JtQ29udGFpbmVyID0gZm91bmQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2RzLmluaXQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XG4gICAgICBlbGVtZW50cy5mb3JtRWxlbWVudCA9XG4gICAgICAgIGVsZW1lbnRzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuZm9ybUVsZW1lbnQpIHx8XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50W2tleV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcInN1Ym1pdFwiLFxuICAgICAgICAgIG1ldGhvZHMuZm9ybS5hZGRJdGVtXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzKCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICBpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgIE9iamVjdC5rZXlzKGVsZW1lbnRzLmZvcm1FbGVtZW50KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBlbGVtZW50cy5mb3JtRWxlbWVudFtrZXldLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJzdWJtaXRcIixcbiAgICAgICAgICBtZXRob2RzLmZvcm0uYWRkSXRlbVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5jb250YWluZXIsXG4gIH07XG59KSgpO1xuIiwidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XG5cbm1vZHVsZXNbXCJjb250YWN0c1wiXSA9IChmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGVsZW1lbnRzLCBtZXRob2RzLCBzdGF0ZSwgY29udGFjdEl0ZW1zO1xuXG4gIGVsZW1lbnRzID0ge307XG4gIG1ldGhvZHMgPSB7fTtcbiAgc3RhdGUgPSB7fTtcbiAgY29uc3Qgc2VsZWN0b3JzID0ge1xuICAgIHZpZXdwb3J0OiBcImJvZHlcIixcbiAgICBjb250YWluZXI6ICcuY29udGFpbmVyW3ZhcmlhbnR+PVwiY29udGFjdHNcIl0nLFxuICAgIGNvbnRhY3RMaXN0SXRlbXNDb250YWluZXI6IFwiLmNvbnRhY3QtbGlzdC1pdGVtcy5jb250YWluZXJcIixcbiAgICBjb250YWN0TGlzdEl0ZW1zVW5pdDogXCIuY29udGFjdC1saXN0LWl0ZW1zLnVuaXRcIixcbiAgICBjb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyOiBcIi5jb250YWN0LWxpc3Qtc2VhcmNoLmNvbnRhaW5lclwiLFxuICAgIGNvbnRhY3RJdGVtQ29udGFpbmVyOiBcIi5jb250YWN0LWl0ZW0ud3JhcHBlclwiLFxuICAgIGNvbnRhY3RJdGVtVW5pdDogXCIuY29udGFjdC1pdGVtLnVuaXRcIixcbiAgICBjb250YWN0QnV0dG9uQ29udGFpbmVyOiBcIi5jb250YWN0LWJ1dHRvbi5jb250YWluZXJcIixcbiAgfTtcblxuICBjb250YWN0SXRlbXMgPSB7fTtcblxuICBtZXRob2RzLmRhdGEgPSB7XG4gICAgZ2V0Q29udGFjdHNGcm9tQXBpOiBmdW5jdGlvbigpIHtcbiAgICAgIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Bvc3RzXCIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgcmVzcG9uc2UuanNvbigpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgICAgICAgICAgbWV0aG9kcy5kYXRhLnNldENvbnRhY3RzKGpzb24pO1xuICAgICAgICAgICAgbWV0aG9kcy5kYXRhLnNob3dDb250YWN0cygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJOZXR3b3JrIHJlcXVlc3QgZm9yIHByb2R1Y3RzLmpzb24gZmFpbGVkIHdpdGggcmVzcG9uc2UgXCIgK1xuICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgK1xuICAgICAgICAgICAgICBcIjogXCIgK1xuICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNUZXh0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldENvbnRhY3RzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBjb250YWN0SXRlbXMgPSBkYXRhO1xuICAgIH0sXG5cbiAgICBnZXRDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY29udGFjdEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGFjdEl0ZW1zO1xuICAgIH0sXG5cbiAgICBnZXRDb250YWN0QnlJZDogZnVuY3Rpb24oY29udGFjdElkKSB7XG4gICAgICBpZiAoY29udGFjdEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICB9XG4gICAgICBsZXQgY29udGFjdEl0ZW07XG4gICAgICBPYmplY3Qua2V5cyhjb250YWN0SXRlbXMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChjb250YWN0SXRlbXNba2V5XS5pZCA9PSBjb250YWN0SWQpIHtcbiAgICAgICAgICByZXR1cm4gKGNvbnRhY3RJdGVtID0gY29udGFjdEl0ZW1zW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGNvbnRhY3RJdGVtO1xuICAgIH0sXG4gICAgc2hvd0NvbnRhY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNvbnRhY3RzID0gbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzKCk7XG4gICAgICBjb25zdCBjb250YWN0SXRlbXNVbml0ID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICBcImNvbnRhY3QtbGlzdC1pdGVtcyB1bml0XCJcbiAgICAgICk7XG5cbiAgICAgIGlmICghY29udGFjdEl0ZW1zVW5pdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBsZXQgY29udGFjdHNUb0hUTUwgPSBjb250YWN0cy5yZWR1Y2UoZnVuY3Rpb24oXG4gICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIsXG4gICAgICAgIGN1cnJlbnRDb250YWN0LFxuICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgIGFycmF5XG4gICAgICApIHtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgIC8vIGNyZWF0ZSBjb250ZW50LWl0ZW1zIGNvbnRhaW5lciB3aGVuIHRoZSByZWR1Y2VyIGluZGV4ID0gMFxuICAgICAgICAgIGNvbnN0IGRhdGFDb250YWN0SXRlbXNDb250YWluZXIgPSB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1saXN0LWl0ZW1zIHVuaXRcIixcbiAgICAgICAgICAgIG5vZGVOYW1lOiBcImFydGljbGVcIixcbiAgICAgICAgICB9O1xuICAgICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lclxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb250YWN0IGl0ZW0gY29udGFpbmVyXG4gICAgICAgIGNvbnN0IGRhdGFDb250YWN0SXRlbUNvbnRhaW5lciA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1saXN0LWl0ZW0gd3JhcHBlclwiLFxuICAgICAgICAgIG5vZGVOYW1lOiBcInNlY3Rpb25cIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRDb250YWluZXJFbGVtZW50ID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YUNvbnRhY3RJdGVtQ29udGFpbmVyKTtcblxuICAgICAgICBsZXQgY29udGFjdExpc3RJdGVtSHRtbCA9IGBcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuaWR9XCIgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSBjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxmaWd1cmUgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1hdmF0YXJcIj5cbiAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImltYWdlXCIgc3JjPVwiJHtjdXJyZW50Q29udGFjdC5maWxlWzBdLmRhdGFVcmx9XCIgLz5cbiAgICAgICAgICAgIDwvZmlndXJlPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLW5hbWVcIj5cbiAgICAgICAgICAgICAgJHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAke2N1cnJlbnRDb250YWN0LmZhdm9yaXRlXG4gICAgICAgICAgICAgID8gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1saXN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tZmF2b3JpdGVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRpdGxlPmljb25zPC90aXRsZT5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zOS45ODYsNDcuNkwyNS4xNDEsMzkuOCwxMC4zLDQ3LjZsMi44MzUtMTYuNTNMMS4xMjIsMTkuMzY2bDE2LjYtMi40MTJMMjUuMTQxLDEuOTE1bDcuNDIzLDE1LjAzOSwxNi42LDIuNDEyTDM3LjE1MSwzMS4wNzNaXCIgZmlsbD1cIiM2NzY3NjdcIi8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgICAgICAgOiBcIlwifVxuICAgICAgICAgICAgPC9idXR0b24+YDtcblxuICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5pbm5lckhUTUwgPSBjb250YWN0TGlzdEl0ZW1IdG1sO1xuXG4gICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudENvbnRhaW5lckVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gbmV3Q29udGFjdENvbnRhaW5lcjtcbiAgICAgIH0sIFtdKTtcblxuICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyLmNvbnRhY3RMaXN0QnV0dG9uKFxuICAgICAgICBjb250YWN0c1RvSFRNTC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGFjdC1saXN0LWl0ZW0gY29udGFpbmVyXCIpLFxuICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3QsXG4gICAgICAgIFwiYWRkXCIsXG4gICAgICAgIFwiY2xpY2tcIlxuICAgICAgKTtcblxuICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGNvbnN0IG9sZENvbnRlbnRJdGVtVW5pdCA9IGNvbnRhY3RJdGVtc1VuaXRbMF07XG4gICAgICAgIGxldCByZXBsYWNlZE5vZGUgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICBjb250YWN0c1RvSFRNTCxcbiAgICAgICAgICBvbGRDb250ZW50SXRlbVVuaXRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgY29udGFjdEl0ZW1zVW5pdFswXS5jaGlsZEVsZW1lbnRDb3VudCA9PT1cbiAgICAgICAgICBjb250YWN0c1RvSFRNTC5jaGlsZEVsZW1lbnRDb3VudFxuICAgICAgICApIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGxhY2VkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBtZXRob2RzLmVsZW1lbnRXaWR0aC5maXhlZENvbnRhaW5lcigpO1xuXG4gICAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5jb250YWN0TGlzdEJ1dHRvbihcbiAgICAgICAgICBkYXRhLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250YWN0LWxpc3QtaXRlbSBjb250YWluZXJcIiksXG4gICAgICAgICAgbWV0aG9kcy5kYXRhLnNob3dDb250YWN0LFxuICAgICAgICAgIFwicmVtb3ZlXCIsXG4gICAgICAgICAgXCJjbGlja1wiXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dDb250YWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc3QgY3VycmVudENvbnRhY3QgPSBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdEJ5SWQoXG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWVcbiAgICAgICk7XG4gICAgICBjb25zdCBkYXRhQ29udGFjdExpc3RXcmFwcGVyID0ge1xuICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1saXN0IHdyYXBwZXJcIixcbiAgICAgICAgbm9kZU5hbWU6IFwiYWN0aW9uXCIsXG4gICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgYWF0dHJpYnV0ZVZhbHVlOiBcImNvbnRhY3QtaXRlbVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgbGV0IGN1cnJlbnRDb250YWluZXJFbGVtZW50ID0gbW9kdWxlc1tcbiAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhQ29udGFjdExpc3RXcmFwcGVyKTtcbiAgICAgIGxldCBjb250ZW50SXRlbVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICBjb25zdCBjb250YWN0SXRlbSA9IGBcbjxhcnRpY2xlIGNsYXNzPVwiY29udGFjdC1pdGVtIHdyYXBwZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtXCI+XG4gIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0taGVhZGVyXCI+XG4gICAgPGZpZ3VyZSBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1hdmF0YXJcIj5cbiAgICAgIDxpbWcgY2xhc3M9XCJpbWFnZVwiIHNyYz1cIiR7Y3VycmVudENvbnRhY3QuZmlsZVswXS5kYXRhVXJsfVwiPlxuICAgIDwvZmlndXJlPlxuICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tbmFtZVwiPlxuICAgICAgJHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lfVxuICAgIDwvZGl2PlxuXG4gIDwvc2VjdGlvbj5cblxuICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWJvZHktY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtbGFiZWxcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cInBob25lV29ya1wiPndvcms8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZFwiPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVXb3JrXCIgbmFtZT1cInBob25lV29ya1wiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCIgZGlzYWJsZWQgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtbGFiZWxcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cInBob25lUHJpdmF0ZVwiPmhvbWU8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZFwiPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVQcml2YXRlXCIgbmFtZT1cInBob25lUHJpdmF0ZVwiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVByaXZhdGV9XCIgZGlzYWJsZWQgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L3NlY3Rpb24+XG5cbiAgPHNlY3Rpb24gY2xhc3M9XCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5LWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFdvcmtcIj53b3JrPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWlucHV0ZmllbGRcIj5cbiAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImVtYWlsV29ya1wiIG5hbWU9XCJlbWFpbFdvcmtcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuZW1haWxXb3JrfVwiIGRpc2FibGVkIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFByaXZhdGVcIj5ob21lPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWlucHV0ZmllbGRcIj5cbiAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImVtYWlsUHJpdmF0ZVwiIG5hbWU9XCJlbWFpbFByaXZhdGVcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuZW1haWxQcml2YXRlfVwiIGRpc2FibGVkIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9zZWN0aW9uPlxuXG4gIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJhZHJlc3NcIj5ob21lPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWlucHV0ZmllbGRcIj5cbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiaW5wdXQgdGV4dGFyZWFcIiBpZD1cImFkcmVzc1wiIG5hbWU9XCJhZHJlc3NcIiB3cmFwPVwiaGFyZFwiIHJvd3M9XCI0XCIgZGlzYWJsZWQ+XG4ke2N1cnJlbnRDb250YWN0LmFkcmVzfVxuICAgICAgICA8L3RleHRhcmVhPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvc2VjdGlvbj5cblxuICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXIgaXMtbGFzdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJhZHJlc3NcIj5ub3RlPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWlucHV0ZmllbGRcIj5cbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiaW5wdXQgdGV4dGFyZWFcIiBpZD1cImFkcmVzc1wiIG5hbWU9XCJhZHJlc3NcIiB3cmFwPVwiaGFyZFwiIHJvd3M9XCI0XCIgZGlzYWJsZWQ+XG4ke2N1cnJlbnRDb250YWN0Lm5vdGV9XG4gICAgICAgIDwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9zZWN0aW9uPlxuXG4gIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1idXR0b24gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtYnV0dG9uXCI+XG4gICAgPHVsIGNsYXNzPVwiY29udGFjdC1idXR0b24gdW5pdFwiPlxuICAgICAgPGxpPlxuICAgICAgICAgIDxhIGhyZWY9XCJ0ZWw6JHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICA8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiPjx0aXRsZT5pY29uczwvdGl0bGU+PHBhdGggZD1cIk0zNi40Myw0Ny4yYTQuMiw0LjIsMCwwLDEtLjczNi0wLjA2NWwtMC41NDItLjA5MWMtMC41LS4wODMtMS4wMjUtMC4xNjgtMS41NDMtMC4zMDZhNDcuMiw0Ny4yLDAsMCwxLTE2LjQyMy04LjJBNDIuOTUsNDIuOTUsMCwwLDEsNi4yMzMsMjYuMjYxLDQ0LjgxMSw0NC44MTEsMCwwLDEsMi4yNywxNy40NTNMMi4yMjksMTcuMzNsMC4wMTItMS42MzlhMTEuNjQyLDExLjY0MiwwLDAsMSwxLjQ2NC0zLjkzNSwyNi4xNDcsMjYuMTQ3LDAsMCwxLDUuNTEtNi40MTVDOS4zNiw1LjIxNCw5LjQ5Miw1LjEsOS42MjksNC45ODhhMi40NjcsMi40NjcsMCwwLDEsMy40MzYuMTg2LDcyLjYsNzIuNiwwLDAsMSw2Ljk4OSw4LjI3NSwyLjIxLDIuMjEsMCwwLDEtLjQyOSwzLjAyMiwyNC43MTQsMjQuNzE0LDAsMCwwLTQuMDkyLDQuMTcsMC41NzcsMC41NzcsMCwwLDAtLjA1Ny44NTYsMzkuMDY1LDM5LjA2NSwwLDAsMCwxMy4xLDEyLjM4OGMwLjUzNSwwLjMsMS4xMS41ODksMS43MDksMC44NzMsMC40NjcsMC4yMjIuNTE0LDAuMTY4LDAuNzM3LS4wOTEsMC43NzEtLjksMS41MDYtMS44NjksMi4yMTctMi44MDhsMC4wODMtLjExYzAuMjQ3LS4zMjYuNDctMC42NzcsMC43MDUtMS4wNDhsMC4yNTgtLjRhMi4zNzksMi4zNzksMCwwLDEsMy40MTctLjhjMC41NDgsMC4zMywxLjA4Mi42ODMsMS42MTYsMS4wMzYsMC4yNiwwLjE3Mi41MiwwLjM0NCwwLjc4MSwwLjUxM2wxLjM2MywwLjg4MnEyLjQyOCwxLjU3MSw0Ljg2NSwzLjEzYTMuMDk0LDMuMDk0LDAsMCwxLDEuMzg4LDEuNTFMNDcuNzcxLDM2Ljd2MS4xMzNsLTAuMTYzLjI4OGEzLjQ3NywzLjQ3NywwLDAsMS0uMTkyLjMyMiwyNi40NDksMjYuNDQ5LDAsMCwxLTcuNDQ0LDcuNEE2LjU1NCw2LjU1NCwwLDAsMSwzNi40Myw0Ny4yWk0zLjg0MywxNy4wNzFhNDMuMTM3LDQzLjEzNywwLDAsMCwzLjc3OCw4LjM2OEE0MS4zNDUsNDEuMzQ1LDAsMCwwLDE4LjE2NiwzNy4yNTlhNDUuNiw0NS42LDAsMCwwLDE1Ljg2Miw3LjkyM2MwLjQ0LDAuMTE3LjksMC4xOTMsMS4zODUsMC4yNzJsMC41NjUsMC4xYzEuMDc1LDAuMTg5LDEuOTMzLS4zLDMuMTE5LTEuMDYzYTI0Ljg4NCwyNC44ODQsMCwwLDAsNi45OTItNi45NTljMC4wMjUtLjAzNy4wNDgtMC4wNzYsMC4wNjktMC4xMTVWMzcuMDJhMS45MywxLjkzLDAsMCwwLS42OTEtMC42cS0yLjQ0NS0xLjU1Ni00Ljg3NS0zLjEzNkwzOS4yMjksMzIuNGMtMC4yNjctLjE3Mi0wLjUzMS0wLjM0Ny0wLjgtMC41MjItMC41MTUtLjM0LTEuMDMtMC42ODEtMS41NTgtMWEwLjc4MywwLjc4MywwLDAsMC0xLjIzMS4zbC0wLjI0OS4zOWMtMC4yNDMuMzgzLS40OTQsMC43NzgtMC43ODEsMS4xNTdsLTAuMDg0LjExYy0wLjcyNS45NTgtMS40NzYsMS45NDktMi4yNzgsMi44ODVhMiwyLDAsMCwxLTIuNjU0LjVjLTAuNjI4LS4zLTEuMjMzLTAuNjA3LTEuOC0wLjkxOWE0MC42Myw0MC42MywwLDAsMS0xMy42NDgtMTIuODgsMi4xNSwyLjE1LDAsMCwxLC4xLTIuNzU5LDI2LjMzNSwyNi4zMzUsMCwwLDEsNC4zNTgtNC40NDMsMC42MDYsMC42MDYsMCwwLDAsLjEzOS0wLjgxNCw3MS4wNjUsNzEuMDY1LDAsMCwwLTYuODM1LTguMDkzLDAuODU5LDAuODU5LDAsMCwwLTEuMjc0LS4wNjVjLTAuMTIxLjEtLjIzNywwLjItMC4zNTMsMC4zQTI0LjYyLDI0LjYyLDAsMCwwLDUuMSwxMi41NzQsMTAuMDYxLDEwLjA2MSwwLDAsMCwzLjg0MywxNS45djEuMTczWlwiIGZpbGw9XCIjZmZmXCIvPjwvc3ZnPlxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPHNwYW4+Y2FsbDwvc3Bhbj5cbiAgICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGNsYXNzPVwiZmxleC1hdXRvXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIm1haWx0bzpyLmthbGxhbkB1cGNtYWlsLm5sXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICA8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiPjx0aXRsZT5pY29uczwvdGl0bGU+PHBhdGggZD1cIk0xLjUxMywzNi41NjhWMTUuNzIxYTAuOTQ5LDAuOTQ5LDAsMCwwLC4wMjEtMC4xMTQsNC42NDIsNC42NDIsMCwwLDEsLjMwOS0xLjM4Niw1LjMsNS4zLDAsMCwxLDQuOTI5LTMuMzM5cTE4LjIzMywwLjAwNywzNi40NjYsMGE1LjMzLDUuMzMsMCwwLDEsLjc3LjA1MSw1LjE0Nyw1LjE0NywwLDAsMSwyLjc1OCwxLjI4Niw0LjkyOCw0LjkyOCwwLDAsMSwxLjcyMSwzLjhxMCwxMC4xNDksMCwyMC4zYTQuODg3LDQuODg3LDAsMCwxLTEuMzcyLDMuNDA2LDUuMTg5LDUuMTg5LDAsMCwxLTMuODksMS42NzVxLTkuNDM5LDAtMTguODc5LDAtOC43NTQsMC0xNy41MDksMEE1LjcsNS43LDAsMCwxLDUuOSw0MS4zMzFhNS4yLDUuMiwwLDAsMS0zLjEzLTEuNzQyLDQuODc1LDQuODc1LDAsMCwxLTEuMi0yLjU1N0MxLjU1LDM2Ljg3NywxLjUzMywzNi43MjIsMS41MTMsMzYuNTY4Wk0yNSwxMi42NzJxLTkuMDcyLDAtMTguMTQ0LDBhMy40MzUsMy40MzUsMCwwLDAtMS41MTkuMzA4LDMuMjUzLDMuMjUzLDAsMCwwLTIuMDI4LDMuMTE1cTAsMTAuMSwwLDIwLjJhMy4wNzYsMy4wNzYsMCwwLDAsLjg2MiwyLjE4MUEzLjQ3LDMuNDcsMCwwLDAsNi44LDM5LjYwOGgxNS4zcTEwLjU0LDAsMjEuMDgsMGEzLjQxOSwzLjQxOSwwLDAsMCwxLjYxNC0uMzYxQTMuMjM5LDMuMjM5LDAsMCwwLDQ2LjY5NSwzNi4ycTAtMTAuMTEsMC0yMC4yMTlhMy4wNjUsMy4wNjUsMCwwLDAtLjgxMy0yLjEyMiwzLjUwOSwzLjUwOSwwLDAsMC0yLjcxNi0xLjE5MkgyNVpcIiBmaWxsPVwiI2ZmZlwiLz48cGF0aCBkPVwiTTI1LDMwLjU1M2EwLjc1OSwwLjc1OSwwLDAsMS0uNTkzLTAuMjA5cS0zLjQ1NS0yLjY4MS02LjkxOS01LjM1MS02LjQxOC00Ljk1OS0xMi44MzQtOS45MjFhMS4wMywxLjAzLDAsMCwxLS40MzUtMC44NjcsMC41NywwLjU3LDAsMCwxLC4wODQtMC4yOTVBMS4xMDgsMS4xMDgsMCwwLDEsNS4yLDEzLjRhMC42LDAuNiwwLDAsMSwuNC4xMzdRNy4zNTgsMTQuOSw5LjExNSwxNi4yNjZMMjQuNTIyLDI4LjIxN2MwLjEyNiwwLjEuMjU3LDAuMTkxLDAuMzc3LDAuM2EwLjEzMywwLjEzMywwLDAsMCwuMiwwcTEuNjYyLTEuMywzLjMzLTIuNTg3TDQ0LjI4MSwxMy42MzZhMi4wNTMsMi4wNTMsMCwwLDEsLjItMC4xNTUsMC42NzYsMC42NzYsMCwwLDEsLjU0OC0wLjA1NSwxLjI0NiwxLjI0NiwwLDAsMSwuNjA4LjM5MiwwLjY1LDAuNjUsMCwwLDEsLjEyMi42MzUsMS4xNjMsMS4xNjMsMCwwLDEtLjQxNC42MjVMMjUuNjUyLDMwLjNhMC44NDYsMC44NDYsMCwwLDAtLjA4NS4wNjZBMC42NDgsMC42NDgsMCwwLDEsMjUsMzAuNTUzWlwiIGZpbGw9XCIjZmZmXCIvPjxwYXRoIGQ9XCJNOC43NzMsMzUuMDgxYTAuOTc0LDAuOTc0LDAsMCwxLS44NTktMC41MSwwLjY2LDAuNjYsMCwwLDEtLjAyOC0wLjYyMUExLjIxNCwxLjIxNCwwLDAsMSw4LjMsMzMuMzkycTIuODExLTIuMTA1LDUuNjItNC4yMTRhMC41ODQsMC41ODQsMCwwLDAsLjA1NC0wLjA0MSwwLjcsMC43LDAsMCwxLC44NjctMC4xLDEuNywxLjcsMCwwLDEsLjQxNi4zLDAuNjQxLDAuNjQxLDAsMCwxLC4xMzcuNjkxLDEuMTY2LDEuMTY2LDAsMCwxLS40MjQuNjA3TDkuMzYsMzQuODM5YTAuODIsMC44MiwwLDAsMS0uMzkyLjIyNUM4LjksMzUuMDcxLDguODM4LDM1LjA3Niw4Ljc3MywzNS4wODFaXCIgZmlsbD1cIiNmZmZcIi8+PHBhdGggZD1cIk00MS4yMDYsMzUuMDc1YTAuNzI5LDAuNzI5LDAsMCwxLS41Mi0wLjJDMzkuODYxLDM0LjI0NSwzOS4wMjksMzMuNjI2LDM4LjIsMzNjLTEuMDY0LS44LTIuMTMyLTEuNTkyLTMuMTkxLTIuNGExLjAzMywxLjAzMywwLDAsMS0uNDMzLTAuODc3LDAuNTQzLDAuNTQzLDAsMCwxLC4xMzctMC4zNTgsMS4xMzcsMS4xMzcsMCwwLDEsLjg2Mi0wLjQzNCwwLjYsMC42LDAsMCwxLC4zNzIuMTI4UTM3LjE4NCwzMCwzOC40MjMsMzAuOTMxYzEuMTA1LDAuODMxLDIuMjE2LDEuNjU1LDMuMzE2LDIuNDkyYTEsMSwwLDAsMSwuNDI1LjkzNSwwLjQ5NCwwLjQ5NCwwLDAsMS0uMDgxLjIyN0EwLjk3NywwLjk3NywwLDAsMSw0MS4yMDYsMzUuMDc1WlwiIGZpbGw9XCIjZmZmXCIvPjwvc3ZnPlxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPHNwYW4+ZW1haWw8L3NwYW4+XG4gICAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cImVkaXQtJHtjdXJyZW50Q29udGFjdC5pZH1cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgIDxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+PHRpdGxlPmljb25zPC90aXRsZT48cGF0aCBkPVwiTTguOTgsNDQuNWwtMS4wMjItLjAzNEEyLjQ3OSwyLjQ3OSwwLDAsMSw2LjM1MSw0Mi45OGwtMC4wNjUtLjE1MiwwLjAwOS0uOTcxTDYuNCw0MS4xNDhjMC4wNzktLjUxNC4xNTktMS4wMjcsMC4yMy0xLjU0MmwwLjMtMi4xODhjMC4yMjEtMS42MzYuNDQyLTMuMjcxLDAuNjgyLTQuOWEyLjQ3NSwyLjQ3NSwwLDAsMSwuNjU4LTEuMjU3QzguODc1LDMwLjYyLDkuNSwzMCwxMC4xMjIsMjkuMzgzbDUuMjExLTUuMjA2cTcuMy03LjMsMTQuNTkyLTE0LjZBNS41MDYsNS41MDYsMCwwLDEsMzIuODY2LDcuOGwwLjE0LS4wMTJMMzQuMTE5LDcuOGE1LjcsNS43LDAsMCwxLDIuOTkyLDEuODczQzM4LjQsMTEsMzkuNzQsMTIuMzM5LDQxLjA4NywxMy42NDhhNS43LDUuNywwLDAsMSwxLjksMy4wMTZMNDMsMTYuODE3bC0wLjAxMiwxLjFhNS41ODcsNS41ODcsMCwwLDEtMS44MjcsMi45OUMzNC40MzYsMjcuNjExLDI3LjI3MywzNC43NiwyMC4xMjIsNDEuOTYzYTQuNTg2LDQuNTg2LDAsMCwxLTIuODg5LDEuMzc4Yy0xLjk5My4yMzgtNC4wMTgsMC41MTgtNS45NzcsMC43OWwtMi4xMTguMjk1Wk04LjMyNSw0Mi44ODRoMC4zYTAuOTYxLDAuOTYxLDAsMCwxLC4xOTMtMC4wNDZsMi4yMTItLjNjMS45NjYtLjI3Myw0LTAuNTU0LDYuMDA2LTAuNzk0YTIuOTkxLDIuOTkxLDAsMCwwLDEuOTM2LS45MTNDMjYuMTMxLDMzLjYyMSwzMy4zLDI2LjQ3LDQwLjAyLDE5Ljc2M0E0LjIxNiw0LjIxNiwwLDAsMCw0MS4zODYsMTcuN1YxNi45YTQuMzg2LDQuMzg2LDAsMCwwLTEuNDIzLTIuMDk0Yy0xLjM1OC0xLjMyLTIuNzA3LTIuNjY5LTQuMDA5LTQuMDFhNC4yMTksNC4yMTksMCwwLDAtMi4wNy0xLjRoLTAuOGE0LjAxNCw0LjAxNCwwLDAsMC0yLjAxNCwxLjMxNXEtNy4yODgsNy4zMTItMTQuNTk0LDE0LjYwN2wtNS4yMTYsNS4yMTFjLTAuNjEyLjYwNy0xLjIyNSwxLjIxNS0xLjgxOSwxLjgzOWEwLjg5NCwwLjg5NCwwLDAsMC0uMjMxLjM3OUM4Ljk2OSwzNC4zNzUsOC43NDksMzYsOC41MjksMzcuNjM0bC0wLjMsMi4xOTJDOC4xNTksNDAuMzUsOC4wNzksNDAuODcyLDgsNDEuMzk0bC0wLjEuNjQ0djAuNDQxQTAuODQxLDAuODQxLDAsMCwwLDguMzI1LDQyLjg4NFpcIiBmaWxsPVwiI2ZmZlwiLz48cmVjdCB4PVwiMzAuNzc5XCIgeT1cIjEyLjc3XCIgd2lkdGg9XCIxLjYxM1wiIGhlaWdodD1cIjEyLjkwOFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNC4yODcgMjguMTg4KSByb3RhdGUoLTQ1LjM1NilcIiBmaWxsPVwiI2ZmZlwiLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmVkaXQ8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIDwvc2VjdGlvbj5cbjwvYXJ0aWNsZT5gO1xuICAgICAgY29udGVudEl0ZW1XcmFwcGVyLmlubmVySFRNTCA9IGNvbnRhY3RJdGVtO1xuICAgICAgY29udGVudEl0ZW1XcmFwcGVyID0gY29udGVudEl0ZW1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCJhcnRpY2xlXCIpO1xuICAgICAgbGV0IG1haW5XcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuY29udGFpbmVyKTtcbiAgICAgIGxldCBvbGRDb250ZW50ID0gbWFpbldyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jb250YWN0LWl0ZW0ud3JhcHBlclwiKTtcblxuICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGxldCBvbGRDb250ZW50ID0gbWFpbldyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jb250YWN0LWl0ZW0ud3JhcHBlclwiKTtcbiAgICAgICAgbGV0IHJlcGxhY2VkTm9kZSA9IG1haW5XcmFwcGVyLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICBjb250ZW50SXRlbVdyYXBwZXIsXG4gICAgICAgICAgb2xkQ29udGVudFxuICAgICAgICApO1xuICAgICAgICByZXNvbHZlKHJlcGxhY2VkTm9kZSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgbWV0aG9kcy5lbGVtZW50V2lkdGguZml4ZWRDb250YWluZXIoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5ldmVudExpc3RlbmVyID0ge1xuICAgIGNvbnRhY3RMaXN0QnV0dG9uOiBmdW5jdGlvbihcbiAgICAgIGVsZW1lbnROb2RlLFxuICAgICAgY2FsbEZ1bmN0aW9uLFxuICAgICAgbGlzdGVuZXIgPSBcImFkZFwiLFxuICAgICAgdHlwZSA9IFwiY2xpY2tcIlxuICAgICkge1xuICAgICAgaWYgKGVsZW1lbnROb2RlICYmIGVsZW1lbnROb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgT2JqZWN0LmtleXMoZWxlbWVudE5vZGUpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyW2xpc3RlbmVyXShlbGVtZW50Tm9kZVtrZXldLCBjYWxsRnVuY3Rpb24sIHR5cGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24oZWxlbWVudCwgY2FsbEZ1bmN0aW9uLCB0eXBlID0gXCJjbGlja1wiKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbEZ1bmN0aW9uKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCwgY2FsbEZ1bmN0aW9uLCB0eXBlID0gXCJjbGlja1wiKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbEZ1bmN0aW9uKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuc2V0RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0TGlzdEl0ZW1zVW5pdFxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXJCdXR0b24gPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0QnV0dG9uQ29udGFpbmVyXG4gICAgICApO1xuXG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc1NlYXJjaENvbnRhaW5lclxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBzZWxlY3RvcnMuY29udGFjdEl0ZW1Db250YWluZXJcbiAgICApO1xuICAgIGlmIChlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1Vbml0ID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtVW5pdFxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyQnV0dG9uID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RCdXR0b25Db250YWluZXJcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuZWxlbWVudFdpZHRoID0ge1xuICAgIGZpeGVkQ29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgIG1ldGhvZHMuc2V0RWxlbWVudHMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmNvbnRhY3RMaXN0SXRlbXMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lckxpc3RJdGVtcygpO1xuICAgICAgbWV0aG9kcy5lbGVtZW50V2lkdGguYnV0dG9uQ29udGFpbmVySXRlbSgpO1xuICAgIH0sXG4gICAgY29udGFjdExpc3RJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zVW5pdC5zdHlsZS53aWR0aCA9XG4gICAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIuY2xpZW50V2lkdGggKyBcInB4XCI7XG4gICAgfSxcbiAgICBidXR0b25Db250YWluZXJMaXN0SXRlbXM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0KSB7XG4gICAgICAgIGxldCBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoID1cbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zVW5pdC5jbGllbnRXaWR0aDtcbiAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lckJ1dHRvbi5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdExpc3RJdGVtc1VuaXRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1NlYXJjaENvbnRhaW5lci5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdExpc3RJdGVtc1VuaXRXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1dHRvbkNvbnRhaW5lckl0ZW06IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lciAmJlxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lckJ1dHRvblxuICAgICAgKSB7XG4gICAgICAgIGxldCBjb250YWN0SXRlbUNvbnRhaW5lcldpZHRoID1cbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lci5jbGllbnRXaWR0aDtcblxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lckJ1dHRvbi5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdEl0ZW1Db250YWluZXJXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgIHZhciBmb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIGVsZW1lbnRzLndpbmRvdyA9IHdpbmRvdztcbiAgICAgIGVsZW1lbnRzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICAgIGVsZW1lbnRzLnZpZXdwb3J0ID1cbiAgICAgICAgdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgICAgZWxlbWVudHMuY29udGFjdHNDb250YWluZXIgPSBmb3VuZDtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdHNDb250YWluZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG1ldGhvZHMuZWxlbWVudFdpZHRoLmZpeGVkQ29udGFpbmVyKTtcblxuICAgICAgLy8gZ2V0IGFuZCBzaG93IGNvbnRhY3QgbGlzdFxuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lciA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyXG4gICAgICApO1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdEl0ZW1Db250YWluZXJcbiAgICAgICk7XG5cbiAgICAgIGlmIChlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyKSB7XG4gICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIGlmIChlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyKSB7XG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJuby1zY3JvbGxcIixcbiAgICAgICAgYXR0cmlidXRlS2V5OiBcImNsYXNzXCIsXG4gICAgICB9O1xuICAgICAgbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlVmFsdWUoZGF0YSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5jb250YWluZXIsXG4gIH07XG59KSgpO1xuIiwidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XHJcblxyXG5tb2R1bGVzW1wiZmlsZS11cGxvYWRcIl0gPSAoZnVuY3Rpb24oKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIGxldCBlbGVtZW50cywgbWV0aG9kcywgc2VsZWN0b3JzLCBzdGF0ZSwgY29udGFjdEl0ZW1zO1xyXG5cclxuICBlbGVtZW50cyA9IHt9O1xyXG4gIG1ldGhvZHMgPSB7fTtcclxuICBzZWxlY3RvcnMgPSB7XHJcbiAgICB2aWV3cG9ydDogXCJib2R5XCIsXHJcbiAgICBjb250YWluZXI6ICcuY29udGFpbmVyW3ZhcmlhbnQ9XCJmaWxlLXVwbG9hZFwiXScsXHJcbiAgfTtcclxuICBzdGF0ZSA9IHt9O1xyXG5cclxuICBtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcclxuICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XHJcbiAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5jb250YWluZXIpO1xyXG5cclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICAgIGVsZW1lbnRzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgICAgZWxlbWVudHMudmlld3BvcnQgPVxyXG4gICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcclxuICAgICAgZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lciA9IGZvdW5kO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtZXRob2RzLmluaXQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgaWYgKGVsZW1lbnRzLmZpbGVVcGxvYWRDb250YWluZXIpIHtcclxuICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lcikuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICBsZXQgZmlsZVVwbG9hZCA9IG5ldyBmaWxlVXBsb2FkU2hvd1ByZXZpZXV3KFxyXG4gICAgICAgICAgZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lcltrZXldXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcclxuICAgIGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGVsZW1lbnRzLmZpbGVVcGxvYWQpIHtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXHJcbiAgICBpbml0OiBtZXRob2RzLmluaXQsXHJcbiAgICB1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXHJcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxyXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5jb250YWluZXIsXHJcbiAgfTtcclxufSkoKTtcclxuIiwidmFyIG1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9O1xudmFyIG1ldGhvZHMgPSB7fTtcblxubW9kdWxlc1snY3VzdG9tLWZvcm0nXSA9IChmdW5jdGlvbiAoKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBlbGVtZW50cyxcblx0XHRtZXRob2RzLFxuXHRcdHNlbGVjdG9ycyxcblx0XHRzdGF0ZTtcblxuXHRlbGVtZW50cyA9IHt9O1xuXHRtZXRob2RzID0ge307XG5cdHNlbGVjdG9ycyA9IHtcblx0XHQndmlld3BvcnQnOiAnYm9keScsXG5cblx0XHQnY29udGFpbmVyJzogJy5jb250YWluZXJbdmFyaWFudD1cImN1c3RvbS1mb3JtXCJdJyxcblxuXHRcdCdmb3JtQ29udGFpbmVyJzogJy5jb250YWluZXJbdmFyaWFudH49XCJjdXN0b20tZm9ybVwiXScsXG5cdFx0J2Zvcm1FbGVtZW50JzogJ1t2YXJpYW50PVwiY3VzdG9tLWZvcm1cIl0gZm9ybScsXG5cdFx0J2Zvcm1GdWxsRm9ybSc6ICdbdmFyaWFudD1cImZ1bGwtZm9ybVwiXScsXG5cblx0XHQnZm9ybUJ1dHRvbic6ICcuc3VibWl0LWJ1dHRvbicsXG5cblx0XHQnZGF0ZUZpZWxkQ29udGFpbmVyJzogJ1t2YXJpYW50PVwiZGF0ZVwiXScsXG5cblx0XHQncmVxdWlyZWRGaWVsZHMnOiAnaW5wdXRbZGF0YS1yZXF1aXJlZF0nLFxuXHRcdCdmb3JtUG9zdGVkQ29udGFpbmVyJzogJ1t2YXJpYW50fj1cImN1c3RvbS1mb3JtLXBvc3RlZFwiXScsXG5cdFx0J2Vycm9yTWVzc2FnZUNvbnRhaW5lcic6ICdbdmFyaWFudH49XCJlcnJvci1tZXNzYWdlXCJdJ1xuXHR9O1xuXHRzdGF0ZSA9IHt9O1xuXG5cdG1ldGhvZHMuaHRtbEVsZW1lbnQgPSB7XG5cdFx0Z2V0QXR0cmlidXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0cmV0dXJuIChkYXRhLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KSB8fCBmYWxzZSk7XG5cdFx0fSxcblx0XHRoYXNBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24gKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKGRhdGEuYXR0cmlidXRlVmFsdWUsICdnaScpO1xuXHRcdFx0cmV0dXJuIHJlZ2V4LnRlc3QoYXR0cmlidXRlVmFsdWUpO1xuXHRcdH0sXG5cdFx0YWRkQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcblxuXHRcdFx0aWYgKCFtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0F0dHJpYnV0ZVZhbHVlKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKSkge1xuXHRcdFx0XHRpZiAoYXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZVZhbHVlICsgJyAnICsgZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYXR0cmlidXRlVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHRyZW1vdmVBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xuXHRcdFx0dmFyIGhhc0F0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShkYXRhLCBhdHRyaWJ1dGVWYWx1ZSk7XG5cdFx0XHR2YXIgdmFsdWVSZW1vdmVkID0gZmFsc2U7XG5cdFx0XHRpZiAoaGFzQXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdFx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCAnZ2knKTtcblx0XHRcdFx0dmFyIG5ld0F0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlVmFsdWUucmVwbGFjZShyZWdleCwgJycpLnRyaW0oKTtcblx0XHRcdFx0aWYgKG5ld0F0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdFx0ZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgbmV3QXR0cmlidXRlVmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRhdGEuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhbHVlUmVtb3ZlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWVSZW1vdmVkO1xuXHRcdH0sXG5cdFx0dG9nZ2xlQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRkYXRhLmF0dHJpYnV0ZVZhbHVlID0gZGF0YS5yZW1vdmVBdHRyaWJ1dGVWYWx1ZTtcblx0XHRcdHZhciB2YWx1ZVRvZ2dsZWQgPSBmYWxzZTtcblx0XHRcdHZhciByZW1vdmVBdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlVmFsdWUoZGF0YSk7XG5cblx0XHRcdGlmIChyZW1vdmVBdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0XHRkYXRhLmF0dHJpYnV0ZVZhbHVlID0gZGF0YS5hZGRBdHRyaWJ1dGVWYWx1ZTtcblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblx0XHRcdFx0dmFsdWVUb2dnbGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWx1ZVRvZ2dsZWQ7XG5cdFx0fSxcblx0XHRhZGRTdGF0ZVZhbHVlSW52YWxpZDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdGF0dHJpYnV0ZVZhbHVlOiAnaW52YWxpZCdcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBtZXRob2RzLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlU3RhdGVWYWx1ZUludmFsaWQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdFx0YXR0cmlidXRlS2V5OiAnc3RhdGUnLFxuXHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZTogJ2ludmFsaWQnXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG1ldGhvZHMuaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlVmFsdWUoZGF0YSk7XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZmllbGRFbGVtZW50ID0ge1xuXHRcdGZvY3VzT3V0OiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHZhciBmaWVsZERhdGEgPSB7XG5cdFx0XHRcdG5hbWU6IGV2ZW50LmN1cnJlbnRUYXJnZXQubmFtZSxcblx0XHRcdFx0dmFsdWVzOiBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHR2YWx1ZUNoZWNrOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudmFsdWVDaGVjayB8fCBldmVudC5jdXJyZW50VGFyZ2V0LnR5cGVcblx0XHRcdH07XG5cdFx0XHR2YXIgdmFsaWRhdGlvblJlc3BvbnNlID0gbWV0aG9kcy5mb3JtVmFsaWRhdGlvbi5maWVsZFZhbGlkYXRpb24oZmllbGREYXRhKTtcblx0XHRcdGlmICh2YWxpZGF0aW9uUmVzcG9uc2UuaGFzRXJyb3IpIHtcblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRTdGF0ZVZhbHVlSW52YWxpZChldmVudC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdH1cblx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnNldFN0YXRlLmhpZGRlbihldmVudC5jdXJyZW50VGFyZ2V0LmZvcm0pO1xuXHRcdH0sXG5cdFx0Zm9jdXNJbjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZVN0YXRlVmFsdWVJbnZhbGlkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLmZvcm0gPSB7XG5cdFx0Y2xpY2tIYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmlzU3RhdGVJbnZhbGlkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0dmFyIGZvcm1EYXRhID0gbWV0aG9kcy5mb3JtLnNlcmlhbGl6ZShldmVudC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdHZhciBlcnJvckRhdGEgPSBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLmZvcm1EYXRhKGZvcm1EYXRhLnBvc3REYXRhKTtcblxuXHRcdFx0aWYgKGVycm9yRGF0YSB8fCBzdGF0ZS5jb250YWluZXJWYXJpYW50RGF0ZUludmFsaWQpIHtcblx0XHRcdFx0bWV0aG9kcy5mb3JtLmVycm9ySGFuZGxlcihlcnJvckRhdGEsIGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0fSBlbHNlIGlmICghZXJyb3JEYXRhICYmICFzdGF0ZS5jb250YWluZXJWYXJpYW50RGF0ZUludmFsaWQpIHtcblx0XHRcdFx0bWV0aG9kcy5mb3JtLnBvc3RIYW5kbGVyKGZvcm1EYXRhLCBldmVudC5jdXJyZW50VGFyZ2V0LmFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHBvc3RIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybURhdGEsIGFjdGlvbikge1xuXHRcdFx0bWV0aG9kcy5zZW5kRGF0YS54aHIoJ1BPU1QnLCBhY3Rpb24sIGZvcm1EYXRhKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdHZhciBjYWxsYmFja0pzb25YaHIgPSBtZXRob2RzLnNlbmREYXRhLmNhbGxiYWNrLnN1Y2Nlc3MoZGF0YSk7XG5cdFx0XHRcdFx0bWV0aG9kcy5mb3JtLmNhbGxiYWNrSGFuZGxlcihjYWxsYmFja0pzb25YaHIpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXG5cblx0XHRjYWxsYmFja0hhbmRsZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRpZiAoZGF0YS5lcnJvckRhdGEgJiYgT2JqZWN0LmtleXMoZGF0YS5lcnJvckRhdGEpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtW25hbWU9XCInICsgZGF0YS5mb3JtTmFtZSArICdcIl0nKTtcblx0XHRcdFx0bWV0aG9kcy5mb3JtLmVycm9ySGFuZGxlcihkYXRhLmVycm9yRGF0YSwgZm9ybSk7XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGEuc3VjY2VzRGF0YSkge1xuXHRcdFx0XHRpZiAoZGF0YS5zdWNjZXNEYXRhLnBhZ2UgIT09ICcnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGdvIHRvIGEgbmV3IHBhZ2UnKTtcblx0XHRcdFx0XHQvLyBnbyB0byBuZXcgcGFnZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1ldGhvZHMuZm9ybS5zdWNjZXNIYW5kbGVyKGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qXG5cdFx0XHRcdCQoZWxlbWVudHMuYm9keSkudHJpZ2dlcihuZXcgalF1ZXJ5LkV2ZW50KCduYXZpZ2F0ZScsIHtcblx0XHRcdFx0XHR1cmw6IGRhdGEuc3VjY2VzRGF0YS5wYWdlLFxuXHRcdFx0XHRcdGFuaW1hdGlvbjogJ2JsdXJpbicsXG5cdFx0XHRcdFx0d2luZG93TmFtZTogbnVsbCxcblx0XHRcdFx0XHR0YXJnZXQ6IG51bGxcblx0XHRcdFx0fSkpO1xuXHRcdFx0XHQqL1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRlcnJvckhhbmRsZXI6IGZ1bmN0aW9uIChlcnJvckRhdGEsIGVsZW1lbnQpIHtcblx0XHRcdE9iamVjdC5rZXlzKGVycm9yRGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdHZhciBzZWxlY3RvciA9IGVycm9yRGF0YVtrZXldLmRhdGEuZWxlbWVudFR5cGUgKyAnW25hbWU9XCInICsgZXJyb3JEYXRhW2tleV0uZGF0YS5uYW1lICsgJ1wiXSc7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRTdGF0ZVZhbHVlSW52YWxpZChpbnB1dCk7XG5cdFx0XHR9KTtcblx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnNldFN0YXRlLmFjdGl2ZShlbGVtZW50KTtcblx0XHR9LFxuXG5cdFx0c3VjY2VzSGFuZGxlcjogZnVuY3Rpb24gKGRhdGEpIHtcblxuXHRcdFx0dmFyIGZvcm1TdWNjZXMgPSBlbGVtZW50cy5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lKj1cIicgKyBkYXRhLnN1Y2Nlc0RhdGEuZm9ybU5hbWUgKyAnXCJdJyk7XG5cdFx0XHR2YXIgZm9ybVN1Y2Nlc0NvbnRhaW5lciA9IGZvcm1TdWNjZXMuY2xvc2VzdCgnW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm1cIl0nKTtcblxuXHRcdFx0dmFyIGRhdGFGb3JtID0ge1xuXHRcdFx0XHRlbGVtZW50OiBmb3JtU3VjY2VzLFxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJyxcblx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdhY3RpdmUnXG5cdFx0XHR9O1xuXG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGFGb3JtKTtcblxuXHRcdFx0dmFyIGZvcm1Qb3N0ZWQgPSBmb3JtU3VjY2VzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmZvcm1Qb3N0ZWRDb250YWluZXIpO1xuXG5cdFx0XHR2YXIgZGF0YVBvc3RlZENvbnRhaW5lciA9IHtcblx0XHRcdFx0ZWxlbWVudDogZm9ybVBvc3RlZCxcblx0XHRcdFx0YXR0cmlidXRlS2V5OiAnc3RhdGUnLFxuXHRcdFx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogJ2FjdGl2ZScsXG5cdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJ1xuXHRcdFx0fTtcblxuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhUG9zdGVkQ29udGFpbmVyKTtcblx0XHR9LFxuXG5cdFx0Z2V0VmFsdWVPZkVsZW1lbnQ6IHtcblx0XHRcdGlucHV0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgdmFsdWU7XG5cdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgJiYgKGVsZW1lbnQudHlwZSA9PT0gJ3JhZGlvJyB8fCBlbGVtZW50LnR5cGUgPT09ICdjaGVja2JveCcpKSB7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudC50eXBlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHR9LFxuXG5cdFx0XHR0ZXh0YXJlYTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsdWUudHJpbSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgdmFsdWU7XG5cdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlID09PSAnc2VsZWN0LW9uZScpIHtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuXHRcdFx0XHRcdHZhbHVlID0gW107XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQudmFsdWUgJiYgZWxlbWVudC5vcHRpb25zKSB7XG5cdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhlbGVtZW50Lm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbktleSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5vcHRpb25zW29wdGlvbktleV0uc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5wdXNoKGVsZW1lbnQub3B0aW9uc1tvcHRpb25LZXldLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2VyaWFsaXplOiBmdW5jdGlvbiAoZm9ybSkge1xuXHRcdFx0dmFyIGZvcm1EYXRhID0ge1xuXHRcdFx0XHRmb3JtTmFtZTogZm9ybS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCBudWxsLFxuXHRcdFx0XHRhY3Rpb246IGZvcm0uZ2V0QXR0cmlidXRlKCdhY3Rpb24nKSB8fCBudWxsLFxuXHRcdFx0XHRwb3N0RGF0YToge31cblx0XHRcdH07XG5cblx0XHRcdGZvcm1EYXRhLnBvc3REYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9ybS5lbGVtZW50cykucmVkdWNlKGZ1bmN0aW9uIChkYXRhLCBpdGVtKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0ubmFtZSkge1xuXHRcdFx0XHRcdGlmICghZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRkYXRhW2l0ZW0ubmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0udHlwZSxcblx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50VHlwZTogaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0XHRyZXF1aXJlZDogaXRlbS5kYXRhc2V0LnJlcXVpcmVkID09PSAndHJ1ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlQ2hlY2s6IGl0ZW0uZGF0YXNldC52YWx1ZUNoZWNrIHx8IGl0ZW0udHlwZSxcblx0XHRcdFx0XHRcdFx0dmFsdWVLZXk6IGl0ZW0uZGF0YXNldC52YWx1ZUtleSB8fCAwLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbaXRlbS5uYW1lXS52YWx1ZUtleSA9PT0gXCJudW1iZXJcIiAmJiBpc0Zpbml0ZShkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpICYmIE1hdGguZmxvb3IoZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5KSA9PT0gZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5KSB7XG5cdFx0XHRcdFx0XHRkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkrKztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRpZiAobWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSkgJiYgaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JyAmJiBpdGVtLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXMgPSBtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGF0YXNldC52YWx1ZUtleSkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXNbaXRlbS5kYXRhc2V0LnZhbHVlS2V5XSA9IG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXMucHVzaChtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCB7fSk7XG5cdFx0XHRyZXR1cm4gZm9ybURhdGE7XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZm9ybVZhbGlkYXRpb24gPSB7XG5cdFx0Zm9ybURhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgZXJyb3JEYXRhID0ge307XG5cdFx0XHRPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKGRhdGFba2V5XS5yZXF1aXJlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHZhciBmaWVsZERhdGEgPSB7XG5cdFx0XHRcdFx0XHRuYW1lOiBkYXRhW2tleV0sXG5cdFx0XHRcdFx0XHR2YWx1ZXM6IGRhdGFba2V5XS52YWx1ZXNbMF0sXG5cdFx0XHRcdFx0XHR2YWx1ZUNoZWNrOiBkYXRhW2tleV0udmFsdWVDaGVja1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IG1ldGhvZHMuZm9ybVZhbGlkYXRpb24uZmllbGRWYWxpZGF0aW9uKGZpZWxkRGF0YSk7XG5cdFx0XHRcdFx0aWYgKHZhbGlkYXRpb25SZXNwb25zZS5oYXNFcnJvcikge1xuXHRcdFx0XHRcdFx0ZXJyb3JEYXRhW2tleV0gPSB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IGRhdGFba2V5XSxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZTogdmFsaWRhdGlvblJlc3BvbnNlLmVycm9yTWVzc2FnZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIChPYmplY3Qua2V5cyhlcnJvckRhdGEpLmxlbmd0aCA+IDAgPyBlcnJvckRhdGEgOiBmYWxzZSk7XG5cdFx0fSxcblxuXHRcdGZpZWxkVmFsaWRhdGlvbjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciB2YWxpZGF0aW9uUmVzcG9uc2UgPSB7XG5cdFx0XHRcdGhhc0Vycm9yOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3JNZXNzYWdlOiBudWxsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIW1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuaXNOb3RFbXB0eShkYXRhLnZhbHVlcykpIHtcblx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yID0gdHJ1ZTtcblx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmVycm9yTWVzc2FnZSA9IGRhdGEubmFtZSArICcgZmllbGQgaXMgZW1wdHknO1xuXHRcdFx0fSBlbHNlIGlmIChtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlLmlzTm90RW1wdHkoZGF0YS52YWx1ZXMpICYmIHR5cGVvZiBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlW2RhdGEudmFsdWVDaGVja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0aWYgKCFtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlW2RhdGEudmFsdWVDaGVja10oZGF0YS52YWx1ZXMpKSB7XG5cdFx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yID0gdHJ1ZTtcblx0XHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlID0gZGF0YS5uYW1lICsgJyBmaWVsZCBpcyBub3QgY29ycmVjdCBmaWxsZWQnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGlvblJlc3BvbnNlO1xuXHRcdH0sXG5cblx0XHR2YWxpZGF0aW9uVHlwZToge1xuXHRcdFx0aXNOb3RFbXB0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciB2YWx1ZUlzTm90RW1wdHkgPSB0cnVlO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dmFsdWVJc05vdEVtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA+IDApIHx8IHZhbHVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSB0cnVlO1xuXHRcdFx0XHRcdHZhbHVlSXNOb3RFbXB0eSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWVJc05vdEVtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlSXNOb3RFbXB0eTtcblx0XHRcdH0sXG5cblx0XHRcdHRleHQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cblx0XHRcdG51bWJlcjogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gL15cXGQrJC87XG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxwaGFiZXRpYzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gL15cXGQrJC87XG5cdFx0XHRcdHJldHVybiAhcGF0dGVybi50ZXN0KHZhbHVlKTtcblx0XHRcdH0sXG5cblx0XHRcdGVtYWlsOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG5cblx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG5cdFx0XHR9LFxuXG5cdFx0XHR0ZWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcGF0dGVybiA9IC9eKD86XFwrXFxkezEsM318MFxcZHsxLDN9fDAwXFxkezEsMn0pPyg/Olxccz9cXChcXGQrXFwpKT8oPzpbLVxcL1xccy5dfFxcZCkrJC87XG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0ZGF0ZUZ1dHVyZTogZnVuY3Rpb24gKGRhdGUpIHtcblx0XHRcdFx0ZGF0ZS5kYXkgPSBwYXJzZUludChkYXRlLmRheSwgMTApO1xuXHRcdFx0XHRkYXRlLm1vbnRoID0gcGFyc2VJbnQoZGF0ZS5tb250aCwgMTApIC0gMTtcblx0XHRcdFx0ZGF0ZS55ZWFyID0gcGFyc2VJbnQoZGF0ZS55ZWFyLCAxMCkgKyAyMDAwO1xuXG5cdFx0XHRcdHZhciB0ZW1wID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSk7XG5cdFx0XHRcdHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuXG5cdFx0XHRcdGlmIChub3cgPCB0ZW1wICYmIHRlbXAuZ2V0RGF0ZSgpID09PSBkYXRlLmRheSAmJiB0ZW1wLmdldE1vbnRoKCkgPT09IGRhdGUubW9udGggJiYgdGVtcC5nZXRGdWxsWWVhcigpID09PSBkYXRlLnllYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLnNlbmREYXRhID0ge1xuXHRcdHhocjogZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhKSB7XG5cdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXHRcdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuXHRcdFx0XHRyZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KHJlcXVlc3Quc3RhdHVzVGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmVqZWN0KHJlcXVlc3Quc3RhdHVzVGV4dCk7XG5cdFx0XHRcdH07XG5cblxuXHRcdFx0XHR2YXIgcmVzcG9uc2VEYXRhID0ge1xuXHRcdFx0XHRcdHN1Y2Nlc0RhdGE6IHtcblx0XHRcdFx0XHRcdHBhZ2U6ICcnLFxuXHRcdFx0XHRcdFx0Zm9ybU5hbWU6IGRhdGEuZm9ybU5hbWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zZVR4dDogJ0JlZGFua3Qgdm9vciBoZXQgaW52dWxsZW4uJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXNwb25zZURhdGEgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlRGF0YSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH0sXG5cdFx0Y2FsbGJhY2s6IHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZXJyb3JNZXNzYWdlID0ge1xuXHRcdHNldFN0YXRlOiB7XG5cdFx0XHRoaWRkZW46IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nLFxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJ1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRtZXRob2RzLmVycm9yTWVzc2FnZS50b2dnbGVTdGF0ZShkYXRhKTtcblx0XHRcdH0sXG5cdFx0XHRhY3RpdmU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdhY3RpdmUnLFxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnRvZ2dsZVN0YXRlKGRhdGEpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0U3RhdGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5lcnJvck1lc3NhZ2VDb250YWluZXIpLmdldEF0dHJpYnV0ZSgnc3RhdGUnKTtcblx0XHR9LFxuXHRcdHRvZ2dsZVN0YXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblx0XHR9XG5cdH07XG5cblxuXHRtZXRob2RzLmRhdGVTZWxlY3RvciA9IHtcblx0XHRmdWxsQ2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHR2YXIgZGF0ZSA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNvbnZlcnRGdWxsVG9TZXBlcmF0ZWQoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUudmFsdWUpO1xuXHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yRGF5LnZhbHVlID0gZGF0ZS5kYXk7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JNb250aC52YWx1ZSA9IGRhdGUubW9udGg7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyLnZhbHVlID0gZGF0ZS55ZWFyLnRvU3RyaW5nKCkuc2xpY2UoLTIpO1xuXHRcdH0sXG5cblx0XHRjaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHZhciBlbGVtZW50O1xuXG5cdFx0XHQvLyBjYW5jZWwga2V5dXAtZXZlbnQgaWYga2V5IHdhcyBub3QgYSBudW1iZXIgb3IgVEFCIG9yIEVOVEVSXG5cdFx0XHRpZiAobWV0aG9kcy5kYXRlU2VsZWN0b3IudGVzdEtleVVwRXZlbnQoZXZlbnQpKSB7XG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnRlc3RWYWx1ZXMoKTtcblx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuYXBwbHlTdGF0ZSgpO1xuXG5cdFx0XHRcdGlmIChldmVudC50eXBlID09PSAna2V5dXAnIHx8IGV2ZW50LnR5cGUgPT09ICdrZXlkb3duJykge1xuXHRcdFx0XHRcdGVsZW1lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudC52YWx1ZS5sZW5ndGggPj0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubWF4SW5wdXRMZW5ndGgoZWxlbWVudCkpICYmIChldmVudC5rZXlDb2RlICE9PSAxNikgJiYgKGV2ZW50LmtleUNvZGUgIT09IDkpICYmIChldmVudC5rZXlDb2RlICE9PSA4KSkge1xuXHRcdFx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuanVtcFRvTmV4dElucHV0KGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdGhpcyBpcyBhIGtleWRvd24gYmVpbmcgY2FuY2VsbGVkLCB0aHVzIG5vIGtleXVwIG9jY3VycyBvbiB0aGlzICdjaGFuZ2UnXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0ZXN0VmFsdWVzOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHN0YXRlLmFnZSA9IHtcblx0XHRcdFx0ZGF5OiBlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkudmFsdWUsXG5cdFx0XHRcdG1vbnRoOiBlbGVtZW50cy5kYXRlU2VsZWN0b3JNb250aC52YWx1ZSxcblx0XHRcdFx0eWVhcjogZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhci52YWx1ZVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHN0YXRlLmFnZS5kYXkgJiYgc3RhdGUuYWdlLm1vbnRoICYmIHN0YXRlLmFnZS55ZWFyKSB7XG5cdFx0XHRcdGlmIChtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlLmRhdGVGdXR1cmUoc3RhdGUuYWdlKSkge1xuXHRcdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ3ZhbGlkJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdpbnZhbGlkJztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChzdGF0ZS5hZ2UuZGF5IHx8IHN0YXRlLmFnZS5tb250aCB8fCBzdGF0ZS5hZ2UueWVhcikge1xuXHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdwcm9ncmVzcyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdpbml0aWFsJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChzdGF0ZS5hZ2VTdGF0ZSA9PT0gJ3ZhbGlkJyk7XG5cdFx0fSxcblxuXHRcdHRlc3RGdWxsRGF0ZVN1cHBvcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUudHlwZSA9PT0gJ2RhdGUnKTtcblx0XHR9LFxuXG5cdFx0dGVzdEtleVVwRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0dmFyIGlzS2V5VXAgPSAoZXZlbnQudHlwZSA9PT0gJ2tleWRvd24nKTtcblx0XHRcdHZhciBpc1RhYiA9IChldmVudC5rZXlDb2RlID09PSA5KTtcblx0XHRcdHZhciBpc0VudGVyID0gKGV2ZW50LmtleUNvZGUgPT09IDEzKTtcblx0XHRcdHZhciBpc0JhY2tzcGFjZSA9IChldmVudC5rZXlDb2RlID09PSA4KTtcblx0XHRcdHZhciBpc0RlbGV0ZSA9IChldmVudC5rZXlDb2RlID09PSA0Nik7XG5cdFx0XHR2YXIgaXNOdW1lcmljID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKS5tYXRjaCgvWzAtOV0vKTtcblx0XHRcdHZhciBpc051bXBhZCA9IChldmVudC5rZXlDb2RlID49IDk2KSAmJiAoZXZlbnQua2V5Q29kZSA8PSAxMDUpO1xuXHRcdFx0dmFyIGlzTnVtQW5kcm9pZCA9IChldmVudC5rZXlDb2RlID09PSAyMjkpO1xuXG5cdFx0XHRpZiAoIWlzS2V5VXApIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpc0tleVVwICYmIChpc1RhYiB8fCBpc0VudGVyIHx8IGlzTnVtZXJpYyB8fCBpc0JhY2tzcGFjZSB8fCBpc0RlbGV0ZSB8fCBpc051bXBhZCB8fCBpc051bUFuZHJvaWQpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjb252ZXJ0RnVsbFRvU2VwZXJhdGVkOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHZhbHVlID0gbmV3IERhdGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZGF5OiB2YWx1ZS5nZXREYXRlKCksXG5cdFx0XHRcdG1vbnRoOiB2YWx1ZS5nZXRNb250aCgpICsgMSxcblx0XHRcdFx0eWVhcjogdmFsdWUuZ2V0RnVsbFllYXIoKVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tJbnB1dExlbmd0aDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudEVsZW1lbnQudmFsdWUubGVuZ3RoO1xuXHRcdH0sXG5cblx0XHRtYXhJbnB1dExlbmd0aDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyk7XG5cdFx0fSxcblxuXHRcdG5leHRJbnB1dDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW5leHRmaWVsZCcpO1xuXHRcdH0sXG5cblx0XHRqdW1wVG9OZXh0SW5wdXQ6IGZ1bmN0aW9uIChjdXJyZW50RWxlbWVudCkge1xuXHRcdFx0dmFyIG5leHRJbnB1dERhdGEgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5uZXh0SW5wdXQoY3VycmVudEVsZW1lbnQpIHx8IHVuZGVmaW5lZDtcblx0XHRcdHZhciBlbGVtZW50VG9Gb2N1cyA9IG5leHRJbnB1dERhdGEgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0SW5wdXREYXRhKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0aWYgKG5leHRJbnB1dERhdGEgJiYgZWxlbWVudFRvRm9jdXMpIHtcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZGF0ZUlucHV0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdFx0dmFyIGN1cnJlbnQgPSBvcHRpb25zLmN1cnJlbnQ7XG5cdFx0XHR2YXIgY3VycmVudEtleUNvZGUgPSBvcHRpb25zLmtleUNvZGU7XG5cdFx0XHR2YXIgaW5wdXRMZW5ndGggPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5jaGVja0lucHV0TGVuZ3RoKGN1cnJlbnQpO1xuXHRcdFx0dmFyIG1heElucHV0TGVuZ3RoID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubWF4SW5wdXRMZW5ndGgoY3VycmVudCk7XG5cblx0XHRcdGlmICgoaW5wdXRMZW5ndGggPT09IG1heElucHV0TGVuZ3RoKSAmJiAoY3VycmVudEtleUNvZGUgIT09IDE2KSAmJiAoY3VycmVudEtleUNvZGUgIT09IDkpKSB7XG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmp1bXBUb05leHRJbnB1dChjdXJyZW50KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YXBwbHlTdGF0ZTogZnVuY3Rpb24gKGlucHV0KSB7XG5cdFx0XHRpZiAoaW5wdXQpIHtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCBpbnB1dCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0VmFsdWVzKCk7XG5cblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCBzdGF0ZS5hZ2VTdGF0ZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGdldENvbnRhaW5lcjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmRhdGVGaWVsZENvbnRhaW5lcikgfHwgZmFsc2U7XG5cdFx0fSxcblxuXHRcdGlzU3RhdGVJbnZhbGlkOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0dmFyIGRhdGVDb250YWluZXJzID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IuZ2V0Q29udGFpbmVyKGVsZW1lbnQpO1xuXHRcdFx0c3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkID0gZmFsc2U7XG5cdFx0XHRpZiAoZGF0ZUNvbnRhaW5lcnMpIHtcblx0XHRcdFx0W10uc2xpY2UuY2FsbChkYXRlQ29udGFpbmVycykuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmdldEF0dHJpYnV0ZSgnc3RhdGUnKSAhPT0gJ3ZhbGlkJykge1xuXHRcdFx0XHRcdFx0c3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZDtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xuXHRcdHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XG5cdFx0dmFyIGZvdW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuXHRcdGlmIChmb3VuZCkge1xuXHRcdFx0ZWxlbWVudHMud2luZG93ID0gd2luZG93O1xuXHRcdFx0ZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblx0XHRcdGVsZW1lbnRzLnZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuXHRcdFx0ZWxlbWVudHMuZm9ybUNvbnRhaW5lciA9IGZvdW5kO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5pbml0ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG5cdFx0aWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcblx0XHRcdGVsZW1lbnRzLmZvcm1FbGVtZW50ID0gZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5mb3JtRWxlbWVudCkgfHwgdW5kZWZpbmVkO1xuXHRcdFx0ZWxlbWVudHMucmVxdWlyZWRGaWVsZHMgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLnJlcXVpcmVkRmllbGRzKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRlbGVtZW50cy5wb3N0ZWRDb250YWluZXJzID0gZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5mb3JtUG9zdGVkQ29udGFpbmVyKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cImRhdGVcIl0nKTtcblxuXHRcdFx0aWYgKGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lcikge1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwiZGF5XCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cIm1vbnRoXCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvclllYXIgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwieWVhclwiXScpO1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdmFyaWFudH49XCJmdWxsXCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvciA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbdmFyaWFudH49XCJkYXRlc2VsZWN0b3JcIl0nKTtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQWxsRmllbGRzID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnB1dCcpO1xuXHRcdFx0XHRzdGF0ZS5mdWxsRGF0ZVN1cHBvcnQgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0RnVsbERhdGVTdXBwb3J0KCk7XG5cblx0XHRcdFx0c3RhdGUuaXNNb2JpbGUgPSAoZWxlbWVudHMud2luZG93LmlubmVyV2lkdGggPCA3MDApO1xuXHRcdFx0XHRpZiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUgJiYgc3RhdGUuZnVsbERhdGVTdXBwb3J0ICYmIHN0YXRlLmlzTW9iaWxlKSB7XG5cblx0XHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZS5zZXRBdHRyaWJ1dGUoJ3N0YXRlJywgJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGRhdGVTZWxlY3RvciA9IFtlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXksIGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoLCBlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyXTtcblxuXHRcdFx0XHRPYmplY3Qua2V5cyhkYXRlU2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdGRhdGVTZWxlY3RvcltrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBtZXRob2RzLmRhdGVTZWxlY3Rvci5jaGFuZ2VIYW5kbGVyKTtcblx0XHRcdFx0XHRkYXRlU2VsZWN0b3Jba2V5XS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xuXHRcdFx0XHRcdGRhdGVTZWxlY3RvcltrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0T2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRlbGVtZW50cy5mb3JtRWxlbWVudFtrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG1ldGhvZHMuZm9ybS5jbGlja0hhbmRsZXIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdE9iamVjdC5rZXlzKGVsZW1lbnRzLnJlcXVpcmVkRmllbGRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0ZWxlbWVudHMucmVxdWlyZWRGaWVsZHNba2V5XS5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgbWV0aG9kcy5maWVsZEVsZW1lbnQuZm9jdXNJbik7XG5cdFx0XHRcdGVsZW1lbnRzLnJlcXVpcmVkRmllbGRzW2tleV0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBtZXRob2RzLmZpZWxkRWxlbWVudC5mb2N1c091dCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcblx0XHRpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcblx0XHRcdCQoZWxlbWVudHMuZm9ybUVsZW1lbnQpLm9mZignc3VibWl0JywgbWV0aG9kcy5mb3JtLmNsaWNrSGFuZGxlcik7XG5cdFx0XHQkKGVsZW1lbnRzLmRhdGVTZWxlY3RvckFsbEZpZWxkcykub24oJ2NsaWNrJywgbWV0aG9kcy5kYXRlU2VsZWN0b3Iuc2V0Rm9jdXMpO1xuXHRcdFx0JChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSkub24oJ2NoYW5nZScsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmZ1bGxDaGFuZ2VIYW5kbGVyKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRtb3VudDogbWV0aG9kcy5tb3VudCxcblx0XHRpbml0OiBtZXRob2RzLmluaXQsXG5cdFx0dW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuXHRcdHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG5cblx0XHRzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lclxuXHR9O1xufSgpKTtcbiIsIm1ldGhvZHMubW9kdWxlcyA9IHtcclxuXHQnaW5pdEFsbCc6IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGtleSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmIChtb2R1bGVzW21vZHVsZU5hbWVdLmluaXQpIHtcclxuXHRcdFx0XHRcdHZhciBleGlzdGVkID0gbW9kdWxlc1ttb2R1bGVOYW1lXS5pbml0KHZpZXdwb3J0KTtcclxuXHRcdFx0XHRcdGlmIChleGlzdGVkKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUuaW5mbygnaW5pdGlhbGlzZWQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdmYWlsZWQgdG8gaW5pdCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdCdtb3VudEFsbCc6IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGtleSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmIChtb2R1bGVzW21vZHVsZU5hbWVdLm1vdW50KSB7XHJcblx0XHRcdFx0XHR2YXIgZXhpc3RlZCA9IG1vZHVsZXNbbW9kdWxlTmFtZV0ubW91bnQodmlld3BvcnQpO1xyXG5cdFx0XHRcdFx0aWYgKGV4aXN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmluZm8oJ21vdW50ZWQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdmYWlsZWQgdG8gbW91bnQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQndW5tb3VudEFsbCc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdE9iamVjdC5rZXlzKG1vZHVsZXMpLmZvckVhY2goIGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0bW9kdWxlc1ttb2R1bGVOYW1lXS51bm1vdW50KCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly9jb25zb2xlLndhcm4oJ2ZhaWxlZCB0byB1bm1vdW50IG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQncmVuZGVyQWxsJzogZnVuY3Rpb24gKCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRtb2R1bGVzW21vZHVsZU5hbWVdLnJlbmRlcigpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdC8vY29uc29sZS53YXJuKCdmYWlsZWQgdG8gUmVuZGVyIG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59OyIsInZhciBtb2R1bGVzID0gKHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge30pO1xyXG5cclxubW9kdWxlc1tcImdlbmVyYWxcIl0gPSAoZnVuY3Rpb24oKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIHZhciBlbGVtZW50cywgbWV0aG9kcywgYWNjZXNzaWJpbGl0eTtcclxuXHJcbiAgZWxlbWVudHMgPSB7fTtcclxuICBtZXRob2RzID0ge307XHJcblxyXG4gIG1ldGhvZHMuaHRtbEVsZW1lbnQgPSB7XHJcbiAgICBnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgaWYgKGRhdGEuZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBkYXRhLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KSB8fCBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhc0F0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbihkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKGRhdGEuYXR0cmlidXRlVmFsdWUsIFwiZ2lcIik7XHJcbiAgICAgIHJldHVybiByZWdleC50ZXN0KGF0dHJpYnV0ZVZhbHVlKTtcclxuICAgIH0sXHJcbiAgICBhZGRBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICB2YXIgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuXHJcbiAgICAgIGlmICghbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkpIHtcclxuICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlVmFsdWUgKyBcIiBcIiArIGRhdGEuYXR0cmlidXRlVmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlID0gZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xyXG4gICAgICB2YXIgaGFzQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0F0dHJpYnV0ZVZhbHVlKFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgYXR0cmlidXRlVmFsdWVcclxuICAgICAgKTtcclxuICAgICAgdmFyIHZhbHVlUmVtb3ZlZCA9IGZhbHNlO1xyXG4gICAgICBpZiAoaGFzQXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKGRhdGEuYXR0cmlidXRlVmFsdWUsIFwiZ2lcIik7XHJcbiAgICAgICAgdmFyIG5ld0F0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlVmFsdWUucmVwbGFjZShyZWdleCwgXCJcIikudHJpbSgpO1xyXG4gICAgICAgIGlmIChuZXdBdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgICAgZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgbmV3QXR0cmlidXRlVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsdWVSZW1vdmVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWVSZW1vdmVkO1xyXG4gICAgfSxcclxuICAgIHRvZ2dsZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGRhdGEuYXR0cmlidXRlVmFsdWUgPSBkYXRhLnJlbW92ZUF0dHJpYnV0ZVZhbHVlO1xyXG4gICAgICB2YXIgdmFsdWVUb2dnbGVkID0gZmFsc2U7XHJcbiAgICAgIHZhciByZW1vdmVBdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlVmFsdWUoZGF0YSk7XHJcblxyXG4gICAgICBpZiAocmVtb3ZlQXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgICBkYXRhLmF0dHJpYnV0ZVZhbHVlID0gZGF0YS5hZGRBdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgICBtZXRob2RzLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG4gICAgICAgIHZhbHVlVG9nZ2xlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlVG9nZ2xlZDtcclxuICAgIH0sXHJcbiAgICBoYXNDbGFzczogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcclxuICAgICAgcmV0dXJuIChcIiBcIiArIGVsZW1lbnQuY2xhc3NOYW1lICsgXCIgXCIpLmluZGV4T2YoXCIgXCIgKyB2YWx1ZSArIFwiIFwiKSA+IC0xO1xyXG4gICAgfSxcclxuICAgIGdldENsb3Nlc3RQYXJlbnROb2RlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gZGF0YS5jdXJyZW50RWxlbWVudDtcclxuXHJcbiAgICAgIHdoaWxlIChcclxuICAgICAgICBtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0NsYXNzKFxyXG4gICAgICAgICAgZWxlbWVudCxcclxuICAgICAgICAgIGRhdGEuZ2V0UGFyZW50RWxlbWVudC5hdHRyaWJ1dGVWYWx1ZVxyXG4gICAgICAgICkgPT09IGZhbHNlXHJcbiAgICAgICkge1xyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS5ub2RlTmFtZSB8fCBcImRpdlwiKTtcclxuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBkYXRhLmNsYXNzTmFtZSB8fCBudWxsO1xyXG5cclxuICAgICAgaWYgKGRhdGEgJiYgZGF0YS5hZGRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgZGF0YS5hZGRBdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24oYXR0cmlidXRlRGF0YSkge1xyXG4gICAgICAgICAgYXR0cmlidXRlRGF0YS5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgIG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBtZXRob2RzLmFjY2Vzc2liaWxpdHkgPSB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcclxuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldExvY2FsU3RvcmUoZGF0YS5lbGVtZW50KTtcclxuICAgIH0sXHJcbiAgICBnZXRGcm9tRWxlbWVudDogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICByZXR1cm4gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XHJcbiAgICB9LFxyXG4gICAgc2V0TG9jYWxTdG9yZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICByZXR1cm4gKGFjY2Vzc2liaWxpdHkgPSBtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0RnJvbUVsZW1lbnQoZGF0YSkpO1xyXG4gICAgfSxcclxuICAgIGdldExvY2FsU3RvcmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYWNjZXNzaWJpbGl0eTtcclxuICAgIH0sXHJcbiAgICBkYXRhTW91c2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICBlbGVtZW50OiBlbGVtZW50cy5ib2R5LFxyXG4gICAgICAgIGF0dHJpYnV0ZUtleTogXCJhY2Nlc3NpYmlsaXR5XCIsXHJcbiAgICAgICAgYWRkQXR0cmlidXRlVmFsdWU6IFwibW91c2VcIixcclxuICAgICAgICByZW1vdmVBdHRyaWJ1dGVWYWx1ZTogXCJrZXlib2FyZFwiLFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0sXHJcbiAgICBkYXRhS2V5Ym9hcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICBlbGVtZW50OiBlbGVtZW50cy5ib2R5LFxyXG4gICAgICAgIGF0dHJpYnV0ZUtleTogXCJhY2Nlc3NpYmlsaXR5XCIsXHJcbiAgICAgICAgYWRkQXR0cmlidXRlVmFsdWU6IFwia2V5Ym9hcmRcIixcclxuICAgICAgICByZW1vdmVBdHRyaWJ1dGVWYWx1ZTogXCJtb3VzZVwiLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMuZXZlbnRMaXN0ZW5lciA9IHtcclxuICAgIG1vdXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgbWV0aG9kcy5ldmVudExpc3RlbmVyLnNldEtleWJvYXJkKTtcclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0TW91c2UpO1xyXG4gICAgfSxcclxuICAgIGtleWJvYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0TW91c2UpO1xyXG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRLZXlib2FyZCk7XHJcbiAgICB9LFxyXG4gICAgc2V0TW91c2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5kYXRhTW91c2UoKTtcclxuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldChkYXRhKTtcclxuICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyLm1vdXNlKCk7XHJcbiAgICB9LFxyXG4gICAgc2V0S2V5Ym9hcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5kYXRhS2V5Ym9hcmQoKTtcclxuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldChkYXRhKTtcclxuICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyLmtleWJvYXJkKCk7XHJcbiAgICB9LFxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMuaW5pdCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XHJcbiAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XHJcbiAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgZWxlbWVudDogZWxlbWVudHMuYm9keSxcclxuICAgICAgYXR0cmlidXRlS2V5OiBcImFjY2Vzc2liaWxpdHlcIixcclxuICAgIH07XHJcblxyXG4gICAgZGF0YS5hZGRBdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5nZXRGcm9tRWxlbWVudChkYXRhKTtcclxuXHJcbiAgICBtZXRob2RzLmFjY2Vzc2liaWxpdHkuc2V0TG9jYWxTdG9yZShkYXRhKTtcclxuXHJcbiAgICBpZiAobWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmdldExvY2FsU3RvcmUoKSA9PT0gXCJtb3VzZVwiKSB7XHJcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5tb3VzZSgpO1xyXG4gICAgfSBlbHNlIGlmIChtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0TG9jYWxTdG9yZSgpID09PSBcImtleWJvYXJkXCIpIHtcclxuICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyLmtleWJvYXJkKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXHJcbiAgICBpbml0OiBtZXRob2RzLmluaXQsXHJcbiAgICB1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXHJcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxyXG4gICAgaHRtbEVsZW1lbnQ6IG1ldGhvZHMuaHRtbEVsZW1lbnQsXHJcbiAgfTtcclxufSkoKTtcclxuIiwiY2xhc3MgZmlsZVVwbG9hZFNob3dQcmV2aWV1dyB7XG4gIGNvbnN0cnVjdG9yKGZpbGVVcGxvYWRDb250YWluZXIpIHtcbiAgICB0aGlzLmZpbGVVcGxvYWRDb250YWluZXIgPSBmaWxlVXBsb2FkQ29udGFpbmVyO1xuICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5ID0gW107XG5cbiAgICB0aGlzLmlucHV0VHlwZUZpbGUgPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwiZmlsZVwiXScpO1xuICAgIHRoaXMuaW5wdXROYW1lRmlsZSA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJmaWxlXCJdJyk7XG4gICAgdGhpcy5pbnB1dExhYmVsID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIudXBsb2FkLWZpZWxkLWNvbnRyb2xcIlxuICAgICk7XG4gICAgdGhpcy5pbWFnZVByZXZpZXdDb250YWluZXIgPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnW3ZhcmlhbnQ9XCJmaWxlLXByZXZpZXdcIl0nXG4gICAgKTtcbiAgICB0aGlzLmVyYXNlSW1hZ2VCdXR0b24gPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5lcmFzZS1maWxlLXVwbG9hZFwiXG4gICAgKTtcblxuICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0ge1xuICAgICAgYmFzZUltYWdlOlxuICAgICAgICBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBaVFBQUFENkNBTUFBQUNtaHF3MEFBQUErVkJNVkVVQUFBRDI5dTN1N3VudDdlbnQ3ZW51N3VqdTd1aWhvcUNpbzZHaW82S2pwS09rcGFTbXBxU21wNldvcUthcXE2bXFxNnFycTZxc3JhdXRyYXV1cjYyd3NhNnhzYSt4c3JDeXM3R3p0TEswdGJLMXRyUzJ0N1MzdDdXNHViYTV1cmU2dTdlN3ZMbTh2YnU5dnJ2QXdMM0F3YjNEeE1IRnhjUEd4c1BIeDhUSXljWEx6TWpMek1uTXpNbk56c3JQejh2UDBNelEwTTNTMHMvVTFORFYxZExYMTlUWTJOVFkyTlhaMmRiYTJ0WGIyOWJjM05mYzNOamMzZG5kM2RyZTN0cmUzOXZnNE52aDRkemk0dDNpNHQ3ajQ5N2s1Ti9rNU9EbDVlRGw1ZUhsNXVMbTV1SG41K0xvNk9QcDZlVHE2dVhyNiticzdPZnQ3ZWg1NEt4SUFBQUFCM1JTVGxNQUhLYmw1dXp0dnFsOXN3QUFCQTFKUkVGVWVOcnQzVmxUMDFBWWdPRzBvRUVFOTEwVVJOekZCVkZjcUNnS2lyTFUvUDhmSTNRWWJFT1NkdHJNeUp6enZIZk1sRng4MzNOQlF1WTBTUnJOOFV3cWFielpTSkxHYVlOUVZhY2FTZE1VVkYwekdUTUVWVGVXbUlINkJZa2dFU1NDUkpBSUVrRWlTQ1JJQklrZ0VTU0NSSkFJRWtFaVFTSklCSWtnRVNTQ1JKQUlFZ2tTUVNKSUJJa2dFU1NDUkpCSWtBZ1NRU0pJQklrZ0VTU0NSSUpFa0FnU1FTSklCSWtna1NBUkpJSkVrQWdTUVNKSUJJa0VpU0FSSklKRWtBZ1NRU0pJSkVnRWlTQVJKSUpFa0FnU1FTSkJJa2dFaVNBUkpJSkVrQWdTQ1JKQklrZ0VpU0FSSklKRWdrU1E1UHZ4YmRTK3R5RUp1WlZiMCtub1RWNTc5Z2VTUUdzL1NPdnF4aVlrWWZZd3JhK3JiVWhDN05ORWpValNKNUNFMlAwNmphVG5JQW14S3dlN3ZiNDY4dDNOMTRXT2tpMUlBdXpNd1dyZjFIQ2gzUTZTOTVBRVdHZTFiMC9XbFNDQkJCSklJQWtkU1h2dDFhTlhhMjFJSUNsZDdkSlU1K2VwSlVnZ0tWN3R6dXpSQTQvWkhVZ2dLVnJ0Zk5kanNYbElJQ2xZN1hMUHc5TmxTQ0E1dnRxTFBVZ3VRZ0xKc2RYK3p2MGZaaHNTU1BLclhja2hXU241alY4ekc1REVpdVIxRHNuckVpT1gwdk1ia0VTS1pEV0haTFhNU0Zxc0JKSUlrT3oxdm40MHNWZHFwRmdKSkRIYzNkenNRWEt6d2tpaEVraGlRTEkrMmYzeSszcVZrU0lsa01TQUpGdnNRckpZYmFSQUNTUlJJTWxlbmowVWNQWmxQeVBIbFVBU0I1SnNjKzdjd2V2TWM1djlqUnhUQWtra1NQYmIrcmlWWllNWXlTdUJKQjRrSlJVWXlTbUJKSFlraFVaNmxVQVNPWklTSXoxS0lJa2JTYW1SYmlXUXhJWmt2VDJZa1M0bGtFU0dwRFY5dHoyWWtYOUtJSWtMU1dzNlRZK1U5REZ5cEFTU3FKQzBPaWNmSFNycGEyVC9rNUJFaDZSMWVEcFdSOGtBUnRJWlNHSkQwam82UVcxZnlTQkdJSWtPU2F2cmxMMjdQd2N4QWtsc1NGbzlKekZPcHBCQWtsOXRhNWpUT2lHSkNzbFFSaUNKQ3Nsd1JpQ0pDY21RUmlDSkNNbXdSaUNKQjhtWG9VK1loeVFhSk05VFNDQ0JCQkpJSUlFRUVrZ2dnUVFTU0NDSkFzbnl6TEE5aGlRV0pDZm5TcEJBQWdra2tBVFh4RkNuUHhmVTdpQjVCMG1BWFQ1WTdaM3QwWTA4N1NEWmdDVEE3dFg2Ylo1VEdTUUJ0bHdya2dWSWdteStSaU1YZGlFSnNwM2I5Um41bkVFU2FDL08xL1AzeU1KdUJrbTRiWDk0TzJydk5pS2JXWFJJQklrZ0VTU0NSSkFJRWtFaVFTSklCSWtnRVNTQ1JKQUlFZ2tTUVNKSUJJa2dFU1NDUklKRWtBZ1NRU0pJQklrZ0VTUVNKSUpFa0FnU1FTSklCSWtna1NBUkpJSkVrQWdTUVNKSUJJa0VpU0FSSklKRWtBZ1NRU0pJSkVnRWlTQVJKSUpFa0FnU0NSSkJJa2dFaVNBUkpJSkVrRWlRQ0JKQklrZ0VpU0FSSklKRWdrU1FDQkpCSWtnRWlTQVJKQklrZ2tTUTZQOGdHVE1EVlRlV05BMUIxVFdUeG1sVFVGV25Ha25TYUk0YmhNb2FiemFTdis0QkhGVm9IWnpmQUFBQUFFbEZUa1N1UW1DQ1wiLFxuICAgICAgc3VjY2Vzc1BkZjpcbiAgICAgICAgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWlRQUFBRDZDQU1BQUFDbWhxdzBBQUFDQ2xCTVZFVUFBQUQyOXUzdTd1bnQ3ZW50N2VudTd1anU3dWhZb3dCYnBBUmNwUVpkcGdoanFCRmxxUlJxckIxdHJTQnVyaUp3cnlWeXNDaDZ0RFdBdHoyQ3VFS0d1a2VRdjFhVndWK1l3Mk9adzJTYXhHV2F4R2VieEdtZnhtNmhvcUNpbzZHaW82S2pwS09rcGFTa3lYZW1wcVNtcDZXbnFLYW55bnFvcUthb3FhZXBxcWlxcTZpcXE2bXFxNnFxekg2cnE2cXJyS3V0cmF1dHJxeXVyNnl2cjYyd3NhNnhzYSt4c3JDeXNyQ3lzN0N5czdHenM3R3p0TEd6dExLMHRiSzB0Yk8xdGJPMXRyUzJ0N1czdDdXM3VMYTMwcE80dWJhNXViZTV1cmU2dTdlN3ZMbTh2THE4dmJ1ODFacTgxWnk5dnJ1OTFaNit2cnkrdjd5L3Y3Mi93TDIvMXFEQXdMM0F3YjNBd2I3QndyN0N3ci9DdzcvRHc4RER4TUREeE1IRDJLWEV4TUhFeE1MRnhjUEZ4c1BHeHNQRzJxdkh4OFRIeU1USXlNWEl5Y1hKeWNiSnlzYkt5c2ZLeThmSzI3REszTEhMeThmTHk4akx6TW5Nek1uTnpjbk56c3JQejh2UDBNelEwTTNSMGMzUjBzN1Mwcy9VMU5EVTFkSFcxOVBYNHNYWTJOVFkyTlhZMmRYWjJkWFoyZGJhMnRYYTJ0YmEyOWJiMjliYjVNcmI1TXZjM05mYzNOamMzZGpjM2RuZDNkbmUzdHJlMzl2ZjM5dmc0TnZnNTlQaDRkemg0ZDNpNHQzaTR0N2k2TmJqNDk3azVOL2s1T0RsNWVEbDVlSGw1dUxsNmRybTV1SG41K0xuNStQbzZPUHA2ZVRxNnVYcTYrTHE3T1ByNiticzdPWHM3T2Z0N2VmdDdlakE5dFZ5QUFBQUIzUlNUbE1BSEtibDV1enR2cWw5c3dBQUJZZEpSRUZVZU5ydDNHbDNFMlVZZ09Fa0xSUkZFUGM5aEFxSUNBcW80QWFpb2lndWlPS0dpcUFvVUhHalFoV0xJSWdpaUNqSUl0U3FRQXNSNXo5SzI1bUdKRzA2VGZzaHpWejNGMmptYlE5bm51dGtlV2RLS3BYT05BYlNJRFZtMHFsVWVyd1RvVXFOUzZjeXpvSXFsMGsxT0FtcVhFUEtPZEJRUVNKSUJJa2dFU1NDUkpBSUVna1NRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVrQWdTUVNKSUJJa2dFU1FTSklKRWtBZ1NRU0pJQklrZ2tTQVJKSUpFa0FnU1FTSklKRWdFaVNBUkpJSkVrQWdTUVNKQklrZ0VpU0FSSklKRWtBZ1NDUkpCSWtnRWlTQVJKSUpFa0VpUUNCSkJJa2dFaVNBUkpJSkVna1NRQ0JKQklrZ0VpU0NSSUJFa2drU1FDQkpCSWtnRWlRU0pJQkVrZ2tTUUNCSkJJa2drU0FTSklCRWtna1NRQ0JKQklrRWlTQVNKSUJFa2drU1FDQklKRWtFaVNBU0pJQkVrZ2tTUVNKQUlFa0VpU0FTSklCRWtFaVNDUkpBSUVrRWlTQVNKSUpFZ0VTU0NSSkFJRWtFaVNBU0pCSWtnRVNTQ1JKQUlFa0VpU0NSSUJJa2dFU1NDUkpBSUVrRWlRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVpVVp5c3UzeXZtcmZjL2hFdm56Vi9yYVMybjg4ZG1hUW4xaTJ0dEJ1U01aazMyVExhbjU0N1o2U1ZhdXlBNVJiOHZtUkFYN2lnR3Y3ZWh5U2VrSFMwN3pXcmxpRHYyZHpGeVJKUlpMTnp0a1hiL0F6UCttR0pLbElzdGtOc1FhZnpjNytHWkxFSXNsdWlZY2ttMnVESkJGSW11ZjIxbHcwMUozeGtHU3pheUJKQXBJbndxLy9Pcmg5ZnY5UTUrWkxCcisrSzZ6enlQZGJIczBWeHIreEhFbi8ya0o1U09vQ3lhWHlYODZNWnQ5YU12Z05SZDk3NXAxYytaUE9JR3NUVW1LUUJNR2hxZUdqQzRjWS9LbUgramRYamtLU0xDVEIydkRScWY4TU1manU1WkdTSlpBa0RFaytlZ1BiUHRUZ0x5Nk9sT3lESkZsSWdvWGh3MThNT2ZpT0dlR3hSeUJKR0pLVjBVZVVvUWUvUFhvcTJRdEpzcEI4RkQ3ODV0Q0R6ODhLRDc0RlNiS1F2QkErL0VHTXdXOE1EOTRIU1RMZmsyeU5NZmlqMGV2Tk1VZ1MrZWxtWjV4bmh4bEZvaUJKQ0pMTjBUN0oyVGhJbmltNmdnTkpNcEFjbXphc2o3WHJ3cU1yaXRhdU9WMWNKeVQxaE9Udy9kRzdqRzJ4a0xTRVJ4Y1hyVTNlSmVBRUlUbFZtUEs4ZkN3azI4S2pDeUNwYnlSejF2VDI3QVBObGU0bkdSakoxOUdkQlpBazc4NjBBb25LU0ZxTHJobERraVFrcTRPWVNEYUVSNStDSkdGSW1yY0hjWkc4RVI1ZENVbWlrT1JXbkFoaUkxbFVkRFV3V3Z0Y2UzRS9sSC9qN3grK1YralR2eUVaUzBnV3JPOG9YbFVSU1ZldTZPYVQySnRwLzk3YVZOUVY5MEpTMjBobUxPMXQrYXAxTGQrZUxWdFZjZkRmUmM4KzU0YUg1SzZtMGw2Q1pJenNrd3hVeGNHdkNBOCtGZ3dQeWVReUpOZERVcWRJVGtldk5oOFBFMG1aa2FhcklhbFRKSzlFcnpaL2pnREpoQmQzVFdwcW1neEpmU0xaV2ZwYmZOVWdtZkJhRVB4MEpTUjFpdVI0ZERQSnRNN3FrZlFZZ2FSdWtSeU1qR1RYQmxVZ21mVFpUWkdSQTE1dWFxbHpPOVp0K1dWVWtIUzNSRGVlWkJmbHEwQXk4VUFRM0ZJd0Frbk50SGQyendoZno0OFl5Y25XMmYzYmIzZDNCRlVnbVhMaDBoKzM5UnVCcEZicW5ONDN3MDNWSUhteU5hemwzZWZuWDc2TGZ5aW9Ca25URFJmNi90cG5CSkphYVgzMFJqTmZCWkpCbXJVL3FBNUpxQ1EwQWttdHREU2E3SytqaG1SaFIxQXRrbDRsa1JGSWFxVmx4YjhsTTNJa3ViZTdnK3FSWEZMU2J3U1NXbWxUT01QcEYwY0ZTZTdWMDdIM1ZBYmVKNWt5c1FtU0dxdHJUdDhNMjRKUlFQTGcrNmZpNzZtVWRsWFp0WnRySWFtUmp2Zjg3MFROVzRNUklXbWV1MmpaNmgyZHc5aFRLZS9HTWlSM1FsSXJYZnh0eCs2ek5mRHYrT09hRWlQWG5ZZEVKWjEvK3ZhYkM5M3g4bjhCSktyL0lCRWtna1NRQ0JKQklrZ0VpUVNKSUJFa2drU1FhQ3doYVhBT1ZMbUdWTVpKVU9VeXFmUjRaMEdWR3BkT3BkS1pSaWRDZzlXWVNhZitCd3JXL2c0c0tPdERBQUFBQUVsRlRrU3VRbUNDXCIsXG4gICAgICBzdWNjZXNzVmlkZW86XG4gICAgICAgIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFmUUFBQUQ2Q0FZQUFBQlhxN1ZPQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBRWJCSlJFRlVlQUh0M1UrTW5IVVpCL0RmN0U3L2JtZVgxdTF1VzZCQVc2QkZnNml4dEFxYVlHSTBNUnpBdXhkT2V0S1ROOUVZcjU2OEtHZHZrcEJnb2pFUm83U1dKbWdRcVczQmlvSllPcnV0UzNmYjdqL0dtVFpkVzNaMk83T2RtZmQ5bi9sczBqRDd6anZ2KzNzK3p3TmZadWFkVG1seThtd3QrU0ZBZ0FBQkFnUUtMVEJRNk5WYlBBRUNCQWdRSUhCVlFLQWJCQUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQlFSa0NBUUhjRkZoWVcwNm5UcDFQMTNFU2FucG5wN3NsdTgrZ0RBd05wMDZhTmFYaDRKTzNjT1piR3g4YlM0T0RnYlI3Vnd3a1E2SVZBYVhMeWJLMFhKM0lPQXYwbzBBanpsNDhjVGRQVCtRN3lsWHF6ZnYzNnRHL2ZublR2UGJ0VEkrejlFQ0NRWHdIL2h1YTNOMVlXUUtEeHpMeW9ZZDdnbjV1YlN5ZE9uRXhIamg1TGx5OWZEdEFSSlJDSUt5RFE0L1pXWlRrUU9IZXVtb05WM1A0U3BxWStxTC9TOE1kMGNYcjY5Zy9tQ0FRSWRFVkFvSGVGMVVFSlhCT1ltYmtVaG1KMmRpNGRPM1pjcUlmcHFFS2lDYmdvTGxwSDFaTjdnY2I3MGlNakk3bFlaN1hhM2lzSTEwUDkwS01IVTZXeUpSYzFXQVFCQXRjRUJMcEpJTkJqZ1VhWVAzcndNejArYS9QVHZmakxYeTI3NDJQYnRxVmRkKzVNcDA2K21lYm01NWJkZnpYVVh6bWVoUG95R2hzSVpDcmdKZmRNK1oyY1FQNEVCdW9mVTd0bjk5M3BzY2NPMVQvQ3RxbnBBcStIdXZmVW0vTFlTQ0FUQVlHZUNidVRFc2kvd09iTm05UG5EaDljUGRTOXA1Ny9SbHBoM3dnSTlMNXB0VUlKdEMvUWVJWXUxTnQzOHdnQ1dRZ0k5Q3pVblpOQWdRU0Vlb0dhWmFsOUxTRFErN3I5aWlmUW1rQWoxQThmK216YXRIR1Y5OVM5L040YXByMElkRWxBb0hjSjFtRUpSQk5vdktkKytMQlFqOVpYOWNRUkVPaHhlcWtTQWwwWEVPcGRKM1lDQW1zV0VPaHJwdk5BQXYwcElOVDdzKytxenIrQVFNOS9qNnlRUU80RWhIcnVXbUpCQkpKQU53UUVDS3hKUUtpdmljMkRDSFJOUUtCM2pkYUJDY1FYYUNYVWo3L3k2dFd2WVkydm9VSUMyUW9JOUd6OW5aMUE0UVZ1RmVxWHIxeE9yNzMyMThMWHFRQUNlUmNRNkhudmtQVVJLSURBclVMOS9YUG4wdm56RndwUWlTVVNLSzZBUUM5dTc2eWNRSzRFYmhYcWI3NTFKbGZydFJnQzBRUUVlclNPcW9kQWhnS05VRDlZLzJyWVVxbTBiQlVURXhOcGZuNSsyWFliQ0JEb2pJRHZRKytNbzZNUUNDT3d1TGlZWm1ZdXJibWVnWUdCTkRxNkxWV3JremNkbzFhcnBXbzkxSGZ0M0huVGRyOFFJTkFaQVlIZUdVZEhJUkJHNFB6NTgrbWwzLzIrSy9WY21ybmNsZU02S0FFQ3llZlFEUUdCZmhZb2x3ZDdXdjdzM0d4UHorZGtCUHBKd0h2by9kUnR0Ukw0aUVDbFV2bklsaTcvV3V2eThSMmVRQjhMQ1BRK2JyN1NDZXpidXdjQ0FRSkJCQVI2a0VZcWc4QmFCTWJIeDlLQi9RODB2U3A5TGNmekdBSUVzaE53VVZ4MjlzNU1JQmNDZSt2UDBzZkh4MVBqWTJVemwrcFh0M2ZnWmZIR3g5UGUvZmQ3dWFqUElnajBpNEJBNzVkT3E1UEFLZ0pidGd5bHhwOU8vVFErOWliUU82WHBPQVJhRS9DU2UydE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdRRWVtdE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdSY0ZOZWFrNzBJWkNZd05UV1YvbjdtN2ZvWG15eGt0b1k3UmlycC92djNwY2JmMCs2SEFJRjhDZ2owZlBiRnFnZ3NDYnh4NGxUOXU4VFBMLzJleFkxcXRacUdoNGZUenAwN3NqaTljeElnMElLQS85MXVBY2t1QkxJVW1KMjlrdVhwbDg1OVpkYmZ3NzZFNFFhQkhBb0k5QncyeFpJSUVDQkFnRUM3QWdLOVhUSDdFK2l4UUY3ZXR5NFA5dmFiMlhyTTdIUUVDaThnMEF2ZlFnVkVGN2p2dm50VHVaenQ1UzRqSThOcGJHeDdkR3IxRVNpMFFMYi9sU2cwbmNVVDZJM0E3cnZ2U28wL2ZnZ1FJTENhZ0dmb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRXhEb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRTNCUjNHbzY3aU9RRTRFTEY2YlN3c0pjWnF1cFZJYlR4bzBiTWp1L0V4TWdjR3NCZ1g1ckkzc1F5RlRnOWRmZlNQLzgxenVacnFGVUtxVXZQUDc1Vktsc3lYUWRUazZBd01vQ1huSmYyY1k5QkhJaE1ERTVtZms2YXJWYW1zekJPaktIc0FBQ09SWVE2RGx1anFVUnlKTkFMVStMc1JZQ0JKWUpDUFJsSkRZUUlFQ0FBSUhpQ1FqMDR2WE1pdnRNWUhoNEpCY1YzekdTajNYa0FzTWlDT1JRd0VWeE9XeUtKUkc0VWVDVEQzOGlqWTl2VC9Qejh6ZHU3dW50UnBodjNYcEhUOC9wWkFRSXRDY2cwTnZ6c2plQm5ndVV5NFBwcmp0MzlmeThUa2lBUUxFRXZPUmVySDVaTFFFQ0JBZ1FhQ29nMEp1eTJFaUFBQUVDQklvbElOQ0wxUytySlVDQUFBRUNUUVVFZWxNV0d3a1FJRUNBUUxFRVhCUlhySDVaYlI4S1ZLdlZkT3JVVzJsK0lidXIzQnNmbld0Y2JkKzRRTThQQVFMNUZCRG8rZXlMVlJGWUVtaUUrWCtucHBaK3orTEd6TXlscXgrZGM3VjlGdnJPU2FBMUFZSGVtcE85Q0dRbWtPVXo4eHVMenZKejhEZXVvNTNiRitlcTZiMkxKOVBpaDYxL1U5Mkd3YUYwNS9CRGFXTjV1SjFUMlpkQTVnSUNQZk1XV0FBQkFwMFdxTlVXMC9Nbm4wMi8vY2ZQMW5UbzhzRDY5T1NEMzAxZnV1K2JhM3E4QnhISVFzQkZjVm1vT3llQk5nVFdsZGUxc1hmM2RsMjNMaC9yYUtYQzM1ejV5WnJEdkhIOGhmb3ordWYvOW9QMDU3TXZ0bkk2K3hESWhZQm42TGxvZzBVUVdGbmd3UWYzNWVLaXVCM2o0eXN2TW1mM0hIM241eDFaVWVNNG45cnh0WTRjeTBFSWRGdEFvSGRiMlBFSjNLYkE5dTNiVStPUG45WUZxcGZlYm4zblZmYWM2TkJ4VmptRnV3aDBUTUJMN2gyamRDQUNCSW9xTUZncXAyYysvZFAwdlM4ZVNkczIzYjFVUnEzMjRkSnROd2prWFVDZzU3MUQxa2VBUUZjRnJvWDVjL1dYMXA5TVkwTjcwN2NQL1NLdEc5elkxWE02T0lGdUNBajBicWc2SmdFQ2hSQzRIdVlQajMrbEVPdTFTQUtyQ1FqMDFYVGNSNEJBNFFVYUw2Ri81L0FMNmZIZDM3aXBsbVpoZnY3eU8rbkh4NTVPODR0WGJ0clhMd1NLSU9DaXVDSjB5Um9KRUZpVHdOQzZyZldYMEorLytyNzQzcTJQcHZMQXV2VFMyOCtsbGNQOHFkUUlkVDhFaWlnZzBJdllOV3NtUUtBbGdjcUcwVFN5Y2NmU3ZsOS82SWVwVkJwTTkyODduRzU4bWYzYU0zTmh2Z1RsUmlFRnZPUmV5TFpaTkFFQ3JRaWNuWDR6UGZlblo5Smk3ZjlmYlBQMGdlOEw4MWJ3N0ZNNEFZRmV1SlpaTUFFQzdRajg1ZjFmTHd2MTY0LzN6UHk2aEg5R0VCRG9FYnFvQmdJRVZoVm9GdXJDZkZVeWR4WlFRS0FYc0dtV1RJQkErd0kzaHJvd2I5L1BJL0l2NEtLNC9QZklDb01KVE5XLzIveVY0NjhHcStybWNoWVhGMi9la0pQZkdxSCtvejg4a1M3T1RxU1orUXM1V1pWbEVPaU1nRUR2aktPakVHaFpZRzV1TGxXcjFaYjNEN1ZqcVRmVlZOYVBwb3R6RTAxUDFyaFFydFdmeWdaL2gzNnJWdmJMWHNCTDd0bjN3QW9DQzJ3WkdncGNYZnVsRFczZTNQNkQxdkNJajQ4OXNZWkhMWC9JUTlzN2M1emxSN2FGUU9jRkJIcm5UUjJSd0pMQTlySFJwZHY5ZnFOVUtxWFIwZDU0UEhYZzJiU3JzdisyeVBlUFBwNit2T2RidDNVTUR5YlFTNEhTNU9UWldpOVA2RndFK2tsZ1lXRXh2WHprYUpxZW51bW5zcHZXZW1EL0EybnYzajFONyt2R3hzVVA1OUtyLzNraHZmdkJpZnJuME9kYVBzV0d3YUcwZStTUjlNaU9yOVlmMDZQM0NGcGVuUjBKckN3ZzBGZTJjUStCamdnMFF2M1U2ZE9wZW00aVRjLzBWN0NYeTRPcFVxbWtmZlVnSHg4ZjY0aW5neEFnMEZ4QW9EZDNzWlVBQVFJRUNCUkt3SHZvaFdxWHhSSWdRSUFBZ2VZQ0FyMjVpNjBFQ0JBZ1FLQlFBZ0s5VU8yeVdBSUVDQkFnMEZ4QW9EZDNzWlVBQVFJRUNCUktRS0FYcWwwV1M0QUFBUUlFbWdzSTlPWXV0aElnUUlBQWdVSUpDUFJDdGN0aUNSQWdRSUJBY3dHQjN0ekZWZ0lFQ0JBZ1VDZ0JnVjZvZGxrc0FRSUVDQkJvTHZBL0s0czNNM2o1MmhZQUFBQUFTVVZPUks1Q1lJST1cIixcbiAgICAgIHN1Y2Nlc3NNdWx0aXBsZTpcbiAgICAgICAgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWZRQUFBRDZDQVlBQUFCWHE3Vk9BQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFFM0ZKUkVGVWVBSHQzVXRzWE5kNUIvQXpFbW1iSWlWWmpralJUaUpMaVo1VzJqaDJFanR0MHdBcFVEUkEwRVhTZlRkWnRhdDAxVjBlS0xydHFwdkU2KzVxSU11Z1FGT2tTUnpia295NlVHUXJla1ZPVFVva0pkRjhtZzlONTlLUmJKbXY0Y3lkbVh1Lyt4dURNRGx6NzdubiszMUgrbXZ1ek9YVXBxYkc2OG1OQUFFQ0JBZ1FLTFhBcmxMUDN1UUpFQ0JBZ0FDQk5RR0JiaUVRSUVDQUFJRUFBZ0k5UUJPVlFJQUFBUUlFQkxvMVFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG8xZ0FCQWdRSUVBZ2dJTkFETkZFSkJBZ1FJRUJBb0ZzREJBZ1FJRUFnZ0lCQUQ5QkVKUkFnUUlBQUFZRnVEUkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWpWQWdBQUJBZ1FDQ0FqMEFFMVVBZ0VDQkFnUUVPaldBQUVDQkFnUUNDQWcwQU0wVVFrRUNCQWdRRUNnV3dNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNE5FQ0JBZ0FDQkFBSUNQVUFUbFVDQUFBRUNCQVM2TlVDQUFBRUNCQUlJQ1BRQVRWUUNBUUlFQ0JBUTZOWUFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0JiQXdRSUVDQkFJSUNBUUEvUVJDVVFJRUNBQUFHQmJnMFFJRUNBQUlFQUFnSTlRQk9WUUlBQUFRSUVCTG8xUUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEbzFnQUJBZ1FJRUFnZ0lOQURORkVKQkFnUUlFQkFvRnNEQkFnUUlFQWdnSUJBRDlCRUpSQWdRSUFBQVlGdURSQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1alZBZ0FBQkFnUUNDQWowQUUxVUFnRUNCQWdRRU9qV0FBRUNCQWdRQ0NBZzBBTTBVUWtFQ0JBZ1FFQ2dXd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0TkVDQkFnQUNCQUFJQ1BVQVRsVUNBQUFFQ0JBUzZOVUNBQUFFQ0JBSUlDUFFBVFZRQ0FRSUVDQkFRNk5ZQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQmJBd1FJRUNCQUlJQ0FRQS9RUkNVUUlFQ0FBQUdCYmcwUUlFQ0FBSUVBQWdJOVFCT1ZRSUFBQVFJRUJMbzFRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvMWdBQkFnUUlFQWdnSU5BRE5GRUpCQWdRSUVCQW9Gc0RCQWdRSUVBZ2dJQkFEOUJFSlJBZ1FJQUFBWUZ1RFJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVqVkFnQUFCQWdRQ0NBajBBRTFVQWdFQ0JBZ1FFT2pXQUFFQ0JBZ1FDQ0FnMEFNMFVRa0VDQkFnUUVDZ1d3TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRORUNCQWdBQ0JBQUlDUFVBVGxVQ0FBQUVDQkFTNk5VQ0FBQUVDQkFJSUNQUUFUVlFDQVFJRUNCQVE2TllBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtCYkF3UUlFQ0JBSUlDQVFBL1FSQ1VRSUVDQUFBR0JiZzBRSUVDQUFJRUFBZ0k5UUJPVlFJQUFBUUlFQkxvMVFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG8xZ0FCQWdRSUVBZ2dJTkFETkZFSkJBZ1FJRUJBb0ZzREJBZ1FJRUFnZ0lCQUQ5QkVKUkFnUUlBQUFZRnVEUkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWpWQWdBQUJBZ1FDQ0FqMEFFMVVBZ0VDQkFnUUVPaldBQUVDQkFnUUNDQWcwQU0wVVFrRUNCQWdRRUNnV3dNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNE5FQ0JBZ0FDQkFBSUNQVUFUbFVDQUFBRUNCQVM2TlVDQUFBRUNCQUlJQ1BRQVRWUUNBUUlFQ0JBUTZOWUFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0JiQXdRSUVDQkFJSUNBUUEvUVJDVVFJRUNBQUFHQmJnMFFJRUNBQUlFQUFnSTlRQk9WUUlBQUFRSUVCTG8xUUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEbzFnQUJBZ1FJRUFnZ0lOQURORkVKQkFnUUlFQkFvRnNEQkFnUUlFQWdnSUJBRDlCRUpSQWdRSUFBQVlGdURSQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1alZBZ0FBQkFnUUNDQWowQUUxVUFnRUNCQWdRRU9qV0FBRUNCQWdRQ0NBZzBBTTBVUWtFQ0JBZ1FFQ2dXd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0TkVDQkFnQUNCQUFJQ1BVQVRsVUNBQUFFQ0JBUzZOVUNBQUFFQ0JBSUlDUFFBVFZRQ0FRSUVDQkFRNk5ZQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQmJBd1FJRUNCQUlJQ0FRQS9RUkNVUUlFQ0FBQUdCYmcwUUlFQ0FBSUVBQWdJOVFCT1ZRSUFBQVFJRUJMbzFRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvMWdBQkFnUUlFQWdnSU5BRE5GRUpCQWdRSUVCQW9Gc0RCQWdRSUVBZ2dJQkFEOUJFSlJBZ1FJQUFBWUZ1RFJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVqVkFnQUFCQWdRQ0NBajBBRTFVQWdFQ0JBZ1FFT2pXQUFFQ0JBZ1FDQ0FnMEFNMFVRa0VDQkFnUUVDZ1d3TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRORUNCQWdBQ0JBQUlDUFVBVGxVQ0FBQUVDQkFTNk5VQ0FBQUVDQkFJSUNQUUFUVlFDQVFJRUNCQVE2TllBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtCYkF3UUlFQ0JBSUlDQVFBL1FSQ1VRSUVDQUFBR0JiZzBRSUVDQUFJRUFBZ0k5UUJPVlFJQUFBUUlFQkxvMVFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG8xZ0FCQWdRSUVBZ2dJTkFETkZFSkJBZ1FJRUJBb0ZzREJBZ1FJRUFnZ0lCQUQ5QkVKUkFnUUlBQUFZRnVEUkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWpWQWdBQUJBZ1FDQ0FqMEFFMVVBZ0VDQkFnUUVPaldBQUVDQkFnUUNDQWcwQU0wVVFrRUNCQWdRS0FQQVFFQ3hSZFlYbDVPWStNMzAzamphMlptTmkwdUxxWjZ2WjdMeFB2Nys5UGorL2VsRXlkT3BBTUg5dWN5cGtFSUVPaStRRzFxYWp5ZnZ4VzZQM2RISkJCZVlHVmxKVjIrY2pWZHYvNjd0TEt5MnRGNmE3VmFldTRMbjA5UFBqbmEwZU1ZbkFDQnpnaDRodDRaVjZNU2FGdGdldnE5ZFBiY0cybGhZYUh0c1pvWklIdkcvK2IvWGtqRHd3ZFRYNSsvR3BveHN3MkJJZ2w0RGIxSTNUQVhBbjhRbUpxYVNyOTY1ZFd1aGZsOStPelUvcDI3ZCsvLzZQOEVDSlJJUUtDWHFGbW1XZzJCTE14ZmUvMThXbDN0N0NuMnpUVG5adWMzZThqOUJBZ1VXTUI1dFFJM3g5U3FKOUJzbUE4TURLU2hvYUcyZ0phWGx0TGQ2ZWwxWTlTVHQ5V3NRM0VIZ1JJSUNQUVNOTWtVcXlIUWJKaG5HcU9IUnRLWk02ZmJncG1ZbUVpdnZuYXVyVEhzVElCQWNRU2NjaTlPTDh5a3dnSTdDZk1LTXltZEFJRXRCQVQ2RmpnZUl0QU5BV0hlRFdYSElCQmZRS0RINzdFS0N5eXdYWmdQUERaUTRObWJHZ0VDUlJJUTZFWHFocmxVU21DN01OL2YrTzF0enovL2JLVk1GRXVBUU9zQ0FyMTFPM3NTYUZtZ21UQi84WVV2cGV6WHNyb1JJRUNnR1FHQjNveVNiUWprS0NETWM4UTBGQUVDRHdRRStnTUszeERvdklBdzc3eXhJeENvcW9CQXIycm4xZDExQVdIZWRYSUhKRkFwQVlGZXFYWXJ0bGNDd3J4WDhvNUxvRG9DQXIwNnZWWnBqd1NFZVkvZ0haWkF4UVQ4NnRlS05WeTUzUlVvYzVobm44WCtmKytPcGZjYUgrTTZPenVYRnQ5ZnpBV3ZsbXBwejU0OWFXUmtPQjA1Y2ppWE1RMUNnRUJLQXQwcUlOQWhnYktHK2NMQ1l2ck54YmZTalJ2dnBKV1Z6bnppMit6Y1hMclYrRjN5NHpkdnBoZSsvTVZVcTlVNjFBWERFcWlPZ0VDdlRxOVYya1dCc29aNVJuVDE2cld1U1UxT1RxWExsNittNDhjLzI3VmpPaENCcUFKZVE0L2FXWFgxVEtETVlkNEx0SGZIeG5weFdNY2tFRTVBb0lkcnFZSjZLVERkZUwzNXRkZlBwOVhWalU5Vlo3L08xVytBZTdoRDJldnpiZ1FJdEMvZ2xIdjdoa1lnc0NhUXZZbnM3TGszTmczejdJTlcvdWh6WjlMUzB2TGFWek5zOHdzTHpXeldsVzBHQmdiU3JsM3R2ZGE5dVBqK09wOTZ2ZDZWK1RzSWdlZ0NBajE2aDlYWE5ZSExWNjZtaFMwQ2VHRnhJZjNpbDY5MGJUNTVIeWc3c3pBNHVLZXRZVjk5N1Z5YWFMd1p6bzBBZ2Z3Rm5ITFAzOVNJRlJSWVhsNU8xNi8vcm11VjcrN2IzZmF4SmlkdnR6M0d6Z2Z3Ykh6blp2WWcwSnlBUUcvT3lWWUV0aFFZRzd2WnNVdThOanJ3dm4xN043cTc2ZnN1L2ZaeXV0TEZkN04vT0xIMlR0bC9PSTd2Q0JENHVJQkEvN2lJbndtMElKQmRUOTJ0MjlEUVlCbzlkS2psdzJWaGZ1blM1VTMzNyt2elN0eW1PQjRnVUdBQmdWN2c1cGhhZVFSbVptYTdNdGtzeko5Lzd0bkdtOU5hKzZPN1haZ2ZPZkowK3RTblB0bVZXaHlFQUlGOEJmeFRQRjlQbzFWVVlIRngvYTlGemQ0VlBucG9KQmVSN0RYejdEUjc5c3k4azJIK3VUT24wNFVMRjNPWnMwRUlFT2l1Z0VEdnJyZWpCUlhZNk5Lcm9hR2hkS1lSa0VXNE5mUE1QQXR6TndJRXlpdlEybm03OHRacjVnUXFKeURNSzlkeUJWZFVRS0JYdFBIS3JvYUFNSzlHbjFWSklCTnd5dDA2SU5CRGdiTm56emMrY2V4VzdqTVlIUjFwdk9hK2I4dDNzMmR2Z0hPYVBYZDZBeExvbVlCQTd4bTlBeE5JSFFuenpIVjgvTmJhMTJiR3dud3pHZmNUS0srQVUrN2w3WjJaRTJoSlFKaTN4R1luQW9VWEVPaUZiNUVKUmhabzlSSzBWazJFZWF0eTlpTlFmQUduM0l2Zkl6TU1MSEQ2MU1sMGEySXlsd3JuNXVmVC9Oem1IMFVxekhOaE5naUJ3Z29JOU1LMnhzU3FJSEQwNk5NcCsycjNscjJiZmF0UE1SUG03UXJibjBEeEJaeHlMMzZQekpEQWxnSlhybHp6YnZZdGhUeElvQm9DQXIwYWZWWmxVSUdKaWFsMDhhMjNONjNPTS9OTmFUeEFJSnlBVSs3aFdxcWdNZ204OHV2WDA5VFVWTWVtbkgxR2V6Yy9wNzFqaFJpWUFJRnRCVHhEMzViSUJnUTZKOURKTU05NzF2bThJNytlOTdTTVI0REFId1FFdXFWQWdNQzJBdGxucEE4TVBMYnRkdHR2VU50K0Uxc1FJTkNTZ0VCdmljMU9CUElSeU9kWmJ6NXoyV3FVdzRjL3ZkWERPM2pNTS9RZFlObVV3STRFdklhK0l5NGJFOGhYNE1UeFkybnE5cDBkRDdxMHRKU21wNmQzdkY4ck93d2ZQSmhPblR6ZXlxNGI3T01aK2dZbzdpS1FpNEJBejRYUklBUmFFemgyN0RQcFdBdTczbmpuOStuTk45Y0grdVA3OTZmK1J4NXBZY1QxdSt4cG5HTC94Q2VlU0U4OTllVDZCOTFEZ0VEaEJBUjY0VnBpUWdTMkYxaGRYZDF3bzVNbmo2WGg0ZUVOSDNNbkFRS3hCYnlHSHJ1L3FpTkFnQUNCaWdoNGhsNlJSaXV6bUFLZHZnNjltRldiRlFFQ25SQVE2SjFRTlNhQkpnVjZjUjM2MmJQbk8vSTU3S09qSSttTHp6L1haT1UySTBBZ2J3R24zUE1XTlI2QmdndU0zN3pWa1JtT2ozZG0zSTVNMXFBRUFnb0k5SUJOVlZKNUJNcHlIWHA1Uk0yVVFIVUZuSEt2YnU5VlhnQ0JWcTlEWDFoWVNMT3pzeTFWa1AwajR0NjlleTN0dTlWTy9uR3lsWTdIQ0hSZVFLQjMzdGdSQ0d3cTBPcDE2TmNhSDdweTRjTEZUY2ZkNm9IVHAwNm1XeE9UVzIzUzBtTWp3d2RiMnM5T0JBamtJeURRODNFMENvSFNDQnc5K25US3Z0d0lFSWdsNERYMFdQMVVEUUVDQkFoVVZFQ2dWN1R4eWlaQWdBQ0JXQUpPdWNmcXAyb0tKSEQ3OXUzMHMvLzZlVWRtdEx5ODB2SzRya052bWM2T0JBb3RJTkFMM1I2VEs0dEFyVlpMOWZyREh3MmEvYjcxdWJuNXdwWGdPdlRDdGNTRUNPUWlJTkJ6WVRSSTFRV0dob2JTek14TTFSa0tWLy9NMGtSNmQrYXR0SHB2cWVtNVBicDdNSDF5M3pQcHNiNTlUZTlqUXdKRkVCRG9SZWlDT1pSZTRLa25SOVBiSlFuMEtseUhYcSt2cHBmZituNzZ6MnMvYm1sdDllMTZKUDMxeVg5TWYzSDA3MXJhMzA0RWVpRWcwSHVoN3BqaEJMTHJ5YWNhcjVsUFRrNFZ2cllxWElmK0gxZi90ZVV3enhxNDBuaEcvL0xGSDZZbkJnNm5MNHgrcy9BOU5VRUNtWUJBdHc0STVDQ1F2WWIrNGd0ZlN0ZXYzMGkzYmsyaytmbjVWRy84MTZsYjlxYTRwYVhtVHlOL2RCNVZ1QTc5VisvODIwZExidm43YkJ5QjNqS2ZIYnNzSU5DN0RPNXdzUVdPSERtY3NxOU8zOXI1VFhHZG5sc1J4cCtZdjU3TE5DWnpHaWVYeVJpRXdEWUNya1BmQnNqREJBakVGOWhkNjB2ZmVlNUg2WHRmKzJYak5QdW5IeFJjcitmL08rOGZETzRiQWprTGVJYWVNNmpoQ0JSZHdIWG9EM2ZvZ3pCL0tmM3hvYjlhZStDN0wvNTcrdUhQL3p3dHJ5NCt2S0dmQ0JSY3dEUDBnamZJOUFqa0xlQTY5QTlGUHg3bUh6N2lPd0xsRXhEbzVldVpHUk1nc0FPQjdCVDZQM3psSittcmgvLzJvYjAyQ3ZQYkMrK2tmL24xdHowN2YwaktEMlVSY01xOUxKMHlUd0k1Q1ZUaE92VDdWSVA5QjlKM1gzeDU3WFh4eng1NElmWHQ2azgvdS81UzJqek12NVd5VUhjalVFWUJnVjdHcnBremdUWUVxbkFkK24yZXZZOGVUUHNmRzczL1kvcWJaLzRwMVdxNzAvRW52dkxnTmZQc3dRK2VtUXZ6QjFDK0thV0FRQzlsMjB5YVFPc0NWYmdPL2I3TytPeHYwMHZudjlONEIzdjJyTHgvN2U1dm4vN0IvWWZYL2kvTUgrTHdRNGtGdklaZTR1YVpPZ0VDMnd1OGVmT25hNkcrV2w5ZXQ3RXdYMGZpamhJTENQUVNOOC9VQ1JCb1RtQ2pVQmZtemRuWnFqd0NBcjA4dlRKVEFnVGFFUGhvcUF2ek5pRHRXbGdCcjZFWHRqVW1SbURuQW0rL2ZUbGR2WFpqNXp0MmFZL3A2ZWt1SFduancyU2gvcy8vL2ZVMDgvNWttbHUrcy9GRzdpVlFVZ0dCWHRMR21YYTFCV3FwdGlIQTNSNEg1b2FUNnNHZGV4ODVtR2FXSmpjOGN2Wkd1V1p2ZXg4ZGJuWlQyeEhvdVlCVDdqMXZnUWtRMkxuQTROQ2VuZTlVMEQyR0JnZHpuOW1aa2Evbk11WXp3L21Nazh0a0RFSmdHd0dCdmcyUWh3a1VVZURBNDQrbi92NFBMc01xNHZ4Mk1xZmhrWU03MmJ5cGJiOTErdnZwcWIybm10cDJzNDFPSGZ4cStzdlAvUDFtRDd1ZlFPRUVhbE5UNDUzNzBPYkNsV3RDQk9JSWpJMk5wL052L0UrcTE4djdSM2hvYUREOTJaLytTZXJyMjUxN1kxYnZMYVZ6WXo5SnYzL3ZOMm0xM3Z4bnh6KzZlekFkM3Y5c2VuYjBHNDA1YmZ6U1J1NlROU0NCSEFRRWVnNkloaURRSzRFN2Q2YlRwVXVYMHQzcDk5THk4dnJyckhzMXIrMk9tNTFtejU2Wm56eHhvaU5odnQzeFBVNGdvb0JBajloVk5SRWdRSUJBNVFTOGhsNjVsaXVZQUFFQ0JDSUtDUFNJWFZVVEFRSUVDRlJPUUtCWHJ1VUtKa0NBQUlHSUFnSTlZbGZWUklBQUFRS1ZFeERvbFd1NWdna1FJRUFnb29CQWo5aFZOUkVnUUlCQTVRUUVldVZhcm1BQ0JBZ1FpQ2dnMENOMlZVMEVDQkFnVURrQmdWNjVsaXVZQUFFQ0JDSUsvRDhwdVVqK1A3S2ZHQUFBQUFCSlJVNUVya0pnZ2c9PVwiLFxuICAgIH07XG5cbiAgICB0aGlzLnNldEJhY2tncm91bmRQbGFjZWhvbGRlcigpO1xuICAgIHRoaXMuZXZlbnRIYW5kbGVyKCk7XG4gIH1cblxuICBzZXRCYWNrZ3JvdW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgdGhpcy5pbWFnZVByZXZpZXdDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cbiAgICAgIFwidXJsKCdcIiArIHRoaXMuYmFja2dyb3VuZEltYWdlLmJhc2VJbWFnZSArIFwiJylcIjtcbiAgfVxuXG4gIGV2ZW50SGFuZGxlcigpIHtcbiAgICB0aGlzLmlucHV0VHlwZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLnVwbG9hZEZpbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5lcmFzZUltYWdlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImNsaWNrXCIsXG4gICAgICB0aGlzLnJlbW92ZUltYWdlc0FuZFJlc2V0QmFja2dyb3VuZFBsYWNlaG9sZGVyLmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgcmVtb3ZlSW1hZ2VzQW5kUmVzZXRCYWNrZ3JvdW5kUGxhY2Vob2xkZXIoKSB7XG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcbiAgICB0aGlzLmlucHV0VHlwZUZpbGUudmFsdWUgPSBcIlwiO1xuXG4gICAgdGhpcy5zZXRJbnB1dE5hbWVGaWxlVmFsdWUoKTtcbiAgICB0aGlzLnNldElucHV0RmlsZUxhYmVsVGV4dCgpO1xuICAgIHRoaXMuc2V0QmFja2dyb3VuZFByZXZpZXdDb250YWluZXIoKTtcbiAgfVxuXG4gIHVwbG9hZEZpbGUoZXZlbnQpIHtcbiAgICBsZXQgaW5wdXRmaWVsZEVsZW1lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGxldCB1cGxvYWRlZEZpbGVzID0gaW5wdXRmaWVsZEVsZW1lbnQuZmlsZXM7XG4gICAgbGV0IHRvdGFsVXBsb2FkZWRGaWxlcyA9IHVwbG9hZGVkRmlsZXMubGVuZ2h0O1xuXG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcblxuICAgIG5ldyBQcm9taXNlKFxuICAgICAgZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHVwbG9hZGVkRmlsZXMpLmZvckVhY2goXG4gICAgICAgICAgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheVtrZXldID0gdXBsb2FkZWRGaWxlO1xuXG4gICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKHVwbG9hZGVkRmlsZSk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV1bXCJkYXRhVXJsXCJdID0gcmVhZGVyLnJlc3VsdDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoIC0gMSA9PT0gcGFyc2VJbnQoa2V5KSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jYWNoZWRGaWxlQXJyYXkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApLnRoZW4oXG4gICAgICBmdW5jdGlvbihmaWxlc0FycmF5QXNEYXRhVXJsKSB7XG4gICAgICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgICAgIHRoaXMuc2V0SW5wdXRGaWxlTGFiZWxUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZFByZXZpZXdDb250YWluZXIoKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBzZXRJbnB1dE5hbWVGaWxlVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCB2YWx1ZSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5jYWNoZWRGaWxlQXJyYXkpLmZvckVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIC8vIGxldCBuZXdBcnJheSA9IFsnZmlsZW5hbWUnLCBkYXRhXVxuICAgICAgICAgIHZhbHVlLnB1c2goe1xuICAgICAgICAgICAgZGF0YVVybDogdGhpcy5jYWNoZWRGaWxlQXJyYXlba2V5XS5kYXRhVXJsLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5jYWNoZWRGaWxlQXJyYXlba2V5XS5uYW1lLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgICB0aGlzLmlucHV0TmFtZUZpbGUudmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5wdXROYW1lRmlsZS52YWx1ZSA9IFwiXCI7XG4gICAgfVxuICB9XG5cbiAgc2V0SW5wdXRGaWxlTGFiZWxUZXh0KCkge1xuICAgIHN3aXRjaCAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHRoaXMuaW5wdXRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5pbnB1dExhYmVsLmlubmVySFRNTCA9IHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5pbnB1dExhYmVsLmlubmVySFRNTCA9XG4gICAgICAgICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoICsgXCIgZmlsZXMgc2VsZWN0ZWRcIjtcbiAgICB9XG4gIH1cblxuICBzZXRCYWNrZ3JvdW5kUHJldmlld0NvbnRhaW5lcigpIHtcbiAgICBsZXQgYmFja2dyb3VuZFVybDtcblxuICAgIHN3aXRjaCAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGJhY2tncm91bmRVcmwgPSB0aGlzLmJhY2tncm91bmRJbWFnZS5iYXNlSW1hZ2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0udHlwZS5tYXRjaChcImltYWdlL1wiKSkge1xuICAgICAgICAgIGJhY2tncm91bmRVcmwgPSB0aGlzLmNhY2hlZEZpbGVBcnJheVswXVtcImRhdGFVcmxcIl07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0udHlwZS5tYXRjaChcImFwcGxpY2F0aW9uL3BkZlwiKSkge1xuICAgICAgICAgIGJhY2tncm91bmRVcmwgPSB0aGlzLmJhY2tncm91bmRJbWFnZS5zdWNjZXNzUGRmO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLnR5cGUubWF0Y2goXCJ2aWRlby9cIikpIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kVXJsID0gdGhpcy5iYWNrZ3JvdW5kSW1hZ2Uuc3VjY2Vzc1ZpZGVvO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYmFja2dyb3VuZFVybCA9IHRoaXMuYmFja2dyb3VuZEltYWdlLnN1Y2Nlc3NNdWx0aXBsZTtcbiAgICB9XG5cbiAgICB0aGlzLmltYWdlUHJldmlld0NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxuICAgICAgXCJ1cmwoJ1wiICsgYmFja2dyb3VuZFVybCArIFwiJylcIjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmaWxlVXBsb2FkU2hvd1ByZXZpZXV3O1xuIiwiKGZ1bmN0aW9uKCkge1xyXG4gIG1ldGhvZHMubW9kdWxlcy5tb3VudEFsbChcImJvZHlcIik7XHJcbiAgbWV0aG9kcy5tb2R1bGVzLmluaXRBbGwoXCJib2R5XCIpO1xyXG59KSgpO1xyXG4iXX0=
