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
