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
                    console.warn(
                        "Network request for posts.json failed with response " +
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
            if (contactItems.length === 0) {}
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
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "avatar",
                    }, ],
                    className: "contact-name container",
                    nodeName: "div",
                };
                let currentAvatarContainer = modules[
                    "general"
                ].htmlElement.createElement(avatarContainer);

                currentAvatarContainer.style.backgroundImage =
                    "url('" + currentContact.file[0].dataUrl + "')";

                // Contact Name container and childs
                const dataNameContainer = {
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "name",
                    }, ],
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
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "phonenumber",
                    }, ],
                    className: "contact-phone container",
                };
                let currentPhoneContainer = modules[
                    "general"
                ].htmlElement.createElement(dataPhoneContainer);

                // Contact phone work label
                const dataPhoneLabel = {
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "label",
                    }, ],
                    className: "contact-phone unit",
                };
                let currentPhoneLabel = modules["general"].htmlElement.createElement(
                    dataPhoneLabel
                );

                let currentPhoneLabelElement = document.createElement("label");

                // Contact phone work value
                const dataPhoneValue = {
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "value",
                    }, ],
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
                    addAttributes: [{
                        attributeKey: "variant",
                        attributeValue: "delete",
                    }, ],
                    className: "contact-delete container",
                };
                let currentRemoveContainer = modules[
                    "general"
                ].htmlElement.createElement(dataRemoveContainer);

                const dataButton = {
                    addAttributes: [{
                        attributeKey: "type",
                        attributeValue: "submit",
                    }, ],
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
                    addAttributes: [{
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

modules["contacts"] = (function () {
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
    contactItemWrapper: ".contact-item.wrapper",
  };

  contactItems = {};

  methods.data = {
    getDefaultParamsForApi() {
      const defaultParams = {
        "_sort": "firstname,lastname",
        "_order": "asc,asc"
      }
      return defaultParams;
    },
    getApiUrl: function (searchParam = {}) {
      const apiUrl = 'http://localhost:3000/posts';
      const urlGetParams = modules["general"].getUrlParams();
      const defaultParams = methods.data.getDefaultParamsForApi();
      const urlParamsObject = Object.assign({}, defaultParams, urlGetParams, searchParam);
      let urlParam = '';
      Object.keys(urlParamsObject).forEach(function (key, index) {
        let surfix = "&";
        if (index === 0) {
          surfix = "?"
        }
        urlParam += surfix + key + "=" + urlParamsObject[key];
      });

      return apiUrl + urlParam;
    },

    getContactsFromApi: function (searchParam = {}) {
      fetch(
        methods.data.getApiUrl(searchParam)
      )
        .then(function (response) {
          if (response.ok && response.status === 200) {
            response.json()
              .then(function (json) {
                methods.data.setContacts(json);
                methods.data.showContacts();
              });
          } else {
            console.warn(
              "Network request for products.json failed with response " +
              response.status +
              ": " +
              response.statusText
            );
          }
        });
    },

    saveContact: function (event) {
      event.preventDefault();
      const form = event.currentTarget;
      const formElements = form.elements;
      const formAction = form.action;
      const dataElement = {
        element: form,
        attributeKey: "method",
      };
      const formMethod = modules["general"].htmlElement.getAttribute(
        dataElement
      );

      new Promise(function (resolve, reject) {
        const data = methods.data.serialize(formElements);
        resolve(data);
      })
        .then(function (data) {
          fetch(formAction, {
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
            method: formMethod,
          })
            .then(function (response) {
              return response;
            })
            .then(function (response) {
              if (
                response.ok === true &&
                ((formMethod === "post" && response.status === 201) ||
                  (formMethod === "PATCH" && response.status === 200))
              ) {
                return response.json();
              }
            })
            .then(function (data) {
              methods.data.getContactsFromApi();
              methods.page.showContact(data);
            })
            .catch(function (error) {
              console.warn(error);
            });
        });
    },

    deleteContact: function (event) {
      event.preventDefault();
      const deleteButton = event.currentTarget;
      const formAction = deleteButton.formAction;
      const form = deleteButton.form;
      const contactId = deleteButton.value;
      let contactItemWrapper = elements.contactsContainer.querySelector(
        selectors.contactItemWrapper
      );

      fetch(formAction, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "delete",
      })
        .then(function (response) {
          return response;
        })
        .then(function (response) {
          if (response.ok === true && response.status === 200) {
            methods.data.getContactsFromApi();
            contactItemWrapper.removeChild(form);
            methods.data.removeContactItemFromDomNode(contactId);
          }
        })
        .catch(function (error) {
          console.warn(error);
        });
    },

    serialize: function (formElements) {
      let postData = Array.prototype.slice
        .call(formElements)
        .reduce(function (data, item, currentIndex, array) {
          if (item && item.name) {
            if (item.type === "checkbox") {
              data[item.name] = item.checked;
            } else if (item.name === "file") {
              if (item.value) {
                data[item.name] = JSON.parse(item.value);
              } else {
                data[item.name] = [{
                  dataUrl: "",
                  name: "",
                },];
              }
            } else if (item.type === "file") {
              // do nothing
            } else {
              data[item.name] = item.value;
            }
          }

          return data;
        }, {});

      return postData;
    },

    setContacts: function (data) {
      contactItems = data;
    },

    getContacts: function () {
      if (contactItems.length === 0) {
        methods.data.getContactsFromApi();
      }
      return contactItems;
    },

    getContactById: function (contactId) {
      if (contactItems.length === 0) {
        methods.data.getContactsFromApi();
      }
      let contactItem;
      Object.keys(contactItems)
        .some(function (key) {
          if (contactItems[key].id == contactId) {
            return (contactItem = contactItems[key]);
          }
        });

      return contactItem;
    },
    showContacts: function () {
      const contacts = methods.data.getContacts();
      const contactItems = elements.contactItemsUnit.querySelectorAll(
        "[id*='contact-item-']"
      );

      if (!elements.contactItemsUnit) {
        return false;
      }
      let prevContactId;
      methods.setElements();

      Object.keys(contactItems).forEach(function (key) {
        let cId = contactItems[key].querySelector('button').value;
        if (contacts.some(x => x.id == cId) === false) {
          elements.contactItemsUnit.removeChild(contactItems[key]);
        }
      });
      contacts.forEach(function (contact, index) {
        let prevElement;
        let oldElement = elements.contactItemsUnit.querySelector(
          "#contact-item-" + contact.id
        );

        if (oldElement) {
          elements.contactItemsUnit.removeChild(oldElement);
        }

        if (!elements.contactItemsUnit.querySelector(
          "#contact-item-" + contact.id
        )) {
          if (prevContactId) {
            prevElement = elements.contactItemsUnit.querySelector(
              "#contact-item-" + prevContactId
            );
          }
          if (prevElement && prevElement.nextSibling) {
            prevElement.parentNode.insertBefore(
              methods.pageContainer.contactListItem(contact),
              prevElement.nextSibling
            );
          } else if (
            index === 0 && elements.contactListItemsUnit.childNodes[0] !==
            undefined
          ) {
            elements.contactListItemsUnit.childNodes[0].parentNode.insertBefore(
              methods.pageContainer.contactListItem(contact),
              elements.contactListItemsUnit.childNodes[0]
            );

          } else {
            elements.contactItemsUnit.appendChild(
              methods.pageContainer.contactListItem(contact)
            );
          }
        } else {
          let newChild = methods.pageContainer.contactListItem(contact);
          let oldChild = elements.contactItemsUnit.querySelector(
            "#contact-item-" + contact.id
          );
          elements.contactItemsUnit.replaceChild(newChild, oldChild);
        }

        prevContactId = contact.id;
      });
      methods.elementWidth.fixedContainer();
    },
    showContact: function (event) {
      const currentContact = methods.data.getContactById(
        event.currentTarget.value
      );

      methods.page.showContact(currentContact);
    },
    removeContactItemFromDomNode: function (contactId) {
      elements.contactItemsUnit
        .querySelector("#contact-item-" + contactId)
        .remove();
    },
  };

  methods.page = {
    addContact: function () {
      const content = methods.pageContainer.contactViewAndForm();
      methods.page.contactsContainer(content);
    },
    showContact: function (currentContact) {
      const content = methods.pageContainer.contactViewAndForm(
        currentContact,
        "read"
      );
      methods.page.contactsContainer(content);
    },
    contactsContainer: function (content) {
      const oldWrapper = elements.contactsContainer.querySelector(
        selectors.contactItemWrapper
      );
      new Promise(function (resolve, reject) {
        let removedNode = elements.contactsContainer.removeChild(oldWrapper);
        let addedNode = elements.contactsContainer.appendChild(content);
        resolve(removedNode);
      })
        .then(function (data) {
          modules["file-upload"].mount();
          modules["file-upload"].init();
          modules["file-upload"].render();
          methods.elementWidth.fixedContainer();
        });
    },
  };

  methods.pageContainer = {
    contactListItem: function (currentContact) {
      let customAvatar =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MTIiIGhlaWdodD0iNjEyIiB2aWV3Qm94PSIwIDAgNjEyIDYxMiI+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2YzEyMy4yMDEtNzUuNDMyIDIxNy40OTIgNi4yODcgMjE3LjQ5MiA2LjI4N2wtMi4yNCAyNS43MDljLTYzLjY3Ni0xMy44MzctOTcuODgzIDMxLjg3My05Ny44ODMgMzEuODczLTM2Ljc1Mi01OC44MDYtMTE3LjM2OS02My44NjktMTE3LjM2OS02My44Njl6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2czExMC4xMDQtNTYuNjcxIDE5My40MjcgNi4zOTdjODMuMzI0IDYzLjA3MSAwIDAgMCAwbC0xNC4xMjggMjAuMjQ2cy02Ny4zNS03MC41My0xNzkuMjk5LTI2LjY0M3oiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjI0LjIwMyAzMzkuMTNzLTEuMTA5LTQ3LjkxOCAyOS45MTYtNzguOTQzbDM5LjA4OCAxNy42MzkgMTcuNzE4IDExLjI5Ni0zNi44MTQgMjAuNTY4cy0yNi43MTIgMy4zNDYtNDkuOTA4IDI5LjQ0eiIvPjxwYXRoIGZpbGw9IiNCNzMyMzEiIGQ9Ik0xMDYuODM0IDI3NS4yNnMxMDIuODUyLTU0LjI0NyAxOTIuMTE4IDYuMjkzbDYuMjMzLTE0LjMxOWMuMDAxLjAwMS05Ni42MzYtNTkuNzA5LTE5OC4zNTEgOC4wMjZ6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQ5MS45OCAxNTEuNTI0Yy0xMDYuNjU3IDE3LjIwMS0xMjAuMzY1IDEwOS41MDUtMTIwLjM2NSAxMDkuNTA1bDE4Ljc2OCAyNC45ODljMzQuMDA3LTI5LjE4OSA2NC44MTgtMjMuODg2IDY0LjgxOC0yMy44ODYtMTEuOTI5LTU4LjY4NiAzNi43NzktMTEwLjYwOCAzNi43NzktMTEwLjYwOHoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMjcxLjU3IDY4Ljk1OGMxNS4wNTggOS4xIDMwLjk5NyAxNy4yMSA0Ny42NzggMjIuOTktLjgwMi0xMi45NjkuMzUxLTI2LjE0OCAxLjAyNC0zOC43MjIgMS41NzItMjkuMjc3LTcuNTgxLTQ0Ljc0Mi0xNy44NC00Mi40NjUtMTAuMjYyIDIuMjc3LS44OTMgMTIuNjQ5LTMzLjUyOCAyNi4yODktMTAuMjE4IDQuMjY3LTE4LjM2OSA2LjgzNS0yNi4yMTMgMTIuNTY0IDguMTYxIDguMDg2IDE5LjgxIDEzLjg1MyAyOC44NzkgMTkuMzQ0eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00NTUuMjAxIDI2Mi4xMzJzLTIwLjcxNi0zNC44NTYtNjYuMTA2LTM0Ljg1NmwtNS42NjMgMjYuMTU0IDEuNDg0IDE2Ljg0MSAxOS45NDEgNi43NTdjMC0uMDAxIDE2LjA0Ni0xNC44OTYgNTAuMzQ0LTE0Ljg5NnoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNNDkxLjk4IDE1MS41MjRzLTEwOC4zNDYgMzEuNjU0LTEwOC4zNDYgMTI1LjUwM2wtNy4xNDYtMzYuMzM0Yy4wMDEtLjAwMSAxNy43OTEtNzUuODM0IDExNS40OTItODkuMTY5eiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNDQuNzM2IDUxMC43MTdsMTEuNDAzLTMwLjczM2MtMTIuNzI4IDQuOTI4LTMwLjk2NSAxMC4zOTQtNDYuOTU0IDE0Ljg3IDEwLjMgNi4xMTEgMjIuMDYgMTEuNTM3IDM1LjU1MSAxNS44NjN6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTI3OC44MTYgNDE4Ljg1MmMtNTIuNDE1IDUuOTQ4LTkxLjkxNi05LjMwMS0xMTcuMDUyLTM0LjQ4Ny00LjA4NS00LjA5MS03LjY4MS00LjQ3LTEwLjM1Ni0yLjExMS0xMi41NzQgMTIuNTc0IDI3LjExOSA4NC40NjcgMTAwLjU2MiA4NC40NjcgMy40OTYgMCA2LjQ3Mi4wODggOC45OTcuMjUxbDExLjI3Ny0zMC40MTcgNi41NzItMTcuNzAzeiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNjAuOTY2IDQ2Ni45NzFsLTQuODI3IDEzLjAxM2MxNi40MzQtNi4zNjYgMjMuNjQ4LTExLjgxNyA0LjgyNy0xMy4wMTN6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTE1MS40MDggMzgyLjI1M2MtMTEuODUxIDEwLjQ2My01LjQ1NCA3NS4wNjkgNTcuNzc3IDExMi42MDEgMTUuOTg5LTQuNDc3IDM0LjIyNy05Ljk0MiA0Ni45NTQtMTQuODdsNC44MjctMTMuMDEzYy0yLjUyNS0uMTYzLTUuNS0uMjUxLTguOTk3LS4yNTEtNzMuNDQzIDAtMTEzLjEzNi03MS44OTMtMTAwLjU2MS04NC40Njd6TTQwNy4yNzMgNTE2LjY0NmMuMTU2LjA1MS4zMDEuMDg4LjQ1NC4xMzUtLjE1My0uMDUtLjI5Ny0uMDg0LS40NTQtLjEzNXoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMzY2LjUzNyA0ODUuNTQ3Yy0xMS45OTQgMjEuNTIzIDM2LjgwNSAxNy43OSA1NS42NDQtMTMuODUgMTguOTMxLTM2LjMwNy0xNi4yNjctNjIuNTI1LTE2LjI2Ny02Mi41MjVsLTM3LjIyOCA2OS40MDFjLjgwMi40NzQuMzM4IDIuNTEzLTIuMTQ5IDYuOTc0ek00MDcuNzI4IDUxNi43ODFjLS4xNTMtLjA0Ny0uMjk4LS4wODQtLjQ1NC0uMTM1LTMyLjYyNi05Ljg4Ni0zNy42OTcgOC44ODEtMTUuMzY5IDI3LjA2NSAxNC45NjggMTIuMTg3IDYuOTcxIDIwLjYwMSA2Ljk3MSAyMC42MDEgMTMuNzA1LS45ODcgMTYuMzU0LTEyLjA5MiAxNi4zNTQtMTIuMDkyIDEzLjE0NS0uOTQ2IDcuOTYtMTUuODc2IDcuOTYtMTUuODc2czEyLjI4LTE0LjU0OC04LjYzMy0xOC4wNDRjLS4yMS0uMDMxLS4zODktLjA3NS0uNTg5LS4xMTItMS44OC0uMjM4LTMuODU5LS42NzEtNS45NjItMS4zMjlhNi41MDMgNi41MDMgMCAwIDEtLjI3OC0uMDc4eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0zOTEuOTA0IDU0My43MTJjLTIyLjMyOC0xOC4xODUtMTcuMjU3LTM2Ljk1MSAxNS4zNjktMjcuMDY1LTE0LjM2My00LjI0MS0xNi42NzUtMTEuNzI1LTE2LjY3NS0xMS43MjUgMTYuMzQzLTExLjY1IDI2LjE2OS0yMi44NSAzMS41ODItMzMuMjI1LTE4LjgzOSAzMS42NC02Ny42MzggMzUuMzczLTU1LjY0NCAxMy44NSAyLjQ4Ny00LjQ2MSAyLjk1MS02LjUgMi4xNDktNi45NzRsLTIwLjE2NSAzNy42MDRjLTcuMDE0IDE2LjcyOSAyNC40NCAxNS4zNDQgNDUuNDQ3IDM1LjYwNSA3Ljc4OCA3LjUwNSA0LjkwNiAxMi41MyA0LjkwNiAxMi41M3M3Ljk5OS04LjQxNC02Ljk2OS0yMC42eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MDguMDA2IDUxNi44NTljMi4xMDMuNjU4IDQuMDgyIDEuMDkxIDUuOTYyIDEuMzI5YTYwLjk3IDYwLjk3IDAgMCAxLTUuOTYyLTEuMzI5eiIvPjxwYXRoIG9wYWNpdHk9Ii4zMyIgZmlsbD0iIzczMjcyOCIgZD0iTTQwOC4wMDYgNTE2Ljg1OWMyLjEwMy42NTggNC4wODIgMS4wOTEgNS45NjIgMS4zMjlhNjAuOTcgNjAuOTcgMCAwIDEtNS45NjItMS4zMjl6Ii8+PGcgZmlsbD0iIzczMjcyOCI+PHBhdGggZD0iTTQyMi4xODEgNDcxLjY5N2MtNS41NjkgOS4zNTEtMTMuNzU4IDE2LjI0Ni0yMi4yMTkgMjAuNzkxLTc4LjIyNCAzNS4xMDEgMTguMjAzLTMyMy43ODkgMTAuMDQzLTc5LjcxMSAwIDAgLjU4Ni4yODgtNy42MjgtNi44MjMtOC4yMjctNy4xMTctMjAuMjg2IDUyLjAzNS0yMC4yODYgNTIuMDM1cy05Ljg1OCAyOC45MTQtMTMuMzU3IDM5LjYxOGMtNC4xNDctMi4wMTgtNS41NDgtNi4wNTMtMi4xOTYtMTIuMDYxIDIuNDg3LTQuNDYxIDIuOTUxLTYuNSAyLjE0OS02Ljk3NGwtMjAuMTY1IDM3LjYwNGMtNy4wMTQgMTYuNzI5IDI0LjQ0IDE1LjM0NCA0NS40NDcgMzUuNjA1IDcuNzg4IDcuNTA1IDQuOTA2IDEyLjUzIDQuOTA2IDEyLjUzczcuOTk3LTguNDE0LTYuOTcxLTIwLjYwMWMtMjIuMzI4LTE4LjE4NS0xNy4yNTctMzYuOTUxIDE1LjM2OS0yNy4wNjUtMTQuMzYzLTQuMjQxLTE2LjY3NS0xMS43MjUtMTYuNjc1LTExLjcyNSAxNi4zNDMtMTEuNjQ5IDI2LjE3LTIyLjg0OCAzMS41ODMtMzMuMjIzek00MDkuODYzIDUzOC4wMjFzNy44NzYgNC4zODMgNS4zNjYgMTQuMmM0LjMwOC0uMjc2IDUuOTQyLTIuMDggNS45NDItMi4wOC0xLjY3MS0xMC42NzMtMTEuMzA4LTEyLjEyLTExLjMwOC0xMi4xMnpNNDE2LjczMyA1MjguNDI2czQuNzA4IDEuNDM1IDYuNDU2IDcuOTE5YzIuMDMtMS41OTggMi40NjMtNC4wMjIgMi40NjMtNC4wMjItMy4yOTMtMy42Ni04LjkxOS0zLjg5Ny04LjkxOS0zLjg5N3oiLz48L2c+PHBhdGggZmlsbD0iI0I3MzIzMSIgZD0iTTQzNi42MTkgMzA4LjE0OWMtMTAuMzg4LTEzLjkzNC0yNS44MDctMjQuNzE2LTMwLjQwNS0xOC43NTgtNC44ODMgNi4zNDQuMjc5IDMwLjYwMiAxMC40OTQgNTIuMjU3IDIyLjIzNSA0Ny4xNzQgOS41MDUgNjMuMjM3IDkuNTA1IDYzLjIzNyAxMy40NjctLjY2NCAxNi44NS0xMi40MTQgMTYuODUtMTIuNDE0IDE0LjY4OC0uNzI0IDExLjQxMi0xNi43MTkgMTEuNDEyLTE2LjcxOXMxNS43MDctOS45My0xMS4xNzQtNTcuMjIzYTExOC42NTQgMTE4LjY1NCAwIDAgMC02LjY4Mi0xMC4zOHoiLz48cGF0aCBmaWxsPSIjQjdCN0I4IiBkPSJNMzcxLjQyNCAyODQuNjI0YzIuNDk3LTMuMjIgOS43ODktMTEuMDk5IDE0LjEwMy0xNS43MDctMTIuODQ3LTYuNzkyLTIyLjIyMi05LjY1NS0yMi4yMjItOS42NTVsLjA1NiAzMC44ODFzMi44NDIgMi44MDEgNy4yNzEgNy41MDljLTEuMDcxLTUuOTQtMS41MzUtMTAuMDM0Ljc5Mi0xMy4wMjh6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQxOC4wODQgMzQxLjU3N2MtOS43ODMtMjAuNzM4LTE1LjQwOS00MS4yMTItMTEuMTYyLTQ4LjA1NCA0LjM1NC03LjAxMSAxOC44MzcuMDY1IDI5LjY5NyAxNC42MjYtMTUuMzU5LTIxLjQ1NS0zNS44NC0zNS4zMjMtNTEuMzAyLTQzLjQ4Ny00LjMxMSA0LjYwNS0xMS42MDYgMTIuNDg3LTE0LjEwNCAxNS43MDEtMi4zMyAyLjk5OC0xLjg2NyA3LjA5NS0uNzkyIDEzLjAyOCAxNC4xMjQgMTQuOTk5IDQ0LjU0OCA0OS41MjkgNTEuODI1IDc1Ljk0OSA2LjQzOCAyMy4zMzggMy45NjYgMzUuNTQ1IDMuOTY2IDM1LjU0NXMxNC4xMS0xNi4xMzUtOC4xMjgtNjMuMzA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zMzUuNzAzIDE0OC43NjRjLTEuODYtMjcuMTI1IDcuMTM2LTUzLjk3OCAxNC4xOTMtNzkuMjczQzM2MC41MzIgMzEuMzc3IDM1MyA4LjMyNyAzMzguODIgOC4zMjdjLTE0LjE4MiAwLTQuODc0IDE2LjM5OS01MS44NTcgMjQuODE5LTI5LjEyNCA1LjIxOS00NS42NTEgMy45OTEtNzguNDQ5IDQyLjEwOC0zMi43OTggMzguMTE0LTU4LjUwNyA3My4xMjctNTguNTA3IDExNS4yMzJzMjkuMjUyIDg1LjA5OSA0OC4zMDcgODUuMDk5YzEwLjE2OCAwIDE0LjAzNC04LjA3NiAyMS4zNDUtMTkuMDQzIDE0Ljk5OS0yMy43MjYgNDcuMTM2LTMzLjQ3NSA1My4xMTktNDcuODc4IDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTE0LTguMjE5IDguMjQ2LTE5LjU4NyAxNy4yNzQtMjMuMTA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zNDguNTY4IDE5MC4wNDVjLTguMjA0LTEzLjcxNy0xMS45MjItMjcuNTMyLTEyLjg2NS00MS4yODEtOS4wMjggMy41MjEtMTMuMTYgMTQuODg5LTE3LjI3MiAyMy4xMDktOS4yNzkgMTQuODQ1LTEyLjA5MiAzMC45ODEtMTcuNDU4IDQ1LjcwNyA3LjQ0NSAzLjIwOCA4Ljc1MiAyMC4xNzEgNC4xNjMgNDYuMDQtNy4zMTQgNDEuMjE4LTQyLjU1MyA4MS4xMDUtNDIuNTUzIDgxLjEwNXMtMjcuNTAxIDc1LjY0LTIyLjI4NSAxMjguMzM5bDIyLjI4NS00MS40MjlzNTEuODU5LTYuODEyIDY3LjgxMy04NS4wODdjMTQuNDQ0LTcwLjg2MSA1MC4xNDEtNzkuMjA0IDcyLjA1OS00Ni42MDMtMTMuNDg1LTUwLjAwNS0zNy4yNzctODIuMTItNTMuODg3LTEwOS45eiIvPjxwYXRoIGZpbGw9IiNFRTZBNkEiIGQ9Ik00MTIuODM3IDM4My4yODdjMC0zMi42MzUtNC4wNjMtNTkuOTQxLTEwLjM4Mi04My4zNDItMjEuMTk4LTMyLjgzMy02My42OTEtMjQuMjU4LTc4LjEzNiA0Ni42MDMtMTUuOTU0IDc4LjI3NC02MS43MzYgODUuMDg3LTYxLjczNiA4NS4wODdsLTIyLjI4NSA0MS40MjljLjg2MSA4LjY4MSAyLjYyNSAxNi43MTkgNS41MjYgMjMuNzE3IDQuNjM2IDEuMDggOS43NDkgMi41MjQgMTUuNDM3IDQuNDA3IDc3Ljk2NyAyNS43ODcgMTUxLjU3Ni0zMi44MDEgMTUxLjU3Ni0xMTcuOTAxeiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MTEuMDA3IDQxMS4xNDJjMS4xOTQtOC44MjEgMS44My0xOC4xMDYgMS44My0yNy44NTQgMCAzLjc4NC0uMjAxIDcuNDkzLS40NzkgMTEuMTcxLjYxNy0xMi43MzEuNDEzLTI2LjAxMy0uNjE3LTM5LjcyMiA0Ljk5MyAxNTIuNTg4LTEyNi41NSAxNDEuMDU3LTEyNi41NSAxNDEuMDU3bC05Ljg0MiA5LjE0NWExMjQuNTk4IDEyNC41OTggMCAwIDEtMTQuMDg3LTMuNzVjLTUuNjg4LTEuODgzLTEwLjgwMS0zLjMyNy0xNS40MzctNC40MDcgNS4xNzIgMTIuNDcxIDE0LjAwOSAyMS41NzcgMjguMDYyIDI0Ljc5MWExMTEuNDEyIDExMS40MTIgMCAwIDAgMjQuNzg4IDIuODEzbC4wMzQuMDI0Yy4xNzIgMCAuMzI5LS4wMTMuNTAxLS4wMTMuOTgzLS4wMDMgMS45NjctLjA0NCAyLjk0OC0uMDc4IDY4LjQzNi0xLjUyNiAxMDEuMzUzLTQ4LjAxMyAxMDguODQ5LTExMy4xNzd6Ii8+PHBhdGggZmlsbD0iIzUyNTI1MiIgZD0iTTIxNi42MjIgMTkwLjk2OWM2LjczNS0xLjI3OCAxNC44MDUtOS40MzYgMTEuODYzLTE4LjcyNy0yLjk0MS05LjI5Mi0xNC45NTItMS40MTYtMTYuNDQzIDcuNzA5LTEuNDIyIDguNjk3IDIuMDkyIDExLjQ5NyA0LjU4IDExLjAxOHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjIxLjUxMiAxNzkuNDM4YzEuNDc5LjUxMSAzLjE1MS0uNzc3IDMuNzE4LTIuODc5LjU3LTIuMTAyLS4xNjktNC4yMTMtMS42NDgtNC43MjEtMS40OTEtLjUwNy0zLjE1NC43ODYtMy43MyAyLjg4NS0uNTY0IDIuMDkzLjE3MSA0LjIxMSAxLjY2IDQuNzE1eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0yOTkuODE2IDI3Ny4wMjdzLTUuNjUxLTEyLjI5OCAxMS45NjctMjMuMDk5YzE3LjYxNy0xMC44MDUgMTkuMTExIDQuMzE5IDE5LjExMSA0LjMxOSIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00OTEuOTggMTUxLjUyNHMtNjAuMDg1IDIwLjQ3OC05MS41NTUgODIuOTA2bC01LjE5NC03LjE1NXMyMi45ODQtNTMuMjE5IDk2Ljc0OS03NS43NTF6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTIzNS4zMzkgNTUwLjI4MWMtLjgzIDI0LjkzMyAzMy4yNjggNDQuNzQyIDE1LjUwMyA1My4yODUgMTYuNjIyIDIuMjE1IDIxLjk0LTcuNTM3IDIxLjk0LTcuNTM3IDIyLjYwMiAzLjMyNyAyMS40OTMtMTYuMTc3IDIxLjQ5My0xNi4xNzcgMTAuNjA0LTcuMDExIDkuNjgzLTE2LjMzMy4wMjItMjUuNTcxLTIxLjkzNC0xOC4xNDMtNTguMTI4LTI4Ljg0MS01OC45NTgtNHpNMzAwLjA3NyA0NjMuMDczYy4zMjktMjIuMTg4LTEyLjIyNy0zOS44OTYtMTIuMjI3LTM5Ljg5NnMxNy4yODYtMTEzLjQ2MS00NC43NjUtNjQuMjY1Yy02Mi4wNTMgNDkuMTk3LTUyLjkwOSAxMTUuNjItMzkuMjIzIDEzNy4zOTUgMjMuMTU0IDMzLjU3NSA4NC41MTEgMTguMjg4IDk2LjIxNS0zMy4yMzR6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTI4NS4xOSA0OTkuODVjMTAuOTg2LTEyLjIxNyAxNC43MTQtMjUuMTE2IDE0Ljg4Ni0zNi43NzYtMTEuNzA0IDUxLjUyMS03Mi4xNTYgNjQuMDUyLTk2LjIxNCAzMy42MjUgMTYuNTA5IDI2LjI2MSAzOC45OTggMjAuODgyIDI4LjgwNyAzOS43MTgtMTAuMTk3IDE4Ljg0LjY2NyAzNy4wMTIgMTQuODQ4IDQ4LjUzM3MzLjMyNCAxOC42MTcgMy4zMjQgMTguNjE3YzI3Ljk3NC05LjA4NS05LjUyOS0yNS44MDMtOS41MjktNTAuNzQ4IDAtMTkuNSAyOS45MS0xNC4yMDkgNTIuOTg0IDEuNDYzLTIuODYtMi43MzEtNi40NDMtNS40NTctMTAuNzctOC4xMTMtMTguOTQ0LTExLjYzNS0yOC45MTktMTIuMjk5IDEuNjY0LTQ2LjMxOXoiLz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMjcyLjc4MiA1OTYuMDI5YzguMDg4LTEwLjE5IDEuMjE2LTE4LjA2IDEuMjE2LTE4LjA2czEwLjExMiA0LjEwMSA3Ljk5MSAxOC4wNmMwIDAtNCAyLjEwOS05LjIwNyAwTTI5NC4yNzUgNTc5Ljg1M2MwLTExLjI5OS03Ljc1Ni0xNC4wNzEtNy43NTYtMTQuMDcxczguNTM3LjMwNCAxMi4xODkgMTAuMjljMC0uMDAxLTEuODI3IDIuNzI4LTQuNDMzIDMuNzgxIi8+PGc+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMzOC44MiA4LjMyOGMtMTQuMTgyIDAtNC44NzQgMTYuMzk5LTUxLjg1NyAyNC44MTktMi4zMzMuNDE3LTQuNTc3Ljc5LTYuNzYzIDEuMTUgMjUuNjQ0LTMuOTYzIDIyLjY4IDMuOTA2IDQuMzIzIDEyLjgxNS0yMy4wMDIgMTEuMTU4LTM2LjYyMyAxLjA4MS02OC45NDUgNDYuNzQ1LTMyLjMyNSA0NS42NjMtNDMuMTIgOTIuNDk5LTIzLjkwOCAxMjkuODc2IDIwLjA0NSAzOC45OTEgMzMuNjkgMTkuMTI4IDUzLjAyMiA4Ljc0bC0uMDA2LjAwNmMxMi41MjctOC43NjIgMjQuNjQ3LTE1LjUxOSAyOC4wOTMtMjMuODEzIDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTEyLTguMjIgOC4yNDQtMTkuNTg4IDE3LjI3Mi0yMy4xMDktMS44Ni0yNy4xMjUgNy4xMzYtNTMuOTc4IDE0LjE5My03OS4yNzMgMTAuNjM3LTM4LjExNSAzLjEwNi02MS4xNjQtMTEuMDc1LTYxLjE2NHoiLz48L2c+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTI1MS43IDIzNC4xMTdjMTguOTQ2LTEzLjQ2MSAyMS4wNzktMjUuNDUyIDIxLjA3OS0yNS40NTItNS45ODMgMTQuNDAzLTM4LjEyIDI0LjE1Mi01My4xMTkgNDcuODc4IDMuODk0IDIuODYgOC4yMDQgMy45MjUgMTIuODA5IDMuNTk2IDIuNDg4LTguMzEzIDguNDAyLTE4LjMyNSAxOS4yMzEtMjYuMDIyeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0yNTAuOTQ4IDIzMy4zNjhjMTguOTQ2LTEzLjQ2IDIxLjgzMS0yNC43MDMgMjEuODMxLTI0LjcwMy0zLjA2MyA3LjM3MS0xMi45NzIgMTMuNTI2LTIzLjkzMyAyMC45NTdhMTEuNDY3IDExLjQ2NyAwIDAgMCAxLjg5NSAzLjkxNmMuMDc2LS4wNTcuMTM1LS4xMTYuMjA3LS4xN3oiLz48Zz48cGF0aCBmaWxsPSIjNUExRDFBIiBkPSJNMjE1LjkyOSAyMDIuNDU5YzYuNjc2LTEuNTYgMTQuMzk3LTEwLjA0NiAxMS4wNjctMTkuMjA2LTMuMzMzLTkuMTYtMTUuMDAxLS43ODktMTYuMTA3IDguMzk2LTEuMDU5IDguNzQ2IDIuNTc1IDExLjM5NiA1LjA0IDEwLjgxeiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMjAuMzI4IDE5MC43MzdjMS41LjQ1MSAzLjExNy0uOTA5IDMuNTkzLTMuMDM2LjQ4Ni0yLjExOC0uMzQ0LTQuMjAxLTEuODQyLTQuNjQyLTEuNTEtLjQ0NS0zLjEyLjkxMS0zLjYwNSAzLjAzNS0uNDc3IDIuMTE1LjM0NyA0LjIwNSAxLjg1NCA0LjY0M3oiLz48L2c+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMwOC40MTggMjY0Ljk4OXMtNDguNjQyIDI5LjQzNC02Mi4wMDIgMTEzLjM2NWMtNS44MiAzNi41MzEgMTAuMjcyIDQwLjc3NiAxMC4yNzIgNDAuNzc2czEyLjgxOCAxOC4yMzEgMzAuNDIgMTIuODVjMCAwIDkuNTU4IDEwLjQ0NCAzMC4zNzQuMTI2IDAgMC0yMy43MjktMTAuOTg5LTMwLjM4My00OC42NDMtNi42Ni0zNy42NTcgMTAuMjE5LTc4LjU3OCAyMi4xNTQtOTIuNjY4IDEzLjM2Mi0xNS43NzkgMTIuMzgyLTM0LjY2NS0uODM1LTI1LjgwNnoiLz48Zz48cGF0aCBmaWxsPSIjQTVBNUE1IiBkPSJNMzAxLjkwOSA0MjguOTQxbC0uNzM2LS41MjZjLjQ3My4zNjMuNzM2LjUyNi43MzYuNTI2eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0yOTAuMzgxIDM4Mi4wMTJjLTUuNTM5LTMxLjM0MSAyLjk2Ni02My45MDcgMTIuODU2LTgyLjA4OS00MS4zMTUgNzIuNzI5LTEwLjM4MSAxMjIuMDQ1LTEuMzI4IDEyOS4wMTkgMCAwLTE0LjgzNiA0Ljk4Ni0yMi4zNjctMTAuMDgxIDAgMCAuNTIgNS43MTQgMy42NTYgOS41MjYgMCAwLTIyLjYwNCAyLjM0My0yOC4wOTMtMTkuMjE1IDAgMC0yLjkwMSAxMC45MzYgOC4yNTQgMTguNjYgMTEuNTI4IDcuOTc2IDIzLjQ5NCA1LjIwNiAyMy40OTQgNS4yMDZzMTUuNTI1IDExLjc2NyAzMi41NzMtLjk1OGMuMDAxIDAtMjIuMzg4LTEyLjQxMS0yOS4wNDUtNTAuMDY4eiIvPjwvZz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMzkzLjE4MyAyNzAuOTM0czcuOTEtMTAuNzQ4LTUuODE3LTE0LjIwOWMwIDAtOC40NTEtMjAuODg1LTE3LjgwNS0zNC44NjMtLjAyMi0uMDI4LS4wNDgtLjA2LS4wNjktLjA5MS05Ljg5My0xNi4yOTUtMjEuMTMzLTMzLjA5OS0yNy4xODUtNDkuNTEzLTkuMzE2LTI5LjE1OCA0LjgzNy0zMC41OTMgNy42OTMtMzguMDAxIDQuNDc3LTExLjU4NC0xMi40Mi02LjkzOC04LjAyOC0zMS43OTIgMS45NzEtOC4wNDcgNC4zMzItMTYuMDk1IDYuODE5LTI0LjExMSA5LjMzNS0zMC4wODIgMTMuOTYyLTcwLjAyNS05Ljk3MS03MC4wMjUgMCAwIDE3LjE3NiAyLjM0NiA2LjIwNSAzNi4wNzgtMTAuOTcgMzMuNzI5LTUzLjE4NSA1Ni45OTctNDEuNTQ3IDEwMC44NzUgMTAuMTU5IDM4LjMyNCAyLjIxMSA1OC44MzYtMjEuNTUyIDgxLjM5MSAwIDAgMjkuMzY1LTI4LjIwNiAyNS41MDIgMTkuNzY3IDYuODU3LTcuODUgNy41NDYtMjAuMzY4IDcuMTU1LTMyLjMxLjA0LTE4LjcwOCA4LjA1Ny0zOS45NzEgMzMuNDg2LTExLjQ3OC42MjEuNzA1IDEuMjQ0IDEuNDA3IDEuODU4IDIuMTI3LjEwMy4xMjIuMjEuMjU0LjMxNi4zNzkgMjguMTg3IDMzLjI5MyA0Ny4wNjkgNzguNDYyIDUyLjIxIDk0Ljc4OS0uNjcyLTMuMjEzLTYuMDc1LTIxLjU1MS05LjI3LTI5LjAxM3pNMjgwLjM5MiA0OTcuMzIyYzI3LjM0MS0yNC44MjkgMTIuMDUxLTYzLjQ5NyAxMi4wNTEtNjMuNDk3aDYuMDcxczIwLjMwMiAzMy4xNDYgMS41NjMgNzYuODkyIi8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQwMy4wNzggMjQ4Ljc5M2MtMjQuMjU4LTguNTQyLTEyLjIzMi0zOC40ODYtMTIuMjMyLTM4LjQ4Ni0xMC45ODUgMTQuMTYyLTE1LjQxNSAzMS4wNS0xNS40MTUgMzEuMDVsMTAuMDk2IDE0Ljc0OHMxMi4wODYgOC4xNTQgMTIuODEgNy40MjdjLjcyMy0uNzI3IDI5LTYuMTkzIDQuNzQxLTE0LjczOXoiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjU0LjEwOSAyNjAuMTk2czIyLjYwNyA2LjExNSAzOS4wOTQgMTcuNjNsLTI2LjQxNyAyLjk1MXMtOS45MjQtNy40NzUtMTAuMzI1LTcuODc1Yy0uNC0uNDAyLTIuMzUyLTEyLjcwNi0yLjM1Mi0xMi43MDZ6TTQ1NS4yMDEgMjYyLjEzMnMtMTAuNTEzLTQ2LjEzNy01NS4yMjQtNDMuMzYxYzAgMCAyNy4xNjUtNDkuODYxIDkyLjAwMy02Ny4yNDcgMCAwLTQ2LjAwMSA1MS4wNDUtMzYuNzc5IDExMC42MDh6Ii8+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTM4OC40OCAyNTAuMDM3cy4yMjYtMjAuNzY2IDE5LjY2LTQzLjIwOGwxNS40MjUtMi43OTQgNS4yMTMgMi43OTRzLTMwLjU0OSAxNi45ODUtNDAuMjk4IDQzLjIwOHoiLz48L3N2Zz4=";

      let contactListItem =
        `
        <section id="contact-item-${currentContact.id}" class="contact-list-item wrapper">
          <button type="button" value="${currentContact.id}" class="contact-list-item container">
            <figure class="contact-list-item unit" variant="contact-item-avatar">
              <img class="image" src="${currentContact.file[0].dataUrl
          ? currentContact.file[0].dataUrl
          : customAvatar}  " />
            </figure>
            <div class="contact-list-item unit" variant="contact-item-name" data-title="${currentContact.firstname + " " + currentContact.lastname}">
              <span>${currentContact.firstname + " " + currentContact.lastname}</span>
            </div>
            ${currentContact.favorites
          ? `
            <div class="contact-list-item unit" variant="contact-item-favorite">
              <i class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376 376"><style>.a{fill:#C39215;}</style><path d="M188 17l63 103 117 28 -78 92 10 120 -111-46 -111 46 10-120 -78-92 117-28L188 17z" fill="#FFE63C"/><path d="M224 194l-36-161 63 87 117 28 -78 92 10 120 -111-46L224 194z" fill="#FDD72E"/><path d="M299 367c-1 0-2 0-3-1l-108-45 -108 45c-2 1-6 1-8-1 -2-2-4-4-3-7l9-117 -76-89c-2-2-2-5-2-8 1-3 3-5 6-5l114-27 61-100c2-2 4-4 7-4l0 0c3 0 5 2 7 4l61 100 114 27c3 1 5 3 6 5 1 3 0 6-2 8l-76 89 9 117c0 3-1 6-3 7C302 367 300 367 299 367zM188 305c1 0 2 0 3 1l99 41 -8-107c0-2 0-4 2-6l70-82 -104-24c-2 0-4-2-5-4l-56-92 -56 91c-1 2-3 3-5 4l-104 25 70 82c1 2 2 4 2 6l-8 107 99-41C186 305 186 305 188 305zM125 120L125 120 125 120z" fill="#C39314"/><path d="M89 196c-2 0-4-1-6-3l-8-10c-3-3-2-8 1-11s8-2 11 1l8 10c3 3 2 8-1 11C92 196 91 196 89 196z" class="a"/><path d="M118 285c0 0 0 0-1 0 -4 0-8-4-7-9l2-25c1-14-4-27-12-38l-2-3c-3-3-2-8 1-11 3-3 8-2 11 1l2 3c12 14 18 32 16 50l-2 25C126 282 122 285 118 285z" class="a"/></svg>
              </i>
            </div>`
          : ""}
          </button>
        </section>`;

      let container = document.createElement("div");
      container.innerHTML = contactListItem;
      const content = container.querySelector(".contact-list-item.wrapper");

      methods.eventListener.contactListButton(
        content.getElementsByClassName("contact-list-item container"),
        methods.data.showContact,
        "add",
        "click"
      );

      return content;
    },
    contactViewAndForm: function (
      currentContact = {
        file: [
          {
            dataUrl: "",
            name: "",
          },
        ],
        firstname: "",
        lastname: "",
        favorites: false,
        phoneWork: "",
        phonePrivate: "",
        emailWork: "",
        emailPrivate: "",
        address: "",
        note: "",
        id: "",
      },
      type = "add"
    ) {
      let contactItemWrapper =
        `
<article class="contact-item wrapper" variant="contact-item" state="active">
  <form class="contact-form" action="http://localhost:3000/posts${currentContact.id
          ? "/" + currentContact.id
          : ""}" method="${currentContact.id
            ? "PATCH"
            : "post"}" name="form" novalidate>
    <section class="contact-button container" variant="contact-button button-back">
      <ul class="contact-button unit">
        <li>
          <button class="button-back" type="button">
            <i class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
<path d="M20.394,37.469l11.9-11.9L31.721,25l-11.9,11.9a0.807,0.807,0,1,0,1.141,1.141l11.9-11.9-0.57-.57Z" fill="#676767"/>
<path d="M20.394,12.531l11.9,11.9,0.57-.57-11.9-11.9A0.807,0.807,0,1,0,19.823,13.1L31.721,25l0.571-.571Z" fill="#676767"/>
<rect x="31.888" y="24.597" width="0.807" height="0.807" transform="translate(-8.22 30.156) rotate(-45)" fill="#676767"/>
<rect x="32.459" y="25.167" width="0.807" height="0.807" transform="translate(-8.456 30.73) rotate(-45.005)" fill="#676767"/>
<rect x="33.029" y="24.597" width="0.807" height="0.807" transform="translate(-7.886 30.959) rotate(-44.995)" fill="#676767"/>
<rect x="32.459" y="24.026" width="0.807" height="0.807" transform="translate(-7.649 30.392) rotate(-45)" fill="#676767"/>
</svg>
            </i>
            <span>back</span>
          </button>
        </li>
      </ul>
    </section>        
    <fieldset ${type == "read" ? "disabled" : ""}>
      <input type="text" name="id" id="id" value="${currentContact.id}" hidden />
      <section class="contact-item container" variant="contact-item-header">
        <div class="contact-item unit" variant="file-upload">
          <figure class="contact-avatar container" variant="contact-item-avatar">
            <input type="file" name="avatar" id="avatar" accept="image/*" state="hidden" />
            <input type="text" class="input-file-data" name="file" value='[{"dataUrl":"${currentContact
          .file[0].dataUrl}","name":"${currentContact.file[0].name}"}]'
id="file" hidden />
            <label for="avatar">
              <div class="contact-avatar unit">
                      <img class="image avatar-image" src="${currentContact
          .file[0].dataUrl
          ? currentContact.file[0].dataUrl
          : `/resources/images/icons/avatar.svg`}" alt="avatar picture" />
              </div>
              <figcaption class="caption">select a file</figcaption>
            </label>
            <div class="delete-file container" variant="delete-file">
              <button type="button" class="delete-file unit">
                <i class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" xml: space="preserve"><path d="M298.912 60.231c-8.114 0-14.692-6.577-14.692-14.692V29.383H172.564V45.54c0 8.114-6.577 14.692-14.692 14.692s-14.692-6.577-14.692-14.692V14.692C143.181 6.577 149.758 0 157.872 0h141.04c8.114 0 14.692 6.577 14.692 14.692V45.54C313.604 53.654 307.025 60.231 298.912 60.231zM366.494 512c-61.568 0-111.657-50.088-111.657-111.657s50.088-111.657 111.657-111.657S478.15 338.775 478.15 400.343 428.062 512 366.494 512zM366.494 318.07c-45.365 0-82.273 36.908-82.273 82.273s36.908 82.273 82.273 82.273c45.365 0 82.273-36.908 82.273-82.273S411.859 318.07 366.494 318.07zM297.687 483.344H104.963c-7.575 0-13.907-5.758-14.626-13.299L60.951 161.527c-0.392-4.12 0.971-8.214 3.755-11.277 2.786-3.062 6.732-4.807 10.87-4.807h305.628c8.114 0 14.692 6.577 14.692 14.692 0 8.114-6.577 14.692-14.692 14.692H91.735l26.588 279.134h179.363c8.114 0 14.692 6.577 14.692 14.692S305.801 483.344 297.687 483.344zM158.382 424.577c-7.487 0-13.884-5.694-14.608-13.299l-14.498-152.201c-0.768-8.077 5.155-15.248 13.233-16.018 8.091-0.767 15.25 5.155 16.018 13.233l14.498 152.201c0.768 8.077-5.155 15.248-13.233 16.018C159.318 424.557 158.848 424.577 158.382 424.577zM306.99 338.486c-0.483 0-0.971-0.025-1.462-0.072 -8.075-0.798-13.973-7.991-13.175-16.065l6.533-66.108c0.798-8.076 7.995-13.964 16.065-13.175 8.075 0.798 13.973 7.991 13.175 16.065l-6.533 66.108C320.844 332.82 314.453 338.486 306.99 338.486zM367.562 318.096c-0.05 0-0.1 0-0.15 0 -0.292-0.003-0.582-0.012-0.873-0.022l-0.154-0.004c-8.113 0-14.636-6.577-14.636-14.692 0-2.478 0.619-4.813 1.71-6.861l3.83-40.223c0.77-8.077 7.935-13.997 16.018-13.233 8.077 0.77 14.001 7.941 13.233 16.018l-4.355 45.72C381.466 312.345 375.127 318.096 367.562 318.096zM328.867 452.662c-3.76 0-7.521-1.434-10.388-4.303 -5.737-5.737-5.737-15.04 0-20.778l75.254-75.254c5.737-5.737 15.04-5.737 20.778 0 5.737 5.737 5.737 15.04 0 20.778l-75.254 75.254C336.388 451.228 332.627 452.662 328.867 452.662zM404.121 452.662c-3.76 0-7.521-1.434-10.389-4.303l-75.254-75.254c-5.737-5.737-5.737-15.04 0-20.778 5.737-5.737 15.04-5.737 20.778 0l75.254 75.254c5.737 5.737 5.737 15.04 0 20.778C411.641 451.228 407.88 452.662 404.121 452.662z" fill="#B3404A" /><rect x="48.541" y="101.368" width="359.696" height="79.893" fill="#F4B2B0" /><path d="M408.242 195.95h-359.7c-8.114 0-14.692-6.577-14.692-14.692v-79.89c0-8.114 6.577-14.692 14.692-14.692h359.7c8.114 0 14.692 6.577 14.692 14.692v79.889C422.933 189.371 416.356 195.95 408.242 195.95zM63.233 166.567H393.55V116.06H63.233V166.567zM228.392 424.577c-8.114 0-14.692-6.577-14.692-14.692V256.001c0-8.114 6.577-14.692 14.692-14.692s14.692 6.577 14.692 14.692v153.885C243.084 418 236.505 424.577 228.392 424.577z" fill="#B3404A" /></svg>
                </i>
              </button>
            </div>
          </figure>
        </div>
        <div class="contact-item unit" variant="contact-item-name">
          <div class="input container" variant="contact-inputfield name-inputfield" state="hidden">
            <input class="input" id="firstname" name="firstname" type="text" value="${currentContact.firstname}" placeholder="firstname" />
            <input class="input" id="lastname" name="lastname" type="text" value="${currentContact.lastname}" placeholder="lastname" />
          </div>
          <div class="input container" variant="contact-inputfield name-label" state="active">
            <label for="firstname">${currentContact.firstname}</label> <label for="lastname">${currentContact.lastname}</label>
          </div>
        </div>
        <div class="contact-item unit" variant="contact-item-favorite">
          <div class="input container" variant="contact-checkbox">
            <input type="checkbox" class="fav-checkbox" name="favorites" id="favorites" ${currentContact.favorites
          ? `checked`
          : ``} />
            <label for="favorites">
              <i class="icon on">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376 376"><style>.a{fill: #C39215;}</style><path d="M188 17l63 103 117 28 -78 92 10 120 -111-46 -111 46 10-120 -78-92 117-28L188 17z" fill="#FFE63C" /><path d="M224 194l-36-161 63 87 117 28 -78 92 10 120 -111-46L224 194z" fill="#FDD72E" /><path d="M299 367c-1 0-2 0-3-1l-108-45 -108 45c-2 1-6 1-8-1 -2-2-4-4-3-7l9-117 -76-89c-2-2-2-5-2-8 1-3 3-5 6-5l114-27 61-100c2-2 4-4 7-4l0 0c3 0 5 2 7 4l61 100 114 27c3 1 5 3 6 5 1 3 0 6-2 8l-76 89 9 117c0 3-1 6-3 7C302 367 300 367 299 367zM188 305c1 0 2 0 3 1l99 41 -8-107c0-2 0-4 2-6l70-82 -104-24c-2 0-4-2-5-4l-56-92 -56 91c-1 2-3 3-5 4l-104 25 70 82c1 2 2 4 2 6l-8 107 99-41C186 305 186 305 188 305zM125 120L125 120 125 120z" fill="#C39314" /><path d="M89 196c-2 0-4-1-6-3l-8-10c-3-3-2-8 1-11s8-2 11 1l8 10c3 3 2 8-1 11C92 196 91 196 89 196z" class="a" /><path d="M118 285c0 0 0 0-1 0 -4 0-8-4-7-9l2-25c1-14-4-27-12-38l-2-3c-3-3-2-8 1-11 3-3 8-2 11 1l2 3c12 14 18 32 16 50l-2 25C126 282 122 285 118 285z" class="a" /></svg>
              </i>
              <i class="icon off">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <style>.a{fill: #999999;}</style>
                  <path d="M846,725H727v-117c0-18-13-32-30-32c-16,0-30,14-30,32v117H549c-18,0-33,13-33,29s15,29,33,29h119v117c0,18,13,32,30,32c16,0,30-14,30-32v-117h119c18,0,33-13,33-29S864,725,846,725z M977,361c-4-29-26-50-54-54l-251-36c-1-1-2-2-3-2l-111-221c-10-21-30-36-53-38C479,8,455,22,443,45L331,269c-1,1-2,2-3,2L80,307c-23,3-44,17-53,38c-10,24-5,52,14,70L223,589c1,1,1,3,1,4l-43,246c-3,18,2,37,14,51c19,22,52,29,79,15L471,803c14-7,20-25,13-39c-7-15-26-21-40-13L246,854c-2,1-4,0-6-1c-1-1-1-2-1-3l43-246c4-20-3-41-18-56L83,373c-1-1-2-2-1-4c1-3,3-3,4-3L336,329c21-3,39-16,48-34L496,71c0-1,1-2,4-2c3,0,4,2,4,2L616,295c9,19,27,31,48,34l251,36c1,0,3,0,4,3c1,3-1,4-1,4L756,527c-12,11-12,30-0,41c0,0,0,0,1,1c11,11,30,11,41,0l159-153C972,402,980,382,977,361z" class="a" />
                </svg>
              </i>
            </label>
          </div>
        </div>
      </section>

      <section class="contact-item container" variant="contact-item-body-container">
        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label">
            <label for="phoneWork">work</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <input class="input" id="phoneWork" name="phoneWork" type="phone" value="${currentContact.phoneWork}" placeholder="add work phonenumber" />
          </div>
        </div>

        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label">
            <label for="phonePrivate">home</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <input class="input" id="phonePrivate" name="phonePrivate" type="phone" value="${currentContact.phonePrivate}" placeholder="add private phonenumber " />
          </div>
        </div>
      </section>

      <section class="contact-item container" variant="contact-item-body-container">
        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label">
            <label for="emailWork">work</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <input class="input" id="emailWork" name="emailWork" type="email" value="${currentContact.emailWork}" placeholder="add work emailaddress " />
          </div>
        </div>

        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label">
            <label for="emailPrivate">home</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <input class="input" id="emailPrivate" name="emailPrivate" type="email" value="${currentContact.emailPrivate}" placeholder="add private emailaddress " />
          </div>
        </div>
      </section>

      <section class="contact-item container" variant="contact-item-body-container">
        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label textarea">
            <label for="address">home</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <textarea class="input textarea" id="address" name="address" wrap="hard" rows="4" placeholder="add address ">${currentContact.address}</textarea>
          </div>
        </div>
      </section>

      <section class="contact-item container is-last" variant="contact-item-body-container">
        <div class="contact-item unit" variant="contact-item-body">
          <div class="input container" variant="contact-label textarea">
            <label for="note">note</label>
          </div>
          <div class="input container" variant="contact-inputfield">
            <textarea class="input textarea" id="note" name="note" wrap="hard" rows="4" placeholder="place a note ">${currentContact.note}</textarea>
          </div>
        </div>
      </section>
    </fieldset >

    <section class="contact-button container" variant="contact-button">
      <ul class="contact-button unit" variant="contact-show">
        <li>
          <button class="button-edit" type="button">
            <i class="icon">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M8.98,44.5l-1.022-.034A2.479,2.479,0,0,1,6.351,42.98l-0.065-.152,0.009-.971L6.4,41.148c0.079-.514.159-1.027,0.23-1.542l0.3-2.188c0.221-1.636.442-3.271,0.682-4.9a2.475,2.475,0,0,1,.658-1.257C8.875,30.62,9.5,30,10.122,29.383l5.211-5.206q7.3-7.3,14.592-14.6A5.506,5.506,0,0,1,32.866,7.8l0.14-.012L34.119,7.8a5.7,5.7,0,0,1,2.992,1.873C38.4,11,39.74,12.339,41.087,13.648a5.7,5.7,0,0,1,1.9,3.016L43,16.817l-0.012,1.1a5.587,5.587,0,0,1-1.827,2.99C34.436,27.611,27.273,34.76,20.122,41.963a4.586,4.586,0,0,1-2.889,1.378c-1.993.238-4.018,0.518-5.977,0.79l-2.118.295ZM8.325,42.884h0.3a0.961,0.961,0,0,1,.193-0.046l2.212-.3c1.966-.273,4-0.554,6.006-0.794a2.991,2.991,0,0,0,1.936-.913C26.131,33.621,33.3,26.47,40.02,19.763A4.216,4.216,0,0,0,41.386,17.7V16.9a4.386,4.386,0,0,0-1.423-2.094c-1.358-1.32-2.707-2.669-4.009-4.01a4.219,4.219,0,0,0-2.07-1.4h-0.8a4.014,4.014,0,0,0-2.014,1.315q-7.288,7.312-14.594,14.607l-5.216,5.211c-0.612.607-1.225,1.215-1.819,1.839a0.894,0.894,0,0,0-.231.379C8.969,34.375,8.749,36,8.529,37.634l-0.3,2.192C8.159,40.35,8.079,40.872,8,41.394l-0.1.644v0.441A0.841,0.841,0,0,0,8.325,42.884Z" fill="#fff" /><rect x="30.779" y="12.77" width="1.613" height="12.908" transform="translate(-4.287 28.188) rotate(-45.356)" fill="#fff" /></svg>
            </i>
            <span>edit</span>
          </button>
        </li>
        <li class="flex-auto">
          <a href="mailto:${currentContact.emailWork}">
            <i class="icon">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M1.513,36.568V15.721a0.949,0.949,0,0,0,.021-0.114,4.642,4.642,0,0,1,.309-1.386,5.3,5.3,0,0,1,4.929-3.339q18.233,0.007,36.466,0a5.33,5.33,0,0,1,.77.051,5.147,5.147,0,0,1,2.758,1.286,4.928,4.928,0,0,1,1.721,3.8q0,10.149,0,20.3a4.887,4.887,0,0,1-1.372,3.406,5.189,5.189,0,0,1-3.89,1.675q-9.439,0-18.879,0-8.754,0-17.509,0A5.7,5.7,0,0,1,5.9,41.331a5.2,5.2,0,0,1-3.13-1.742,4.875,4.875,0,0,1-1.2-2.557C1.55,36.877,1.533,36.722,1.513,36.568ZM25,12.672q-9.072,0-18.144,0a3.435,3.435,0,0,0-1.519.308,3.253,3.253,0,0,0-2.028,3.115q0,10.1,0,20.2a3.076,3.076,0,0,0,.862,2.181A3.47,3.47,0,0,0,6.8,39.608h15.3q10.54,0,21.08,0a3.419,3.419,0,0,0,1.614-.361A3.239,3.239,0,0,0,46.695,36.2q0-10.11,0-20.219a3.065,3.065,0,0,0-.813-2.122,3.509,3.509,0,0,0-2.716-1.192H25Z" fill="#fff" /><path d="M25,30.553a0.759,0.759,0,0,1-.593-0.209q-3.455-2.681-6.919-5.351-6.418-4.959-12.834-9.921a1.03,1.03,0,0,1-.435-0.867,0.57,0.57,0,0,1,.084-0.295A1.108,1.108,0,0,1,5.2,13.4a0.6,0.6,0,0,1,.4.137Q7.358,14.9,9.115,16.266L24.522,28.217c0.126,0.1.257,0.191,0.377,0.3a0.133,0.133,0,0,0,.2,0q1.662-1.3,3.33-2.587L44.281,13.636a2.053,2.053,0,0,1,.2-0.155,0.676,0.676,0,0,1,.548-0.055,1.246,1.246,0,0,1,.608.392,0.65,0.65,0,0,1,.122.635,1.163,1.163,0,0,1-.414.625L25.652,30.3a0.846,0.846,0,0,0-.085.066A0.648,0.648,0,0,1,25,30.553Z" fill="#fff" /><path d="M8.773,35.081a0.974,0.974,0,0,1-.859-0.51,0.66,0.66,0,0,1-.028-0.621A1.214,1.214,0,0,1,8.3,33.392q2.811-2.105,5.62-4.214a0.584,0.584,0,0,0,.054-0.041,0.7,0.7,0,0,1,.867-0.1,1.7,1.7,0,0,1,.416.3,0.641,0.641,0,0,1,.137.691,1.166,1.166,0,0,1-.424.607L9.36,34.839a0.82,0.82,0,0,1-.392.225C8.9,35.071,8.838,35.076,8.773,35.081Z" fill="#fff" /><path d="M41.206,35.075a0.729,0.729,0,0,1-.52-0.2C39.861,34.245,39.029,33.626,38.2,33c-1.064-.8-2.132-1.592-3.191-2.4a1.033,1.033,0,0,1-.433-0.877,0.543,0.543,0,0,1,.137-0.358,1.137,1.137,0,0,1,.862-0.434,0.6,0.6,0,0,1,.372.128Q37.184,30,38.423,30.931c1.105,0.831,2.216,1.655,3.316,2.492a1,1,0,0,1,.425.935,0.494,0.494,0,0,1-.081.227A0.977,0.977,0,0,1,41.206,35.075Z" fill="#fff" /></svg>
            </i>
            <span>email</span>
          </a>
        </li>
        <li>
          <a href="tel:${currentContact.phoneWork}">
            <i class="icon">
              <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><title>icons</title><path d="M36.43,47.2a4.2,4.2,0,0,1-.736-0.065l-0.542-.091c-0.5-.083-1.025-0.168-1.543-0.306a47.2,47.2,0,0,1-16.423-8.2A42.95,42.95,0,0,1,6.233,26.261,44.811,44.811,0,0,1,2.27,17.453L2.229,17.33l0.012-1.639a11.642,11.642,0,0,1,1.464-3.935,26.147,26.147,0,0,1,5.51-6.415C9.36,5.214,9.492,5.1,9.629,4.988a2.467,2.467,0,0,1,3.436.186,72.6,72.6,0,0,1,6.989,8.275,2.21,2.21,0,0,1-.429,3.022,24.714,24.714,0,0,0-4.092,4.17,0.577,0.577,0,0,0-.057.856,39.065,39.065,0,0,0,13.1,12.388c0.535,0.3,1.11.589,1.709,0.873,0.467,0.222.514,0.168,0.737-.091,0.771-.9,1.506-1.869,2.217-2.808l0.083-.11c0.247-.326.47-0.677,0.705-1.048l0.258-.4a2.379,2.379,0,0,1,3.417-.8c0.548,0.33,1.082.683,1.616,1.036,0.26,0.172.52,0.344,0.781,0.513l1.363,0.882q2.428,1.571,4.865,3.13a3.094,3.094,0,0,1,1.388,1.51L47.771,36.7v1.133l-0.163.288a3.477,3.477,0,0,1-.192.322,26.449,26.449,0,0,1-7.444,7.4A6.554,6.554,0,0,1,36.43,47.2ZM3.843,17.071a43.137,43.137,0,0,0,3.778,8.368A41.345,41.345,0,0,0,18.166,37.259a45.6,45.6,0,0,0,15.862,7.923c0.44,0.117.9,0.193,1.385,0.272l0.565,0.1c1.075,0.189,1.933-.3,3.119-1.063a24.884,24.884,0,0,0,6.992-6.959c0.025-.037.048-0.076,0.069-0.115V37.02a1.93,1.93,0,0,0-.691-0.6q-2.445-1.556-4.875-3.136L39.229,32.4c-0.267-.172-0.531-0.347-0.8-0.522-0.515-.34-1.03-0.681-1.558-1a0.783,0.783,0,0,0-1.231.3l-0.249.39c-0.243.383-.494,0.778-0.781,1.157l-0.084.11c-0.725.958-1.476,1.949-2.278,2.885a2,2,0,0,1-2.654.5c-0.628-.3-1.233-0.607-1.8-0.919a40.63,40.63,0,0,1-13.648-12.88,2.15,2.15,0,0,1,.1-2.759,26.335,26.335,0,0,1,4.358-4.443,0.606,0.606,0,0,0,.139-0.814,71.065,71.065,0,0,0-6.835-8.093,0.859,0.859,0,0,0-1.274-.065c-0.121.1-.237,0.2-0.353,0.3A24.62,24.62,0,0,0,5.1,12.574,10.061,10.061,0,0,0,3.843,15.9v1.173Z" fill="#fff" /></svg>
            </i>
            <span>call</span>
          </a>
        </li>
      </ul>
      <ul class="contact-button unit" variant="contact-edit">
        <li>
          <button class="button-save" type="submit">
            <i class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <title>icon check / save</title>
                <path d="M22.541,39.967a0.807,0.807,0,0,1-.624-0.3L8.78,23.63a0.807,0.807,0,1,1,1.248-1.023L22.459,37.787l17.457-27.38a0.807,0.807,0,0,1,1.361.867L23.221,39.594a0.807,0.807,0,0,1-.633.371Z" fill="#fff" />
              </svg>
            </i>
            <span>save</span>
          </button>
        </li>
        <li class="flex-auto" variant="hide-contact-add show-contact-edit">
          <button type="button">
            <i class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 50 50"><title>icons</title><path d="M33.534 49.274H16.608A10.5 10.5 0 0 1 6.119 38.786V25.894A10.5 10.5 0 0 1 16.608 15.406h2.647a0.807 0.807 0 1 1 0 1.614H16.608a8.885 8.885 0 0 0-8.875 8.875V38.786a8.885 8.885 0 0 0 8.875 8.875H33.534a8.885 8.885 0 0 0 8.875-8.875V25.894a8.885 8.885 0 0 0-8.875-8.875h-4.2a0.807 0.807 0 0 1 0-1.614h4.2A10.5 10.5 0 0 1 44.022 25.894V38.786A10.5 10.5 0 0 1 33.534 49.274ZM25.1 31.7a0.807 0.807 0 0 1-0.807-0.807V1.532a0.807 0.807 0 1 1 1.614 0v29.36A0.807 0.807 0 0 1 25.1 31.7ZM33.213 10.482a0.8 0.8 0 0 1-0.57-0.236L25.071 2.673 17.5 10.246A0.807 0.807 0 1 1 16.358 9.1L24.5 0.962a0.83 0.83 0 0 1 1.141 0L33.784 9.1A0.807 0.807 0 0 1 33.213 10.482Z" fill="#fff" /></svg>
            </i>
            <span>export</span>
          </button>
        </li>
        <li variant="hide-contact-add show-contact-edit">
          <button class="button-delete" type="submit" formaction="http://localhost:3000/posts/${currentContact.id}"  value="${currentContact.id}">
            <i class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 50 50"><title>icons</title><line x1="37.509" y1="12.531" x2="12.572" y2="37.469" fill="#fff" /><path d="M12 38.039A0.807 0.807 0 0 1 12 36.9L36.939 11.961A0.807 0.807 0 0 1 38.08 13.1L13.142 38.039A0.807 0.807 0 0 1 12 38.039Z" fill="#fff" /><line x1="12.572" y1="12.531" x2="37.509" y2="37.469" fill="#fff" /><path d="M36.938 38.039L12 13.1a0.807 0.807 0 0 1 1.141-1.141L38.079 36.9A0.807 0.807 0 1 1 36.938 38.039Z" fill="#fff" /></svg>
            </i>
            <span>delete</span>
          </button>
        </li>
      </ul>
    </section>
  </form>
</article>`;

      let container = document.createElement("div");
      container.innerHTML = contactItemWrapper;
      const content = container.querySelector(".contact-item.wrapper");
      const backButton = content.querySelector("button.button-back");
      const editButton = content.querySelector("button.button-edit");
      const deleteButton = content.querySelector("button.button-delete");
      const formElm = content.querySelector("form.contact-form");
      editButton.addEventListener("click", methods.contactItem.edit);
      backButton.addEventListener("click", methods.contactItem.hide);
      deleteButton.addEventListener("click", methods.data.deleteContact);

      formElm.addEventListener("submit", methods.data.saveContact);

      return content;
    },
  };

  methods.eventListener = {
    contactListButton: function (
      elementNode,
      callFunction,
      listener = "add",
      type = "click"
    ) {
      if (elementNode && elementNode.length > 0) {
        Object.keys(elementNode)
          .forEach(function (key) {
            methods.eventListener[listener](elementNode[key], callFunction, type);
          });
      }
    },
    add: function (element, callFunction, type = "click") {
      element.addEventListener(type, callFunction);
    },
    remove: function (element, callFunction, type = "click") {
      element.removeEventListener(type, callFunction);
    },
  };

  methods.contactItem = {
    view: function (data) {
      let formFieldset = data.querySelector("fieldset");
      let dataElm = {
        element: formFieldset,
        attributeKey: "disabled",
        attributeValue: "disabled",
      };
      modules["general"].htmlElement.addAttributeValue(dataElm);
    },

    edit: function (event) {
      event.currentTarget.form
        .querySelector("fieldset")
        .removeAttribute("disabled");
    },
    hide: function () {
      const contactItemWrapper = elements.contactsContainer.querySelector(
        selectors.contactItemWrapper
      );
      const formElement = contactItemWrapper.querySelector(".contact-form");
      if (formElement) {
        contactItemWrapper.removeChild(formElement);
        contactItemWrapper.removeAttribute("state");
      }
    }
  };

  methods.setElements = function () {
    elements.contactListItemsContainer = elements.contactsContainer.querySelector(
      selectors.contactListItemsContainer
    );
    elements.contactItemContainer = elements.contactsContainer.querySelector(
      selectors.contactItemContainer
    );

    elements.contactItemsUnit = elements.contactListItemsContainer.getElementsByClassName(
      "contact-list-items unit"
    )[0];

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

    if (elements.contactItemContainer) {
      elements.contactItemUnit = elements.contactItemContainer.querySelector(
        selectors.contactItemUnit
      );
      elements.contactItemContainerButton = elements.contactItemContainer.querySelectorAll(
        selectors.contactButtonContainer
      );
    }
  };

  methods.elementWidth = {
    fixedContainer: function () {
      methods.setElements();
      methods.elementWidth.contactListItems();
      methods.elementWidth.buttonContainerListItems();
      methods.elementWidth.buttonContainerItem();
    },
    contactListItems: function () {
      elements.contactListItemsUnit.style.width =
        elements.contactListItemsContainer.clientWidth + "px";
    },
    buttonContainerListItems: function () {
      if (elements.contactListItemsUnit) {
        let contactListItemsUnitWidth =
          elements.contactListItemsUnit.clientWidth;
        elements.contactListItemsContainerButton.style.width =
          contactListItemsUnitWidth + "px";
        elements.contactListItemsSearchContainer.style.width =
          contactListItemsUnitWidth + "px";
      }
    },
    buttonContainerItem: function () {
      if (
        elements.contactItemContainer &&
        elements.contactItemContainerButton
      ) {
        let contactItemContainerWidth =
          elements.contactItemContainer.clientWidth;
        Object.keys(elements.contactItemContainerButton).forEach(function (key) {
          elements.contactItemContainerButton[key].style.width =
            contactItemContainerWidth + "px";
        });
      }
    },
  };

  methods.navigation = {
    setEventListner: function () {
      const buttons = methods.navigation.getNavigationLinks();
      Object.keys(buttons).forEach(function (key) {
        buttons[key].addEventListener("click", methods.navigation.eventListener.add);
      })
    },
    getNavigationLinks: function () {
      const navigationButton = elements.contactsContainer.querySelectorAll(
        ".navigation a"
      );
      return navigationButton;
    },
    eventListener: {
      add: function (event) {
        event.preventDefault();
        const buttons = methods.navigation.getNavigationLinks();
        Object.keys(buttons).forEach(function (key) {
          let dataElm = {
            element: buttons[key],
            attributeKey: "variant",
            attributeValue: "is-active",
          };
          if (buttons[key] !== event.currentTarget) {
            modules["general"].htmlElement.removeAttributeValue(dataElm);
          } else {
            modules["general"].htmlElement.addAttributeValue(dataElm);
          }
        })
        methods.contactItem.hide();
        let url = event.currentTarget.search || event.currentTarget;
        window.history.pushState('', '', url)
        methods.data.getContactsFromApi();
      }
    }
  }

  methods.mount = function (viewport) {
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

  methods.search = function (event) {
    event.preventDefault();
    const searchParam = methods.data.serialize(event.currentTarget.elements);
    methods.data.getContactsFromApi(searchParam);
    //    console.log();

  }

  methods.init = function (viewport) {
    if (elements.contactsContainer) {
      methods.setElements();
      window.addEventListener("resize", methods.elementWidth.fixedContainer);

      const buttonAddContact = elements.contactsContainer.querySelectorAll(
        ".button-add"
      );
      Object.keys(buttonAddContact).forEach(function (key) {
        buttonAddContact[key].addEventListener("click", methods.page.addContact);
      });

      const searchForm = elements.contactsContainer.querySelector(
        "form[variant='form-search']"
      );
      searchForm.addEventListener("submit", methods.search);
      methods.navigation.setEventListner();

      // get and show contact list
      methods.data.getContactsFromApi();

      return true;
    } else {
      return false;
    }
  };

  methods.render = function (viewport) {
    if (elements.contactsContainer) {
      return true;
    } else {
      return false;
    }
  };

  methods.unmount = function () {
    if (elements.contactsContainer) {
      window.removeEventListener("resize", methods.elementWidth.fixedContainer);
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
        container: '[variant="file-upload"]',
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
        if (elements.fileUpload) {}
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

modules["general"] = (function () {
  "use strict";

  var elements, methods, accessibility;

  elements = {};
  methods = {};

  methods.htmlElement = {
    getAttribute: function (data) {
      if (data.element) {
        return data.element.getAttribute(data.attributeKey) || false;
      }
    },
    hasAttributeValue: function (data, attributeValue) {
      if (!attributeValue) {
        attributeValue = methods.htmlElement.getAttribute(data);
      }
      var regex = new RegExp(data.attributeValue, "gi");
      return regex.test(attributeValue);
    },
    addAttributeValue: function (data) {
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
    removeAttributeValue: function (data) {
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
    hasClass: function (element, value) {
      return (" " + element.className + " ").indexOf(" " + value + " ") > -1;
    },
    getClosestParentNode: function (data) {
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
    createElement: function (data) {
      const element = document.createElement(data.nodeName || "div");
      element.className = data.className || null;

      if (data && data.addAttributes) {
        data.addAttributes.forEach(function (attributeData) {
          attributeData.element = element;
          methods.htmlElement.addAttributeValue(attributeData);
        });
      }

      return element;
    },
  };

  methods.getUrlParams = function (url = window.location.search) {
    // get query string from url as default set from window location
    let queryString = url.slice(1);
    let obj = {};

    if (queryString) {
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];

      // split our query string into its component parts
      let getParamsKeyValue = queryString.split('&');
      getParamsKeyValue.forEach(function (paramKeyValue, index, array) {
        let paramArray = paramKeyValue.split("=");
        let keySplitForArrayParam = paramArray[0].split("[");
        let key = keySplitForArrayParam[0];
        let value = paramArray[1] || true;
        // check for param arraykey
        let paramArrayKey = keySplitForArrayParam[1];
        if (paramArrayKey) {
          paramArrayKey = paramArrayKey.slice(0, -1);
        }

        if (paramArrayKey === undefined) {
          obj[key] = value;
        } else {
          if (!obj[key]) {
            obj[key] = [];
          }

          if (paramArrayKey.length === 0) {
            obj[key].push(value)
          } else {
            if (obj[key][paramArrayKey]) {
              if (typeof obj[key][paramArrayKey] === "string") {
                let objValue = obj[key][paramArrayKey];
                obj[key][paramArrayKey] = [];
                obj[key][paramArrayKey].push(objValue)
              }
              obj[key][paramArrayKey].push(value)
            } else {
              obj[key][paramArrayKey] = value;
            }
          }
        }
      });
    }
    return obj;
  };

  methods.accessibility = {
    set: function (data) {
      methods.htmlElement.toggleAttributeValue(data);
      methods.accessibility.setLocalStore(data.element);
    },
    getFromElement: function (data) {
      return methods.htmlElement.getAttribute(data);
    },
    setLocalStore: function (data) {
      return (accessibility = methods.accessibility.getFromElement(data));
    },
    getLocalStore: function () {
      return accessibility;
    },
    dataMouse: function () {
      var data = {
        element: elements.body,
        attributeKey: "accessibility",
        addAttributeValue: "mouse",
        removeAttributeValue: "keyboard",
      };
      return data;
    },
    dataKeyboard: function () {
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
    mouse: function () {
      addEventListener("keydown", methods.eventListener.setKeyboard);
      removeEventListener("mousedown", methods.eventListener.setMouse);
    },
    keyboard: function () {
      addEventListener("mousedown", methods.eventListener.setMouse);
      removeEventListener("mousedown", methods.eventListener.setKeyboard);
    },
    setMouse: function () {
      var data = methods.accessibility.dataMouse();
      methods.accessibility.set(data);
      methods.eventListener.mouse();
    },
    setKeyboard: function () {
      var data = methods.accessibility.dataKeyboard();
      methods.accessibility.set(data);
      methods.eventListener.keyboard();
    },
  };

  methods.init = function (viewport) {
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

  methods.render = function (viewport) {
    return true;
  };

  methods.mount = function (viewport) {
    return true;
  };

  methods.unmount = function () { };

  return {
    mount: methods.mount,
    init: methods.init,
    unmount: methods.unmount,
    render: methods.render,
    htmlElement: methods.htmlElement,
    getUrlParams: methods.getUrlParams
  };
})();

class fileUploadShowPrevieuw {
  constructor(fileUploadContainer) {
    this.fileUploadContainer = fileUploadContainer;
    this.cachedFileArray = [];

    this.inputTypeFile = fileUploadContainer.querySelector('[type="file"]');
    this.inputNameFile = fileUploadContainer.querySelector('[name="file"]');
    this.inputLabel = fileUploadContainer.querySelector(".caption");
    this.avatarImg = fileUploadContainer.querySelector(".avatar-image");
    this.eraseImageContainer = fileUploadContainer.querySelector(
      ".delete-file"
    );
    this.eraseImageButton = fileUploadContainer.querySelector(
      ".delete-file[type='button']"
    );
    this.eraseImageContainerState = "hidden";

    this.avatarImage = {
      defaultImage:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MTIiIGhlaWdodD0iNjEyIiB2aWV3Qm94PSIwIDAgNjEyIDYxMiI+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2YzEyMy4yMDEtNzUuNDMyIDIxNy40OTIgNi4yODcgMjE3LjQ5MiA2LjI4N2wtMi4yNCAyNS43MDljLTYzLjY3Ni0xMy44MzctOTcuODgzIDMxLjg3My05Ny44ODMgMzEuODczLTM2Ljc1Mi01OC44MDYtMTE3LjM2OS02My44NjktMTE3LjM2OS02My44Njl6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2czExMC4xMDQtNTYuNjcxIDE5My40MjcgNi4zOTdjODMuMzI0IDYzLjA3MSAwIDAgMCAwbC0xNC4xMjggMjAuMjQ2cy02Ny4zNS03MC41My0xNzkuMjk5LTI2LjY0M3oiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjI0LjIwMyAzMzkuMTNzLTEuMTA5LTQ3LjkxOCAyOS45MTYtNzguOTQzbDM5LjA4OCAxNy42MzkgMTcuNzE4IDExLjI5Ni0zNi44MTQgMjAuNTY4cy0yNi43MTIgMy4zNDYtNDkuOTA4IDI5LjQ0eiIvPjxwYXRoIGZpbGw9IiNCNzMyMzEiIGQ9Ik0xMDYuODM0IDI3NS4yNnMxMDIuODUyLTU0LjI0NyAxOTIuMTE4IDYuMjkzbDYuMjMzLTE0LjMxOWMuMDAxLjAwMS05Ni42MzYtNTkuNzA5LTE5OC4zNTEgOC4wMjZ6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQ5MS45OCAxNTEuNTI0Yy0xMDYuNjU3IDE3LjIwMS0xMjAuMzY1IDEwOS41MDUtMTIwLjM2NSAxMDkuNTA1bDE4Ljc2OCAyNC45ODljMzQuMDA3LTI5LjE4OSA2NC44MTgtMjMuODg2IDY0LjgxOC0yMy44ODYtMTEuOTI5LTU4LjY4NiAzNi43NzktMTEwLjYwOCAzNi43NzktMTEwLjYwOHoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMjcxLjU3IDY4Ljk1OGMxNS4wNTggOS4xIDMwLjk5NyAxNy4yMSA0Ny42NzggMjIuOTktLjgwMi0xMi45NjkuMzUxLTI2LjE0OCAxLjAyNC0zOC43MjIgMS41NzItMjkuMjc3LTcuNTgxLTQ0Ljc0Mi0xNy44NC00Mi40NjUtMTAuMjYyIDIuMjc3LS44OTMgMTIuNjQ5LTMzLjUyOCAyNi4yODktMTAuMjE4IDQuMjY3LTE4LjM2OSA2LjgzNS0yNi4yMTMgMTIuNTY0IDguMTYxIDguMDg2IDE5LjgxIDEzLjg1MyAyOC44NzkgMTkuMzQ0eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00NTUuMjAxIDI2Mi4xMzJzLTIwLjcxNi0zNC44NTYtNjYuMTA2LTM0Ljg1NmwtNS42NjMgMjYuMTU0IDEuNDg0IDE2Ljg0MSAxOS45NDEgNi43NTdjMC0uMDAxIDE2LjA0Ni0xNC44OTYgNTAuMzQ0LTE0Ljg5NnoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNNDkxLjk4IDE1MS41MjRzLTEwOC4zNDYgMzEuNjU0LTEwOC4zNDYgMTI1LjUwM2wtNy4xNDYtMzYuMzM0Yy4wMDEtLjAwMSAxNy43OTEtNzUuODM0IDExNS40OTItODkuMTY5eiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNDQuNzM2IDUxMC43MTdsMTEuNDAzLTMwLjczM2MtMTIuNzI4IDQuOTI4LTMwLjk2NSAxMC4zOTQtNDYuOTU0IDE0Ljg3IDEwLjMgNi4xMTEgMjIuMDYgMTEuNTM3IDM1LjU1MSAxNS44NjN6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTI3OC44MTYgNDE4Ljg1MmMtNTIuNDE1IDUuOTQ4LTkxLjkxNi05LjMwMS0xMTcuMDUyLTM0LjQ4Ny00LjA4NS00LjA5MS03LjY4MS00LjQ3LTEwLjM1Ni0yLjExMS0xMi41NzQgMTIuNTc0IDI3LjExOSA4NC40NjcgMTAwLjU2MiA4NC40NjcgMy40OTYgMCA2LjQ3Mi4wODggOC45OTcuMjUxbDExLjI3Ny0zMC40MTcgNi41NzItMTcuNzAzeiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNjAuOTY2IDQ2Ni45NzFsLTQuODI3IDEzLjAxM2MxNi40MzQtNi4zNjYgMjMuNjQ4LTExLjgxNyA0LjgyNy0xMy4wMTN6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTE1MS40MDggMzgyLjI1M2MtMTEuODUxIDEwLjQ2My01LjQ1NCA3NS4wNjkgNTcuNzc3IDExMi42MDEgMTUuOTg5LTQuNDc3IDM0LjIyNy05Ljk0MiA0Ni45NTQtMTQuODdsNC44MjctMTMuMDEzYy0yLjUyNS0uMTYzLTUuNS0uMjUxLTguOTk3LS4yNTEtNzMuNDQzIDAtMTEzLjEzNi03MS44OTMtMTAwLjU2MS04NC40Njd6TTQwNy4yNzMgNTE2LjY0NmMuMTU2LjA1MS4zMDEuMDg4LjQ1NC4xMzUtLjE1My0uMDUtLjI5Ny0uMDg0LS40NTQtLjEzNXoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMzY2LjUzNyA0ODUuNTQ3Yy0xMS45OTQgMjEuNTIzIDM2LjgwNSAxNy43OSA1NS42NDQtMTMuODUgMTguOTMxLTM2LjMwNy0xNi4yNjctNjIuNTI1LTE2LjI2Ny02Mi41MjVsLTM3LjIyOCA2OS40MDFjLjgwMi40NzQuMzM4IDIuNTEzLTIuMTQ5IDYuOTc0ek00MDcuNzI4IDUxNi43ODFjLS4xNTMtLjA0Ny0uMjk4LS4wODQtLjQ1NC0uMTM1LTMyLjYyNi05Ljg4Ni0zNy42OTcgOC44ODEtMTUuMzY5IDI3LjA2NSAxNC45NjggMTIuMTg3IDYuOTcxIDIwLjYwMSA2Ljk3MSAyMC42MDEgMTMuNzA1LS45ODcgMTYuMzU0LTEyLjA5MiAxNi4zNTQtMTIuMDkyIDEzLjE0NS0uOTQ2IDcuOTYtMTUuODc2IDcuOTYtMTUuODc2czEyLjI4LTE0LjU0OC04LjYzMy0xOC4wNDRjLS4yMS0uMDMxLS4zODktLjA3NS0uNTg5LS4xMTItMS44OC0uMjM4LTMuODU5LS42NzEtNS45NjItMS4zMjlhNi41MDMgNi41MDMgMCAwIDEtLjI3OC0uMDc4eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0zOTEuOTA0IDU0My43MTJjLTIyLjMyOC0xOC4xODUtMTcuMjU3LTM2Ljk1MSAxNS4zNjktMjcuMDY1LTE0LjM2My00LjI0MS0xNi42NzUtMTEuNzI1LTE2LjY3NS0xMS43MjUgMTYuMzQzLTExLjY1IDI2LjE2OS0yMi44NSAzMS41ODItMzMuMjI1LTE4LjgzOSAzMS42NC02Ny42MzggMzUuMzczLTU1LjY0NCAxMy44NSAyLjQ4Ny00LjQ2MSAyLjk1MS02LjUgMi4xNDktNi45NzRsLTIwLjE2NSAzNy42MDRjLTcuMDE0IDE2LjcyOSAyNC40NCAxNS4zNDQgNDUuNDQ3IDM1LjYwNSA3Ljc4OCA3LjUwNSA0LjkwNiAxMi41MyA0LjkwNiAxMi41M3M3Ljk5OS04LjQxNC02Ljk2OS0yMC42eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MDguMDA2IDUxNi44NTljMi4xMDMuNjU4IDQuMDgyIDEuMDkxIDUuOTYyIDEuMzI5YTYwLjk3IDYwLjk3IDAgMCAxLTUuOTYyLTEuMzI5eiIvPjxwYXRoIG9wYWNpdHk9Ii4zMyIgZmlsbD0iIzczMjcyOCIgZD0iTTQwOC4wMDYgNTE2Ljg1OWMyLjEwMy42NTggNC4wODIgMS4wOTEgNS45NjIgMS4zMjlhNjAuOTcgNjAuOTcgMCAwIDEtNS45NjItMS4zMjl6Ii8+PGcgZmlsbD0iIzczMjcyOCI+PHBhdGggZD0iTTQyMi4xODEgNDcxLjY5N2MtNS41NjkgOS4zNTEtMTMuNzU4IDE2LjI0Ni0yMi4yMTkgMjAuNzkxLTc4LjIyNCAzNS4xMDEgMTguMjAzLTMyMy43ODkgMTAuMDQzLTc5LjcxMSAwIDAgLjU4Ni4yODgtNy42MjgtNi44MjMtOC4yMjctNy4xMTctMjAuMjg2IDUyLjAzNS0yMC4yODYgNTIuMDM1cy05Ljg1OCAyOC45MTQtMTMuMzU3IDM5LjYxOGMtNC4xNDctMi4wMTgtNS41NDgtNi4wNTMtMi4xOTYtMTIuMDYxIDIuNDg3LTQuNDYxIDIuOTUxLTYuNSAyLjE0OS02Ljk3NGwtMjAuMTY1IDM3LjYwNGMtNy4wMTQgMTYuNzI5IDI0LjQ0IDE1LjM0NCA0NS40NDcgMzUuNjA1IDcuNzg4IDcuNTA1IDQuOTA2IDEyLjUzIDQuOTA2IDEyLjUzczcuOTk3LTguNDE0LTYuOTcxLTIwLjYwMWMtMjIuMzI4LTE4LjE4NS0xNy4yNTctMzYuOTUxIDE1LjM2OS0yNy4wNjUtMTQuMzYzLTQuMjQxLTE2LjY3NS0xMS43MjUtMTYuNjc1LTExLjcyNSAxNi4zNDMtMTEuNjQ5IDI2LjE3LTIyLjg0OCAzMS41ODMtMzMuMjIzek00MDkuODYzIDUzOC4wMjFzNy44NzYgNC4zODMgNS4zNjYgMTQuMmM0LjMwOC0uMjc2IDUuOTQyLTIuMDggNS45NDItMi4wOC0xLjY3MS0xMC42NzMtMTEuMzA4LTEyLjEyLTExLjMwOC0xMi4xMnpNNDE2LjczMyA1MjguNDI2czQuNzA4IDEuNDM1IDYuNDU2IDcuOTE5YzIuMDMtMS41OTggMi40NjMtNC4wMjIgMi40NjMtNC4wMjItMy4yOTMtMy42Ni04LjkxOS0zLjg5Ny04LjkxOS0zLjg5N3oiLz48L2c+PHBhdGggZmlsbD0iI0I3MzIzMSIgZD0iTTQzNi42MTkgMzA4LjE0OWMtMTAuMzg4LTEzLjkzNC0yNS44MDctMjQuNzE2LTMwLjQwNS0xOC43NTgtNC44ODMgNi4zNDQuMjc5IDMwLjYwMiAxMC40OTQgNTIuMjU3IDIyLjIzNSA0Ny4xNzQgOS41MDUgNjMuMjM3IDkuNTA1IDYzLjIzNyAxMy40NjctLjY2NCAxNi44NS0xMi40MTQgMTYuODUtMTIuNDE0IDE0LjY4OC0uNzI0IDExLjQxMi0xNi43MTkgMTEuNDEyLTE2LjcxOXMxNS43MDctOS45My0xMS4xNzQtNTcuMjIzYTExOC42NTQgMTE4LjY1NCAwIDAgMC02LjY4Mi0xMC4zOHoiLz48cGF0aCBmaWxsPSIjQjdCN0I4IiBkPSJNMzcxLjQyNCAyODQuNjI0YzIuNDk3LTMuMjIgOS43ODktMTEuMDk5IDE0LjEwMy0xNS43MDctMTIuODQ3LTYuNzkyLTIyLjIyMi05LjY1NS0yMi4yMjItOS42NTVsLjA1NiAzMC44ODFzMi44NDIgMi44MDEgNy4yNzEgNy41MDljLTEuMDcxLTUuOTQtMS41MzUtMTAuMDM0Ljc5Mi0xMy4wMjh6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQxOC4wODQgMzQxLjU3N2MtOS43ODMtMjAuNzM4LTE1LjQwOS00MS4yMTItMTEuMTYyLTQ4LjA1NCA0LjM1NC03LjAxMSAxOC44MzcuMDY1IDI5LjY5NyAxNC42MjYtMTUuMzU5LTIxLjQ1NS0zNS44NC0zNS4zMjMtNTEuMzAyLTQzLjQ4Ny00LjMxMSA0LjYwNS0xMS42MDYgMTIuNDg3LTE0LjEwNCAxNS43MDEtMi4zMyAyLjk5OC0xLjg2NyA3LjA5NS0uNzkyIDEzLjAyOCAxNC4xMjQgMTQuOTk5IDQ0LjU0OCA0OS41MjkgNTEuODI1IDc1Ljk0OSA2LjQzOCAyMy4zMzggMy45NjYgMzUuNTQ1IDMuOTY2IDM1LjU0NXMxNC4xMS0xNi4xMzUtOC4xMjgtNjMuMzA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zMzUuNzAzIDE0OC43NjRjLTEuODYtMjcuMTI1IDcuMTM2LTUzLjk3OCAxNC4xOTMtNzkuMjczQzM2MC41MzIgMzEuMzc3IDM1MyA4LjMyNyAzMzguODIgOC4zMjdjLTE0LjE4MiAwLTQuODc0IDE2LjM5OS01MS44NTcgMjQuODE5LTI5LjEyNCA1LjIxOS00NS42NTEgMy45OTEtNzguNDQ5IDQyLjEwOC0zMi43OTggMzguMTE0LTU4LjUwNyA3My4xMjctNTguNTA3IDExNS4yMzJzMjkuMjUyIDg1LjA5OSA0OC4zMDcgODUuMDk5YzEwLjE2OCAwIDE0LjAzNC04LjA3NiAyMS4zNDUtMTkuMDQzIDE0Ljk5OS0yMy43MjYgNDcuMTM2LTMzLjQ3NSA1My4xMTktNDcuODc4IDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTE0LTguMjE5IDguMjQ2LTE5LjU4NyAxNy4yNzQtMjMuMTA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zNDguNTY4IDE5MC4wNDVjLTguMjA0LTEzLjcxNy0xMS45MjItMjcuNTMyLTEyLjg2NS00MS4yODEtOS4wMjggMy41MjEtMTMuMTYgMTQuODg5LTE3LjI3MiAyMy4xMDktOS4yNzkgMTQuODQ1LTEyLjA5MiAzMC45ODEtMTcuNDU4IDQ1LjcwNyA3LjQ0NSAzLjIwOCA4Ljc1MiAyMC4xNzEgNC4xNjMgNDYuMDQtNy4zMTQgNDEuMjE4LTQyLjU1MyA4MS4xMDUtNDIuNTUzIDgxLjEwNXMtMjcuNTAxIDc1LjY0LTIyLjI4NSAxMjguMzM5bDIyLjI4NS00MS40MjlzNTEuODU5LTYuODEyIDY3LjgxMy04NS4wODdjMTQuNDQ0LTcwLjg2MSA1MC4xNDEtNzkuMjA0IDcyLjA1OS00Ni42MDMtMTMuNDg1LTUwLjAwNS0zNy4yNzctODIuMTItNTMuODg3LTEwOS45eiIvPjxwYXRoIGZpbGw9IiNFRTZBNkEiIGQ9Ik00MTIuODM3IDM4My4yODdjMC0zMi42MzUtNC4wNjMtNTkuOTQxLTEwLjM4Mi04My4zNDItMjEuMTk4LTMyLjgzMy02My42OTEtMjQuMjU4LTc4LjEzNiA0Ni42MDMtMTUuOTU0IDc4LjI3NC02MS43MzYgODUuMDg3LTYxLjczNiA4NS4wODdsLTIyLjI4NSA0MS40MjljLjg2MSA4LjY4MSAyLjYyNSAxNi43MTkgNS41MjYgMjMuNzE3IDQuNjM2IDEuMDggOS43NDkgMi41MjQgMTUuNDM3IDQuNDA3IDc3Ljk2NyAyNS43ODcgMTUxLjU3Ni0zMi44MDEgMTUxLjU3Ni0xMTcuOTAxeiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MTEuMDA3IDQxMS4xNDJjMS4xOTQtOC44MjEgMS44My0xOC4xMDYgMS44My0yNy44NTQgMCAzLjc4NC0uMjAxIDcuNDkzLS40NzkgMTEuMTcxLjYxNy0xMi43MzEuNDEzLTI2LjAxMy0uNjE3LTM5LjcyMiA0Ljk5MyAxNTIuNTg4LTEyNi41NSAxNDEuMDU3LTEyNi41NSAxNDEuMDU3bC05Ljg0MiA5LjE0NWExMjQuNTk4IDEyNC41OTggMCAwIDEtMTQuMDg3LTMuNzVjLTUuNjg4LTEuODgzLTEwLjgwMS0zLjMyNy0xNS40MzctNC40MDcgNS4xNzIgMTIuNDcxIDE0LjAwOSAyMS41NzcgMjguMDYyIDI0Ljc5MWExMTEuNDEyIDExMS40MTIgMCAwIDAgMjQuNzg4IDIuODEzbC4wMzQuMDI0Yy4xNzIgMCAuMzI5LS4wMTMuNTAxLS4wMTMuOTgzLS4wMDMgMS45NjctLjA0NCAyLjk0OC0uMDc4IDY4LjQzNi0xLjUyNiAxMDEuMzUzLTQ4LjAxMyAxMDguODQ5LTExMy4xNzd6Ii8+PHBhdGggZmlsbD0iIzUyNTI1MiIgZD0iTTIxNi42MjIgMTkwLjk2OWM2LjczNS0xLjI3OCAxNC44MDUtOS40MzYgMTEuODYzLTE4LjcyNy0yLjk0MS05LjI5Mi0xNC45NTItMS40MTYtMTYuNDQzIDcuNzA5LTEuNDIyIDguNjk3IDIuMDkyIDExLjQ5NyA0LjU4IDExLjAxOHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjIxLjUxMiAxNzkuNDM4YzEuNDc5LjUxMSAzLjE1MS0uNzc3IDMuNzE4LTIuODc5LjU3LTIuMTAyLS4xNjktNC4yMTMtMS42NDgtNC43MjEtMS40OTEtLjUwNy0zLjE1NC43ODYtMy43MyAyLjg4NS0uNTY0IDIuMDkzLjE3MSA0LjIxMSAxLjY2IDQuNzE1eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0yOTkuODE2IDI3Ny4wMjdzLTUuNjUxLTEyLjI5OCAxMS45NjctMjMuMDk5YzE3LjYxNy0xMC44MDUgMTkuMTExIDQuMzE5IDE5LjExMSA0LjMxOSIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00OTEuOTggMTUxLjUyNHMtNjAuMDg1IDIwLjQ3OC05MS41NTUgODIuOTA2bC01LjE5NC03LjE1NXMyMi45ODQtNTMuMjE5IDk2Ljc0OS03NS43NTF6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTIzNS4zMzkgNTUwLjI4MWMtLjgzIDI0LjkzMyAzMy4yNjggNDQuNzQyIDE1LjUwMyA1My4yODUgMTYuNjIyIDIuMjE1IDIxLjk0LTcuNTM3IDIxLjk0LTcuNTM3IDIyLjYwMiAzLjMyNyAyMS40OTMtMTYuMTc3IDIxLjQ5My0xNi4xNzcgMTAuNjA0LTcuMDExIDkuNjgzLTE2LjMzMy4wMjItMjUuNTcxLTIxLjkzNC0xOC4xNDMtNTguMTI4LTI4Ljg0MS01OC45NTgtNHpNMzAwLjA3NyA0NjMuMDczYy4zMjktMjIuMTg4LTEyLjIyNy0zOS44OTYtMTIuMjI3LTM5Ljg5NnMxNy4yODYtMTEzLjQ2MS00NC43NjUtNjQuMjY1Yy02Mi4wNTMgNDkuMTk3LTUyLjkwOSAxMTUuNjItMzkuMjIzIDEzNy4zOTUgMjMuMTU0IDMzLjU3NSA4NC41MTEgMTguMjg4IDk2LjIxNS0zMy4yMzR6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTI4NS4xOSA0OTkuODVjMTAuOTg2LTEyLjIxNyAxNC43MTQtMjUuMTE2IDE0Ljg4Ni0zNi43NzYtMTEuNzA0IDUxLjUyMS03Mi4xNTYgNjQuMDUyLTk2LjIxNCAzMy42MjUgMTYuNTA5IDI2LjI2MSAzOC45OTggMjAuODgyIDI4LjgwNyAzOS43MTgtMTAuMTk3IDE4Ljg0LjY2NyAzNy4wMTIgMTQuODQ4IDQ4LjUzM3MzLjMyNCAxOC42MTcgMy4zMjQgMTguNjE3YzI3Ljk3NC05LjA4NS05LjUyOS0yNS44MDMtOS41MjktNTAuNzQ4IDAtMTkuNSAyOS45MS0xNC4yMDkgNTIuOTg0IDEuNDYzLTIuODYtMi43MzEtNi40NDMtNS40NTctMTAuNzctOC4xMTMtMTguOTQ0LTExLjYzNS0yOC45MTktMTIuMjk5IDEuNjY0LTQ2LjMxOXoiLz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMjcyLjc4MiA1OTYuMDI5YzguMDg4LTEwLjE5IDEuMjE2LTE4LjA2IDEuMjE2LTE4LjA2czEwLjExMiA0LjEwMSA3Ljk5MSAxOC4wNmMwIDAtNCAyLjEwOS05LjIwNyAwTTI5NC4yNzUgNTc5Ljg1M2MwLTExLjI5OS03Ljc1Ni0xNC4wNzEtNy43NTYtMTQuMDcxczguNTM3LjMwNCAxMi4xODkgMTAuMjljMC0uMDAxLTEuODI3IDIuNzI4LTQuNDMzIDMuNzgxIi8+PGc+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMzOC44MiA4LjMyOGMtMTQuMTgyIDAtNC44NzQgMTYuMzk5LTUxLjg1NyAyNC44MTktMi4zMzMuNDE3LTQuNTc3Ljc5LTYuNzYzIDEuMTUgMjUuNjQ0LTMuOTYzIDIyLjY4IDMuOTA2IDQuMzIzIDEyLjgxNS0yMy4wMDIgMTEuMTU4LTM2LjYyMyAxLjA4MS02OC45NDUgNDYuNzQ1LTMyLjMyNSA0NS42NjMtNDMuMTIgOTIuNDk5LTIzLjkwOCAxMjkuODc2IDIwLjA0NSAzOC45OTEgMzMuNjkgMTkuMTI4IDUzLjAyMiA4Ljc0bC0uMDA2LjAwNmMxMi41MjctOC43NjIgMjQuNjQ3LTE1LjUxOSAyOC4wOTMtMjMuODEzIDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTEyLTguMjIgOC4yNDQtMTkuNTg4IDE3LjI3Mi0yMy4xMDktMS44Ni0yNy4xMjUgNy4xMzYtNTMuOTc4IDE0LjE5My03OS4yNzMgMTAuNjM3LTM4LjExNSAzLjEwNi02MS4xNjQtMTEuMDc1LTYxLjE2NHoiLz48L2c+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTI1MS43IDIzNC4xMTdjMTguOTQ2LTEzLjQ2MSAyMS4wNzktMjUuNDUyIDIxLjA3OS0yNS40NTItNS45ODMgMTQuNDAzLTM4LjEyIDI0LjE1Mi01My4xMTkgNDcuODc4IDMuODk0IDIuODYgOC4yMDQgMy45MjUgMTIuODA5IDMuNTk2IDIuNDg4LTguMzEzIDguNDAyLTE4LjMyNSAxOS4yMzEtMjYuMDIyeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0yNTAuOTQ4IDIzMy4zNjhjMTguOTQ2LTEzLjQ2IDIxLjgzMS0yNC43MDMgMjEuODMxLTI0LjcwMy0zLjA2MyA3LjM3MS0xMi45NzIgMTMuNTI2LTIzLjkzMyAyMC45NTdhMTEuNDY3IDExLjQ2NyAwIDAgMCAxLjg5NSAzLjkxNmMuMDc2LS4wNTcuMTM1LS4xMTYuMjA3LS4xN3oiLz48Zz48cGF0aCBmaWxsPSIjNUExRDFBIiBkPSJNMjE1LjkyOSAyMDIuNDU5YzYuNjc2LTEuNTYgMTQuMzk3LTEwLjA0NiAxMS4wNjctMTkuMjA2LTMuMzMzLTkuMTYtMTUuMDAxLS43ODktMTYuMTA3IDguMzk2LTEuMDU5IDguNzQ2IDIuNTc1IDExLjM5NiA1LjA0IDEwLjgxeiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMjAuMzI4IDE5MC43MzdjMS41LjQ1MSAzLjExNy0uOTA5IDMuNTkzLTMuMDM2LjQ4Ni0yLjExOC0uMzQ0LTQuMjAxLTEuODQyLTQuNjQyLTEuNTEtLjQ0NS0zLjEyLjkxMS0zLjYwNSAzLjAzNS0uNDc3IDIuMTE1LjM0NyA0LjIwNSAxLjg1NCA0LjY0M3oiLz48L2c+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMwOC40MTggMjY0Ljk4OXMtNDguNjQyIDI5LjQzNC02Mi4wMDIgMTEzLjM2NWMtNS44MiAzNi41MzEgMTAuMjcyIDQwLjc3NiAxMC4yNzIgNDAuNzc2czEyLjgxOCAxOC4yMzEgMzAuNDIgMTIuODVjMCAwIDkuNTU4IDEwLjQ0NCAzMC4zNzQuMTI2IDAgMC0yMy43MjktMTAuOTg5LTMwLjM4My00OC42NDMtNi42Ni0zNy42NTcgMTAuMjE5LTc4LjU3OCAyMi4xNTQtOTIuNjY4IDEzLjM2Mi0xNS43NzkgMTIuMzgyLTM0LjY2NS0uODM1LTI1LjgwNnoiLz48Zz48cGF0aCBmaWxsPSIjQTVBNUE1IiBkPSJNMzAxLjkwOSA0MjguOTQxbC0uNzM2LS41MjZjLjQ3My4zNjMuNzM2LjUyNi43MzYuNTI2eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0yOTAuMzgxIDM4Mi4wMTJjLTUuNTM5LTMxLjM0MSAyLjk2Ni02My45MDcgMTIuODU2LTgyLjA4OS00MS4zMTUgNzIuNzI5LTEwLjM4MSAxMjIuMDQ1LTEuMzI4IDEyOS4wMTkgMCAwLTE0LjgzNiA0Ljk4Ni0yMi4zNjctMTAuMDgxIDAgMCAuNTIgNS43MTQgMy42NTYgOS41MjYgMCAwLTIyLjYwNCAyLjM0My0yOC4wOTMtMTkuMjE1IDAgMC0yLjkwMSAxMC45MzYgOC4yNTQgMTguNjYgMTEuNTI4IDcuOTc2IDIzLjQ5NCA1LjIwNiAyMy40OTQgNS4yMDZzMTUuNTI1IDExLjc2NyAzMi41NzMtLjk1OGMuMDAxIDAtMjIuMzg4LTEyLjQxMS0yOS4wNDUtNTAuMDY4eiIvPjwvZz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMzkzLjE4MyAyNzAuOTM0czcuOTEtMTAuNzQ4LTUuODE3LTE0LjIwOWMwIDAtOC40NTEtMjAuODg1LTE3LjgwNS0zNC44NjMtLjAyMi0uMDI4LS4wNDgtLjA2LS4wNjktLjA5MS05Ljg5My0xNi4yOTUtMjEuMTMzLTMzLjA5OS0yNy4xODUtNDkuNTEzLTkuMzE2LTI5LjE1OCA0LjgzNy0zMC41OTMgNy42OTMtMzguMDAxIDQuNDc3LTExLjU4NC0xMi40Mi02LjkzOC04LjAyOC0zMS43OTIgMS45NzEtOC4wNDcgNC4zMzItMTYuMDk1IDYuODE5LTI0LjExMSA5LjMzNS0zMC4wODIgMTMuOTYyLTcwLjAyNS05Ljk3MS03MC4wMjUgMCAwIDE3LjE3NiAyLjM0NiA2LjIwNSAzNi4wNzgtMTAuOTcgMzMuNzI5LTUzLjE4NSA1Ni45OTctNDEuNTQ3IDEwMC44NzUgMTAuMTU5IDM4LjMyNCAyLjIxMSA1OC44MzYtMjEuNTUyIDgxLjM5MSAwIDAgMjkuMzY1LTI4LjIwNiAyNS41MDIgMTkuNzY3IDYuODU3LTcuODUgNy41NDYtMjAuMzY4IDcuMTU1LTMyLjMxLjA0LTE4LjcwOCA4LjA1Ny0zOS45NzEgMzMuNDg2LTExLjQ3OC42MjEuNzA1IDEuMjQ0IDEuNDA3IDEuODU4IDIuMTI3LjEwMy4xMjIuMjEuMjU0LjMxNi4zNzkgMjguMTg3IDMzLjI5MyA0Ny4wNjkgNzguNDYyIDUyLjIxIDk0Ljc4OS0uNjcyLTMuMjEzLTYuMDc1LTIxLjU1MS05LjI3LTI5LjAxM3pNMjgwLjM5MiA0OTcuMzIyYzI3LjM0MS0yNC44MjkgMTIuMDUxLTYzLjQ5NyAxMi4wNTEtNjMuNDk3aDYuMDcxczIwLjMwMiAzMy4xNDYgMS41NjMgNzYuODkyIi8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQwMy4wNzggMjQ4Ljc5M2MtMjQuMjU4LTguNTQyLTEyLjIzMi0zOC40ODYtMTIuMjMyLTM4LjQ4Ni0xMC45ODUgMTQuMTYyLTE1LjQxNSAzMS4wNS0xNS40MTUgMzEuMDVsMTAuMDk2IDE0Ljc0OHMxMi4wODYgOC4xNTQgMTIuODEgNy40MjdjLjcyMy0uNzI3IDI5LTYuMTkzIDQuNzQxLTE0LjczOXoiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjU0LjEwOSAyNjAuMTk2czIyLjYwNyA2LjExNSAzOS4wOTQgMTcuNjNsLTI2LjQxNyAyLjk1MXMtOS45MjQtNy40NzUtMTAuMzI1LTcuODc1Yy0uNC0uNDAyLTIuMzUyLTEyLjcwNi0yLjM1Mi0xMi43MDZ6TTQ1NS4yMDEgMjYyLjEzMnMtMTAuNTEzLTQ2LjEzNy01NS4yMjQtNDMuMzYxYzAgMCAyNy4xNjUtNDkuODYxIDkyLjAwMy02Ny4yNDcgMCAwLTQ2LjAwMSA1MS4wNDUtMzYuNzc5IDExMC42MDh6Ii8+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTM4OC40OCAyNTAuMDM3cy4yMjYtMjAuNzY2IDE5LjY2LTQzLjIwOGwxNS40MjUtMi43OTQgNS4yMTMgMi43OTRzLTMwLjU0OSAxNi45ODUtNDAuMjk4IDQzLjIwOHoiLz48L3N2Zz4=",
      successPdf:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiQAAAD6CAMAAACmhqw0AAACClBMVEUAAAD29u3u7unt7ent7enu7uju7uhYowBbpARcpQZdpghjqBFlqRRqrB1trSBuriJwryVysCh6tDWAtz2CuEKGukeQv1aVwV+Yw2OZw2SaxGWaxGebxGmfxm6hoqCio6Gio6KjpKOkpaSkyXempqSmp6WnqKanynqoqKaoqaepqqiqq6iqq6mqq6qqzH6rq6qrrKutrautrqyur6yvr62wsa6xsa+xsrCysrCys7Cys7Gzs7GztLGztLK0tbK0tbO1tbO1trS2t7W3t7W3uLa30pO4uba5ube5ure6u7e7vLm8vLq8vbu81Zq81Zy9vru91Z6+vry+v7y/v72/wL2/1qDAwL3Awb3Awb7Bwr7Cwr/Cw7/Dw8DDxMDDxMHD2KXExMHExMLFxcPFxsPGxsPG2qvHx8THyMTIyMXIycXJycbJysbKysfKy8fK27DK3LHLy8fLy8jLzMnMzMnNzcnNzsrPz8vP0MzQ0M3R0c3R0s7S0s/U1NDU1dHW19PX4sXY2NTY2NXY2dXZ2dXZ2dba2tXa2tba29bb29bb5Mrb5Mvc3Nfc3Njc3djc3dnd3dne3tre39vf39vg4Nvg59Ph4dzh4d3i4t3i4t7i6Nbj497k5N/k5ODl5eDl5eHl5uLl6drm5uHn5+Ln5+Po6OPp6eTq6uXq6+Lq7OPr6+bs7OXs7Oft7eft7ejA9tVyAAAAB3RSTlMAHKbl5uztvql9swAABYdJREFUeNrt3Gl3E2UYgOEkLRRFEPc9hAqICAqo4AaioiguiOKGiqAoUHGjQhWLIIgiiCjIItSqQAsR5z9K25mGJG06TfshzVz3F2jmbQ9nnutkeWdKKpXONAbSIDVm0qlUerwToUqNS6cyzoIql0k1OAmqXEPKOdBQQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEkAgSQSJIBIkgESQSJIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIJEgEiSARJIJEkAgSQSJBIkgEiSARJIJEkAgSCRJBIkgEiSARJIJEkEiQCBJBIkgEiSARJIJEgkSQCBJBIkgEiSCRIBEkgkSQCBJBIkgEiQSJIBEkgkSQCBJBIkgkSASJIBEkgkSQCBJBIkEiSASJIBEkgkSQCBIJEkEiSASJIBEkgkSQSJAIEkEiSASJIBEkEiSCRJAIEkEiSASJIJEgESSCRJAIEkEiSASJBIkgESSCRJAIEkEiSCRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEiUZysu3yvmrfc/hEvnzV/raS2n88dmaQn1i2ttBuSMZk32TLan547Z6SVauyA5Rb8vmRAX7igGv7ehySekHS07zWrliDv2dzFyRJRZLNztkXb/AzP+mGJKlIstkNsQafzc7+GZLEIsluiYckm2uDJBFImuf21lw01J3xkGSzayBJApInwq//Orh9fv9Q5+ZLBr++K6zzyPdbHs0Vxr+xHEn/2kJ5SOoCyaXyX86MZt9aMvgNRd975p1c+ZPOIGsTUmKQBMGhqeGjC4cY/KmH+jdXjkKSLCTB2vDRqf8MMfju5ZGSJZAkDEk+egPbPtTgLy6OlOyDJFlIgoXhw18MOfiOGeGxRyBJGJKV0UeUoQe/PXoq2QtJspB8FD785tCDz88KD74FSbKQvBA+/EGMwW8MD94HSTLfk2yNMfij0evNMUgS+elmZ5xnhxlFoiBJCJLN0T7J2ThInim6ggNJMpAcmzasj7XrwqMritauOV1cJyT1hOTw/dG7jG2xkLSERxcXrU3eJeAEITlVmPK8fCwk28KjCyCpbyRz1vT27APNle4nGRjJ19GdBZAk7860AonKSFqLrhlDkiQkq4OYSDaER5+CJGFImrcHcZG8ER5dCUmikORWnAhiI1lUdDUwWvtce3E/lH/j7x++V+jTvyEZS0gWrO8oXlURSVeu6OaT2Jtp/97aVNQV90JS20hmLO1t+ap1Ld+eLVtVcfDfRc8+54aH5K6m0l6CZIzskwxUxcGvCA8+FgwPyeQyJNdDUqdITkevNh8PE0mZkaarIalTJK9ErzZ/jgDJhBd3TWpqmgxJfSLZWfpbfNUgmfBaEPx0JSR1iuR4dDPJtM7qkfQYgaRukRyMjGTXBlUgmfTZTZGRA15uaqlzO9Zt+WVUkHS3RDeeZBflq0Ay8UAQ3FIwAknNtHd2zwhfz48YycnW2f3bb3d3BFUgmXLh0h+39RuBpFbqnN43w03VIHmyNazl3efnX76LfyioBknTDRf6/tpnBJJaaX30RjNfBZJBmrU/qA5JqCQ0AkmttDSa7K+jhmRhR1Atkl4lkRFIaqVlxb8lM3Ikube7g+qRXFLSbwSSWmlTOMPpF0cFSe7V07H3VAbeJ5kysQmSGqtrTt8M24JRQPLg+6fi76mUdlXZtZtrIamRjvf870TNW4MRIWmeu2jZ6h2dw9hTKe/GMiR3QlIrXfxtx+6zNfDv+OOaEiPXnYdEJZ1/+vabC93x8n8BJKr/IBEkgkSQCBJBIkgEiQSJIBEkgkSQaCwhaXAOVLmGVMZJUOUyqfR4Z0GVGpdOpdKZRidCg9WYSaf+BwrW/g4sKOtDAAAAAElFTkSuQmCC",
      successVideo:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAD6CAYAAABXq7VOAAAABGdBTUEAALGPC/xhBQAAEbBJREFUeAHt3U+MnHUZB/Df7E7/bmeX1u1uW6BAW6BFg6ixtAqaYGI0MRzAuxdOetKTN9EYr568KGdvkpBgojERo7SWJmgQqW3BioJYOrutS3fb7j/GmTZdW3Z2O7Odmfd9n/ls0jD7zjvv+3s+zwNfZuadTmly8mwt+SFAgAABAgQKLTBQ6NVbPAECBAgQIHBVQKAbBAIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECBQRkCAQHcFFhYW06nTp1P13ESanpnp7slu8+gDAwNp06aNaXh4JO3cOZbGx8bS4ODgbR7VwwkQ6IVAaXLybK0XJ3IOAv0o0Ajzl48cTdPT+Q7ylXqzfv36tG/fnnTvPbtTI+z9ECCQXwH/hua3N1YWQKDxzLyoYd7gn5ubSydOnExHjh5Lly9fDtARJRCIKyDQ4/ZWZTkQOHeumoNV3P4SpqY+qL/S8Md0cXr69g/mCAQIdEVAoHeF1UEJXBOYmbkUhmJ2di4dO3ZcqIfpqEKiCbgoLlpH1ZN7gcb70iMjI7lYZ7Xa3isI10P90KMHU6WyJRc1WAQBAtcEBLpJINBjgUaYP3rwMz0+a/PTvfjLXy2742PbtqVdd+5Mp06+mebm55bdfzXUXzmehPoyGhsIZCrgJfdM+Z2cQP4EBuofU7tn993psccO1T/CtqnpAq+HuvfUm/LYSCATAYGeCbuTEsi/wObNm9PnDh9cPdS9p57/Rlph3wgI9L5ptUIJtC/QeIYu1Nt38wgCWQgI9CzUnZNAgQSEeoGaZal9LSDQ+7r9iifQmkAj1A8f+mzatHGV99S9/N4apr0IdElAoHcJ1mEJRBNovKd++LBQj9ZX9cQREOhxeqkSAl0XEOpdJ3YCAmsWEOhrpvNAAv0pINT7s++qzr+AQM9/j6yQQO4EhHruWmJBBJJANwQECKxJQKivic2DCHRNQKB3jdaBCcQXaCXUj7/y6tWvYY2voUIC2QoI9Gz9nZ1A4QVuFeqXr1xOr73218LXqQACeRcQ6HnvkPURKIDArUL9/XPn0vnzFwpQiSUSKK6AQC9u76ycQK4EbhXqb751JlfrtRgC0QQEerSOqodAhgKNUD9Y/2rYUqm0bBUTExNpfn5+2XYbCBDojIDvQ++Mo6MQCCOwuLiYZmYurbmegYGBNDq6LVWrkzcdo1arpWo91Hft3HnTdr8QINAZAYHeGUdHIRBG4Pz58+ml3/2+K/VcmrncleM6KAECyefQDQGBfhYolwd7Wv7s3GxPz+dkBPpJwHvo/dRttRL4iEClUvnIli7/Wuvy8R2eQB8LCPQ+br7SCezbuwcCAQJBBAR6kEYqg8BaBMbHx9KB/Q80vSp9LcfzGAIEshNwUVx29s5MIBcCe+vP0sfHx1PjY2Uzl+pXt3fgZfHGx9Pe/fd7uajPIgj0i4BA75dOq5PAKgJbtgylxp9O/TQ+9ibQO6XpOARaE/CSe2tO9iJAgAABArkWEOi5bo/FESBAgACB1gQEemtO9iJAgAABArkWEOi5bo/FESBAgACB1gRcFNeak70IZCYwNTWV/n7m7foXmyxktoY7Rirp/vv3pcbf0+6HAIF8Cgj0fPbFqggsCbxx4lT9u8TPL/2exY1qtZqGh4fTzp07sji9cxIg0IKA/91uAckuBLIUmJ29kuXpl859Zdbfw76E4QaBHAoI9Bw2xZIIECBAgEC7AgK9XTH7E+ixQF7ety4P9vab2XrM7HQECi8g0AvfQgVEF7jvvntTuZzt5S4jI8NpbGx7dGr1ESi0QLb/lSg0ncUT6I3A7rvvSo0/fggQILCagGfoq+m4jwABAgQIFERAoBekUZZJgAABAgRWExDoq+m4jwABAgQIFERAoBekUZZJgAABAgRWE3BR3Go67iOQE4ELF6bSwsJcZqupVIbTxo0bMju/ExMgcGsBgX5rI3sQyFTg9dffSP/81zuZrqFUKqUvPP75VKlsyXQdTk6AwMoCXnJf2cY9BHIhMDE5mfk6arVamszBOjKHsAACORYQ6DlujqURyJNALU+LsRYCBJYJCPRlJDYQIECAAIHiCQj04vXMivtMYHh4JBcV3zGSj3XkAsMiCORQwEVxOWyKJRG4UeCTD38ijY9vT/Pz8zdu7untRphv3XpHT8/pZAQItCcg0NvzsjeBnguUy4Pprjt39fy8TkiAQLEEvORerH5ZLQECBAgQaCog0Juy2EiAAAECBIolINCL1S+rJUCAAAECTQUEelMWGwkQIECAQLEEXBRXrH5ZbR8KVKvVdOrUW2l+Ibur3BsfnWtcbd+4QM8PAQL5FBDo+eyLVRFYEmiE+X+nppZ+z+LGzMylqx+dc7V9FvrOSaA1AYHempO9CGQmkOUz8xuLzvJz8Deuo53bF+eq6b2LJ9Pih61/U92GwaF05/BDaWN5uJ1T2ZdA5gICPfMWWAABAp0WqNUW0/Mnn02//cfP1nTo8sD69OSD301fuu+ba3q8BxHIQsBFcVmoOyeBNgTWlde1sXf3dl23Lh/raKXC35z5yZrDvHH8hfoz+uf/9oP057MvtnI6+xDIhYBn6Llog0UQWFngwQf35eKiuB3j4ysvMmf3HH3n5x1ZUeM4n9rxtY4cy0EIdFtAoHdb2PEJ3KbA9u3bU+OPn9YFqpfebn3nVfac6NBxVjmFuwh0TMBL7h2jdCACBIoqMFgqp2c+/dP0vS8eSds23b1URq324dJtNwjkXUCg571D1keAQFcFroX5c/WX1p9MY0N707cP/SKtG9zY1XM6OIFuCAj0bqg6JgEChRC4HuYPj3+lEOu1SAKrCQj01XTcR4BA4QUaL6F/5/AL6fHd37iplmZhfv7yO+nHx55O84tXbtrXLwSKIOCiuCJ0yRoJEFiTwNC6rfWX0J+/+r743q2PpvLAuvTS28+llcP8qdQIdT8Eiigg0IvYNWsmQKAlgcqG0TSyccfSvl9/6IepVBpM9287nG58mf3aM3NhvgTlRiEFvOReyLZZNAECrQicnX4zPfenZ9Ji7f9fbPP0ge8L81bw7FM4AYFeuJZZMAEC7Qj85f1fLwv164/3zPy6hH9GEBDoEbqoBgIEVhVoFurCfFUydxZQQKAXsGmWTIBA+wI3hrowb9/PI/Iv4KK4/PfICoMJTNW/2/yV468Gq+rmchYXF2/ekJPfGqH+oz88kS7OTqSZ+Qs5WZVlEOiMgEDvjKOjEGhZYG5uLlWr1Zb3D7VjqTfVVNaPpotzE01P1rhQrtWfygZ/h36rVvbLXsBL7tn3wAoCC2wZGgpcXfulDW3e3P6D1vCIj489sYZHLX/IQ9s7c5zlR7aFQOcFBHrnTR2RwJLA9rHRpdv9fqNUKqXR0d54PHXg2bSrsv+2yPePPp6+vOdbt3UMDybQS4HS5OTZWi9P6FwE+klgYWExvXzkaJqenumnspvWemD/A2nv3j1N7+vGxsUP59Kr/3khvfvBifrn0OdaPsWGwaG0e+SR9MiOr9Yf06P3CFpenR0JrCwg0Fe2cQ+Bjgg0Qv3U6dOpem4iTc/0V7CXy4OpUqmkffUgHx8f64ingxAg0FxAoDd3sZUAAQIECBRKwHvohWqXxRIgQIAAgeYCAr25i60ECBAgQKBQAgK9UO2yWAIECBAg0FxAoDd3sZUAAQIECBRKQKAXql0WS4AAAQIEmgsI9OYuthIgQIAAgUIJCPRCtctiCRAgQIBAcwGB3tzFVgIECBAgUCgBgV6odlksAQIECBBoLvA/K4s3M3j52hYAAAAASUVORK5CYII=",
      successMultiple: "./resources/images/icons/icon-multiplefiles.svg",
    };

    //this.setAvatarImgSrc();
    this.eventHandler();
  }

  setAvatarImgSrc(imageSrc = this.avatarImage.defaultImage) {
    this.avatarImg.src = imageSrc;
    this.setEraseImageContainerState();
  }

  getAvatarImgUrl() {
    let avatarImageUrl;
    this.eraseImageContainerState = "active";
    switch (this.cachedFileArray.length) {
      case 0:
        avatarImgUtl = this.avatarImage.baseImage;
        this.eraseImageContainerState = "hidden";
        break;
      case 1:
        if (this.cachedFileArray[0].type.match("image/")) {
          avatarImageUrl = this.cachedFileArray[0]["dataUrl"];
        } else if (this.cachedFileArray[0].type.match("application/pdf")) {
          avatarImageUrl = this.avatarImage.successPdf;
        } else if (this.cachedFileArray[0].type.match("video/")) {
          avatarImageUrl = this.avatarImage.successVideo;
        }
        break;
      default:
        avatarImageUrl = this.avatarImage.successMultiple;
    }

    this.setAvatarImgSrc(avatarImageUrl);
  }

  eventHandler() {
    this.inputTypeFile.addEventListener("change", this.fileUpload.bind(this));
    this.eraseImageButton.addEventListener(
      "click",
      this.avatarImageToDefault.bind(this)
    );
  }

  avatarImageToDefault() {
    this.cachedFileArray = [];
    this.inputTypeFile.value = "";
    this.eraseImageContainerState = "hidden";
    this.setInputNameFileValue();
    this.setInputFileLabelText();
    this.setAvatarImgSrc();
  }

  fileUpload() {
    let inputfieldElement = event.target;
    let filesToUpload = inputfieldElement.files;
    let totalFilesToUpload = inputfieldElement.files.length;

    this.cachedFileArray = [];

    new Promise(
      function(resolve, reject) {
        Object.keys(filesToUpload).forEach(
          function(key) {
            this.cachedFileArray[key] = filesToUpload[key];

            let reader = new FileReader();
            reader.readAsDataURL(filesToUpload[key]);
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
        this.getAvatarImgUrl();
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
        this.inputLabel.innerHTML = "select a file";
        break;
      case 1:
        this.inputLabel.innerHTML = this.cachedFileArray[0].name;
        break;
      default:
        this.inputLabel.innerHTML =
          this.cachedFileArray.length + " files selected";
    }
  }

  setEraseImageContainerState() {
    if (this.eraseImageContainerState === "hidden") {
      this.eraseImageContainer.style.opacity = 0;
      setTimeout(
        function() {
          this.eraseImageButton.style.display = "none";
        }.bind(this),
        655
      );
    } else {
      this.eraseImageButton.style.display = "block";
      this.eraseImageContainer.style.opacity = 0;
      setTimeout(
        function() {
          this.eraseImageContainer.style.opacity = 1;
        }.bind(this),
        5
      );
    }
    //   this.eraseImageContainer.setAttribute('state', this.eraseImageContainerState)
  }
}

export default fileUploadShowPrevieuw;

(function() {
  methods.modules.mountAll("body");
  methods.modules.initAll("body");
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRhY3RzLmpzIiwiZmlsZXVwbG9hZC5qcyIsImZvcm0uanMiLCJtb2R1bGVzLmpzIiwib3V0bGluZS5qcyIsImZpbGUtdXBsb2FkLmpzIiwiZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaDBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN3FCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtb2R1bGVzID0gKHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge30pO1xuXG5tb2R1bGVzW1wiYXBpLWZvcm1cIl0gPSAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgZWxlbWVudHMsIG1ldGhvZHMsIHNlbGVjdG9ycywgc3RhdGUsIGNvbnRhY3RJdGVtcztcblxuICAgIGVsZW1lbnRzID0ge307XG4gICAgbWV0aG9kcyA9IHt9O1xuICAgIHNlbGVjdG9ycyA9IHtcbiAgICAgICAgdmlld3BvcnQ6IFwiYm9keVwiLFxuXG4gICAgICAgIGNvbnRhaW5lcjogJy5jb250YWluZXJbdmFyaWFudD1cImFwaS1mb3JtXCJdJyxcblxuICAgICAgICBmb3JtQ29udGFpbmVyOiAnLmNvbnRhaW5lclt2YXJpYW50fj1cImFwaS1mb3JtXCJdJyxcbiAgICAgICAgZm9ybUVsZW1lbnQ6ICdbdmFyaWFudD1cImFwaS1mb3JtXCJdIGZvcm0nLFxuICAgICAgICBmb3JtRnVsbEZvcm06ICdbdmFyaWFudD1cImZ1bGwtZm9ybVwiXScsXG5cbiAgICAgICAgZm9ybUJ1dHRvbjogXCIuc3VibWl0LWJ1dHRvblwiLFxuXG4gICAgICAgIGRhdGVGaWVsZENvbnRhaW5lcjogJ1t2YXJpYW50PVwiZGF0ZVwiXScsXG5cbiAgICAgICAgcmVxdWlyZWRGaWVsZHM6IFwiaW5wdXRbZGF0YS1yZXF1aXJlZF1cIixcbiAgICAgICAgZm9ybVBvc3RlZENvbnRhaW5lcjogJ1t2YXJpYW50fj1cImN1c3RvbS1mb3JtLXBvc3RlZFwiXScsXG4gICAgICAgIGVycm9yTWVzc2FnZUNvbnRhaW5lcjogJ1t2YXJpYW50fj1cImVycm9yLW1lc3NhZ2VcIl0nLFxuICAgIH07XG4gICAgc3RhdGUgPSB7fTtcbiAgICBjb250YWN0SXRlbXMgPSB7fTtcblxuICAgIG1ldGhvZHMuZm9ybSA9IHtcbiAgICAgICAgYWRkSXRlbTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBmb3JtRWxlbWVudHMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmVsZW1lbnRzO1xuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAgICAgICAgICAgLmNhbGwoZm9ybUVsZW1lbnRzKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24oZGF0YSwgaXRlbSwgY3VycmVudEluZGV4LCBhcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm5hbWUgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpdGVtLm5hbWVdID0gSlNPTi5wYXJzZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHNcIiwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rID09PSB0cnVlICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlSXRlbTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50OiBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICAgICAgICAgIGdldFBhcmVudEVsZW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb25BdHRyaWJ1dGU6IFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZGVsZXRlZEVsZW1lbnQgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5nZXRDbG9zZXN0UGFyZW50Tm9kZShcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBmZXRjaChldmVudC5jdXJyZW50VGFyZ2V0LmFjdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rID09PSB0cnVlICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIG1ldGhvZHMuZGF0YSA9IHtcbiAgICAgICAgZ2V0Q29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHNcIikudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5vayAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5qc29uKCkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuc2V0Q29udGFjdHMoanNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3RzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTmV0d29yayByZXF1ZXN0IGZvciBwb3N0cy5qc29uIGZhaWxlZCB3aXRoIHJlc3BvbnNlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldENvbnRhY3RzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb250YWN0SXRlbXMgPSBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbnRhY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7fVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3RJdGVtcztcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93Q29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgY29udGFjdHMgPSBtZXRob2RzLmRhdGEuY29udGFjdHMoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgIFwiLmNvbnRhY3QtaXRlbXMuY29udGFpbmVyXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCBjb250YWN0c1RvSFRNTCA9IGNvbnRhY3RzLnJlZHVjZShmdW5jdGlvbihcbiAgICAgICAgICAgICAgICBuZXdDb250YWN0Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250YWN0LFxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCxcbiAgICAgICAgICAgICAgICBhcnJheVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgY29udGVudC1pdGVtcyBjb250YWluZXIgd2hlbiB0aGUgcmVkdWNlciBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWl0ZW1zIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IFwiYXJ0aWNsZVwiLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBuZXdDb250YWN0Q29udGFpbmVyID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFDb250YWN0SXRlbXNDb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDb250YWN0IGl0ZW0gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJzZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudENvbnRhaW5lckVsZW1lbnQgPSBtb2R1bGVzW1xuICAgICAgICAgICAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICAgICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhQ29udGFjdEl0ZW1Db250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXZhdGFyIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIGNvbnN0IGF2YXRhckNvbnRhaW5lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQXR0cmlidXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJhdmF0YXJcIixcbiAgICAgICAgICAgICAgICAgICAgfSwgXSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtbmFtZSBjb250YWluZXJcIixcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEF2YXRhckNvbnRhaW5lciA9IG1vZHVsZXNbXG4gICAgICAgICAgICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgICAgICAgICAgXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KGF2YXRhckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50QXZhdGFyQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAgICAgICAgICAgICAgIFwidXJsKCdcIiArIGN1cnJlbnRDb250YWN0LmZpbGVbMF0uZGF0YVVybCArIFwiJylcIjtcblxuICAgICAgICAgICAgICAgIC8vIENvbnRhY3QgTmFtZSBjb250YWluZXIgYW5kIGNoaWxkc1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgfSwgXSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtbmFtZSBjb250YWluZXJcIixcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudE5hbWVDb250YWluZXIgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBkYXRhTmFtZUNvbnRhaW5lclxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29udGFjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbnRhY3QuZmlyc3RuYW1lICsgXCIgXCIgKyBjdXJyZW50Q29udGFjdC5sYXN0bmFtZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY3VycmVudE5hbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudENvbnRhY3ROYW1lKTtcblxuICAgICAgICAgICAgICAgIC8vIENvbnRhY3QgUGhvbmUgY29udGFpbmVyIGFuZCBjaGlsZHNcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhUGhvbmVDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwicGhvbmVudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgfSwgXSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtcGhvbmUgY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBob25lQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgICAgICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVBob25lQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgIC8vIENvbnRhY3QgcGhvbmUgd29yayBsYWJlbFxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFQaG9uZUxhYmVsID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImxhYmVsXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIF0sXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LXBob25lIHVuaXRcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbCA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGRhdGFQaG9uZUxhYmVsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG5cbiAgICAgICAgICAgICAgICAvLyBDb250YWN0IHBob25lIHdvcmsgdmFsdWVcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhUGhvbmVWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQXR0cmlidXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJ2YWx1ZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1waG9uZSB1bml0XCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBob25lVmFsdWVXb3JrID0gbW9kdWxlc1tcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgICAgICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVBob25lVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsV29ya1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIndvcmtcIik7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsV29ya1VuaXQgPSBjdXJyZW50UGhvbmVMYWJlbDtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxXb3JrID0gY3VycmVudFBob25lTGFiZWxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFBob25lTGFiZWxXb3JrLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUxhYmVsV29ya1RleHQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQaG9uZUxhYmVsV29ya1VuaXQuYXBwZW5kQ2hpbGQoY3VycmVudFBob25lTGFiZWxXb3JrKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQaG9uZVZhbHVlV29ya1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbnRhY3QucGhvbmVXb3JrIHx8IFwiXCJcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFBob25lVmFsdWVXb3JrLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZVZhbHVlV29ya1RleHQpO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFBob25lQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUxhYmVsV29ya1VuaXQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQaG9uZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVWYWx1ZVdvcmspO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29udGFjdCBSZW1vdmUgY29udGFpbmVyIGFuZCBjaGlsZHNcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhUmVtb3ZlQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1kZWxldGUgY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFJlbW92ZUNvbnRhaW5lciA9IG1vZHVsZXNbXG4gICAgICAgICAgICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgICAgICAgICAgXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KGRhdGFSZW1vdmVDb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YUJ1dHRvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQXR0cmlidXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ0eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJzdWJtaXRcIixcbiAgICAgICAgICAgICAgICAgICAgfSwgXSxcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IFwiYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFJlbW92ZUJ1dHRvbiA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGRhdGFCdXR0b25cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZW1vdmVCdXR0b25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXG4gICAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlIGNvbnRhY3RcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY3VycmVudFJlbW92ZUJ1dHRvbi5hcHBlbmRDaGlsZChjdXJyZW50UmVtb3ZlQnV0dG9uVGV4dCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29udGFjdFJlbW92ZVVybCA9XG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Bvc3RzL1wiICsgY3VycmVudENvbnRhY3QuaWQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhUmVtb3ZlRm9ybSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IFwiZm9ybVwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1kZWxldGUgY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcImFjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBjdXJyZW50Q29udGFjdFJlbW92ZVVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRSZW1vdmVGb3JtID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZGF0YVJlbW92ZUZvcm1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFJlbW92ZUZvcm0uYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UmVtb3ZlRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIG1ldGhvZHMuZm9ybS5kZWxldGVJdGVtKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UmVtb3ZlQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVGb3JtKTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRBdmF0YXJDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnROYW1lQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVDb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50Q29udGFpbmVyRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0NvbnRhY3RDb250YWluZXI7XG4gICAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VDaGlsZChjb250YWN0c1RvSFRNTCwgY29udGFjdENvbnRhaW5lcik7XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgICAgICB2aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50O1xuICAgICAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgZWxlbWVudHMud2luZG93ID0gd2luZG93O1xuICAgICAgICAgICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgICAgICAgICAgZWxlbWVudHMudmlld3BvcnQgPVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICAgICAgICAgIGVsZW1lbnRzLmZvcm1Db250YWluZXIgPSBmb3VuZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMuaW5pdCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgICAgIGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XG4gICAgICAgICAgICBlbGVtZW50cy5mb3JtRWxlbWVudCA9XG4gICAgICAgICAgICAgICAgZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5mb3JtRWxlbWVudCkgfHxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGVsZW1lbnRzLmZvcm1FbGVtZW50KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50W2tleV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJtaXRcIixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5mb3JtLmFkZEl0ZW1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0cygpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtZXRob2RzLnJlbmRlciA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgICAgIGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGVsZW1lbnRzLmZvcm1FbGVtZW50KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50W2tleV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJtaXRcIixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5mb3JtLmFkZEl0ZW1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgICAgIGluaXQ6IG1ldGhvZHMuaW5pdCxcbiAgICAgICAgdW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuICAgICAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuXG4gICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcnMuY29udGFpbmVyLFxuICAgIH07XG59KSgpOyIsInZhciBtb2R1bGVzID0gKHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge30pO1xuXG5tb2R1bGVzW1wiY29udGFjdHNcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgZWxlbWVudHMsIG1ldGhvZHMsIHN0YXRlLCBjb250YWN0SXRlbXM7XG5cbiAgZWxlbWVudHMgPSB7fTtcbiAgbWV0aG9kcyA9IHt9O1xuICBzdGF0ZSA9IHt9O1xuICBjb25zdCBzZWxlY3RvcnMgPSB7XG4gICAgdmlld3BvcnQ6IFwiYm9keVwiLFxuICAgIGNvbnRhaW5lcjogJy5jb250YWluZXJbdmFyaWFudH49XCJjb250YWN0c1wiXScsXG4gICAgY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcjogXCIuY29udGFjdC1saXN0LWl0ZW1zLmNvbnRhaW5lclwiLFxuICAgIGNvbnRhY3RMaXN0SXRlbXNVbml0OiBcIi5jb250YWN0LWxpc3QtaXRlbXMudW5pdFwiLFxuICAgIGNvbnRhY3RMaXN0SXRlbXNTZWFyY2hDb250YWluZXI6IFwiLmNvbnRhY3QtbGlzdC1zZWFyY2guY29udGFpbmVyXCIsXG4gICAgY29udGFjdEl0ZW1Db250YWluZXI6IFwiLmNvbnRhY3QtaXRlbS53cmFwcGVyXCIsXG4gICAgY29udGFjdEl0ZW1Vbml0OiBcIi5jb250YWN0LWl0ZW0udW5pdFwiLFxuICAgIGNvbnRhY3RCdXR0b25Db250YWluZXI6IFwiLmNvbnRhY3QtYnV0dG9uLmNvbnRhaW5lclwiLFxuICAgIGNvbnRhY3RJdGVtV3JhcHBlcjogXCIuY29udGFjdC1pdGVtLndyYXBwZXJcIixcbiAgfTtcblxuICBjb250YWN0SXRlbXMgPSB7fTtcblxuICBtZXRob2RzLmRhdGEgPSB7XG4gICAgZ2V0RGVmYXVsdFBhcmFtc0ZvckFwaSgpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgICAgIFwiX3NvcnRcIjogXCJmaXJzdG5hbWUsbGFzdG5hbWVcIixcbiAgICAgICAgXCJfb3JkZXJcIjogXCJhc2MsYXNjXCJcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0UGFyYW1zO1xuICAgIH0sXG4gICAgZ2V0QXBpVXJsOiBmdW5jdGlvbiAoc2VhcmNoUGFyYW0gPSB7fSkge1xuICAgICAgY29uc3QgYXBpVXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0cyc7XG4gICAgICBjb25zdCB1cmxHZXRQYXJhbXMgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5nZXRVcmxQYXJhbXMoKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSBtZXRob2RzLmRhdGEuZ2V0RGVmYXVsdFBhcmFtc0ZvckFwaSgpO1xuICAgICAgY29uc3QgdXJsUGFyYW1zT2JqZWN0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcywgdXJsR2V0UGFyYW1zLCBzZWFyY2hQYXJhbSk7XG4gICAgICBsZXQgdXJsUGFyYW0gPSAnJztcbiAgICAgIE9iamVjdC5rZXlzKHVybFBhcmFtc09iamVjdCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpbmRleCkge1xuICAgICAgICBsZXQgc3VyZml4ID0gXCImXCI7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHN1cmZpeCA9IFwiP1wiXG4gICAgICAgIH1cbiAgICAgICAgdXJsUGFyYW0gKz0gc3VyZml4ICsga2V5ICsgXCI9XCIgKyB1cmxQYXJhbXNPYmplY3Rba2V5XTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYXBpVXJsICsgdXJsUGFyYW07XG4gICAgfSxcblxuICAgIGdldENvbnRhY3RzRnJvbUFwaTogZnVuY3Rpb24gKHNlYXJjaFBhcmFtID0ge30pIHtcbiAgICAgIGZldGNoKFxuICAgICAgICBtZXRob2RzLmRhdGEuZ2V0QXBpVXJsKHNlYXJjaFBhcmFtKVxuICAgICAgKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zZXRDb250YWN0cyhqc29uKTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3RzKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgIFwiTmV0d29yayByZXF1ZXN0IGZvciBwcm9kdWN0cy5qc29uIGZhaWxlZCB3aXRoIHJlc3BvbnNlIFwiICtcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzICtcbiAgICAgICAgICAgICAgXCI6IFwiICtcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzYXZlQ29udGFjdDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZm9ybSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBjb25zdCBmb3JtRWxlbWVudHMgPSBmb3JtLmVsZW1lbnRzO1xuICAgICAgY29uc3QgZm9ybUFjdGlvbiA9IGZvcm0uYWN0aW9uO1xuICAgICAgY29uc3QgZGF0YUVsZW1lbnQgPSB7XG4gICAgICAgIGVsZW1lbnQ6IGZvcm0sXG4gICAgICAgIGF0dHJpYnV0ZUtleTogXCJtZXRob2RcIixcbiAgICAgIH07XG4gICAgICBjb25zdCBmb3JtTWV0aG9kID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFxuICAgICAgICBkYXRhRWxlbWVudFxuICAgICAgKTtcblxuICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gbWV0aG9kcy5kYXRhLnNlcmlhbGl6ZShmb3JtRWxlbWVudHMpO1xuICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBmZXRjaChmb3JtQWN0aW9uLCB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiBmb3JtTWV0aG9kLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uub2sgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAoKGZvcm1NZXRob2QgPT09IFwicG9zdFwiICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAxKSB8fFxuICAgICAgICAgICAgICAgICAgKGZvcm1NZXRob2QgPT09IFwiUEFUQ0hcIiAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkpXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICAgICAgICAgIG1ldGhvZHMucGFnZS5zaG93Q29udGFjdChkYXRhKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRlbGV0ZUNvbnRhY3Q6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBjb25zdCBmb3JtQWN0aW9uID0gZGVsZXRlQnV0dG9uLmZvcm1BY3Rpb247XG4gICAgICBjb25zdCBmb3JtID0gZGVsZXRlQnV0dG9uLmZvcm07XG4gICAgICBjb25zdCBjb250YWN0SWQgPSBkZWxldGVCdXR0b24udmFsdWU7XG4gICAgICBsZXQgY29udGFjdEl0ZW1XcmFwcGVyID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtV3JhcHBlclxuICAgICAgKTtcblxuICAgICAgZmV0Y2goZm9ybUFjdGlvbiwge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJkZWxldGVcIixcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLm9rID09PSB0cnVlICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICAgICAgICBjb250YWN0SXRlbVdyYXBwZXIucmVtb3ZlQ2hpbGQoZm9ybSk7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEucmVtb3ZlQ29udGFjdEl0ZW1Gcm9tRG9tTm9kZShjb250YWN0SWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChmb3JtRWxlbWVudHMpIHtcbiAgICAgIGxldCBwb3N0RGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgICAuY2FsbChmb3JtRWxlbWVudHMpXG4gICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIGl0ZW0sIGN1cnJlbnRJbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBpdGVtLmNoZWNrZWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ubmFtZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0udmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBKU09OLnBhcnNlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGFbaXRlbS5uYW1lXSA9IFt7XG4gICAgICAgICAgICAgICAgICBkYXRhVXJsOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICB9LF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgIHJldHVybiBwb3N0RGF0YTtcbiAgICB9LFxuXG4gICAgc2V0Q29udGFjdHM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBjb250YWN0SXRlbXMgPSBkYXRhO1xuICAgIH0sXG5cbiAgICBnZXRDb250YWN0czogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNvbnRhY3RJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzRnJvbUFwaSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRhY3RJdGVtcztcbiAgICB9LFxuXG4gICAgZ2V0Q29udGFjdEJ5SWQ6IGZ1bmN0aW9uIChjb250YWN0SWQpIHtcbiAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgIH1cbiAgICAgIGxldCBjb250YWN0SXRlbTtcbiAgICAgIE9iamVjdC5rZXlzKGNvbnRhY3RJdGVtcylcbiAgICAgICAgLnNvbWUoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIGlmIChjb250YWN0SXRlbXNba2V5XS5pZCA9PSBjb250YWN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiAoY29udGFjdEl0ZW0gPSBjb250YWN0SXRlbXNba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuIGNvbnRhY3RJdGVtO1xuICAgIH0sXG4gICAgc2hvd0NvbnRhY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBjb250YWN0cyA9IG1ldGhvZHMuZGF0YS5nZXRDb250YWN0cygpO1xuICAgICAgY29uc3QgY29udGFjdEl0ZW1zID0gZWxlbWVudHMuY29udGFjdEl0ZW1zVW5pdC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIltpZCo9J2NvbnRhY3QtaXRlbS0nXVwiXG4gICAgICApO1xuXG4gICAgICBpZiAoIWVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbGV0IHByZXZDb250YWN0SWQ7XG4gICAgICBtZXRob2RzLnNldEVsZW1lbnRzKCk7XG5cbiAgICAgIE9iamVjdC5rZXlzKGNvbnRhY3RJdGVtcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGxldCBjSWQgPSBjb250YWN0SXRlbXNba2V5XS5xdWVyeVNlbGVjdG9yKCdidXR0b24nKS52YWx1ZTtcbiAgICAgICAgaWYgKGNvbnRhY3RzLnNvbWUoeCA9PiB4LmlkID09IGNJZCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1zVW5pdC5yZW1vdmVDaGlsZChjb250YWN0SXRlbXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29udGFjdHMuZm9yRWFjaChmdW5jdGlvbiAoY29udGFjdCwgaW5kZXgpIHtcbiAgICAgICAgbGV0IHByZXZFbGVtZW50O1xuICAgICAgICBsZXQgb2xkRWxlbWVudCA9IGVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBcIiNjb250YWN0LWl0ZW0tXCIgKyBjb250YWN0LmlkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKG9sZEVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbXNVbml0LnJlbW92ZUNoaWxkKG9sZEVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlbGVtZW50cy5jb250YWN0SXRlbXNVbml0LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIjY29udGFjdC1pdGVtLVwiICsgY29udGFjdC5pZFxuICAgICAgICApKSB7XG4gICAgICAgICAgaWYgKHByZXZDb250YWN0SWQpIHtcbiAgICAgICAgICAgIHByZXZFbGVtZW50ID0gZWxlbWVudHMuY29udGFjdEl0ZW1zVW5pdC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBcIiNjb250YWN0LWl0ZW0tXCIgKyBwcmV2Q29udGFjdElkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJldkVsZW1lbnQgJiYgcHJldkVsZW1lbnQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIHByZXZFbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICBtZXRob2RzLnBhZ2VDb250YWluZXIuY29udGFjdExpc3RJdGVtKGNvbnRhY3QpLFxuICAgICAgICAgICAgICBwcmV2RWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgaW5kZXggPT09IDAgJiYgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuY2hpbGROb2Rlc1swXSAhPT1cbiAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuY2hpbGROb2Rlc1swXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgbWV0aG9kcy5wYWdlQ29udGFpbmVyLmNvbnRhY3RMaXN0SXRlbShjb250YWN0KSxcbiAgICAgICAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuY2hpbGROb2Rlc1swXVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbXNVbml0LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICBtZXRob2RzLnBhZ2VDb250YWluZXIuY29udGFjdExpc3RJdGVtKGNvbnRhY3QpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgbmV3Q2hpbGQgPSBtZXRob2RzLnBhZ2VDb250YWluZXIuY29udGFjdExpc3RJdGVtKGNvbnRhY3QpO1xuICAgICAgICAgIGxldCBvbGRDaGlsZCA9IGVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiI2NvbnRhY3QtaXRlbS1cIiArIGNvbnRhY3QuaWRcbiAgICAgICAgICApO1xuICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQucmVwbGFjZUNoaWxkKG5ld0NoaWxkLCBvbGRDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2Q29udGFjdElkID0gY29udGFjdC5pZDtcbiAgICAgIH0pO1xuICAgICAgbWV0aG9kcy5lbGVtZW50V2lkdGguZml4ZWRDb250YWluZXIoKTtcbiAgICB9LFxuICAgIHNob3dDb250YWN0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb250YWN0ID0gbWV0aG9kcy5kYXRhLmdldENvbnRhY3RCeUlkKFxuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlXG4gICAgICApO1xuXG4gICAgICBtZXRob2RzLnBhZ2Uuc2hvd0NvbnRhY3QoY3VycmVudENvbnRhY3QpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ29udGFjdEl0ZW1Gcm9tRG9tTm9kZTogZnVuY3Rpb24gKGNvbnRhY3RJZCkge1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1zVW5pdFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIiNjb250YWN0LWl0ZW0tXCIgKyBjb250YWN0SWQpXG4gICAgICAgIC5yZW1vdmUoKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMucGFnZSA9IHtcbiAgICBhZGRDb250YWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gbWV0aG9kcy5wYWdlQ29udGFpbmVyLmNvbnRhY3RWaWV3QW5kRm9ybSgpO1xuICAgICAgbWV0aG9kcy5wYWdlLmNvbnRhY3RzQ29udGFpbmVyKGNvbnRlbnQpO1xuICAgIH0sXG4gICAgc2hvd0NvbnRhY3Q6IGZ1bmN0aW9uIChjdXJyZW50Q29udGFjdCkge1xuICAgICAgY29uc3QgY29udGVudCA9IG1ldGhvZHMucGFnZUNvbnRhaW5lci5jb250YWN0Vmlld0FuZEZvcm0oXG4gICAgICAgIGN1cnJlbnRDb250YWN0LFxuICAgICAgICBcInJlYWRcIlxuICAgICAgKTtcbiAgICAgIG1ldGhvZHMucGFnZS5jb250YWN0c0NvbnRhaW5lcihjb250ZW50KTtcbiAgICB9LFxuICAgIGNvbnRhY3RzQ29udGFpbmVyOiBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgY29uc3Qgb2xkV3JhcHBlciA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0SXRlbVdyYXBwZXJcbiAgICAgICk7XG4gICAgICBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGxldCByZW1vdmVkTm9kZSA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnJlbW92ZUNoaWxkKG9sZFdyYXBwZXIpO1xuICAgICAgICBsZXQgYWRkZWROb2RlID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIHJlc29sdmUocmVtb3ZlZE5vZGUpO1xuICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBtb2R1bGVzW1wiZmlsZS11cGxvYWRcIl0ubW91bnQoKTtcbiAgICAgICAgICBtb2R1bGVzW1wiZmlsZS11cGxvYWRcIl0uaW5pdCgpO1xuICAgICAgICAgIG1vZHVsZXNbXCJmaWxlLXVwbG9hZFwiXS5yZW5kZXIoKTtcbiAgICAgICAgICBtZXRob2RzLmVsZW1lbnRXaWR0aC5maXhlZENvbnRhaW5lcigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMucGFnZUNvbnRhaW5lciA9IHtcbiAgICBjb250YWN0TGlzdEl0ZW06IGZ1bmN0aW9uIChjdXJyZW50Q29udGFjdCkge1xuICAgICAgbGV0IGN1c3RvbUF2YXRhciA9XG4gICAgICAgIFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0kyTVRJaUlHaGxhV2RvZEQwaU5qRXlJaUIyYVdWM1FtOTRQU0l3SURBZ05qRXlJRFl4TWlJK1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRFd05pNDRNelFnTWpjMUxqSTJZekV5TXk0eU1ERXROelV1TkRNeUlESXhOeTQwT1RJZ05pNHlPRGNnTWpFM0xqUTVNaUEyTGpJNE4yd3RNaTR5TkNBeU5TNDNNRGxqTFRZekxqWTNOaTB4TXk0NE16Y3RPVGN1T0RneklETXhMamczTXkwNU55NDRPRE1nTXpFdU9EY3pMVE0yTGpjMU1pMDFPQzQ0TURZdE1URTNMak0yT1MwMk15NDROamt0TVRFM0xqTTJPUzAyTXk0NE5qbDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVEV3Tmk0NE16UWdNamMxTGpJMmN6RXhNQzR4TURRdE5UWXVOamN4SURFNU15NDBNamNnTmk0ek9UZGpPRE11TXpJMElEWXpMakEzTVNBd0lEQWdNQ0F3YkMweE5DNHhNamdnTWpBdU1qUTJjeTAyTnk0ek5TMDNNQzQxTXkweE56a3VNams1TFRJMkxqWTBNM29pTHo0OGNHRjBhQ0JtYVd4c1BTSWpOakV5TVRJeElpQmtQU0pOTWpJMExqSXdNeUF6TXprdU1UTnpMVEV1TVRBNUxUUTNMamt4T0NBeU9TNDVNVFl0TnpndU9UUXpiRE01TGpBNE9DQXhOeTQyTXprZ01UY3VOekU0SURFeExqSTVOaTB6Tmk0NE1UUWdNakF1TlRZNGN5MHlOaTQzTVRJZ015NHpORFl0TkRrdU9UQTRJREk1TGpRMGVpSXZQanh3WVhSb0lHWnBiR3c5SWlOQ056TXlNekVpSUdROUlrMHhNRFl1T0RNMElESTNOUzR5Tm5NeE1ESXVPRFV5TFRVMExqSTBOeUF4T1RJdU1URTRJRFl1TWpremJEWXVNak16TFRFMExqTXhPV011TURBeExqQXdNUzA1Tmk0Mk16WXROVGt1TnpBNUxURTVPQzR6TlRFZ09DNHdNalo2SWk4K1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRRNU1TNDVPQ0F4TlRFdU5USTBZeTB4TURZdU5qVTNJREUzTGpJd01TMHhNakF1TXpZMUlERXdPUzQxTURVdE1USXdMak0yTlNBeE1Ea3VOVEExYkRFNExqYzJPQ0F5TkM0NU9EbGpNelF1TURBM0xUSTVMakU0T1NBMk5DNDRNVGd0TWpNdU9EZzJJRFkwTGpneE9DMHlNeTQ0T0RZdE1URXVPVEk1TFRVNExqWTROaUF6Tmk0M056a3RNVEV3TGpZd09DQXpOaTQzTnprdE1URXdMall3T0hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqUWpjek1qTXhJaUJrUFNKTk1qY3hMalUzSURZNExqazFPR014TlM0d05UZ2dPUzR4SURNd0xqazVOeUF4Tnk0eU1TQTBOeTQyTnpnZ01qSXVPVGt0TGpnd01pMHhNaTQ1TmprdU16VXhMVEkyTGpFME9DQXhMakF5TkMwek9DNDNNaklnTVM0MU56SXRNamt1TWpjM0xUY3VOVGd4TFRRMExqYzBNaTB4Tnk0NE5DMDBNaTQwTmpVdE1UQXVNall5SURJdU1qYzNMUzQ0T1RNZ01USXVOalE1TFRNekxqVXlPQ0F5Tmk0eU9Ea3RNVEF1TWpFNElEUXVNalkzTFRFNExqTTJPU0EyTGpnek5TMHlOaTR5TVRNZ01USXVOVFkwSURndU1UWXhJRGd1TURnMklERTVMamd4SURFekxqZzFNeUF5T0M0NE56a2dNVGt1TXpRMGVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMDBOVFV1TWpBeElESTJNaTR4TXpKekxUSXdMamN4Tmkwek5DNDROVFl0TmpZdU1UQTJMVE0wTGpnMU5td3ROUzQyTmpNZ01qWXVNVFUwSURFdU5EZzBJREUyTGpnME1TQXhPUzQ1TkRFZ05pNDNOVGRqTUMwdU1EQXhJREUyTGpBME5pMHhOQzQ0T1RZZ05UQXVNelEwTFRFMExqZzVObm9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpRamN6TWpNeElpQmtQU0pOTkRreExqazRJREUxTVM0MU1qUnpMVEV3T0M0ek5EWWdNekV1TmpVMExURXdPQzR6TkRZZ01USTFMalV3TTJ3dE55NHhORFl0TXpZdU16TTBZeTR3TURFdExqQXdNU0F4Tnk0M09URXROelV1T0RNMElERXhOUzQwT1RJdE9Ea3VNVFk1ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5EUkVORFEwTWlJR1E5SWsweU5EUXVOek0ySURVeE1DNDNNVGRzTVRFdU5EQXpMVE13TGpjek0yTXRNVEl1TnpJNElEUXVPVEk0TFRNd0xqazJOU0F4TUM0ek9UUXRORFl1T1RVMElERTBMamczSURFd0xqTWdOaTR4TVRFZ01qSXVNRFlnTVRFdU5UTTNJRE0xTGpVMU1TQXhOUzQ0TmpONklpOCtQSEJoZEdnZ1ptbHNiRDBpSTBSRE0wWXpSaUlnWkQwaVRUSTNPQzQ0TVRZZ05ERTRMamcxTW1NdE5USXVOREUxSURVdU9UUTRMVGt4TGpreE5pMDVMak13TVMweE1UY3VNRFV5TFRNMExqUTROeTAwTGpBNE5TMDBMakE1TVMwM0xqWTRNUzAwTGpRM0xURXdMak0xTmkweUxqRXhNUzB4TWk0MU56UWdNVEl1TlRjMElESTNMakV4T1NBNE5DNDBOamNnTVRBd0xqVTJNaUE0TkM0ME5qY2dNeTQwT1RZZ01DQTJMalEzTWk0d09EZ2dPQzQ1T1RjdU1qVXhiREV4TGpJM055MHpNQzQwTVRjZ05pNDFOekl0TVRjdU56QXplaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkRSRU5EUTBNaUlHUTlJazB5TmpBdU9UWTJJRFEyTmk0NU56RnNMVFF1T0RJM0lERXpMakF4TTJNeE5pNDBNelF0Tmk0ek5qWWdNak11TmpRNExURXhMamd4TnlBMExqZ3lOeTB4TXk0d01UTjZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVEUxTVM0ME1EZ2dNemd5TGpJMU0yTXRNVEV1T0RVeElERXdMalEyTXkwMUxqUTFOQ0EzTlM0d05qa2dOVGN1TnpjM0lERXhNaTQyTURFZ01UVXVPVGc1TFRRdU5EYzNJRE0wTGpJeU55MDVMamswTWlBME5pNDVOVFF0TVRRdU9EZHNOQzQ0TWpjdE1UTXVNREV6WXkweUxqVXlOUzB1TVRZekxUVXVOUzB1TWpVeExUZ3VPVGszTFM0eU5URXROek11TkRReklEQXRNVEV6TGpFek5pMDNNUzQ0T1RNdE1UQXdMalUyTVMwNE5DNDBOamQ2VFRRd055NHlOek1nTlRFMkxqWTBObU11TVRVMkxqQTFNUzR6TURFdU1EZzRMalExTkM0eE16VXRMakUxTXkwdU1EVXRMakk1TnkwdU1EZzBMUzQwTlRRdExqRXpOWG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpRamN6TWpNeElpQmtQU0pOTXpZMkxqVXpOeUEwT0RVdU5UUTNZeTB4TVM0NU9UUWdNakV1TlRJeklETTJMamd3TlNBeE55NDNPU0ExTlM0Mk5EUXRNVE11T0RVZ01UZ3VPVE14TFRNMkxqTXdOeTB4Tmk0eU5qY3ROakl1TlRJMUxURTJMakkyTnkwMk1pNDFNalZzTFRNM0xqSXlPQ0EyT1M0ME1ERmpMamd3TWk0ME56UXVNek00SURJdU5URXpMVEl1TVRRNUlEWXVPVGMwZWswME1EY3VOekk0SURVeE5pNDNPREZqTFM0eE5UTXRMakEwTnkwdU1qazRMUzR3T0RRdExqUTFOQzB1TVRNMUxUTXlMall5TmkwNUxqZzROaTB6Tnk0Mk9UY2dPQzQ0T0RFdE1UVXVNelk1SURJM0xqQTJOU0F4TkM0NU5qZ2dNVEl1TVRnM0lEWXVPVGN4SURJd0xqWXdNU0EyTGprM01TQXlNQzQyTURFZ01UTXVOekExTFM0NU9EY2dNVFl1TXpVMExURXlMakE1TWlBeE5pNHpOVFF0TVRJdU1Ea3lJREV6TGpFME5TMHVPVFEySURjdU9UWXRNVFV1T0RjMklEY3VPVFl0TVRVdU9EYzJjekV5TGpJNExURTBMalUwT0MwNExqWXpNeTB4T0M0d05EUmpMUzR5TVMwdU1ETXhMUzR6T0RrdExqQTNOUzB1TlRnNUxTNHhNVEl0TVM0NE9DMHVNak00TFRNdU9EVTVMUzQyTnpFdE5TNDVOakl0TVM0ek1qbGhOaTQxTURNZ05pNDFNRE1nTUNBd0lERXRMakkzT0MwdU1EYzRlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTTNNekkzTWpnaUlHUTlJazB6T1RFdU9UQTBJRFUwTXk0M01USmpMVEl5TGpNeU9DMHhPQzR4T0RVdE1UY3VNalUzTFRNMkxqazFNU0F4TlM0ek5qa3RNamN1TURZMUxURTBMak0yTXkwMExqSTBNUzB4Tmk0Mk56VXRNVEV1TnpJMUxURTJMalkzTlMweE1TNDNNalVnTVRZdU16UXpMVEV4TGpZMUlESTJMakUyT1MweU1pNDROU0F6TVM0MU9ESXRNek11TWpJMUxURTRMamd6T1NBek1TNDJOQzAyTnk0Mk16Z2dNelV1TXpjekxUVTFMalkwTkNBeE15NDROU0F5TGpRNE55MDBMalEyTVNBeUxqazFNUzAyTGpVZ01pNHhORGt0Tmk0NU56UnNMVEl3TGpFMk5TQXpOeTQyTURSakxUY3VNREUwSURFMkxqY3lPU0F5TkM0ME5DQXhOUzR6TkRRZ05EVXVORFEzSURNMUxqWXdOU0EzTGpjNE9DQTNMalV3TlNBMExqa3dOaUF4TWk0MU15QTBMamt3TmlBeE1pNDFNM00zTGprNU9TMDRMalF4TkMwMkxqazJPUzB5TUM0MmVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMDBNRGd1TURBMklEVXhOaTQ0TlRsak1pNHhNRE11TmpVNElEUXVNRGd5SURFdU1Ea3hJRFV1T1RZeUlERXVNekk1WVRZd0xqazNJRFl3TGprM0lEQWdNQ0F4TFRVdU9UWXlMVEV1TXpJNWVpSXZQanh3WVhSb0lHOXdZV05wZEhrOUlpNHpNeUlnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRRd09DNHdNRFlnTlRFMkxqZzFPV015TGpFd015NDJOVGdnTkM0d09ESWdNUzR3T1RFZ05TNDVOaklnTVM0ek1qbGhOakF1T1RjZ05qQXVPVGNnTUNBd0lERXROUzQ1TmpJdE1TNHpNamw2SWk4K1BHY2dabWxzYkQwaUl6Y3pNamN5T0NJK1BIQmhkR2dnWkQwaVRUUXlNaTR4T0RFZ05EY3hMalk1TjJNdE5TNDFOamtnT1M0ek5URXRNVE11TnpVNElERTJMakkwTmkweU1pNHlNVGtnTWpBdU56a3hMVGM0TGpJeU5DQXpOUzR4TURFZ01UZ3VNakF6TFRNeU15NDNPRGtnTVRBdU1EUXpMVGM1TGpjeE1TQXdJREFnTGpVNE5pNHlPRGd0Tnk0Mk1qZ3ROaTQ0TWpNdE9DNHlNamN0Tnk0eE1UY3RNakF1TWpnMklEVXlMakF6TlMweU1DNHlPRFlnTlRJdU1ETTFjeTA1TGpnMU9DQXlPQzQ1TVRRdE1UTXVNelUzSURNNUxqWXhPR010TkM0eE5EY3RNaTR3TVRndE5TNDFORGd0Tmk0d05UTXRNaTR4T1RZdE1USXVNRFl4SURJdU5EZzNMVFF1TkRZeElESXVPVFV4TFRZdU5TQXlMakUwT1MwMkxqazNOR3d0TWpBdU1UWTFJRE0zTGpZd05HTXROeTR3TVRRZ01UWXVOekk1SURJMExqUTBJREUxTGpNME5DQTBOUzQwTkRjZ016VXVOakExSURjdU56ZzRJRGN1TlRBMUlEUXVPVEEySURFeUxqVXpJRFF1T1RBMklERXlMalV6Y3pjdU9UazNMVGd1TkRFMExUWXVPVGN4TFRJd0xqWXdNV010TWpJdU16STRMVEU0TGpFNE5TMHhOeTR5TlRjdE16WXVPVFV4SURFMUxqTTJPUzB5Tnk0d05qVXRNVFF1TXpZekxUUXVNalF4TFRFMkxqWTNOUzB4TVM0M01qVXRNVFl1TmpjMUxURXhMamN5TlNBeE5pNHpORE10TVRFdU5qUTVJREkyTGpFM0xUSXlMamcwT0NBek1TNDFPRE10TXpNdU1qSXplazAwTURrdU9EWXpJRFV6T0M0d01qRnpOeTQ0TnpZZ05DNHpPRE1nTlM0ek5qWWdNVFF1TW1NMExqTXdPQzB1TWpjMklEVXVPVFF5TFRJdU1EZ2dOUzQ1TkRJdE1pNHdPQzB4TGpZM01TMHhNQzQyTnpNdE1URXVNekE0TFRFeUxqRXlMVEV4TGpNd09DMHhNaTR4TW5wTk5ERTJMamN6TXlBMU1qZ3VOREkyY3pRdU56QTRJREV1TkRNMUlEWXVORFUySURjdU9URTVZekl1TURNdE1TNDFPVGdnTWk0ME5qTXROQzR3TWpJZ01pNDBOak10TkM0d01qSXRNeTR5T1RNdE15NDJOaTA0TGpreE9TMHpMamc1TnkwNExqa3hPUzB6TGpnNU4zb2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJMEkzTXpJek1TSWdaRDBpVFRRek5pNDJNVGtnTXpBNExqRTBPV010TVRBdU16ZzRMVEV6TGprek5DMHlOUzQ0TURjdE1qUXVOekUyTFRNd0xqUXdOUzB4T0M0M05UZ3ROQzQ0T0RNZ05pNHpORFF1TWpjNUlETXdMall3TWlBeE1DNDBPVFFnTlRJdU1qVTNJREl5TGpJek5TQTBOeTR4TnpRZ09TNDFNRFVnTmpNdU1qTTNJRGt1TlRBMUlEWXpMakl6TnlBeE15NDBOamN0TGpZMk5DQXhOaTQ0TlMweE1pNDBNVFFnTVRZdU9EVXRNVEl1TkRFMElERTBMalk0T0MwdU56STBJREV4TGpReE1pMHhOaTQzTVRrZ01URXVOREV5TFRFMkxqY3hPWE14TlM0M01EY3RPUzQ1TXkweE1TNHhOelF0TlRjdU1qSXpZVEV4T0M0Mk5UUWdNVEU0TGpZMU5DQXdJREFnTUMwMkxqWTRNaTB4TUM0ek9Ib2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqZENOMEk0SWlCa1BTSk5NemN4TGpReU5DQXlPRFF1TmpJMFl6SXVORGszTFRNdU1qSWdPUzQzT0RrdE1URXVNRGs1SURFMExqRXdNeTB4TlM0M01EY3RNVEl1T0RRM0xUWXVOemt5TFRJeUxqSXlNaTA1TGpZMU5TMHlNaTR5TWpJdE9TNDJOVFZzTGpBMU5pQXpNQzQ0T0RGek1pNDRORElnTWk0NE1ERWdOeTR5TnpFZ055NDFNRGxqTFRFdU1EY3hMVFV1T1RRdE1TNDFNelV0TVRBdU1ETTBMamM1TWkweE15NHdNamg2SWk4K1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRReE9DNHdPRFFnTXpReExqVTNOMk10T1M0M09ETXRNakF1TnpNNExURTFMalF3T1MwME1TNHlNVEl0TVRFdU1UWXlMVFE0TGpBMU5DQTBMak0xTkMwM0xqQXhNU0F4T0M0NE16Y3VNRFkxSURJNUxqWTVOeUF4TkM0Mk1qWXRNVFV1TXpVNUxUSXhMalExTlMwek5TNDROQzB6TlM0ek1qTXROVEV1TXpBeUxUUXpMalE0TnkwMExqTXhNU0EwTGpZd05TMHhNUzQyTURZZ01USXVORGczTFRFMExqRXdOQ0F4TlM0M01ERXRNaTR6TXlBeUxqazVPQzB4TGpnMk55QTNMakE1TlMwdU56a3lJREV6TGpBeU9DQXhOQzR4TWpRZ01UUXVPVGs1SURRMExqVTBPQ0EwT1M0MU1qa2dOVEV1T0RJMUlEYzFMamswT1NBMkxqUXpPQ0F5TXk0ek16Z2dNeTQ1TmpZZ016VXVOVFExSURNdU9UWTJJRE0xTGpVME5YTXhOQzR4TVMweE5pNHhNelV0T0M0eE1qZ3ROak11TXpBNGVpSXZQanh3WVhSb0lHWnBiR3c5SWlORVF6TkdNMFlpSUdROUlrMHpNelV1TnpBeklERTBPQzQzTmpSakxURXVPRFl0TWpjdU1USTFJRGN1TVRNMkxUVXpMamszT0NBeE5DNHhPVE10TnprdU1qY3pRek0yTUM0MU16SWdNekV1TXpjM0lETTFNeUE0TGpNeU55QXpNemd1T0RJZ09DNHpNamRqTFRFMExqRTRNaUF3TFRRdU9EYzBJREUyTGpNNU9TMDFNUzQ0TlRjZ01qUXVPREU1TFRJNUxqRXlOQ0ExTGpJeE9TMDBOUzQyTlRFZ015NDVPVEV0TnpndU5EUTVJRFF5TGpFd09DMHpNaTQzT1RnZ016Z3VNVEUwTFRVNExqVXdOeUEzTXk0eE1qY3ROVGd1TlRBM0lERXhOUzR5TXpKek1qa3VNalV5SURnMUxqQTVPU0EwT0M0ek1EY2dPRFV1TURrNVl6RXdMakUyT0NBd0lERTBMakF6TkMwNExqQTNOaUF5TVM0ek5EVXRNVGt1TURReklERTBMams1T1MweU15NDNNallnTkRjdU1UTTJMVE16TGpRM05TQTFNeTR4TVRrdE5EY3VPRGM0SURBZ01DMHlMamc0TlNBeE1TNHlORE10TWpFdU9ETXhJREkwTGpjd015MHhNQzQ0TWprZ055NDJPVGN0TVRVdU9Ua3lJREU0TGpRMU9DMHhPQzQwTnprZ01qWXVOemN4SURrdU5UQTBJREV1TURRMklETXhMamM0TXkweE5TNDRNRGNnTkRndU56TXRNekl1TnpVMElEZ3VOemt0T0M0M09EY2dNVFV1TXpVNUxURXhMamN4TXlBeE9TNDNOek10T1M0NE1EVWdOUzR6TmpZdE1UUXVOekkySURndU1UYzVMVE13TGpnMk1pQXhOeTQwTlRndE5EVXVOekEzSURRdU1URTBMVGd1TWpFNUlEZ3VNalEyTFRFNUxqVTROeUF4Tnk0eU56UXRNak11TVRBNGVpSXZQanh3WVhSb0lHWnBiR3c5SWlORVF6TkdNMFlpSUdROUlrMHpORGd1TlRZNElERTVNQzR3TkRWakxUZ3VNakEwTFRFekxqY3hOeTB4TVM0NU1qSXRNamN1TlRNeUxURXlMamcyTlMwME1TNHlPREV0T1M0d01qZ2dNeTQxTWpFdE1UTXVNVFlnTVRRdU9EZzVMVEUzTGpJM01pQXlNeTR4TURrdE9TNHlOemtnTVRRdU9EUTFMVEV5TGpBNU1pQXpNQzQ1T0RFdE1UY3VORFU0SURRMUxqY3dOeUEzTGpRME5TQXpMakl3T0NBNExqYzFNaUF5TUM0eE56RWdOQzR4TmpNZ05EWXVNRFF0Tnk0ek1UUWdOREV1TWpFNExUUXlMalUxTXlBNE1TNHhNRFV0TkRJdU5UVXpJRGd4TGpFd05YTXRNamN1TlRBeElEYzFMalkwTFRJeUxqSTROU0F4TWpndU16TTViREl5TGpJNE5TMDBNUzQwTWpsek5URXVPRFU1TFRZdU9ERXlJRFkzTGpneE15MDROUzR3T0Rkak1UUXVORFEwTFRjd0xqZzJNU0ExTUM0eE5ERXROemt1TWpBMElEY3lMakExT1MwME5pNDJNRE10TVRNdU5EZzFMVFV3TGpBd05TMHpOeTR5TnpjdE9ESXVNVEl0TlRNdU9EZzNMVEV3T1M0NWVpSXZQanh3WVhSb0lHWnBiR3c5SWlORlJUWkJOa0VpSUdROUlrMDBNVEl1T0RNM0lETTRNeTR5T0Rkak1DMHpNaTQyTXpVdE5DNHdOak10TlRrdU9UUXhMVEV3TGpNNE1pMDRNeTR6TkRJdE1qRXVNVGs0TFRNeUxqZ3pNeTAyTXk0Mk9URXRNalF1TWpVNExUYzRMakV6TmlBME5pNDJNRE10TVRVdU9UVTBJRGM0TGpJM05DMDJNUzQzTXpZZ09EVXVNRGczTFRZeExqY3pOaUE0TlM0d09EZHNMVEl5TGpJNE5TQTBNUzQwTWpsakxqZzJNU0E0TGpZNE1TQXlMall5TlNBeE5pNDNNVGtnTlM0MU1qWWdNak11TnpFM0lEUXVOak0ySURFdU1EZ2dPUzQzTkRrZ01pNDFNalFnTVRVdU5ETTNJRFF1TkRBM0lEYzNMamsyTnlBeU5TNDNPRGNnTVRVeExqVTNOaTB6TWk0NE1ERWdNVFV4TGpVM05pMHhNVGN1T1RBeGVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMDBNVEV1TURBM0lEUXhNUzR4TkRKak1TNHhPVFF0T0M0NE1qRWdNUzQ0TXkweE9DNHhNRFlnTVM0NE15MHlOeTQ0TlRRZ01DQXpMamM0TkMwdU1qQXhJRGN1TkRrekxTNDBOemtnTVRFdU1UY3hMall4TnkweE1pNDNNekV1TkRFekxUSTJMakF4TXkwdU5qRTNMVE01TGpjeU1pQTBMams1TXlBeE5USXVOVGc0TFRFeU5pNDFOU0F4TkRFdU1EVTNMVEV5Tmk0MU5TQXhOREV1TURVM2JDMDVMamcwTWlBNUxqRTBOV0V4TWpRdU5UazRJREV5TkM0MU9UZ2dNQ0F3SURFdE1UUXVNRGczTFRNdU56VmpMVFV1TmpnNExURXVPRGd6TFRFd0xqZ3dNUzB6TGpNeU55MHhOUzQwTXpjdE5DNDBNRGNnTlM0eE56SWdNVEl1TkRjeElERTBMakF3T1NBeU1TNDFOemNnTWpndU1EWXlJREkwTGpjNU1XRXhNVEV1TkRFeUlERXhNUzQwTVRJZ01DQXdJREFnTWpRdU56ZzRJREl1T0RFemJDNHdNelF1TURJMFl5NHhOeklnTUNBdU16STVMUzR3TVRNdU5UQXhMUzR3TVRNdU9UZ3pMUzR3TURNZ01TNDVOamN0TGpBME5DQXlMamswT0MwdU1EYzRJRFk0TGpRek5pMHhMalV5TmlBeE1ERXVNelV6TFRRNExqQXhNeUF4TURndU9EUTVMVEV4TXk0eE56ZDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6VXlOVEkxTWlJZ1pEMGlUVEl4Tmk0Mk1qSWdNVGt3TGprMk9XTTJMamN6TlMweExqSTNPQ0F4TkM0NE1EVXRPUzQwTXpZZ01URXVPRFl6TFRFNExqY3lOeTB5TGprME1TMDVMakk1TWkweE5DNDVOVEl0TVM0ME1UWXRNVFl1TkRReklEY3VOekE1TFRFdU5ESXlJRGd1TmprM0lESXVNRGt5SURFeExqUTVOeUEwTGpVNElERXhMakF4T0hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqUmtaR0lpQmtQU0pOTWpJeExqVXhNaUF4TnprdU5ETTRZekV1TkRjNUxqVXhNU0F6TGpFMU1TMHVOemMzSURNdU56RTRMVEl1T0RjNUxqVTNMVEl1TVRBeUxTNHhOamt0TkM0eU1UTXRNUzQyTkRndE5DNDNNakV0TVM0ME9URXRMalV3TnkwekxqRTFOQzQzT0RZdE15NDNNeUF5TGpnNE5TMHVOVFkwSURJdU1Ea3pMakUzTVNBMExqSXhNU0F4TGpZMklEUXVOekUxZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWsweU9Ua3VPREUySURJM055NHdNamR6TFRVdU5qVXhMVEV5TGpJNU9DQXhNUzQ1TmpjdE1qTXVNRGs1WXpFM0xqWXhOeTB4TUM0NE1EVWdNVGt1TVRFeElEUXVNekU1SURFNUxqRXhNU0EwTGpNeE9TSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMDBPVEV1T1RnZ01UVXhMalV5TkhNdE5qQXVNRGcxSURJd0xqUTNPQzA1TVM0MU5UVWdPREl1T1RBMmJDMDFMakU1TkMwM0xqRTFOWE15TWk0NU9EUXROVE11TWpFNUlEazJMamMwT1MwM05TNDNOVEY2SWk4K1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRJek5TNHpNemtnTlRVd0xqSTRNV010TGpneklESTBMamt6TXlBek15NHlOamdnTkRRdU56UXlJREUxTGpVd015QTFNeTR5T0RVZ01UWXVOakl5SURJdU1qRTFJREl4TGprMExUY3VOVE0zSURJeExqazBMVGN1TlRNM0lESXlMall3TWlBekxqTXlOeUF5TVM0ME9UTXRNVFl1TVRjM0lESXhMalE1TXkweE5pNHhOemNnTVRBdU5qQTBMVGN1TURFeElEa3VOamd6TFRFMkxqTXpNeTR3TWpJdE1qVXVOVGN4TFRJeExqa3pOQzB4T0M0eE5ETXROVGd1TVRJNExUSTRMamcwTVMwMU9DNDVOVGd0TkhwTk16QXdMakEzTnlBME5qTXVNRGN6WXk0ek1qa3RNakl1TVRnNExURXlMakl5Tnkwek9TNDRPVFl0TVRJdU1qSTNMVE01TGpnNU5uTXhOeTR5T0RZdE1URXpMalEyTVMwME5DNDNOalV0TmpRdU1qWTFZeTAyTWk0d05UTWdORGt1TVRrM0xUVXlMamt3T1NBeE1UVXVOakl0TXprdU1qSXpJREV6Tnk0ek9UVWdNak11TVRVMElETXpMalUzTlNBNE5DNDFNVEVnTVRndU1qZzRJRGsyTGpJeE5TMHpNeTR5TXpSNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRUSTROUzR4T1NBME9Ua3VPRFZqTVRBdU9UZzJMVEV5TGpJeE55QXhOQzQzTVRRdE1qVXVNVEUySURFMExqZzROaTB6Tmk0M056WXRNVEV1TnpBMElEVXhMalV5TVMwM01pNHhOVFlnTmpRdU1EVXlMVGsyTGpJeE5DQXpNeTQyTWpVZ01UWXVOVEE1SURJMkxqSTJNU0F6T0M0NU9UZ2dNakF1T0RneUlESTRMamd3TnlBek9TNDNNVGd0TVRBdU1UazNJREU0TGpnMExqWTJOeUF6Tnk0d01USWdNVFF1T0RRNElEUTRMalV6TTNNekxqTXlOQ0F4T0M0Mk1UY2dNeTR6TWpRZ01UZ3VOakUzWXpJM0xqazNOQzA1TGpBNE5TMDVMalV5T1MweU5TNDRNRE10T1M0MU1qa3ROVEF1TnpRNElEQXRNVGt1TlNBeU9TNDVNUzB4TkM0eU1Ea2dOVEl1T1RnMElERXVORFl6TFRJdU9EWXRNaTQzTXpFdE5pNDBORE10TlM0ME5UY3RNVEF1TnpjdE9DNHhNVE10TVRndU9UUTBMVEV4TGpZek5TMHlPQzQ1TVRrdE1USXVNams1SURFdU5qWTBMVFEyTGpNeE9Yb2lMejQ4Y0dGMGFDQm1hV3hzUFNJak56TXlOekk0SWlCa1BTSk5NamN5TGpjNE1pQTFPVFl1TURJNVl6Z3VNRGc0TFRFd0xqRTVJREV1TWpFMkxURTRMakEySURFdU1qRTJMVEU0TGpBMmN6RXdMakV4TWlBMExqRXdNU0EzTGprNU1TQXhPQzR3Tm1Nd0lEQXROQ0F5TGpFd09TMDVMakl3TnlBd1RUSTVOQzR5TnpVZ05UYzVMamcxTTJNd0xURXhMakk1T1MwM0xqYzFOaTB4TkM0d056RXROeTQzTlRZdE1UUXVNRGN4Y3pndU5UTTNMak13TkNBeE1pNHhPRGtnTVRBdU1qbGpNQzB1TURBeExURXVPREkzSURJdU56STRMVFF1TkRNeklETXVOemd4SWk4K1BHYytQSEJoZEdnZ1ptbHNiRDBpSTBSRE0wWXpSaUlnWkQwaVRUTXpPQzQ0TWlBNExqTXlPR010TVRRdU1UZ3lJREF0TkM0NE56UWdNVFl1TXprNUxUVXhMamcxTnlBeU5DNDRNVGt0TWk0ek16TXVOREUzTFRRdU5UYzNMamM1TFRZdU56WXpJREV1TVRVZ01qVXVOalEwTFRNdU9UWXpJREl5TGpZNElETXVPVEEySURRdU16SXpJREV5TGpneE5TMHlNeTR3TURJZ01URXVNVFU0TFRNMkxqWXlNeUF4TGpBNE1TMDJPQzQ1TkRVZ05EWXVOelExTFRNeUxqTXlOU0EwTlM0Mk5qTXRORE11TVRJZ09USXVORGs1TFRJekxqa3dPQ0F4TWprdU9EYzJJREl3TGpBME5TQXpPQzQ1T1RFZ016TXVOamtnTVRrdU1USTRJRFV6TGpBeU1pQTRMamMwYkMwdU1EQTJMakF3Tm1NeE1pNDFNamN0T0M0M05qSWdNalF1TmpRM0xURTFMalV4T1NBeU9DNHdPVE10TWpNdU9ERXpJREFnTUMweUxqZzROU0F4TVM0eU5ETXRNakV1T0RNeElESTBMamN3TXkweE1DNDRNamtnTnk0Mk9UY3RNVFV1T1RreUlERTRMalExT0MweE9DNDBOemtnTWpZdU56Y3hJRGt1TlRBMElERXVNRFEySURNeExqYzRNeTB4TlM0NE1EY2dORGd1TnpNdE16SXVOelUwSURndU56a3RPQzQzT0RjZ01UVXVNelU1TFRFeExqY3hNeUF4T1M0M056TXRPUzQ0TURVZ05TNHpOall0TVRRdU56STJJRGd1TVRjNUxUTXdMamcyTWlBeE55NDBOVGd0TkRVdU56QTNJRFF1TVRFeUxUZ3VNaklnT0M0eU5EUXRNVGt1TlRnNElERTNMakkzTWkweU15NHhNRGt0TVM0NE5pMHlOeTR4TWpVZ055NHhNell0TlRNdU9UYzRJREUwTGpFNU15MDNPUzR5TnpNZ01UQXVOak0zTFRNNExqRXhOU0F6TGpFd05pMDJNUzR4TmpRdE1URXVNRGMxTFRZeExqRTJOSG9pTHo0OEwyYytQSEJoZEdnZ1ptbHNiRDBpSXpZeE1qRXlNU0lnWkQwaVRUSTFNUzQzSURJek5DNHhNVGRqTVRndU9UUTJMVEV6TGpRMk1TQXlNUzR3TnprdE1qVXVORFV5SURJeExqQTNPUzB5TlM0ME5USXROUzQ1T0RNZ01UUXVOREF6TFRNNExqRXlJREkwTGpFMU1pMDFNeTR4TVRrZ05EY3VPRGM0SURNdU9EazBJREl1T0RZZ09DNHlNRFFnTXk0NU1qVWdNVEl1T0RBNUlETXVOVGsySURJdU5EZzRMVGd1TXpFeklEZ3VOREF5TFRFNExqTXlOU0F4T1M0eU16RXRNall1TURJeWVpSXZQanh3WVhSb0lHWnBiR3c5SW01dmJtVWlJR1E5SWsweU5UQXVPVFE0SURJek15NHpOamhqTVRndU9UUTJMVEV6TGpRMklESXhMamd6TVMweU5DNDNNRE1nTWpFdU9ETXhMVEkwTGpjd015MHpMakEyTXlBM0xqTTNNUzB4TWk0NU56SWdNVE11TlRJMkxUSXpMamt6TXlBeU1DNDVOVGRoTVRFdU5EWTNJREV4TGpRMk55QXdJREFnTUNBeExqZzVOU0F6TGpreE5tTXVNRGMyTFM0d05UY3VNVE0xTFM0eE1UWXVNakEzTFM0eE4zb2lMejQ4Wno0OGNHRjBhQ0JtYVd4c1BTSWpOVUV4UkRGQklpQmtQU0pOTWpFMUxqa3lPU0F5TURJdU5EVTVZell1TmpjMkxURXVOVFlnTVRRdU16azNMVEV3TGpBME5pQXhNUzR3TmpjdE1Ua3VNakEyTFRNdU16TXpMVGt1TVRZdE1UVXVNREF4TFM0M09Ea3RNVFl1TVRBM0lEZ3VNemsyTFRFdU1EVTVJRGd1TnpRMklESXVOVGMxSURFeExqTTVOaUExTGpBMElERXdMamd4ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5HUmtZaUlHUTlJazB5TWpBdU16STRJREU1TUM0M016ZGpNUzQxTGpRMU1TQXpMakV4TnkwdU9UQTVJRE11TlRrekxUTXVNRE0yTGpRNE5pMHlMakV4T0MwdU16UTBMVFF1TWpBeExURXVPRFF5TFRRdU5qUXlMVEV1TlRFdExqUTBOUzB6TGpFeUxqa3hNUzB6TGpZd05TQXpMakF6TlMwdU5EYzNJREl1TVRFMUxqTTBOeUEwTGpJd05TQXhMamcxTkNBMExqWTBNM29pTHo0OEwyYytQSEJoZEdnZ1ptbHNiRDBpSTBSRE0wWXpSaUlnWkQwaVRUTXdPQzQwTVRnZ01qWTBMams0T1hNdE5EZ3VOalF5SURJNUxqUXpOQzAyTWk0d01ESWdNVEV6TGpNMk5XTXROUzQ0TWlBek5pNDFNekVnTVRBdU1qY3lJRFF3TGpjM05pQXhNQzR5TnpJZ05EQXVOemMyY3pFeUxqZ3hPQ0F4T0M0eU16RWdNekF1TkRJZ01USXVPRFZqTUNBd0lEa3VOVFU0SURFd0xqUTBOQ0F6TUM0ek56UXVNVEkySURBZ01DMHlNeTQzTWprdE1UQXVPVGc1TFRNd0xqTTRNeTAwT0M0Mk5ETXROaTQyTmkwek55NDJOVGNnTVRBdU1qRTVMVGM0TGpVM09DQXlNaTR4TlRRdE9USXVOalk0SURFekxqTTJNaTB4TlM0M056a2dNVEl1TXpneUxUTTBMalkyTlMwdU9ETTFMVEkxTGpnd05ub2lMejQ4Wno0OGNHRjBhQ0JtYVd4c1BTSWpRVFZCTlVFMUlpQmtQU0pOTXpBeExqa3dPU0EwTWpndU9UUXhiQzB1TnpNMkxTNDFNalpqTGpRM015NHpOak11TnpNMkxqVXlOaTQzTXpZdU5USTJlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTTNNekkzTWpnaUlHUTlJazB5T1RBdU16Z3hJRE00TWk0d01USmpMVFV1TlRNNUxUTXhMak0wTVNBeUxqazJOaTAyTXk0NU1EY2dNVEl1T0RVMkxUZ3lMakE0T1MwME1TNHpNVFVnTnpJdU56STVMVEV3TGpNNE1TQXhNakl1TURRMUxURXVNekk0SURFeU9TNHdNVGtnTUNBd0xURTBMamd6TmlBMExqazROaTB5TWk0ek5qY3RNVEF1TURneElEQWdNQ0F1TlRJZ05TNDNNVFFnTXk0Mk5UWWdPUzQxTWpZZ01DQXdMVEl5TGpZd05DQXlMak0wTXkweU9DNHdPVE10TVRrdU1qRTFJREFnTUMweUxqa3dNU0F4TUM0NU16WWdPQzR5TlRRZ01UZ3VOallnTVRFdU5USTRJRGN1T1RjMklESXpMalE1TkNBMUxqSXdOaUF5TXk0ME9UUWdOUzR5TURaek1UVXVOVEkxSURFeExqYzJOeUF6TWk0MU56TXRMamsxT0dNdU1EQXhJREF0TWpJdU16ZzRMVEV5TGpReE1TMHlPUzR3TkRVdE5UQXVNRFk0ZWlJdlBqd3ZaejQ4Y0dGMGFDQm1hV3hzUFNJak56TXlOekk0SWlCa1BTSk5Nemt6TGpFNE15QXlOekF1T1RNMGN6Y3VPVEV0TVRBdU56UTRMVFV1T0RFM0xURTBMakl3T1dNd0lEQXRPQzQwTlRFdE1qQXVPRGcxTFRFM0xqZ3dOUzB6TkM0NE5qTXRMakF5TWkwdU1ESTRMUzR3TkRndExqQTJMUzR3TmprdExqQTVNUzA1TGpnNU15MHhOaTR5T1RVdE1qRXVNVE16TFRNekxqQTVPUzB5Tnk0eE9EVXRORGt1TlRFekxUa3VNekUyTFRJNUxqRTFPQ0EwTGpnek55MHpNQzQxT1RNZ055NDJPVE10TXpndU1EQXhJRFF1TkRjM0xURXhMalU0TkMweE1pNDBNaTAyTGprek9DMDRMakF5T0Mwek1TNDNPVElnTVM0NU56RXRPQzR3TkRjZ05DNHpNekl0TVRZdU1EazFJRFl1T0RFNUxUSTBMakV4TVNBNUxqTXpOUzB6TUM0d09ESWdNVE11T1RZeUxUY3dMakF5TlMwNUxqazNNUzAzTUM0d01qVWdNQ0F3SURFM0xqRTNOaUF5TGpNME5pQTJMakl3TlNBek5pNHdOemd0TVRBdU9UY2dNek11TnpJNUxUVXpMakU0TlNBMU5pNDVPVGN0TkRFdU5UUTNJREV3TUM0NE56VWdNVEF1TVRVNUlETTRMak15TkNBeUxqSXhNU0ExT0M0NE16WXRNakV1TlRVeUlEZ3hMak01TVNBd0lEQWdNamt1TXpZMUxUSTRMakl3TmlBeU5TNDFNRElnTVRrdU56WTNJRFl1T0RVM0xUY3VPRFVnTnk0MU5EWXRNakF1TXpZNElEY3VNVFUxTFRNeUxqTXhMakEwTFRFNExqY3dPQ0E0TGpBMU55MHpPUzQ1TnpFZ016TXVORGcyTFRFeExqUTNPQzQyTWpFdU56QTFJREV1TWpRMElERXVOREEzSURFdU9EVTRJREl1TVRJM0xqRXdNeTR4TWpJdU1qRXVNalUwTGpNeE5pNHpOemtnTWpndU1UZzNJRE16TGpJNU15QTBOeTR3TmprZ056Z3VORFl5SURVeUxqSXhJRGswTGpjNE9TMHVOamN5TFRNdU1qRXpMVFl1TURjMUxUSXhMalUxTVMwNUxqSTNMVEk1TGpBeE0zcE5Namd3TGpNNU1pQTBPVGN1TXpJeVl6STNMak0wTVMweU5DNDRNamtnTVRJdU1EVXhMVFl6TGpRNU55QXhNaTR3TlRFdE5qTXVORGszYURZdU1EY3hjekl3TGpNd01pQXpNeTR4TkRZZ01TNDFOak1nTnpZdU9Ea3lJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF3TXk0d056Z2dNalE0TGpjNU0yTXRNalF1TWpVNExUZ3VOVFF5TFRFeUxqSXpNaTB6T0M0ME9EWXRNVEl1TWpNeUxUTTRMalE0TmkweE1DNDVPRFVnTVRRdU1UWXlMVEUxTGpReE5TQXpNUzR3TlMweE5TNDBNVFVnTXpFdU1EVnNNVEF1TURrMklERTBMamMwT0hNeE1pNHdPRFlnT0M0eE5UUWdNVEl1T0RFZ055NDBNamRqTGpjeU15MHVOekkzSURJNUxUWXVNVGt6SURRdU56UXhMVEUwTGpjek9Yb2lMejQ4Y0dGMGFDQm1hV3hzUFNJak5qRXlNVEl4SWlCa1BTSk5NalUwTGpFd09TQXlOakF1TVRrMmN6SXlMall3TnlBMkxqRXhOU0F6T1M0d09UUWdNVGN1TmpOc0xUSTJMalF4TnlBeUxqazFNWE10T1M0NU1qUXROeTQwTnpVdE1UQXVNekkxTFRjdU9EYzFZeTB1TkMwdU5EQXlMVEl1TXpVeUxURXlMamN3TmkweUxqTTFNaTB4TWk0M01EWjZUVFExTlM0eU1ERWdNall5TGpFek1uTXRNVEF1TlRFekxUUTJMakV6TnkwMU5TNHlNalF0TkRNdU16WXhZekFnTUNBeU55NHhOalV0TkRrdU9EWXhJRGt5TGpBd015MDJOeTR5TkRjZ01DQXdMVFEyTGpBd01TQTFNUzR3TkRVdE16WXVOemM1SURFeE1DNDJNRGg2SWk4K1BIQmhkR2dnWm1sc2JEMGlJell4TWpFeU1TSWdaRDBpVFRNNE9DNDBPQ0F5TlRBdU1ETTNjeTR5TWpZdE1qQXVOelkySURFNUxqWTJMVFF6TGpJd09Hd3hOUzQwTWpVdE1pNDNPVFFnTlM0eU1UTWdNaTQzT1RSekxUTXdMalUwT1NBeE5pNDVPRFV0TkRBdU1qazRJRFF6TGpJd09Ib2lMejQ4TDNOMlp6ND1cIjtcblxuICAgICAgbGV0IGNvbnRhY3RMaXN0SXRlbSA9XG4gICAgICAgIGBcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJjb250YWN0LWl0ZW0tJHtjdXJyZW50Q29udGFjdC5pZH1cIiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHdyYXBwZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuaWR9XCIgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSBjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxmaWd1cmUgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1hdmF0YXJcIj5cbiAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImltYWdlXCIgc3JjPVwiJHtjdXJyZW50Q29udGFjdC5maWxlWzBdLmRhdGFVcmxcbiAgICAgICAgICA/IGN1cnJlbnRDb250YWN0LmZpbGVbMF0uZGF0YVVybFxuICAgICAgICAgIDogY3VzdG9tQXZhdGFyfSAgXCIgLz5cbiAgICAgICAgICAgIDwvZmlndXJlPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLW5hbWVcIiBkYXRhLXRpdGxlPVwiJHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lfVwiPlxuICAgICAgICAgICAgICA8c3Bhbj4ke2N1cnJlbnRDb250YWN0LmZpcnN0bmFtZSArIFwiIFwiICsgY3VycmVudENvbnRhY3QubGFzdG5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAke2N1cnJlbnRDb250YWN0LmZhdm9yaXRlc1xuICAgICAgICAgID8gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWZhdm9yaXRlXCI+XG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMzc2IDM3NlwiPjxzdHlsZT4uYXtmaWxsOiNDMzkyMTU7fTwvc3R5bGU+PHBhdGggZD1cIk0xODggMTdsNjMgMTAzIDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDYgLTExMSA0NiAxMC0xMjAgLTc4LTkyIDExNy0yOEwxODggMTd6XCIgZmlsbD1cIiNGRkU2M0NcIi8+PHBhdGggZD1cIk0yMjQgMTk0bC0zNi0xNjEgNjMgODcgMTE3IDI4IC03OCA5MiAxMCAxMjAgLTExMS00NkwyMjQgMTk0elwiIGZpbGw9XCIjRkRENzJFXCIvPjxwYXRoIGQ9XCJNMjk5IDM2N2MtMSAwLTIgMC0zLTFsLTEwOC00NSAtMTA4IDQ1Yy0yIDEtNiAxLTgtMSAtMi0yLTQtNC0zLTdsOS0xMTcgLTc2LTg5Yy0yLTItMi01LTItOCAxLTMgMy01IDYtNWwxMTQtMjcgNjEtMTAwYzItMiA0LTQgNy00bDAgMGMzIDAgNSAyIDcgNGw2MSAxMDAgMTE0IDI3YzMgMSA1IDMgNiA1IDEgMyAwIDYtMiA4bC03NiA4OSA5IDExN2MwIDMtMSA2LTMgN0MzMDIgMzY3IDMwMCAzNjcgMjk5IDM2N3pNMTg4IDMwNWMxIDAgMiAwIDMgMWw5OSA0MSAtOC0xMDdjMC0yIDAtNCAyLTZsNzAtODIgLTEwNC0yNGMtMiAwLTQtMi01LTRsLTU2LTkyIC01NiA5MWMtMSAyLTMgMy01IDRsLTEwNCAyNSA3MCA4MmMxIDIgMiA0IDIgNmwtOCAxMDcgOTktNDFDMTg2IDMwNSAxODYgMzA1IDE4OCAzMDV6TTEyNSAxMjBMMTI1IDEyMCAxMjUgMTIwelwiIGZpbGw9XCIjQzM5MzE0XCIvPjxwYXRoIGQ9XCJNODkgMTk2Yy0yIDAtNC0xLTYtM2wtOC0xMGMtMy0zLTItOCAxLTExczgtMiAxMSAxbDggMTBjMyAzIDIgOC0xIDExQzkyIDE5NiA5MSAxOTYgODkgMTk2elwiIGNsYXNzPVwiYVwiLz48cGF0aCBkPVwiTTExOCAyODVjMCAwIDAgMC0xIDAgLTQgMC04LTQtNy05bDItMjVjMS0xNC00LTI3LTEyLTM4bC0yLTNjLTMtMy0yLTggMS0xMSAzLTMgOC0yIDExIDFsMiAzYzEyIDE0IDE4IDMyIDE2IDUwbC0yIDI1QzEyNiAyODIgMTIyIDI4NSAxMTggMjg1elwiIGNsYXNzPVwiYVwiLz48L3N2Zz5cbiAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICAgIDogXCJcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG5cbiAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRhY3RMaXN0SXRlbTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5jb250YWN0LWxpc3QtaXRlbS53cmFwcGVyXCIpO1xuXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIuY29udGFjdExpc3RCdXR0b24oXG4gICAgICAgIGNvbnRlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRhY3QtbGlzdC1pdGVtIGNvbnRhaW5lclwiKSxcbiAgICAgICAgbWV0aG9kcy5kYXRhLnNob3dDb250YWN0LFxuICAgICAgICBcImFkZFwiLFxuICAgICAgICBcImNsaWNrXCJcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0sXG4gICAgY29udGFjdFZpZXdBbmRGb3JtOiBmdW5jdGlvbiAoXG4gICAgICBjdXJyZW50Q29udGFjdCA9IHtcbiAgICAgICAgZmlsZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRhdGFVcmw6IFwiXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGZpcnN0bmFtZTogXCJcIixcbiAgICAgICAgbGFzdG5hbWU6IFwiXCIsXG4gICAgICAgIGZhdm9yaXRlczogZmFsc2UsXG4gICAgICAgIHBob25lV29yazogXCJcIixcbiAgICAgICAgcGhvbmVQcml2YXRlOiBcIlwiLFxuICAgICAgICBlbWFpbFdvcms6IFwiXCIsXG4gICAgICAgIGVtYWlsUHJpdmF0ZTogXCJcIixcbiAgICAgICAgYWRkcmVzczogXCJcIixcbiAgICAgICAgbm90ZTogXCJcIixcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICB9LFxuICAgICAgdHlwZSA9IFwiYWRkXCJcbiAgICApIHtcbiAgICAgIGxldCBjb250YWN0SXRlbVdyYXBwZXIgPVxuICAgICAgICBgXG48YXJ0aWNsZSBjbGFzcz1cImNvbnRhY3QtaXRlbSB3cmFwcGVyXCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbVwiIHN0YXRlPVwiYWN0aXZlXCI+XG4gIDxmb3JtIGNsYXNzPVwiY29udGFjdC1mb3JtXCIgYWN0aW9uPVwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Bvc3RzJHtjdXJyZW50Q29udGFjdC5pZFxuICAgICAgICAgID8gXCIvXCIgKyBjdXJyZW50Q29udGFjdC5pZFxuICAgICAgICAgIDogXCJcIn1cIiBtZXRob2Q9XCIke2N1cnJlbnRDb250YWN0LmlkXG4gICAgICAgICAgICA/IFwiUEFUQ0hcIlxuICAgICAgICAgICAgOiBcInBvc3RcIn1cIiBuYW1lPVwiZm9ybVwiIG5vdmFsaWRhdGU+XG4gICAgPHNlY3Rpb24gY2xhc3M9XCJjb250YWN0LWJ1dHRvbiBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1idXR0b24gYnV0dG9uLWJhY2tcIj5cbiAgICAgIDx1bCBjbGFzcz1cImNvbnRhY3QtYnV0dG9uIHVuaXRcIj5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24tYmFja1wiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+XG48cGF0aCBkPVwiTTIwLjM5NCwzNy40NjlsMTEuOS0xMS45TDMxLjcyMSwyNWwtMTEuOSwxMS45YTAuODA3LDAuODA3LDAsMSwwLDEuMTQxLDEuMTQxbDExLjktMTEuOS0wLjU3LS41N1pcIiBmaWxsPVwiIzY3Njc2N1wiLz5cbjxwYXRoIGQ9XCJNMjAuMzk0LDEyLjUzMWwxMS45LDExLjksMC41Ny0uNTctMTEuOS0xMS45QTAuODA3LDAuODA3LDAsMSwwLDE5LjgyMywxMy4xTDMxLjcyMSwyNWwwLjU3MS0uNTcxWlwiIGZpbGw9XCIjNjc2NzY3XCIvPlxuPHJlY3QgeD1cIjMxLjg4OFwiIHk9XCIyNC41OTdcIiB3aWR0aD1cIjAuODA3XCIgaGVpZ2h0PVwiMC44MDdcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTguMjIgMzAuMTU2KSByb3RhdGUoLTQ1KVwiIGZpbGw9XCIjNjc2NzY3XCIvPlxuPHJlY3QgeD1cIjMyLjQ1OVwiIHk9XCIyNS4xNjdcIiB3aWR0aD1cIjAuODA3XCIgaGVpZ2h0PVwiMC44MDdcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTguNDU2IDMwLjczKSByb3RhdGUoLTQ1LjAwNSlcIiBmaWxsPVwiIzY3Njc2N1wiLz5cbjxyZWN0IHg9XCIzMy4wMjlcIiB5PVwiMjQuNTk3XCIgd2lkdGg9XCIwLjgwN1wiIGhlaWdodD1cIjAuODA3XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKC03Ljg4NiAzMC45NTkpIHJvdGF0ZSgtNDQuOTk1KVwiIGZpbGw9XCIjNjc2NzY3XCIvPlxuPHJlY3QgeD1cIjMyLjQ1OVwiIHk9XCIyNC4wMjZcIiB3aWR0aD1cIjAuODA3XCIgaGVpZ2h0PVwiMC44MDdcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTcuNjQ5IDMwLjM5Mikgcm90YXRlKC00NSlcIiBmaWxsPVwiIzY3Njc2N1wiLz5cbjwvc3ZnPlxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPHNwYW4+YmFjazwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgPC9zZWN0aW9uPiAgICAgICAgXG4gICAgPGZpZWxkc2V0ICR7dHlwZSA9PSBcInJlYWRcIiA/IFwiZGlzYWJsZWRcIiA6IFwiXCJ9PlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImlkXCIgaWQ9XCJpZFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5pZH1cIiBoaWRkZW4gLz5cbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0taGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJmaWxlLXVwbG9hZFwiPlxuICAgICAgICAgIDxmaWd1cmUgY2xhc3M9XCJjb250YWN0LWF2YXRhciBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWF2YXRhclwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgbmFtZT1cImF2YXRhclwiIGlkPVwiYXZhdGFyXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIHN0YXRlPVwiaGlkZGVuXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiaW5wdXQtZmlsZS1kYXRhXCIgbmFtZT1cImZpbGVcIiB2YWx1ZT0nW3tcImRhdGFVcmxcIjpcIiR7Y3VycmVudENvbnRhY3RcbiAgICAgICAgICAuZmlsZVswXS5kYXRhVXJsfVwiLFwibmFtZVwiOlwiJHtjdXJyZW50Q29udGFjdC5maWxlWzBdLm5hbWV9XCJ9XSdcbmlkPVwiZmlsZVwiIGhpZGRlbiAvPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImF2YXRhclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1hdmF0YXIgdW5pdFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJpbWFnZSBhdmF0YXItaW1hZ2VcIiBzcmM9XCIke2N1cnJlbnRDb250YWN0XG4gICAgICAgICAgLmZpbGVbMF0uZGF0YVVybFxuICAgICAgICAgID8gY3VycmVudENvbnRhY3QuZmlsZVswXS5kYXRhVXJsXG4gICAgICAgICAgOiBgL3Jlc291cmNlcy9pbWFnZXMvaWNvbnMvYXZhdGFyLnN2Z2B9XCIgYWx0PVwiYXZhdGFyIHBpY3R1cmVcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGZpZ2NhcHRpb24gY2xhc3M9XCJjYXB0aW9uXCI+c2VsZWN0IGEgZmlsZTwvZmlnY2FwdGlvbj5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVsZXRlLWZpbGUgY29udGFpbmVyXCIgdmFyaWFudD1cImRlbGV0ZS1maWxlXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGVsZXRlLWZpbGUgdW5pdFwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgeG1sOiBzcGFjZT1cInByZXNlcnZlXCI+PHBhdGggZD1cIk0yOTguOTEyIDYwLjIzMWMtOC4xMTQgMC0xNC42OTItNi41NzctMTQuNjkyLTE0LjY5MlYyOS4zODNIMTcyLjU2NFY0NS41NGMwIDguMTE0LTYuNTc3IDE0LjY5Mi0xNC42OTIgMTQuNjkycy0xNC42OTItNi41NzctMTQuNjkyLTE0LjY5MlYxNC42OTJDMTQzLjE4MSA2LjU3NyAxNDkuNzU4IDAgMTU3Ljg3MiAwaDE0MS4wNGM4LjExNCAwIDE0LjY5MiA2LjU3NyAxNC42OTIgMTQuNjkyVjQ1LjU0QzMxMy42MDQgNTMuNjU0IDMwNy4wMjUgNjAuMjMxIDI5OC45MTIgNjAuMjMxek0zNjYuNDk0IDUxMmMtNjEuNTY4IDAtMTExLjY1Ny01MC4wODgtMTExLjY1Ny0xMTEuNjU3czUwLjA4OC0xMTEuNjU3IDExMS42NTctMTExLjY1N1M0NzguMTUgMzM4Ljc3NSA0NzguMTUgNDAwLjM0MyA0MjguMDYyIDUxMiAzNjYuNDk0IDUxMnpNMzY2LjQ5NCAzMTguMDdjLTQ1LjM2NSAwLTgyLjI3MyAzNi45MDgtODIuMjczIDgyLjI3M3MzNi45MDggODIuMjczIDgyLjI3MyA4Mi4yNzNjNDUuMzY1IDAgODIuMjczLTM2LjkwOCA4Mi4yNzMtODIuMjczUzQxMS44NTkgMzE4LjA3IDM2Ni40OTQgMzE4LjA3ek0yOTcuNjg3IDQ4My4zNDRIMTA0Ljk2M2MtNy41NzUgMC0xMy45MDctNS43NTgtMTQuNjI2LTEzLjI5OUw2MC45NTEgMTYxLjUyN2MtMC4zOTItNC4xMiAwLjk3MS04LjIxNCAzLjc1NS0xMS4yNzcgMi43ODYtMy4wNjIgNi43MzItNC44MDcgMTAuODctNC44MDdoMzA1LjYyOGM4LjExNCAwIDE0LjY5MiA2LjU3NyAxNC42OTIgMTQuNjkyIDAgOC4xMTQtNi41NzcgMTQuNjkyLTE0LjY5MiAxNC42OTJIOTEuNzM1bDI2LjU4OCAyNzkuMTM0aDE3OS4zNjNjOC4xMTQgMCAxNC42OTIgNi41NzcgMTQuNjkyIDE0LjY5MlMzMDUuODAxIDQ4My4zNDQgMjk3LjY4NyA0ODMuMzQ0ek0xNTguMzgyIDQyNC41NzdjLTcuNDg3IDAtMTMuODg0LTUuNjk0LTE0LjYwOC0xMy4yOTlsLTE0LjQ5OC0xNTIuMjAxYy0wLjc2OC04LjA3NyA1LjE1NS0xNS4yNDggMTMuMjMzLTE2LjAxOCA4LjA5MS0wLjc2NyAxNS4yNSA1LjE1NSAxNi4wMTggMTMuMjMzbDE0LjQ5OCAxNTIuMjAxYzAuNzY4IDguMDc3LTUuMTU1IDE1LjI0OC0xMy4yMzMgMTYuMDE4QzE1OS4zMTggNDI0LjU1NyAxNTguODQ4IDQyNC41NzcgMTU4LjM4MiA0MjQuNTc3ek0zMDYuOTkgMzM4LjQ4NmMtMC40ODMgMC0wLjk3MS0wLjAyNS0xLjQ2Mi0wLjA3MiAtOC4wNzUtMC43OTgtMTMuOTczLTcuOTkxLTEzLjE3NS0xNi4wNjVsNi41MzMtNjYuMTA4YzAuNzk4LTguMDc2IDcuOTk1LTEzLjk2NCAxNi4wNjUtMTMuMTc1IDguMDc1IDAuNzk4IDEzLjk3MyA3Ljk5MSAxMy4xNzUgMTYuMDY1bC02LjUzMyA2Ni4xMDhDMzIwLjg0NCAzMzIuODIgMzE0LjQ1MyAzMzguNDg2IDMwNi45OSAzMzguNDg2ek0zNjcuNTYyIDMxOC4wOTZjLTAuMDUgMC0wLjEgMC0wLjE1IDAgLTAuMjkyLTAuMDAzLTAuNTgyLTAuMDEyLTAuODczLTAuMDIybC0wLjE1NC0wLjAwNGMtOC4xMTMgMC0xNC42MzYtNi41NzctMTQuNjM2LTE0LjY5MiAwLTIuNDc4IDAuNjE5LTQuODEzIDEuNzEtNi44NjFsMy44My00MC4yMjNjMC43Ny04LjA3NyA3LjkzNS0xMy45OTcgMTYuMDE4LTEzLjIzMyA4LjA3NyAwLjc3IDE0LjAwMSA3Ljk0MSAxMy4yMzMgMTYuMDE4bC00LjM1NSA0NS43MkMzODEuNDY2IDMxMi4zNDUgMzc1LjEyNyAzMTguMDk2IDM2Ny41NjIgMzE4LjA5NnpNMzI4Ljg2NyA0NTIuNjYyYy0zLjc2IDAtNy41MjEtMS40MzQtMTAuMzg4LTQuMzAzIC01LjczNy01LjczNy01LjczNy0xNS4wNCAwLTIwLjc3OGw3NS4yNTQtNzUuMjU0YzUuNzM3LTUuNzM3IDE1LjA0LTUuNzM3IDIwLjc3OCAwIDUuNzM3IDUuNzM3IDUuNzM3IDE1LjA0IDAgMjAuNzc4bC03NS4yNTQgNzUuMjU0QzMzNi4zODggNDUxLjIyOCAzMzIuNjI3IDQ1Mi42NjIgMzI4Ljg2NyA0NTIuNjYyek00MDQuMTIxIDQ1Mi42NjJjLTMuNzYgMC03LjUyMS0xLjQzNC0xMC4zODktNC4zMDNsLTc1LjI1NC03NS4yNTRjLTUuNzM3LTUuNzM3LTUuNzM3LTE1LjA0IDAtMjAuNzc4IDUuNzM3LTUuNzM3IDE1LjA0LTUuNzM3IDIwLjc3OCAwbDc1LjI1NCA3NS4yNTRjNS43MzcgNS43MzcgNS43MzcgMTUuMDQgMCAyMC43NzhDNDExLjY0MSA0NTEuMjI4IDQwNy44OCA0NTIuNjYyIDQwNC4xMjEgNDUyLjY2MnpcIiBmaWxsPVwiI0IzNDA0QVwiIC8+PHJlY3QgeD1cIjQ4LjU0MVwiIHk9XCIxMDEuMzY4XCIgd2lkdGg9XCIzNTkuNjk2XCIgaGVpZ2h0PVwiNzkuODkzXCIgZmlsbD1cIiNGNEIyQjBcIiAvPjxwYXRoIGQ9XCJNNDA4LjI0MiAxOTUuOTVoLTM1OS43Yy04LjExNCAwLTE0LjY5Mi02LjU3Ny0xNC42OTItMTQuNjkydi03OS44OWMwLTguMTE0IDYuNTc3LTE0LjY5MiAxNC42OTItMTQuNjkyaDM1OS43YzguMTE0IDAgMTQuNjkyIDYuNTc3IDE0LjY5MiAxNC42OTJ2NzkuODg5QzQyMi45MzMgMTg5LjM3MSA0MTYuMzU2IDE5NS45NSA0MDguMjQyIDE5NS45NXpNNjMuMjMzIDE2Ni41NjdIMzkzLjU1VjExNi4wNkg2My4yMzNWMTY2LjU2N3pNMjI4LjM5MiA0MjQuNTc3Yy04LjExNCAwLTE0LjY5Mi02LjU3Ny0xNC42OTItMTQuNjkyVjI1Ni4wMDFjMC04LjExNCA2LjU3Ny0xNC42OTIgMTQuNjkyLTE0LjY5MnMxNC42OTIgNi41NzcgMTQuNjkyIDE0LjY5MnYxNTMuODg1QzI0My4wODQgNDE4IDIzNi41MDUgNDI0LjU3NyAyMjguMzkyIDQyNC41Nzd6XCIgZmlsbD1cIiNCMzQwNEFcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2ZpZ3VyZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tbmFtZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkIG5hbWUtaW5wdXRmaWVsZFwiIHN0YXRlPVwiaGlkZGVuXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwiZmlyc3RuYW1lXCIgbmFtZT1cImZpcnN0bmFtZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCIke2N1cnJlbnRDb250YWN0LmZpcnN0bmFtZX1cIiBwbGFjZWhvbGRlcj1cImZpcnN0bmFtZVwiIC8+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwibGFzdG5hbWVcIiBuYW1lPVwibGFzdG5hbWVcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5sYXN0bmFtZX1cIiBwbGFjZWhvbGRlcj1cImxhc3RuYW1lXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZCBuYW1lLWxhYmVsXCIgc3RhdGU9XCJhY3RpdmVcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdG5hbWVcIj4ke2N1cnJlbnRDb250YWN0LmZpcnN0bmFtZX08L2xhYmVsPiA8bGFiZWwgZm9yPVwibGFzdG5hbWVcIj4ke2N1cnJlbnRDb250YWN0Lmxhc3RuYW1lfTwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWZhdm9yaXRlXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWNoZWNrYm94XCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJmYXYtY2hlY2tib3hcIiBuYW1lPVwiZmF2b3JpdGVzXCIgaWQ9XCJmYXZvcml0ZXNcIiAke2N1cnJlbnRDb250YWN0LmZhdm9yaXRlc1xuICAgICAgICAgID8gYGNoZWNrZWRgXG4gICAgICAgICAgOiBgYH0gLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmYXZvcml0ZXNcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIG9uXCI+XG4gICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAzNzYgMzc2XCI+PHN0eWxlPi5he2ZpbGw6ICNDMzkyMTU7fTwvc3R5bGU+PHBhdGggZD1cIk0xODggMTdsNjMgMTAzIDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDYgLTExMSA0NiAxMC0xMjAgLTc4LTkyIDExNy0yOEwxODggMTd6XCIgZmlsbD1cIiNGRkU2M0NcIiAvPjxwYXRoIGQ9XCJNMjI0IDE5NGwtMzYtMTYxIDYzIDg3IDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDZMMjI0IDE5NHpcIiBmaWxsPVwiI0ZERDcyRVwiIC8+PHBhdGggZD1cIk0yOTkgMzY3Yy0xIDAtMiAwLTMtMWwtMTA4LTQ1IC0xMDggNDVjLTIgMS02IDEtOC0xIC0yLTItNC00LTMtN2w5LTExNyAtNzYtODljLTItMi0yLTUtMi04IDEtMyAzLTUgNi01bDExNC0yNyA2MS0xMDBjMi0yIDQtNCA3LTRsMCAwYzMgMCA1IDIgNyA0bDYxIDEwMCAxMTQgMjdjMyAxIDUgMyA2IDUgMSAzIDAgNi0yIDhsLTc2IDg5IDkgMTE3YzAgMy0xIDYtMyA3QzMwMiAzNjcgMzAwIDM2NyAyOTkgMzY3ek0xODggMzA1YzEgMCAyIDAgMyAxbDk5IDQxIC04LTEwN2MwLTIgMC00IDItNmw3MC04MiAtMTA0LTI0Yy0yIDAtNC0yLTUtNGwtNTYtOTIgLTU2IDkxYy0xIDItMyAzLTUgNGwtMTA0IDI1IDcwIDgyYzEgMiAyIDQgMiA2bC04IDEwNyA5OS00MUMxODYgMzA1IDE4NiAzMDUgMTg4IDMwNXpNMTI1IDEyMEwxMjUgMTIwIDEyNSAxMjB6XCIgZmlsbD1cIiNDMzkzMTRcIiAvPjxwYXRoIGQ9XCJNODkgMTk2Yy0yIDAtNC0xLTYtM2wtOC0xMGMtMy0zLTItOCAxLTExczgtMiAxMSAxbDggMTBjMyAzIDIgOC0xIDExQzkyIDE5NiA5MSAxOTYgODkgMTk2elwiIGNsYXNzPVwiYVwiIC8+PHBhdGggZD1cIk0xMTggMjg1YzAgMCAwIDAtMSAwIC00IDAtOC00LTctOWwyLTI1YzEtMTQtNC0yNy0xMi0zOGwtMi0zYy0zLTMtMi04IDEtMTEgMy0zIDgtMiAxMSAxbDIgM2MxMiAxNCAxOCAzMiAxNiA1MGwtMiAyNUMxMjYgMjgyIDEyMiAyODUgMTE4IDI4NXpcIiBjbGFzcz1cImFcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBvZmZcIj5cbiAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiPlxuICAgICAgICAgICAgICAgICAgPHN0eWxlPi5he2ZpbGw6ICM5OTk5OTk7fTwvc3R5bGU+XG4gICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTg0Niw3MjVINzI3di0xMTdjMC0xOC0xMy0zMi0zMC0zMmMtMTYsMC0zMCwxNC0zMCwzMnYxMTdINTQ5Yy0xOCwwLTMzLDEzLTMzLDI5czE1LDI5LDMzLDI5aDExOXYxMTdjMCwxOCwxMywzMiwzMCwzMmMxNiwwLDMwLTE0LDMwLTMydi0xMTdoMTE5YzE4LDAsMzMtMTMsMzMtMjlTODY0LDcyNSw4NDYsNzI1eiBNOTc3LDM2MWMtNC0yOS0yNi01MC01NC01NGwtMjUxLTM2Yy0xLTEtMi0yLTMtMmwtMTExLTIyMWMtMTAtMjEtMzAtMzYtNTMtMzhDNDc5LDgsNDU1LDIyLDQ0Myw0NUwzMzEsMjY5Yy0xLDEtMiwyLTMsMkw4MCwzMDdjLTIzLDMtNDQsMTctNTMsMzhjLTEwLDI0LTUsNTIsMTQsNzBMMjIzLDU4OWMxLDEsMSwzLDEsNGwtNDMsMjQ2Yy0zLDE4LDIsMzcsMTQsNTFjMTksMjIsNTIsMjksNzksMTVMNDcxLDgwM2MxNC03LDIwLTI1LDEzLTM5Yy03LTE1LTI2LTIxLTQwLTEzTDI0Niw4NTRjLTIsMS00LDAtNi0xYy0xLTEtMS0yLTEtM2w0My0yNDZjNC0yMC0zLTQxLTE4LTU2TDgzLDM3M2MtMS0xLTItMi0xLTRjMS0zLDMtMyw0LTNMMzM2LDMyOWMyMS0zLDM5LTE2LDQ4LTM0TDQ5Niw3MWMwLTEsMS0yLDQtMmMzLDAsNCwyLDQsMkw2MTYsMjk1YzksMTksMjcsMzEsNDgsMzRsMjUxLDM2YzEsMCwzLDAsNCwzYzEsMy0xLDQtMSw0TDc1Niw1MjdjLTEyLDExLTEyLDMwLTAsNDFjMCwwLDAsMCwxLDFjMTEsMTEsMzAsMTEsNDEsMGwxNTktMTUzQzk3Miw0MDIsOTgwLDM4Miw5NzcsMzYxelwiIGNsYXNzPVwiYVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWJvZHktY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBob25lV29ya1wiPndvcms8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVXb3JrXCIgbmFtZT1cInBob25lV29ya1wiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCIgcGxhY2Vob2xkZXI9XCJhZGQgd29yayBwaG9uZW51bWJlclwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBob25lUHJpdmF0ZVwiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVQcml2YXRlXCIgbmFtZT1cInBob25lUHJpdmF0ZVwiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVByaXZhdGV9XCIgcGxhY2Vob2xkZXI9XCJhZGQgcHJpdmF0ZSBwaG9uZW51bWJlciBcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWJvZHlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtbGFiZWxcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFdvcmtcIj53b3JrPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImVtYWlsV29ya1wiIG5hbWU9XCJlbWFpbFdvcmtcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuZW1haWxXb3JrfVwiIHBsYWNlaG9sZGVyPVwiYWRkIHdvcmsgZW1haWxhZGRyZXNzIFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVtYWlsUHJpdmF0ZVwiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwiZW1haWxQcml2YXRlXCIgbmFtZT1cImVtYWlsUHJpdmF0ZVwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5lbWFpbFByaXZhdGV9XCIgcGxhY2Vob2xkZXI9XCJhZGQgcHJpdmF0ZSBlbWFpbGFkZHJlc3MgXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiYWRkcmVzc1wiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJpbnB1dCB0ZXh0YXJlYVwiIGlkPVwiYWRkcmVzc1wiIG5hbWU9XCJhZGRyZXNzXCIgd3JhcD1cImhhcmRcIiByb3dzPVwiNFwiIHBsYWNlaG9sZGVyPVwiYWRkIGFkZHJlc3MgXCI+JHtjdXJyZW50Q29udGFjdC5hZGRyZXNzfTwvdGV4dGFyZWE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXIgaXMtbGFzdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibm90ZVwiPm5vdGU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJpbnB1dCB0ZXh0YXJlYVwiIGlkPVwibm90ZVwiIG5hbWU9XCJub3RlXCIgd3JhcD1cImhhcmRcIiByb3dzPVwiNFwiIHBsYWNlaG9sZGVyPVwicGxhY2UgYSBub3RlIFwiPiR7Y3VycmVudENvbnRhY3Qubm90ZX08L3RleHRhcmVhPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICA8L2ZpZWxkc2V0ID5cblxuICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1idXR0b24gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtYnV0dG9uXCI+XG4gICAgICA8dWwgY2xhc3M9XCJjb250YWN0LWJ1dHRvbiB1bml0XCIgdmFyaWFudD1cImNvbnRhY3Qtc2hvd1wiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1lZGl0XCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+PHRpdGxlPmljb25zPC90aXRsZT48cGF0aCBkPVwiTTguOTgsNDQuNWwtMS4wMjItLjAzNEEyLjQ3OSwyLjQ3OSwwLDAsMSw2LjM1MSw0Mi45OGwtMC4wNjUtLjE1MiwwLjAwOS0uOTcxTDYuNCw0MS4xNDhjMC4wNzktLjUxNC4xNTktMS4wMjcsMC4yMy0xLjU0MmwwLjMtMi4xODhjMC4yMjEtMS42MzYuNDQyLTMuMjcxLDAuNjgyLTQuOWEyLjQ3NSwyLjQ3NSwwLDAsMSwuNjU4LTEuMjU3QzguODc1LDMwLjYyLDkuNSwzMCwxMC4xMjIsMjkuMzgzbDUuMjExLTUuMjA2cTcuMy03LjMsMTQuNTkyLTE0LjZBNS41MDYsNS41MDYsMCwwLDEsMzIuODY2LDcuOGwwLjE0LS4wMTJMMzQuMTE5LDcuOGE1LjcsNS43LDAsMCwxLDIuOTkyLDEuODczQzM4LjQsMTEsMzkuNzQsMTIuMzM5LDQxLjA4NywxMy42NDhhNS43LDUuNywwLDAsMSwxLjksMy4wMTZMNDMsMTYuODE3bC0wLjAxMiwxLjFhNS41ODcsNS41ODcsMCwwLDEtMS44MjcsMi45OUMzNC40MzYsMjcuNjExLDI3LjI3MywzNC43NiwyMC4xMjIsNDEuOTYzYTQuNTg2LDQuNTg2LDAsMCwxLTIuODg5LDEuMzc4Yy0xLjk5My4yMzgtNC4wMTgsMC41MTgtNS45NzcsMC43OWwtMi4xMTguMjk1Wk04LjMyNSw0Mi44ODRoMC4zYTAuOTYxLDAuOTYxLDAsMCwxLC4xOTMtMC4wNDZsMi4yMTItLjNjMS45NjYtLjI3Myw0LTAuNTU0LDYuMDA2LTAuNzk0YTIuOTkxLDIuOTkxLDAsMCwwLDEuOTM2LS45MTNDMjYuMTMxLDMzLjYyMSwzMy4zLDI2LjQ3LDQwLjAyLDE5Ljc2M0E0LjIxNiw0LjIxNiwwLDAsMCw0MS4zODYsMTcuN1YxNi45YTQuMzg2LDQuMzg2LDAsMCwwLTEuNDIzLTIuMDk0Yy0xLjM1OC0xLjMyLTIuNzA3LTIuNjY5LTQuMDA5LTQuMDFhNC4yMTksNC4yMTksMCwwLDAtMi4wNy0xLjRoLTAuOGE0LjAxNCw0LjAxNCwwLDAsMC0yLjAxNCwxLjMxNXEtNy4yODgsNy4zMTItMTQuNTk0LDE0LjYwN2wtNS4yMTYsNS4yMTFjLTAuNjEyLjYwNy0xLjIyNSwxLjIxNS0xLjgxOSwxLjgzOWEwLjg5NCwwLjg5NCwwLDAsMC0uMjMxLjM3OUM4Ljk2OSwzNC4zNzUsOC43NDksMzYsOC41MjksMzcuNjM0bC0wLjMsMi4xOTJDOC4xNTksNDAuMzUsOC4wNzksNDAuODcyLDgsNDEuMzk0bC0wLjEuNjQ0djAuNDQxQTAuODQxLDAuODQxLDAsMCwwLDguMzI1LDQyLjg4NFpcIiBmaWxsPVwiI2ZmZlwiIC8+PHJlY3QgeD1cIjMwLjc3OVwiIHk9XCIxMi43N1wiIHdpZHRoPVwiMS42MTNcIiBoZWlnaHQ9XCIxMi45MDhcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQuMjg3IDI4LjE4OCkgcm90YXRlKC00NS4zNTYpXCIgZmlsbD1cIiNmZmZcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPHNwYW4+ZWRpdDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiZmxleC1hdXRvXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIm1haWx0bzoke2N1cnJlbnRDb250YWN0LmVtYWlsV29ya31cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICA8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiPjx0aXRsZT5pY29uczwvdGl0bGU+PHBhdGggZD1cIk0xLjUxMywzNi41NjhWMTUuNzIxYTAuOTQ5LDAuOTQ5LDAsMCwwLC4wMjEtMC4xMTQsNC42NDIsNC42NDIsMCwwLDEsLjMwOS0xLjM4Niw1LjMsNS4zLDAsMCwxLDQuOTI5LTMuMzM5cTE4LjIzMywwLjAwNywzNi40NjYsMGE1LjMzLDUuMzMsMCwwLDEsLjc3LjA1MSw1LjE0Nyw1LjE0NywwLDAsMSwyLjc1OCwxLjI4Niw0LjkyOCw0LjkyOCwwLDAsMSwxLjcyMSwzLjhxMCwxMC4xNDksMCwyMC4zYTQuODg3LDQuODg3LDAsMCwxLTEuMzcyLDMuNDA2LDUuMTg5LDUuMTg5LDAsMCwxLTMuODksMS42NzVxLTkuNDM5LDAtMTguODc5LDAtOC43NTQsMC0xNy41MDksMEE1LjcsNS43LDAsMCwxLDUuOSw0MS4zMzFhNS4yLDUuMiwwLDAsMS0zLjEzLTEuNzQyLDQuODc1LDQuODc1LDAsMCwxLTEuMi0yLjU1N0MxLjU1LDM2Ljg3NywxLjUzMywzNi43MjIsMS41MTMsMzYuNTY4Wk0yNSwxMi42NzJxLTkuMDcyLDAtMTguMTQ0LDBhMy40MzUsMy40MzUsMCwwLDAtMS41MTkuMzA4LDMuMjUzLDMuMjUzLDAsMCwwLTIuMDI4LDMuMTE1cTAsMTAuMSwwLDIwLjJhMy4wNzYsMy4wNzYsMCwwLDAsLjg2MiwyLjE4MUEzLjQ3LDMuNDcsMCwwLDAsNi44LDM5LjYwOGgxNS4zcTEwLjU0LDAsMjEuMDgsMGEzLjQxOSwzLjQxOSwwLDAsMCwxLjYxNC0uMzYxQTMuMjM5LDMuMjM5LDAsMCwwLDQ2LjY5NSwzNi4ycTAtMTAuMTEsMC0yMC4yMTlhMy4wNjUsMy4wNjUsMCwwLDAtLjgxMy0yLjEyMiwzLjUwOSwzLjUwOSwwLDAsMC0yLjcxNi0xLjE5MkgyNVpcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk0yNSwzMC41NTNhMC43NTksMC43NTksMCwwLDEtLjU5My0wLjIwOXEtMy40NTUtMi42ODEtNi45MTktNS4zNTEtNi40MTgtNC45NTktMTIuODM0LTkuOTIxYTEuMDMsMS4wMywwLDAsMS0uNDM1LTAuODY3LDAuNTcsMC41NywwLDAsMSwuMDg0LTAuMjk1QTEuMTA4LDEuMTA4LDAsMCwxLDUuMiwxMy40YTAuNiwwLjYsMCwwLDEsLjQuMTM3UTcuMzU4LDE0LjksOS4xMTUsMTYuMjY2TDI0LjUyMiwyOC4yMTdjMC4xMjYsMC4xLjI1NywwLjE5MSwwLjM3NywwLjNhMC4xMzMsMC4xMzMsMCwwLDAsLjIsMHExLjY2Mi0xLjMsMy4zMy0yLjU4N0w0NC4yODEsMTMuNjM2YTIuMDUzLDIuMDUzLDAsMCwxLC4yLTAuMTU1LDAuNjc2LDAuNjc2LDAsMCwxLC41NDgtMC4wNTUsMS4yNDYsMS4yNDYsMCwwLDEsLjYwOC4zOTIsMC42NSwwLjY1LDAsMCwxLC4xMjIuNjM1LDEuMTYzLDEuMTYzLDAsMCwxLS40MTQuNjI1TDI1LjY1MiwzMC4zYTAuODQ2LDAuODQ2LDAsMCwwLS4wODUuMDY2QTAuNjQ4LDAuNjQ4LDAsMCwxLDI1LDMwLjU1M1pcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk04Ljc3MywzNS4wODFhMC45NzQsMC45NzQsMCwwLDEtLjg1OS0wLjUxLDAuNjYsMC42NiwwLDAsMS0uMDI4LTAuNjIxQTEuMjE0LDEuMjE0LDAsMCwxLDguMywzMy4zOTJxMi44MTEtMi4xMDUsNS42Mi00LjIxNGEwLjU4NCwwLjU4NCwwLDAsMCwuMDU0LTAuMDQxLDAuNywwLjcsMCwwLDEsLjg2Ny0wLjEsMS43LDEuNywwLDAsMSwuNDE2LjMsMC42NDEsMC42NDEsMCwwLDEsLjEzNy42OTEsMS4xNjYsMS4xNjYsMCwwLDEtLjQyNC42MDdMOS4zNiwzNC44MzlhMC44MiwwLjgyLDAsMCwxLS4zOTIuMjI1QzguOSwzNS4wNzEsOC44MzgsMzUuMDc2LDguNzczLDM1LjA4MVpcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk00MS4yMDYsMzUuMDc1YTAuNzI5LDAuNzI5LDAsMCwxLS41Mi0wLjJDMzkuODYxLDM0LjI0NSwzOS4wMjksMzMuNjI2LDM4LjIsMzNjLTEuMDY0LS44LTIuMTMyLTEuNTkyLTMuMTkxLTIuNGExLjAzMywxLjAzMywwLDAsMS0uNDMzLTAuODc3LDAuNTQzLDAuNTQzLDAsMCwxLC4xMzctMC4zNTgsMS4xMzcsMS4xMzcsMCwwLDEsLjg2Mi0wLjQzNCwwLjYsMC42LDAsMCwxLC4zNzIuMTI4UTM3LjE4NCwzMCwzOC40MjMsMzAuOTMxYzEuMTA1LDAuODMxLDIuMjE2LDEuNjU1LDMuMzE2LDIuNDkyYTEsMSwwLDAsMSwuNDI1LjkzNSwwLjQ5NCwwLjQ5NCwwLDAsMS0uMDgxLjIyN0EwLjk3NywwLjk3NywwLDAsMSw0MS4yMDYsMzUuMDc1WlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmVtYWlsPC9zcGFuPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxhIGhyZWY9XCJ0ZWw6JHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgPHN2ZyBkYXRhLW5hbWU9XCJMYXllciAxXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj48dGl0bGU+aWNvbnM8L3RpdGxlPjxwYXRoIGQ9XCJNMzYuNDMsNDcuMmE0LjIsNC4yLDAsMCwxLS43MzYtMC4wNjVsLTAuNTQyLS4wOTFjLTAuNS0uMDgzLTEuMDI1LTAuMTY4LTEuNTQzLTAuMzA2YTQ3LjIsNDcuMiwwLDAsMS0xNi40MjMtOC4yQTQyLjk1LDQyLjk1LDAsMCwxLDYuMjMzLDI2LjI2MSw0NC44MTEsNDQuODExLDAsMCwxLDIuMjcsMTcuNDUzTDIuMjI5LDE3LjMzbDAuMDEyLTEuNjM5YTExLjY0MiwxMS42NDIsMCwwLDEsMS40NjQtMy45MzUsMjYuMTQ3LDI2LjE0NywwLDAsMSw1LjUxLTYuNDE1QzkuMzYsNS4yMTQsOS40OTIsNS4xLDkuNjI5LDQuOTg4YTIuNDY3LDIuNDY3LDAsMCwxLDMuNDM2LjE4Niw3Mi42LDcyLjYsMCwwLDEsNi45ODksOC4yNzUsMi4yMSwyLjIxLDAsMCwxLS40MjksMy4wMjIsMjQuNzE0LDI0LjcxNCwwLDAsMC00LjA5Miw0LjE3LDAuNTc3LDAuNTc3LDAsMCwwLS4wNTcuODU2LDM5LjA2NSwzOS4wNjUsMCwwLDAsMTMuMSwxMi4zODhjMC41MzUsMC4zLDEuMTEuNTg5LDEuNzA5LDAuODczLDAuNDY3LDAuMjIyLjUxNCwwLjE2OCwwLjczNy0uMDkxLDAuNzcxLS45LDEuNTA2LTEuODY5LDIuMjE3LTIuODA4bDAuMDgzLS4xMWMwLjI0Ny0uMzI2LjQ3LTAuNjc3LDAuNzA1LTEuMDQ4bDAuMjU4LS40YTIuMzc5LDIuMzc5LDAsMCwxLDMuNDE3LS44YzAuNTQ4LDAuMzMsMS4wODIuNjgzLDEuNjE2LDEuMDM2LDAuMjYsMC4xNzIuNTIsMC4zNDQsMC43ODEsMC41MTNsMS4zNjMsMC44ODJxMi40MjgsMS41NzEsNC44NjUsMy4xM2EzLjA5NCwzLjA5NCwwLDAsMSwxLjM4OCwxLjUxTDQ3Ljc3MSwzNi43djEuMTMzbC0wLjE2My4yODhhMy40NzcsMy40NzcsMCwwLDEtLjE5Mi4zMjIsMjYuNDQ5LDI2LjQ0OSwwLDAsMS03LjQ0NCw3LjRBNi41NTQsNi41NTQsMCwwLDEsMzYuNDMsNDcuMlpNMy44NDMsMTcuMDcxYTQzLjEzNyw0My4xMzcsMCwwLDAsMy43NzgsOC4zNjhBNDEuMzQ1LDQxLjM0NSwwLDAsMCwxOC4xNjYsMzcuMjU5YTQ1LjYsNDUuNiwwLDAsMCwxNS44NjIsNy45MjNjMC40NCwwLjExNy45LDAuMTkzLDEuMzg1LDAuMjcybDAuNTY1LDAuMWMxLjA3NSwwLjE4OSwxLjkzMy0uMywzLjExOS0xLjA2M2EyNC44ODQsMjQuODg0LDAsMCwwLDYuOTkyLTYuOTU5YzAuMDI1LS4wMzcuMDQ4LTAuMDc2LDAuMDY5LTAuMTE1VjM3LjAyYTEuOTMsMS45MywwLDAsMC0uNjkxLTAuNnEtMi40NDUtMS41NTYtNC44NzUtMy4xMzZMMzkuMjI5LDMyLjRjLTAuMjY3LS4xNzItMC41MzEtMC4zNDctMC44LTAuNTIyLTAuNTE1LS4zNC0xLjAzLTAuNjgxLTEuNTU4LTFhMC43ODMsMC43ODMsMCwwLDAtMS4yMzEuM2wtMC4yNDkuMzljLTAuMjQzLjM4My0uNDk0LDAuNzc4LTAuNzgxLDEuMTU3bC0wLjA4NC4xMWMtMC43MjUuOTU4LTEuNDc2LDEuOTQ5LTIuMjc4LDIuODg1YTIsMiwwLDAsMS0yLjY1NC41Yy0wLjYyOC0uMy0xLjIzMy0wLjYwNy0xLjgtMC45MTlhNDAuNjMsNDAuNjMsMCwwLDEtMTMuNjQ4LTEyLjg4LDIuMTUsMi4xNSwwLDAsMSwuMS0yLjc1OSwyNi4zMzUsMjYuMzM1LDAsMCwxLDQuMzU4LTQuNDQzLDAuNjA2LDAuNjA2LDAsMCwwLC4xMzktMC44MTQsNzEuMDY1LDcxLjA2NSwwLDAsMC02LjgzNS04LjA5MywwLjg1OSwwLjg1OSwwLDAsMC0xLjI3NC0uMDY1Yy0wLjEyMS4xLS4yMzcsMC4yLTAuMzUzLDAuM0EyNC42MiwyNC42MiwwLDAsMCw1LjEsMTIuNTc0LDEwLjA2MSwxMC4wNjEsMCwwLDAsMy44NDMsMTUuOXYxLjE3M1pcIiBmaWxsPVwiI2ZmZlwiIC8+PC9zdmc+XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICA8c3Bhbj5jYWxsPC9zcGFuPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8dWwgY2xhc3M9XCJjb250YWN0LWJ1dHRvbiB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtZWRpdFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1zYXZlXCIgdHlwZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj5cbiAgICAgICAgICAgICAgICA8dGl0bGU+aWNvbiBjaGVjayAvIHNhdmU8L3RpdGxlPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjIuNTQxLDM5Ljk2N2EwLjgwNywwLjgwNywwLDAsMS0uNjI0LTAuM0w4Ljc4LDIzLjYzYTAuODA3LDAuODA3LDAsMSwxLDEuMjQ4LTEuMDIzTDIyLjQ1OSwzNy43ODdsMTcuNDU3LTI3LjM4YTAuODA3LDAuODA3LDAsMCwxLDEuMzYxLjg2N0wyMy4yMjEsMzkuNTk0YTAuODA3LDAuODA3LDAsMCwxLS42MzMuMzcxWlwiIGZpbGw9XCIjZmZmXCIgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICA8c3Bhbj5zYXZlPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJmbGV4LWF1dG9cIiB2YXJpYW50PVwiaGlkZS1jb250YWN0LWFkZCBzaG93LWNvbnRhY3QtZWRpdFwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+PHRpdGxlPmljb25zPC90aXRsZT48cGF0aCBkPVwiTTMzLjUzNCA0OS4yNzRIMTYuNjA4QTEwLjUgMTAuNSAwIDAgMSA2LjExOSAzOC43ODZWMjUuODk0QTEwLjUgMTAuNSAwIDAgMSAxNi42MDggMTUuNDA2aDIuNjQ3YTAuODA3IDAuODA3IDAgMSAxIDAgMS42MTRIMTYuNjA4YTguODg1IDguODg1IDAgMCAwLTguODc1IDguODc1VjM4Ljc4NmE4Ljg4NSA4Ljg4NSAwIDAgMCA4Ljg3NSA4Ljg3NUgzMy41MzRhOC44ODUgOC44ODUgMCAwIDAgOC44NzUtOC44NzVWMjUuODk0YTguODg1IDguODg1IDAgMCAwLTguODc1LTguODc1aC00LjJhMC44MDcgMC44MDcgMCAwIDEgMC0xLjYxNGg0LjJBMTAuNSAxMC41IDAgMCAxIDQ0LjAyMiAyNS44OTRWMzguNzg2QTEwLjUgMTAuNSAwIDAgMSAzMy41MzQgNDkuMjc0Wk0yNS4xIDMxLjdhMC44MDcgMC44MDcgMCAwIDEtMC44MDctMC44MDdWMS41MzJhMC44MDcgMC44MDcgMCAxIDEgMS42MTQgMHYyOS4zNkEwLjgwNyAwLjgwNyAwIDAgMSAyNS4xIDMxLjdaTTMzLjIxMyAxMC40ODJhMC44IDAuOCAwIDAgMS0wLjU3LTAuMjM2TDI1LjA3MSAyLjY3MyAxNy41IDEwLjI0NkEwLjgwNyAwLjgwNyAwIDEgMSAxNi4zNTggOS4xTDI0LjUgMC45NjJhMC44MyAwLjgzIDAgMCAxIDEuMTQxIDBMMzMuNzg0IDkuMUEwLjgwNyAwLjgwNyAwIDAgMSAzMy4yMTMgMTAuNDgyWlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmV4cG9ydDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIHZhcmlhbnQ9XCJoaWRlLWNvbnRhY3QtYWRkIHNob3ctY29udGFjdC1lZGl0XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1kZWxldGVcIiB0eXBlPVwic3VibWl0XCIgZm9ybWFjdGlvbj1cImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0cy8ke2N1cnJlbnRDb250YWN0LmlkfVwiICB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuaWR9XCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZGF0YS1uYW1lPVwiTGF5ZXIgMVwiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj48dGl0bGU+aWNvbnM8L3RpdGxlPjxsaW5lIHgxPVwiMzcuNTA5XCIgeTE9XCIxMi41MzFcIiB4Mj1cIjEyLjU3MlwiIHkyPVwiMzcuNDY5XCIgZmlsbD1cIiNmZmZcIiAvPjxwYXRoIGQ9XCJNMTIgMzguMDM5QTAuODA3IDAuODA3IDAgMCAxIDEyIDM2LjlMMzYuOTM5IDExLjk2MUEwLjgwNyAwLjgwNyAwIDAgMSAzOC4wOCAxMy4xTDEzLjE0MiAzOC4wMzlBMC44MDcgMC44MDcgMCAwIDEgMTIgMzguMDM5WlwiIGZpbGw9XCIjZmZmXCIgLz48bGluZSB4MT1cIjEyLjU3MlwiIHkxPVwiMTIuNTMxXCIgeDI9XCIzNy41MDlcIiB5Mj1cIjM3LjQ2OVwiIGZpbGw9XCIjZmZmXCIgLz48cGF0aCBkPVwiTTM2LjkzOCAzOC4wMzlMMTIgMTMuMWEwLjgwNyAwLjgwNyAwIDAgMSAxLjE0MS0xLjE0MUwzOC4wNzkgMzYuOUEwLjgwNyAwLjgwNyAwIDEgMSAzNi45MzggMzguMDM5WlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmRlbGV0ZTwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Zvcm0+XG48L2FydGljbGU+YDtcblxuICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gY29udGFjdEl0ZW1XcmFwcGVyO1xuICAgICAgY29uc3QgY29udGVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhY3QtaXRlbS53cmFwcGVyXCIpO1xuICAgICAgY29uc3QgYmFja0J1dHRvbiA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvbi5idXR0b24tYmFja1wiKTtcbiAgICAgIGNvbnN0IGVkaXRCdXR0b24gPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24uYnV0dG9uLWVkaXRcIik7XG4gICAgICBjb25zdCBkZWxldGVCdXR0b24gPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24uYnV0dG9uLWRlbGV0ZVwiKTtcbiAgICAgIGNvbnN0IGZvcm1FbG0gPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtLmNvbnRhY3QtZm9ybVwiKTtcbiAgICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1ldGhvZHMuY29udGFjdEl0ZW0uZWRpdCk7XG4gICAgICBiYWNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZXRob2RzLmNvbnRhY3RJdGVtLmhpZGUpO1xuICAgICAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZXRob2RzLmRhdGEuZGVsZXRlQ29udGFjdCk7XG5cbiAgICAgIGZvcm1FbG0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBtZXRob2RzLmRhdGEuc2F2ZUNvbnRhY3QpO1xuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuZXZlbnRMaXN0ZW5lciA9IHtcbiAgICBjb250YWN0TGlzdEJ1dHRvbjogZnVuY3Rpb24gKFxuICAgICAgZWxlbWVudE5vZGUsXG4gICAgICBjYWxsRnVuY3Rpb24sXG4gICAgICBsaXN0ZW5lciA9IFwiYWRkXCIsXG4gICAgICB0eXBlID0gXCJjbGlja1wiXG4gICAgKSB7XG4gICAgICBpZiAoZWxlbWVudE5vZGUgJiYgZWxlbWVudE5vZGUubGVuZ3RoID4gMCkge1xuICAgICAgICBPYmplY3Qua2V5cyhlbGVtZW50Tm9kZSlcbiAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXJbbGlzdGVuZXJdKGVsZW1lbnROb2RlW2tleV0sIGNhbGxGdW5jdGlvbiwgdHlwZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIChlbGVtZW50LCBjYWxsRnVuY3Rpb24sIHR5cGUgPSBcImNsaWNrXCIpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsRnVuY3Rpb24pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoZWxlbWVudCwgY2FsbEZ1bmN0aW9uLCB0eXBlID0gXCJjbGlja1wiKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbEZ1bmN0aW9uKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuY29udGFjdEl0ZW0gPSB7XG4gICAgdmlldzogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGxldCBmb3JtRmllbGRzZXQgPSBkYXRhLnF1ZXJ5U2VsZWN0b3IoXCJmaWVsZHNldFwiKTtcbiAgICAgIGxldCBkYXRhRWxtID0ge1xuICAgICAgICBlbGVtZW50OiBmb3JtRmllbGRzZXQsXG4gICAgICAgIGF0dHJpYnV0ZUtleTogXCJkaXNhYmxlZFwiLFxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJkaXNhYmxlZFwiLFxuICAgICAgfTtcbiAgICAgIG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGRhdGFFbG0pO1xuICAgIH0sXG5cbiAgICBlZGl0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZm9ybVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcImZpZWxkc2V0XCIpXG4gICAgICAgIC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGNvbnRhY3RJdGVtV3JhcHBlciA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0SXRlbVdyYXBwZXJcbiAgICAgICk7XG4gICAgICBjb25zdCBmb3JtRWxlbWVudCA9IGNvbnRhY3RJdGVtV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhY3QtZm9ybVwiKTtcbiAgICAgIGlmIChmb3JtRWxlbWVudCkge1xuICAgICAgICBjb250YWN0SXRlbVdyYXBwZXIucmVtb3ZlQ2hpbGQoZm9ybUVsZW1lbnQpO1xuICAgICAgICBjb250YWN0SXRlbVdyYXBwZXIucmVtb3ZlQXR0cmlidXRlKFwic3RhdGVcIik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuc2V0RWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lciA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lclxuICAgICk7XG4gICAgZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtQ29udGFpbmVyXG4gICAgKTtcblxuICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICBcImNvbnRhY3QtbGlzdC1pdGVtcyB1bml0XCJcbiAgICApWzBdO1xuXG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIpIHtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0ID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc1VuaXRcbiAgICAgICk7XG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyQnV0dG9uID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdEJ1dHRvbkNvbnRhaW5lclxuICAgICAgKTtcblxuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1NlYXJjaENvbnRhaW5lciA9IGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RMaXN0SXRlbXNTZWFyY2hDb250YWluZXJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyKSB7XG4gICAgICBlbGVtZW50cy5jb250YWN0SXRlbVVuaXQgPSBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdEl0ZW1Vbml0XG4gICAgICApO1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXJCdXR0b24gPSBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdEJ1dHRvbkNvbnRhaW5lclxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5lbGVtZW50V2lkdGggPSB7XG4gICAgZml4ZWRDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIG1ldGhvZHMuc2V0RWxlbWVudHMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmNvbnRhY3RMaXN0SXRlbXMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lckxpc3RJdGVtcygpO1xuICAgICAgbWV0aG9kcy5lbGVtZW50V2lkdGguYnV0dG9uQ29udGFpbmVySXRlbSgpO1xuICAgIH0sXG4gICAgY29udGFjdExpc3RJdGVtczogZnVuY3Rpb24gKCkge1xuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuc3R5bGUud2lkdGggPVxuICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLmNsaWVudFdpZHRoICsgXCJweFwiO1xuICAgIH0sXG4gICAgYnV0dG9uQ29udGFpbmVyTGlzdEl0ZW1zOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQpIHtcbiAgICAgICAgbGV0IGNvbnRhY3RMaXN0SXRlbXNVbml0V2lkdGggPVxuICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0LmNsaWVudFdpZHRoO1xuICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyQnV0dG9uLnN0eWxlLndpZHRoID1cbiAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoICsgXCJweFwiO1xuICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyLnN0eWxlLndpZHRoID1cbiAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoICsgXCJweFwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgYnV0dG9uQ29udGFpbmVySXRlbTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKFxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lciAmJlxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lckJ1dHRvblxuICAgICAgKSB7XG4gICAgICAgIGxldCBjb250YWN0SXRlbUNvbnRhaW5lcldpZHRoID1cbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXJCdXR0b24pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyQnV0dG9uW2tleV0uc3R5bGUud2lkdGggPVxuICAgICAgICAgICAgY29udGFjdEl0ZW1Db250YWluZXJXaWR0aCArIFwicHhcIjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcblxuICBtZXRob2RzLm5hdmlnYXRpb24gPSB7XG4gICAgc2V0RXZlbnRMaXN0bmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBidXR0b25zID0gbWV0aG9kcy5uYXZpZ2F0aW9uLmdldE5hdmlnYXRpb25MaW5rcygpO1xuICAgICAgT2JqZWN0LmtleXMoYnV0dG9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGJ1dHRvbnNba2V5XS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWV0aG9kcy5uYXZpZ2F0aW9uLmV2ZW50TGlzdGVuZXIuYWRkKTtcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZXROYXZpZ2F0aW9uTGlua3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG5hdmlnYXRpb25CdXR0b24gPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIi5uYXZpZ2F0aW9uIGFcIlxuICAgICAgKTtcbiAgICAgIHJldHVybiBuYXZpZ2F0aW9uQnV0dG9uO1xuICAgIH0sXG4gICAgZXZlbnRMaXN0ZW5lcjoge1xuICAgICAgYWRkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IG1ldGhvZHMubmF2aWdhdGlvbi5nZXROYXZpZ2F0aW9uTGlua3MoKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYnV0dG9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgbGV0IGRhdGFFbG0gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiBidXR0b25zW2tleV0sXG4gICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiaXMtYWN0aXZlXCIsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoYnV0dG9uc1trZXldICE9PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGVWYWx1ZShkYXRhRWxtKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoZGF0YUVsbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBtZXRob2RzLmNvbnRhY3RJdGVtLmhpZGUoKTtcbiAgICAgICAgbGV0IHVybCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuc2VhcmNoIHx8IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIHVybClcbiAgICAgICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzRnJvbUFwaSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcbiAgICB2aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgICBlbGVtZW50cy52aWV3cG9ydCA9XG4gICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyID0gZm91bmQ7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuc2VhcmNoID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzZWFyY2hQYXJhbSA9IG1ldGhvZHMuZGF0YS5zZXJpYWxpemUoZXZlbnQuY3VycmVudFRhcmdldC5lbGVtZW50cyk7XG4gICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzRnJvbUFwaShzZWFyY2hQYXJhbSk7XG4gICAgLy8gICAgY29uc29sZS5sb2coKTtcblxuICB9XG5cbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyKSB7XG4gICAgICBtZXRob2RzLnNldEVsZW1lbnRzKCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBtZXRob2RzLmVsZW1lbnRXaWR0aC5maXhlZENvbnRhaW5lcik7XG5cbiAgICAgIGNvbnN0IGJ1dHRvbkFkZENvbnRhY3QgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBcIi5idXR0b24tYWRkXCJcbiAgICAgICk7XG4gICAgICBPYmplY3Qua2V5cyhidXR0b25BZGRDb250YWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgYnV0dG9uQWRkQ29udGFjdFtrZXldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZXRob2RzLnBhZ2UuYWRkQ29udGFjdCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VhcmNoRm9ybSA9IGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiZm9ybVt2YXJpYW50PSdmb3JtLXNlYXJjaCddXCJcbiAgICAgICk7XG4gICAgICBzZWFyY2hGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbWV0aG9kcy5zZWFyY2gpO1xuICAgICAgbWV0aG9kcy5uYXZpZ2F0aW9uLnNldEV2ZW50TGlzdG5lcigpO1xuXG4gICAgICAvLyBnZXQgYW5kIHNob3cgY29udGFjdCBsaXN0XG4gICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBtZXRob2RzLmVsZW1lbnRXaWR0aC5maXhlZENvbnRhaW5lcik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5jb250YWluZXIsXG4gIH07XG59KSgpO1xuIiwidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XG5cbm1vZHVsZXNbXCJmaWxlLXVwbG9hZFwiXSA9IChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBlbGVtZW50cywgbWV0aG9kcywgc2VsZWN0b3JzLCBzdGF0ZSwgY29udGFjdEl0ZW1zO1xuXG4gICAgZWxlbWVudHMgPSB7fTtcbiAgICBtZXRob2RzID0ge307XG4gICAgc2VsZWN0b3JzID0ge1xuICAgICAgICB2aWV3cG9ydDogXCJib2R5XCIsXG4gICAgICAgIGNvbnRhaW5lcjogJ1t2YXJpYW50PVwiZmlsZS11cGxvYWRcIl0nLFxuICAgIH07XG4gICAgc3RhdGUgPSB7fTtcblxuICAgIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgICAgICB2aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50O1xuICAgICAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgZWxlbWVudHMud2luZG93ID0gd2luZG93O1xuICAgICAgICAgICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgICAgICAgICAgZWxlbWVudHMudmlld3BvcnQgPVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICAgICAgICAgIGVsZW1lbnRzLmZpbGVVcGxvYWRDb250YWluZXIgPSBmb3VuZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMuaW5pdCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgICAgIGlmIChlbGVtZW50cy5maWxlVXBsb2FkQ29udGFpbmVyKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhlbGVtZW50cy5maWxlVXBsb2FkQ29udGFpbmVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlVXBsb2FkID0gbmV3IGZpbGVVcGxvYWRTaG93UHJldmlldXcoXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLmZpbGVVcGxvYWRDb250YWluZXJba2V5XVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZWxlbWVudHMuZmlsZVVwbG9hZCkge31cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgICAgIGluaXQ6IG1ldGhvZHMuaW5pdCxcbiAgICAgICAgdW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuICAgICAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lcixcbiAgICB9O1xufSkoKTsiLCJ2YXIgbW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge307XG52YXIgbWV0aG9kcyA9IHt9O1xuXG5tb2R1bGVzWydjdXN0b20tZm9ybSddID0gKGZ1bmN0aW9uICgpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGVsZW1lbnRzLFxuXHRcdG1ldGhvZHMsXG5cdFx0c2VsZWN0b3JzLFxuXHRcdHN0YXRlO1xuXG5cdGVsZW1lbnRzID0ge307XG5cdG1ldGhvZHMgPSB7fTtcblx0c2VsZWN0b3JzID0ge1xuXHRcdCd2aWV3cG9ydCc6ICdib2R5JyxcblxuXHRcdCdjb250YWluZXInOiAnLmNvbnRhaW5lclt2YXJpYW50PVwiY3VzdG9tLWZvcm1cIl0nLFxuXG5cdFx0J2Zvcm1Db250YWluZXInOiAnLmNvbnRhaW5lclt2YXJpYW50fj1cImN1c3RvbS1mb3JtXCJdJyxcblx0XHQnZm9ybUVsZW1lbnQnOiAnW3ZhcmlhbnQ9XCJjdXN0b20tZm9ybVwiXSBmb3JtJyxcblx0XHQnZm9ybUZ1bGxGb3JtJzogJ1t2YXJpYW50PVwiZnVsbC1mb3JtXCJdJyxcblxuXHRcdCdmb3JtQnV0dG9uJzogJy5zdWJtaXQtYnV0dG9uJyxcblxuXHRcdCdkYXRlRmllbGRDb250YWluZXInOiAnW3ZhcmlhbnQ9XCJkYXRlXCJdJyxcblxuXHRcdCdyZXF1aXJlZEZpZWxkcyc6ICdpbnB1dFtkYXRhLXJlcXVpcmVkXScsXG5cdFx0J2Zvcm1Qb3N0ZWRDb250YWluZXInOiAnW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm0tcG9zdGVkXCJdJyxcblx0XHQnZXJyb3JNZXNzYWdlQ29udGFpbmVyJzogJ1t2YXJpYW50fj1cImVycm9yLW1lc3NhZ2VcIl0nXG5cdH07XG5cdHN0YXRlID0ge307XG5cblx0bWV0aG9kcy5odG1sRWxlbWVudCA9IHtcblx0XHRnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRyZXR1cm4gKGRhdGEuZWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXkpIHx8IGZhbHNlKTtcblx0XHR9LFxuXHRcdGhhc0F0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSwgYXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdFx0YXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcblx0XHRcdH1cblx0XHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoZGF0YS5hdHRyaWJ1dGVWYWx1ZSwgJ2dpJyk7XG5cdFx0XHRyZXR1cm4gcmVnZXgudGVzdChhdHRyaWJ1dGVWYWx1ZSk7XG5cdFx0fSxcblx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xuXG5cdFx0XHRpZiAoIW1ldGhvZHMuaHRtbEVsZW1lbnQuaGFzQXR0cmlidXRlVmFsdWUoZGF0YSwgYXR0cmlidXRlVmFsdWUpKSB7XG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0XHRcdGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlVmFsdWUgKyAnICcgKyBkYXRhLmF0dHJpYnV0ZVZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGF0dHJpYnV0ZVZhbHVlID0gZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhLmVsZW1lbnQuc2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XG5cdFx0XHR2YXIgaGFzQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0F0dHJpYnV0ZVZhbHVlKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKTtcblx0XHRcdHZhciB2YWx1ZVJlbW92ZWQgPSBmYWxzZTtcblx0XHRcdGlmIChoYXNBdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKGRhdGEuYXR0cmlidXRlVmFsdWUsICdnaScpO1xuXHRcdFx0XHR2YXIgbmV3QXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZS5yZXBsYWNlKHJlZ2V4LCAnJykudHJpbSgpO1xuXHRcdFx0XHRpZiAobmV3QXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdFx0XHRkYXRhLmVsZW1lbnQuc2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5LCBuZXdBdHRyaWJ1dGVWYWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGF0YS5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFsdWVSZW1vdmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWx1ZVJlbW92ZWQ7XG5cdFx0fSxcblx0XHR0b2dnbGVBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGRhdGEuYXR0cmlidXRlVmFsdWUgPSBkYXRhLnJlbW92ZUF0dHJpYnV0ZVZhbHVlO1xuXHRcdFx0dmFyIHZhbHVlVG9nZ2xlZCA9IGZhbHNlO1xuXHRcdFx0dmFyIHJlbW92ZUF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblxuXHRcdFx0aWYgKHJlbW92ZUF0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdGRhdGEuYXR0cmlidXRlVmFsdWUgPSBkYXRhLmFkZEF0dHJpYnV0ZVZhbHVlO1xuXHRcdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXHRcdFx0XHR2YWx1ZVRvZ2dsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlVG9nZ2xlZDtcblx0XHR9LFxuXHRcdGFkZFN0YXRlVmFsdWVJbnZhbGlkOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXG5cdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcblx0XHRcdFx0YXR0cmlidXRlVmFsdWU6ICdpbnZhbGlkJ1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoZGF0YSk7XG5cdFx0fSxcblx0XHRyZW1vdmVTdGF0ZVZhbHVlSW52YWxpZDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdGF0dHJpYnV0ZVZhbHVlOiAnaW52YWxpZCdcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gbWV0aG9kcy5odG1sRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5maWVsZEVsZW1lbnQgPSB7XG5cdFx0Zm9jdXNPdXQ6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0dmFyIGZpZWxkRGF0YSA9IHtcblx0XHRcdFx0bmFtZTogZXZlbnQuY3VycmVudFRhcmdldC5uYW1lLFxuXHRcdFx0XHR2YWx1ZXM6IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUsXG5cdFx0XHRcdHZhbHVlQ2hlY2s6IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC52YWx1ZUNoZWNrIHx8IGV2ZW50LmN1cnJlbnRUYXJnZXQudHlwZVxuXHRcdFx0fTtcblx0XHRcdHZhciB2YWxpZGF0aW9uUmVzcG9uc2UgPSBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLmZpZWxkVmFsaWRhdGlvbihmaWVsZERhdGEpO1xuXHRcdFx0aWYgKHZhbGlkYXRpb25SZXNwb25zZS5oYXNFcnJvcikge1xuXHRcdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LmFkZFN0YXRlVmFsdWVJbnZhbGlkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0fVxuXHRcdFx0bWV0aG9kcy5lcnJvck1lc3NhZ2Uuc2V0U3RhdGUuaGlkZGVuKGV2ZW50LmN1cnJlbnRUYXJnZXQuZm9ybSk7XG5cdFx0fSxcblx0XHRmb2N1c0luOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdG1ldGhvZHMuaHRtbEVsZW1lbnQucmVtb3ZlU3RhdGVWYWx1ZUludmFsaWQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZm9ybSA9IHtcblx0XHRjbGlja0hhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuaXNTdGF0ZUludmFsaWQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHR2YXIgZm9ybURhdGEgPSBtZXRob2RzLmZvcm0uc2VyaWFsaXplKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0dmFyIGVycm9yRGF0YSA9IG1ldGhvZHMuZm9ybVZhbGlkYXRpb24uZm9ybURhdGEoZm9ybURhdGEucG9zdERhdGEpO1xuXG5cdFx0XHRpZiAoZXJyb3JEYXRhIHx8IHN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZCkge1xuXHRcdFx0XHRtZXRob2RzLmZvcm0uZXJyb3JIYW5kbGVyKGVycm9yRGF0YSwgZXZlbnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHR9IGVsc2UgaWYgKCFlcnJvckRhdGEgJiYgIXN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZCkge1xuXHRcdFx0XHRtZXRob2RzLmZvcm0ucG9zdEhhbmRsZXIoZm9ybURhdGEsIGV2ZW50LmN1cnJlbnRUYXJnZXQuYWN0aW9uKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0cG9zdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtRGF0YSwgYWN0aW9uKSB7XG5cdFx0XHRtZXRob2RzLnNlbmREYXRhLnhocignUE9TVCcsIGFjdGlvbiwgZm9ybURhdGEpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0dmFyIGNhbGxiYWNrSnNvblhociA9IG1ldGhvZHMuc2VuZERhdGEuY2FsbGJhY2suc3VjY2VzcyhkYXRhKTtcblx0XHRcdFx0XHRtZXRob2RzLmZvcm0uY2FsbGJhY2tIYW5kbGVyKGNhbGxiYWNrSnNvblhocik7XG5cdFx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdGNhbGxiYWNrSGFuZGxlcjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdGlmIChkYXRhLmVycm9yRGF0YSAmJiBPYmplY3Qua2V5cyhkYXRhLmVycm9yRGF0YSkubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR2YXIgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm1bbmFtZT1cIicgKyBkYXRhLmZvcm1OYW1lICsgJ1wiXScpO1xuXHRcdFx0XHRtZXRob2RzLmZvcm0uZXJyb3JIYW5kbGVyKGRhdGEuZXJyb3JEYXRhLCBmb3JtKTtcblx0XHRcdH0gZWxzZSBpZiAoZGF0YS5zdWNjZXNEYXRhKSB7XG5cdFx0XHRcdGlmIChkYXRhLnN1Y2Nlc0RhdGEucGFnZSAhPT0gJycpIHtcblx0XHRcdFx0XHQvLyBnbyB0byBuZXcgcGFnZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1ldGhvZHMuZm9ybS5zdWNjZXNIYW5kbGVyKGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qXG5cdFx0XHRcdCQoZWxlbWVudHMuYm9keSkudHJpZ2dlcihuZXcgalF1ZXJ5LkV2ZW50KCduYXZpZ2F0ZScsIHtcblx0XHRcdFx0XHR1cmw6IGRhdGEuc3VjY2VzRGF0YS5wYWdlLFxuXHRcdFx0XHRcdGFuaW1hdGlvbjogJ2JsdXJpbicsXG5cdFx0XHRcdFx0d2luZG93TmFtZTogbnVsbCxcblx0XHRcdFx0XHR0YXJnZXQ6IG51bGxcblx0XHRcdFx0fSkpO1xuXHRcdFx0XHQqL1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRlcnJvckhhbmRsZXI6IGZ1bmN0aW9uIChlcnJvckRhdGEsIGVsZW1lbnQpIHtcblx0XHRcdE9iamVjdC5rZXlzKGVycm9yRGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdHZhciBzZWxlY3RvciA9IGVycm9yRGF0YVtrZXldLmRhdGEuZWxlbWVudFR5cGUgKyAnW25hbWU9XCInICsgZXJyb3JEYXRhW2tleV0uZGF0YS5uYW1lICsgJ1wiXSc7XG5cdFx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRTdGF0ZVZhbHVlSW52YWxpZChpbnB1dCk7XG5cdFx0XHR9KTtcblx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnNldFN0YXRlLmFjdGl2ZShlbGVtZW50KTtcblx0XHR9LFxuXG5cdFx0c3VjY2VzSGFuZGxlcjogZnVuY3Rpb24gKGRhdGEpIHtcblxuXHRcdFx0dmFyIGZvcm1TdWNjZXMgPSBlbGVtZW50cy5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lKj1cIicgKyBkYXRhLnN1Y2Nlc0RhdGEuZm9ybU5hbWUgKyAnXCJdJyk7XG5cdFx0XHR2YXIgZm9ybVN1Y2Nlc0NvbnRhaW5lciA9IGZvcm1TdWNjZXMuY2xvc2VzdCgnW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm1cIl0nKTtcblxuXHRcdFx0dmFyIGRhdGFGb3JtID0ge1xuXHRcdFx0XHRlbGVtZW50OiBmb3JtU3VjY2VzLFxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJyxcblx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdhY3RpdmUnXG5cdFx0XHR9O1xuXG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGFGb3JtKTtcblxuXHRcdFx0dmFyIGZvcm1Qb3N0ZWQgPSBmb3JtU3VjY2VzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmZvcm1Qb3N0ZWRDb250YWluZXIpO1xuXG5cdFx0XHR2YXIgZGF0YVBvc3RlZENvbnRhaW5lciA9IHtcblx0XHRcdFx0ZWxlbWVudDogZm9ybVBvc3RlZCxcblx0XHRcdFx0YXR0cmlidXRlS2V5OiAnc3RhdGUnLFxuXHRcdFx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogJ2FjdGl2ZScsXG5cdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJ1xuXHRcdFx0fTtcblxuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhUG9zdGVkQ29udGFpbmVyKTtcblx0XHR9LFxuXG5cdFx0Z2V0VmFsdWVPZkVsZW1lbnQ6IHtcblx0XHRcdGlucHV0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgdmFsdWU7XG5cdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgJiYgKGVsZW1lbnQudHlwZSA9PT0gJ3JhZGlvJyB8fCBlbGVtZW50LnR5cGUgPT09ICdjaGVja2JveCcpKSB7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudC50eXBlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHR9LFxuXG5cdFx0XHR0ZXh0YXJlYTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsdWUudHJpbSgpO1xuXHRcdFx0fSxcblxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgdmFsdWU7XG5cdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlID09PSAnc2VsZWN0LW9uZScpIHtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuXHRcdFx0XHRcdHZhbHVlID0gW107XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQudmFsdWUgJiYgZWxlbWVudC5vcHRpb25zKSB7XG5cdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhlbGVtZW50Lm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbktleSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5vcHRpb25zW29wdGlvbktleV0uc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5wdXNoKGVsZW1lbnQub3B0aW9uc1tvcHRpb25LZXldLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2VyaWFsaXplOiBmdW5jdGlvbiAoZm9ybSkge1xuXHRcdFx0dmFyIGZvcm1EYXRhID0ge1xuXHRcdFx0XHRmb3JtTmFtZTogZm9ybS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCBudWxsLFxuXHRcdFx0XHRhY3Rpb246IGZvcm0uZ2V0QXR0cmlidXRlKCdhY3Rpb24nKSB8fCBudWxsLFxuXHRcdFx0XHRwb3N0RGF0YToge31cblx0XHRcdH07XG5cblx0XHRcdGZvcm1EYXRhLnBvc3REYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9ybS5lbGVtZW50cykucmVkdWNlKGZ1bmN0aW9uIChkYXRhLCBpdGVtKSB7XG5cdFx0XHRcdGlmIChpdGVtICYmIGl0ZW0ubmFtZSkge1xuXHRcdFx0XHRcdGlmICghZGF0YVtpdGVtLm5hbWVdKSB7XG5cdFx0XHRcdFx0XHRkYXRhW2l0ZW0ubmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IGl0ZW0udHlwZSxcblx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS5uYW1lLFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50VHlwZTogaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0XHRyZXF1aXJlZDogaXRlbS5kYXRhc2V0LnJlcXVpcmVkID09PSAndHJ1ZScsXG5cdFx0XHRcdFx0XHRcdHZhbHVlQ2hlY2s6IGl0ZW0uZGF0YXNldC52YWx1ZUNoZWNrIHx8IGl0ZW0udHlwZSxcblx0XHRcdFx0XHRcdFx0dmFsdWVLZXk6IGl0ZW0uZGF0YXNldC52YWx1ZUtleSB8fCAwLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZXM6IFtdXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbaXRlbS5uYW1lXS52YWx1ZUtleSA9PT0gXCJudW1iZXJcIiAmJiBpc0Zpbml0ZShkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpICYmIE1hdGguZmxvb3IoZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5KSA9PT0gZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5KSB7XG5cdFx0XHRcdFx0XHRkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkrKztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRpZiAobWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSkgJiYgaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JyAmJiBpdGVtLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXMgPSBtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGF0YXNldC52YWx1ZUtleSkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXNbaXRlbS5kYXRhc2V0LnZhbHVlS2V5XSA9IG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXMucHVzaChtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCB7fSk7XG5cdFx0XHRyZXR1cm4gZm9ybURhdGE7XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZm9ybVZhbGlkYXRpb24gPSB7XG5cdFx0Zm9ybURhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgZXJyb3JEYXRhID0ge307XG5cdFx0XHRPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKGRhdGFba2V5XS5yZXF1aXJlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHZhciBmaWVsZERhdGEgPSB7XG5cdFx0XHRcdFx0XHRuYW1lOiBkYXRhW2tleV0sXG5cdFx0XHRcdFx0XHR2YWx1ZXM6IGRhdGFba2V5XS52YWx1ZXNbMF0sXG5cdFx0XHRcdFx0XHR2YWx1ZUNoZWNrOiBkYXRhW2tleV0udmFsdWVDaGVja1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IG1ldGhvZHMuZm9ybVZhbGlkYXRpb24uZmllbGRWYWxpZGF0aW9uKGZpZWxkRGF0YSk7XG5cdFx0XHRcdFx0aWYgKHZhbGlkYXRpb25SZXNwb25zZS5oYXNFcnJvcikge1xuXHRcdFx0XHRcdFx0ZXJyb3JEYXRhW2tleV0gPSB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IGRhdGFba2V5XSxcblx0XHRcdFx0XHRcdFx0bWVzc2FnZTogdmFsaWRhdGlvblJlc3BvbnNlLmVycm9yTWVzc2FnZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIChPYmplY3Qua2V5cyhlcnJvckRhdGEpLmxlbmd0aCA+IDAgPyBlcnJvckRhdGEgOiBmYWxzZSk7XG5cdFx0fSxcblxuXHRcdGZpZWxkVmFsaWRhdGlvbjogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciB2YWxpZGF0aW9uUmVzcG9uc2UgPSB7XG5cdFx0XHRcdGhhc0Vycm9yOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3JNZXNzYWdlOiBudWxsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIW1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuaXNOb3RFbXB0eShkYXRhLnZhbHVlcykpIHtcblx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yID0gdHJ1ZTtcblx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmVycm9yTWVzc2FnZSA9IGRhdGEubmFtZSArICcgZmllbGQgaXMgZW1wdHknO1xuXHRcdFx0fSBlbHNlIGlmIChtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlLmlzTm90RW1wdHkoZGF0YS52YWx1ZXMpICYmIHR5cGVvZiBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlW2RhdGEudmFsdWVDaGVja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0aWYgKCFtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlW2RhdGEudmFsdWVDaGVja10oZGF0YS52YWx1ZXMpKSB7XG5cdFx0XHRcdFx0dmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yID0gdHJ1ZTtcblx0XHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlID0gZGF0YS5uYW1lICsgJyBmaWVsZCBpcyBub3QgY29ycmVjdCBmaWxsZWQnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsaWRhdGlvblJlc3BvbnNlO1xuXHRcdH0sXG5cblx0XHR2YWxpZGF0aW9uVHlwZToge1xuXHRcdFx0aXNOb3RFbXB0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciB2YWx1ZUlzTm90RW1wdHkgPSB0cnVlO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dmFsdWVJc05vdEVtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA+IDApIHx8IHZhbHVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSB0cnVlO1xuXHRcdFx0XHRcdHZhbHVlSXNOb3RFbXB0eSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWVJc05vdEVtcHR5ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlSXNOb3RFbXB0eTtcblx0XHRcdH0sXG5cblx0XHRcdHRleHQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cblx0XHRcdG51bWJlcjogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gL15cXGQrJC87XG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWxwaGFiZXRpYzogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gL15cXGQrJC87XG5cdFx0XHRcdHJldHVybiAhcGF0dGVybi50ZXN0KHZhbHVlKTtcblx0XHRcdH0sXG5cblx0XHRcdGVtYWlsOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG5cblx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG5cdFx0XHR9LFxuXG5cdFx0XHR0ZWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcGF0dGVybiA9IC9eKD86XFwrXFxkezEsM318MFxcZHsxLDN9fDAwXFxkezEsMn0pPyg/Olxccz9cXChcXGQrXFwpKT8oPzpbLVxcL1xccy5dfFxcZCkrJC87XG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0ZGF0ZUZ1dHVyZTogZnVuY3Rpb24gKGRhdGUpIHtcblx0XHRcdFx0ZGF0ZS5kYXkgPSBwYXJzZUludChkYXRlLmRheSwgMTApO1xuXHRcdFx0XHRkYXRlLm1vbnRoID0gcGFyc2VJbnQoZGF0ZS5tb250aCwgMTApIC0gMTtcblx0XHRcdFx0ZGF0ZS55ZWFyID0gcGFyc2VJbnQoZGF0ZS55ZWFyLCAxMCkgKyAyMDAwO1xuXG5cdFx0XHRcdHZhciB0ZW1wID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSk7XG5cdFx0XHRcdHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuXG5cdFx0XHRcdGlmIChub3cgPCB0ZW1wICYmIHRlbXAuZ2V0RGF0ZSgpID09PSBkYXRlLmRheSAmJiB0ZW1wLmdldE1vbnRoKCkgPT09IGRhdGUubW9udGggJiYgdGVtcC5nZXRGdWxsWWVhcigpID09PSBkYXRlLnllYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLnNlbmREYXRhID0ge1xuXHRcdHhocjogZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhKSB7XG5cdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXHRcdFx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuXHRcdFx0XHRyZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KHJlcXVlc3Quc3RhdHVzVGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmVqZWN0KHJlcXVlc3Quc3RhdHVzVGV4dCk7XG5cdFx0XHRcdH07XG5cblxuXHRcdFx0XHR2YXIgcmVzcG9uc2VEYXRhID0ge1xuXHRcdFx0XHRcdHN1Y2Nlc0RhdGE6IHtcblx0XHRcdFx0XHRcdHBhZ2U6ICcnLFxuXHRcdFx0XHRcdFx0Zm9ybU5hbWU6IGRhdGEuZm9ybU5hbWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zZVR4dDogJ0JlZGFua3Qgdm9vciBoZXQgaW52dWxsZW4uJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXNwb25zZURhdGEgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlRGF0YSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH0sXG5cdFx0Y2FsbGJhY2s6IHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuZXJyb3JNZXNzYWdlID0ge1xuXHRcdHNldFN0YXRlOiB7XG5cdFx0XHRoaWRkZW46IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nLFxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJ1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRtZXRob2RzLmVycm9yTWVzc2FnZS50b2dnbGVTdGF0ZShkYXRhKTtcblx0XHRcdH0sXG5cdFx0XHRhY3RpdmU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdhY3RpdmUnLFxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnRvZ2dsZVN0YXRlKGRhdGEpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0U3RhdGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5lcnJvck1lc3NhZ2VDb250YWluZXIpLmdldEF0dHJpYnV0ZSgnc3RhdGUnKTtcblx0XHR9LFxuXHRcdHRvZ2dsZVN0YXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblx0XHR9XG5cdH07XG5cblxuXHRtZXRob2RzLmRhdGVTZWxlY3RvciA9IHtcblx0XHRmdWxsQ2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHR2YXIgZGF0ZSA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNvbnZlcnRGdWxsVG9TZXBlcmF0ZWQoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUudmFsdWUpO1xuXHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yRGF5LnZhbHVlID0gZGF0ZS5kYXk7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JNb250aC52YWx1ZSA9IGRhdGUubW9udGg7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyLnZhbHVlID0gZGF0ZS55ZWFyLnRvU3RyaW5nKCkuc2xpY2UoLTIpO1xuXHRcdH0sXG5cblx0XHRjaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHZhciBlbGVtZW50O1xuXG5cdFx0XHQvLyBjYW5jZWwga2V5dXAtZXZlbnQgaWYga2V5IHdhcyBub3QgYSBudW1iZXIgb3IgVEFCIG9yIEVOVEVSXG5cdFx0XHRpZiAobWV0aG9kcy5kYXRlU2VsZWN0b3IudGVzdEtleVVwRXZlbnQoZXZlbnQpKSB7XG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnRlc3RWYWx1ZXMoKTtcblx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuYXBwbHlTdGF0ZSgpO1xuXG5cdFx0XHRcdGlmIChldmVudC50eXBlID09PSAna2V5dXAnIHx8IGV2ZW50LnR5cGUgPT09ICdrZXlkb3duJykge1xuXHRcdFx0XHRcdGVsZW1lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudC52YWx1ZS5sZW5ndGggPj0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubWF4SW5wdXRMZW5ndGgoZWxlbWVudCkpICYmIChldmVudC5rZXlDb2RlICE9PSAxNikgJiYgKGV2ZW50LmtleUNvZGUgIT09IDkpICYmIChldmVudC5rZXlDb2RlICE9PSA4KSkge1xuXHRcdFx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuanVtcFRvTmV4dElucHV0KGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdGhpcyBpcyBhIGtleWRvd24gYmVpbmcgY2FuY2VsbGVkLCB0aHVzIG5vIGtleXVwIG9jY3VycyBvbiB0aGlzICdjaGFuZ2UnXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0ZXN0VmFsdWVzOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHN0YXRlLmFnZSA9IHtcblx0XHRcdFx0ZGF5OiBlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkudmFsdWUsXG5cdFx0XHRcdG1vbnRoOiBlbGVtZW50cy5kYXRlU2VsZWN0b3JNb250aC52YWx1ZSxcblx0XHRcdFx0eWVhcjogZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhci52YWx1ZVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHN0YXRlLmFnZS5kYXkgJiYgc3RhdGUuYWdlLm1vbnRoICYmIHN0YXRlLmFnZS55ZWFyKSB7XG5cdFx0XHRcdGlmIChtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlLmRhdGVGdXR1cmUoc3RhdGUuYWdlKSkge1xuXHRcdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ3ZhbGlkJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdpbnZhbGlkJztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChzdGF0ZS5hZ2UuZGF5IHx8IHN0YXRlLmFnZS5tb250aCB8fCBzdGF0ZS5hZ2UueWVhcikge1xuXHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdwcm9ncmVzcyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdpbml0aWFsJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIChzdGF0ZS5hZ2VTdGF0ZSA9PT0gJ3ZhbGlkJyk7XG5cdFx0fSxcblxuXHRcdHRlc3RGdWxsRGF0ZVN1cHBvcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUudHlwZSA9PT0gJ2RhdGUnKTtcblx0XHR9LFxuXG5cdFx0dGVzdEtleVVwRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0dmFyIGlzS2V5VXAgPSAoZXZlbnQudHlwZSA9PT0gJ2tleWRvd24nKTtcblx0XHRcdHZhciBpc1RhYiA9IChldmVudC5rZXlDb2RlID09PSA5KTtcblx0XHRcdHZhciBpc0VudGVyID0gKGV2ZW50LmtleUNvZGUgPT09IDEzKTtcblx0XHRcdHZhciBpc0JhY2tzcGFjZSA9IChldmVudC5rZXlDb2RlID09PSA4KTtcblx0XHRcdHZhciBpc0RlbGV0ZSA9IChldmVudC5rZXlDb2RlID09PSA0Nik7XG5cdFx0XHR2YXIgaXNOdW1lcmljID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKS5tYXRjaCgvWzAtOV0vKTtcblx0XHRcdHZhciBpc051bXBhZCA9IChldmVudC5rZXlDb2RlID49IDk2KSAmJiAoZXZlbnQua2V5Q29kZSA8PSAxMDUpO1xuXHRcdFx0dmFyIGlzTnVtQW5kcm9pZCA9IChldmVudC5rZXlDb2RlID09PSAyMjkpO1xuXG5cdFx0XHRpZiAoIWlzS2V5VXApIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpc0tleVVwICYmIChpc1RhYiB8fCBpc0VudGVyIHx8IGlzTnVtZXJpYyB8fCBpc0JhY2tzcGFjZSB8fCBpc0RlbGV0ZSB8fCBpc051bXBhZCB8fCBpc051bUFuZHJvaWQpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjb252ZXJ0RnVsbFRvU2VwZXJhdGVkOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHZhbHVlID0gbmV3IERhdGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZGF5OiB2YWx1ZS5nZXREYXRlKCksXG5cdFx0XHRcdG1vbnRoOiB2YWx1ZS5nZXRNb250aCgpICsgMSxcblx0XHRcdFx0eWVhcjogdmFsdWUuZ2V0RnVsbFllYXIoKVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tJbnB1dExlbmd0aDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudEVsZW1lbnQudmFsdWUubGVuZ3RoO1xuXHRcdH0sXG5cblx0XHRtYXhJbnB1dExlbmd0aDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyk7XG5cdFx0fSxcblxuXHRcdG5leHRJbnB1dDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW5leHRmaWVsZCcpO1xuXHRcdH0sXG5cblx0XHRqdW1wVG9OZXh0SW5wdXQ6IGZ1bmN0aW9uIChjdXJyZW50RWxlbWVudCkge1xuXHRcdFx0dmFyIG5leHRJbnB1dERhdGEgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5uZXh0SW5wdXQoY3VycmVudEVsZW1lbnQpIHx8IHVuZGVmaW5lZDtcblx0XHRcdHZhciBlbGVtZW50VG9Gb2N1cyA9IG5leHRJbnB1dERhdGEgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0SW5wdXREYXRhKSA6IHVuZGVmaW5lZDtcblxuXHRcdFx0aWYgKG5leHRJbnB1dERhdGEgJiYgZWxlbWVudFRvRm9jdXMpIHtcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZGF0ZUlucHV0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdFx0dmFyIGN1cnJlbnQgPSBvcHRpb25zLmN1cnJlbnQ7XG5cdFx0XHR2YXIgY3VycmVudEtleUNvZGUgPSBvcHRpb25zLmtleUNvZGU7XG5cdFx0XHR2YXIgaW5wdXRMZW5ndGggPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5jaGVja0lucHV0TGVuZ3RoKGN1cnJlbnQpO1xuXHRcdFx0dmFyIG1heElucHV0TGVuZ3RoID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubWF4SW5wdXRMZW5ndGgoY3VycmVudCk7XG5cblx0XHRcdGlmICgoaW5wdXRMZW5ndGggPT09IG1heElucHV0TGVuZ3RoKSAmJiAoY3VycmVudEtleUNvZGUgIT09IDE2KSAmJiAoY3VycmVudEtleUNvZGUgIT09IDkpKSB7XG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmp1bXBUb05leHRJbnB1dChjdXJyZW50KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YXBwbHlTdGF0ZTogZnVuY3Rpb24gKGlucHV0KSB7XG5cdFx0XHRpZiAoaW5wdXQpIHtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCBpbnB1dCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0VmFsdWVzKCk7XG5cblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCBzdGF0ZS5hZ2VTdGF0ZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGdldENvbnRhaW5lcjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmRhdGVGaWVsZENvbnRhaW5lcikgfHwgZmFsc2U7XG5cdFx0fSxcblxuXHRcdGlzU3RhdGVJbnZhbGlkOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0dmFyIGRhdGVDb250YWluZXJzID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IuZ2V0Q29udGFpbmVyKGVsZW1lbnQpO1xuXHRcdFx0c3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkID0gZmFsc2U7XG5cdFx0XHRpZiAoZGF0ZUNvbnRhaW5lcnMpIHtcblx0XHRcdFx0W10uc2xpY2UuY2FsbChkYXRlQ29udGFpbmVycykuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmdldEF0dHJpYnV0ZSgnc3RhdGUnKSAhPT0gJ3ZhbGlkJykge1xuXHRcdFx0XHRcdFx0c3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZDtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xuXHRcdHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XG5cdFx0dmFyIGZvdW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuXHRcdGlmIChmb3VuZCkge1xuXHRcdFx0ZWxlbWVudHMud2luZG93ID0gd2luZG93O1xuXHRcdFx0ZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblx0XHRcdGVsZW1lbnRzLnZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuXHRcdFx0ZWxlbWVudHMuZm9ybUNvbnRhaW5lciA9IGZvdW5kO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5pbml0ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG5cdFx0aWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcblx0XHRcdGVsZW1lbnRzLmZvcm1FbGVtZW50ID0gZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5mb3JtRWxlbWVudCkgfHwgdW5kZWZpbmVkO1xuXHRcdFx0ZWxlbWVudHMucmVxdWlyZWRGaWVsZHMgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLnJlcXVpcmVkRmllbGRzKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRlbGVtZW50cy5wb3N0ZWRDb250YWluZXJzID0gZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5mb3JtUG9zdGVkQ29udGFpbmVyKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cImRhdGVcIl0nKTtcblxuXHRcdFx0aWYgKGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lcikge1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwiZGF5XCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cIm1vbnRoXCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvclllYXIgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwieWVhclwiXScpO1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdmFyaWFudH49XCJmdWxsXCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvciA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbdmFyaWFudH49XCJkYXRlc2VsZWN0b3JcIl0nKTtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQWxsRmllbGRzID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnB1dCcpO1xuXHRcdFx0XHRzdGF0ZS5mdWxsRGF0ZVN1cHBvcnQgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0RnVsbERhdGVTdXBwb3J0KCk7XG5cblx0XHRcdFx0c3RhdGUuaXNNb2JpbGUgPSAoZWxlbWVudHMud2luZG93LmlubmVyV2lkdGggPCA3MDApO1xuXHRcdFx0XHRpZiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUgJiYgc3RhdGUuZnVsbERhdGVTdXBwb3J0ICYmIHN0YXRlLmlzTW9iaWxlKSB7XG5cblx0XHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZS5zZXRBdHRyaWJ1dGUoJ3N0YXRlJywgJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGRhdGVTZWxlY3RvciA9IFtlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXksIGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoLCBlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyXTtcblxuXHRcdFx0XHRPYmplY3Qua2V5cyhkYXRlU2VsZWN0b3IpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdGRhdGVTZWxlY3RvcltrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBtZXRob2RzLmRhdGVTZWxlY3Rvci5jaGFuZ2VIYW5kbGVyKTtcblx0XHRcdFx0XHRkYXRlU2VsZWN0b3Jba2V5XS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xuXHRcdFx0XHRcdGRhdGVTZWxlY3RvcltrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0T2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRlbGVtZW50cy5mb3JtRWxlbWVudFtrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG1ldGhvZHMuZm9ybS5jbGlja0hhbmRsZXIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdE9iamVjdC5rZXlzKGVsZW1lbnRzLnJlcXVpcmVkRmllbGRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0ZWxlbWVudHMucmVxdWlyZWRGaWVsZHNba2V5XS5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgbWV0aG9kcy5maWVsZEVsZW1lbnQuZm9jdXNJbik7XG5cdFx0XHRcdGVsZW1lbnRzLnJlcXVpcmVkRmllbGRzW2tleV0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBtZXRob2RzLmZpZWxkRWxlbWVudC5mb2N1c091dCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcblx0XHRpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcblx0XHRcdCQoZWxlbWVudHMuZm9ybUVsZW1lbnQpLm9mZignc3VibWl0JywgbWV0aG9kcy5mb3JtLmNsaWNrSGFuZGxlcik7XG5cdFx0XHQkKGVsZW1lbnRzLmRhdGVTZWxlY3RvckFsbEZpZWxkcykub24oJ2NsaWNrJywgbWV0aG9kcy5kYXRlU2VsZWN0b3Iuc2V0Rm9jdXMpO1xuXHRcdFx0JChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSkub24oJ2NoYW5nZScsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmZ1bGxDaGFuZ2VIYW5kbGVyKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRtb3VudDogbWV0aG9kcy5tb3VudCxcblx0XHRpbml0OiBtZXRob2RzLmluaXQsXG5cdFx0dW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuXHRcdHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG5cblx0XHRzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lclxuXHR9O1xufSgpKTtcbiIsIm1ldGhvZHMubW9kdWxlcyA9IHtcclxuXHQnaW5pdEFsbCc6IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGtleSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmIChtb2R1bGVzW21vZHVsZU5hbWVdLmluaXQpIHtcclxuXHRcdFx0XHRcdHZhciBleGlzdGVkID0gbW9kdWxlc1ttb2R1bGVOYW1lXS5pbml0KHZpZXdwb3J0KTtcclxuXHRcdFx0XHRcdGlmIChleGlzdGVkKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUuaW5mbygnaW5pdGlhbGlzZWQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdmYWlsZWQgdG8gaW5pdCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdCdtb3VudEFsbCc6IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGtleSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGlmIChtb2R1bGVzW21vZHVsZU5hbWVdLm1vdW50KSB7XHJcblx0XHRcdFx0XHR2YXIgZXhpc3RlZCA9IG1vZHVsZXNbbW9kdWxlTmFtZV0ubW91bnQodmlld3BvcnQpO1xyXG5cdFx0XHRcdFx0aWYgKGV4aXN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmluZm8oJ21vdW50ZWQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdmYWlsZWQgdG8gbW91bnQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQndW5tb3VudEFsbCc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdE9iamVjdC5rZXlzKG1vZHVsZXMpLmZvckVhY2goIGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0bW9kdWxlc1ttb2R1bGVOYW1lXS51bm1vdW50KCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly9jb25zb2xlLndhcm4oJ2ZhaWxlZCB0byB1bm1vdW50IG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQncmVuZGVyQWxsJzogZnVuY3Rpb24gKCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRtb2R1bGVzW21vZHVsZU5hbWVdLnJlbmRlcigpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdC8vY29uc29sZS53YXJuKCdmYWlsZWQgdG8gUmVuZGVyIG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGVycm9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59OyIsInZhciBtb2R1bGVzID0gKHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge30pO1xuXG5tb2R1bGVzW1wiZ2VuZXJhbFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBlbGVtZW50cywgbWV0aG9kcywgYWNjZXNzaWJpbGl0eTtcblxuICBlbGVtZW50cyA9IHt9O1xuICBtZXRob2RzID0ge307XG5cbiAgbWV0aG9kcy5odG1sRWxlbWVudCA9IHtcbiAgICBnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5lbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBkYXRhLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KSB8fCBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhc0F0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSwgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgIGlmICghYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoZGF0YS5hdHRyaWJ1dGVWYWx1ZSwgXCJnaVwiKTtcbiAgICAgIHJldHVybiByZWdleC50ZXN0KGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9LFxuICAgIGFkZEF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XG5cbiAgICAgIGlmICghbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZSArIFwiIFwiICsgZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYXR0cmlidXRlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmVBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xuICAgICAgdmFyIGhhc0F0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShcbiAgICAgICAgZGF0YSxcbiAgICAgICAgYXR0cmlidXRlVmFsdWVcbiAgICAgICk7XG4gICAgICB2YXIgdmFsdWVSZW1vdmVkID0gZmFsc2U7XG4gICAgICBpZiAoaGFzQXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCBcImdpXCIpO1xuICAgICAgICB2YXIgbmV3QXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZS5yZXBsYWNlKHJlZ2V4LCBcIlwiKS50cmltKCk7XG4gICAgICAgIGlmIChuZXdBdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICAgIGRhdGEuZWxlbWVudC5zZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXksIG5ld0F0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZVJlbW92ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlUmVtb3ZlZDtcbiAgICB9LFxuICAgIHRvZ2dsZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEucmVtb3ZlQXR0cmlidXRlVmFsdWU7XG4gICAgICB2YXIgdmFsdWVUb2dnbGVkID0gZmFsc2U7XG4gICAgICB2YXIgcmVtb3ZlQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXG4gICAgICBpZiAocmVtb3ZlQXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYWRkQXR0cmlidXRlVmFsdWU7XG4gICAgICAgIG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoZGF0YSk7XG4gICAgICAgIHZhbHVlVG9nZ2xlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVUb2dnbGVkO1xuICAgIH0sXG4gICAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIChcIiBcIiArIGVsZW1lbnQuY2xhc3NOYW1lICsgXCIgXCIpLmluZGV4T2YoXCIgXCIgKyB2YWx1ZSArIFwiIFwiKSA+IC0xO1xuICAgIH0sXG4gICAgZ2V0Q2xvc2VzdFBhcmVudE5vZGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGRhdGEuY3VycmVudEVsZW1lbnQ7XG5cbiAgICAgIHdoaWxlIChcbiAgICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC5oYXNDbGFzcyhcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIGRhdGEuZ2V0UGFyZW50RWxlbWVudC5hdHRyaWJ1dGVWYWx1ZVxuICAgICAgICApID09PSBmYWxzZVxuICAgICAgKSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0sXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEubm9kZU5hbWUgfHwgXCJkaXZcIik7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGRhdGEuY2xhc3NOYW1lIHx8IG51bGw7XG5cbiAgICAgIGlmIChkYXRhICYmIGRhdGEuYWRkQXR0cmlidXRlcykge1xuICAgICAgICBkYXRhLmFkZEF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlRGF0YSkge1xuICAgICAgICAgIGF0dHJpYnV0ZURhdGEuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5nZXRVcmxQYXJhbXMgPSBmdW5jdGlvbiAodXJsID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaCkge1xuICAgIC8vIGdldCBxdWVyeSBzdHJpbmcgZnJvbSB1cmwgYXMgZGVmYXVsdCBzZXQgZnJvbSB3aW5kb3cgbG9jYXRpb25cbiAgICBsZXQgcXVlcnlTdHJpbmcgPSB1cmwuc2xpY2UoMSk7XG4gICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgaWYgKHF1ZXJ5U3RyaW5nKSB7XG4gICAgICAvLyBzdHVmZiBhZnRlciAjIGlzIG5vdCBwYXJ0IG9mIHF1ZXJ5IHN0cmluZywgc28gZ2V0IHJpZCBvZiBpdFxuICAgICAgcXVlcnlTdHJpbmcgPSBxdWVyeVN0cmluZy5zcGxpdCgnIycpWzBdO1xuXG4gICAgICAvLyBzcGxpdCBvdXIgcXVlcnkgc3RyaW5nIGludG8gaXRzIGNvbXBvbmVudCBwYXJ0c1xuICAgICAgbGV0IGdldFBhcmFtc0tleVZhbHVlID0gcXVlcnlTdHJpbmcuc3BsaXQoJyYnKTtcbiAgICAgIGdldFBhcmFtc0tleVZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtS2V5VmFsdWUsIGluZGV4LCBhcnJheSkge1xuICAgICAgICBsZXQgcGFyYW1BcnJheSA9IHBhcmFtS2V5VmFsdWUuc3BsaXQoXCI9XCIpO1xuICAgICAgICBsZXQga2V5U3BsaXRGb3JBcnJheVBhcmFtID0gcGFyYW1BcnJheVswXS5zcGxpdChcIltcIik7XG4gICAgICAgIGxldCBrZXkgPSBrZXlTcGxpdEZvckFycmF5UGFyYW1bMF07XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtQXJyYXlbMV0gfHwgdHJ1ZTtcbiAgICAgICAgLy8gY2hlY2sgZm9yIHBhcmFtIGFycmF5a2V5XG4gICAgICAgIGxldCBwYXJhbUFycmF5S2V5ID0ga2V5U3BsaXRGb3JBcnJheVBhcmFtWzFdO1xuICAgICAgICBpZiAocGFyYW1BcnJheUtleSkge1xuICAgICAgICAgIHBhcmFtQXJyYXlLZXkgPSBwYXJhbUFycmF5S2V5LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbUFycmF5S2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghb2JqW2tleV0pIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBhcmFtQXJyYXlLZXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob2JqW2tleV1bcGFyYW1BcnJheUtleV0pIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XVtwYXJhbUFycmF5S2V5XSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGxldCBvYmpWYWx1ZSA9IG9ialtrZXldW3BhcmFtQXJyYXlLZXldO1xuICAgICAgICAgICAgICAgIG9ialtrZXldW3BhcmFtQXJyYXlLZXldID0gW107XG4gICAgICAgICAgICAgICAgb2JqW2tleV1bcGFyYW1BcnJheUtleV0ucHVzaChvYmpWYWx1ZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvYmpba2V5XVtwYXJhbUFycmF5S2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqW2tleV1bcGFyYW1BcnJheUtleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIG1ldGhvZHMuYWNjZXNzaWJpbGl0eSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldExvY2FsU3RvcmUoZGF0YS5lbGVtZW50KTtcbiAgICB9LFxuICAgIGdldEZyb21FbGVtZW50OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgcmV0dXJuIG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xuICAgIH0sXG4gICAgc2V0TG9jYWxTdG9yZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHJldHVybiAoYWNjZXNzaWJpbGl0eSA9IG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5nZXRGcm9tRWxlbWVudChkYXRhKSk7XG4gICAgfSxcbiAgICBnZXRMb2NhbFN0b3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYWNjZXNzaWJpbGl0eTtcbiAgICB9LFxuICAgIGRhdGFNb3VzZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRzLmJvZHksXG4gICAgICAgIGF0dHJpYnV0ZUtleTogXCJhY2Nlc3NpYmlsaXR5XCIsXG4gICAgICAgIGFkZEF0dHJpYnV0ZVZhbHVlOiBcIm1vdXNlXCIsXG4gICAgICAgIHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBcImtleWJvYXJkXCIsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICBkYXRhS2V5Ym9hcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBlbGVtZW50OiBlbGVtZW50cy5ib2R5LFxuICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiYWNjZXNzaWJpbGl0eVwiLFxuICAgICAgICBhZGRBdHRyaWJ1dGVWYWx1ZTogXCJrZXlib2FyZFwiLFxuICAgICAgICByZW1vdmVBdHRyaWJ1dGVWYWx1ZTogXCJtb3VzZVwiLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgfTtcblxuICBtZXRob2RzLmV2ZW50TGlzdGVuZXIgPSB7XG4gICAgbW91c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRLZXlib2FyZCk7XG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRNb3VzZSk7XG4gICAgfSxcbiAgICBrZXlib2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0TW91c2UpO1xuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0S2V5Ym9hcmQpO1xuICAgIH0sXG4gICAgc2V0TW91c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmRhdGFNb3VzZSgpO1xuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldChkYXRhKTtcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5tb3VzZSgpO1xuICAgIH0sXG4gICAgc2V0S2V5Ym9hcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkYXRhID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmRhdGFLZXlib2FyZCgpO1xuICAgICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldChkYXRhKTtcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5rZXlib2FyZCgpO1xuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG4gICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgZWxlbWVudDogZWxlbWVudHMuYm9keSxcbiAgICAgIGF0dHJpYnV0ZUtleTogXCJhY2Nlc3NpYmlsaXR5XCIsXG4gICAgfTtcblxuICAgIGRhdGEuYWRkQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0RnJvbUVsZW1lbnQoZGF0YSk7XG5cbiAgICBtZXRob2RzLmFjY2Vzc2liaWxpdHkuc2V0TG9jYWxTdG9yZShkYXRhKTtcblxuICAgIGlmIChtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0TG9jYWxTdG9yZSgpID09PSBcIm1vdXNlXCIpIHtcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5tb3VzZSgpO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmdldExvY2FsU3RvcmUoKSA9PT0gXCJrZXlib2FyZFwiKSB7XG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIua2V5Ym9hcmQoKTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24gKCkgeyB9O1xuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1ldGhvZHMubW91bnQsXG4gICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcbiAgICByZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxuICAgIGh0bWxFbGVtZW50OiBtZXRob2RzLmh0bWxFbGVtZW50LFxuICAgIGdldFVybFBhcmFtczogbWV0aG9kcy5nZXRVcmxQYXJhbXNcbiAgfTtcbn0pKCk7XG4iLCJjbGFzcyBmaWxlVXBsb2FkU2hvd1ByZXZpZXV3IHtcbiAgY29uc3RydWN0b3IoZmlsZVVwbG9hZENvbnRhaW5lcikge1xuICAgIHRoaXMuZmlsZVVwbG9hZENvbnRhaW5lciA9IGZpbGVVcGxvYWRDb250YWluZXI7XG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuaW5wdXRUeXBlRmlsZSA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcignW3R5cGU9XCJmaWxlXCJdJyk7XG4gICAgdGhpcy5pbnB1dE5hbWVGaWxlID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImZpbGVcIl0nKTtcbiAgICB0aGlzLmlucHV0TGFiZWwgPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2FwdGlvblwiKTtcbiAgICB0aGlzLmF2YXRhckltZyA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5hdmF0YXItaW1hZ2VcIik7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZGVsZXRlLWZpbGVcIlxuICAgICk7XG4gICAgdGhpcy5lcmFzZUltYWdlQnV0dG9uID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZGVsZXRlLWZpbGVbdHlwZT0nYnV0dG9uJ11cIlxuICAgICk7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImhpZGRlblwiO1xuXG4gICAgdGhpcy5hdmF0YXJJbWFnZSA9IHtcbiAgICAgIGRlZmF1bHRJbWFnZTpcbiAgICAgICAgXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSTJNVElpSUdobGFXZG9kRDBpTmpFeUlpQjJhV1YzUW05NFBTSXdJREFnTmpFeUlEWXhNaUkrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVEV3Tmk0NE16UWdNamMxTGpJMll6RXlNeTR5TURFdE56VXVORE15SURJeE55NDBPVElnTmk0eU9EY2dNakUzTGpRNU1pQTJMakk0TjJ3dE1pNHlOQ0F5TlM0M01EbGpMVFl6TGpZM05pMHhNeTQ0TXpjdE9UY3VPRGd6SURNeExqZzNNeTA1Tnk0NE9ETWdNekV1T0RjekxUTTJMamMxTWkwMU9DNDRNRFl0TVRFM0xqTTJPUzAyTXk0NE5qa3RNVEUzTGpNMk9TMDJNeTQ0TmpsNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURXdOaTQ0TXpRZ01qYzFMakkyY3pFeE1DNHhNRFF0TlRZdU5qY3hJREU1TXk0ME1qY2dOaTR6T1Rkak9ETXVNekkwSURZekxqQTNNU0F3SURBZ01DQXdiQzB4TkM0eE1qZ2dNakF1TWpRMmN5MDJOeTR6TlMwM01DNDFNeTB4TnprdU1qazVMVEkyTGpZME0zb2lMejQ4Y0dGMGFDQm1hV3hzUFNJak5qRXlNVEl4SWlCa1BTSk5NakkwTGpJd015QXpNemt1TVROekxURXVNVEE1TFRRM0xqa3hPQ0F5T1M0NU1UWXROemd1T1RRemJETTVMakE0T0NBeE55NDJNemtnTVRjdU56RTRJREV4TGpJNU5pMHpOaTQ0TVRRZ01qQXVOVFk0Y3kweU5pNDNNVElnTXk0ek5EWXRORGt1T1RBNElESTVMalEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5DTnpNeU16RWlJR1E5SWsweE1EWXVPRE0wSURJM05TNHlObk14TURJdU9EVXlMVFUwTGpJME55QXhPVEl1TVRFNElEWXVNamt6YkRZdU1qTXpMVEUwTGpNeE9XTXVNREF4TGpBd01TMDVOaTQyTXpZdE5Ua3VOekE1TFRFNU9DNHpOVEVnT0M0d01qWjZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFE1TVM0NU9DQXhOVEV1TlRJMFl5MHhNRFl1TmpVM0lERTNMakl3TVMweE1qQXVNelkxSURFd09TNDFNRFV0TVRJd0xqTTJOU0F4TURrdU5UQTFiREU0TGpjMk9DQXlOQzQ1T0Rsak16UXVNREEzTFRJNUxqRTRPU0EyTkM0NE1UZ3RNak11T0RnMklEWTBMamd4T0MweU15NDRPRFl0TVRFdU9USTVMVFU0TGpZNE5pQXpOaTQzTnprdE1URXdMall3T0NBek5pNDNOemt0TVRFd0xqWXdPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpRamN6TWpNeElpQmtQU0pOTWpjeExqVTNJRFk0TGprMU9HTXhOUzR3TlRnZ09TNHhJRE13TGprNU55QXhOeTR5TVNBME55NDJOemdnTWpJdU9Ua3RMamd3TWkweE1pNDVOamt1TXpVeExUSTJMakUwT0NBeExqQXlOQzB6T0M0M01qSWdNUzQxTnpJdE1qa3VNamMzTFRjdU5UZ3hMVFEwTGpjME1pMHhOeTQ0TkMwME1pNDBOalV0TVRBdU1qWXlJREl1TWpjM0xTNDRPVE1nTVRJdU5qUTVMVE16TGpVeU9DQXlOaTR5T0RrdE1UQXVNakU0SURRdU1qWTNMVEU0TGpNMk9TQTJMamd6TlMweU5pNHlNVE1nTVRJdU5UWTBJRGd1TVRZeElEZ3VNRGcySURFNUxqZ3hJREV6TGpnMU15QXlPQzQ0TnprZ01Ua3VNelEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME5UVXVNakF4SURJMk1pNHhNekp6TFRJd0xqY3hOaTB6TkM0NE5UWXROall1TVRBMkxUTTBMamcxTm13dE5TNDJOak1nTWpZdU1UVTBJREV1TkRnMElERTJMamcwTVNBeE9TNDVOREVnTmk0M05UZGpNQzB1TURBeElERTJMakEwTmkweE5DNDRPVFlnTlRBdU16UTBMVEUwTGpnNU5ub2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5ORGt4TGprNElERTFNUzQxTWpSekxURXdPQzR6TkRZZ016RXVOalUwTFRFd09DNHpORFlnTVRJMUxqVXdNMnd0Tnk0eE5EWXRNell1TXpNMFl5NHdNREV0TGpBd01TQXhOeTQzT1RFdE56VXVPRE0wSURFeE5TNDBPVEl0T0RrdU1UWTVlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkRSRU5EUTBNaUlHUTlJazB5TkRRdU56TTJJRFV4TUM0M01UZHNNVEV1TkRBekxUTXdMamN6TTJNdE1USXVOekk0SURRdU9USTRMVE13TGprMk5TQXhNQzR6T1RRdE5EWXVPVFUwSURFMExqZzNJREV3TGpNZ05pNHhNVEVnTWpJdU1EWWdNVEV1TlRNM0lETTFMalUxTVNBeE5TNDROak42SWk4K1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRJM09DNDRNVFlnTkRFNExqZzFNbU10TlRJdU5ERTFJRFV1T1RRNExUa3hMamt4TmkwNUxqTXdNUzB4TVRjdU1EVXlMVE0wTGpRNE55MDBMakE0TlMwMExqQTVNUzAzTGpZNE1TMDBMalEzTFRFd0xqTTFOaTB5TGpFeE1TMHhNaTQxTnpRZ01USXVOVGMwSURJM0xqRXhPU0E0TkM0ME5qY2dNVEF3TGpVMk1pQTROQzQwTmpjZ015NDBPVFlnTUNBMkxqUTNNaTR3T0RnZ09DNDVPVGN1TWpVeGJERXhMakkzTnkwek1DNDBNVGNnTmk0MU56SXRNVGN1TnpBemVpSXZQanh3WVhSb0lHWnBiR3c5SWlORFJFTkRRME1pSUdROUlrMHlOakF1T1RZMklEUTJOaTQ1TnpGc0xUUXVPREkzSURFekxqQXhNMk14Tmk0ME16UXROaTR6TmpZZ01qTXVOalE0TFRFeExqZ3hOeUEwTGpneU55MHhNeTR3TVRONklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURTFNUzQwTURnZ016Z3lMakkxTTJNdE1URXVPRFV4SURFd0xqUTJNeTAxTGpRMU5DQTNOUzR3TmprZ05UY3VOemMzSURFeE1pNDJNREVnTVRVdU9UZzVMVFF1TkRjM0lETTBMakl5TnkwNUxqazBNaUEwTmk0NU5UUXRNVFF1T0Rkc05DNDRNamN0TVRNdU1ERXpZeTB5TGpVeU5TMHVNVFl6TFRVdU5TMHVNalV4TFRndU9UazNMUzR5TlRFdE56TXVORFF6SURBdE1URXpMakV6TmkwM01TNDRPVE10TVRBd0xqVTJNUzA0TkM0ME5qZDZUVFF3Tnk0eU56TWdOVEUyTGpZME5tTXVNVFUyTGpBMU1TNHpNREV1TURnNExqUTFOQzR4TXpVdExqRTFNeTB1TURVdExqSTVOeTB1TURnMExTNDBOVFF0TGpFek5Yb2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5NelkyTGpVek55QTBPRFV1TlRRM1l5MHhNUzQ1T1RRZ01qRXVOVEl6SURNMkxqZ3dOU0F4Tnk0M09TQTFOUzQyTkRRdE1UTXVPRFVnTVRndU9UTXhMVE0yTGpNd055MHhOaTR5TmpjdE5qSXVOVEkxTFRFMkxqSTJOeTAyTWk0MU1qVnNMVE0zTGpJeU9DQTJPUzQwTURGakxqZ3dNaTQwTnpRdU16TTRJREl1TlRFekxUSXVNVFE1SURZdU9UYzBlazAwTURjdU56STRJRFV4Tmk0M09ERmpMUzR4TlRNdExqQTBOeTB1TWprNExTNHdPRFF0TGpRMU5DMHVNVE0xTFRNeUxqWXlOaTA1TGpnNE5pMHpOeTQyT1RjZ09DNDRPREV0TVRVdU16WTVJREkzTGpBMk5TQXhOQzQ1TmpnZ01USXVNVGczSURZdU9UY3hJREl3TGpZd01TQTJMamszTVNBeU1DNDJNREVnTVRNdU56QTFMUzQ1T0RjZ01UWXVNelUwTFRFeUxqQTVNaUF4Tmk0ek5UUXRNVEl1TURreUlERXpMakUwTlMwdU9UUTJJRGN1T1RZdE1UVXVPRGMySURjdU9UWXRNVFV1T0RjMmN6RXlMakk0TFRFMExqVTBPQzA0TGpZek15MHhPQzR3TkRSakxTNHlNUzB1TURNeExTNHpPRGt0TGpBM05TMHVOVGc1TFM0eE1USXRNUzQ0T0MwdU1qTTRMVE11T0RVNUxTNDJOekV0TlM0NU5qSXRNUzR6TWpsaE5pNDFNRE1nTmk0MU1ETWdNQ0F3SURFdExqSTNPQzB1TURjNGVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHpPVEV1T1RBMElEVTBNeTQzTVRKakxUSXlMak15T0MweE9DNHhPRFV0TVRjdU1qVTNMVE0yTGprMU1TQXhOUzR6TmprdE1qY3VNRFkxTFRFMExqTTJNeTAwTGpJME1TMHhOaTQyTnpVdE1URXVOekkxTFRFMkxqWTNOUzB4TVM0M01qVWdNVFl1TXpRekxURXhMalkxSURJMkxqRTJPUzB5TWk0NE5TQXpNUzQxT0RJdE16TXVNakkxTFRFNExqZ3pPU0F6TVM0Mk5DMDJOeTQyTXpnZ016VXVNemN6TFRVMUxqWTBOQ0F4TXk0NE5TQXlMalE0TnkwMExqUTJNU0F5TGprMU1TMDJMalVnTWk0eE5Ea3ROaTQ1TnpSc0xUSXdMakUyTlNBek55NDJNRFJqTFRjdU1ERTBJREUyTGpjeU9TQXlOQzQwTkNBeE5TNHpORFFnTkRVdU5EUTNJRE0xTGpZd05TQTNMamM0T0NBM0xqVXdOU0EwTGprd05pQXhNaTQxTXlBMExqa3dOaUF4TWk0MU0zTTNMams1T1MwNExqUXhOQzAyTGprMk9TMHlNQzQyZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1EZ3VNREEySURVeE5pNDROVGxqTWk0eE1ETXVOalU0SURRdU1EZ3lJREV1TURreElEVXVPVFl5SURFdU16STVZVFl3TGprM0lEWXdMamszSURBZ01DQXhMVFV1T1RZeUxURXVNekk1ZWlJdlBqeHdZWFJvSUc5d1lXTnBkSGs5SWk0ek15SWdabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF3T0M0d01EWWdOVEUyTGpnMU9XTXlMakV3TXk0Mk5UZ2dOQzR3T0RJZ01TNHdPVEVnTlM0NU5qSWdNUzR6TWpsaE5qQXVPVGNnTmpBdU9UY2dNQ0F3SURFdE5TNDVOakl0TVM0ek1qbDZJaTgrUEdjZ1ptbHNiRDBpSXpjek1qY3lPQ0krUEhCaGRHZ2daRDBpVFRReU1pNHhPREVnTkRjeExqWTVOMk10TlM0MU5qa2dPUzR6TlRFdE1UTXVOelU0SURFMkxqSTBOaTB5TWk0eU1Ua2dNakF1TnpreExUYzRMakl5TkNBek5TNHhNREVnTVRndU1qQXpMVE15TXk0M09Ea2dNVEF1TURRekxUYzVMamN4TVNBd0lEQWdMalU0Tmk0eU9EZ3ROeTQyTWpndE5pNDRNak10T0M0eU1qY3ROeTR4TVRjdE1qQXVNamcySURVeUxqQXpOUzB5TUM0eU9EWWdOVEl1TURNMWN5MDVMamcxT0NBeU9DNDVNVFF0TVRNdU16VTNJRE01TGpZeE9HTXROQzR4TkRjdE1pNHdNVGd0TlM0MU5EZ3ROaTR3TlRNdE1pNHhPVFl0TVRJdU1EWXhJREl1TkRnM0xUUXVORFl4SURJdU9UVXhMVFl1TlNBeUxqRTBPUzAyTGprM05Hd3RNakF1TVRZMUlETTNMall3TkdNdE55NHdNVFFnTVRZdU56STVJREkwTGpRMElERTFMak0wTkNBME5TNDBORGNnTXpVdU5qQTFJRGN1TnpnNElEY3VOVEExSURRdU9UQTJJREV5TGpVeklEUXVPVEEySURFeUxqVXpjemN1T1RrM0xUZ3VOREUwTFRZdU9UY3hMVEl3TGpZd01XTXRNakl1TXpJNExURTRMakU0TlMweE55NHlOVGN0TXpZdU9UVXhJREUxTGpNMk9TMHlOeTR3TmpVdE1UUXVNell6TFRRdU1qUXhMVEUyTGpZM05TMHhNUzQzTWpVdE1UWXVOamMxTFRFeExqY3lOU0F4Tmk0ek5ETXRNVEV1TmpRNUlESTJMakUzTFRJeUxqZzBPQ0F6TVM0MU9ETXRNek11TWpJemVrMDBNRGt1T0RZeklEVXpPQzR3TWpGek55NDROellnTkM0ek9ETWdOUzR6TmpZZ01UUXVNbU0wTGpNd09DMHVNamMySURVdU9UUXlMVEl1TURnZ05TNDVOREl0TWk0d09DMHhMalkzTVMweE1DNDJOek10TVRFdU16QTRMVEV5TGpFeUxURXhMak13T0MweE1pNHhNbnBOTkRFMkxqY3pNeUExTWpndU5ESTJjelF1TnpBNElERXVORE0xSURZdU5EVTJJRGN1T1RFNVl6SXVNRE10TVM0MU9UZ2dNaTQwTmpNdE5DNHdNaklnTWk0ME5qTXROQzR3TWpJdE15NHlPVE10TXk0Mk5pMDRMamt4T1MwekxqZzVOeTA0TGpreE9TMHpMamc1TjNvaUx6NDhMMmMrUEhCaGRHZ2dabWxzYkQwaUkwSTNNekl6TVNJZ1pEMGlUVFF6Tmk0Mk1Ua2dNekE0TGpFME9XTXRNVEF1TXpnNExURXpMamt6TkMweU5TNDRNRGN0TWpRdU56RTJMVE13TGpRd05TMHhPQzQzTlRndE5DNDRPRE1nTmk0ek5EUXVNamM1SURNd0xqWXdNaUF4TUM0ME9UUWdOVEl1TWpVM0lESXlMakl6TlNBME55NHhOelFnT1M0MU1EVWdOak11TWpNM0lEa3VOVEExSURZekxqSXpOeUF4TXk0ME5qY3RMalkyTkNBeE5pNDROUzB4TWk0ME1UUWdNVFl1T0RVdE1USXVOREUwSURFMExqWTRPQzB1TnpJMElERXhMalF4TWkweE5pNDNNVGtnTVRFdU5ERXlMVEUyTGpjeE9YTXhOUzQzTURjdE9TNDVNeTB4TVM0eE56UXROVGN1TWpJellURXhPQzQyTlRRZ01URTRMalkxTkNBd0lEQWdNQzAyTGpZNE1pMHhNQzR6T0hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqUWpkQ04wSTRJaUJrUFNKTk16Y3hMalF5TkNBeU9EUXVOakkwWXpJdU5EazNMVE11TWpJZ09TNDNPRGt0TVRFdU1EazVJREUwTGpFd015MHhOUzQzTURjdE1USXVPRFEzTFRZdU56a3lMVEl5TGpJeU1pMDVMalkxTlMweU1pNHlNakl0T1M0Mk5UVnNMakExTmlBek1DNDRPREZ6TWk0NE5ESWdNaTQ0TURFZ055NHlOekVnTnk0MU1EbGpMVEV1TURjeExUVXVPVFF0TVM0MU16VXRNVEF1TURNMExqYzVNaTB4TXk0d01qaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF4T0M0d09EUWdNelF4TGpVM04yTXRPUzQzT0RNdE1qQXVOek00TFRFMUxqUXdPUzAwTVM0eU1USXRNVEV1TVRZeUxUUTRMakExTkNBMExqTTFOQzAzTGpBeE1TQXhPQzQ0TXpjdU1EWTFJREk1TGpZNU55QXhOQzQyTWpZdE1UVXVNelU1TFRJeExqUTFOUzB6TlM0NE5DMHpOUzR6TWpNdE5URXVNekF5TFRRekxqUTROeTAwTGpNeE1TQTBMall3TlMweE1TNDJNRFlnTVRJdU5EZzNMVEUwTGpFd05DQXhOUzQzTURFdE1pNHpNeUF5TGprNU9DMHhMamcyTnlBM0xqQTVOUzB1TnpreUlERXpMakF5T0NBeE5DNHhNalFnTVRRdU9UazVJRFEwTGpVME9DQTBPUzQxTWprZ05URXVPREkxSURjMUxqazBPU0EyTGpRek9DQXlNeTR6TXpnZ015NDVOallnTXpVdU5UUTFJRE11T1RZMklETTFMalUwTlhNeE5DNHhNUzB4Tmk0eE16VXRPQzR4TWpndE5qTXVNekE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek16VXVOekF6SURFME9DNDNOalJqTFRFdU9EWXRNamN1TVRJMUlEY3VNVE0yTFRVekxqazNPQ0F4TkM0eE9UTXROemt1TWpjelF6TTJNQzQxTXpJZ016RXVNemMzSURNMU15QTRMak15TnlBek16Z3VPRElnT0M0ek1qZGpMVEUwTGpFNE1pQXdMVFF1T0RjMElERTJMak01T1MwMU1TNDROVGNnTWpRdU9ERTVMVEk1TGpFeU5DQTFMakl4T1MwME5TNDJOVEVnTXk0NU9URXROemd1TkRRNUlEUXlMakV3T0Mwek1pNDNPVGdnTXpndU1URTBMVFU0TGpVd055QTNNeTR4TWpjdE5UZ3VOVEEzSURFeE5TNHlNekp6TWprdU1qVXlJRGcxTGpBNU9TQTBPQzR6TURjZ09EVXVNRGs1WXpFd0xqRTJPQ0F3SURFMExqQXpOQzA0TGpBM05pQXlNUzR6TkRVdE1Ua3VNRFF6SURFMExqazVPUzB5TXk0M01qWWdORGN1TVRNMkxUTXpMalEzTlNBMU15NHhNVGt0TkRjdU9EYzRJREFnTUMweUxqZzROU0F4TVM0eU5ETXRNakV1T0RNeElESTBMamN3TXkweE1DNDRNamtnTnk0Mk9UY3RNVFV1T1RreUlERTRMalExT0MweE9DNDBOemtnTWpZdU56Y3hJRGt1TlRBMElERXVNRFEySURNeExqYzRNeTB4TlM0NE1EY2dORGd1TnpNdE16SXVOelUwSURndU56a3RPQzQzT0RjZ01UVXVNelU1TFRFeExqY3hNeUF4T1M0M056TXRPUzQ0TURVZ05TNHpOall0TVRRdU56STJJRGd1TVRjNUxUTXdMamcyTWlBeE55NDBOVGd0TkRVdU56QTNJRFF1TVRFMExUZ3VNakU1SURndU1qUTJMVEU1TGpVNE55QXhOeTR5TnpRdE1qTXVNVEE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek5EZ3VOVFk0SURFNU1DNHdORFZqTFRndU1qQTBMVEV6TGpjeE55MHhNUzQ1TWpJdE1qY3VOVE15TFRFeUxqZzJOUzAwTVM0eU9ERXRPUzR3TWpnZ015NDFNakV0TVRNdU1UWWdNVFF1T0RnNUxURTNMakkzTWlBeU15NHhNRGt0T1M0eU56a2dNVFF1T0RRMUxURXlMakE1TWlBek1DNDVPREV0TVRjdU5EVTRJRFExTGpjd055QTNMalEwTlNBekxqSXdPQ0E0TGpjMU1pQXlNQzR4TnpFZ05DNHhOak1nTkRZdU1EUXROeTR6TVRRZ05ERXVNakU0TFRReUxqVTFNeUE0TVM0eE1EVXROREl1TlRVeklEZ3hMakV3TlhNdE1qY3VOVEF4SURjMUxqWTBMVEl5TGpJNE5TQXhNamd1TXpNNWJESXlMakk0TlMwME1TNDBNamx6TlRFdU9EVTVMVFl1T0RFeUlEWTNMamd4TXkwNE5TNHdPRGRqTVRRdU5EUTBMVGN3TGpnMk1TQTFNQzR4TkRFdE56a3VNakEwSURjeUxqQTFPUzAwTmk0Mk1ETXRNVE11TkRnMUxUVXdMakF3TlMwek55NHlOemN0T0RJdU1USXROVE11T0RnM0xURXdPUzQ1ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5GUlRaQk5rRWlJR1E5SWswME1USXVPRE0zSURNNE15NHlPRGRqTUMwek1pNDJNelV0TkM0d05qTXROVGt1T1RReExURXdMak00TWkwNE15NHpOREl0TWpFdU1UazRMVE15TGpnek15MDJNeTQyT1RFdE1qUXVNalU0TFRjNExqRXpOaUEwTmk0Mk1ETXRNVFV1T1RVMElEYzRMakkzTkMwMk1TNDNNellnT0RVdU1EZzNMVFl4TGpjek5pQTROUzR3T0Rkc0xUSXlMakk0TlNBME1TNDBNamxqTGpnMk1TQTRMalk0TVNBeUxqWXlOU0F4Tmk0M01Ua2dOUzQxTWpZZ01qTXVOekUzSURRdU5qTTJJREV1TURnZ09TNDNORGtnTWk0MU1qUWdNVFV1TkRNM0lEUXVOREEzSURjM0xqazJOeUF5TlM0M09EY2dNVFV4TGpVM05pMHpNaTQ0TURFZ01UVXhMalUzTmkweE1UY3VPVEF4ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1URXVNREEzSURReE1TNHhOREpqTVM0eE9UUXRPQzQ0TWpFZ01TNDRNeTB4T0M0eE1EWWdNUzQ0TXkweU55NDROVFFnTUNBekxqYzROQzB1TWpBeElEY3VORGt6TFM0ME56a2dNVEV1TVRjeExqWXhOeTB4TWk0M016RXVOREV6TFRJMkxqQXhNeTB1TmpFM0xUTTVMamN5TWlBMExqazVNeUF4TlRJdU5UZzRMVEV5Tmk0MU5TQXhOREV1TURVM0xURXlOaTQxTlNBeE5ERXVNRFUzYkMwNUxqZzBNaUE1TGpFME5XRXhNalF1TlRrNElERXlOQzQxT1RnZ01DQXdJREV0TVRRdU1EZzNMVE11TnpWakxUVXVOamc0TFRFdU9EZ3pMVEV3TGpnd01TMHpMak15TnkweE5TNDBNemN0TkM0ME1EY2dOUzR4TnpJZ01USXVORGN4SURFMExqQXdPU0F5TVM0MU56Y2dNamd1TURZeUlESTBMamM1TVdFeE1URXVOREV5SURFeE1TNDBNVElnTUNBd0lEQWdNalF1TnpnNElESXVPREV6YkM0d016UXVNREkwWXk0eE56SWdNQ0F1TXpJNUxTNHdNVE11TlRBeExTNHdNVE11T1RnekxTNHdNRE1nTVM0NU5qY3RMakEwTkNBeUxqazBPQzB1TURjNElEWTRMalF6TmkweExqVXlOaUF4TURFdU16VXpMVFE0TGpBeE15QXhNRGd1T0RRNUxURXhNeTR4TnpkNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpVeU5USTFNaUlnWkQwaVRUSXhOaTQyTWpJZ01Ua3dMamsyT1dNMkxqY3pOUzB4TGpJM09DQXhOQzQ0TURVdE9TNDBNellnTVRFdU9EWXpMVEU0TGpjeU55MHlMamswTVMwNUxqSTVNaTB4TkM0NU5USXRNUzQwTVRZdE1UWXVORFF6SURjdU56QTVMVEV1TkRJeUlEZ3VOamszSURJdU1Ea3lJREV4TGpRNU55QTBMalU0SURFeExqQXhPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpSa1pHSWlCa1BTSk5Nakl4TGpVeE1pQXhOemt1TkRNNFl6RXVORGM1TGpVeE1TQXpMakUxTVMwdU56YzNJRE11TnpFNExUSXVPRGM1TGpVM0xUSXVNVEF5TFM0eE5qa3ROQzR5TVRNdE1TNDJORGd0TkM0M01qRXRNUzQwT1RFdExqVXdOeTB6TGpFMU5DNDNPRFl0TXk0M015QXlMamc0TlMwdU5UWTBJREl1TURrekxqRTNNU0EwTGpJeE1TQXhMalkySURRdU56RTFlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkVRek5HTTBZaUlHUTlJazB5T1RrdU9ERTJJREkzTnk0d01qZHpMVFV1TmpVeExURXlMakk1T0NBeE1TNDVOamN0TWpNdU1EazVZekUzTGpZeE55MHhNQzQ0TURVZ01Ua3VNVEV4SURRdU16RTVJREU1TGpFeE1TQTBMak14T1NJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME9URXVPVGdnTVRVeExqVXlOSE10TmpBdU1EZzFJREl3TGpRM09DMDVNUzQxTlRVZ09ESXVPVEEyYkMwMUxqRTVOQzAzTGpFMU5YTXlNaTQ1T0RRdE5UTXVNakU1SURrMkxqYzBPUzAzTlM0M05URjZJaTgrUEhCaGRHZ2dabWxzYkQwaUkwUkRNMFl6UmlJZ1pEMGlUVEl6TlM0ek16a2dOVFV3TGpJNE1XTXRMamd6SURJMExqa3pNeUF6TXk0eU5qZ2dORFF1TnpReUlERTFMalV3TXlBMU15NHlPRFVnTVRZdU5qSXlJREl1TWpFMUlESXhMamswTFRjdU5UTTNJREl4TGprMExUY3VOVE0zSURJeUxqWXdNaUF6TGpNeU55QXlNUzQwT1RNdE1UWXVNVGMzSURJeExqUTVNeTB4Tmk0eE56Y2dNVEF1TmpBMExUY3VNREV4SURrdU5qZ3pMVEUyTGpNek15NHdNakl0TWpVdU5UY3hMVEl4TGprek5DMHhPQzR4TkRNdE5UZ3VNVEk0TFRJNExqZzBNUzAxT0M0NU5UZ3ROSHBOTXpBd0xqQTNOeUEwTmpNdU1EY3pZeTR6TWprdE1qSXVNVGc0TFRFeUxqSXlOeTB6T1M0NE9UWXRNVEl1TWpJM0xUTTVMamc1Tm5NeE55NHlPRFl0TVRFekxqUTJNUzAwTkM0M05qVXROalF1TWpZMVl5MDJNaTR3TlRNZ05Ea3VNVGszTFRVeUxqa3dPU0F4TVRVdU5qSXRNemt1TWpJeklERXpOeTR6T1RVZ01qTXVNVFUwSURNekxqVTNOU0E0TkM0MU1URWdNVGd1TWpnNElEazJMakl4TlMwek15NHlNelI2SWk4K1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRJNE5TNHhPU0EwT1RrdU9EVmpNVEF1T1RnMkxURXlMakl4TnlBeE5DNDNNVFF0TWpVdU1URTJJREUwTGpnNE5pMHpOaTQzTnpZdE1URXVOekEwSURVeExqVXlNUzAzTWk0eE5UWWdOalF1TURVeUxUazJMakl4TkNBek15NDJNalVnTVRZdU5UQTVJREkyTGpJMk1TQXpPQzQ1T1RnZ01qQXVPRGd5SURJNExqZ3dOeUF6T1M0M01UZ3RNVEF1TVRrM0lERTRMamcwTGpZMk55QXpOeTR3TVRJZ01UUXVPRFE0SURRNExqVXpNM016TGpNeU5DQXhPQzQyTVRjZ015NHpNalFnTVRndU5qRTNZekkzTGprM05DMDVMakE0TlMwNUxqVXlPUzB5TlM0NE1ETXRPUzQxTWprdE5UQXVOelE0SURBdE1Ua3VOU0F5T1M0NU1TMHhOQzR5TURrZ05USXVPVGcwSURFdU5EWXpMVEl1T0RZdE1pNDNNekV0Tmk0ME5ETXROUzQwTlRjdE1UQXVOemN0T0M0eE1UTXRNVGd1T1RRMExURXhMall6TlMweU9DNDVNVGt0TVRJdU1qazVJREV1TmpZMExUUTJMak14T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk1qY3lMamM0TWlBMU9UWXVNREk1WXpndU1EZzRMVEV3TGpFNUlERXVNakUyTFRFNExqQTJJREV1TWpFMkxURTRMakEyY3pFd0xqRXhNaUEwTGpFd01TQTNMams1TVNBeE9DNHdObU13SURBdE5DQXlMakV3T1MwNUxqSXdOeUF3VFRJNU5DNHlOelVnTlRjNUxqZzFNMk13TFRFeExqSTVPUzAzTGpjMU5pMHhOQzR3TnpFdE55NDNOVFl0TVRRdU1EY3hjemd1TlRNM0xqTXdOQ0F4TWk0eE9Ea2dNVEF1TWpsak1DMHVNREF4TFRFdU9ESTNJREl1TnpJNExUUXVORE16SURNdU56Z3hJaTgrUEdjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNek9DNDRNaUE0TGpNeU9HTXRNVFF1TVRneUlEQXROQzQ0TnpRZ01UWXVNems1TFRVeExqZzFOeUF5TkM0NE1Ua3RNaTR6TXpNdU5ERTNMVFF1TlRjM0xqYzVMVFl1TnpZeklERXVNVFVnTWpVdU5qUTBMVE11T1RZeklESXlMalk0SURNdU9UQTJJRFF1TXpJeklERXlMamd4TlMweU15NHdNRElnTVRFdU1UVTRMVE0yTGpZeU15QXhMakE0TVMwMk9DNDVORFVnTkRZdU56UTFMVE15TGpNeU5TQTBOUzQyTmpNdE5ETXVNVElnT1RJdU5EazVMVEl6TGprd09DQXhNamt1T0RjMklESXdMakEwTlNBek9DNDVPVEVnTXpNdU5qa2dNVGt1TVRJNElEVXpMakF5TWlBNExqYzBiQzB1TURBMkxqQXdObU14TWk0MU1qY3RPQzQzTmpJZ01qUXVOalEzTFRFMUxqVXhPU0F5T0M0d09UTXRNak11T0RFeklEQWdNQzB5TGpnNE5TQXhNUzR5TkRNdE1qRXVPRE14SURJMExqY3dNeTB4TUM0NE1qa2dOeTQyT1RjdE1UVXVPVGt5SURFNExqUTFPQzB4T0M0ME56a2dNall1TnpjeElEa3VOVEEwSURFdU1EUTJJRE14TGpjNE15MHhOUzQ0TURjZ05EZ3VOek10TXpJdU56VTBJRGd1TnprdE9DNDNPRGNnTVRVdU16VTVMVEV4TGpjeE15QXhPUzQzTnpNdE9TNDRNRFVnTlM0ek5qWXRNVFF1TnpJMklEZ3VNVGM1TFRNd0xqZzJNaUF4Tnk0ME5UZ3RORFV1TnpBM0lEUXVNVEV5TFRndU1qSWdPQzR5TkRRdE1Ua3VOVGc0SURFM0xqSTNNaTB5TXk0eE1Ea3RNUzQ0TmkweU55NHhNalVnTnk0eE16WXROVE11T1RjNElERTBMakU1TXkwM09TNHlOek1nTVRBdU5qTTNMVE00TGpFeE5TQXpMakV3TmkwMk1TNHhOalF0TVRFdU1EYzFMVFl4TGpFMk5Ib2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJell4TWpFeU1TSWdaRDBpVFRJMU1TNDNJREl6TkM0eE1UZGpNVGd1T1RRMkxURXpMalEyTVNBeU1TNHdOemt0TWpVdU5EVXlJREl4TGpBM09TMHlOUzQwTlRJdE5TNDVPRE1nTVRRdU5EQXpMVE00TGpFeUlESTBMakUxTWkwMU15NHhNVGtnTkRjdU9EYzRJRE11T0RrMElESXVPRFlnT0M0eU1EUWdNeTQ1TWpVZ01USXVPREE1SURNdU5UazJJREl1TkRnNExUZ3VNekV6SURndU5EQXlMVEU0TGpNeU5TQXhPUzR5TXpFdE1qWXVNREl5ZWlJdlBqeHdZWFJvSUdacGJHdzlJbTV2Ym1VaUlHUTlJazB5TlRBdU9UUTRJREl6TXk0ek5qaGpNVGd1T1RRMkxURXpMalEySURJeExqZ3pNUzB5TkM0M01ETWdNakV1T0RNeExUSTBMamN3TXkwekxqQTJNeUEzTGpNM01TMHhNaTQ1TnpJZ01UTXVOVEkyTFRJekxqa3pNeUF5TUM0NU5UZGhNVEV1TkRZM0lERXhMalEyTnlBd0lEQWdNQ0F4TGpnNU5TQXpMamt4Tm1NdU1EYzJMUzR3TlRjdU1UTTFMUzR4TVRZdU1qQTNMUzR4TjNvaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJak5VRXhSREZCSWlCa1BTSk5NakUxTGpreU9TQXlNREl1TkRVNVl6WXVOamMyTFRFdU5UWWdNVFF1TXprM0xURXdMakEwTmlBeE1TNHdOamN0TVRrdU1qQTJMVE11TXpNekxUa3VNVFl0TVRVdU1EQXhMUzQzT0RrdE1UWXVNVEEzSURndU16azJMVEV1TURVNUlEZ3VOelEySURJdU5UYzFJREV4TGpNNU5pQTFMakEwSURFd0xqZ3hlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkdSa1lpSUdROUlrMHlNakF1TXpJNElERTVNQzQzTXpkak1TNDFMalExTVNBekxqRXhOeTB1T1RBNUlETXVOVGt6TFRNdU1ETTJMalE0TmkweUxqRXhPQzB1TXpRMExUUXVNakF4TFRFdU9EUXlMVFF1TmpReUxURXVOVEV0TGpRME5TMHpMakV5TGpreE1TMHpMall3TlNBekxqQXpOUzB1TkRjM0lESXVNVEUxTGpNME55QTBMakl3TlNBeExqZzFOQ0EwTGpZME0zb2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNd09DNDBNVGdnTWpZMExqazRPWE10TkRndU5qUXlJREk1TGpRek5DMDJNaTR3TURJZ01URXpMak0yTldNdE5TNDRNaUF6Tmk0MU16RWdNVEF1TWpjeUlEUXdMamMzTmlBeE1DNHlOeklnTkRBdU56YzJjekV5TGpneE9DQXhPQzR5TXpFZ016QXVORElnTVRJdU9EVmpNQ0F3SURrdU5UVTRJREV3TGpRME5DQXpNQzR6TnpRdU1USTJJREFnTUMweU15NDNNamt0TVRBdU9UZzVMVE13TGpNNE15MDBPQzQyTkRNdE5pNDJOaTB6Tnk0Mk5UY2dNVEF1TWpFNUxUYzRMalUzT0NBeU1pNHhOVFF0T1RJdU5qWTRJREV6TGpNMk1pMHhOUzQzTnprZ01USXVNemd5TFRNMExqWTJOUzB1T0RNMUxUSTFMamd3Tm5vaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJalFUVkJOVUUxSWlCa1BTSk5NekF4TGprd09TQTBNamd1T1RReGJDMHVOek0yTFM0MU1qWmpMalEzTXk0ek5qTXVOek0yTGpVeU5pNDNNell1TlRJMmVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHlPVEF1TXpneElETTRNaTR3TVRKakxUVXVOVE01TFRNeExqTTBNU0F5TGprMk5pMDJNeTQ1TURjZ01USXVPRFUyTFRneUxqQTRPUzAwTVM0ek1UVWdOekl1TnpJNUxURXdMak00TVNBeE1qSXVNRFExTFRFdU16STRJREV5T1M0d01Ua2dNQ0F3TFRFMExqZ3pOaUEwTGprNE5pMHlNaTR6TmpjdE1UQXVNRGd4SURBZ01DQXVOVElnTlM0M01UUWdNeTQyTlRZZ09TNDFNallnTUNBd0xUSXlMall3TkNBeUxqTTBNeTB5T0M0d09UTXRNVGt1TWpFMUlEQWdNQzB5TGprd01TQXhNQzQ1TXpZZ09DNHlOVFFnTVRndU5qWWdNVEV1TlRJNElEY3VPVGMySURJekxqUTVOQ0ExTGpJd05pQXlNeTQwT1RRZ05TNHlNRFp6TVRVdU5USTFJREV4TGpjMk55QXpNaTQxTnpNdExqazFPR011TURBeElEQXRNakl1TXpnNExURXlMalF4TVMweU9TNHdORFV0TlRBdU1EWTRlaUl2UGp3dlp6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk16a3pMakU0TXlBeU56QXVPVE0wY3pjdU9URXRNVEF1TnpRNExUVXVPREUzTFRFMExqSXdPV013SURBdE9DNDBOVEV0TWpBdU9EZzFMVEUzTGpnd05TMHpOQzQ0TmpNdExqQXlNaTB1TURJNExTNHdORGd0TGpBMkxTNHdOamt0TGpBNU1TMDVMamc1TXkweE5pNHlPVFV0TWpFdU1UTXpMVE16TGpBNU9TMHlOeTR4T0RVdE5Ea3VOVEV6TFRrdU16RTJMVEk1TGpFMU9DQTBMamd6Tnkwek1DNDFPVE1nTnk0Mk9UTXRNemd1TURBeElEUXVORGMzTFRFeExqVTROQzB4TWk0ME1pMDJMamt6T0MwNExqQXlPQzB6TVM0M09USWdNUzQ1TnpFdE9DNHdORGNnTkM0ek16SXRNVFl1TURrMUlEWXVPREU1TFRJMExqRXhNU0E1TGpNek5TMHpNQzR3T0RJZ01UTXVPVFl5TFRjd0xqQXlOUzA1TGprM01TMDNNQzR3TWpVZ01DQXdJREUzTGpFM05pQXlMak0wTmlBMkxqSXdOU0F6Tmk0d056Z3RNVEF1T1RjZ016TXVOekk1TFRVekxqRTROU0ExTmk0NU9UY3ROREV1TlRRM0lERXdNQzQ0TnpVZ01UQXVNVFU1SURNNExqTXlOQ0F5TGpJeE1TQTFPQzQ0TXpZdE1qRXVOVFV5SURneExqTTVNU0F3SURBZ01qa3VNelkxTFRJNExqSXdOaUF5TlM0MU1ESWdNVGt1TnpZM0lEWXVPRFUzTFRjdU9EVWdOeTQxTkRZdE1qQXVNelk0SURjdU1UVTFMVE15TGpNeExqQTBMVEU0TGpjd09DQTRMakExTnkwek9TNDVOekVnTXpNdU5EZzJMVEV4TGpRM09DNDJNakV1TnpBMUlERXVNalEwSURFdU5EQTNJREV1T0RVNElESXVNVEkzTGpFd015NHhNakl1TWpFdU1qVTBMak14Tmk0ek56a2dNamd1TVRnM0lETXpMakk1TXlBME55NHdOamtnTnpndU5EWXlJRFV5TGpJeElEazBMamM0T1MwdU5qY3lMVE11TWpFekxUWXVNRGMxTFRJeExqVTFNUzA1TGpJM0xUSTVMakF4TTNwTk1qZ3dMak01TWlBME9UY3VNekl5WXpJM0xqTTBNUzB5TkM0NE1qa2dNVEl1TURVeExUWXpMalE1TnlBeE1pNHdOVEV0TmpNdU5EazNhRFl1TURjeGN6SXdMak13TWlBek15NHhORFlnTVM0MU5qTWdOell1T0RreUlpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRUUXdNeTR3TnpnZ01qUTRMamM1TTJNdE1qUXVNalU0TFRndU5UUXlMVEV5TGpJek1pMHpPQzQwT0RZdE1USXVNak15TFRNNExqUTROaTB4TUM0NU9EVWdNVFF1TVRZeUxURTFMalF4TlNBek1TNHdOUzB4TlM0ME1UVWdNekV1TURWc01UQXVNRGsySURFMExqYzBPSE14TWk0d09EWWdPQzR4TlRRZ01USXVPREVnTnk0ME1qZGpMamN5TXkwdU56STNJREk1TFRZdU1Ua3pJRFF1TnpReExURTBMamN6T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTmpFeU1USXhJaUJrUFNKTk1qVTBMakV3T1NBeU5qQXVNVGsyY3pJeUxqWXdOeUEyTGpFeE5TQXpPUzR3T1RRZ01UY3VOak5zTFRJMkxqUXhOeUF5TGprMU1YTXRPUzQ1TWpRdE55NDBOelV0TVRBdU16STFMVGN1T0RjMVl5MHVOQzB1TkRBeUxUSXVNelV5TFRFeUxqY3dOaTB5TGpNMU1pMHhNaTQzTURaNlRUUTFOUzR5TURFZ01qWXlMakV6TW5NdE1UQXVOVEV6TFRRMkxqRXpOeTAxTlM0eU1qUXRORE11TXpZeFl6QWdNQ0F5Tnk0eE5qVXRORGt1T0RZeElEa3lMakF3TXkwMk55NHlORGNnTUNBd0xUUTJMakF3TVNBMU1TNHdORFV0TXpZdU56YzVJREV4TUM0Mk1EaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6WXhNakV5TVNJZ1pEMGlUVE00T0M0ME9DQXlOVEF1TURNM2N5NHlNall0TWpBdU56WTJJREU1TGpZMkxUUXpMakl3T0d3eE5TNDBNalV0TWk0M09UUWdOUzR5TVRNZ01pNDNPVFJ6TFRNd0xqVTBPU0F4Tmk0NU9EVXROREF1TWprNElEUXpMakl3T0hvaUx6NDhMM04yWno0PVwiLFxuICAgICAgc3VjY2Vzc1BkZjpcbiAgICAgICAgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWlRQUFBRDZDQU1BQUFDbWhxdzBBQUFDQ2xCTVZFVUFBQUQyOXUzdTd1bnQ3ZW50N2VudTd1anU3dWhZb3dCYnBBUmNwUVpkcGdoanFCRmxxUlJxckIxdHJTQnVyaUp3cnlWeXNDaDZ0RFdBdHoyQ3VFS0d1a2VRdjFhVndWK1l3Mk9adzJTYXhHV2F4R2VieEdtZnhtNmhvcUNpbzZHaW82S2pwS09rcGFTa3lYZW1wcVNtcDZXbnFLYW55bnFvcUthb3FhZXBxcWlxcTZpcXE2bXFxNnFxekg2cnE2cXJyS3V0cmF1dHJxeXVyNnl2cjYyd3NhNnhzYSt4c3JDeXNyQ3lzN0N5czdHenM3R3p0TEd6dExLMHRiSzB0Yk8xdGJPMXRyUzJ0N1czdDdXM3VMYTMwcE80dWJhNXViZTV1cmU2dTdlN3ZMbTh2THE4dmJ1ODFacTgxWnk5dnJ1OTFaNit2cnkrdjd5L3Y3Mi93TDIvMXFEQXdMM0F3YjNBd2I3QndyN0N3ci9DdzcvRHc4RER4TUREeE1IRDJLWEV4TUhFeE1MRnhjUEZ4c1BHeHNQRzJxdkh4OFRIeU1USXlNWEl5Y1hKeWNiSnlzYkt5c2ZLeThmSzI3REszTEhMeThmTHk4akx6TW5Nek1uTnpjbk56c3JQejh2UDBNelEwTTNSMGMzUjBzN1Mwcy9VMU5EVTFkSFcxOVBYNHNYWTJOVFkyTlhZMmRYWjJkWFoyZGJhMnRYYTJ0YmEyOWJiMjliYjVNcmI1TXZjM05mYzNOamMzZGpjM2RuZDNkbmUzdHJlMzl2ZjM5dmc0TnZnNTlQaDRkemg0ZDNpNHQzaTR0N2k2TmJqNDk3azVOL2s1T0RsNWVEbDVlSGw1dUxsNmRybTV1SG41K0xuNStQbzZPUHA2ZVRxNnVYcTYrTHE3T1ByNiticzdPWHM3T2Z0N2VmdDdlakE5dFZ5QUFBQUIzUlNUbE1BSEtibDV1enR2cWw5c3dBQUJZZEpSRUZVZU5ydDNHbDNFMlVZZ09Fa0xSUkZFUGM5aEFxSUNBcW80QWFpb2lndWlPS0dpcUFvVUhHalFoV0xJSWdpaUNqSUl0U3FRQXNSNXo5SzI1bUdKRzA2VGZzaHpWejNGMmptYlE5bm51dGtlV2RLS3BYT05BYlNJRFZtMHFsVWVyd1RvVXFOUzZjeXpvSXFsMGsxT0FtcVhFUEtPZEJRUVNKSUJJa2dFU1NDUkpBSUVna1NRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVrQWdTUVNKSUJJa2dFU1FTSklKRWtBZ1NRU0pJQklrZ2tTQVJKSUpFa0FnU1FTSklKRWdFaVNBUkpJSkVrQWdTUVNKQklrZ0VpU0FSSklKRWtBZ1NDUkpCSWtnRWlTQVJKSUpFa0VpUUNCSkJJa2dFaVNBUkpJSkVna1NRQ0JKQklrZ0VpU0NSSUJFa2drU1FDQkpCSWtnRWlRU0pJQkVrZ2tTUUNCSkJJa2drU0FTSklCRWtna1NRQ0JKQklrRWlTQVNKSUJFa2drU1FDQklKRWtFaVNBU0pJQkVrZ2tTUVNKQUlFa0VpU0FTSklCRWtFaVNDUkpBSUVrRWlTQVNKSUpFZ0VTU0NSSkFJRWtFaVNBU0pCSWtnRVNTQ1JKQUlFa0VpU0NSSUJJa2dFU1NDUkpBSUVrRWlRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVpVVp5c3UzeXZtcmZjL2hFdm56Vi9yYVMybjg4ZG1hUW4xaTJ0dEJ1U01aazMyVExhbjU0N1o2U1ZhdXlBNVJiOHZtUkFYN2lnR3Y3ZWh5U2VrSFMwN3pXcmxpRHYyZHpGeVJKUlpMTnp0a1hiL0F6UCttR0pLbElzdGtOc1FhZnpjNytHWkxFSXNsdWlZY2ttMnVESkJGSW11ZjIxbHcwMUozeGtHU3pheUJKQXBJbndxLy9Pcmg5ZnY5UTUrWkxCcisrSzZ6enlQZGJIczBWeHIreEhFbi8ya0o1U09vQ3lhWHlYODZNWnQ5YU12Z05SZDk3NXAxYytaUE9JR3NUVW1LUUJNR2hxZUdqQzRjWS9LbUgramRYamtLU0xDVEIydkRScWY4TU1manU1WkdTSlpBa0RFaytlZ1BiUHRUZ0x5Nk9sT3lESkZsSWdvWGh3MThNT2ZpT0dlR3hSeUJKR0pLVjBVZVVvUWUvUFhvcTJRdEpzcEI4RkQ3ODV0Q0R6ODhLRDc0RlNiS1F2QkErL0VHTXdXOE1EOTRIU1RMZmsyeU5NZmlqMGV2Tk1VZ1MrZWxtWjV4bmh4bEZvaUJKQ0pMTjBUN0oyVGhJbmltNmdnTkpNcEFjbXphc2o3WHJ3cU1yaXRhdU9WMWNKeVQxaE9Udy9kRzdqRzJ4a0xTRVJ4Y1hyVTNlSmVBRUlUbFZtUEs4ZkN3azI4S2pDeUNwYnlSejF2VDI3QVBObGU0bkdSakoxOUdkQlpBazc4NjBBb25LU0ZxTHJobERraVFrcTRPWVNEYUVSNStDSkdGSW1yY0hjWkc4RVI1ZENVbWlrT1JXbkFoaUkxbFVkRFV3V3Z0Y2UzRS9sSC9qN3grK1YralR2eUVaUzBnV3JPOG9YbFVSU1ZldTZPYVQySnRwLzk3YVZOUVY5MEpTMjBobUxPMXQrYXAxTGQrZUxWdFZjZkRmUmM4KzU0YUg1SzZtMGw2Q1pJenNrd3hVeGNHdkNBOCtGZ3dQeWVReUpOZERVcWRJVGtldk5oOFBFMG1aa2FhcklhbFRKSzlFcnpaL2pnREpoQmQzVFdwcW1neEpmU0xaV2ZwYmZOVWdtZkJhRVB4MEpTUjFpdVI0ZERQSnRNN3FrZlFZZ2FSdWtSeU1qR1RYQmxVZ21mVFpUWkdSQTE1dWFxbHpPOVp0K1dWVWtIUzNSRGVlWkJmbHEwQXk4VUFRM0ZJd0Frbk50SGQyendoZno0OFl5Y25XMmYzYmIzZDNCRlVnbVhMaDBoKzM5UnVCcEZicW5ONDN3MDNWSUhteU5hemwzZWZuWDc2TGZ5aW9Ca25URFJmNi90cG5CSkphYVgzMFJqTmZCWkpCbXJVL3FBNUpxQ1EwQWttdHREU2E3SytqaG1SaFIxQXRrbDRsa1JGSWFxVmx4YjhsTTNJa3ViZTdnK3FSWEZMU2J3U1NXbWxUT01QcEYwY0ZTZTdWMDdIM1ZBYmVKNWt5c1FtU0dxdHJUdDhNMjRKUlFQTGcrNmZpNzZtVWRsWFp0WnRySWFtUmp2Zjg3MFROVzRNUklXbWV1MmpaNmgyZHc5aFRLZS9HTWlSM1FsSXJYZnh0eCs2ek5mRHYrT09hRWlQWG5ZZEVKWjEvK3ZhYkM5M3g4bjhCSktyL0lCRWtna1NRQ0JKQklrZ0VpUVNKSUJFa2drU1FhQ3doYVhBT1ZMbUdWTVpKVU9VeXFmUjRaMEdWR3BkT3BkS1pSaWRDZzlXWVNhZitCd3JXL2c0c0tPdERBQUFBQUVsRlRrU3VRbUNDXCIsXG4gICAgICBzdWNjZXNzVmlkZW86XG4gICAgICAgIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFmUUFBQUQ2Q0FZQUFBQlhxN1ZPQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBRWJCSlJFRlVlQUh0M1UrTW5IVVpCL0RmN0U3L2JtZVgxdTF1VzZCQVc2QkZnNml4dEFxYVlHSTBNUnpBdXhkT2V0S1ROOUVZcjU2OEtHZHZrcEJnb2pFUm83U1dKbWdRcVczQmlvSllPcnV0UzNmYjdqL0dtVFpkVzNaMk83T2RtZmQ5bi9sczBqRDd6anZ2KzNzK3p3TmZadWFkVG1seThtd3QrU0ZBZ0FBQkFnUUtMVEJRNk5WYlBBRUNCQWdRSUhCVlFLQWJCQUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQlFSa0NBUUhjRkZoWVcwNm5UcDFQMTNFU2FucG5wN3NsdTgrZ0RBd05wMDZhTmFYaDRKTzNjT1piR3g4YlM0T0RnYlI3Vnd3a1E2SVZBYVhMeWJLMFhKM0lPQXYwbzBBanpsNDhjVGRQVCtRN3lsWHF6ZnYzNnRHL2ZublR2UGJ0VEkrejlFQ0NRWHdIL2h1YTNOMVlXUUtEeHpMeW9ZZDdnbjV1YlN5ZE9uRXhIamg1TGx5OWZEdEFSSlJDSUt5RFE0L1pXWlRrUU9IZXVtb05WM1A0U3BxWStxTC9TOE1kMGNYcjY5Zy9tQ0FRSWRFVkFvSGVGMVVFSlhCT1ltYmtVaG1KMmRpNGRPM1pjcUlmcHFFS2lDYmdvTGxwSDFaTjdnY2I3MGlNakk3bFlaN1hhM2lzSTEwUDkwS01IVTZXeUpSYzFXQVFCQXRjRUJMcEpJTkJqZ1VhWVAzcndNejArYS9QVHZmakxYeTI3NDJQYnRxVmRkKzVNcDA2K21lYm01NWJkZnpYVVh6bWVoUG95R2hzSVpDcmdKZmRNK1oyY1FQNEVCdW9mVTd0bjk5M3BzY2NPMVQvQ3RxbnBBcStIdXZmVW0vTFlTQ0FUQVlHZUNidVRFc2kvd09iTm05UG5EaDljUGRTOXA1Ny9SbHBoM3dnSTlMNXB0VUlKdEMvUWVJWXUxTnQzOHdnQ1dRZ0k5Q3pVblpOQWdRU0Vlb0dhWmFsOUxTRFErN3I5aWlmUW1rQWoxQThmK216YXRIR1Y5OVM5L040YXByMElkRWxBb0hjSjFtRUpSQk5vdktkKytMQlFqOVpYOWNRUkVPaHhlcWtTQWwwWEVPcGRKM1lDQW1zV0VPaHJwdk5BQXYwcElOVDdzKytxenIrQVFNOS9qNnlRUU80RWhIcnVXbUpCQkpKQU53UUVDS3hKUUtpdmljMkRDSFJOUUtCM2pkYUJDY1FYYUNYVWo3L3k2dFd2WVkydm9VSUMyUW9JOUd6OW5aMUE0UVZ1RmVxWHIxeE9yNzMyMThMWHFRQUNlUmNRNkhudmtQVVJLSURBclVMOS9YUG4wdm56RndwUWlTVVNLSzZBUUM5dTc2eWNRSzRFYmhYcWI3NTFKbGZydFJnQzBRUUVlclNPcW9kQWhnS05VRDlZLzJyWVVxbTBiQlVURXhOcGZuNSsyWFliQ0JEb2pJRHZRKytNbzZNUUNDT3d1TGlZWm1ZdXJibWVnWUdCTkRxNkxWV3JremNkbzFhcnBXbzkxSGZ0M0huVGRyOFFJTkFaQVlIZUdVZEhJUkJHNFB6NTgrbWwzLzIrSy9WY21ybmNsZU02S0FFQ3llZlFEUUdCZmhZb2x3ZDdXdjdzM0d4UHorZGtCUHBKd0h2by9kUnR0Ukw0aUVDbFV2bklsaTcvV3V2eThSMmVRQjhMQ1BRK2JyN1NDZXpidXdjQ0FRSkJCQVI2a0VZcWc4QmFCTWJIeDlLQi9RODB2U3A5TGNmekdBSUVzaE53VVZ4MjlzNU1JQmNDZSt2UDBzZkh4MVBqWTJVemwrcFh0M2ZnWmZIR3g5UGUvZmQ3dWFqUElnajBpNEJBNzVkT3E1UEFLZ0pidGd5bHhwOU8vVFErOWliUU82WHBPQVJhRS9DU2UydE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdRRWVtdE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdSY0ZOZWFrNzBJWkNZd05UV1YvbjdtN2ZvWG15eGt0b1k3UmlycC92djNwY2JmMCs2SEFJRjhDZ2owZlBiRnFnZ3NDYnh4NGxUOXU4VFBMLzJleFkxcXRacUdoNGZUenAwN3NqaTljeElnMElLQS85MXVBY2t1QkxJVW1KMjlrdVhwbDg1OVpkYmZ3NzZFNFFhQkhBb0k5QncyeFpJSUVDQkFnRUM3QWdLOVhUSDdFK2l4UUY3ZXR5NFA5dmFiMlhyTTdIUUVDaThnMEF2ZlFnVkVGN2p2dm50VHVaenQ1UzRqSThOcGJHeDdkR3IxRVNpMFFMYi9sU2cwbmNVVDZJM0E3cnZ2U28wL2ZnZ1FJTENhZ0dmb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRXhEb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRTNCUjNHbzY3aU9RRTRFTEY2YlN3c0pjWnF1cFZJYlR4bzBiTWp1L0V4TWdjR3NCZ1g1ckkzc1F5RlRnOWRmZlNQLzgxenVacnFGVUtxVXZQUDc1Vktsc3lYUWRUazZBd01vQ1huSmYyY1k5QkhJaE1ERTVtZms2YXJWYW1zekJPaktIc0FBQ09SWVE2RGx1anFVUnlKTkFMVStMc1JZQ0JKWUpDUFJsSkRZUUlFQ0FBSUhpQ1FqMDR2WE1pdnRNWUhoNEpCY1YzekdTajNYa0FzTWlDT1JRd0VWeE9XeUtKUkc0VWVDVEQzOGlqWTl2VC9Qejh6ZHU3dW50UnBodjNYcEhUOC9wWkFRSXRDY2cwTnZ6c2plQm5ndVV5NFBwcmp0MzlmeThUa2lBUUxFRXZPUmVySDVaTFFFQ0JBZ1FhQ29nMEp1eTJFaUFBQUVDQklvbElOQ0wxUytySlVDQUFBRUNUUVVFZWxNV0d3a1FJRUNBUUxFRVhCUlhySDVaYlI4S1ZLdlZkT3JVVzJsK0lidXIzQnNmbld0Y2JkKzRRTThQQVFMNUZCRG8rZXlMVlJGWUVtaUUrWCtucHBaK3orTEd6TXlscXgrZGM3VjlGdnJPU2FBMUFZSGVtcE85Q0dRbWtPVXo4eHVMenZKejhEZXVvNTNiRitlcTZiMkxKOVBpaDYxL1U5Mkd3YUYwNS9CRGFXTjV1SjFUMlpkQTVnSUNQZk1XV0FBQkFwMFdxTlVXMC9Nbm4wMi8vY2ZQMW5UbzhzRDY5T1NEMzAxZnV1K2JhM3E4QnhISVFzQkZjVm1vT3llQk5nVFdsZGUxc1hmM2RsMjNMaC9yYUtYQzM1ejV5WnJEdkhIOGhmb3ordWYvOW9QMDU3TXZ0bkk2K3hESWhZQm42TGxvZzBVUVdGbmd3UWYzNWVLaXVCM2o0eXN2TW1mM0hIM241eDFaVWVNNG45cnh0WTRjeTBFSWRGdEFvSGRiMlBFSjNLYkE5dTNiVStPUG45WUZxcGZlYm4zblZmYWM2TkJ4VmptRnV3aDBUTUJMN2gyamRDQUNCSW9xTUZncXAyYysvZFAwdlM4ZVNkczIzYjFVUnEzMjRkSnROd2prWFVDZzU3MUQxa2VBUUZjRnJvWDVjL1dYMXA5TVkwTjcwN2NQL1NLdEc5elkxWE02T0lGdUNBajBicWc2SmdFQ2hSQzRIdVlQajMrbEVPdTFTQUtyQ1FqMDFYVGNSNEJBNFFVYUw2Ri81L0FMNmZIZDM3aXBsbVpoZnY3eU8rbkh4NTVPODR0WGJ0clhMd1NLSU9DaXVDSjB5Um9KRUZpVHdOQzZyZldYMEorLytyNzQzcTJQcHZMQXV2VFMyOCtsbGNQOHFkUUlkVDhFaWlnZzBJdllOV3NtUUtBbGdjcUcwVFN5Y2NmU3ZsOS82SWVwVkJwTTkyODduRzU4bWYzYU0zTmh2Z1RsUmlFRnZPUmV5TFpaTkFFQ3JRaWNuWDR6UGZlblo5Smk3ZjlmYlBQMGdlOEw4MWJ3N0ZNNEFZRmV1SlpaTUFFQzdRajg1ZjFmTHd2MTY0LzN6UHk2aEg5R0VCRG9FYnFvQmdJRVZoVm9GdXJDZkZVeWR4WlFRS0FYc0dtV1RJQkErd0kzaHJvd2I5L1BJL0l2NEtLNC9QZklDb01KVE5XLzIveVY0NjhHcStybWNoWVhGMi9la0pQZkdxSCtvejg4a1M3T1RxU1orUXM1V1pWbEVPaU1nRUR2aktPakVHaFpZRzV1TGxXcjFaYjNEN1ZqcVRmVlZOYVBwb3R6RTAxUDFyaFFydFdmeWdaL2gzNnJWdmJMWHNCTDd0bjN3QW9DQzJ3WkdncGNYZnVsRFczZTNQNkQxdkNJajQ4OXNZWkhMWC9JUTlzN2M1emxSN2FGUU9jRkJIcm5UUjJSd0pMQTlySFJwZHY5ZnFOVUtxWFIwZDU0UEhYZzJiU3JzdisyeVBlUFBwNit2T2RidDNVTUR5YlFTNEhTNU9UWldpOVA2RndFK2tsZ1lXRXh2WHprYUpxZW51bW5zcHZXZW1EL0EybnYzajFONyt2R3hzVVA1OUtyLzNraHZmdkJpZnJuME9kYVBzV0d3YUcwZStTUjlNaU9yOVlmMDZQM0NGcGVuUjBKckN3ZzBGZTJjUStCamdnMFF2M1U2ZE9wZW00aVRjLzBWN0NYeTRPcFVxbWtmZlVnSHg4ZjY0aW5neEFnMEZ4QW9EZDNzWlVBQVFJRUNCUkt3SHZvaFdxWHhSSWdRSUFBZ2VZQ0FyMjVpNjBFQ0JBZ1FLQlFBZ0s5VU8yeVdBSUVDQkFnMEZ4QW9EZDNzWlVBQVFJRUNCUktRS0FYcWwwV1M0QUFBUUlFbWdzSTlPWXV0aElnUUlBQWdVSUpDUFJDdGN0aUNSQWdRSUJBY3dHQjN0ekZWZ0lFQ0JBZ1VDZ0JnVjZvZGxrc0FRSUVDQkJvTHZBL0s0czNNM2o1MmhZQUFBQUFTVVZPUks1Q1lJST1cIixcbiAgICAgIHN1Y2Nlc3NNdWx0aXBsZTogXCIuL3Jlc291cmNlcy9pbWFnZXMvaWNvbnMvaWNvbi1tdWx0aXBsZWZpbGVzLnN2Z1wiLFxuICAgIH07XG5cbiAgICAvL3RoaXMuc2V0QXZhdGFySW1nU3JjKCk7XG4gICAgdGhpcy5ldmVudEhhbmRsZXIoKTtcbiAgfVxuXG4gIHNldEF2YXRhckltZ1NyYyhpbWFnZVNyYyA9IHRoaXMuYXZhdGFySW1hZ2UuZGVmYXVsdEltYWdlKSB7XG4gICAgdGhpcy5hdmF0YXJJbWcuc3JjID0gaW1hZ2VTcmM7XG4gICAgdGhpcy5zZXRFcmFzZUltYWdlQ29udGFpbmVyU3RhdGUoKTtcbiAgfVxuXG4gIGdldEF2YXRhckltZ1VybCgpIHtcbiAgICBsZXQgYXZhdGFySW1hZ2VVcmw7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgIHN3aXRjaCAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGF2YXRhckltZ1V0bCA9IHRoaXMuYXZhdGFySW1hZ2UuYmFzZUltYWdlO1xuICAgICAgICB0aGlzLmVyYXNlSW1hZ2VDb250YWluZXJTdGF0ZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0udHlwZS5tYXRjaChcImltYWdlL1wiKSkge1xuICAgICAgICAgIGF2YXRhckltYWdlVXJsID0gdGhpcy5jYWNoZWRGaWxlQXJyYXlbMF1bXCJkYXRhVXJsXCJdO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLnR5cGUubWF0Y2goXCJhcHBsaWNhdGlvbi9wZGZcIikpIHtcbiAgICAgICAgICBhdmF0YXJJbWFnZVVybCA9IHRoaXMuYXZhdGFySW1hZ2Uuc3VjY2Vzc1BkZjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheVswXS50eXBlLm1hdGNoKFwidmlkZW8vXCIpKSB7XG4gICAgICAgICAgYXZhdGFySW1hZ2VVcmwgPSB0aGlzLmF2YXRhckltYWdlLnN1Y2Nlc3NWaWRlbztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGF2YXRhckltYWdlVXJsID0gdGhpcy5hdmF0YXJJbWFnZS5zdWNjZXNzTXVsdGlwbGU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRBdmF0YXJJbWdTcmMoYXZhdGFySW1hZ2VVcmwpO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyKCkge1xuICAgIHRoaXMuaW5wdXRUeXBlRmlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMuZmlsZVVwbG9hZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVyYXNlSW1hZ2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiY2xpY2tcIixcbiAgICAgIHRoaXMuYXZhdGFySW1hZ2VUb0RlZmF1bHQuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBhdmF0YXJJbWFnZVRvRGVmYXVsdCgpIHtcbiAgICB0aGlzLmNhY2hlZEZpbGVBcnJheSA9IFtdO1xuICAgIHRoaXMuaW5wdXRUeXBlRmlsZS52YWx1ZSA9IFwiXCI7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImhpZGRlblwiO1xuICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgdGhpcy5zZXRJbnB1dEZpbGVMYWJlbFRleHQoKTtcbiAgICB0aGlzLnNldEF2YXRhckltZ1NyYygpO1xuICB9XG5cbiAgZmlsZVVwbG9hZCgpIHtcbiAgICBsZXQgaW5wdXRmaWVsZEVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgbGV0IGZpbGVzVG9VcGxvYWQgPSBpbnB1dGZpZWxkRWxlbWVudC5maWxlcztcbiAgICBsZXQgdG90YWxGaWxlc1RvVXBsb2FkID0gaW5wdXRmaWVsZEVsZW1lbnQuZmlsZXMubGVuZ3RoO1xuXG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcblxuICAgIG5ldyBQcm9taXNlKFxuICAgICAgZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZpbGVzVG9VcGxvYWQpLmZvckVhY2goXG4gICAgICAgICAgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheVtrZXldID0gZmlsZXNUb1VwbG9hZFtrZXldO1xuXG4gICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVzVG9VcGxvYWRba2V5XSk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV1bXCJkYXRhVXJsXCJdID0gcmVhZGVyLnJlc3VsdDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoIC0gMSA9PT0gcGFyc2VJbnQoa2V5KSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jYWNoZWRGaWxlQXJyYXkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApLnRoZW4oXG4gICAgICBmdW5jdGlvbihmaWxlc0FycmF5QXNEYXRhVXJsKSB7XG4gICAgICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgICAgIHRoaXMuc2V0SW5wdXRGaWxlTGFiZWxUZXh0KCk7XG4gICAgICAgIHRoaXMuZ2V0QXZhdGFySW1nVXJsKCk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgc2V0SW5wdXROYW1lRmlsZVZhbHVlKCkge1xuICAgIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgdmFsdWUgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuY2FjaGVkRmlsZUFycmF5KS5mb3JFYWNoKFxuICAgICAgICBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAvLyBsZXQgbmV3QXJyYXkgPSBbJ2ZpbGVuYW1lJywgZGF0YV1cbiAgICAgICAgICB2YWx1ZS5wdXNoKHtcbiAgICAgICAgICAgIGRhdGFVcmw6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0uZGF0YVVybCxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0ubmFtZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgICAgdGhpcy5pbnB1dE5hbWVGaWxlLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlucHV0TmFtZUZpbGUudmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gIHNldElucHV0RmlsZUxhYmVsVGV4dCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID0gXCJzZWxlY3QgYSBmaWxlXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID0gdGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0ubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheS5sZW5ndGggKyBcIiBmaWxlcyBzZWxlY3RlZFwiO1xuICAgIH1cbiAgfVxuXG4gIHNldEVyYXNlSW1hZ2VDb250YWluZXJTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuZXJhc2VJbWFnZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgNjU1XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVyYXNlSW1hZ2VCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICA1XG4gICAgICApO1xuICAgIH1cbiAgICAvLyAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0YXRlJywgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZVVwbG9hZFNob3dQcmV2aWV1dztcbiIsIihmdW5jdGlvbigpIHtcclxuICBtZXRob2RzLm1vZHVsZXMubW91bnRBbGwoXCJib2R5XCIpO1xyXG4gIG1ldGhvZHMubW9kdWxlcy5pbml0QWxsKFwiYm9keVwiKTtcclxufSkoKTtcclxuIl19
