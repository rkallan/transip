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
    getContactsFromApi: function () {
      let favorites = window.location.search.split('=')[1];
      let url = 'http://localhost:3000/posts?_sort=firstname,lastname&_order=asc,asc';
      if (favorites === 'favorites') {
        url = url + "&favorites=true";
      }
      fetch(
        url
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
      var postData = Array.prototype.slice
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
      backButton.addEventListener("click", methods.contactItem.back);
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
    back: function (event) {
      const formElement = event.currentTarget.form;
      const contactItemWrapper = formElement.parentNode;

      contactItemWrapper.removeChild(formElement);
      contactItemWrapper.removeAttribute("state");
    }
  };

  methods.setElements = function () {
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
        event.currentTarget.class = ""
        window.history.pushState('', '', event.currentTarget.search)
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

  methods.init = function (viewport) {
    if (elements.contactsContainer) {
      window.addEventListener("resize", methods.elementWidth.fixedContainer);
      const buttonAddContact = elements.contactsContainer.querySelector(
        ".button-add"
      );
      buttonAddContact.addEventListener("click", methods.page.addContact);

      methods.navigation.setEventListner();

      // get and show contact list
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
        methods.data.getContactsFromApi();
      }
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
