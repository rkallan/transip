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
                contactItemWrapper: ".contact-item.wrapper",
            };

            contactItems = {};

            methods.data = {
                getContactsFromApi: function() {
                    fetch(
                        "http://localhost:3000/posts?_sort=firstname,lastname&_order=asc,asc"
                    ).then(function(response) {
                        if (response.ok && response.status === 200) {
                            response.json().then(function(json) {
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

                saveContact: function(event) {
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

                    new Promise(function(resolve, reject) {
                        const data = methods.data.serialize(formElements);
                        resolve(data);
                    }).then(function(data) {
                        fetch(formAction, {
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                method: formMethod,
                            })
                            .then(function(response) {
                                return response;
                            })
                            .then(function(response) {
                                if (
                                    response.ok === true &&
                                    ((formMethod === "post" && response.status === 201) ||
                                        (formMethod === "PATCH" && response.status === 200))
                                ) {
                                    return response.json();
                                }
                            })
                            .then(function(data) {
                                methods.data.getContactsFromApi();
                                methods.page.showContact(data);
                            })
                            .catch(function(error) {
                                console.warn(error);
                            });
                    });
                },

                deleteContact: function(event) {
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
                        .then(function(response) {
                            return response;
                        })
                        .then(function(response) {
                            if (response.ok === true && response.status === 200) {
                                methods.data.getContactsFromApi();
                                contactItemWrapper.removeChild(form);
                                methods.data.removeContactItemFromDomNode(contactId);
                            }
                        })
                        .catch(function(error) {
                            console.warn(error);
                        });
                },

                serialize: function(formElements) {
                    var postData = Array.prototype.slice
                        .call(formElements)
                        .reduce(function(data, item, currentIndex, array) {
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
                                        }, ];
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

                    if (!elements.contactItemsUnit) {
                        return false;
                    }
                    let prevContactId;
                    methods.setElements();
                    contacts.forEach(function(contact, index) {
                        let prevElement;

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
                                index === 0 && elements.contactListItemsUnit.childNodes[0] !== undefined
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
                        }
                        prevContactId = contact.id;
                    });
                    methods.elementWidth.fixedContainer();
                },
                showContact: function(event) {
                    const currentContact = methods.data.getContactById(
                        event.currentTarget.value
                    );

                    methods.page.showContact(currentContact);
                },
                removeContactItemFromDomNode: function(contactId) {
                    elements.contactItemsUnit
                        .querySelector("#contact-item-" + contactId)
                        .remove();
                },
            };

            methods.page = {
                addContact: function() {
                    const content = methods.pageContainer.contactViewAndForm();
                    methods.page.contactsContainer(content);
                },
                showContact: function(currentContact) {
                    const content = methods.pageContainer.contactViewAndForm(
                        currentContact,
                        "read"
                    );
                    methods.page.contactsContainer(content);
                },
                contactsContainer: function(content) {
                    const oldWrapper = elements.contactsContainer.querySelector(
                        selectors.contactItemWrapper
                    );
                    new Promise(function(resolve, reject) {
                        let removedNode = elements.contactsContainer.removeChild(oldWrapper);
                        let addedNode = elements.contactsContainer.appendChild(content);
                        resolve(removedNode);
                    }).then(function(data) {
                        modules["file-upload"].mount();
                        modules["file-upload"].init();
                        modules["file-upload"].render();
                        methods.elementWidth.fixedContainer();
                    });
                },
            };

            methods.pageContainer = {
                    contactListItem: function(currentContact) {
                            let customAvatar =
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MTIiIGhlaWdodD0iNjEyIiB2aWV3Qm94PSIwIDAgNjEyIDYxMiI+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2YzEyMy4yMDEtNzUuNDMyIDIxNy40OTIgNi4yODcgMjE3LjQ5MiA2LjI4N2wtMi4yNCAyNS43MDljLTYzLjY3Ni0xMy44MzctOTcuODgzIDMxLjg3My05Ny44ODMgMzEuODczLTM2Ljc1Mi01OC44MDYtMTE3LjM2OS02My44NjktMTE3LjM2OS02My44Njl6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTEwNi44MzQgMjc1LjI2czExMC4xMDQtNTYuNjcxIDE5My40MjcgNi4zOTdjODMuMzI0IDYzLjA3MSAwIDAgMCAwbC0xNC4xMjggMjAuMjQ2cy02Ny4zNS03MC41My0xNzkuMjk5LTI2LjY0M3oiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjI0LjIwMyAzMzkuMTNzLTEuMTA5LTQ3LjkxOCAyOS45MTYtNzguOTQzbDM5LjA4OCAxNy42MzkgMTcuNzE4IDExLjI5Ni0zNi44MTQgMjAuNTY4cy0yNi43MTIgMy4zNDYtNDkuOTA4IDI5LjQ0eiIvPjxwYXRoIGZpbGw9IiNCNzMyMzEiIGQ9Ik0xMDYuODM0IDI3NS4yNnMxMDIuODUyLTU0LjI0NyAxOTIuMTE4IDYuMjkzbDYuMjMzLTE0LjMxOWMuMDAxLjAwMS05Ni42MzYtNTkuNzA5LTE5OC4zNTEgOC4wMjZ6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQ5MS45OCAxNTEuNTI0Yy0xMDYuNjU3IDE3LjIwMS0xMjAuMzY1IDEwOS41MDUtMTIwLjM2NSAxMDkuNTA1bDE4Ljc2OCAyNC45ODljMzQuMDA3LTI5LjE4OSA2NC44MTgtMjMuODg2IDY0LjgxOC0yMy44ODYtMTEuOTI5LTU4LjY4NiAzNi43NzktMTEwLjYwOCAzNi43NzktMTEwLjYwOHoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMjcxLjU3IDY4Ljk1OGMxNS4wNTggOS4xIDMwLjk5NyAxNy4yMSA0Ny42NzggMjIuOTktLjgwMi0xMi45NjkuMzUxLTI2LjE0OCAxLjAyNC0zOC43MjIgMS41NzItMjkuMjc3LTcuNTgxLTQ0Ljc0Mi0xNy44NC00Mi40NjUtMTAuMjYyIDIuMjc3LS44OTMgMTIuNjQ5LTMzLjUyOCAyNi4yODktMTAuMjE4IDQuMjY3LTE4LjM2OSA2LjgzNS0yNi4yMTMgMTIuNTY0IDguMTYxIDguMDg2IDE5LjgxIDEzLjg1MyAyOC44NzkgMTkuMzQ0eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00NTUuMjAxIDI2Mi4xMzJzLTIwLjcxNi0zNC44NTYtNjYuMTA2LTM0Ljg1NmwtNS42NjMgMjYuMTU0IDEuNDg0IDE2Ljg0MSAxOS45NDEgNi43NTdjMC0uMDAxIDE2LjA0Ni0xNC44OTYgNTAuMzQ0LTE0Ljg5NnoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNNDkxLjk4IDE1MS41MjRzLTEwOC4zNDYgMzEuNjU0LTEwOC4zNDYgMTI1LjUwM2wtNy4xNDYtMzYuMzM0Yy4wMDEtLjAwMSAxNy43OTEtNzUuODM0IDExNS40OTItODkuMTY5eiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNDQuNzM2IDUxMC43MTdsMTEuNDAzLTMwLjczM2MtMTIuNzI4IDQuOTI4LTMwLjk2NSAxMC4zOTQtNDYuOTU0IDE0Ljg3IDEwLjMgNi4xMTEgMjIuMDYgMTEuNTM3IDM1LjU1MSAxNS44NjN6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTI3OC44MTYgNDE4Ljg1MmMtNTIuNDE1IDUuOTQ4LTkxLjkxNi05LjMwMS0xMTcuMDUyLTM0LjQ4Ny00LjA4NS00LjA5MS03LjY4MS00LjQ3LTEwLjM1Ni0yLjExMS0xMi41NzQgMTIuNTc0IDI3LjExOSA4NC40NjcgMTAwLjU2MiA4NC40NjcgMy40OTYgMCA2LjQ3Mi4wODggOC45OTcuMjUxbDExLjI3Ny0zMC40MTcgNi41NzItMTcuNzAzeiIvPjxwYXRoIGZpbGw9IiNDRENDQ0MiIGQ9Ik0yNjAuOTY2IDQ2Ni45NzFsLTQuODI3IDEzLjAxM2MxNi40MzQtNi4zNjYgMjMuNjQ4LTExLjgxNyA0LjgyNy0xMy4wMTN6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTE1MS40MDggMzgyLjI1M2MtMTEuODUxIDEwLjQ2My01LjQ1NCA3NS4wNjkgNTcuNzc3IDExMi42MDEgMTUuOTg5LTQuNDc3IDM0LjIyNy05Ljk0MiA0Ni45NTQtMTQuODdsNC44MjctMTMuMDEzYy0yLjUyNS0uMTYzLTUuNS0uMjUxLTguOTk3LS4yNTEtNzMuNDQzIDAtMTEzLjEzNi03MS44OTMtMTAwLjU2MS04NC40Njd6TTQwNy4yNzMgNTE2LjY0NmMuMTU2LjA1MS4zMDEuMDg4LjQ1NC4xMzUtLjE1My0uMDUtLjI5Ny0uMDg0LS40NTQtLjEzNXoiLz48cGF0aCBmaWxsPSIjQjczMjMxIiBkPSJNMzY2LjUzNyA0ODUuNTQ3Yy0xMS45OTQgMjEuNTIzIDM2LjgwNSAxNy43OSA1NS42NDQtMTMuODUgMTguOTMxLTM2LjMwNy0xNi4yNjctNjIuNTI1LTE2LjI2Ny02Mi41MjVsLTM3LjIyOCA2OS40MDFjLjgwMi40NzQuMzM4IDIuNTEzLTIuMTQ5IDYuOTc0ek00MDcuNzI4IDUxNi43ODFjLS4xNTMtLjA0Ny0uMjk4LS4wODQtLjQ1NC0uMTM1LTMyLjYyNi05Ljg4Ni0zNy42OTcgOC44ODEtMTUuMzY5IDI3LjA2NSAxNC45NjggMTIuMTg3IDYuOTcxIDIwLjYwMSA2Ljk3MSAyMC42MDEgMTMuNzA1LS45ODcgMTYuMzU0LTEyLjA5MiAxNi4zNTQtMTIuMDkyIDEzLjE0NS0uOTQ2IDcuOTYtMTUuODc2IDcuOTYtMTUuODc2czEyLjI4LTE0LjU0OC04LjYzMy0xOC4wNDRjLS4yMS0uMDMxLS4zODktLjA3NS0uNTg5LS4xMTItMS44OC0uMjM4LTMuODU5LS42NzEtNS45NjItMS4zMjlhNi41MDMgNi41MDMgMCAwIDEtLjI3OC0uMDc4eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0zOTEuOTA0IDU0My43MTJjLTIyLjMyOC0xOC4xODUtMTcuMjU3LTM2Ljk1MSAxNS4zNjktMjcuMDY1LTE0LjM2My00LjI0MS0xNi42NzUtMTEuNzI1LTE2LjY3NS0xMS43MjUgMTYuMzQzLTExLjY1IDI2LjE2OS0yMi44NSAzMS41ODItMzMuMjI1LTE4LjgzOSAzMS42NC02Ny42MzggMzUuMzczLTU1LjY0NCAxMy44NSAyLjQ4Ny00LjQ2MSAyLjk1MS02LjUgMi4xNDktNi45NzRsLTIwLjE2NSAzNy42MDRjLTcuMDE0IDE2LjcyOSAyNC40NCAxNS4zNDQgNDUuNDQ3IDM1LjYwNSA3Ljc4OCA3LjUwNSA0LjkwNiAxMi41MyA0LjkwNiAxMi41M3M3Ljk5OS04LjQxNC02Ljk2OS0yMC42eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MDguMDA2IDUxNi44NTljMi4xMDMuNjU4IDQuMDgyIDEuMDkxIDUuOTYyIDEuMzI5YTYwLjk3IDYwLjk3IDAgMCAxLTUuOTYyLTEuMzI5eiIvPjxwYXRoIG9wYWNpdHk9Ii4zMyIgZmlsbD0iIzczMjcyOCIgZD0iTTQwOC4wMDYgNTE2Ljg1OWMyLjEwMy42NTggNC4wODIgMS4wOTEgNS45NjIgMS4zMjlhNjAuOTcgNjAuOTcgMCAwIDEtNS45NjItMS4zMjl6Ii8+PGcgZmlsbD0iIzczMjcyOCI+PHBhdGggZD0iTTQyMi4xODEgNDcxLjY5N2MtNS41NjkgOS4zNTEtMTMuNzU4IDE2LjI0Ni0yMi4yMTkgMjAuNzkxLTc4LjIyNCAzNS4xMDEgMTguMjAzLTMyMy43ODkgMTAuMDQzLTc5LjcxMSAwIDAgLjU4Ni4yODgtNy42MjgtNi44MjMtOC4yMjctNy4xMTctMjAuMjg2IDUyLjAzNS0yMC4yODYgNTIuMDM1cy05Ljg1OCAyOC45MTQtMTMuMzU3IDM5LjYxOGMtNC4xNDctMi4wMTgtNS41NDgtNi4wNTMtMi4xOTYtMTIuMDYxIDIuNDg3LTQuNDYxIDIuOTUxLTYuNSAyLjE0OS02Ljk3NGwtMjAuMTY1IDM3LjYwNGMtNy4wMTQgMTYuNzI5IDI0LjQ0IDE1LjM0NCA0NS40NDcgMzUuNjA1IDcuNzg4IDcuNTA1IDQuOTA2IDEyLjUzIDQuOTA2IDEyLjUzczcuOTk3LTguNDE0LTYuOTcxLTIwLjYwMWMtMjIuMzI4LTE4LjE4NS0xNy4yNTctMzYuOTUxIDE1LjM2OS0yNy4wNjUtMTQuMzYzLTQuMjQxLTE2LjY3NS0xMS43MjUtMTYuNjc1LTExLjcyNSAxNi4zNDMtMTEuNjQ5IDI2LjE3LTIyLjg0OCAzMS41ODMtMzMuMjIzek00MDkuODYzIDUzOC4wMjFzNy44NzYgNC4zODMgNS4zNjYgMTQuMmM0LjMwOC0uMjc2IDUuOTQyLTIuMDggNS45NDItMi4wOC0xLjY3MS0xMC42NzMtMTEuMzA4LTEyLjEyLTExLjMwOC0xMi4xMnpNNDE2LjczMyA1MjguNDI2czQuNzA4IDEuNDM1IDYuNDU2IDcuOTE5YzIuMDMtMS41OTggMi40NjMtNC4wMjIgMi40NjMtNC4wMjItMy4yOTMtMy42Ni04LjkxOS0zLjg5Ny04LjkxOS0zLjg5N3oiLz48L2c+PHBhdGggZmlsbD0iI0I3MzIzMSIgZD0iTTQzNi42MTkgMzA4LjE0OWMtMTAuMzg4LTEzLjkzNC0yNS44MDctMjQuNzE2LTMwLjQwNS0xOC43NTgtNC44ODMgNi4zNDQuMjc5IDMwLjYwMiAxMC40OTQgNTIuMjU3IDIyLjIzNSA0Ny4xNzQgOS41MDUgNjMuMjM3IDkuNTA1IDYzLjIzNyAxMy40NjctLjY2NCAxNi44NS0xMi40MTQgMTYuODUtMTIuNDE0IDE0LjY4OC0uNzI0IDExLjQxMi0xNi43MTkgMTEuNDEyLTE2LjcxOXMxNS43MDctOS45My0xMS4xNzQtNTcuMjIzYTExOC42NTQgMTE4LjY1NCAwIDAgMC02LjY4Mi0xMC4zOHoiLz48cGF0aCBmaWxsPSIjQjdCN0I4IiBkPSJNMzcxLjQyNCAyODQuNjI0YzIuNDk3LTMuMjIgOS43ODktMTEuMDk5IDE0LjEwMy0xNS43MDctMTIuODQ3LTYuNzkyLTIyLjIyMi05LjY1NS0yMi4yMjItOS42NTVsLjA1NiAzMC44ODFzMi44NDIgMi44MDEgNy4yNzEgNy41MDljLTEuMDcxLTUuOTQtMS41MzUtMTAuMDM0Ljc5Mi0xMy4wMjh6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQxOC4wODQgMzQxLjU3N2MtOS43ODMtMjAuNzM4LTE1LjQwOS00MS4yMTItMTEuMTYyLTQ4LjA1NCA0LjM1NC03LjAxMSAxOC44MzcuMDY1IDI5LjY5NyAxNC42MjYtMTUuMzU5LTIxLjQ1NS0zNS44NC0zNS4zMjMtNTEuMzAyLTQzLjQ4Ny00LjMxMSA0LjYwNS0xMS42MDYgMTIuNDg3LTE0LjEwNCAxNS43MDEtMi4zMyAyLjk5OC0xLjg2NyA3LjA5NS0uNzkyIDEzLjAyOCAxNC4xMjQgMTQuOTk5IDQ0LjU0OCA0OS41MjkgNTEuODI1IDc1Ljk0OSA2LjQzOCAyMy4zMzggMy45NjYgMzUuNTQ1IDMuOTY2IDM1LjU0NXMxNC4xMS0xNi4xMzUtOC4xMjgtNjMuMzA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zMzUuNzAzIDE0OC43NjRjLTEuODYtMjcuMTI1IDcuMTM2LTUzLjk3OCAxNC4xOTMtNzkuMjczQzM2MC41MzIgMzEuMzc3IDM1MyA4LjMyNyAzMzguODIgOC4zMjdjLTE0LjE4MiAwLTQuODc0IDE2LjM5OS01MS44NTcgMjQuODE5LTI5LjEyNCA1LjIxOS00NS42NTEgMy45OTEtNzguNDQ5IDQyLjEwOC0zMi43OTggMzguMTE0LTU4LjUwNyA3My4xMjctNTguNTA3IDExNS4yMzJzMjkuMjUyIDg1LjA5OSA0OC4zMDcgODUuMDk5YzEwLjE2OCAwIDE0LjAzNC04LjA3NiAyMS4zNDUtMTkuMDQzIDE0Ljk5OS0yMy43MjYgNDcuMTM2LTMzLjQ3NSA1My4xMTktNDcuODc4IDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTE0LTguMjE5IDguMjQ2LTE5LjU4NyAxNy4yNzQtMjMuMTA4eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0zNDguNTY4IDE5MC4wNDVjLTguMjA0LTEzLjcxNy0xMS45MjItMjcuNTMyLTEyLjg2NS00MS4yODEtOS4wMjggMy41MjEtMTMuMTYgMTQuODg5LTE3LjI3MiAyMy4xMDktOS4yNzkgMTQuODQ1LTEyLjA5MiAzMC45ODEtMTcuNDU4IDQ1LjcwNyA3LjQ0NSAzLjIwOCA4Ljc1MiAyMC4xNzEgNC4xNjMgNDYuMDQtNy4zMTQgNDEuMjE4LTQyLjU1MyA4MS4xMDUtNDIuNTUzIDgxLjEwNXMtMjcuNTAxIDc1LjY0LTIyLjI4NSAxMjguMzM5bDIyLjI4NS00MS40MjlzNTEuODU5LTYuODEyIDY3LjgxMy04NS4wODdjMTQuNDQ0LTcwLjg2MSA1MC4xNDEtNzkuMjA0IDcyLjA1OS00Ni42MDMtMTMuNDg1LTUwLjAwNS0zNy4yNzctODIuMTItNTMuODg3LTEwOS45eiIvPjxwYXRoIGZpbGw9IiNFRTZBNkEiIGQ9Ik00MTIuODM3IDM4My4yODdjMC0zMi42MzUtNC4wNjMtNTkuOTQxLTEwLjM4Mi04My4zNDItMjEuMTk4LTMyLjgzMy02My42OTEtMjQuMjU4LTc4LjEzNiA0Ni42MDMtMTUuOTU0IDc4LjI3NC02MS43MzYgODUuMDg3LTYxLjczNiA4NS4wODdsLTIyLjI4NSA0MS40MjljLjg2MSA4LjY4MSAyLjYyNSAxNi43MTkgNS41MjYgMjMuNzE3IDQuNjM2IDEuMDggOS43NDkgMi41MjQgMTUuNDM3IDQuNDA3IDc3Ljk2NyAyNS43ODcgMTUxLjU3Ni0zMi44MDEgMTUxLjU3Ni0xMTcuOTAxeiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00MTEuMDA3IDQxMS4xNDJjMS4xOTQtOC44MjEgMS44My0xOC4xMDYgMS44My0yNy44NTQgMCAzLjc4NC0uMjAxIDcuNDkzLS40NzkgMTEuMTcxLjYxNy0xMi43MzEuNDEzLTI2LjAxMy0uNjE3LTM5LjcyMiA0Ljk5MyAxNTIuNTg4LTEyNi41NSAxNDEuMDU3LTEyNi41NSAxNDEuMDU3bC05Ljg0MiA5LjE0NWExMjQuNTk4IDEyNC41OTggMCAwIDEtMTQuMDg3LTMuNzVjLTUuNjg4LTEuODgzLTEwLjgwMS0zLjMyNy0xNS40MzctNC40MDcgNS4xNzIgMTIuNDcxIDE0LjAwOSAyMS41NzcgMjguMDYyIDI0Ljc5MWExMTEuNDEyIDExMS40MTIgMCAwIDAgMjQuNzg4IDIuODEzbC4wMzQuMDI0Yy4xNzIgMCAuMzI5LS4wMTMuNTAxLS4wMTMuOTgzLS4wMDMgMS45NjctLjA0NCAyLjk0OC0uMDc4IDY4LjQzNi0xLjUyNiAxMDEuMzUzLTQ4LjAxMyAxMDguODQ5LTExMy4xNzd6Ii8+PHBhdGggZmlsbD0iIzUyNTI1MiIgZD0iTTIxNi42MjIgMTkwLjk2OWM2LjczNS0xLjI3OCAxNC44MDUtOS40MzYgMTEuODYzLTE4LjcyNy0yLjk0MS05LjI5Mi0xNC45NTItMS40MTYtMTYuNDQzIDcuNzA5LTEuNDIyIDguNjk3IDIuMDkyIDExLjQ5NyA0LjU4IDExLjAxOHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjIxLjUxMiAxNzkuNDM4YzEuNDc5LjUxMSAzLjE1MS0uNzc3IDMuNzE4LTIuODc5LjU3LTIuMTAyLS4xNjktNC4yMTMtMS42NDgtNC43MjEtMS40OTEtLjUwNy0zLjE1NC43ODYtMy43MyAyLjg4NS0uNTY0IDIuMDkzLjE3MSA0LjIxMSAxLjY2IDQuNzE1eiIvPjxwYXRoIGZpbGw9IiNEQzNGM0YiIGQ9Ik0yOTkuODE2IDI3Ny4wMjdzLTUuNjUxLTEyLjI5OCAxMS45NjctMjMuMDk5YzE3LjYxNy0xMC44MDUgMTkuMTExIDQuMzE5IDE5LjExMSA0LjMxOSIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik00OTEuOTggMTUxLjUyNHMtNjAuMDg1IDIwLjQ3OC05MS41NTUgODIuOTA2bC01LjE5NC03LjE1NXMyMi45ODQtNTMuMjE5IDk2Ljc0OS03NS43NTF6Ii8+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTIzNS4zMzkgNTUwLjI4MWMtLjgzIDI0LjkzMyAzMy4yNjggNDQuNzQyIDE1LjUwMyA1My4yODUgMTYuNjIyIDIuMjE1IDIxLjk0LTcuNTM3IDIxLjk0LTcuNTM3IDIyLjYwMiAzLjMyNyAyMS40OTMtMTYuMTc3IDIxLjQ5My0xNi4xNzcgMTAuNjA0LTcuMDExIDkuNjgzLTE2LjMzMy4wMjItMjUuNTcxLTIxLjkzNC0xOC4xNDMtNTguMTI4LTI4Ljg0MS01OC45NTgtNHpNMzAwLjA3NyA0NjMuMDczYy4zMjktMjIuMTg4LTEyLjIyNy0zOS44OTYtMTIuMjI3LTM5Ljg5NnMxNy4yODYtMTEzLjQ2MS00NC43NjUtNjQuMjY1Yy02Mi4wNTMgNDkuMTk3LTUyLjkwOSAxMTUuNjItMzkuMjIzIDEzNy4zOTUgMjMuMTU0IDMzLjU3NSA4NC41MTEgMTguMjg4IDk2LjIxNS0zMy4yMzR6Ii8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTI4NS4xOSA0OTkuODVjMTAuOTg2LTEyLjIxNyAxNC43MTQtMjUuMTE2IDE0Ljg4Ni0zNi43NzYtMTEuNzA0IDUxLjUyMS03Mi4xNTYgNjQuMDUyLTk2LjIxNCAzMy42MjUgMTYuNTA5IDI2LjI2MSAzOC45OTggMjAuODgyIDI4LjgwNyAzOS43MTgtMTAuMTk3IDE4Ljg0LjY2NyAzNy4wMTIgMTQuODQ4IDQ4LjUzM3MzLjMyNCAxOC42MTcgMy4zMjQgMTguNjE3YzI3Ljk3NC05LjA4NS05LjUyOS0yNS44MDMtOS41MjktNTAuNzQ4IDAtMTkuNSAyOS45MS0xNC4yMDkgNTIuOTg0IDEuNDYzLTIuODYtMi43MzEtNi40NDMtNS40NTctMTAuNzctOC4xMTMtMTguOTQ0LTExLjYzNS0yOC45MTktMTIuMjk5IDEuNjY0LTQ2LjMxOXoiLz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMjcyLjc4MiA1OTYuMDI5YzguMDg4LTEwLjE5IDEuMjE2LTE4LjA2IDEuMjE2LTE4LjA2czEwLjExMiA0LjEwMSA3Ljk5MSAxOC4wNmMwIDAtNCAyLjEwOS05LjIwNyAwTTI5NC4yNzUgNTc5Ljg1M2MwLTExLjI5OS03Ljc1Ni0xNC4wNzEtNy43NTYtMTQuMDcxczguNTM3LjMwNCAxMi4xODkgMTAuMjljMC0uMDAxLTEuODI3IDIuNzI4LTQuNDMzIDMuNzgxIi8+PGc+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMzOC44MiA4LjMyOGMtMTQuMTgyIDAtNC44NzQgMTYuMzk5LTUxLjg1NyAyNC44MTktMi4zMzMuNDE3LTQuNTc3Ljc5LTYuNzYzIDEuMTUgMjUuNjQ0LTMuOTYzIDIyLjY4IDMuOTA2IDQuMzIzIDEyLjgxNS0yMy4wMDIgMTEuMTU4LTM2LjYyMyAxLjA4MS02OC45NDUgNDYuNzQ1LTMyLjMyNSA0NS42NjMtNDMuMTIgOTIuNDk5LTIzLjkwOCAxMjkuODc2IDIwLjA0NSAzOC45OTEgMzMuNjkgMTkuMTI4IDUzLjAyMiA4Ljc0bC0uMDA2LjAwNmMxMi41MjctOC43NjIgMjQuNjQ3LTE1LjUxOSAyOC4wOTMtMjMuODEzIDAgMC0yLjg4NSAxMS4yNDMtMjEuODMxIDI0LjcwMy0xMC44MjkgNy42OTctMTUuOTkyIDE4LjQ1OC0xOC40NzkgMjYuNzcxIDkuNTA0IDEuMDQ2IDMxLjc4My0xNS44MDcgNDguNzMtMzIuNzU0IDguNzktOC43ODcgMTUuMzU5LTExLjcxMyAxOS43NzMtOS44MDUgNS4zNjYtMTQuNzI2IDguMTc5LTMwLjg2MiAxNy40NTgtNDUuNzA3IDQuMTEyLTguMjIgOC4yNDQtMTkuNTg4IDE3LjI3Mi0yMy4xMDktMS44Ni0yNy4xMjUgNy4xMzYtNTMuOTc4IDE0LjE5My03OS4yNzMgMTAuNjM3LTM4LjExNSAzLjEwNi02MS4xNjQtMTEuMDc1LTYxLjE2NHoiLz48L2c+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTI1MS43IDIzNC4xMTdjMTguOTQ2LTEzLjQ2MSAyMS4wNzktMjUuNDUyIDIxLjA3OS0yNS40NTItNS45ODMgMTQuNDAzLTM4LjEyIDI0LjE1Mi01My4xMTkgNDcuODc4IDMuODk0IDIuODYgOC4yMDQgMy45MjUgMTIuODA5IDMuNTk2IDIuNDg4LTguMzEzIDguNDAyLTE4LjMyNSAxOS4yMzEtMjYuMDIyeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0yNTAuOTQ4IDIzMy4zNjhjMTguOTQ2LTEzLjQ2IDIxLjgzMS0yNC43MDMgMjEuODMxLTI0LjcwMy0zLjA2MyA3LjM3MS0xMi45NzIgMTMuNTI2LTIzLjkzMyAyMC45NTdhMTEuNDY3IDExLjQ2NyAwIDAgMCAxLjg5NSAzLjkxNmMuMDc2LS4wNTcuMTM1LS4xMTYuMjA3LS4xN3oiLz48Zz48cGF0aCBmaWxsPSIjNUExRDFBIiBkPSJNMjE1LjkyOSAyMDIuNDU5YzYuNjc2LTEuNTYgMTQuMzk3LTEwLjA0NiAxMS4wNjctMTkuMjA2LTMuMzMzLTkuMTYtMTUuMDAxLS43ODktMTYuMTA3IDguMzk2LTEuMDU5IDguNzQ2IDIuNTc1IDExLjM5NiA1LjA0IDEwLjgxeiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMjAuMzI4IDE5MC43MzdjMS41LjQ1MSAzLjExNy0uOTA5IDMuNTkzLTMuMDM2LjQ4Ni0yLjExOC0uMzQ0LTQuMjAxLTEuODQyLTQuNjQyLTEuNTEtLjQ0NS0zLjEyLjkxMS0zLjYwNSAzLjAzNS0uNDc3IDIuMTE1LjM0NyA0LjIwNSAxLjg1NCA0LjY0M3oiLz48L2c+PHBhdGggZmlsbD0iI0RDM0YzRiIgZD0iTTMwOC40MTggMjY0Ljk4OXMtNDguNjQyIDI5LjQzNC02Mi4wMDIgMTEzLjM2NWMtNS44MiAzNi41MzEgMTAuMjcyIDQwLjc3NiAxMC4yNzIgNDAuNzc2czEyLjgxOCAxOC4yMzEgMzAuNDIgMTIuODVjMCAwIDkuNTU4IDEwLjQ0NCAzMC4zNzQuMTI2IDAgMC0yMy43MjktMTAuOTg5LTMwLjM4My00OC42NDMtNi42Ni0zNy42NTcgMTAuMjE5LTc4LjU3OCAyMi4xNTQtOTIuNjY4IDEzLjM2Mi0xNS43NzkgMTIuMzgyLTM0LjY2NS0uODM1LTI1LjgwNnoiLz48Zz48cGF0aCBmaWxsPSIjQTVBNUE1IiBkPSJNMzAxLjkwOSA0MjguOTQxbC0uNzM2LS41MjZjLjQ3My4zNjMuNzM2LjUyNi43MzYuNTI2eiIvPjxwYXRoIGZpbGw9IiM3MzI3MjgiIGQ9Ik0yOTAuMzgxIDM4Mi4wMTJjLTUuNTM5LTMxLjM0MSAyLjk2Ni02My45MDcgMTIuODU2LTgyLjA4OS00MS4zMTUgNzIuNzI5LTEwLjM4MSAxMjIuMDQ1LTEuMzI4IDEyOS4wMTkgMCAwLTE0LjgzNiA0Ljk4Ni0yMi4zNjctMTAuMDgxIDAgMCAuNTIgNS43MTQgMy42NTYgOS41MjYgMCAwLTIyLjYwNCAyLjM0My0yOC4wOTMtMTkuMjE1IDAgMC0yLjkwMSAxMC45MzYgOC4yNTQgMTguNjYgMTEuNTI4IDcuOTc2IDIzLjQ5NCA1LjIwNiAyMy40OTQgNS4yMDZzMTUuNTI1IDExLjc2NyAzMi41NzMtLjk1OGMuMDAxIDAtMjIuMzg4LTEyLjQxMS0yOS4wNDUtNTAuMDY4eiIvPjwvZz48cGF0aCBmaWxsPSIjNzMyNzI4IiBkPSJNMzkzLjE4MyAyNzAuOTM0czcuOTEtMTAuNzQ4LTUuODE3LTE0LjIwOWMwIDAtOC40NTEtMjAuODg1LTE3LjgwNS0zNC44NjMtLjAyMi0uMDI4LS4wNDgtLjA2LS4wNjktLjA5MS05Ljg5My0xNi4yOTUtMjEuMTMzLTMzLjA5OS0yNy4xODUtNDkuNTEzLTkuMzE2LTI5LjE1OCA0LjgzNy0zMC41OTMgNy42OTMtMzguMDAxIDQuNDc3LTExLjU4NC0xMi40Mi02LjkzOC04LjAyOC0zMS43OTIgMS45NzEtOC4wNDcgNC4zMzItMTYuMDk1IDYuODE5LTI0LjExMSA5LjMzNS0zMC4wODIgMTMuOTYyLTcwLjAyNS05Ljk3MS03MC4wMjUgMCAwIDE3LjE3NiAyLjM0NiA2LjIwNSAzNi4wNzgtMTAuOTcgMzMuNzI5LTUzLjE4NSA1Ni45OTctNDEuNTQ3IDEwMC44NzUgMTAuMTU5IDM4LjMyNCAyLjIxMSA1OC44MzYtMjEuNTUyIDgxLjM5MSAwIDAgMjkuMzY1LTI4LjIwNiAyNS41MDIgMTkuNzY3IDYuODU3LTcuODUgNy41NDYtMjAuMzY4IDcuMTU1LTMyLjMxLjA0LTE4LjcwOCA4LjA1Ny0zOS45NzEgMzMuNDg2LTExLjQ3OC42MjEuNzA1IDEuMjQ0IDEuNDA3IDEuODU4IDIuMTI3LjEwMy4xMjIuMjEuMjU0LjMxNi4zNzkgMjguMTg3IDMzLjI5MyA0Ny4wNjkgNzguNDYyIDUyLjIxIDk0Ljc4OS0uNjcyLTMuMjEzLTYuMDc1LTIxLjU1MS05LjI3LTI5LjAxM3pNMjgwLjM5MiA0OTcuMzIyYzI3LjM0MS0yNC44MjkgMTIuMDUxLTYzLjQ5NyAxMi4wNTEtNjMuNDk3aDYuMDcxczIwLjMwMiAzMy4xNDYgMS41NjMgNzYuODkyIi8+PHBhdGggZmlsbD0iIzczMjcyOCIgZD0iTTQwMy4wNzggMjQ4Ljc5M2MtMjQuMjU4LTguNTQyLTEyLjIzMi0zOC40ODYtMTIuMjMyLTM4LjQ4Ni0xMC45ODUgMTQuMTYyLTE1LjQxNSAzMS4wNS0xNS40MTUgMzEuMDVsMTAuMDk2IDE0Ljc0OHMxMi4wODYgOC4xNTQgMTIuODEgNy40MjdjLjcyMy0uNzI3IDI5LTYuMTkzIDQuNzQxLTE0LjczOXoiLz48cGF0aCBmaWxsPSIjNjEyMTIxIiBkPSJNMjU0LjEwOSAyNjAuMTk2czIyLjYwNyA2LjExNSAzOS4wOTQgMTcuNjNsLTI2LjQxNyAyLjk1MXMtOS45MjQtNy40NzUtMTAuMzI1LTcuODc1Yy0uNC0uNDAyLTIuMzUyLTEyLjcwNi0yLjM1Mi0xMi43MDZ6TTQ1NS4yMDEgMjYyLjEzMnMtMTAuNTEzLTQ2LjEzNy01NS4yMjQtNDMuMzYxYzAgMCAyNy4xNjUtNDkuODYxIDkyLjAwMy02Ny4yNDcgMCAwLTQ2LjAwMSA1MS4wNDUtMzYuNzc5IDExMC42MDh6Ii8+PHBhdGggZmlsbD0iIzYxMjEyMSIgZD0iTTM4OC40OCAyNTAuMDM3cy4yMjYtMjAuNzY2IDE5LjY2LTQzLjIwOGwxNS40MjUtMi43OTQgNS4yMTMgMi43OTRzLTMwLjU0OSAxNi45ODUtNDAuMjk4IDQzLjIwOHoiLz48L3N2Zz4=";

                            let contactListItem = `
        <section id="contact-item-${currentContact.id}" class="contact-list-item wrapper">
          <button type="button" value="${currentContact.id}" class="contact-list-item container">
            <figure class="contact-list-item unit" variant="contact-item-avatar">
              <img class="image" src="${currentContact.file[0].dataUrl
                ? currentContact.file[0].dataUrl
                : customAvatar}  " />
            </figure>
            <div class="contact-list-item unit" variant="contact-item-name">
              ${currentContact.firstname + " " + currentContact.lastname}
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
    contactViewAndForm: function(
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
      let contactItemWrapper = `
<article class="contact-item wrapper" variant="contact-item">
  <form class="contact-form" action="http://localhost:3000/posts${currentContact.id
    ? "/" + currentContact.id
    : ""}" method="${currentContact.id
        ? "PATCH"
        : "post"}" name="form" novalidate>
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
      const editButton = content.querySelector("button.button-edit");
      const deleteButton = content.querySelector("button.button-delete");
      const formElm = content.querySelector("form.contact-form");
      editButton.addEventListener("click", methods.contactItem.edit);
      deleteButton.addEventListener("click", methods.data.deleteContact);

      formElm.addEventListener("submit", methods.data.saveContact);

      return content;
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

  methods.contactItem = {
    view: function(data) {
      let formFieldset = data.querySelector("fieldset");
      let dataElm = {
        element: formFieldset,
        attributeKey: "disabled",
        attributeValue: "disabled",
      };
      modules["general"].htmlElement.addAttributeValue(dataElm);
    },

    edit: function(event) {
      event.currentTarget.form
        .querySelector("fieldset")
        .removeAttribute("disabled");
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
      const buttonAddContact = elements.contactsContainer.querySelector(
        ".button-add"
      );
      buttonAddContact.addEventListener("click", methods.page.addContact);

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

  methods.render = function(viewport) {
    if (elements.contactsContainer) {
      return true;
    } else {
      return false;
    }
  };

  methods.unmount = function() {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRhY3RzLmpzIiwiZmlsZXVwbG9hZC5qcyIsImZvcm0uanMiLCJtb2R1bGVzLmpzIiwib3V0bGluZS5qcyIsImZpbGUtdXBsb2FkLmpzIiwiZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbnJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN3FCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XG5cbm1vZHVsZXNbXCJhcGktZm9ybVwiXSA9IChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBlbGVtZW50cywgbWV0aG9kcywgc2VsZWN0b3JzLCBzdGF0ZSwgY29udGFjdEl0ZW1zO1xuXG4gICAgZWxlbWVudHMgPSB7fTtcbiAgICBtZXRob2RzID0ge307XG4gICAgc2VsZWN0b3JzID0ge1xuICAgICAgICB2aWV3cG9ydDogXCJib2R5XCIsXG5cbiAgICAgICAgY29udGFpbmVyOiAnLmNvbnRhaW5lclt2YXJpYW50PVwiYXBpLWZvcm1cIl0nLFxuXG4gICAgICAgIGZvcm1Db250YWluZXI6ICcuY29udGFpbmVyW3ZhcmlhbnR+PVwiYXBpLWZvcm1cIl0nLFxuICAgICAgICBmb3JtRWxlbWVudDogJ1t2YXJpYW50PVwiYXBpLWZvcm1cIl0gZm9ybScsXG4gICAgICAgIGZvcm1GdWxsRm9ybTogJ1t2YXJpYW50PVwiZnVsbC1mb3JtXCJdJyxcblxuICAgICAgICBmb3JtQnV0dG9uOiBcIi5zdWJtaXQtYnV0dG9uXCIsXG5cbiAgICAgICAgZGF0ZUZpZWxkQ29udGFpbmVyOiAnW3ZhcmlhbnQ9XCJkYXRlXCJdJyxcblxuICAgICAgICByZXF1aXJlZEZpZWxkczogXCJpbnB1dFtkYXRhLXJlcXVpcmVkXVwiLFxuICAgICAgICBmb3JtUG9zdGVkQ29udGFpbmVyOiAnW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm0tcG9zdGVkXCJdJyxcbiAgICAgICAgZXJyb3JNZXNzYWdlQ29udGFpbmVyOiAnW3ZhcmlhbnR+PVwiZXJyb3ItbWVzc2FnZVwiXScsXG4gICAgfTtcbiAgICBzdGF0ZSA9IHt9O1xuICAgIGNvbnRhY3RJdGVtcyA9IHt9O1xuXG4gICAgbWV0aG9kcy5mb3JtID0ge1xuICAgICAgICBhZGRJdGVtOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1FbGVtZW50cyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZWxlbWVudHM7XG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgICAgICAgICAgICAuY2FsbChmb3JtRWxlbWVudHMpXG4gICAgICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbihkYXRhLCBpdGVtLCBjdXJyZW50SW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBKU09OLnBhcnNlKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0c1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgPT09IHRydWUgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVJdGVtOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG4gICAgICAgICAgICAgICAgZ2V0UGFyZW50RWxlbWVudDoge1xuICAgICAgICAgICAgICAgICAgICBvbkF0dHJpYnV0ZTogXCJjbGFzc1wiLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBkZWxldGVkRWxlbWVudCA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmdldENsb3Nlc3RQYXJlbnROb2RlKFxuICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGZldGNoKGV2ZW50LmN1cnJlbnRUYXJnZXQuYWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgPT09IHRydWUgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWRFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgbWV0aG9kcy5kYXRhID0ge1xuICAgICAgICBnZXRDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0c1wiKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zZXRDb250YWN0cyhqc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zaG93Q29udGFjdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJOZXR3b3JrIHJlcXVlc3QgZm9yIHBvc3RzLmpzb24gZmFpbGVkIHdpdGggcmVzcG9uc2UgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiOiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNUZXh0XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q29udGFjdHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnRhY3RJdGVtcyA9IGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbnRhY3RJdGVtcy5sZW5ndGggPT09IDApIHt9XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdEl0ZW1zO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBjb250YWN0cyA9IG1ldGhvZHMuZGF0YS5jb250YWN0cygpO1xuICAgICAgICAgICAgY29uc3QgY29udGFjdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgXCIuY29udGFjdC1pdGVtcy5jb250YWluZXJcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IGNvbnRhY3RzVG9IVE1MID0gY29udGFjdHMucmVkdWNlKGZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIsXG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRhY3QsXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4LFxuICAgICAgICAgICAgICAgIGFycmF5XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBjb250ZW50LWl0ZW1zIGNvbnRhaW5lciB3aGVuIHRoZSByZWR1Y2VyIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhQ29udGFjdEl0ZW1zQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtaXRlbXMgY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJhcnRpY2xlXCIsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIgPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENvbnRhY3QgaXRlbSBjb250YWluZXJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhQ29udGFjdEl0ZW1Db250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lOiBcInNlY3Rpb25cIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50Q29udGFpbmVyRWxlbWVudCA9IG1vZHVsZXNbXG4gICAgICAgICAgICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgICAgICAgICAgXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KGRhdGFDb250YWN0SXRlbUNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICAvLyBBdmF0YXIgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgY29uc3QgYXZhdGFyQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImF2YXRhclwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1uYW1lIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJkaXZcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50QXZhdGFyQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgICAgICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoYXZhdGFyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRBdmF0YXJDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cbiAgICAgICAgICAgICAgICAgICAgXCJ1cmwoJ1wiICsgY3VycmVudENvbnRhY3QuZmlsZVswXS5kYXRhVXJsICsgXCInKVwiO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29udGFjdCBOYW1lIGNvbnRhaW5lciBhbmQgY2hpbGRzXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YU5hbWVDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1uYW1lIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJkaXZcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50TmFtZUNvbnRhaW5lciA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIGRhdGFOYW1lQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb250YWN0TmFtZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TmFtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50Q29udGFjdE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29udGFjdCBQaG9uZSBjb250YWluZXIgYW5kIGNoaWxkc1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFQaG9uZUNvbnRhaW5lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQXR0cmlidXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJwaG9uZW51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1waG9uZSBjb250YWluZXJcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGhvbmVDb250YWluZXIgPSBtb2R1bGVzW1xuICAgICAgICAgICAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICAgICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhUGhvbmVDb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29udGFjdCBwaG9uZSB3b3JrIGxhYmVsXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVBob25lTGFiZWwgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwibGFiZWxcIixcbiAgICAgICAgICAgICAgICAgICAgfSwgXSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtcGhvbmUgdW5pdFwiLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZGF0YVBob25lTGFiZWxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcblxuICAgICAgICAgICAgICAgIC8vIENvbnRhY3QgcGhvbmUgd29yayB2YWx1ZVxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFQaG9uZVZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcInZhbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIF0sXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LXBob25lIHVuaXRcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGhvbmVWYWx1ZVdvcmsgPSBtb2R1bGVzW1xuICAgICAgICAgICAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICAgICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhUGhvbmVWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxXb3JrVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwid29ya1wiKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBob25lTGFiZWxXb3JrVW5pdCA9IGN1cnJlbnRQaG9uZUxhYmVsO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbFdvcmsgPSBjdXJyZW50UGhvbmVMYWJlbEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UGhvbmVMYWJlbFdvcmsuYXBwZW5kQ2hpbGQoY3VycmVudFBob25lTGFiZWxXb3JrVGV4dCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBob25lTGFiZWxXb3JrVW5pdC5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVMYWJlbFdvcmspO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBob25lVmFsdWVXb3JrVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29udGFjdC5waG9uZVdvcmsgfHwgXCJcIlxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UGhvbmVWYWx1ZVdvcmsuYXBwZW5kQ2hpbGQoY3VycmVudFBob25lVmFsdWVXb3JrVGV4dCk7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UGhvbmVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudFBob25lTGFiZWxXb3JrVW5pdCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBob25lQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZVZhbHVlV29yayk7XG5cbiAgICAgICAgICAgICAgICAvLyBDb250YWN0IFJlbW92ZSBjb250YWluZXIgYW5kIGNoaWxkc1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSZW1vdmVDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIF0sXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWRlbGV0ZSBjb250YWluZXJcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UmVtb3ZlQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5lcmFsXCJcbiAgICAgICAgICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVJlbW92ZUNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhQnV0dG9uID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInR5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcInN1Ym1pdFwiLFxuICAgICAgICAgICAgICAgICAgICB9LCBdLFxuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJidXR0b25cIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UmVtb3ZlQnV0dG9uID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgZGF0YUJ1dHRvblxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFJlbW92ZUJ1dHRvblRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgXCJSZW1vdmUgY29udGFjdFwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UmVtb3ZlQnV0dG9uLmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVCdXR0b25UZXh0KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb250YWN0UmVtb3ZlVXJsID1cbiAgICAgICAgICAgICAgICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHMvXCIgKyBjdXJyZW50Q29udGFjdC5pZDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSZW1vdmVGb3JtID0ge1xuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogXCJmb3JtXCIsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWRlbGV0ZSBjb250YWluZXJcIixcbiAgICAgICAgICAgICAgICAgICAgYWRkQXR0cmlidXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiYWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IGN1cnJlbnRDb250YWN0UmVtb3ZlVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFJlbW92ZUZvcm0gPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBkYXRhUmVtb3ZlRm9ybVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50UmVtb3ZlRm9ybS5hcHBlbmRDaGlsZChjdXJyZW50UmVtb3ZlQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZW1vdmVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbWV0aG9kcy5mb3JtLmRlbGV0ZUl0ZW0pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRSZW1vdmVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUZvcm0pO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoY3VycmVudEF2YXRhckNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoY3VycmVudE5hbWVDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICBuZXdDb250YWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRDb250YWluZXJFbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3Q29udGFjdENvbnRhaW5lcjtcbiAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcihcIm1haW5cIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZUNoaWxkKGNvbnRhY3RzVG9IVE1MLCBjb250YWN0Q29udGFpbmVyKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgbWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XG4gICAgICAgIHZhciBmb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICAgICAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgICAgICAgICBlbGVtZW50cy52aWV3cG9ydCA9XG4gICAgICAgICAgICAgICAgdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgICAgICAgICAgZWxlbWVudHMuZm9ybUNvbnRhaW5lciA9IGZvdW5kO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50ID1cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmZvcm1FbGVtZW50KSB8fFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMuZm9ybUVsZW1lbnRba2V5XS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICBcInN1Ym1pdFwiLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmZvcm0uYWRkSXRlbVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMuZm9ybUVsZW1lbnRba2V5XS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICBcInN1Ym1pdFwiLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmZvcm0uYWRkSXRlbVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcbiAgICAgICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgICAgICB1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXG4gICAgICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG5cbiAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5jb250YWluZXIsXG4gICAgfTtcbn0pKCk7IiwidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XG5cbm1vZHVsZXNbXCJjb250YWN0c1wiXSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudHMsIG1ldGhvZHMsIHN0YXRlLCBjb250YWN0SXRlbXM7XG5cbiAgICAgICAgICAgIGVsZW1lbnRzID0ge307XG4gICAgICAgICAgICBtZXRob2RzID0ge307XG4gICAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgICAgIHZpZXdwb3J0OiBcImJvZHlcIixcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICcuY29udGFpbmVyW3ZhcmlhbnR+PVwiY29udGFjdHNcIl0nLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RMaXN0SXRlbXNDb250YWluZXI6IFwiLmNvbnRhY3QtbGlzdC1pdGVtcy5jb250YWluZXJcIixcbiAgICAgICAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zVW5pdDogXCIuY29udGFjdC1saXN0LWl0ZW1zLnVuaXRcIixcbiAgICAgICAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyOiBcIi5jb250YWN0LWxpc3Qtc2VhcmNoLmNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RJdGVtQ29udGFpbmVyOiBcIi5jb250YWN0LWl0ZW0ud3JhcHBlclwiLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RJdGVtVW5pdDogXCIuY29udGFjdC1pdGVtLnVuaXRcIixcbiAgICAgICAgICAgICAgICBjb250YWN0QnV0dG9uQ29udGFpbmVyOiBcIi5jb250YWN0LWJ1dHRvbi5jb250YWluZXJcIixcbiAgICAgICAgICAgICAgICBjb250YWN0SXRlbVdyYXBwZXI6IFwiLmNvbnRhY3QtaXRlbS53cmFwcGVyXCIsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb250YWN0SXRlbXMgPSB7fTtcblxuICAgICAgICAgICAgbWV0aG9kcy5kYXRhID0ge1xuICAgICAgICAgICAgICAgIGdldENvbnRhY3RzRnJvbUFwaTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGZldGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHM/X3NvcnQ9Zmlyc3RuYW1lLGxhc3RuYW1lJl9vcmRlcj1hc2MsYXNjXCJcbiAgICAgICAgICAgICAgICAgICAgKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5qc29uKCkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zZXRDb250YWN0cyhqc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5kYXRhLnNob3dDb250YWN0cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTmV0d29yayByZXF1ZXN0IGZvciBwcm9kdWN0cy5qc29uIGZhaWxlZCB3aXRoIHJlc3BvbnNlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzYXZlQ29udGFjdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IGZvcm0uZWxlbWVudHM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1BY3Rpb24gPSBmb3JtLmFjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YUVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBmb3JtLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtTWV0aG9kID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtZXRob2RzLmRhdGEuc2VyaWFsaXplKGZvcm1FbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoKGZvcm1BY3Rpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGZvcm1NZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5vayA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChmb3JtTWV0aG9kID09PSBcInBvc3RcIiAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZm9ybU1ldGhvZCA9PT0gXCJQQVRDSFwiICYmIHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5wYWdlLnNob3dDb250YWN0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZWxldGVDb250YWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVCdXR0b24gPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtQWN0aW9uID0gZGVsZXRlQnV0dG9uLmZvcm1BY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBkZWxldGVCdXR0b24uZm9ybTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFjdElkID0gZGVsZXRlQnV0dG9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29udGFjdEl0ZW1XcmFwcGVyID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9ycy5jb250YWN0SXRlbVdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBmZXRjaChmb3JtQWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJkZWxldGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5vayA9PT0gdHJ1ZSAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RJdGVtV3JhcHBlci5yZW1vdmVDaGlsZChmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5kYXRhLnJlbW92ZUNvbnRhY3RJdGVtRnJvbURvbU5vZGUoY29udGFjdElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKGZvcm1FbGVtZW50cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYWxsKGZvcm1FbGVtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24oZGF0YSwgaXRlbSwgY3VycmVudEluZGV4LCBhcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaXRlbS5uYW1lXSA9IGl0ZW0uY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLm5hbWUgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaXRlbS5uYW1lXSA9IEpTT04ucGFyc2UoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaXRlbS5uYW1lXSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVcmw6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvc3REYXRhO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXRDb250YWN0czogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb250YWN0SXRlbXMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXRDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3RJdGVtcztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0Q29udGFjdEJ5SWQ6IGZ1bmN0aW9uKGNvbnRhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGFjdEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzRnJvbUFwaSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250YWN0SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGFjdEl0ZW1zKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhY3RJdGVtc1trZXldLmlkID09IGNvbnRhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY29udGFjdEl0ZW0gPSBjb250YWN0SXRlbXNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWN0SXRlbTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNob3dDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhY3RzID0gbWV0aG9kcy5kYXRhLmdldENvbnRhY3RzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50cy5jb250YWN0SXRlbXNVbml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZDb250YWN0SWQ7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuc2V0RWxlbWVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdHMuZm9yRWFjaChmdW5jdGlvbihjb250YWN0LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjY29udGFjdC1pdGVtLVwiICsgY29udGFjdC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNvbnRhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2RWxlbWVudCA9IGVsZW1lbnRzLmNvbnRhY3RJdGVtc1VuaXQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiI2NvbnRhY3QtaXRlbS1cIiArIHByZXZDb250YWN0SWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZFbGVtZW50ICYmIHByZXZFbGVtZW50Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZFbGVtZW50LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5wYWdlQ29udGFpbmVyLmNvbnRhY3RMaXN0SXRlbShjb250YWN0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZFbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPT09IDAgJiYgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuY2hpbGROb2Rlc1swXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0LmNoaWxkTm9kZXNbMF0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzLnBhZ2VDb250YWluZXIuY29udGFjdExpc3RJdGVtKGNvbnRhY3QpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQuY2hpbGROb2Rlc1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1zVW5pdC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMucGFnZUNvbnRhaW5lci5jb250YWN0TGlzdEl0ZW0oY29udGFjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q29udGFjdElkID0gY29udGFjdC5pZDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmZpeGVkQ29udGFpbmVyKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzaG93Q29udGFjdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRhY3QgPSBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdEJ5SWQoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5wYWdlLnNob3dDb250YWN0KGN1cnJlbnRDb250YWN0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNvbnRhY3RJdGVtRnJvbURvbU5vZGU6IGZ1bmN0aW9uKGNvbnRhY3RJZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbXNVbml0XG4gICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcihcIiNjb250YWN0LWl0ZW0tXCIgKyBjb250YWN0SWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1ldGhvZHMucGFnZSA9IHtcbiAgICAgICAgICAgICAgICBhZGRDb250YWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IG1ldGhvZHMucGFnZUNvbnRhaW5lci5jb250YWN0Vmlld0FuZEZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5wYWdlLmNvbnRhY3RzQ29udGFpbmVyKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvd0NvbnRhY3Q6IGZ1bmN0aW9uKGN1cnJlbnRDb250YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBtZXRob2RzLnBhZ2VDb250YWluZXIuY29udGFjdFZpZXdBbmRGb3JtKFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbnRhY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBtZXRob2RzLnBhZ2UuY29udGFjdHNDb250YWluZXIoY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250YWN0c0NvbnRhaW5lcjogZnVuY3Rpb24oY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRXcmFwcGVyID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9ycy5jb250YWN0SXRlbVdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlZE5vZGUgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5yZW1vdmVDaGlsZChvbGRXcmFwcGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhZGRlZE5vZGUgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVtb3ZlZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZXNbXCJmaWxlLXVwbG9hZFwiXS5tb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlc1tcImZpbGUtdXBsb2FkXCJdLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZXNbXCJmaWxlLXVwbG9hZFwiXS5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmZpeGVkQ29udGFpbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtZXRob2RzLnBhZ2VDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RMaXN0SXRlbTogZnVuY3Rpb24oY3VycmVudENvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3VzdG9tQXZhdGFyID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSTJNVElpSUdobGFXZG9kRDBpTmpFeUlpQjJhV1YzUW05NFBTSXdJREFnTmpFeUlEWXhNaUkrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVEV3Tmk0NE16UWdNamMxTGpJMll6RXlNeTR5TURFdE56VXVORE15SURJeE55NDBPVElnTmk0eU9EY2dNakUzTGpRNU1pQTJMakk0TjJ3dE1pNHlOQ0F5TlM0M01EbGpMVFl6TGpZM05pMHhNeTQ0TXpjdE9UY3VPRGd6SURNeExqZzNNeTA1Tnk0NE9ETWdNekV1T0RjekxUTTJMamMxTWkwMU9DNDRNRFl0TVRFM0xqTTJPUzAyTXk0NE5qa3RNVEUzTGpNMk9TMDJNeTQ0TmpsNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURXdOaTQ0TXpRZ01qYzFMakkyY3pFeE1DNHhNRFF0TlRZdU5qY3hJREU1TXk0ME1qY2dOaTR6T1Rkak9ETXVNekkwSURZekxqQTNNU0F3SURBZ01DQXdiQzB4TkM0eE1qZ2dNakF1TWpRMmN5MDJOeTR6TlMwM01DNDFNeTB4TnprdU1qazVMVEkyTGpZME0zb2lMejQ4Y0dGMGFDQm1hV3hzUFNJak5qRXlNVEl4SWlCa1BTSk5NakkwTGpJd015QXpNemt1TVROekxURXVNVEE1TFRRM0xqa3hPQ0F5T1M0NU1UWXROemd1T1RRemJETTVMakE0T0NBeE55NDJNemtnTVRjdU56RTRJREV4TGpJNU5pMHpOaTQ0TVRRZ01qQXVOVFk0Y3kweU5pNDNNVElnTXk0ek5EWXRORGt1T1RBNElESTVMalEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5DTnpNeU16RWlJR1E5SWsweE1EWXVPRE0wSURJM05TNHlObk14TURJdU9EVXlMVFUwTGpJME55QXhPVEl1TVRFNElEWXVNamt6YkRZdU1qTXpMVEUwTGpNeE9XTXVNREF4TGpBd01TMDVOaTQyTXpZdE5Ua3VOekE1TFRFNU9DNHpOVEVnT0M0d01qWjZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFE1TVM0NU9DQXhOVEV1TlRJMFl5MHhNRFl1TmpVM0lERTNMakl3TVMweE1qQXVNelkxSURFd09TNDFNRFV0TVRJd0xqTTJOU0F4TURrdU5UQTFiREU0TGpjMk9DQXlOQzQ1T0Rsak16UXVNREEzTFRJNUxqRTRPU0EyTkM0NE1UZ3RNak11T0RnMklEWTBMamd4T0MweU15NDRPRFl0TVRFdU9USTVMVFU0TGpZNE5pQXpOaTQzTnprdE1URXdMall3T0NBek5pNDNOemt0TVRFd0xqWXdPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpRamN6TWpNeElpQmtQU0pOTWpjeExqVTNJRFk0TGprMU9HTXhOUzR3TlRnZ09TNHhJRE13TGprNU55QXhOeTR5TVNBME55NDJOemdnTWpJdU9Ua3RMamd3TWkweE1pNDVOamt1TXpVeExUSTJMakUwT0NBeExqQXlOQzB6T0M0M01qSWdNUzQxTnpJdE1qa3VNamMzTFRjdU5UZ3hMVFEwTGpjME1pMHhOeTQ0TkMwME1pNDBOalV0TVRBdU1qWXlJREl1TWpjM0xTNDRPVE1nTVRJdU5qUTVMVE16TGpVeU9DQXlOaTR5T0RrdE1UQXVNakU0SURRdU1qWTNMVEU0TGpNMk9TQTJMamd6TlMweU5pNHlNVE1nTVRJdU5UWTBJRGd1TVRZeElEZ3VNRGcySURFNUxqZ3hJREV6TGpnMU15QXlPQzQ0TnprZ01Ua3VNelEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME5UVXVNakF4SURJMk1pNHhNekp6TFRJd0xqY3hOaTB6TkM0NE5UWXROall1TVRBMkxUTTBMamcxTm13dE5TNDJOak1nTWpZdU1UVTBJREV1TkRnMElERTJMamcwTVNBeE9TNDVOREVnTmk0M05UZGpNQzB1TURBeElERTJMakEwTmkweE5DNDRPVFlnTlRBdU16UTBMVEUwTGpnNU5ub2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5ORGt4TGprNElERTFNUzQxTWpSekxURXdPQzR6TkRZZ016RXVOalUwTFRFd09DNHpORFlnTVRJMUxqVXdNMnd0Tnk0eE5EWXRNell1TXpNMFl5NHdNREV0TGpBd01TQXhOeTQzT1RFdE56VXVPRE0wSURFeE5TNDBPVEl0T0RrdU1UWTVlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkRSRU5EUTBNaUlHUTlJazB5TkRRdU56TTJJRFV4TUM0M01UZHNNVEV1TkRBekxUTXdMamN6TTJNdE1USXVOekk0SURRdU9USTRMVE13TGprMk5TQXhNQzR6T1RRdE5EWXVPVFUwSURFMExqZzNJREV3TGpNZ05pNHhNVEVnTWpJdU1EWWdNVEV1TlRNM0lETTFMalUxTVNBeE5TNDROak42SWk4K1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRJM09DNDRNVFlnTkRFNExqZzFNbU10TlRJdU5ERTFJRFV1T1RRNExUa3hMamt4TmkwNUxqTXdNUzB4TVRjdU1EVXlMVE0wTGpRNE55MDBMakE0TlMwMExqQTVNUzAzTGpZNE1TMDBMalEzTFRFd0xqTTFOaTB5TGpFeE1TMHhNaTQxTnpRZ01USXVOVGMwSURJM0xqRXhPU0E0TkM0ME5qY2dNVEF3TGpVMk1pQTROQzQwTmpjZ015NDBPVFlnTUNBMkxqUTNNaTR3T0RnZ09DNDVPVGN1TWpVeGJERXhMakkzTnkwek1DNDBNVGNnTmk0MU56SXRNVGN1TnpBemVpSXZQanh3WVhSb0lHWnBiR3c5SWlORFJFTkRRME1pSUdROUlrMHlOakF1T1RZMklEUTJOaTQ1TnpGc0xUUXVPREkzSURFekxqQXhNMk14Tmk0ME16UXROaTR6TmpZZ01qTXVOalE0TFRFeExqZ3hOeUEwTGpneU55MHhNeTR3TVRONklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURTFNUzQwTURnZ016Z3lMakkxTTJNdE1URXVPRFV4SURFd0xqUTJNeTAxTGpRMU5DQTNOUzR3TmprZ05UY3VOemMzSURFeE1pNDJNREVnTVRVdU9UZzVMVFF1TkRjM0lETTBMakl5TnkwNUxqazBNaUEwTmk0NU5UUXRNVFF1T0Rkc05DNDRNamN0TVRNdU1ERXpZeTB5TGpVeU5TMHVNVFl6TFRVdU5TMHVNalV4TFRndU9UazNMUzR5TlRFdE56TXVORFF6SURBdE1URXpMakV6TmkwM01TNDRPVE10TVRBd0xqVTJNUzA0TkM0ME5qZDZUVFF3Tnk0eU56TWdOVEUyTGpZME5tTXVNVFUyTGpBMU1TNHpNREV1TURnNExqUTFOQzR4TXpVdExqRTFNeTB1TURVdExqSTVOeTB1TURnMExTNDBOVFF0TGpFek5Yb2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5NelkyTGpVek55QTBPRFV1TlRRM1l5MHhNUzQ1T1RRZ01qRXVOVEl6SURNMkxqZ3dOU0F4Tnk0M09TQTFOUzQyTkRRdE1UTXVPRFVnTVRndU9UTXhMVE0yTGpNd055MHhOaTR5TmpjdE5qSXVOVEkxTFRFMkxqSTJOeTAyTWk0MU1qVnNMVE0zTGpJeU9DQTJPUzQwTURGakxqZ3dNaTQwTnpRdU16TTRJREl1TlRFekxUSXVNVFE1SURZdU9UYzBlazAwTURjdU56STRJRFV4Tmk0M09ERmpMUzR4TlRNdExqQTBOeTB1TWprNExTNHdPRFF0TGpRMU5DMHVNVE0xTFRNeUxqWXlOaTA1TGpnNE5pMHpOeTQyT1RjZ09DNDRPREV0TVRVdU16WTVJREkzTGpBMk5TQXhOQzQ1TmpnZ01USXVNVGczSURZdU9UY3hJREl3TGpZd01TQTJMamszTVNBeU1DNDJNREVnTVRNdU56QTFMUzQ1T0RjZ01UWXVNelUwTFRFeUxqQTVNaUF4Tmk0ek5UUXRNVEl1TURreUlERXpMakUwTlMwdU9UUTJJRGN1T1RZdE1UVXVPRGMySURjdU9UWXRNVFV1T0RjMmN6RXlMakk0TFRFMExqVTBPQzA0TGpZek15MHhPQzR3TkRSakxTNHlNUzB1TURNeExTNHpPRGt0TGpBM05TMHVOVGc1TFM0eE1USXRNUzQ0T0MwdU1qTTRMVE11T0RVNUxTNDJOekV0TlM0NU5qSXRNUzR6TWpsaE5pNDFNRE1nTmk0MU1ETWdNQ0F3SURFdExqSTNPQzB1TURjNGVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHpPVEV1T1RBMElEVTBNeTQzTVRKakxUSXlMak15T0MweE9DNHhPRFV0TVRjdU1qVTNMVE0yTGprMU1TQXhOUzR6TmprdE1qY3VNRFkxTFRFMExqTTJNeTAwTGpJME1TMHhOaTQyTnpVdE1URXVOekkxTFRFMkxqWTNOUzB4TVM0M01qVWdNVFl1TXpRekxURXhMalkxSURJMkxqRTJPUzB5TWk0NE5TQXpNUzQxT0RJdE16TXVNakkxTFRFNExqZ3pPU0F6TVM0Mk5DMDJOeTQyTXpnZ016VXVNemN6TFRVMUxqWTBOQ0F4TXk0NE5TQXlMalE0TnkwMExqUTJNU0F5TGprMU1TMDJMalVnTWk0eE5Ea3ROaTQ1TnpSc0xUSXdMakUyTlNBek55NDJNRFJqTFRjdU1ERTBJREUyTGpjeU9TQXlOQzQwTkNBeE5TNHpORFFnTkRVdU5EUTNJRE0xTGpZd05TQTNMamM0T0NBM0xqVXdOU0EwTGprd05pQXhNaTQxTXlBMExqa3dOaUF4TWk0MU0zTTNMams1T1MwNExqUXhOQzAyTGprMk9TMHlNQzQyZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1EZ3VNREEySURVeE5pNDROVGxqTWk0eE1ETXVOalU0SURRdU1EZ3lJREV1TURreElEVXVPVFl5SURFdU16STVZVFl3TGprM0lEWXdMamszSURBZ01DQXhMVFV1T1RZeUxURXVNekk1ZWlJdlBqeHdZWFJvSUc5d1lXTnBkSGs5SWk0ek15SWdabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF3T0M0d01EWWdOVEUyTGpnMU9XTXlMakV3TXk0Mk5UZ2dOQzR3T0RJZ01TNHdPVEVnTlM0NU5qSWdNUzR6TWpsaE5qQXVPVGNnTmpBdU9UY2dNQ0F3SURFdE5TNDVOakl0TVM0ek1qbDZJaTgrUEdjZ1ptbHNiRDBpSXpjek1qY3lPQ0krUEhCaGRHZ2daRDBpVFRReU1pNHhPREVnTkRjeExqWTVOMk10TlM0MU5qa2dPUzR6TlRFdE1UTXVOelU0SURFMkxqSTBOaTB5TWk0eU1Ua2dNakF1TnpreExUYzRMakl5TkNBek5TNHhNREVnTVRndU1qQXpMVE15TXk0M09Ea2dNVEF1TURRekxUYzVMamN4TVNBd0lEQWdMalU0Tmk0eU9EZ3ROeTQyTWpndE5pNDRNak10T0M0eU1qY3ROeTR4TVRjdE1qQXVNamcySURVeUxqQXpOUzB5TUM0eU9EWWdOVEl1TURNMWN5MDVMamcxT0NBeU9DNDVNVFF0TVRNdU16VTNJRE01TGpZeE9HTXROQzR4TkRjdE1pNHdNVGd0TlM0MU5EZ3ROaTR3TlRNdE1pNHhPVFl0TVRJdU1EWXhJREl1TkRnM0xUUXVORFl4SURJdU9UVXhMVFl1TlNBeUxqRTBPUzAyTGprM05Hd3RNakF1TVRZMUlETTNMall3TkdNdE55NHdNVFFnTVRZdU56STVJREkwTGpRMElERTFMak0wTkNBME5TNDBORGNnTXpVdU5qQTFJRGN1TnpnNElEY3VOVEExSURRdU9UQTJJREV5TGpVeklEUXVPVEEySURFeUxqVXpjemN1T1RrM0xUZ3VOREUwTFRZdU9UY3hMVEl3TGpZd01XTXRNakl1TXpJNExURTRMakU0TlMweE55NHlOVGN0TXpZdU9UVXhJREUxTGpNMk9TMHlOeTR3TmpVdE1UUXVNell6TFRRdU1qUXhMVEUyTGpZM05TMHhNUzQzTWpVdE1UWXVOamMxTFRFeExqY3lOU0F4Tmk0ek5ETXRNVEV1TmpRNUlESTJMakUzTFRJeUxqZzBPQ0F6TVM0MU9ETXRNek11TWpJemVrMDBNRGt1T0RZeklEVXpPQzR3TWpGek55NDROellnTkM0ek9ETWdOUzR6TmpZZ01UUXVNbU0wTGpNd09DMHVNamMySURVdU9UUXlMVEl1TURnZ05TNDVOREl0TWk0d09DMHhMalkzTVMweE1DNDJOek10TVRFdU16QTRMVEV5TGpFeUxURXhMak13T0MweE1pNHhNbnBOTkRFMkxqY3pNeUExTWpndU5ESTJjelF1TnpBNElERXVORE0xSURZdU5EVTJJRGN1T1RFNVl6SXVNRE10TVM0MU9UZ2dNaTQwTmpNdE5DNHdNaklnTWk0ME5qTXROQzR3TWpJdE15NHlPVE10TXk0Mk5pMDRMamt4T1MwekxqZzVOeTA0TGpreE9TMHpMamc1TjNvaUx6NDhMMmMrUEhCaGRHZ2dabWxzYkQwaUkwSTNNekl6TVNJZ1pEMGlUVFF6Tmk0Mk1Ua2dNekE0TGpFME9XTXRNVEF1TXpnNExURXpMamt6TkMweU5TNDRNRGN0TWpRdU56RTJMVE13TGpRd05TMHhPQzQzTlRndE5DNDRPRE1nTmk0ek5EUXVNamM1SURNd0xqWXdNaUF4TUM0ME9UUWdOVEl1TWpVM0lESXlMakl6TlNBME55NHhOelFnT1M0MU1EVWdOak11TWpNM0lEa3VOVEExSURZekxqSXpOeUF4TXk0ME5qY3RMalkyTkNBeE5pNDROUzB4TWk0ME1UUWdNVFl1T0RVdE1USXVOREUwSURFMExqWTRPQzB1TnpJMElERXhMalF4TWkweE5pNDNNVGtnTVRFdU5ERXlMVEUyTGpjeE9YTXhOUzQzTURjdE9TNDVNeTB4TVM0eE56UXROVGN1TWpJellURXhPQzQyTlRRZ01URTRMalkxTkNBd0lEQWdNQzAyTGpZNE1pMHhNQzR6T0hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqUWpkQ04wSTRJaUJrUFNKTk16Y3hMalF5TkNBeU9EUXVOakkwWXpJdU5EazNMVE11TWpJZ09TNDNPRGt0TVRFdU1EazVJREUwTGpFd015MHhOUzQzTURjdE1USXVPRFEzTFRZdU56a3lMVEl5TGpJeU1pMDVMalkxTlMweU1pNHlNakl0T1M0Mk5UVnNMakExTmlBek1DNDRPREZ6TWk0NE5ESWdNaTQ0TURFZ055NHlOekVnTnk0MU1EbGpMVEV1TURjeExUVXVPVFF0TVM0MU16VXRNVEF1TURNMExqYzVNaTB4TXk0d01qaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF4T0M0d09EUWdNelF4TGpVM04yTXRPUzQzT0RNdE1qQXVOek00TFRFMUxqUXdPUzAwTVM0eU1USXRNVEV1TVRZeUxUUTRMakExTkNBMExqTTFOQzAzTGpBeE1TQXhPQzQ0TXpjdU1EWTFJREk1TGpZNU55QXhOQzQyTWpZdE1UVXVNelU1TFRJeExqUTFOUzB6TlM0NE5DMHpOUzR6TWpNdE5URXVNekF5TFRRekxqUTROeTAwTGpNeE1TQTBMall3TlMweE1TNDJNRFlnTVRJdU5EZzNMVEUwTGpFd05DQXhOUzQzTURFdE1pNHpNeUF5TGprNU9DMHhMamcyTnlBM0xqQTVOUzB1TnpreUlERXpMakF5T0NBeE5DNHhNalFnTVRRdU9UazVJRFEwTGpVME9DQTBPUzQxTWprZ05URXVPREkxSURjMUxqazBPU0EyTGpRek9DQXlNeTR6TXpnZ015NDVOallnTXpVdU5UUTFJRE11T1RZMklETTFMalUwTlhNeE5DNHhNUzB4Tmk0eE16VXRPQzR4TWpndE5qTXVNekE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek16VXVOekF6SURFME9DNDNOalJqTFRFdU9EWXRNamN1TVRJMUlEY3VNVE0yTFRVekxqazNPQ0F4TkM0eE9UTXROemt1TWpjelF6TTJNQzQxTXpJZ016RXVNemMzSURNMU15QTRMak15TnlBek16Z3VPRElnT0M0ek1qZGpMVEUwTGpFNE1pQXdMVFF1T0RjMElERTJMak01T1MwMU1TNDROVGNnTWpRdU9ERTVMVEk1TGpFeU5DQTFMakl4T1MwME5TNDJOVEVnTXk0NU9URXROemd1TkRRNUlEUXlMakV3T0Mwek1pNDNPVGdnTXpndU1URTBMVFU0TGpVd055QTNNeTR4TWpjdE5UZ3VOVEEzSURFeE5TNHlNekp6TWprdU1qVXlJRGcxTGpBNU9TQTBPQzR6TURjZ09EVXVNRGs1WXpFd0xqRTJPQ0F3SURFMExqQXpOQzA0TGpBM05pQXlNUzR6TkRVdE1Ua3VNRFF6SURFMExqazVPUzB5TXk0M01qWWdORGN1TVRNMkxUTXpMalEzTlNBMU15NHhNVGt0TkRjdU9EYzRJREFnTUMweUxqZzROU0F4TVM0eU5ETXRNakV1T0RNeElESTBMamN3TXkweE1DNDRNamtnTnk0Mk9UY3RNVFV1T1RreUlERTRMalExT0MweE9DNDBOemtnTWpZdU56Y3hJRGt1TlRBMElERXVNRFEySURNeExqYzRNeTB4TlM0NE1EY2dORGd1TnpNdE16SXVOelUwSURndU56a3RPQzQzT0RjZ01UVXVNelU1TFRFeExqY3hNeUF4T1M0M056TXRPUzQ0TURVZ05TNHpOall0TVRRdU56STJJRGd1TVRjNUxUTXdMamcyTWlBeE55NDBOVGd0TkRVdU56QTNJRFF1TVRFMExUZ3VNakU1SURndU1qUTJMVEU1TGpVNE55QXhOeTR5TnpRdE1qTXVNVEE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek5EZ3VOVFk0SURFNU1DNHdORFZqTFRndU1qQTBMVEV6TGpjeE55MHhNUzQ1TWpJdE1qY3VOVE15TFRFeUxqZzJOUzAwTVM0eU9ERXRPUzR3TWpnZ015NDFNakV0TVRNdU1UWWdNVFF1T0RnNUxURTNMakkzTWlBeU15NHhNRGt0T1M0eU56a2dNVFF1T0RRMUxURXlMakE1TWlBek1DNDVPREV0TVRjdU5EVTRJRFExTGpjd055QTNMalEwTlNBekxqSXdPQ0E0TGpjMU1pQXlNQzR4TnpFZ05DNHhOak1nTkRZdU1EUXROeTR6TVRRZ05ERXVNakU0TFRReUxqVTFNeUE0TVM0eE1EVXROREl1TlRVeklEZ3hMakV3TlhNdE1qY3VOVEF4SURjMUxqWTBMVEl5TGpJNE5TQXhNamd1TXpNNWJESXlMakk0TlMwME1TNDBNamx6TlRFdU9EVTVMVFl1T0RFeUlEWTNMamd4TXkwNE5TNHdPRGRqTVRRdU5EUTBMVGN3TGpnMk1TQTFNQzR4TkRFdE56a3VNakEwSURjeUxqQTFPUzAwTmk0Mk1ETXRNVE11TkRnMUxUVXdMakF3TlMwek55NHlOemN0T0RJdU1USXROVE11T0RnM0xURXdPUzQ1ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5GUlRaQk5rRWlJR1E5SWswME1USXVPRE0zSURNNE15NHlPRGRqTUMwek1pNDJNelV0TkM0d05qTXROVGt1T1RReExURXdMak00TWkwNE15NHpOREl0TWpFdU1UazRMVE15TGpnek15MDJNeTQyT1RFdE1qUXVNalU0TFRjNExqRXpOaUEwTmk0Mk1ETXRNVFV1T1RVMElEYzRMakkzTkMwMk1TNDNNellnT0RVdU1EZzNMVFl4TGpjek5pQTROUzR3T0Rkc0xUSXlMakk0TlNBME1TNDBNamxqTGpnMk1TQTRMalk0TVNBeUxqWXlOU0F4Tmk0M01Ua2dOUzQxTWpZZ01qTXVOekUzSURRdU5qTTJJREV1TURnZ09TNDNORGtnTWk0MU1qUWdNVFV1TkRNM0lEUXVOREEzSURjM0xqazJOeUF5TlM0M09EY2dNVFV4TGpVM05pMHpNaTQ0TURFZ01UVXhMalUzTmkweE1UY3VPVEF4ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1URXVNREEzSURReE1TNHhOREpqTVM0eE9UUXRPQzQ0TWpFZ01TNDRNeTB4T0M0eE1EWWdNUzQ0TXkweU55NDROVFFnTUNBekxqYzROQzB1TWpBeElEY3VORGt6TFM0ME56a2dNVEV1TVRjeExqWXhOeTB4TWk0M016RXVOREV6TFRJMkxqQXhNeTB1TmpFM0xUTTVMamN5TWlBMExqazVNeUF4TlRJdU5UZzRMVEV5Tmk0MU5TQXhOREV1TURVM0xURXlOaTQxTlNBeE5ERXVNRFUzYkMwNUxqZzBNaUE1TGpFME5XRXhNalF1TlRrNElERXlOQzQxT1RnZ01DQXdJREV0TVRRdU1EZzNMVE11TnpWakxUVXVOamc0TFRFdU9EZ3pMVEV3TGpnd01TMHpMak15TnkweE5TNDBNemN0TkM0ME1EY2dOUzR4TnpJZ01USXVORGN4SURFMExqQXdPU0F5TVM0MU56Y2dNamd1TURZeUlESTBMamM1TVdFeE1URXVOREV5SURFeE1TNDBNVElnTUNBd0lEQWdNalF1TnpnNElESXVPREV6YkM0d016UXVNREkwWXk0eE56SWdNQ0F1TXpJNUxTNHdNVE11TlRBeExTNHdNVE11T1RnekxTNHdNRE1nTVM0NU5qY3RMakEwTkNBeUxqazBPQzB1TURjNElEWTRMalF6TmkweExqVXlOaUF4TURFdU16VXpMVFE0TGpBeE15QXhNRGd1T0RRNUxURXhNeTR4TnpkNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpVeU5USTFNaUlnWkQwaVRUSXhOaTQyTWpJZ01Ua3dMamsyT1dNMkxqY3pOUzB4TGpJM09DQXhOQzQ0TURVdE9TNDBNellnTVRFdU9EWXpMVEU0TGpjeU55MHlMamswTVMwNUxqSTVNaTB4TkM0NU5USXRNUzQwTVRZdE1UWXVORFF6SURjdU56QTVMVEV1TkRJeUlEZ3VOamszSURJdU1Ea3lJREV4TGpRNU55QTBMalU0SURFeExqQXhPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpSa1pHSWlCa1BTSk5Nakl4TGpVeE1pQXhOemt1TkRNNFl6RXVORGM1TGpVeE1TQXpMakUxTVMwdU56YzNJRE11TnpFNExUSXVPRGM1TGpVM0xUSXVNVEF5TFM0eE5qa3ROQzR5TVRNdE1TNDJORGd0TkM0M01qRXRNUzQwT1RFdExqVXdOeTB6TGpFMU5DNDNPRFl0TXk0M015QXlMamc0TlMwdU5UWTBJREl1TURrekxqRTNNU0EwTGpJeE1TQXhMalkySURRdU56RTFlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkVRek5HTTBZaUlHUTlJazB5T1RrdU9ERTJJREkzTnk0d01qZHpMVFV1TmpVeExURXlMakk1T0NBeE1TNDVOamN0TWpNdU1EazVZekUzTGpZeE55MHhNQzQ0TURVZ01Ua3VNVEV4SURRdU16RTVJREU1TGpFeE1TQTBMak14T1NJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME9URXVPVGdnTVRVeExqVXlOSE10TmpBdU1EZzFJREl3TGpRM09DMDVNUzQxTlRVZ09ESXVPVEEyYkMwMUxqRTVOQzAzTGpFMU5YTXlNaTQ1T0RRdE5UTXVNakU1SURrMkxqYzBPUzAzTlM0M05URjZJaTgrUEhCaGRHZ2dabWxzYkQwaUkwUkRNMFl6UmlJZ1pEMGlUVEl6TlM0ek16a2dOVFV3TGpJNE1XTXRMamd6SURJMExqa3pNeUF6TXk0eU5qZ2dORFF1TnpReUlERTFMalV3TXlBMU15NHlPRFVnTVRZdU5qSXlJREl1TWpFMUlESXhMamswTFRjdU5UTTNJREl4TGprMExUY3VOVE0zSURJeUxqWXdNaUF6TGpNeU55QXlNUzQwT1RNdE1UWXVNVGMzSURJeExqUTVNeTB4Tmk0eE56Y2dNVEF1TmpBMExUY3VNREV4SURrdU5qZ3pMVEUyTGpNek15NHdNakl0TWpVdU5UY3hMVEl4TGprek5DMHhPQzR4TkRNdE5UZ3VNVEk0TFRJNExqZzBNUzAxT0M0NU5UZ3ROSHBOTXpBd0xqQTNOeUEwTmpNdU1EY3pZeTR6TWprdE1qSXVNVGc0TFRFeUxqSXlOeTB6T1M0NE9UWXRNVEl1TWpJM0xUTTVMamc1Tm5NeE55NHlPRFl0TVRFekxqUTJNUzAwTkM0M05qVXROalF1TWpZMVl5MDJNaTR3TlRNZ05Ea3VNVGszTFRVeUxqa3dPU0F4TVRVdU5qSXRNemt1TWpJeklERXpOeTR6T1RVZ01qTXVNVFUwSURNekxqVTNOU0E0TkM0MU1URWdNVGd1TWpnNElEazJMakl4TlMwek15NHlNelI2SWk4K1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRJNE5TNHhPU0EwT1RrdU9EVmpNVEF1T1RnMkxURXlMakl4TnlBeE5DNDNNVFF0TWpVdU1URTJJREUwTGpnNE5pMHpOaTQzTnpZdE1URXVOekEwSURVeExqVXlNUzAzTWk0eE5UWWdOalF1TURVeUxUazJMakl4TkNBek15NDJNalVnTVRZdU5UQTVJREkyTGpJMk1TQXpPQzQ1T1RnZ01qQXVPRGd5SURJNExqZ3dOeUF6T1M0M01UZ3RNVEF1TVRrM0lERTRMamcwTGpZMk55QXpOeTR3TVRJZ01UUXVPRFE0SURRNExqVXpNM016TGpNeU5DQXhPQzQyTVRjZ015NHpNalFnTVRndU5qRTNZekkzTGprM05DMDVMakE0TlMwNUxqVXlPUzB5TlM0NE1ETXRPUzQxTWprdE5UQXVOelE0SURBdE1Ua3VOU0F5T1M0NU1TMHhOQzR5TURrZ05USXVPVGcwSURFdU5EWXpMVEl1T0RZdE1pNDNNekV0Tmk0ME5ETXROUzQwTlRjdE1UQXVOemN0T0M0eE1UTXRNVGd1T1RRMExURXhMall6TlMweU9DNDVNVGt0TVRJdU1qazVJREV1TmpZMExUUTJMak14T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk1qY3lMamM0TWlBMU9UWXVNREk1WXpndU1EZzRMVEV3TGpFNUlERXVNakUyTFRFNExqQTJJREV1TWpFMkxURTRMakEyY3pFd0xqRXhNaUEwTGpFd01TQTNMams1TVNBeE9DNHdObU13SURBdE5DQXlMakV3T1MwNUxqSXdOeUF3VFRJNU5DNHlOelVnTlRjNUxqZzFNMk13TFRFeExqSTVPUzAzTGpjMU5pMHhOQzR3TnpFdE55NDNOVFl0TVRRdU1EY3hjemd1TlRNM0xqTXdOQ0F4TWk0eE9Ea2dNVEF1TWpsak1DMHVNREF4TFRFdU9ESTNJREl1TnpJNExUUXVORE16SURNdU56Z3hJaTgrUEdjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNek9DNDRNaUE0TGpNeU9HTXRNVFF1TVRneUlEQXROQzQ0TnpRZ01UWXVNems1TFRVeExqZzFOeUF5TkM0NE1Ua3RNaTR6TXpNdU5ERTNMVFF1TlRjM0xqYzVMVFl1TnpZeklERXVNVFVnTWpVdU5qUTBMVE11T1RZeklESXlMalk0SURNdU9UQTJJRFF1TXpJeklERXlMamd4TlMweU15NHdNRElnTVRFdU1UVTRMVE0yTGpZeU15QXhMakE0TVMwMk9DNDVORFVnTkRZdU56UTFMVE15TGpNeU5TQTBOUzQyTmpNdE5ETXVNVElnT1RJdU5EazVMVEl6TGprd09DQXhNamt1T0RjMklESXdMakEwTlNBek9DNDVPVEVnTXpNdU5qa2dNVGt1TVRJNElEVXpMakF5TWlBNExqYzBiQzB1TURBMkxqQXdObU14TWk0MU1qY3RPQzQzTmpJZ01qUXVOalEzTFRFMUxqVXhPU0F5T0M0d09UTXRNak11T0RFeklEQWdNQzB5TGpnNE5TQXhNUzR5TkRNdE1qRXVPRE14SURJMExqY3dNeTB4TUM0NE1qa2dOeTQyT1RjdE1UVXVPVGt5SURFNExqUTFPQzB4T0M0ME56a2dNall1TnpjeElEa3VOVEEwSURFdU1EUTJJRE14TGpjNE15MHhOUzQ0TURjZ05EZ3VOek10TXpJdU56VTBJRGd1TnprdE9DNDNPRGNnTVRVdU16VTVMVEV4TGpjeE15QXhPUzQzTnpNdE9TNDRNRFVnTlM0ek5qWXRNVFF1TnpJMklEZ3VNVGM1TFRNd0xqZzJNaUF4Tnk0ME5UZ3RORFV1TnpBM0lEUXVNVEV5TFRndU1qSWdPQzR5TkRRdE1Ua3VOVGc0SURFM0xqSTNNaTB5TXk0eE1Ea3RNUzQ0TmkweU55NHhNalVnTnk0eE16WXROVE11T1RjNElERTBMakU1TXkwM09TNHlOek1nTVRBdU5qTTNMVE00TGpFeE5TQXpMakV3TmkwMk1TNHhOalF0TVRFdU1EYzFMVFl4TGpFMk5Ib2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJell4TWpFeU1TSWdaRDBpVFRJMU1TNDNJREl6TkM0eE1UZGpNVGd1T1RRMkxURXpMalEyTVNBeU1TNHdOemt0TWpVdU5EVXlJREl4TGpBM09TMHlOUzQwTlRJdE5TNDVPRE1nTVRRdU5EQXpMVE00TGpFeUlESTBMakUxTWkwMU15NHhNVGtnTkRjdU9EYzRJRE11T0RrMElESXVPRFlnT0M0eU1EUWdNeTQ1TWpVZ01USXVPREE1SURNdU5UazJJREl1TkRnNExUZ3VNekV6SURndU5EQXlMVEU0TGpNeU5TQXhPUzR5TXpFdE1qWXVNREl5ZWlJdlBqeHdZWFJvSUdacGJHdzlJbTV2Ym1VaUlHUTlJazB5TlRBdU9UUTRJREl6TXk0ek5qaGpNVGd1T1RRMkxURXpMalEySURJeExqZ3pNUzB5TkM0M01ETWdNakV1T0RNeExUSTBMamN3TXkwekxqQTJNeUEzTGpNM01TMHhNaTQ1TnpJZ01UTXVOVEkyTFRJekxqa3pNeUF5TUM0NU5UZGhNVEV1TkRZM0lERXhMalEyTnlBd0lEQWdNQ0F4TGpnNU5TQXpMamt4Tm1NdU1EYzJMUzR3TlRjdU1UTTFMUzR4TVRZdU1qQTNMUzR4TjNvaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJak5VRXhSREZCSWlCa1BTSk5NakUxTGpreU9TQXlNREl1TkRVNVl6WXVOamMyTFRFdU5UWWdNVFF1TXprM0xURXdMakEwTmlBeE1TNHdOamN0TVRrdU1qQTJMVE11TXpNekxUa3VNVFl0TVRVdU1EQXhMUzQzT0RrdE1UWXVNVEEzSURndU16azJMVEV1TURVNUlEZ3VOelEySURJdU5UYzFJREV4TGpNNU5pQTFMakEwSURFd0xqZ3hlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkdSa1lpSUdROUlrMHlNakF1TXpJNElERTVNQzQzTXpkak1TNDFMalExTVNBekxqRXhOeTB1T1RBNUlETXVOVGt6TFRNdU1ETTJMalE0TmkweUxqRXhPQzB1TXpRMExUUXVNakF4TFRFdU9EUXlMVFF1TmpReUxURXVOVEV0TGpRME5TMHpMakV5TGpreE1TMHpMall3TlNBekxqQXpOUzB1TkRjM0lESXVNVEUxTGpNME55QTBMakl3TlNBeExqZzFOQ0EwTGpZME0zb2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNd09DNDBNVGdnTWpZMExqazRPWE10TkRndU5qUXlJREk1TGpRek5DMDJNaTR3TURJZ01URXpMak0yTldNdE5TNDRNaUF6Tmk0MU16RWdNVEF1TWpjeUlEUXdMamMzTmlBeE1DNHlOeklnTkRBdU56YzJjekV5TGpneE9DQXhPQzR5TXpFZ016QXVORElnTVRJdU9EVmpNQ0F3SURrdU5UVTRJREV3TGpRME5DQXpNQzR6TnpRdU1USTJJREFnTUMweU15NDNNamt0TVRBdU9UZzVMVE13TGpNNE15MDBPQzQyTkRNdE5pNDJOaTB6Tnk0Mk5UY2dNVEF1TWpFNUxUYzRMalUzT0NBeU1pNHhOVFF0T1RJdU5qWTRJREV6TGpNMk1pMHhOUzQzTnprZ01USXVNemd5TFRNMExqWTJOUzB1T0RNMUxUSTFMamd3Tm5vaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJalFUVkJOVUUxSWlCa1BTSk5NekF4TGprd09TQTBNamd1T1RReGJDMHVOek0yTFM0MU1qWmpMalEzTXk0ek5qTXVOek0yTGpVeU5pNDNNell1TlRJMmVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHlPVEF1TXpneElETTRNaTR3TVRKakxUVXVOVE01TFRNeExqTTBNU0F5TGprMk5pMDJNeTQ1TURjZ01USXVPRFUyTFRneUxqQTRPUzAwTVM0ek1UVWdOekl1TnpJNUxURXdMak00TVNBeE1qSXVNRFExTFRFdU16STRJREV5T1M0d01Ua2dNQ0F3TFRFMExqZ3pOaUEwTGprNE5pMHlNaTR6TmpjdE1UQXVNRGd4SURBZ01DQXVOVElnTlM0M01UUWdNeTQyTlRZZ09TNDFNallnTUNBd0xUSXlMall3TkNBeUxqTTBNeTB5T0M0d09UTXRNVGt1TWpFMUlEQWdNQzB5TGprd01TQXhNQzQ1TXpZZ09DNHlOVFFnTVRndU5qWWdNVEV1TlRJNElEY3VPVGMySURJekxqUTVOQ0ExTGpJd05pQXlNeTQwT1RRZ05TNHlNRFp6TVRVdU5USTFJREV4TGpjMk55QXpNaTQxTnpNdExqazFPR011TURBeElEQXRNakl1TXpnNExURXlMalF4TVMweU9TNHdORFV0TlRBdU1EWTRlaUl2UGp3dlp6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk16a3pMakU0TXlBeU56QXVPVE0wY3pjdU9URXRNVEF1TnpRNExUVXVPREUzTFRFMExqSXdPV013SURBdE9DNDBOVEV0TWpBdU9EZzFMVEUzTGpnd05TMHpOQzQ0TmpNdExqQXlNaTB1TURJNExTNHdORGd0TGpBMkxTNHdOamt0TGpBNU1TMDVMamc1TXkweE5pNHlPVFV0TWpFdU1UTXpMVE16TGpBNU9TMHlOeTR4T0RVdE5Ea3VOVEV6TFRrdU16RTJMVEk1TGpFMU9DQTBMamd6Tnkwek1DNDFPVE1nTnk0Mk9UTXRNemd1TURBeElEUXVORGMzTFRFeExqVTROQzB4TWk0ME1pMDJMamt6T0MwNExqQXlPQzB6TVM0M09USWdNUzQ1TnpFdE9DNHdORGNnTkM0ek16SXRNVFl1TURrMUlEWXVPREU1TFRJMExqRXhNU0E1TGpNek5TMHpNQzR3T0RJZ01UTXVPVFl5TFRjd0xqQXlOUzA1TGprM01TMDNNQzR3TWpVZ01DQXdJREUzTGpFM05pQXlMak0wTmlBMkxqSXdOU0F6Tmk0d056Z3RNVEF1T1RjZ016TXVOekk1TFRVekxqRTROU0ExTmk0NU9UY3ROREV1TlRRM0lERXdNQzQ0TnpVZ01UQXVNVFU1SURNNExqTXlOQ0F5TGpJeE1TQTFPQzQ0TXpZdE1qRXVOVFV5SURneExqTTVNU0F3SURBZ01qa3VNelkxTFRJNExqSXdOaUF5TlM0MU1ESWdNVGt1TnpZM0lEWXVPRFUzTFRjdU9EVWdOeTQxTkRZdE1qQXVNelk0SURjdU1UVTFMVE15TGpNeExqQTBMVEU0TGpjd09DQTRMakExTnkwek9TNDVOekVnTXpNdU5EZzJMVEV4TGpRM09DNDJNakV1TnpBMUlERXVNalEwSURFdU5EQTNJREV1T0RVNElESXVNVEkzTGpFd015NHhNakl1TWpFdU1qVTBMak14Tmk0ek56a2dNamd1TVRnM0lETXpMakk1TXlBME55NHdOamtnTnpndU5EWXlJRFV5TGpJeElEazBMamM0T1MwdU5qY3lMVE11TWpFekxUWXVNRGMxTFRJeExqVTFNUzA1TGpJM0xUSTVMakF4TTNwTk1qZ3dMak01TWlBME9UY3VNekl5WXpJM0xqTTBNUzB5TkM0NE1qa2dNVEl1TURVeExUWXpMalE1TnlBeE1pNHdOVEV0TmpNdU5EazNhRFl1TURjeGN6SXdMak13TWlBek15NHhORFlnTVM0MU5qTWdOell1T0RreUlpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRUUXdNeTR3TnpnZ01qUTRMamM1TTJNdE1qUXVNalU0TFRndU5UUXlMVEV5TGpJek1pMHpPQzQwT0RZdE1USXVNak15TFRNNExqUTROaTB4TUM0NU9EVWdNVFF1TVRZeUxURTFMalF4TlNBek1TNHdOUzB4TlM0ME1UVWdNekV1TURWc01UQXVNRGsySURFMExqYzBPSE14TWk0d09EWWdPQzR4TlRRZ01USXVPREVnTnk0ME1qZGpMamN5TXkwdU56STNJREk1TFRZdU1Ua3pJRFF1TnpReExURTBMamN6T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTmpFeU1USXhJaUJrUFNKTk1qVTBMakV3T1NBeU5qQXVNVGsyY3pJeUxqWXdOeUEyTGpFeE5TQXpPUzR3T1RRZ01UY3VOak5zTFRJMkxqUXhOeUF5TGprMU1YTXRPUzQ1TWpRdE55NDBOelV0TVRBdU16STFMVGN1T0RjMVl5MHVOQzB1TkRBeUxUSXVNelV5TFRFeUxqY3dOaTB5TGpNMU1pMHhNaTQzTURaNlRUUTFOUzR5TURFZ01qWXlMakV6TW5NdE1UQXVOVEV6TFRRMkxqRXpOeTAxTlM0eU1qUXRORE11TXpZeFl6QWdNQ0F5Tnk0eE5qVXRORGt1T0RZeElEa3lMakF3TXkwMk55NHlORGNnTUNBd0xUUTJMakF3TVNBMU1TNHdORFV0TXpZdU56YzVJREV4TUM0Mk1EaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6WXhNakV5TVNJZ1pEMGlUVE00T0M0ME9DQXlOVEF1TURNM2N5NHlNall0TWpBdU56WTJJREU1TGpZMkxUUXpMakl3T0d3eE5TNDBNalV0TWk0M09UUWdOUzR5TVRNZ01pNDNPVFJ6TFRNd0xqVTBPU0F4Tmk0NU9EVXROREF1TWprNElEUXpMakl3T0hvaUx6NDhMM04yWno0PVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRhY3RMaXN0SXRlbSA9IGBcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJjb250YWN0LWl0ZW0tJHtjdXJyZW50Q29udGFjdC5pZH1cIiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHdyYXBwZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuaWR9XCIgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSBjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxmaWd1cmUgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1hdmF0YXJcIj5cbiAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImltYWdlXCIgc3JjPVwiJHtjdXJyZW50Q29udGFjdC5maWxlWzBdLmRhdGFVcmxcbiAgICAgICAgICAgICAgICA/IGN1cnJlbnRDb250YWN0LmZpbGVbMF0uZGF0YVVybFxuICAgICAgICAgICAgICAgIDogY3VzdG9tQXZhdGFyfSAgXCIgLz5cbiAgICAgICAgICAgIDwvZmlndXJlPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLW5hbWVcIj5cbiAgICAgICAgICAgICAgJHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAke2N1cnJlbnRDb250YWN0LmZhdm9yaXRlc1xuICAgICAgICAgICAgICA/IGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1mYXZvcml0ZVwiPlxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDM3NiAzNzZcIj48c3R5bGU+LmF7ZmlsbDojQzM5MjE1O308L3N0eWxlPjxwYXRoIGQ9XCJNMTg4IDE3bDYzIDEwMyAxMTcgMjggLTc4IDkyIDEwIDEyMCAtMTExLTQ2IC0xMTEgNDYgMTAtMTIwIC03OC05MiAxMTctMjhMMTg4IDE3elwiIGZpbGw9XCIjRkZFNjNDXCIvPjxwYXRoIGQ9XCJNMjI0IDE5NGwtMzYtMTYxIDYzIDg3IDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDZMMjI0IDE5NHpcIiBmaWxsPVwiI0ZERDcyRVwiLz48cGF0aCBkPVwiTTI5OSAzNjdjLTEgMC0yIDAtMy0xbC0xMDgtNDUgLTEwOCA0NWMtMiAxLTYgMS04LTEgLTItMi00LTQtMy03bDktMTE3IC03Ni04OWMtMi0yLTItNS0yLTggMS0zIDMtNSA2LTVsMTE0LTI3IDYxLTEwMGMyLTIgNC00IDctNGwwIDBjMyAwIDUgMiA3IDRsNjEgMTAwIDExNCAyN2MzIDEgNSAzIDYgNSAxIDMgMCA2LTIgOGwtNzYgODkgOSAxMTdjMCAzLTEgNi0zIDdDMzAyIDM2NyAzMDAgMzY3IDI5OSAzNjd6TTE4OCAzMDVjMSAwIDIgMCAzIDFsOTkgNDEgLTgtMTA3YzAtMiAwLTQgMi02bDcwLTgyIC0xMDQtMjRjLTIgMC00LTItNS00bC01Ni05MiAtNTYgOTFjLTEgMi0zIDMtNSA0bC0xMDQgMjUgNzAgODJjMSAyIDIgNCAyIDZsLTggMTA3IDk5LTQxQzE4NiAzMDUgMTg2IDMwNSAxODggMzA1ek0xMjUgMTIwTDEyNSAxMjAgMTI1IDEyMHpcIiBmaWxsPVwiI0MzOTMxNFwiLz48cGF0aCBkPVwiTTg5IDE5NmMtMiAwLTQtMS02LTNsLTgtMTBjLTMtMy0yLTggMS0xMXM4LTIgMTEgMWw4IDEwYzMgMyAyIDgtMSAxMUM5MiAxOTYgOTEgMTk2IDg5IDE5NnpcIiBjbGFzcz1cImFcIi8+PHBhdGggZD1cIk0xMTggMjg1YzAgMCAwIDAtMSAwIC00IDAtOC00LTctOWwyLTI1YzEtMTQtNC0yNy0xMi0zOGwtMi0zYy0zLTMtMi04IDEtMTEgMy0zIDgtMiAxMSAxbDIgM2MxMiAxNCAxOCAzMiAxNiA1MGwtMiAyNUMxMjYgMjgyIDEyMiAyODUgMTE4IDI4NXpcIiBjbGFzcz1cImFcIi8+PC9zdmc+XG4gICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgICAgICAgOiBcIlwifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3NlY3Rpb24+YDtcblxuICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gY29udGFjdExpc3RJdGVtO1xuICAgICAgY29uc3QgY29udGVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhY3QtbGlzdC1pdGVtLndyYXBwZXJcIik7XG5cbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5jb250YWN0TGlzdEJ1dHRvbihcbiAgICAgICAgY29udGVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGFjdC1saXN0LWl0ZW0gY29udGFpbmVyXCIpLFxuICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3QsXG4gICAgICAgIFwiYWRkXCIsXG4gICAgICAgIFwiY2xpY2tcIlxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSxcbiAgICBjb250YWN0Vmlld0FuZEZvcm06IGZ1bmN0aW9uKFxuICAgICAgY3VycmVudENvbnRhY3QgPSB7XG4gICAgICAgIGZpbGU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkYXRhVXJsOiBcIlwiLFxuICAgICAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBmaXJzdG5hbWU6IFwiXCIsXG4gICAgICAgIGxhc3RuYW1lOiBcIlwiLFxuICAgICAgICBmYXZvcml0ZXM6IGZhbHNlLFxuICAgICAgICBwaG9uZVdvcms6IFwiXCIsXG4gICAgICAgIHBob25lUHJpdmF0ZTogXCJcIixcbiAgICAgICAgZW1haWxXb3JrOiBcIlwiLFxuICAgICAgICBlbWFpbFByaXZhdGU6IFwiXCIsXG4gICAgICAgIGFkZHJlc3M6IFwiXCIsXG4gICAgICAgIG5vdGU6IFwiXCIsXG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgfSxcbiAgICAgIHR5cGUgPSBcImFkZFwiXG4gICAgKSB7XG4gICAgICBsZXQgY29udGFjdEl0ZW1XcmFwcGVyID0gYFxuPGFydGljbGUgY2xhc3M9XCJjb250YWN0LWl0ZW0gd3JhcHBlclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW1cIj5cbiAgPGZvcm0gY2xhc3M9XCJjb250YWN0LWZvcm1cIiBhY3Rpb249XCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHMke2N1cnJlbnRDb250YWN0LmlkXG4gICAgPyBcIi9cIiArIGN1cnJlbnRDb250YWN0LmlkXG4gICAgOiBcIlwifVwiIG1ldGhvZD1cIiR7Y3VycmVudENvbnRhY3QuaWRcbiAgICAgICAgPyBcIlBBVENIXCJcbiAgICAgICAgOiBcInBvc3RcIn1cIiBuYW1lPVwiZm9ybVwiIG5vdmFsaWRhdGU+XG4gICAgPGZpZWxkc2V0ICR7dHlwZSA9PSBcInJlYWRcIiA/IFwiZGlzYWJsZWRcIiA6IFwiXCJ9PlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImlkXCIgaWQ9XCJpZFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5pZH1cIiBoaWRkZW4gLz5cbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0taGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJmaWxlLXVwbG9hZFwiPlxuICAgICAgICAgIDxmaWd1cmUgY2xhc3M9XCJjb250YWN0LWF2YXRhciBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWF2YXRhclwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgbmFtZT1cImF2YXRhclwiIGlkPVwiYXZhdGFyXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIHN0YXRlPVwiaGlkZGVuXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiaW5wdXQtZmlsZS1kYXRhXCIgbmFtZT1cImZpbGVcIiB2YWx1ZT0nW3tcImRhdGFVcmxcIjpcIiR7Y3VycmVudENvbnRhY3RcbiAgICAgICAgICAgICAgLmZpbGVbMF0uZGF0YVVybH1cIixcIm5hbWVcIjpcIiR7Y3VycmVudENvbnRhY3QuZmlsZVswXS5uYW1lfVwifV0nXG5pZD1cImZpbGVcIiBoaWRkZW4gLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhdmF0YXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtYXZhdGFyIHVuaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiaW1hZ2UgYXZhdGFyLWltYWdlXCIgc3JjPVwiJHtjdXJyZW50Q29udGFjdFxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbGVbMF0uZGF0YVVybFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBjdXJyZW50Q29udGFjdC5maWxlWzBdLmRhdGFVcmxcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYC9yZXNvdXJjZXMvaW1hZ2VzL2ljb25zL2F2YXRhci5zdmdgfVwiIGFsdD1cImF2YXRhciBwaWN0dXJlXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxmaWdjYXB0aW9uIGNsYXNzPVwiY2FwdGlvblwiPnNlbGVjdCBhIGZpbGU8L2ZpZ2NhcHRpb24+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlbGV0ZS1maWxlIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJkZWxldGUtZmlsZVwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRlbGV0ZS1maWxlIHVuaXRcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbDogc3BhY2U9XCJwcmVzZXJ2ZVwiPjxwYXRoIGQ9XCJNMjk4LjkxMiA2MC4yMzFjLTguMTE0IDAtMTQuNjkyLTYuNTc3LTE0LjY5Mi0xNC42OTJWMjkuMzgzSDE3Mi41NjRWNDUuNTRjMCA4LjExNC02LjU3NyAxNC42OTItMTQuNjkyIDE0LjY5MnMtMTQuNjkyLTYuNTc3LTE0LjY5Mi0xNC42OTJWMTQuNjkyQzE0My4xODEgNi41NzcgMTQ5Ljc1OCAwIDE1Ny44NzIgMGgxNDEuMDRjOC4xMTQgMCAxNC42OTIgNi41NzcgMTQuNjkyIDE0LjY5MlY0NS41NEMzMTMuNjA0IDUzLjY1NCAzMDcuMDI1IDYwLjIzMSAyOTguOTEyIDYwLjIzMXpNMzY2LjQ5NCA1MTJjLTYxLjU2OCAwLTExMS42NTctNTAuMDg4LTExMS42NTctMTExLjY1N3M1MC4wODgtMTExLjY1NyAxMTEuNjU3LTExMS42NTdTNDc4LjE1IDMzOC43NzUgNDc4LjE1IDQwMC4zNDMgNDI4LjA2MiA1MTIgMzY2LjQ5NCA1MTJ6TTM2Ni40OTQgMzE4LjA3Yy00NS4zNjUgMC04Mi4yNzMgMzYuOTA4LTgyLjI3MyA4Mi4yNzNzMzYuOTA4IDgyLjI3MyA4Mi4yNzMgODIuMjczYzQ1LjM2NSAwIDgyLjI3My0zNi45MDggODIuMjczLTgyLjI3M1M0MTEuODU5IDMxOC4wNyAzNjYuNDk0IDMxOC4wN3pNMjk3LjY4NyA0ODMuMzQ0SDEwNC45NjNjLTcuNTc1IDAtMTMuOTA3LTUuNzU4LTE0LjYyNi0xMy4yOTlMNjAuOTUxIDE2MS41MjdjLTAuMzkyLTQuMTIgMC45NzEtOC4yMTQgMy43NTUtMTEuMjc3IDIuNzg2LTMuMDYyIDYuNzMyLTQuODA3IDEwLjg3LTQuODA3aDMwNS42MjhjOC4xMTQgMCAxNC42OTIgNi41NzcgMTQuNjkyIDE0LjY5MiAwIDguMTE0LTYuNTc3IDE0LjY5Mi0xNC42OTIgMTQuNjkySDkxLjczNWwyNi41ODggMjc5LjEzNGgxNzkuMzYzYzguMTE0IDAgMTQuNjkyIDYuNTc3IDE0LjY5MiAxNC42OTJTMzA1LjgwMSA0ODMuMzQ0IDI5Ny42ODcgNDgzLjM0NHpNMTU4LjM4MiA0MjQuNTc3Yy03LjQ4NyAwLTEzLjg4NC01LjY5NC0xNC42MDgtMTMuMjk5bC0xNC40OTgtMTUyLjIwMWMtMC43NjgtOC4wNzcgNS4xNTUtMTUuMjQ4IDEzLjIzMy0xNi4wMTggOC4wOTEtMC43NjcgMTUuMjUgNS4xNTUgMTYuMDE4IDEzLjIzM2wxNC40OTggMTUyLjIwMWMwLjc2OCA4LjA3Ny01LjE1NSAxNS4yNDgtMTMuMjMzIDE2LjAxOEMxNTkuMzE4IDQyNC41NTcgMTU4Ljg0OCA0MjQuNTc3IDE1OC4zODIgNDI0LjU3N3pNMzA2Ljk5IDMzOC40ODZjLTAuNDgzIDAtMC45NzEtMC4wMjUtMS40NjItMC4wNzIgLTguMDc1LTAuNzk4LTEzLjk3My03Ljk5MS0xMy4xNzUtMTYuMDY1bDYuNTMzLTY2LjEwOGMwLjc5OC04LjA3NiA3Ljk5NS0xMy45NjQgMTYuMDY1LTEzLjE3NSA4LjA3NSAwLjc5OCAxMy45NzMgNy45OTEgMTMuMTc1IDE2LjA2NWwtNi41MzMgNjYuMTA4QzMyMC44NDQgMzMyLjgyIDMxNC40NTMgMzM4LjQ4NiAzMDYuOTkgMzM4LjQ4NnpNMzY3LjU2MiAzMTguMDk2Yy0wLjA1IDAtMC4xIDAtMC4xNSAwIC0wLjI5Mi0wLjAwMy0wLjU4Mi0wLjAxMi0wLjg3My0wLjAyMmwtMC4xNTQtMC4wMDRjLTguMTEzIDAtMTQuNjM2LTYuNTc3LTE0LjYzNi0xNC42OTIgMC0yLjQ3OCAwLjYxOS00LjgxMyAxLjcxLTYuODYxbDMuODMtNDAuMjIzYzAuNzctOC4wNzcgNy45MzUtMTMuOTk3IDE2LjAxOC0xMy4yMzMgOC4wNzcgMC43NyAxNC4wMDEgNy45NDEgMTMuMjMzIDE2LjAxOGwtNC4zNTUgNDUuNzJDMzgxLjQ2NiAzMTIuMzQ1IDM3NS4xMjcgMzE4LjA5NiAzNjcuNTYyIDMxOC4wOTZ6TTMyOC44NjcgNDUyLjY2MmMtMy43NiAwLTcuNTIxLTEuNDM0LTEwLjM4OC00LjMwMyAtNS43MzctNS43MzctNS43MzctMTUuMDQgMC0yMC43NzhsNzUuMjU0LTc1LjI1NGM1LjczNy01LjczNyAxNS4wNC01LjczNyAyMC43NzggMCA1LjczNyA1LjczNyA1LjczNyAxNS4wNCAwIDIwLjc3OGwtNzUuMjU0IDc1LjI1NEMzMzYuMzg4IDQ1MS4yMjggMzMyLjYyNyA0NTIuNjYyIDMyOC44NjcgNDUyLjY2MnpNNDA0LjEyMSA0NTIuNjYyYy0zLjc2IDAtNy41MjEtMS40MzQtMTAuMzg5LTQuMzAzbC03NS4yNTQtNzUuMjU0Yy01LjczNy01LjczNy01LjczNy0xNS4wNCAwLTIwLjc3OCA1LjczNy01LjczNyAxNS4wNC01LjczNyAyMC43NzggMGw3NS4yNTQgNzUuMjU0YzUuNzM3IDUuNzM3IDUuNzM3IDE1LjA0IDAgMjAuNzc4QzQxMS42NDEgNDUxLjIyOCA0MDcuODggNDUyLjY2MiA0MDQuMTIxIDQ1Mi42NjJ6XCIgZmlsbD1cIiNCMzQwNEFcIiAvPjxyZWN0IHg9XCI0OC41NDFcIiB5PVwiMTAxLjM2OFwiIHdpZHRoPVwiMzU5LjY5NlwiIGhlaWdodD1cIjc5Ljg5M1wiIGZpbGw9XCIjRjRCMkIwXCIgLz48cGF0aCBkPVwiTTQwOC4yNDIgMTk1Ljk1aC0zNTkuN2MtOC4xMTQgMC0xNC42OTItNi41NzctMTQuNjkyLTE0LjY5MnYtNzkuODljMC04LjExNCA2LjU3Ny0xNC42OTIgMTQuNjkyLTE0LjY5MmgzNTkuN2M4LjExNCAwIDE0LjY5MiA2LjU3NyAxNC42OTIgMTQuNjkydjc5Ljg4OUM0MjIuOTMzIDE4OS4zNzEgNDE2LjM1NiAxOTUuOTUgNDA4LjI0MiAxOTUuOTV6TTYzLjIzMyAxNjYuNTY3SDM5My41NVYxMTYuMDZINjMuMjMzVjE2Ni41Njd6TTIyOC4zOTIgNDI0LjU3N2MtOC4xMTQgMC0xNC42OTItNi41NzctMTQuNjkyLTE0LjY5MlYyNTYuMDAxYzAtOC4xMTQgNi41NzctMTQuNjkyIDE0LjY5Mi0xNC42OTJzMTQuNjkyIDYuNTc3IDE0LjY5MiAxNC42OTJ2MTUzLjg4NUMyNDMuMDg0IDQxOCAyMzYuNTA1IDQyNC41NzcgMjI4LjM5MiA0MjQuNTc3elwiIGZpbGw9XCIjQjM0MDRBXCIgLz48L3N2Zz5cbiAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLW5hbWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZCBuYW1lLWlucHV0ZmllbGRcIiBzdGF0ZT1cImhpZGRlblwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImZpcnN0bmFtZVwiIG5hbWU9XCJmaXJzdG5hbWVcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWV9XCIgcGxhY2Vob2xkZXI9XCJmaXJzdG5hbWVcIiAvPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImxhc3RuYW1lXCIgbmFtZT1cImxhc3RuYW1lXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QubGFzdG5hbWV9XCIgcGxhY2Vob2xkZXI9XCJsYXN0bmFtZVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWlucHV0ZmllbGQgbmFtZS1sYWJlbFwiIHN0YXRlPVwiYWN0aXZlXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlyc3RuYW1lXCI+JHtjdXJyZW50Q29udGFjdC5maXJzdG5hbWV9PC9sYWJlbD4gPGxhYmVsIGZvcj1cImxhc3RuYW1lXCI+JHtjdXJyZW50Q29udGFjdC5sYXN0bmFtZX08L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1mYXZvcml0ZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1jaGVja2JveFwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZmF2LWNoZWNrYm94XCIgbmFtZT1cImZhdm9yaXRlc1wiIGlkPVwiZmF2b3JpdGVzXCIgJHtjdXJyZW50Q29udGFjdC5mYXZvcml0ZXNcbiAgICAgICAgICAgICAgPyBgY2hlY2tlZGBcbiAgICAgICAgICAgICAgOiBgYH0gLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmYXZvcml0ZXNcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIG9uXCI+XG4gICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAzNzYgMzc2XCI+PHN0eWxlPi5he2ZpbGw6ICNDMzkyMTU7fTwvc3R5bGU+PHBhdGggZD1cIk0xODggMTdsNjMgMTAzIDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDYgLTExMSA0NiAxMC0xMjAgLTc4LTkyIDExNy0yOEwxODggMTd6XCIgZmlsbD1cIiNGRkU2M0NcIiAvPjxwYXRoIGQ9XCJNMjI0IDE5NGwtMzYtMTYxIDYzIDg3IDExNyAyOCAtNzggOTIgMTAgMTIwIC0xMTEtNDZMMjI0IDE5NHpcIiBmaWxsPVwiI0ZERDcyRVwiIC8+PHBhdGggZD1cIk0yOTkgMzY3Yy0xIDAtMiAwLTMtMWwtMTA4LTQ1IC0xMDggNDVjLTIgMS02IDEtOC0xIC0yLTItNC00LTMtN2w5LTExNyAtNzYtODljLTItMi0yLTUtMi04IDEtMyAzLTUgNi01bDExNC0yNyA2MS0xMDBjMi0yIDQtNCA3LTRsMCAwYzMgMCA1IDIgNyA0bDYxIDEwMCAxMTQgMjdjMyAxIDUgMyA2IDUgMSAzIDAgNi0yIDhsLTc2IDg5IDkgMTE3YzAgMy0xIDYtMyA3QzMwMiAzNjcgMzAwIDM2NyAyOTkgMzY3ek0xODggMzA1YzEgMCAyIDAgMyAxbDk5IDQxIC04LTEwN2MwLTIgMC00IDItNmw3MC04MiAtMTA0LTI0Yy0yIDAtNC0yLTUtNGwtNTYtOTIgLTU2IDkxYy0xIDItMyAzLTUgNGwtMTA0IDI1IDcwIDgyYzEgMiAyIDQgMiA2bC04IDEwNyA5OS00MUMxODYgMzA1IDE4NiAzMDUgMTg4IDMwNXpNMTI1IDEyMEwxMjUgMTIwIDEyNSAxMjB6XCIgZmlsbD1cIiNDMzkzMTRcIiAvPjxwYXRoIGQ9XCJNODkgMTk2Yy0yIDAtNC0xLTYtM2wtOC0xMGMtMy0zLTItOCAxLTExczgtMiAxMSAxbDggMTBjMyAzIDIgOC0xIDExQzkyIDE5NiA5MSAxOTYgODkgMTk2elwiIGNsYXNzPVwiYVwiIC8+PHBhdGggZD1cIk0xMTggMjg1YzAgMCAwIDAtMSAwIC00IDAtOC00LTctOWwyLTI1YzEtMTQtNC0yNy0xMi0zOGwtMi0zYy0zLTMtMi04IDEtMTEgMy0zIDgtMiAxMSAxbDIgM2MxMiAxNCAxOCAzMiAxNiA1MGwtMiAyNUMxMjYgMjgyIDEyMiAyODUgMTE4IDI4NXpcIiBjbGFzcz1cImFcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBvZmZcIj5cbiAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiPlxuICAgICAgICAgICAgICAgICAgPHN0eWxlPi5he2ZpbGw6ICM5OTk5OTk7fTwvc3R5bGU+XG4gICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTg0Niw3MjVINzI3di0xMTdjMC0xOC0xMy0zMi0zMC0zMmMtMTYsMC0zMCwxNC0zMCwzMnYxMTdINTQ5Yy0xOCwwLTMzLDEzLTMzLDI5czE1LDI5LDMzLDI5aDExOXYxMTdjMCwxOCwxMywzMiwzMCwzMmMxNiwwLDMwLTE0LDMwLTMydi0xMTdoMTE5YzE4LDAsMzMtMTMsMzMtMjlTODY0LDcyNSw4NDYsNzI1eiBNOTc3LDM2MWMtNC0yOS0yNi01MC01NC01NGwtMjUxLTM2Yy0xLTEtMi0yLTMtMmwtMTExLTIyMWMtMTAtMjEtMzAtMzYtNTMtMzhDNDc5LDgsNDU1LDIyLDQ0Myw0NUwzMzEsMjY5Yy0xLDEtMiwyLTMsMkw4MCwzMDdjLTIzLDMtNDQsMTctNTMsMzhjLTEwLDI0LTUsNTIsMTQsNzBMMjIzLDU4OWMxLDEsMSwzLDEsNGwtNDMsMjQ2Yy0zLDE4LDIsMzcsMTQsNTFjMTksMjIsNTIsMjksNzksMTVMNDcxLDgwM2MxNC03LDIwLTI1LDEzLTM5Yy03LTE1LTI2LTIxLTQwLTEzTDI0Niw4NTRjLTIsMS00LDAtNi0xYy0xLTEtMS0yLTEtM2w0My0yNDZjNC0yMC0zLTQxLTE4LTU2TDgzLDM3M2MtMS0xLTItMi0xLTRjMS0zLDMtMyw0LTNMMzM2LDMyOWMyMS0zLDM5LTE2LDQ4LTM0TDQ5Niw3MWMwLTEsMS0yLDQtMmMzLDAsNCwyLDQsMkw2MTYsMjk1YzksMTksMjcsMzEsNDgsMzRsMjUxLDM2YzEsMCwzLDAsNCwzYzEsMy0xLDQtMSw0TDc1Niw1MjdjLTEyLDExLTEyLDMwLTAsNDFjMCwwLDAsMCwxLDFjMTEsMTEsMzAsMTEsNDEsMGwxNTktMTUzQzk3Miw0MDIsOTgwLDM4Miw5NzcsMzYxelwiIGNsYXNzPVwiYVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWJvZHktY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBob25lV29ya1wiPndvcms8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVXb3JrXCIgbmFtZT1cInBob25lV29ya1wiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCIgcGxhY2Vob2xkZXI9XCJhZGQgd29yayBwaG9uZW51bWJlclwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBob25lUHJpdmF0ZVwiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwicGhvbmVQcml2YXRlXCIgbmFtZT1cInBob25lUHJpdmF0ZVwiIHR5cGU9XCJwaG9uZVwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5waG9uZVByaXZhdGV9XCIgcGxhY2Vob2xkZXI9XCJhZGQgcHJpdmF0ZSBwaG9uZW51bWJlciBcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3M9XCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWJvZHlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtbGFiZWxcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFdvcmtcIj53b3JrPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQgY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtaW5wdXRmaWVsZFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiaW5wdXRcIiBpZD1cImVtYWlsV29ya1wiIG5hbWU9XCJlbWFpbFdvcmtcIiB0eXBlPVwiZW1haWxcIiB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuZW1haWxXb3JrfVwiIHBsYWNlaG9sZGVyPVwiYWRkIHdvcmsgZW1haWxhZGRyZXNzIFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1sYWJlbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVtYWlsUHJpdmF0ZVwiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJpbnB1dFwiIGlkPVwiZW1haWxQcml2YXRlXCIgbmFtZT1cImVtYWlsUHJpdmF0ZVwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5lbWFpbFByaXZhdGV9XCIgcGxhY2Vob2xkZXI9XCJhZGQgcHJpdmF0ZSBlbWFpbGFkZHJlc3MgXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1pdGVtIGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiYWRkcmVzc1wiPmhvbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJpbnB1dCB0ZXh0YXJlYVwiIGlkPVwiYWRkcmVzc1wiIG5hbWU9XCJhZGRyZXNzXCIgd3JhcD1cImhhcmRcIiByb3dzPVwiNFwiIHBsYWNlaG9sZGVyPVwiYWRkIGFkZHJlc3MgXCI+JHtjdXJyZW50Q29udGFjdC5hZGRyZXNzfTwvdGV4dGFyZWE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cImNvbnRhY3QtaXRlbSBjb250YWluZXIgaXMtbGFzdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tYm9keS1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0IGNvbnRhaW5lclwiIHZhcmlhbnQ9XCJjb250YWN0LWxhYmVsIHRleHRhcmVhXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibm90ZVwiPm5vdGU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dCBjb250YWluZXJcIiB2YXJpYW50PVwiY29udGFjdC1pbnB1dGZpZWxkXCI+XG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJpbnB1dCB0ZXh0YXJlYVwiIGlkPVwibm90ZVwiIG5hbWU9XCJub3RlXCIgd3JhcD1cImhhcmRcIiByb3dzPVwiNFwiIHBsYWNlaG9sZGVyPVwicGxhY2UgYSBub3RlIFwiPiR7Y3VycmVudENvbnRhY3Qubm90ZX08L3RleHRhcmVhPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICA8L2ZpZWxkc2V0ID5cblxuICAgIDxzZWN0aW9uIGNsYXNzPVwiY29udGFjdC1idXR0b24gY29udGFpbmVyXCIgdmFyaWFudD1cImNvbnRhY3QtYnV0dG9uXCI+XG4gICAgICA8dWwgY2xhc3M9XCJjb250YWN0LWJ1dHRvbiB1bml0XCIgdmFyaWFudD1cImNvbnRhY3Qtc2hvd1wiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1lZGl0XCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgZGF0YS1uYW1lPVwiTGF5ZXIgMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+PHRpdGxlPmljb25zPC90aXRsZT48cGF0aCBkPVwiTTguOTgsNDQuNWwtMS4wMjItLjAzNEEyLjQ3OSwyLjQ3OSwwLDAsMSw2LjM1MSw0Mi45OGwtMC4wNjUtLjE1MiwwLjAwOS0uOTcxTDYuNCw0MS4xNDhjMC4wNzktLjUxNC4xNTktMS4wMjcsMC4yMy0xLjU0MmwwLjMtMi4xODhjMC4yMjEtMS42MzYuNDQyLTMuMjcxLDAuNjgyLTQuOWEyLjQ3NSwyLjQ3NSwwLDAsMSwuNjU4LTEuMjU3QzguODc1LDMwLjYyLDkuNSwzMCwxMC4xMjIsMjkuMzgzbDUuMjExLTUuMjA2cTcuMy03LjMsMTQuNTkyLTE0LjZBNS41MDYsNS41MDYsMCwwLDEsMzIuODY2LDcuOGwwLjE0LS4wMTJMMzQuMTE5LDcuOGE1LjcsNS43LDAsMCwxLDIuOTkyLDEuODczQzM4LjQsMTEsMzkuNzQsMTIuMzM5LDQxLjA4NywxMy42NDhhNS43LDUuNywwLDAsMSwxLjksMy4wMTZMNDMsMTYuODE3bC0wLjAxMiwxLjFhNS41ODcsNS41ODcsMCwwLDEtMS44MjcsMi45OUMzNC40MzYsMjcuNjExLDI3LjI3MywzNC43NiwyMC4xMjIsNDEuOTYzYTQuNTg2LDQuNTg2LDAsMCwxLTIuODg5LDEuMzc4Yy0xLjk5My4yMzgtNC4wMTgsMC41MTgtNS45NzcsMC43OWwtMi4xMTguMjk1Wk04LjMyNSw0Mi44ODRoMC4zYTAuOTYxLDAuOTYxLDAsMCwxLC4xOTMtMC4wNDZsMi4yMTItLjNjMS45NjYtLjI3Myw0LTAuNTU0LDYuMDA2LTAuNzk0YTIuOTkxLDIuOTkxLDAsMCwwLDEuOTM2LS45MTNDMjYuMTMxLDMzLjYyMSwzMy4zLDI2LjQ3LDQwLjAyLDE5Ljc2M0E0LjIxNiw0LjIxNiwwLDAsMCw0MS4zODYsMTcuN1YxNi45YTQuMzg2LDQuMzg2LDAsMCwwLTEuNDIzLTIuMDk0Yy0xLjM1OC0xLjMyLTIuNzA3LTIuNjY5LTQuMDA5LTQuMDFhNC4yMTksNC4yMTksMCwwLDAtMi4wNy0xLjRoLTAuOGE0LjAxNCw0LjAxNCwwLDAsMC0yLjAxNCwxLjMxNXEtNy4yODgsNy4zMTItMTQuNTk0LDE0LjYwN2wtNS4yMTYsNS4yMTFjLTAuNjEyLjYwNy0xLjIyNSwxLjIxNS0xLjgxOSwxLjgzOWEwLjg5NCwwLjg5NCwwLDAsMC0uMjMxLjM3OUM4Ljk2OSwzNC4zNzUsOC43NDksMzYsOC41MjksMzcuNjM0bC0wLjMsMi4xOTJDOC4xNTksNDAuMzUsOC4wNzksNDAuODcyLDgsNDEuMzk0bC0wLjEuNjQ0djAuNDQxQTAuODQxLDAuODQxLDAsMCwwLDguMzI1LDQyLjg4NFpcIiBmaWxsPVwiI2ZmZlwiIC8+PHJlY3QgeD1cIjMwLjc3OVwiIHk9XCIxMi43N1wiIHdpZHRoPVwiMS42MTNcIiBoZWlnaHQ9XCIxMi45MDhcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTQuMjg3IDI4LjE4OCkgcm90YXRlKC00NS4zNTYpXCIgZmlsbD1cIiNmZmZcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgPHNwYW4+ZWRpdDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiZmxleC1hdXRvXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIm1haWx0bzoke2N1cnJlbnRDb250YWN0LmVtYWlsV29ya31cIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICA8c3ZnIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiPjx0aXRsZT5pY29uczwvdGl0bGU+PHBhdGggZD1cIk0xLjUxMywzNi41NjhWMTUuNzIxYTAuOTQ5LDAuOTQ5LDAsMCwwLC4wMjEtMC4xMTQsNC42NDIsNC42NDIsMCwwLDEsLjMwOS0xLjM4Niw1LjMsNS4zLDAsMCwxLDQuOTI5LTMuMzM5cTE4LjIzMywwLjAwNywzNi40NjYsMGE1LjMzLDUuMzMsMCwwLDEsLjc3LjA1MSw1LjE0Nyw1LjE0NywwLDAsMSwyLjc1OCwxLjI4Niw0LjkyOCw0LjkyOCwwLDAsMSwxLjcyMSwzLjhxMCwxMC4xNDksMCwyMC4zYTQuODg3LDQuODg3LDAsMCwxLTEuMzcyLDMuNDA2LDUuMTg5LDUuMTg5LDAsMCwxLTMuODksMS42NzVxLTkuNDM5LDAtMTguODc5LDAtOC43NTQsMC0xNy41MDksMEE1LjcsNS43LDAsMCwxLDUuOSw0MS4zMzFhNS4yLDUuMiwwLDAsMS0zLjEzLTEuNzQyLDQuODc1LDQuODc1LDAsMCwxLTEuMi0yLjU1N0MxLjU1LDM2Ljg3NywxLjUzMywzNi43MjIsMS41MTMsMzYuNTY4Wk0yNSwxMi42NzJxLTkuMDcyLDAtMTguMTQ0LDBhMy40MzUsMy40MzUsMCwwLDAtMS41MTkuMzA4LDMuMjUzLDMuMjUzLDAsMCwwLTIuMDI4LDMuMTE1cTAsMTAuMSwwLDIwLjJhMy4wNzYsMy4wNzYsMCwwLDAsLjg2MiwyLjE4MUEzLjQ3LDMuNDcsMCwwLDAsNi44LDM5LjYwOGgxNS4zcTEwLjU0LDAsMjEuMDgsMGEzLjQxOSwzLjQxOSwwLDAsMCwxLjYxNC0uMzYxQTMuMjM5LDMuMjM5LDAsMCwwLDQ2LjY5NSwzNi4ycTAtMTAuMTEsMC0yMC4yMTlhMy4wNjUsMy4wNjUsMCwwLDAtLjgxMy0yLjEyMiwzLjUwOSwzLjUwOSwwLDAsMC0yLjcxNi0xLjE5MkgyNVpcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk0yNSwzMC41NTNhMC43NTksMC43NTksMCwwLDEtLjU5My0wLjIwOXEtMy40NTUtMi42ODEtNi45MTktNS4zNTEtNi40MTgtNC45NTktMTIuODM0LTkuOTIxYTEuMDMsMS4wMywwLDAsMS0uNDM1LTAuODY3LDAuNTcsMC41NywwLDAsMSwuMDg0LTAuMjk1QTEuMTA4LDEuMTA4LDAsMCwxLDUuMiwxMy40YTAuNiwwLjYsMCwwLDEsLjQuMTM3UTcuMzU4LDE0LjksOS4xMTUsMTYuMjY2TDI0LjUyMiwyOC4yMTdjMC4xMjYsMC4xLjI1NywwLjE5MSwwLjM3NywwLjNhMC4xMzMsMC4xMzMsMCwwLDAsLjIsMHExLjY2Mi0xLjMsMy4zMy0yLjU4N0w0NC4yODEsMTMuNjM2YTIuMDUzLDIuMDUzLDAsMCwxLC4yLTAuMTU1LDAuNjc2LDAuNjc2LDAsMCwxLC41NDgtMC4wNTUsMS4yNDYsMS4yNDYsMCwwLDEsLjYwOC4zOTIsMC42NSwwLjY1LDAsMCwxLC4xMjIuNjM1LDEuMTYzLDEuMTYzLDAsMCwxLS40MTQuNjI1TDI1LjY1MiwzMC4zYTAuODQ2LDAuODQ2LDAsMCwwLS4wODUuMDY2QTAuNjQ4LDAuNjQ4LDAsMCwxLDI1LDMwLjU1M1pcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk04Ljc3MywzNS4wODFhMC45NzQsMC45NzQsMCwwLDEtLjg1OS0wLjUxLDAuNjYsMC42NiwwLDAsMS0uMDI4LTAuNjIxQTEuMjE0LDEuMjE0LDAsMCwxLDguMywzMy4zOTJxMi44MTEtMi4xMDUsNS42Mi00LjIxNGEwLjU4NCwwLjU4NCwwLDAsMCwuMDU0LTAuMDQxLDAuNywwLjcsMCwwLDEsLjg2Ny0wLjEsMS43LDEuNywwLDAsMSwuNDE2LjMsMC42NDEsMC42NDEsMCwwLDEsLjEzNy42OTEsMS4xNjYsMS4xNjYsMCwwLDEtLjQyNC42MDdMOS4zNiwzNC44MzlhMC44MiwwLjgyLDAsMCwxLS4zOTIuMjI1QzguOSwzNS4wNzEsOC44MzgsMzUuMDc2LDguNzczLDM1LjA4MVpcIiBmaWxsPVwiI2ZmZlwiIC8+PHBhdGggZD1cIk00MS4yMDYsMzUuMDc1YTAuNzI5LDAuNzI5LDAsMCwxLS41Mi0wLjJDMzkuODYxLDM0LjI0NSwzOS4wMjksMzMuNjI2LDM4LjIsMzNjLTEuMDY0LS44LTIuMTMyLTEuNTkyLTMuMTkxLTIuNGExLjAzMywxLjAzMywwLDAsMS0uNDMzLTAuODc3LDAuNTQzLDAuNTQzLDAsMCwxLC4xMzctMC4zNTgsMS4xMzcsMS4xMzcsMCwwLDEsLjg2Mi0wLjQzNCwwLjYsMC42LDAsMCwxLC4zNzIuMTI4UTM3LjE4NCwzMCwzOC40MjMsMzAuOTMxYzEuMTA1LDAuODMxLDIuMjE2LDEuNjU1LDMuMzE2LDIuNDkyYTEsMSwwLDAsMSwuNDI1LjkzNSwwLjQ5NCwwLjQ5NCwwLDAsMS0uMDgxLjIyN0EwLjk3NywwLjk3NywwLDAsMSw0MS4yMDYsMzUuMDc1WlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmVtYWlsPC9zcGFuPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxhIGhyZWY9XCJ0ZWw6JHtjdXJyZW50Q29udGFjdC5waG9uZVdvcmt9XCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgPHN2ZyBkYXRhLW5hbWU9XCJMYXllciAxXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj48dGl0bGU+aWNvbnM8L3RpdGxlPjxwYXRoIGQ9XCJNMzYuNDMsNDcuMmE0LjIsNC4yLDAsMCwxLS43MzYtMC4wNjVsLTAuNTQyLS4wOTFjLTAuNS0uMDgzLTEuMDI1LTAuMTY4LTEuNTQzLTAuMzA2YTQ3LjIsNDcuMiwwLDAsMS0xNi40MjMtOC4yQTQyLjk1LDQyLjk1LDAsMCwxLDYuMjMzLDI2LjI2MSw0NC44MTEsNDQuODExLDAsMCwxLDIuMjcsMTcuNDUzTDIuMjI5LDE3LjMzbDAuMDEyLTEuNjM5YTExLjY0MiwxMS42NDIsMCwwLDEsMS40NjQtMy45MzUsMjYuMTQ3LDI2LjE0NywwLDAsMSw1LjUxLTYuNDE1QzkuMzYsNS4yMTQsOS40OTIsNS4xLDkuNjI5LDQuOTg4YTIuNDY3LDIuNDY3LDAsMCwxLDMuNDM2LjE4Niw3Mi42LDcyLjYsMCwwLDEsNi45ODksOC4yNzUsMi4yMSwyLjIxLDAsMCwxLS40MjksMy4wMjIsMjQuNzE0LDI0LjcxNCwwLDAsMC00LjA5Miw0LjE3LDAuNTc3LDAuNTc3LDAsMCwwLS4wNTcuODU2LDM5LjA2NSwzOS4wNjUsMCwwLDAsMTMuMSwxMi4zODhjMC41MzUsMC4zLDEuMTEuNTg5LDEuNzA5LDAuODczLDAuNDY3LDAuMjIyLjUxNCwwLjE2OCwwLjczNy0uMDkxLDAuNzcxLS45LDEuNTA2LTEuODY5LDIuMjE3LTIuODA4bDAuMDgzLS4xMWMwLjI0Ny0uMzI2LjQ3LTAuNjc3LDAuNzA1LTEuMDQ4bDAuMjU4LS40YTIuMzc5LDIuMzc5LDAsMCwxLDMuNDE3LS44YzAuNTQ4LDAuMzMsMS4wODIuNjgzLDEuNjE2LDEuMDM2LDAuMjYsMC4xNzIuNTIsMC4zNDQsMC43ODEsMC41MTNsMS4zNjMsMC44ODJxMi40MjgsMS41NzEsNC44NjUsMy4xM2EzLjA5NCwzLjA5NCwwLDAsMSwxLjM4OCwxLjUxTDQ3Ljc3MSwzNi43djEuMTMzbC0wLjE2My4yODhhMy40NzcsMy40NzcsMCwwLDEtLjE5Mi4zMjIsMjYuNDQ5LDI2LjQ0OSwwLDAsMS03LjQ0NCw3LjRBNi41NTQsNi41NTQsMCwwLDEsMzYuNDMsNDcuMlpNMy44NDMsMTcuMDcxYTQzLjEzNyw0My4xMzcsMCwwLDAsMy43NzgsOC4zNjhBNDEuMzQ1LDQxLjM0NSwwLDAsMCwxOC4xNjYsMzcuMjU5YTQ1LjYsNDUuNiwwLDAsMCwxNS44NjIsNy45MjNjMC40NCwwLjExNy45LDAuMTkzLDEuMzg1LDAuMjcybDAuNTY1LDAuMWMxLjA3NSwwLjE4OSwxLjkzMy0uMywzLjExOS0xLjA2M2EyNC44ODQsMjQuODg0LDAsMCwwLDYuOTkyLTYuOTU5YzAuMDI1LS4wMzcuMDQ4LTAuMDc2LDAuMDY5LTAuMTE1VjM3LjAyYTEuOTMsMS45MywwLDAsMC0uNjkxLTAuNnEtMi40NDUtMS41NTYtNC44NzUtMy4xMzZMMzkuMjI5LDMyLjRjLTAuMjY3LS4xNzItMC41MzEtMC4zNDctMC44LTAuNTIyLTAuNTE1LS4zNC0xLjAzLTAuNjgxLTEuNTU4LTFhMC43ODMsMC43ODMsMCwwLDAtMS4yMzEuM2wtMC4yNDkuMzljLTAuMjQzLjM4My0uNDk0LDAuNzc4LTAuNzgxLDEuMTU3bC0wLjA4NC4xMWMtMC43MjUuOTU4LTEuNDc2LDEuOTQ5LTIuMjc4LDIuODg1YTIsMiwwLDAsMS0yLjY1NC41Yy0wLjYyOC0uMy0xLjIzMy0wLjYwNy0xLjgtMC45MTlhNDAuNjMsNDAuNjMsMCwwLDEtMTMuNjQ4LTEyLjg4LDIuMTUsMi4xNSwwLDAsMSwuMS0yLjc1OSwyNi4zMzUsMjYuMzM1LDAsMCwxLDQuMzU4LTQuNDQzLDAuNjA2LDAuNjA2LDAsMCwwLC4xMzktMC44MTQsNzEuMDY1LDcxLjA2NSwwLDAsMC02LjgzNS04LjA5MywwLjg1OSwwLjg1OSwwLDAsMC0xLjI3NC0uMDY1Yy0wLjEyMS4xLS4yMzcsMC4yLTAuMzUzLDAuM0EyNC42MiwyNC42MiwwLDAsMCw1LjEsMTIuNTc0LDEwLjA2MSwxMC4wNjEsMCwwLDAsMy44NDMsMTUuOXYxLjE3M1pcIiBmaWxsPVwiI2ZmZlwiIC8+PC9zdmc+XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICA8c3Bhbj5jYWxsPC9zcGFuPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8dWwgY2xhc3M9XCJjb250YWN0LWJ1dHRvbiB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtZWRpdFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1zYXZlXCIgdHlwZT1cInN1Ym1pdFwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj5cbiAgICAgICAgICAgICAgICA8dGl0bGU+aWNvbiBjaGVjayAvIHNhdmU8L3RpdGxlPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjIuNTQxLDM5Ljk2N2EwLjgwNywwLjgwNywwLDAsMS0uNjI0LTAuM0w4Ljc4LDIzLjYzYTAuODA3LDAuODA3LDAsMSwxLDEuMjQ4LTEuMDIzTDIyLjQ1OSwzNy43ODdsMTcuNDU3LTI3LjM4YTAuODA3LDAuODA3LDAsMCwxLDEuMzYxLjg2N0wyMy4yMjEsMzkuNTk0YTAuODA3LDAuODA3LDAsMCwxLS42MzMuMzcxWlwiIGZpbGw9XCIjZmZmXCIgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICA8c3Bhbj5zYXZlPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJmbGV4LWF1dG9cIiB2YXJpYW50PVwiaGlkZS1jb250YWN0LWFkZCBzaG93LWNvbnRhY3QtZWRpdFwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGRhdGEtbmFtZT1cIkxheWVyIDFcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+PHRpdGxlPmljb25zPC90aXRsZT48cGF0aCBkPVwiTTMzLjUzNCA0OS4yNzRIMTYuNjA4QTEwLjUgMTAuNSAwIDAgMSA2LjExOSAzOC43ODZWMjUuODk0QTEwLjUgMTAuNSAwIDAgMSAxNi42MDggMTUuNDA2aDIuNjQ3YTAuODA3IDAuODA3IDAgMSAxIDAgMS42MTRIMTYuNjA4YTguODg1IDguODg1IDAgMCAwLTguODc1IDguODc1VjM4Ljc4NmE4Ljg4NSA4Ljg4NSAwIDAgMCA4Ljg3NSA4Ljg3NUgzMy41MzRhOC44ODUgOC44ODUgMCAwIDAgOC44NzUtOC44NzVWMjUuODk0YTguODg1IDguODg1IDAgMCAwLTguODc1LTguODc1aC00LjJhMC44MDcgMC44MDcgMCAwIDEgMC0xLjYxNGg0LjJBMTAuNSAxMC41IDAgMCAxIDQ0LjAyMiAyNS44OTRWMzguNzg2QTEwLjUgMTAuNSAwIDAgMSAzMy41MzQgNDkuMjc0Wk0yNS4xIDMxLjdhMC44MDcgMC44MDcgMCAwIDEtMC44MDctMC44MDdWMS41MzJhMC44MDcgMC44MDcgMCAxIDEgMS42MTQgMHYyOS4zNkEwLjgwNyAwLjgwNyAwIDAgMSAyNS4xIDMxLjdaTTMzLjIxMyAxMC40ODJhMC44IDAuOCAwIDAgMS0wLjU3LTAuMjM2TDI1LjA3MSAyLjY3MyAxNy41IDEwLjI0NkEwLjgwNyAwLjgwNyAwIDEgMSAxNi4zNTggOS4xTDI0LjUgMC45NjJhMC44MyAwLjgzIDAgMCAxIDEuMTQxIDBMMzMuNzg0IDkuMUEwLjgwNyAwLjgwNyAwIDAgMSAzMy4yMTMgMTAuNDgyWlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmV4cG9ydDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIHZhcmlhbnQ9XCJoaWRlLWNvbnRhY3QtYWRkIHNob3ctY29udGFjdC1lZGl0XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1kZWxldGVcIiB0eXBlPVwic3VibWl0XCIgZm9ybWFjdGlvbj1cImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0cy8ke2N1cnJlbnRDb250YWN0LmlkfVwiICB2YWx1ZT1cIiR7Y3VycmVudENvbnRhY3QuaWR9XCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZGF0YS1uYW1lPVwiTGF5ZXIgMVwiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj48dGl0bGU+aWNvbnM8L3RpdGxlPjxsaW5lIHgxPVwiMzcuNTA5XCIgeTE9XCIxMi41MzFcIiB4Mj1cIjEyLjU3MlwiIHkyPVwiMzcuNDY5XCIgZmlsbD1cIiNmZmZcIiAvPjxwYXRoIGQ9XCJNMTIgMzguMDM5QTAuODA3IDAuODA3IDAgMCAxIDEyIDM2LjlMMzYuOTM5IDExLjk2MUEwLjgwNyAwLjgwNyAwIDAgMSAzOC4wOCAxMy4xTDEzLjE0MiAzOC4wMzlBMC44MDcgMC44MDcgMCAwIDEgMTIgMzguMDM5WlwiIGZpbGw9XCIjZmZmXCIgLz48bGluZSB4MT1cIjEyLjU3MlwiIHkxPVwiMTIuNTMxXCIgeDI9XCIzNy41MDlcIiB5Mj1cIjM3LjQ2OVwiIGZpbGw9XCIjZmZmXCIgLz48cGF0aCBkPVwiTTM2LjkzOCAzOC4wMzlMMTIgMTMuMWEwLjgwNyAwLjgwNyAwIDAgMSAxLjE0MS0xLjE0MUwzOC4wNzkgMzYuOUEwLjgwNyAwLjgwNyAwIDEgMSAzNi45MzggMzguMDM5WlwiIGZpbGw9XCIjZmZmXCIgLz48L3N2Zz5cbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgIDxzcGFuPmRlbGV0ZTwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Zvcm0+XG48L2FydGljbGU+YDtcblxuICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gY29udGFjdEl0ZW1XcmFwcGVyO1xuICAgICAgY29uc3QgY29udGVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhY3QtaXRlbS53cmFwcGVyXCIpO1xuICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvbi5idXR0b24tZWRpdFwiKTtcbiAgICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvbi5idXR0b24tZGVsZXRlXCIpO1xuICAgICAgY29uc3QgZm9ybUVsbSA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcihcImZvcm0uY29udGFjdC1mb3JtXCIpO1xuICAgICAgZWRpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWV0aG9kcy5jb250YWN0SXRlbS5lZGl0KTtcbiAgICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWV0aG9kcy5kYXRhLmRlbGV0ZUNvbnRhY3QpO1xuXG4gICAgICBmb3JtRWxtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgbWV0aG9kcy5kYXRhLnNhdmVDb250YWN0KTtcblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSxcbiAgfTtcblxuICBtZXRob2RzLmV2ZW50TGlzdGVuZXIgPSB7XG4gICAgY29udGFjdExpc3RCdXR0b246IGZ1bmN0aW9uKFxuICAgICAgZWxlbWVudE5vZGUsXG4gICAgICBjYWxsRnVuY3Rpb24sXG4gICAgICBsaXN0ZW5lciA9IFwiYWRkXCIsXG4gICAgICB0eXBlID0gXCJjbGlja1wiXG4gICAgKSB7XG4gICAgICBpZiAoZWxlbWVudE5vZGUgJiYgZWxlbWVudE5vZGUubGVuZ3RoID4gMCkge1xuICAgICAgICBPYmplY3Qua2V5cyhlbGVtZW50Tm9kZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXJbbGlzdGVuZXJdKGVsZW1lbnROb2RlW2tleV0sIGNhbGxGdW5jdGlvbiwgdHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbihlbGVtZW50LCBjYWxsRnVuY3Rpb24sIHR5cGUgPSBcImNsaWNrXCIpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsRnVuY3Rpb24pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihlbGVtZW50LCBjYWxsRnVuY3Rpb24sIHR5cGUgPSBcImNsaWNrXCIpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsRnVuY3Rpb24pO1xuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5jb250YWN0SXRlbSA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBsZXQgZm9ybUZpZWxkc2V0ID0gZGF0YS5xdWVyeVNlbGVjdG9yKFwiZmllbGRzZXRcIik7XG4gICAgICBsZXQgZGF0YUVsbSA9IHtcbiAgICAgICAgZWxlbWVudDogZm9ybUZpZWxkc2V0LFxuICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGlzYWJsZWRcIixcbiAgICAgIH07XG4gICAgICBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhRWxtKTtcbiAgICB9LFxuXG4gICAgZWRpdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZm9ybVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcImZpZWxkc2V0XCIpXG4gICAgICAgIC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuc2V0RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0TGlzdEl0ZW1zVW5pdFxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXJCdXR0b24gPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0QnV0dG9uQ29udGFpbmVyXG4gICAgICApO1xuXG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc1NlYXJjaENvbnRhaW5lclxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBzZWxlY3RvcnMuY29udGFjdEl0ZW1Db250YWluZXJcbiAgICApO1xuICAgIGlmIChlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1Vbml0ID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtVW5pdFxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyQnV0dG9uID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RCdXR0b25Db250YWluZXJcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuZWxlbWVudFdpZHRoID0ge1xuICAgIGZpeGVkQ29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgIG1ldGhvZHMuc2V0RWxlbWVudHMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmNvbnRhY3RMaXN0SXRlbXMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lckxpc3RJdGVtcygpO1xuICAgICAgbWV0aG9kcy5lbGVtZW50V2lkdGguYnV0dG9uQ29udGFpbmVySXRlbSgpO1xuICAgIH0sXG4gICAgY29udGFjdExpc3RJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zVW5pdC5zdHlsZS53aWR0aCA9XG4gICAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIuY2xpZW50V2lkdGggKyBcInB4XCI7XG4gICAgfSxcbiAgICBidXR0b25Db250YWluZXJMaXN0SXRlbXM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0KSB7XG4gICAgICAgIGxldCBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoID1cbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zVW5pdC5jbGllbnRXaWR0aDtcbiAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lckJ1dHRvbi5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdExpc3RJdGVtc1VuaXRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1NlYXJjaENvbnRhaW5lci5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdExpc3RJdGVtc1VuaXRXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1dHRvbkNvbnRhaW5lckl0ZW06IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lciAmJlxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lckJ1dHRvblxuICAgICAgKSB7XG4gICAgICAgIGxldCBjb250YWN0SXRlbUNvbnRhaW5lcldpZHRoID1cbiAgICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lci5jbGllbnRXaWR0aDtcblxuICAgICAgICBlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lckJ1dHRvbi5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgY29udGFjdEl0ZW1Db250YWluZXJXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgIHZhciBmb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIGVsZW1lbnRzLndpbmRvdyA9IHdpbmRvdztcbiAgICAgIGVsZW1lbnRzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICAgIGVsZW1lbnRzLnZpZXdwb3J0ID1cbiAgICAgICAgdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgICAgZWxlbWVudHMuY29udGFjdHNDb250YWluZXIgPSBmb3VuZDtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdHNDb250YWluZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG1ldGhvZHMuZWxlbWVudFdpZHRoLmZpeGVkQ29udGFpbmVyKTtcbiAgICAgIGNvbnN0IGJ1dHRvbkFkZENvbnRhY3QgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIi5idXR0b24tYWRkXCJcbiAgICAgICk7XG4gICAgICBidXR0b25BZGRDb250YWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtZXRob2RzLnBhZ2UuYWRkQ29udGFjdCk7XG5cbiAgICAgIC8vIGdldCBhbmQgc2hvdyBjb250YWN0IGxpc3RcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lclxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtQ29udGFpbmVyXG4gICAgICApO1xuXG4gICAgICBlbGVtZW50cy5jb250YWN0SXRlbXNVbml0ID0gZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICBcImNvbnRhY3QtbGlzdC1pdGVtcyB1bml0XCJcbiAgICAgIClbMF07XG5cbiAgICAgIGlmIChlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyKSB7XG4gICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdHNDb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lcikge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgbWV0aG9kcy5lbGVtZW50V2lkdGguZml4ZWRDb250YWluZXIpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG1vdW50OiBtZXRob2RzLm1vdW50LFxuICAgIGluaXQ6IG1ldGhvZHMuaW5pdCxcbiAgICB1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXG4gICAgcmVuZGVyOiBtZXRob2RzLnJlbmRlcixcblxuICAgIHNlbGVjdG9yOiBzZWxlY3RvcnMuY29udGFpbmVyLFxuICB9O1xufSkoKTsiLCJ2YXIgbW9kdWxlcyA9ICh3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9KTtcblxubW9kdWxlc1tcImZpbGUtdXBsb2FkXCJdID0gKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IGVsZW1lbnRzLCBtZXRob2RzLCBzZWxlY3RvcnMsIHN0YXRlLCBjb250YWN0SXRlbXM7XG5cbiAgICBlbGVtZW50cyA9IHt9O1xuICAgIG1ldGhvZHMgPSB7fTtcbiAgICBzZWxlY3RvcnMgPSB7XG4gICAgICAgIHZpZXdwb3J0OiBcImJvZHlcIixcbiAgICAgICAgY29udGFpbmVyOiAnW3ZhcmlhbnQ9XCJmaWxlLXVwbG9hZFwiXScsXG4gICAgfTtcbiAgICBzdGF0ZSA9IHt9O1xuXG4gICAgbWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgICAgIHZpZXdwb3J0ID0gdmlld3BvcnQgfHwgZG9jdW1lbnQ7XG4gICAgICAgIHZhciBmb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICAgICAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgICAgICAgICBlbGVtZW50cy52aWV3cG9ydCA9XG4gICAgICAgICAgICAgICAgdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xuICAgICAgICAgICAgZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lciA9IGZvdW5kO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRzLmZpbGVVcGxvYWRDb250YWluZXIpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGVsZW1lbnRzLmZpbGVVcGxvYWRDb250YWluZXIpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVVcGxvYWQgPSBuZXcgZmlsZVVwbG9hZFNob3dQcmV2aWV1dyhcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lcltrZXldXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgICAgICBpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChlbGVtZW50cy5maWxlVXBsb2FkKSB7fVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcbiAgICAgICAgaW5pdDogbWV0aG9kcy5pbml0LFxuICAgICAgICB1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXG4gICAgICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG4gICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcnMuY29udGFpbmVyLFxuICAgIH07XG59KSgpOyIsInZhciBtb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fTtcbnZhciBtZXRob2RzID0ge307XG5cbm1vZHVsZXNbJ2N1c3RvbS1mb3JtJ10gPSAoZnVuY3Rpb24gKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgZWxlbWVudHMsXG5cdFx0bWV0aG9kcyxcblx0XHRzZWxlY3RvcnMsXG5cdFx0c3RhdGU7XG5cblx0ZWxlbWVudHMgPSB7fTtcblx0bWV0aG9kcyA9IHt9O1xuXHRzZWxlY3RvcnMgPSB7XG5cdFx0J3ZpZXdwb3J0JzogJ2JvZHknLFxuXG5cdFx0J2NvbnRhaW5lcic6ICcuY29udGFpbmVyW3ZhcmlhbnQ9XCJjdXN0b20tZm9ybVwiXScsXG5cblx0XHQnZm9ybUNvbnRhaW5lcic6ICcuY29udGFpbmVyW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm1cIl0nLFxuXHRcdCdmb3JtRWxlbWVudCc6ICdbdmFyaWFudD1cImN1c3RvbS1mb3JtXCJdIGZvcm0nLFxuXHRcdCdmb3JtRnVsbEZvcm0nOiAnW3ZhcmlhbnQ9XCJmdWxsLWZvcm1cIl0nLFxuXG5cdFx0J2Zvcm1CdXR0b24nOiAnLnN1Ym1pdC1idXR0b24nLFxuXG5cdFx0J2RhdGVGaWVsZENvbnRhaW5lcic6ICdbdmFyaWFudD1cImRhdGVcIl0nLFxuXG5cdFx0J3JlcXVpcmVkRmllbGRzJzogJ2lucHV0W2RhdGEtcmVxdWlyZWRdJyxcblx0XHQnZm9ybVBvc3RlZENvbnRhaW5lcic6ICdbdmFyaWFudH49XCJjdXN0b20tZm9ybS1wb3N0ZWRcIl0nLFxuXHRcdCdlcnJvck1lc3NhZ2VDb250YWluZXInOiAnW3ZhcmlhbnR+PVwiZXJyb3ItbWVzc2FnZVwiXSdcblx0fTtcblx0c3RhdGUgPSB7fTtcblxuXHRtZXRob2RzLmh0bWxFbGVtZW50ID0ge1xuXHRcdGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHJldHVybiAoZGF0YS5lbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSkgfHwgZmFsc2UpO1xuXHRcdH0sXG5cdFx0aGFzQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCAnZ2knKTtcblx0XHRcdHJldHVybiByZWdleC50ZXN0KGF0dHJpYnV0ZVZhbHVlKTtcblx0XHR9LFxuXHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XG5cblx0XHRcdGlmICghbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkpIHtcblx0XHRcdFx0aWYgKGF0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdFx0YXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZSArICcgJyArIGRhdGEuYXR0cmlidXRlVmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXR0cmlidXRlVmFsdWUgPSBkYXRhLmF0dHJpYnV0ZVZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGEuZWxlbWVudC5zZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcblx0XHRcdHZhciBoYXNBdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuaGFzQXR0cmlidXRlVmFsdWUoZGF0YSwgYXR0cmlidXRlVmFsdWUpO1xuXHRcdFx0dmFyIHZhbHVlUmVtb3ZlZCA9IGZhbHNlO1xuXHRcdFx0aWYgKGhhc0F0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoZGF0YS5hdHRyaWJ1dGVWYWx1ZSwgJ2dpJyk7XG5cdFx0XHRcdHZhciBuZXdBdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZVZhbHVlLnJlcGxhY2UocmVnZXgsICcnKS50cmltKCk7XG5cdFx0XHRcdGlmIChuZXdBdHRyaWJ1dGVWYWx1ZSkge1xuXHRcdFx0XHRcdGRhdGEuZWxlbWVudC5zZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXksIG5ld0F0dHJpYnV0ZVZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkYXRhLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YWx1ZVJlbW92ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlUmVtb3ZlZDtcblx0XHR9LFxuXHRcdHRvZ2dsZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0ZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEucmVtb3ZlQXR0cmlidXRlVmFsdWU7XG5cdFx0XHR2YXIgdmFsdWVUb2dnbGVkID0gZmFsc2U7XG5cdFx0XHR2YXIgcmVtb3ZlQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXG5cdFx0XHRpZiAocmVtb3ZlQXR0cmlidXRlVmFsdWUpIHtcblx0XHRcdFx0ZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYWRkQXR0cmlidXRlVmFsdWU7XG5cdFx0XHRcdG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoZGF0YSk7XG5cdFx0XHRcdHZhbHVlVG9nZ2xlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWVUb2dnbGVkO1xuXHRcdH0sXG5cdFx0YWRkU3RhdGVWYWx1ZUludmFsaWQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdFx0YXR0cmlidXRlS2V5OiAnc3RhdGUnLFxuXHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZTogJ2ludmFsaWQnXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gbWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcblx0XHR9LFxuXHRcdHJlbW92ZVN0YXRlVmFsdWVJbnZhbGlkOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXG5cdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcblx0XHRcdFx0YXR0cmlidXRlVmFsdWU6ICdpbnZhbGlkJ1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLmZpZWxkRWxlbWVudCA9IHtcblx0XHRmb2N1c091dDogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHR2YXIgZmllbGREYXRhID0ge1xuXHRcdFx0XHRuYW1lOiBldmVudC5jdXJyZW50VGFyZ2V0Lm5hbWUsXG5cdFx0XHRcdHZhbHVlczogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcblx0XHRcdFx0dmFsdWVDaGVjazogZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnZhbHVlQ2hlY2sgfHwgZXZlbnQuY3VycmVudFRhcmdldC50eXBlXG5cdFx0XHR9O1xuXHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IG1ldGhvZHMuZm9ybVZhbGlkYXRpb24uZmllbGRWYWxpZGF0aW9uKGZpZWxkRGF0YSk7XG5cdFx0XHRpZiAodmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yKSB7XG5cdFx0XHRcdG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkU3RhdGVWYWx1ZUludmFsaWQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHR9XG5cdFx0XHRtZXRob2RzLmVycm9yTWVzc2FnZS5zZXRTdGF0ZS5oaWRkZW4oZXZlbnQuY3VycmVudFRhcmdldC5mb3JtKTtcblx0XHR9LFxuXHRcdGZvY3VzSW46IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5yZW1vdmVTdGF0ZVZhbHVlSW52YWxpZChldmVudC5jdXJyZW50VGFyZ2V0KTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5mb3JtID0ge1xuXHRcdGNsaWNrSGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci5pc1N0YXRlSW52YWxpZChldmVudC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdHZhciBmb3JtRGF0YSA9IG1ldGhvZHMuZm9ybS5zZXJpYWxpemUoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHR2YXIgZXJyb3JEYXRhID0gbWV0aG9kcy5mb3JtVmFsaWRhdGlvbi5mb3JtRGF0YShmb3JtRGF0YS5wb3N0RGF0YSk7XG5cblx0XHRcdGlmIChlcnJvckRhdGEgfHwgc3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkKSB7XG5cdFx0XHRcdG1ldGhvZHMuZm9ybS5lcnJvckhhbmRsZXIoZXJyb3JEYXRhLCBldmVudC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdH0gZWxzZSBpZiAoIWVycm9yRGF0YSAmJiAhc3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkKSB7XG5cdFx0XHRcdG1ldGhvZHMuZm9ybS5wb3N0SGFuZGxlcihmb3JtRGF0YSwgZXZlbnQuY3VycmVudFRhcmdldC5hY3Rpb24pO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRwb3N0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm1EYXRhLCBhY3Rpb24pIHtcblx0XHRcdG1ldGhvZHMuc2VuZERhdGEueGhyKCdQT1NUJywgYWN0aW9uLCBmb3JtRGF0YSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgY2FsbGJhY2tKc29uWGhyID0gbWV0aG9kcy5zZW5kRGF0YS5jYWxsYmFjay5zdWNjZXNzKGRhdGEpO1xuXHRcdFx0XHRcdG1ldGhvZHMuZm9ybS5jYWxsYmFja0hhbmRsZXIoY2FsbGJhY2tKc29uWGhyKTtcblx0XHRcdFx0fSk7XG5cdFx0fSxcblxuXG5cdFx0Y2FsbGJhY2tIYW5kbGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0aWYgKGRhdGEuZXJyb3JEYXRhICYmIE9iamVjdC5rZXlzKGRhdGEuZXJyb3JEYXRhKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybVtuYW1lPVwiJyArIGRhdGEuZm9ybU5hbWUgKyAnXCJdJyk7XG5cdFx0XHRcdG1ldGhvZHMuZm9ybS5lcnJvckhhbmRsZXIoZGF0YS5lcnJvckRhdGEsIGZvcm0pO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRhLnN1Y2Nlc0RhdGEpIHtcblx0XHRcdFx0aWYgKGRhdGEuc3VjY2VzRGF0YS5wYWdlICE9PSAnJykge1xuXHRcdFx0XHRcdC8vIGdvIHRvIG5ldyBwYWdlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWV0aG9kcy5mb3JtLnN1Y2Nlc0hhbmRsZXIoZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Lypcblx0XHRcdFx0JChlbGVtZW50cy5ib2R5KS50cmlnZ2VyKG5ldyBqUXVlcnkuRXZlbnQoJ25hdmlnYXRlJywge1xuXHRcdFx0XHRcdHVybDogZGF0YS5zdWNjZXNEYXRhLnBhZ2UsXG5cdFx0XHRcdFx0YW5pbWF0aW9uOiAnYmx1cmluJyxcblx0XHRcdFx0XHR3aW5kb3dOYW1lOiBudWxsLFxuXHRcdFx0XHRcdHRhcmdldDogbnVsbFxuXHRcdFx0XHR9KSk7XG5cdFx0XHRcdCovXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGVycm9ySGFuZGxlcjogZnVuY3Rpb24gKGVycm9yRGF0YSwgZWxlbWVudCkge1xuXHRcdFx0T2JqZWN0LmtleXMoZXJyb3JEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0dmFyIHNlbGVjdG9yID0gZXJyb3JEYXRhW2tleV0uZGF0YS5lbGVtZW50VHlwZSArICdbbmFtZT1cIicgKyBlcnJvckRhdGFba2V5XS5kYXRhLm5hbWUgKyAnXCJdJztcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuXHRcdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LmFkZFN0YXRlVmFsdWVJbnZhbGlkKGlucHV0KTtcblx0XHRcdH0pO1xuXHRcdFx0bWV0aG9kcy5lcnJvck1lc3NhZ2Uuc2V0U3RhdGUuYWN0aXZlKGVsZW1lbnQpO1xuXHRcdH0sXG5cblx0XHRzdWNjZXNIYW5kbGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuXG5cdFx0XHR2YXIgZm9ybVN1Y2NlcyA9IGVsZW1lbnRzLmJvZHkucXVlcnlTZWxlY3RvcignW25hbWUqPVwiJyArIGRhdGEuc3VjY2VzRGF0YS5mb3JtTmFtZSArICdcIl0nKTtcblx0XHRcdHZhciBmb3JtU3VjY2VzQ29udGFpbmVyID0gZm9ybVN1Y2Nlcy5jbG9zZXN0KCdbdmFyaWFudH49XCJjdXN0b20tZm9ybVwiXScpO1xuXG5cdFx0XHR2YXIgZGF0YUZvcm0gPSB7XG5cdFx0XHRcdGVsZW1lbnQ6IGZvcm1TdWNjZXMsXG5cdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcblx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nLFxuXHRcdFx0XHRyZW1vdmVBdHRyaWJ1dGVWYWx1ZTogJ2FjdGl2ZSdcblx0XHRcdH07XG5cblx0XHRcdG1ldGhvZHMuaHRtbEVsZW1lbnQudG9nZ2xlQXR0cmlidXRlVmFsdWUoZGF0YUZvcm0pO1xuXG5cdFx0XHR2YXIgZm9ybVBvc3RlZCA9IGZvcm1TdWNjZXNDb250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZm9ybVBvc3RlZENvbnRhaW5lcik7XG5cblx0XHRcdHZhciBkYXRhUG9zdGVkQ29udGFpbmVyID0ge1xuXHRcdFx0XHRlbGVtZW50OiBmb3JtUG9zdGVkLFxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXG5cdFx0XHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJyxcblx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nXG5cdFx0XHR9O1xuXG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGFQb3N0ZWRDb250YWluZXIpO1xuXHRcdH0sXG5cblx0XHRnZXRWYWx1ZU9mRWxlbWVudDoge1xuXHRcdFx0aW5wdXQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciB2YWx1ZTtcblx0XHRcdFx0aWYgKGVsZW1lbnQudHlwZSAmJiAoZWxlbWVudC50eXBlID09PSAncmFkaW8nIHx8IGVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94JykpIHtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5jaGVja2VkKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQudmFsdWUudHJpbSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50LnR5cGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQudmFsdWUudHJpbSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH0sXG5cblx0XHRcdHRleHRhcmVhOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC52YWx1ZS50cmltKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRcdHZhciB2YWx1ZTtcblx0XHRcdFx0aWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUgPT09ICdzZWxlY3Qtb25lJykge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LnZhbHVlKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBbXTtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSAmJiBlbGVtZW50Lm9wdGlvbnMpIHtcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGVsZW1lbnQub3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uS2V5KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChlbGVtZW50Lm9wdGlvbnNbb3B0aW9uS2V5XS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLnB1c2goZWxlbWVudC5vcHRpb25zW29wdGlvbktleV0udmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRzZXJpYWxpemU6IGZ1bmN0aW9uIChmb3JtKSB7XG5cdFx0XHR2YXIgZm9ybURhdGEgPSB7XG5cdFx0XHRcdGZvcm1OYW1lOiBmb3JtLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IG51bGwsXG5cdFx0XHRcdGFjdGlvbjogZm9ybS5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpIHx8IG51bGwsXG5cdFx0XHRcdHBvc3REYXRhOiB7fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9ybURhdGEucG9zdERhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmb3JtLmVsZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIGl0ZW0pIHtcblx0XHRcdFx0aWYgKGl0ZW0gJiYgaXRlbS5uYW1lKSB7XG5cdFx0XHRcdFx0aWYgKCFkYXRhW2l0ZW0ubmFtZV0pIHtcblx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXSA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogaXRlbS50eXBlLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBpdGVtLm5hbWUsXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRUeXBlOiBpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVkOiBpdGVtLmRhdGFzZXQucmVxdWlyZWQgPT09ICd0cnVlJyxcblx0XHRcdFx0XHRcdFx0dmFsdWVDaGVjazogaXRlbS5kYXRhc2V0LnZhbHVlQ2hlY2sgfHwgaXRlbS50eXBlLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZUtleTogaXRlbS5kYXRhc2V0LnZhbHVlS2V5IHx8IDAsXG5cdFx0XHRcdFx0XHRcdHZhbHVlczogW11cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5ID09PSBcIm51bWJlclwiICYmIGlzRmluaXRlKGRhdGFbaXRlbS5uYW1lXS52YWx1ZUtleSkgJiYgTWF0aC5mbG9vcihkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpID09PSBkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpIHtcblx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZUtleSsrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlb2YgbWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGlmIChtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKSAmJiBpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnICYmIGl0ZW0udHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZScpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlcyA9IG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5kYXRhc2V0LnZhbHVlS2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlc1tpdGVtLmRhdGFzZXQudmFsdWVLZXldID0gbWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlcy5wdXNoKG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIHt9KTtcblx0XHRcdHJldHVybiBmb3JtRGF0YTtcblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5mb3JtVmFsaWRhdGlvbiA9IHtcblx0XHRmb3JtRGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZhciBlcnJvckRhdGEgPSB7fTtcblx0XHRcdE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRpZiAoZGF0YVtrZXldLnJlcXVpcmVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0dmFyIGZpZWxkRGF0YSA9IHtcblx0XHRcdFx0XHRcdG5hbWU6IGRhdGFba2V5XSxcblx0XHRcdFx0XHRcdHZhbHVlczogZGF0YVtrZXldLnZhbHVlc1swXSxcblx0XHRcdFx0XHRcdHZhbHVlQ2hlY2s6IGRhdGFba2V5XS52YWx1ZUNoZWNrXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR2YXIgdmFsaWRhdGlvblJlc3BvbnNlID0gbWV0aG9kcy5mb3JtVmFsaWRhdGlvbi5maWVsZFZhbGlkYXRpb24oZmllbGREYXRhKTtcblx0XHRcdFx0XHRpZiAodmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yKSB7XG5cdFx0XHRcdFx0XHRlcnJvckRhdGFba2V5XSA9IHtcblx0XHRcdFx0XHRcdFx0ZGF0YTogZGF0YVtrZXldLFxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiB2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gKE9iamVjdC5rZXlzKGVycm9yRGF0YSkubGVuZ3RoID4gMCA/IGVycm9yRGF0YSA6IGZhbHNlKTtcblx0XHR9LFxuXG5cdFx0ZmllbGRWYWxpZGF0aW9uOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IHtcblx0XHRcdFx0aGFzRXJyb3I6IGZhbHNlLFxuXHRcdFx0XHRlcnJvck1lc3NhZ2U6IG51bGxcblx0XHRcdH07XG5cblx0XHRcdGlmICghbWV0aG9kcy5mb3JtVmFsaWRhdGlvbi52YWxpZGF0aW9uVHlwZS5pc05vdEVtcHR5KGRhdGEudmFsdWVzKSkge1xuXHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuaGFzRXJyb3IgPSB0cnVlO1xuXHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlID0gZGF0YS5uYW1lICsgJyBmaWVsZCBpcyBlbXB0eSc7XG5cdFx0XHR9IGVsc2UgaWYgKG1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuaXNOb3RFbXB0eShkYXRhLnZhbHVlcykgJiYgdHlwZW9mIG1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGVbZGF0YS52YWx1ZUNoZWNrXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRpZiAoIW1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGVbZGF0YS52YWx1ZUNoZWNrXShkYXRhLnZhbHVlcykpIHtcblx0XHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuaGFzRXJyb3IgPSB0cnVlO1xuXHRcdFx0XHRcdHZhbGlkYXRpb25SZXNwb25zZS5lcnJvck1lc3NhZ2UgPSBkYXRhLm5hbWUgKyAnIGZpZWxkIGlzIG5vdCBjb3JyZWN0IGZpbGxlZCc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWxpZGF0aW9uUmVzcG9uc2U7XG5cdFx0fSxcblxuXHRcdHZhbGlkYXRpb25UeXBlOiB7XG5cdFx0XHRpc05vdEVtcHR5OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHZhbHVlSXNOb3RFbXB0eSA9IHRydWU7XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkgfHwgdmFsdWUubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHZhbHVlSXNOb3RFbXB0eSA9IHRydWU7XG5cdFx0XHRcdFx0dmFsdWVJc05vdEVtcHR5ID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdmFsdWVJc05vdEVtcHR5O1xuXHRcdFx0fSxcblxuXHRcdFx0dGV4dDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblxuXHRcdFx0bnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXlxcZCskLztcblx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhbHBoYWJldGljOiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXlxcZCskLztcblx0XHRcdFx0cmV0dXJuICFwYXR0ZXJuLnRlc3QodmFsdWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0ZW1haWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcGF0dGVybiA9IC9eKFtcXHctXSsoPzpcXC5bXFx3LV0rKSopQCgoPzpbXFx3LV0rXFwuKSpcXHdbXFx3LV17MCw2Nn0pXFwuKFthLXpdezIsNn0oPzpcXC5bYS16XXsyfSk/KSQvaTtcblxuXHRcdFx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KHZhbHVlKTtcblx0XHRcdH0sXG5cblx0XHRcdHRlbDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gL14oPzpcXCtcXGR7MSwzfXwwXFxkezEsM318MDBcXGR7MSwyfSk/KD86XFxzP1xcKFxcZCtcXCkpPyg/OlstXFwvXFxzLl18XFxkKSskLztcblx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG5cdFx0XHR9LFxuXG5cdFx0XHRkYXRlRnV0dXJlOiBmdW5jdGlvbiAoZGF0ZSkge1xuXHRcdFx0XHRkYXRlLmRheSA9IHBhcnNlSW50KGRhdGUuZGF5LCAxMCk7XG5cdFx0XHRcdGRhdGUubW9udGggPSBwYXJzZUludChkYXRlLm1vbnRoLCAxMCkgLSAxO1xuXHRcdFx0XHRkYXRlLnllYXIgPSBwYXJzZUludChkYXRlLnllYXIsIDEwKSArIDIwMDA7XG5cblx0XHRcdFx0dmFyIHRlbXAgPSBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KTtcblx0XHRcdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cblx0XHRcdFx0aWYgKG5vdyA8IHRlbXAgJiYgdGVtcC5nZXREYXRlKCkgPT09IGRhdGUuZGF5ICYmIHRlbXAuZ2V0TW9udGgoKSA9PT0gZGF0ZS5tb250aCAmJiB0ZW1wLmdldEZ1bGxZZWFyKCkgPT09IGRhdGUueWVhcikge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMuc2VuZERhdGEgPSB7XG5cdFx0eGhyOiBmdW5jdGlvbiAobWV0aG9kLCB1cmwsIGRhdGEpIHtcblx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG5cdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRcdHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCk7XG5cdFx0XHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG5cdFx0XHRcdHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cdFx0XHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJlcXVlc3QucmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QocmVxdWVzdC5zdGF0dXNUZXh0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZWplY3QocmVxdWVzdC5zdGF0dXNUZXh0KTtcblx0XHRcdFx0fTtcblxuXG5cdFx0XHRcdHZhciByZXNwb25zZURhdGEgPSB7XG5cdFx0XHRcdFx0c3VjY2VzRGF0YToge1xuXHRcdFx0XHRcdFx0cGFnZTogJycsXG5cdFx0XHRcdFx0XHRmb3JtTmFtZTogZGF0YS5mb3JtTmFtZSxcblx0XHRcdFx0XHRcdHJlc3BvbnNlVHh0OiAnQmVkYW5rdCB2b29yIGhldCBpbnZ1bGxlbi4nXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlc3BvbnNlRGF0YSA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlRGF0YSk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2VEYXRhKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0fSxcblx0XHRjYWxsYmFjazoge1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihkYXRhKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0bWV0aG9kcy5lcnJvck1lc3NhZ2UgPSB7XG5cdFx0c2V0U3RhdGU6IHtcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5lcnJvck1lc3NhZ2VDb250YWluZXIpLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcblx0XHRcdFx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogJ2hpZGRlbicsXG5cdFx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdhY3RpdmUnXG5cdFx0XHRcdH07XG5cdFx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnRvZ2dsZVN0YXRlKGRhdGEpO1xuXHRcdFx0fSxcblx0XHRcdGFjdGl2ZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5lcnJvck1lc3NhZ2VDb250YWluZXIpLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcblx0XHRcdFx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogJ2FjdGl2ZScsXG5cdFx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bWV0aG9kcy5lcnJvck1lc3NhZ2UudG9nZ2xlU3RhdGUoZGF0YSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRTdGF0ZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmVycm9yTWVzc2FnZUNvbnRhaW5lcikuZ2V0QXR0cmlidXRlKCdzdGF0ZScpO1xuXHRcdH0sXG5cdFx0dG9nZ2xlU3RhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xuXHRcdH1cblx0fTtcblxuXG5cdG1ldGhvZHMuZGF0ZVNlbGVjdG9yID0ge1xuXHRcdGZ1bGxDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdHZhciBkYXRlID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IuY29udmVydEZ1bGxUb1NlcGVyYXRlZChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZS52YWx1ZSk7XG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkudmFsdWUgPSBkYXRlLmRheTtcblx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoLnZhbHVlID0gZGF0ZS5tb250aDtcblx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvclllYXIudmFsdWUgPSBkYXRlLnllYXIudG9TdHJpbmcoKS5zbGljZSgtMik7XG5cdFx0fSxcblxuXHRcdGNoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0dmFyIGVsZW1lbnQ7XG5cblx0XHRcdC8vIGNhbmNlbCBrZXl1cC1ldmVudCBpZiBrZXkgd2FzIG5vdCBhIG51bWJlciBvciBUQUIgb3IgRU5URVJcblx0XHRcdGlmIChtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0S2V5VXBFdmVudChldmVudCkpIHtcblx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IudGVzdFZhbHVlcygpO1xuXHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci5hcHBseVN0YXRlKCk7XG5cblx0XHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgfHwgZXZlbnQudHlwZSA9PT0gJ2tleWRvd24nKSB7XG5cdFx0XHRcdFx0ZWxlbWVudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRcdFx0aWYgKChlbGVtZW50LnZhbHVlLmxlbmd0aCA+PSBtZXRob2RzLmRhdGVTZWxlY3Rvci5tYXhJbnB1dExlbmd0aChlbGVtZW50KSkgJiYgKGV2ZW50LmtleUNvZGUgIT09IDE2KSAmJiAoZXZlbnQua2V5Q29kZSAhPT0gOSkgJiYgKGV2ZW50LmtleUNvZGUgIT09IDgpKSB7XG5cdFx0XHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci5qdW1wVG9OZXh0SW5wdXQoZWxlbWVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyB0aGlzIGlzIGEga2V5ZG93biBiZWluZyBjYW5jZWxsZWQsIHRodXMgbm8ga2V5dXAgb2NjdXJzIG9uIHRoaXMgJ2NoYW5nZSdcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHRlc3RWYWx1ZXM6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0c3RhdGUuYWdlID0ge1xuXHRcdFx0XHRkYXk6IGVsZW1lbnRzLmRhdGVTZWxlY3RvckRheS52YWx1ZSxcblx0XHRcdFx0bW9udGg6IGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoLnZhbHVlLFxuXHRcdFx0XHR5ZWFyOiBlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyLnZhbHVlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoc3RhdGUuYWdlLmRheSAmJiBzdGF0ZS5hZ2UubW9udGggJiYgc3RhdGUuYWdlLnllYXIpIHtcblx0XHRcdFx0aWYgKG1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuZGF0ZUZ1dHVyZShzdGF0ZS5hZ2UpKSB7XG5cdFx0XHRcdFx0c3RhdGUuYWdlU3RhdGUgPSAndmFsaWQnO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ2ludmFsaWQnO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHN0YXRlLmFnZS5kYXkgfHwgc3RhdGUuYWdlLm1vbnRoIHx8IHN0YXRlLmFnZS55ZWFyKSB7XG5cdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ3Byb2dyZXNzJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ2luaXRpYWwnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKHN0YXRlLmFnZVN0YXRlID09PSAndmFsaWQnKTtcblx0XHR9LFxuXG5cdFx0dGVzdEZ1bGxEYXRlU3VwcG9ydDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZS50eXBlID09PSAnZGF0ZScpO1xuXHRcdH0sXG5cblx0XHR0ZXN0S2V5VXBFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHR2YXIgaXNLZXlVcCA9IChldmVudC50eXBlID09PSAna2V5ZG93bicpO1xuXHRcdFx0dmFyIGlzVGFiID0gKGV2ZW50LmtleUNvZGUgPT09IDkpO1xuXHRcdFx0dmFyIGlzRW50ZXIgPSAoZXZlbnQua2V5Q29kZSA9PT0gMTMpO1xuXHRcdFx0dmFyIGlzQmFja3NwYWNlID0gKGV2ZW50LmtleUNvZGUgPT09IDgpO1xuXHRcdFx0dmFyIGlzRGVsZXRlID0gKGV2ZW50LmtleUNvZGUgPT09IDQ2KTtcblx0XHRcdHZhciBpc051bWVyaWMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpLm1hdGNoKC9bMC05XS8pO1xuXHRcdFx0dmFyIGlzTnVtcGFkID0gKGV2ZW50LmtleUNvZGUgPj0gOTYpICYmIChldmVudC5rZXlDb2RlIDw9IDEwNSk7XG5cdFx0XHR2YXIgaXNOdW1BbmRyb2lkID0gKGV2ZW50LmtleUNvZGUgPT09IDIyOSk7XG5cblx0XHRcdGlmICghaXNLZXlVcCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGlzS2V5VXAgJiYgKGlzVGFiIHx8IGlzRW50ZXIgfHwgaXNOdW1lcmljIHx8IGlzQmFja3NwYWNlIHx8IGlzRGVsZXRlIHx8IGlzTnVtcGFkIHx8IGlzTnVtQW5kcm9pZCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNvbnZlcnRGdWxsVG9TZXBlcmF0ZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkYXk6IHZhbHVlLmdldERhdGUoKSxcblx0XHRcdFx0bW9udGg6IHZhbHVlLmdldE1vbnRoKCkgKyAxLFxuXHRcdFx0XHR5ZWFyOiB2YWx1ZS5nZXRGdWxsWWVhcigpXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRjaGVja0lucHV0TGVuZ3RoOiBmdW5jdGlvbiAoY3VycmVudEVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBjdXJyZW50RWxlbWVudC52YWx1ZS5sZW5ndGg7XG5cdFx0fSxcblxuXHRcdG1heElucHV0TGVuZ3RoOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKTtcblx0XHR9LFxuXG5cdFx0bmV4dElucHV0OiBmdW5jdGlvbiAoY3VycmVudEVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBjdXJyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV4dGZpZWxkJyk7XG5cdFx0fSxcblxuXHRcdGp1bXBUb05leHRJbnB1dDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHR2YXIgbmV4dElucHV0RGF0YSA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLm5leHRJbnB1dChjdXJyZW50RWxlbWVudCkgfHwgdW5kZWZpbmVkO1xuXHRcdFx0dmFyIGVsZW1lbnRUb0ZvY3VzID0gbmV4dElucHV0RGF0YSA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRJbnB1dERhdGEpIDogdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAobmV4dElucHV0RGF0YSAmJiBlbGVtZW50VG9Gb2N1cykge1xuXHRcdFx0XHRlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRkYXRlSW5wdXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0XHR2YXIgY3VycmVudCA9IG9wdGlvbnMuY3VycmVudDtcblx0XHRcdHZhciBjdXJyZW50S2V5Q29kZSA9IG9wdGlvbnMua2V5Q29kZTtcblx0XHRcdHZhciBpbnB1dExlbmd0aCA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoZWNrSW5wdXRMZW5ndGgoY3VycmVudCk7XG5cdFx0XHR2YXIgbWF4SW5wdXRMZW5ndGggPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5tYXhJbnB1dExlbmd0aChjdXJyZW50KTtcblxuXHRcdFx0aWYgKChpbnB1dExlbmd0aCA9PT0gbWF4SW5wdXRMZW5ndGgpICYmIChjdXJyZW50S2V5Q29kZSAhPT0gMTYpICYmIChjdXJyZW50S2V5Q29kZSAhPT0gOSkpIHtcblx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuanVtcFRvTmV4dElucHV0KGN1cnJlbnQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRhcHBseVN0YXRlOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0XHRcdGlmIChpbnB1dCkge1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIuc2V0QXR0cmlidXRlKCdzdGF0ZScsIGlucHV0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnRlc3RWYWx1ZXMoKTtcblxuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIuc2V0QXR0cmlidXRlKCdzdGF0ZScsIHN0YXRlLmFnZVN0YXRlKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Z2V0Q29udGFpbmVyOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuZGF0ZUZpZWxkQ29udGFpbmVyKSB8fCBmYWxzZTtcblx0XHR9LFxuXG5cdFx0aXNTdGF0ZUludmFsaWQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHR2YXIgZGF0ZUNvbnRhaW5lcnMgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5nZXRDb250YWluZXIoZWxlbWVudCk7XG5cdFx0XHRzdGF0ZS5jb250YWluZXJWYXJpYW50RGF0ZUludmFsaWQgPSBmYWxzZTtcblx0XHRcdGlmIChkYXRlQ29udGFpbmVycykge1xuXHRcdFx0XHRbXS5zbGljZS5jYWxsKGRhdGVDb250YWluZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uZ2V0QXR0cmlidXRlKCdzdGF0ZScpICE9PSAndmFsaWQnKSB7XG5cdFx0XHRcdFx0XHRzdGF0ZS5jb250YWluZXJWYXJpYW50RGF0ZUludmFsaWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XG5cdFx0dmlld3BvcnQgPSB2aWV3cG9ydCB8fCBkb2N1bWVudDtcblx0XHR2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG5cdFx0aWYgKGZvdW5kKSB7XG5cdFx0XHRlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG5cdFx0XHRlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXHRcdFx0ZWxlbWVudHMudmlld3BvcnQgPSB2aWV3cG9ydCB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy52aWV3cG9ydCk7XG5cdFx0XHRlbGVtZW50cy5mb3JtQ29udGFpbmVyID0gZm91bmQ7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLmluaXQgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcblx0XHRpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuXHRcdFx0ZWxlbWVudHMuZm9ybUVsZW1lbnQgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmZvcm1FbGVtZW50KSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRlbGVtZW50cy5yZXF1aXJlZEZpZWxkcyA9IGVsZW1lbnRzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMucmVxdWlyZWRGaWVsZHMpIHx8IHVuZGVmaW5lZDtcblx0XHRcdGVsZW1lbnRzLnBvc3RlZENvbnRhaW5lcnMgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmZvcm1Qb3N0ZWRDb250YWluZXIpIHx8IHVuZGVmaW5lZDtcblx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lciA9IGVsZW1lbnRzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwiZGF0ZVwiXScpO1xuXG5cdFx0XHRpZiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyKSB7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckRheSA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdmFyaWFudH49XCJkYXlcIl0nKTtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yTW9udGggPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwibW9udGhcIl0nKTtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhciA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdmFyaWFudH49XCJ5ZWFyXCJdJyk7XG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckZ1bGxEYXRlID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cImZ1bGxcIl0nKTtcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t2YXJpYW50fj1cImRhdGVzZWxlY3RvclwiXScpO1xuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JBbGxGaWVsZHMgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmlucHV0Jyk7XG5cdFx0XHRcdHN0YXRlLmZ1bGxEYXRlU3VwcG9ydCA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnRlc3RGdWxsRGF0ZVN1cHBvcnQoKTtcblxuXHRcdFx0XHRzdGF0ZS5pc01vYmlsZSA9IChlbGVtZW50cy53aW5kb3cuaW5uZXJXaWR0aCA8IDcwMCk7XG5cdFx0XHRcdGlmIChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSAmJiBzdGF0ZS5mdWxsRGF0ZVN1cHBvcnQgJiYgc3RhdGUuaXNNb2JpbGUpIHtcblxuXHRcdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckZ1bGxEYXRlLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCAnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZGF0ZVNlbGVjdG9yID0gW2VsZW1lbnRzLmRhdGVTZWxlY3RvckRheSwgZWxlbWVudHMuZGF0ZVNlbGVjdG9yTW9udGgsIGVsZW1lbnRzLmRhdGVTZWxlY3RvclllYXJdO1xuXG5cdFx0XHRcdE9iamVjdC5rZXlzKGRhdGVTZWxlY3RvcikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0ZGF0ZVNlbGVjdG9yW2tleV0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xuXHRcdFx0XHRcdGRhdGVTZWxlY3RvcltrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgbWV0aG9kcy5kYXRlU2VsZWN0b3IuY2hhbmdlSGFuZGxlcik7XG5cdFx0XHRcdFx0ZGF0ZVNlbGVjdG9yW2tleV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgbWV0aG9kcy5kYXRlU2VsZWN0b3IuY2hhbmdlSGFuZGxlcik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRPYmplY3Qua2V5cyhlbGVtZW50cy5mb3JtRWxlbWVudCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGVsZW1lbnRzLmZvcm1FbGVtZW50W2tleV0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgbWV0aG9kcy5mb3JtLmNsaWNrSGFuZGxlcik7XG5cdFx0XHR9KTtcblxuXHRcdFx0T2JqZWN0LmtleXMoZWxlbWVudHMucmVxdWlyZWRGaWVsZHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRlbGVtZW50cy5yZXF1aXJlZEZpZWxkc1trZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBtZXRob2RzLmZpZWxkRWxlbWVudC5mb2N1c0luKTtcblx0XHRcdFx0ZWxlbWVudHMucmVxdWlyZWRGaWVsZHNba2V5XS5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG1ldGhvZHMuZmllbGRFbGVtZW50LmZvY3VzT3V0KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRtZXRob2RzLnJlbmRlciA9IGZ1bmN0aW9uICh2aWV3cG9ydCkge1xuXHRcdGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9O1xuXG5cdG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuXHRcdFx0JChlbGVtZW50cy5mb3JtRWxlbWVudCkub2ZmKCdzdWJtaXQnLCBtZXRob2RzLmZvcm0uY2xpY2tIYW5kbGVyKTtcblx0XHRcdCQoZWxlbWVudHMuZGF0ZVNlbGVjdG9yQWxsRmllbGRzKS5vbignY2xpY2snLCBtZXRob2RzLmRhdGVTZWxlY3Rvci5zZXRGb2N1cyk7XG5cdFx0XHQkKGVsZW1lbnRzLmRhdGVTZWxlY3RvckZ1bGxEYXRlKS5vbignY2hhbmdlJywgbWV0aG9kcy5kYXRlU2VsZWN0b3IuZnVsbENoYW5nZUhhbmRsZXIpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdG1vdW50OiBtZXRob2RzLm1vdW50LFxuXHRcdGluaXQ6IG1ldGhvZHMuaW5pdCxcblx0XHR1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXG5cdFx0cmVuZGVyOiBtZXRob2RzLnJlbmRlcixcblxuXHRcdHNlbGVjdG9yOiBzZWxlY3RvcnMuY29udGFpbmVyXG5cdH07XG59KCkpO1xuIiwibWV0aG9kcy5tb2R1bGVzID0ge1xyXG5cdCdpbml0QWxsJzogZnVuY3Rpb24gKHZpZXdwb3J0KSB7XHJcblx0XHRPYmplY3Qua2V5cyhtb2R1bGVzKS5mb3JFYWNoKCBmdW5jdGlvbiAobW9kdWxlTmFtZSwga2V5KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0aWYgKG1vZHVsZXNbbW9kdWxlTmFtZV0uaW5pdCkge1xyXG5cdFx0XHRcdFx0dmFyIGV4aXN0ZWQgPSBtb2R1bGVzW21vZHVsZU5hbWVdLmluaXQodmlld3BvcnQpO1xyXG5cdFx0XHRcdFx0aWYgKGV4aXN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKCdpbml0aWFsaXNlZCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLndhcm4oJ2ZhaWxlZCB0byBpbml0IG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0J21vdW50QWxsJzogZnVuY3Rpb24gKHZpZXdwb3J0KSB7XHJcblx0XHRPYmplY3Qua2V5cyhtb2R1bGVzKS5mb3JFYWNoKCBmdW5jdGlvbiAobW9kdWxlTmFtZSwga2V5KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0aWYgKG1vZHVsZXNbbW9kdWxlTmFtZV0ubW91bnQpIHtcclxuXHRcdFx0XHRcdHZhciBleGlzdGVkID0gbW9kdWxlc1ttb2R1bGVOYW1lXS5tb3VudCh2aWV3cG9ydCk7XHJcblx0XHRcdFx0XHRpZiAoZXhpc3RlZCkge1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUuaW5mbygnbW91bnRlZCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLndhcm4oJ2ZhaWxlZCB0byBtb3VudCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdCd1bm1vdW50QWxsJzogZnVuY3Rpb24gKCkge1xyXG5cdFx0T2JqZWN0LmtleXMobW9kdWxlcykuZm9yRWFjaCggZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRtb2R1bGVzW21vZHVsZU5hbWVdLnVubW91bnQoKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUud2FybignZmFpbGVkIHRvIHVubW91bnQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdCdyZW5kZXJBbGwnOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRPYmplY3Qua2V5cyhtb2R1bGVzKS5mb3JFYWNoKCBmdW5jdGlvbiAobW9kdWxlTmFtZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdG1vZHVsZXNbbW9kdWxlTmFtZV0ucmVuZGVyKCk7XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0Ly9jb25zb2xlLndhcm4oJ2ZhaWxlZCB0byBSZW5kZXIgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07IiwidmFyIG1vZHVsZXMgPSAod2luZG93Lm1vZHVsZXMgPSB3aW5kb3cubW9kdWxlcyB8fCB7fSk7XHJcblxyXG5tb2R1bGVzW1wiZ2VuZXJhbFwiXSA9IChmdW5jdGlvbigpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgdmFyIGVsZW1lbnRzLCBtZXRob2RzLCBhY2Nlc3NpYmlsaXR5O1xyXG5cclxuICBlbGVtZW50cyA9IHt9O1xyXG4gIG1ldGhvZHMgPSB7fTtcclxuXHJcbiAgbWV0aG9kcy5odG1sRWxlbWVudCA9IHtcclxuICAgIGdldEF0dHJpYnV0ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBpZiAoZGF0YS5lbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuZWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXkpIHx8IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGFzQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgIGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoZGF0YS5hdHRyaWJ1dGVWYWx1ZSwgXCJnaVwiKTtcclxuICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QoYXR0cmlidXRlVmFsdWUpO1xyXG4gICAgfSxcclxuICAgIGFkZEF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xyXG5cclxuICAgICAgaWYgKCFtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0F0dHJpYnV0ZVZhbHVlKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKSkge1xyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZSArIFwiIFwiICsgZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBkYXRhLmF0dHJpYnV0ZVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLmVsZW1lbnQuc2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XHJcbiAgICAgIHZhciBoYXNBdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuaGFzQXR0cmlidXRlVmFsdWUoXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZVxyXG4gICAgICApO1xyXG4gICAgICB2YXIgdmFsdWVSZW1vdmVkID0gZmFsc2U7XHJcbiAgICAgIGlmIChoYXNBdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoZGF0YS5hdHRyaWJ1dGVWYWx1ZSwgXCJnaVwiKTtcclxuICAgICAgICB2YXIgbmV3QXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZS5yZXBsYWNlKHJlZ2V4LCBcIlwiKS50cmltKCk7XHJcbiAgICAgICAgaWYgKG5ld0F0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgICAgICBkYXRhLmVsZW1lbnQuc2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5LCBuZXdBdHRyaWJ1dGVWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGEuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWx1ZVJlbW92ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZVJlbW92ZWQ7XHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEucmVtb3ZlQXR0cmlidXRlVmFsdWU7XHJcbiAgICAgIHZhciB2YWx1ZVRvZ2dsZWQgPSBmYWxzZTtcclxuICAgICAgdmFyIHJlbW92ZUF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcclxuXHJcbiAgICAgIGlmIChyZW1vdmVBdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgIGRhdGEuYXR0cmlidXRlVmFsdWUgPSBkYXRhLmFkZEF0dHJpYnV0ZVZhbHVlO1xyXG4gICAgICAgIG1ldGhvZHMuaHRtbEVsZW1lbnQuYWRkQXR0cmlidXRlVmFsdWUoZGF0YSk7XHJcbiAgICAgICAgdmFsdWVUb2dnbGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWVUb2dnbGVkO1xyXG4gICAgfSxcclxuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gKFwiIFwiICsgZWxlbWVudC5jbGFzc05hbWUgKyBcIiBcIikuaW5kZXhPZihcIiBcIiArIHZhbHVlICsgXCIgXCIpID4gLTE7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2xvc2VzdFBhcmVudE5vZGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgdmFyIGVsZW1lbnQgPSBkYXRhLmN1cnJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgd2hpbGUgKFxyXG4gICAgICAgIG1ldGhvZHMuaHRtbEVsZW1lbnQuaGFzQ2xhc3MoXHJcbiAgICAgICAgICBlbGVtZW50LFxyXG4gICAgICAgICAgZGF0YS5nZXRQYXJlbnRFbGVtZW50LmF0dHJpYnV0ZVZhbHVlXHJcbiAgICAgICAgKSA9PT0gZmFsc2VcclxuICAgICAgKSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLm5vZGVOYW1lIHx8IFwiZGl2XCIpO1xyXG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGRhdGEuY2xhc3NOYW1lIHx8IG51bGw7XHJcblxyXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLmFkZEF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBkYXRhLmFkZEF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbihhdHRyaWJ1dGVEYXRhKSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVEYXRhLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVEYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9LFxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMuYWNjZXNzaWJpbGl0eSA9IHtcclxuICAgIHNldDogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG4gICAgICBtZXRob2RzLmFjY2Vzc2liaWxpdHkuc2V0TG9jYWxTdG9yZShkYXRhLmVsZW1lbnQpO1xyXG4gICAgfSxcclxuICAgIGdldEZyb21FbGVtZW50OiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHJldHVybiBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuICAgIH0sXHJcbiAgICBzZXRMb2NhbFN0b3JlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHJldHVybiAoYWNjZXNzaWJpbGl0eSA9IG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5nZXRGcm9tRWxlbWVudChkYXRhKSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0TG9jYWxTdG9yZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBhY2Nlc3NpYmlsaXR5O1xyXG4gICAgfSxcclxuICAgIGRhdGFNb3VzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRzLmJvZHksXHJcbiAgICAgICAgYXR0cmlidXRlS2V5OiBcImFjY2Vzc2liaWxpdHlcIixcclxuICAgICAgICBhZGRBdHRyaWJ1dGVWYWx1ZTogXCJtb3VzZVwiLFxyXG4gICAgICAgIHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBcImtleWJvYXJkXCIsXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICAgIGRhdGFLZXlib2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRzLmJvZHksXHJcbiAgICAgICAgYXR0cmlidXRlS2V5OiBcImFjY2Vzc2liaWxpdHlcIixcclxuICAgICAgICBhZGRBdHRyaWJ1dGVWYWx1ZTogXCJrZXlib2FyZFwiLFxyXG4gICAgICAgIHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBcIm1vdXNlXCIsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5ldmVudExpc3RlbmVyID0ge1xyXG4gICAgbW91c2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBhZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0S2V5Ym9hcmQpO1xyXG4gICAgICByZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRNb3VzZSk7XHJcbiAgICB9LFxyXG4gICAga2V5Ym9hcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBhZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRNb3VzZSk7XHJcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbWV0aG9kcy5ldmVudExpc3RlbmVyLnNldEtleWJvYXJkKTtcclxuICAgIH0sXHJcbiAgICBzZXRNb3VzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmRhdGFNb3VzZSgpO1xyXG4gICAgICBtZXRob2RzLmFjY2Vzc2liaWxpdHkuc2V0KGRhdGEpO1xyXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIubW91c2UoKTtcclxuICAgIH0sXHJcbiAgICBzZXRLZXlib2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmRhdGFLZXlib2FyZCgpO1xyXG4gICAgICBtZXRob2RzLmFjY2Vzc2liaWxpdHkuc2V0KGRhdGEpO1xyXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIua2V5Ym9hcmQoKTtcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcclxuICAgIGVsZW1lbnRzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBlbGVtZW50OiBlbGVtZW50cy5ib2R5LFxyXG4gICAgICBhdHRyaWJ1dGVLZXk6IFwiYWNjZXNzaWJpbGl0eVwiLFxyXG4gICAgfTtcclxuXHJcbiAgICBkYXRhLmFkZEF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmdldEZyb21FbGVtZW50KGRhdGEpO1xyXG5cclxuICAgIG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5zZXRMb2NhbFN0b3JlKGRhdGEpO1xyXG5cclxuICAgIGlmIChtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0TG9jYWxTdG9yZSgpID09PSBcIm1vdXNlXCIpIHtcclxuICAgICAgbWV0aG9kcy5ldmVudExpc3RlbmVyLm1vdXNlKCk7XHJcbiAgICB9IGVsc2UgaWYgKG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5nZXRMb2NhbFN0b3JlKCkgPT09IFwia2V5Ym9hcmRcIikge1xyXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIua2V5Ym9hcmQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtZXRob2RzLnJlbmRlciA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMudW5tb3VudCA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcclxuICAgIGluaXQ6IG1ldGhvZHMuaW5pdCxcclxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcclxuICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXHJcbiAgICBodG1sRWxlbWVudDogbWV0aG9kcy5odG1sRWxlbWVudCxcclxuICB9O1xyXG59KSgpO1xyXG4iLCJjbGFzcyBmaWxlVXBsb2FkU2hvd1ByZXZpZXV3IHtcbiAgY29uc3RydWN0b3IoZmlsZVVwbG9hZENvbnRhaW5lcikge1xuICAgIHRoaXMuZmlsZVVwbG9hZENvbnRhaW5lciA9IGZpbGVVcGxvYWRDb250YWluZXI7XG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuaW5wdXRUeXBlRmlsZSA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcignW3R5cGU9XCJmaWxlXCJdJyk7XG4gICAgdGhpcy5pbnB1dE5hbWVGaWxlID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImZpbGVcIl0nKTtcbiAgICB0aGlzLmlucHV0TGFiZWwgPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2FwdGlvblwiKTtcbiAgICB0aGlzLmF2YXRhckltZyA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5hdmF0YXItaW1hZ2VcIik7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZGVsZXRlLWZpbGVcIlxuICAgICk7XG4gICAgdGhpcy5lcmFzZUltYWdlQnV0dG9uID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZGVsZXRlLWZpbGVbdHlwZT0nYnV0dG9uJ11cIlxuICAgICk7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImhpZGRlblwiO1xuXG4gICAgdGhpcy5hdmF0YXJJbWFnZSA9IHtcbiAgICAgIGRlZmF1bHRJbWFnZTpcbiAgICAgICAgXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSTJNVElpSUdobGFXZG9kRDBpTmpFeUlpQjJhV1YzUW05NFBTSXdJREFnTmpFeUlEWXhNaUkrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVEV3Tmk0NE16UWdNamMxTGpJMll6RXlNeTR5TURFdE56VXVORE15SURJeE55NDBPVElnTmk0eU9EY2dNakUzTGpRNU1pQTJMakk0TjJ3dE1pNHlOQ0F5TlM0M01EbGpMVFl6TGpZM05pMHhNeTQ0TXpjdE9UY3VPRGd6SURNeExqZzNNeTA1Tnk0NE9ETWdNekV1T0RjekxUTTJMamMxTWkwMU9DNDRNRFl0TVRFM0xqTTJPUzAyTXk0NE5qa3RNVEUzTGpNMk9TMDJNeTQ0TmpsNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURXdOaTQ0TXpRZ01qYzFMakkyY3pFeE1DNHhNRFF0TlRZdU5qY3hJREU1TXk0ME1qY2dOaTR6T1Rkak9ETXVNekkwSURZekxqQTNNU0F3SURBZ01DQXdiQzB4TkM0eE1qZ2dNakF1TWpRMmN5MDJOeTR6TlMwM01DNDFNeTB4TnprdU1qazVMVEkyTGpZME0zb2lMejQ4Y0dGMGFDQm1hV3hzUFNJak5qRXlNVEl4SWlCa1BTSk5NakkwTGpJd015QXpNemt1TVROekxURXVNVEE1TFRRM0xqa3hPQ0F5T1M0NU1UWXROemd1T1RRemJETTVMakE0T0NBeE55NDJNemtnTVRjdU56RTRJREV4TGpJNU5pMHpOaTQ0TVRRZ01qQXVOVFk0Y3kweU5pNDNNVElnTXk0ek5EWXRORGt1T1RBNElESTVMalEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5DTnpNeU16RWlJR1E5SWsweE1EWXVPRE0wSURJM05TNHlObk14TURJdU9EVXlMVFUwTGpJME55QXhPVEl1TVRFNElEWXVNamt6YkRZdU1qTXpMVEUwTGpNeE9XTXVNREF4TGpBd01TMDVOaTQyTXpZdE5Ua3VOekE1TFRFNU9DNHpOVEVnT0M0d01qWjZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFE1TVM0NU9DQXhOVEV1TlRJMFl5MHhNRFl1TmpVM0lERTNMakl3TVMweE1qQXVNelkxSURFd09TNDFNRFV0TVRJd0xqTTJOU0F4TURrdU5UQTFiREU0TGpjMk9DQXlOQzQ1T0Rsak16UXVNREEzTFRJNUxqRTRPU0EyTkM0NE1UZ3RNak11T0RnMklEWTBMamd4T0MweU15NDRPRFl0TVRFdU9USTVMVFU0TGpZNE5pQXpOaTQzTnprdE1URXdMall3T0NBek5pNDNOemt0TVRFd0xqWXdPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpRamN6TWpNeElpQmtQU0pOTWpjeExqVTNJRFk0TGprMU9HTXhOUzR3TlRnZ09TNHhJRE13TGprNU55QXhOeTR5TVNBME55NDJOemdnTWpJdU9Ua3RMamd3TWkweE1pNDVOamt1TXpVeExUSTJMakUwT0NBeExqQXlOQzB6T0M0M01qSWdNUzQxTnpJdE1qa3VNamMzTFRjdU5UZ3hMVFEwTGpjME1pMHhOeTQ0TkMwME1pNDBOalV0TVRBdU1qWXlJREl1TWpjM0xTNDRPVE1nTVRJdU5qUTVMVE16TGpVeU9DQXlOaTR5T0RrdE1UQXVNakU0SURRdU1qWTNMVEU0TGpNMk9TQTJMamd6TlMweU5pNHlNVE1nTVRJdU5UWTBJRGd1TVRZeElEZ3VNRGcySURFNUxqZ3hJREV6TGpnMU15QXlPQzQ0TnprZ01Ua3VNelEwZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME5UVXVNakF4SURJMk1pNHhNekp6TFRJd0xqY3hOaTB6TkM0NE5UWXROall1TVRBMkxUTTBMamcxTm13dE5TNDJOak1nTWpZdU1UVTBJREV1TkRnMElERTJMamcwTVNBeE9TNDVOREVnTmk0M05UZGpNQzB1TURBeElERTJMakEwTmkweE5DNDRPVFlnTlRBdU16UTBMVEUwTGpnNU5ub2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5ORGt4TGprNElERTFNUzQxTWpSekxURXdPQzR6TkRZZ016RXVOalUwTFRFd09DNHpORFlnTVRJMUxqVXdNMnd0Tnk0eE5EWXRNell1TXpNMFl5NHdNREV0TGpBd01TQXhOeTQzT1RFdE56VXVPRE0wSURFeE5TNDBPVEl0T0RrdU1UWTVlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkRSRU5EUTBNaUlHUTlJazB5TkRRdU56TTJJRFV4TUM0M01UZHNNVEV1TkRBekxUTXdMamN6TTJNdE1USXVOekk0SURRdU9USTRMVE13TGprMk5TQXhNQzR6T1RRdE5EWXVPVFUwSURFMExqZzNJREV3TGpNZ05pNHhNVEVnTWpJdU1EWWdNVEV1TlRNM0lETTFMalUxTVNBeE5TNDROak42SWk4K1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRJM09DNDRNVFlnTkRFNExqZzFNbU10TlRJdU5ERTFJRFV1T1RRNExUa3hMamt4TmkwNUxqTXdNUzB4TVRjdU1EVXlMVE0wTGpRNE55MDBMakE0TlMwMExqQTVNUzAzTGpZNE1TMDBMalEzTFRFd0xqTTFOaTB5TGpFeE1TMHhNaTQxTnpRZ01USXVOVGMwSURJM0xqRXhPU0E0TkM0ME5qY2dNVEF3TGpVMk1pQTROQzQwTmpjZ015NDBPVFlnTUNBMkxqUTNNaTR3T0RnZ09DNDVPVGN1TWpVeGJERXhMakkzTnkwek1DNDBNVGNnTmk0MU56SXRNVGN1TnpBemVpSXZQanh3WVhSb0lHWnBiR3c5SWlORFJFTkRRME1pSUdROUlrMHlOakF1T1RZMklEUTJOaTQ1TnpGc0xUUXVPREkzSURFekxqQXhNMk14Tmk0ME16UXROaTR6TmpZZ01qTXVOalE0TFRFeExqZ3hOeUEwTGpneU55MHhNeTR3TVRONklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRURTFNUzQwTURnZ016Z3lMakkxTTJNdE1URXVPRFV4SURFd0xqUTJNeTAxTGpRMU5DQTNOUzR3TmprZ05UY3VOemMzSURFeE1pNDJNREVnTVRVdU9UZzVMVFF1TkRjM0lETTBMakl5TnkwNUxqazBNaUEwTmk0NU5UUXRNVFF1T0Rkc05DNDRNamN0TVRNdU1ERXpZeTB5TGpVeU5TMHVNVFl6TFRVdU5TMHVNalV4TFRndU9UazNMUzR5TlRFdE56TXVORFF6SURBdE1URXpMakV6TmkwM01TNDRPVE10TVRBd0xqVTJNUzA0TkM0ME5qZDZUVFF3Tnk0eU56TWdOVEUyTGpZME5tTXVNVFUyTGpBMU1TNHpNREV1TURnNExqUTFOQzR4TXpVdExqRTFNeTB1TURVdExqSTVOeTB1TURnMExTNDBOVFF0TGpFek5Yb2lMejQ4Y0dGMGFDQm1hV3hzUFNJalFqY3pNak14SWlCa1BTSk5NelkyTGpVek55QTBPRFV1TlRRM1l5MHhNUzQ1T1RRZ01qRXVOVEl6SURNMkxqZ3dOU0F4Tnk0M09TQTFOUzQyTkRRdE1UTXVPRFVnTVRndU9UTXhMVE0yTGpNd055MHhOaTR5TmpjdE5qSXVOVEkxTFRFMkxqSTJOeTAyTWk0MU1qVnNMVE0zTGpJeU9DQTJPUzQwTURGakxqZ3dNaTQwTnpRdU16TTRJREl1TlRFekxUSXVNVFE1SURZdU9UYzBlazAwTURjdU56STRJRFV4Tmk0M09ERmpMUzR4TlRNdExqQTBOeTB1TWprNExTNHdPRFF0TGpRMU5DMHVNVE0xTFRNeUxqWXlOaTA1TGpnNE5pMHpOeTQyT1RjZ09DNDRPREV0TVRVdU16WTVJREkzTGpBMk5TQXhOQzQ1TmpnZ01USXVNVGczSURZdU9UY3hJREl3TGpZd01TQTJMamszTVNBeU1DNDJNREVnTVRNdU56QTFMUzQ1T0RjZ01UWXVNelUwTFRFeUxqQTVNaUF4Tmk0ek5UUXRNVEl1TURreUlERXpMakUwTlMwdU9UUTJJRGN1T1RZdE1UVXVPRGMySURjdU9UWXRNVFV1T0RjMmN6RXlMakk0TFRFMExqVTBPQzA0TGpZek15MHhPQzR3TkRSakxTNHlNUzB1TURNeExTNHpPRGt0TGpBM05TMHVOVGc1TFM0eE1USXRNUzQ0T0MwdU1qTTRMVE11T0RVNUxTNDJOekV0TlM0NU5qSXRNUzR6TWpsaE5pNDFNRE1nTmk0MU1ETWdNQ0F3SURFdExqSTNPQzB1TURjNGVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHpPVEV1T1RBMElEVTBNeTQzTVRKakxUSXlMak15T0MweE9DNHhPRFV0TVRjdU1qVTNMVE0yTGprMU1TQXhOUzR6TmprdE1qY3VNRFkxTFRFMExqTTJNeTAwTGpJME1TMHhOaTQyTnpVdE1URXVOekkxTFRFMkxqWTNOUzB4TVM0M01qVWdNVFl1TXpRekxURXhMalkxSURJMkxqRTJPUzB5TWk0NE5TQXpNUzQxT0RJdE16TXVNakkxTFRFNExqZ3pPU0F6TVM0Mk5DMDJOeTQyTXpnZ016VXVNemN6TFRVMUxqWTBOQ0F4TXk0NE5TQXlMalE0TnkwMExqUTJNU0F5TGprMU1TMDJMalVnTWk0eE5Ea3ROaTQ1TnpSc0xUSXdMakUyTlNBek55NDJNRFJqTFRjdU1ERTBJREUyTGpjeU9TQXlOQzQwTkNBeE5TNHpORFFnTkRVdU5EUTNJRE0xTGpZd05TQTNMamM0T0NBM0xqVXdOU0EwTGprd05pQXhNaTQxTXlBMExqa3dOaUF4TWk0MU0zTTNMams1T1MwNExqUXhOQzAyTGprMk9TMHlNQzQyZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1EZ3VNREEySURVeE5pNDROVGxqTWk0eE1ETXVOalU0SURRdU1EZ3lJREV1TURreElEVXVPVFl5SURFdU16STVZVFl3TGprM0lEWXdMamszSURBZ01DQXhMVFV1T1RZeUxURXVNekk1ZWlJdlBqeHdZWFJvSUc5d1lXTnBkSGs5SWk0ek15SWdabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF3T0M0d01EWWdOVEUyTGpnMU9XTXlMakV3TXk0Mk5UZ2dOQzR3T0RJZ01TNHdPVEVnTlM0NU5qSWdNUzR6TWpsaE5qQXVPVGNnTmpBdU9UY2dNQ0F3SURFdE5TNDVOakl0TVM0ek1qbDZJaTgrUEdjZ1ptbHNiRDBpSXpjek1qY3lPQ0krUEhCaGRHZ2daRDBpVFRReU1pNHhPREVnTkRjeExqWTVOMk10TlM0MU5qa2dPUzR6TlRFdE1UTXVOelU0SURFMkxqSTBOaTB5TWk0eU1Ua2dNakF1TnpreExUYzRMakl5TkNBek5TNHhNREVnTVRndU1qQXpMVE15TXk0M09Ea2dNVEF1TURRekxUYzVMamN4TVNBd0lEQWdMalU0Tmk0eU9EZ3ROeTQyTWpndE5pNDRNak10T0M0eU1qY3ROeTR4TVRjdE1qQXVNamcySURVeUxqQXpOUzB5TUM0eU9EWWdOVEl1TURNMWN5MDVMamcxT0NBeU9DNDVNVFF0TVRNdU16VTNJRE01TGpZeE9HTXROQzR4TkRjdE1pNHdNVGd0TlM0MU5EZ3ROaTR3TlRNdE1pNHhPVFl0TVRJdU1EWXhJREl1TkRnM0xUUXVORFl4SURJdU9UVXhMVFl1TlNBeUxqRTBPUzAyTGprM05Hd3RNakF1TVRZMUlETTNMall3TkdNdE55NHdNVFFnTVRZdU56STVJREkwTGpRMElERTFMak0wTkNBME5TNDBORGNnTXpVdU5qQTFJRGN1TnpnNElEY3VOVEExSURRdU9UQTJJREV5TGpVeklEUXVPVEEySURFeUxqVXpjemN1T1RrM0xUZ3VOREUwTFRZdU9UY3hMVEl3TGpZd01XTXRNakl1TXpJNExURTRMakU0TlMweE55NHlOVGN0TXpZdU9UVXhJREUxTGpNMk9TMHlOeTR3TmpVdE1UUXVNell6TFRRdU1qUXhMVEUyTGpZM05TMHhNUzQzTWpVdE1UWXVOamMxTFRFeExqY3lOU0F4Tmk0ek5ETXRNVEV1TmpRNUlESTJMakUzTFRJeUxqZzBPQ0F6TVM0MU9ETXRNek11TWpJemVrMDBNRGt1T0RZeklEVXpPQzR3TWpGek55NDROellnTkM0ek9ETWdOUzR6TmpZZ01UUXVNbU0wTGpNd09DMHVNamMySURVdU9UUXlMVEl1TURnZ05TNDVOREl0TWk0d09DMHhMalkzTVMweE1DNDJOek10TVRFdU16QTRMVEV5TGpFeUxURXhMak13T0MweE1pNHhNbnBOTkRFMkxqY3pNeUExTWpndU5ESTJjelF1TnpBNElERXVORE0xSURZdU5EVTJJRGN1T1RFNVl6SXVNRE10TVM0MU9UZ2dNaTQwTmpNdE5DNHdNaklnTWk0ME5qTXROQzR3TWpJdE15NHlPVE10TXk0Mk5pMDRMamt4T1MwekxqZzVOeTA0TGpreE9TMHpMamc1TjNvaUx6NDhMMmMrUEhCaGRHZ2dabWxzYkQwaUkwSTNNekl6TVNJZ1pEMGlUVFF6Tmk0Mk1Ua2dNekE0TGpFME9XTXRNVEF1TXpnNExURXpMamt6TkMweU5TNDRNRGN0TWpRdU56RTJMVE13TGpRd05TMHhPQzQzTlRndE5DNDRPRE1nTmk0ek5EUXVNamM1SURNd0xqWXdNaUF4TUM0ME9UUWdOVEl1TWpVM0lESXlMakl6TlNBME55NHhOelFnT1M0MU1EVWdOak11TWpNM0lEa3VOVEExSURZekxqSXpOeUF4TXk0ME5qY3RMalkyTkNBeE5pNDROUzB4TWk0ME1UUWdNVFl1T0RVdE1USXVOREUwSURFMExqWTRPQzB1TnpJMElERXhMalF4TWkweE5pNDNNVGtnTVRFdU5ERXlMVEUyTGpjeE9YTXhOUzQzTURjdE9TNDVNeTB4TVM0eE56UXROVGN1TWpJellURXhPQzQyTlRRZ01URTRMalkxTkNBd0lEQWdNQzAyTGpZNE1pMHhNQzR6T0hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqUWpkQ04wSTRJaUJrUFNKTk16Y3hMalF5TkNBeU9EUXVOakkwWXpJdU5EazNMVE11TWpJZ09TNDNPRGt0TVRFdU1EazVJREUwTGpFd015MHhOUzQzTURjdE1USXVPRFEzTFRZdU56a3lMVEl5TGpJeU1pMDVMalkxTlMweU1pNHlNakl0T1M0Mk5UVnNMakExTmlBek1DNDRPREZ6TWk0NE5ESWdNaTQ0TURFZ055NHlOekVnTnk0MU1EbGpMVEV1TURjeExUVXVPVFF0TVM0MU16VXRNVEF1TURNMExqYzVNaTB4TXk0d01qaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6Y3pNamN5T0NJZ1pEMGlUVFF4T0M0d09EUWdNelF4TGpVM04yTXRPUzQzT0RNdE1qQXVOek00TFRFMUxqUXdPUzAwTVM0eU1USXRNVEV1TVRZeUxUUTRMakExTkNBMExqTTFOQzAzTGpBeE1TQXhPQzQ0TXpjdU1EWTFJREk1TGpZNU55QXhOQzQyTWpZdE1UVXVNelU1TFRJeExqUTFOUzB6TlM0NE5DMHpOUzR6TWpNdE5URXVNekF5TFRRekxqUTROeTAwTGpNeE1TQTBMall3TlMweE1TNDJNRFlnTVRJdU5EZzNMVEUwTGpFd05DQXhOUzQzTURFdE1pNHpNeUF5TGprNU9DMHhMamcyTnlBM0xqQTVOUzB1TnpreUlERXpMakF5T0NBeE5DNHhNalFnTVRRdU9UazVJRFEwTGpVME9DQTBPUzQxTWprZ05URXVPREkxSURjMUxqazBPU0EyTGpRek9DQXlNeTR6TXpnZ015NDVOallnTXpVdU5UUTFJRE11T1RZMklETTFMalUwTlhNeE5DNHhNUzB4Tmk0eE16VXRPQzR4TWpndE5qTXVNekE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek16VXVOekF6SURFME9DNDNOalJqTFRFdU9EWXRNamN1TVRJMUlEY3VNVE0yTFRVekxqazNPQ0F4TkM0eE9UTXROemt1TWpjelF6TTJNQzQxTXpJZ016RXVNemMzSURNMU15QTRMak15TnlBek16Z3VPRElnT0M0ek1qZGpMVEUwTGpFNE1pQXdMVFF1T0RjMElERTJMak01T1MwMU1TNDROVGNnTWpRdU9ERTVMVEk1TGpFeU5DQTFMakl4T1MwME5TNDJOVEVnTXk0NU9URXROemd1TkRRNUlEUXlMakV3T0Mwek1pNDNPVGdnTXpndU1URTBMVFU0TGpVd055QTNNeTR4TWpjdE5UZ3VOVEEzSURFeE5TNHlNekp6TWprdU1qVXlJRGcxTGpBNU9TQTBPQzR6TURjZ09EVXVNRGs1WXpFd0xqRTJPQ0F3SURFMExqQXpOQzA0TGpBM05pQXlNUzR6TkRVdE1Ua3VNRFF6SURFMExqazVPUzB5TXk0M01qWWdORGN1TVRNMkxUTXpMalEzTlNBMU15NHhNVGt0TkRjdU9EYzRJREFnTUMweUxqZzROU0F4TVM0eU5ETXRNakV1T0RNeElESTBMamN3TXkweE1DNDRNamtnTnk0Mk9UY3RNVFV1T1RreUlERTRMalExT0MweE9DNDBOemtnTWpZdU56Y3hJRGt1TlRBMElERXVNRFEySURNeExqYzRNeTB4TlM0NE1EY2dORGd1TnpNdE16SXVOelUwSURndU56a3RPQzQzT0RjZ01UVXVNelU1TFRFeExqY3hNeUF4T1M0M056TXRPUzQ0TURVZ05TNHpOall0TVRRdU56STJJRGd1TVRjNUxUTXdMamcyTWlBeE55NDBOVGd0TkRVdU56QTNJRFF1TVRFMExUZ3VNakU1SURndU1qUTJMVEU1TGpVNE55QXhOeTR5TnpRdE1qTXVNVEE0ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5FUXpOR00wWWlJR1E5SWswek5EZ3VOVFk0SURFNU1DNHdORFZqTFRndU1qQTBMVEV6TGpjeE55MHhNUzQ1TWpJdE1qY3VOVE15TFRFeUxqZzJOUzAwTVM0eU9ERXRPUzR3TWpnZ015NDFNakV0TVRNdU1UWWdNVFF1T0RnNUxURTNMakkzTWlBeU15NHhNRGt0T1M0eU56a2dNVFF1T0RRMUxURXlMakE1TWlBek1DNDVPREV0TVRjdU5EVTRJRFExTGpjd055QTNMalEwTlNBekxqSXdPQ0E0TGpjMU1pQXlNQzR4TnpFZ05DNHhOak1nTkRZdU1EUXROeTR6TVRRZ05ERXVNakU0TFRReUxqVTFNeUE0TVM0eE1EVXROREl1TlRVeklEZ3hMakV3TlhNdE1qY3VOVEF4SURjMUxqWTBMVEl5TGpJNE5TQXhNamd1TXpNNWJESXlMakk0TlMwME1TNDBNamx6TlRFdU9EVTVMVFl1T0RFeUlEWTNMamd4TXkwNE5TNHdPRGRqTVRRdU5EUTBMVGN3TGpnMk1TQTFNQzR4TkRFdE56a3VNakEwSURjeUxqQTFPUzAwTmk0Mk1ETXRNVE11TkRnMUxUVXdMakF3TlMwek55NHlOemN0T0RJdU1USXROVE11T0RnM0xURXdPUzQ1ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU5GUlRaQk5rRWlJR1E5SWswME1USXVPRE0zSURNNE15NHlPRGRqTUMwek1pNDJNelV0TkM0d05qTXROVGt1T1RReExURXdMak00TWkwNE15NHpOREl0TWpFdU1UazRMVE15TGpnek15MDJNeTQyT1RFdE1qUXVNalU0TFRjNExqRXpOaUEwTmk0Mk1ETXRNVFV1T1RVMElEYzRMakkzTkMwMk1TNDNNellnT0RVdU1EZzNMVFl4TGpjek5pQTROUzR3T0Rkc0xUSXlMakk0TlNBME1TNDBNamxqTGpnMk1TQTRMalk0TVNBeUxqWXlOU0F4Tmk0M01Ua2dOUzQxTWpZZ01qTXVOekUzSURRdU5qTTJJREV1TURnZ09TNDNORGtnTWk0MU1qUWdNVFV1TkRNM0lEUXVOREEzSURjM0xqazJOeUF5TlM0M09EY2dNVFV4TGpVM05pMHpNaTQ0TURFZ01UVXhMalUzTmkweE1UY3VPVEF4ZWlJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME1URXVNREEzSURReE1TNHhOREpqTVM0eE9UUXRPQzQ0TWpFZ01TNDRNeTB4T0M0eE1EWWdNUzQ0TXkweU55NDROVFFnTUNBekxqYzROQzB1TWpBeElEY3VORGt6TFM0ME56a2dNVEV1TVRjeExqWXhOeTB4TWk0M016RXVOREV6TFRJMkxqQXhNeTB1TmpFM0xUTTVMamN5TWlBMExqazVNeUF4TlRJdU5UZzRMVEV5Tmk0MU5TQXhOREV1TURVM0xURXlOaTQxTlNBeE5ERXVNRFUzYkMwNUxqZzBNaUE1TGpFME5XRXhNalF1TlRrNElERXlOQzQxT1RnZ01DQXdJREV0TVRRdU1EZzNMVE11TnpWakxUVXVOamc0TFRFdU9EZ3pMVEV3TGpnd01TMHpMak15TnkweE5TNDBNemN0TkM0ME1EY2dOUzR4TnpJZ01USXVORGN4SURFMExqQXdPU0F5TVM0MU56Y2dNamd1TURZeUlESTBMamM1TVdFeE1URXVOREV5SURFeE1TNDBNVElnTUNBd0lEQWdNalF1TnpnNElESXVPREV6YkM0d016UXVNREkwWXk0eE56SWdNQ0F1TXpJNUxTNHdNVE11TlRBeExTNHdNVE11T1RnekxTNHdNRE1nTVM0NU5qY3RMakEwTkNBeUxqazBPQzB1TURjNElEWTRMalF6TmkweExqVXlOaUF4TURFdU16VXpMVFE0TGpBeE15QXhNRGd1T0RRNUxURXhNeTR4TnpkNklpOCtQSEJoZEdnZ1ptbHNiRDBpSXpVeU5USTFNaUlnWkQwaVRUSXhOaTQyTWpJZ01Ua3dMamsyT1dNMkxqY3pOUzB4TGpJM09DQXhOQzQ0TURVdE9TNDBNellnTVRFdU9EWXpMVEU0TGpjeU55MHlMamswTVMwNUxqSTVNaTB4TkM0NU5USXRNUzQwTVRZdE1UWXVORFF6SURjdU56QTVMVEV1TkRJeUlEZ3VOamszSURJdU1Ea3lJREV4TGpRNU55QTBMalU0SURFeExqQXhPSG9pTHo0OGNHRjBhQ0JtYVd4c1BTSWpSa1pHSWlCa1BTSk5Nakl4TGpVeE1pQXhOemt1TkRNNFl6RXVORGM1TGpVeE1TQXpMakUxTVMwdU56YzNJRE11TnpFNExUSXVPRGM1TGpVM0xUSXVNVEF5TFM0eE5qa3ROQzR5TVRNdE1TNDJORGd0TkM0M01qRXRNUzQwT1RFdExqVXdOeTB6TGpFMU5DNDNPRFl0TXk0M015QXlMamc0TlMwdU5UWTBJREl1TURrekxqRTNNU0EwTGpJeE1TQXhMalkySURRdU56RTFlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkVRek5HTTBZaUlHUTlJazB5T1RrdU9ERTJJREkzTnk0d01qZHpMVFV1TmpVeExURXlMakk1T0NBeE1TNDVOamN0TWpNdU1EazVZekUzTGpZeE55MHhNQzQ0TURVZ01Ua3VNVEV4SURRdU16RTVJREU1TGpFeE1TQTBMak14T1NJdlBqeHdZWFJvSUdacGJHdzlJaU0zTXpJM01qZ2lJR1E5SWswME9URXVPVGdnTVRVeExqVXlOSE10TmpBdU1EZzFJREl3TGpRM09DMDVNUzQxTlRVZ09ESXVPVEEyYkMwMUxqRTVOQzAzTGpFMU5YTXlNaTQ1T0RRdE5UTXVNakU1SURrMkxqYzBPUzAzTlM0M05URjZJaTgrUEhCaGRHZ2dabWxzYkQwaUkwUkRNMFl6UmlJZ1pEMGlUVEl6TlM0ek16a2dOVFV3TGpJNE1XTXRMamd6SURJMExqa3pNeUF6TXk0eU5qZ2dORFF1TnpReUlERTFMalV3TXlBMU15NHlPRFVnTVRZdU5qSXlJREl1TWpFMUlESXhMamswTFRjdU5UTTNJREl4TGprMExUY3VOVE0zSURJeUxqWXdNaUF6TGpNeU55QXlNUzQwT1RNdE1UWXVNVGMzSURJeExqUTVNeTB4Tmk0eE56Y2dNVEF1TmpBMExUY3VNREV4SURrdU5qZ3pMVEUyTGpNek15NHdNakl0TWpVdU5UY3hMVEl4TGprek5DMHhPQzR4TkRNdE5UZ3VNVEk0TFRJNExqZzBNUzAxT0M0NU5UZ3ROSHBOTXpBd0xqQTNOeUEwTmpNdU1EY3pZeTR6TWprdE1qSXVNVGc0TFRFeUxqSXlOeTB6T1M0NE9UWXRNVEl1TWpJM0xUTTVMamc1Tm5NeE55NHlPRFl0TVRFekxqUTJNUzAwTkM0M05qVXROalF1TWpZMVl5MDJNaTR3TlRNZ05Ea3VNVGszTFRVeUxqa3dPU0F4TVRVdU5qSXRNemt1TWpJeklERXpOeTR6T1RVZ01qTXVNVFUwSURNekxqVTNOU0E0TkM0MU1URWdNVGd1TWpnNElEazJMakl4TlMwek15NHlNelI2SWk4K1BIQmhkR2dnWm1sc2JEMGlJemN6TWpjeU9DSWdaRDBpVFRJNE5TNHhPU0EwT1RrdU9EVmpNVEF1T1RnMkxURXlMakl4TnlBeE5DNDNNVFF0TWpVdU1URTJJREUwTGpnNE5pMHpOaTQzTnpZdE1URXVOekEwSURVeExqVXlNUzAzTWk0eE5UWWdOalF1TURVeUxUazJMakl4TkNBek15NDJNalVnTVRZdU5UQTVJREkyTGpJMk1TQXpPQzQ1T1RnZ01qQXVPRGd5SURJNExqZ3dOeUF6T1M0M01UZ3RNVEF1TVRrM0lERTRMamcwTGpZMk55QXpOeTR3TVRJZ01UUXVPRFE0SURRNExqVXpNM016TGpNeU5DQXhPQzQyTVRjZ015NHpNalFnTVRndU5qRTNZekkzTGprM05DMDVMakE0TlMwNUxqVXlPUzB5TlM0NE1ETXRPUzQxTWprdE5UQXVOelE0SURBdE1Ua3VOU0F5T1M0NU1TMHhOQzR5TURrZ05USXVPVGcwSURFdU5EWXpMVEl1T0RZdE1pNDNNekV0Tmk0ME5ETXROUzQwTlRjdE1UQXVOemN0T0M0eE1UTXRNVGd1T1RRMExURXhMall6TlMweU9DNDVNVGt0TVRJdU1qazVJREV1TmpZMExUUTJMak14T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk1qY3lMamM0TWlBMU9UWXVNREk1WXpndU1EZzRMVEV3TGpFNUlERXVNakUyTFRFNExqQTJJREV1TWpFMkxURTRMakEyY3pFd0xqRXhNaUEwTGpFd01TQTNMams1TVNBeE9DNHdObU13SURBdE5DQXlMakV3T1MwNUxqSXdOeUF3VFRJNU5DNHlOelVnTlRjNUxqZzFNMk13TFRFeExqSTVPUzAzTGpjMU5pMHhOQzR3TnpFdE55NDNOVFl0TVRRdU1EY3hjemd1TlRNM0xqTXdOQ0F4TWk0eE9Ea2dNVEF1TWpsak1DMHVNREF4TFRFdU9ESTNJREl1TnpJNExUUXVORE16SURNdU56Z3hJaTgrUEdjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNek9DNDRNaUE0TGpNeU9HTXRNVFF1TVRneUlEQXROQzQ0TnpRZ01UWXVNems1TFRVeExqZzFOeUF5TkM0NE1Ua3RNaTR6TXpNdU5ERTNMVFF1TlRjM0xqYzVMVFl1TnpZeklERXVNVFVnTWpVdU5qUTBMVE11T1RZeklESXlMalk0SURNdU9UQTJJRFF1TXpJeklERXlMamd4TlMweU15NHdNRElnTVRFdU1UVTRMVE0yTGpZeU15QXhMakE0TVMwMk9DNDVORFVnTkRZdU56UTFMVE15TGpNeU5TQTBOUzQyTmpNdE5ETXVNVElnT1RJdU5EazVMVEl6TGprd09DQXhNamt1T0RjMklESXdMakEwTlNBek9DNDVPVEVnTXpNdU5qa2dNVGt1TVRJNElEVXpMakF5TWlBNExqYzBiQzB1TURBMkxqQXdObU14TWk0MU1qY3RPQzQzTmpJZ01qUXVOalEzTFRFMUxqVXhPU0F5T0M0d09UTXRNak11T0RFeklEQWdNQzB5TGpnNE5TQXhNUzR5TkRNdE1qRXVPRE14SURJMExqY3dNeTB4TUM0NE1qa2dOeTQyT1RjdE1UVXVPVGt5SURFNExqUTFPQzB4T0M0ME56a2dNall1TnpjeElEa3VOVEEwSURFdU1EUTJJRE14TGpjNE15MHhOUzQ0TURjZ05EZ3VOek10TXpJdU56VTBJRGd1TnprdE9DNDNPRGNnTVRVdU16VTVMVEV4TGpjeE15QXhPUzQzTnpNdE9TNDRNRFVnTlM0ek5qWXRNVFF1TnpJMklEZ3VNVGM1TFRNd0xqZzJNaUF4Tnk0ME5UZ3RORFV1TnpBM0lEUXVNVEV5TFRndU1qSWdPQzR5TkRRdE1Ua3VOVGc0SURFM0xqSTNNaTB5TXk0eE1Ea3RNUzQ0TmkweU55NHhNalVnTnk0eE16WXROVE11T1RjNElERTBMakU1TXkwM09TNHlOek1nTVRBdU5qTTNMVE00TGpFeE5TQXpMakV3TmkwMk1TNHhOalF0TVRFdU1EYzFMVFl4TGpFMk5Ib2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJell4TWpFeU1TSWdaRDBpVFRJMU1TNDNJREl6TkM0eE1UZGpNVGd1T1RRMkxURXpMalEyTVNBeU1TNHdOemt0TWpVdU5EVXlJREl4TGpBM09TMHlOUzQwTlRJdE5TNDVPRE1nTVRRdU5EQXpMVE00TGpFeUlESTBMakUxTWkwMU15NHhNVGtnTkRjdU9EYzRJRE11T0RrMElESXVPRFlnT0M0eU1EUWdNeTQ1TWpVZ01USXVPREE1SURNdU5UazJJREl1TkRnNExUZ3VNekV6SURndU5EQXlMVEU0TGpNeU5TQXhPUzR5TXpFdE1qWXVNREl5ZWlJdlBqeHdZWFJvSUdacGJHdzlJbTV2Ym1VaUlHUTlJazB5TlRBdU9UUTRJREl6TXk0ek5qaGpNVGd1T1RRMkxURXpMalEySURJeExqZ3pNUzB5TkM0M01ETWdNakV1T0RNeExUSTBMamN3TXkwekxqQTJNeUEzTGpNM01TMHhNaTQ1TnpJZ01UTXVOVEkyTFRJekxqa3pNeUF5TUM0NU5UZGhNVEV1TkRZM0lERXhMalEyTnlBd0lEQWdNQ0F4TGpnNU5TQXpMamt4Tm1NdU1EYzJMUzR3TlRjdU1UTTFMUzR4TVRZdU1qQTNMUzR4TjNvaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJak5VRXhSREZCSWlCa1BTSk5NakUxTGpreU9TQXlNREl1TkRVNVl6WXVOamMyTFRFdU5UWWdNVFF1TXprM0xURXdMakEwTmlBeE1TNHdOamN0TVRrdU1qQTJMVE11TXpNekxUa3VNVFl0TVRVdU1EQXhMUzQzT0RrdE1UWXVNVEEzSURndU16azJMVEV1TURVNUlEZ3VOelEySURJdU5UYzFJREV4TGpNNU5pQTFMakEwSURFd0xqZ3hlaUl2UGp4d1lYUm9JR1pwYkd3OUlpTkdSa1lpSUdROUlrMHlNakF1TXpJNElERTVNQzQzTXpkak1TNDFMalExTVNBekxqRXhOeTB1T1RBNUlETXVOVGt6TFRNdU1ETTJMalE0TmkweUxqRXhPQzB1TXpRMExUUXVNakF4TFRFdU9EUXlMVFF1TmpReUxURXVOVEV0TGpRME5TMHpMakV5TGpreE1TMHpMall3TlNBekxqQXpOUzB1TkRjM0lESXVNVEUxTGpNME55QTBMakl3TlNBeExqZzFOQ0EwTGpZME0zb2lMejQ4TDJjK1BIQmhkR2dnWm1sc2JEMGlJMFJETTBZelJpSWdaRDBpVFRNd09DNDBNVGdnTWpZMExqazRPWE10TkRndU5qUXlJREk1TGpRek5DMDJNaTR3TURJZ01URXpMak0yTldNdE5TNDRNaUF6Tmk0MU16RWdNVEF1TWpjeUlEUXdMamMzTmlBeE1DNHlOeklnTkRBdU56YzJjekV5TGpneE9DQXhPQzR5TXpFZ016QXVORElnTVRJdU9EVmpNQ0F3SURrdU5UVTRJREV3TGpRME5DQXpNQzR6TnpRdU1USTJJREFnTUMweU15NDNNamt0TVRBdU9UZzVMVE13TGpNNE15MDBPQzQyTkRNdE5pNDJOaTB6Tnk0Mk5UY2dNVEF1TWpFNUxUYzRMalUzT0NBeU1pNHhOVFF0T1RJdU5qWTRJREV6TGpNMk1pMHhOUzQzTnprZ01USXVNemd5TFRNMExqWTJOUzB1T0RNMUxUSTFMamd3Tm5vaUx6NDhaejQ4Y0dGMGFDQm1hV3hzUFNJalFUVkJOVUUxSWlCa1BTSk5NekF4TGprd09TQTBNamd1T1RReGJDMHVOek0yTFM0MU1qWmpMalEzTXk0ek5qTXVOek0yTGpVeU5pNDNNell1TlRJMmVpSXZQanh3WVhSb0lHWnBiR3c5SWlNM016STNNamdpSUdROUlrMHlPVEF1TXpneElETTRNaTR3TVRKakxUVXVOVE01TFRNeExqTTBNU0F5TGprMk5pMDJNeTQ1TURjZ01USXVPRFUyTFRneUxqQTRPUzAwTVM0ek1UVWdOekl1TnpJNUxURXdMak00TVNBeE1qSXVNRFExTFRFdU16STRJREV5T1M0d01Ua2dNQ0F3TFRFMExqZ3pOaUEwTGprNE5pMHlNaTR6TmpjdE1UQXVNRGd4SURBZ01DQXVOVElnTlM0M01UUWdNeTQyTlRZZ09TNDFNallnTUNBd0xUSXlMall3TkNBeUxqTTBNeTB5T0M0d09UTXRNVGt1TWpFMUlEQWdNQzB5TGprd01TQXhNQzQ1TXpZZ09DNHlOVFFnTVRndU5qWWdNVEV1TlRJNElEY3VPVGMySURJekxqUTVOQ0ExTGpJd05pQXlNeTQwT1RRZ05TNHlNRFp6TVRVdU5USTFJREV4TGpjMk55QXpNaTQxTnpNdExqazFPR011TURBeElEQXRNakl1TXpnNExURXlMalF4TVMweU9TNHdORFV0TlRBdU1EWTRlaUl2UGp3dlp6NDhjR0YwYUNCbWFXeHNQU0lqTnpNeU56STRJaUJrUFNKTk16a3pMakU0TXlBeU56QXVPVE0wY3pjdU9URXRNVEF1TnpRNExUVXVPREUzTFRFMExqSXdPV013SURBdE9DNDBOVEV0TWpBdU9EZzFMVEUzTGpnd05TMHpOQzQ0TmpNdExqQXlNaTB1TURJNExTNHdORGd0TGpBMkxTNHdOamt0TGpBNU1TMDVMamc1TXkweE5pNHlPVFV0TWpFdU1UTXpMVE16TGpBNU9TMHlOeTR4T0RVdE5Ea3VOVEV6TFRrdU16RTJMVEk1TGpFMU9DQTBMamd6Tnkwek1DNDFPVE1nTnk0Mk9UTXRNemd1TURBeElEUXVORGMzTFRFeExqVTROQzB4TWk0ME1pMDJMamt6T0MwNExqQXlPQzB6TVM0M09USWdNUzQ1TnpFdE9DNHdORGNnTkM0ek16SXRNVFl1TURrMUlEWXVPREU1TFRJMExqRXhNU0E1TGpNek5TMHpNQzR3T0RJZ01UTXVPVFl5TFRjd0xqQXlOUzA1TGprM01TMDNNQzR3TWpVZ01DQXdJREUzTGpFM05pQXlMak0wTmlBMkxqSXdOU0F6Tmk0d056Z3RNVEF1T1RjZ016TXVOekk1TFRVekxqRTROU0ExTmk0NU9UY3ROREV1TlRRM0lERXdNQzQ0TnpVZ01UQXVNVFU1SURNNExqTXlOQ0F5TGpJeE1TQTFPQzQ0TXpZdE1qRXVOVFV5SURneExqTTVNU0F3SURBZ01qa3VNelkxTFRJNExqSXdOaUF5TlM0MU1ESWdNVGt1TnpZM0lEWXVPRFUzTFRjdU9EVWdOeTQxTkRZdE1qQXVNelk0SURjdU1UVTFMVE15TGpNeExqQTBMVEU0TGpjd09DQTRMakExTnkwek9TNDVOekVnTXpNdU5EZzJMVEV4TGpRM09DNDJNakV1TnpBMUlERXVNalEwSURFdU5EQTNJREV1T0RVNElESXVNVEkzTGpFd015NHhNakl1TWpFdU1qVTBMak14Tmk0ek56a2dNamd1TVRnM0lETXpMakk1TXlBME55NHdOamtnTnpndU5EWXlJRFV5TGpJeElEazBMamM0T1MwdU5qY3lMVE11TWpFekxUWXVNRGMxTFRJeExqVTFNUzA1TGpJM0xUSTVMakF4TTNwTk1qZ3dMak01TWlBME9UY3VNekl5WXpJM0xqTTBNUzB5TkM0NE1qa2dNVEl1TURVeExUWXpMalE1TnlBeE1pNHdOVEV0TmpNdU5EazNhRFl1TURjeGN6SXdMak13TWlBek15NHhORFlnTVM0MU5qTWdOell1T0RreUlpOCtQSEJoZEdnZ1ptbHNiRDBpSXpjek1qY3lPQ0lnWkQwaVRUUXdNeTR3TnpnZ01qUTRMamM1TTJNdE1qUXVNalU0TFRndU5UUXlMVEV5TGpJek1pMHpPQzQwT0RZdE1USXVNak15TFRNNExqUTROaTB4TUM0NU9EVWdNVFF1TVRZeUxURTFMalF4TlNBek1TNHdOUzB4TlM0ME1UVWdNekV1TURWc01UQXVNRGsySURFMExqYzBPSE14TWk0d09EWWdPQzR4TlRRZ01USXVPREVnTnk0ME1qZGpMamN5TXkwdU56STNJREk1TFRZdU1Ua3pJRFF1TnpReExURTBMamN6T1hvaUx6NDhjR0YwYUNCbWFXeHNQU0lqTmpFeU1USXhJaUJrUFNKTk1qVTBMakV3T1NBeU5qQXVNVGsyY3pJeUxqWXdOeUEyTGpFeE5TQXpPUzR3T1RRZ01UY3VOak5zTFRJMkxqUXhOeUF5TGprMU1YTXRPUzQ1TWpRdE55NDBOelV0TVRBdU16STFMVGN1T0RjMVl5MHVOQzB1TkRBeUxUSXVNelV5TFRFeUxqY3dOaTB5TGpNMU1pMHhNaTQzTURaNlRUUTFOUzR5TURFZ01qWXlMakV6TW5NdE1UQXVOVEV6TFRRMkxqRXpOeTAxTlM0eU1qUXRORE11TXpZeFl6QWdNQ0F5Tnk0eE5qVXRORGt1T0RZeElEa3lMakF3TXkwMk55NHlORGNnTUNBd0xUUTJMakF3TVNBMU1TNHdORFV0TXpZdU56YzVJREV4TUM0Mk1EaDZJaTgrUEhCaGRHZ2dabWxzYkQwaUl6WXhNakV5TVNJZ1pEMGlUVE00T0M0ME9DQXlOVEF1TURNM2N5NHlNall0TWpBdU56WTJJREU1TGpZMkxUUXpMakl3T0d3eE5TNDBNalV0TWk0M09UUWdOUzR5TVRNZ01pNDNPVFJ6TFRNd0xqVTBPU0F4Tmk0NU9EVXROREF1TWprNElEUXpMakl3T0hvaUx6NDhMM04yWno0PVwiLFxuICAgICAgc3VjY2Vzc1BkZjpcbiAgICAgICAgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWlRQUFBRDZDQU1BQUFDbWhxdzBBQUFDQ2xCTVZFVUFBQUQyOXUzdTd1bnQ3ZW50N2VudTd1anU3dWhZb3dCYnBBUmNwUVpkcGdoanFCRmxxUlJxckIxdHJTQnVyaUp3cnlWeXNDaDZ0RFdBdHoyQ3VFS0d1a2VRdjFhVndWK1l3Mk9adzJTYXhHV2F4R2VieEdtZnhtNmhvcUNpbzZHaW82S2pwS09rcGFTa3lYZW1wcVNtcDZXbnFLYW55bnFvcUthb3FhZXBxcWlxcTZpcXE2bXFxNnFxekg2cnE2cXJyS3V0cmF1dHJxeXVyNnl2cjYyd3NhNnhzYSt4c3JDeXNyQ3lzN0N5czdHenM3R3p0TEd6dExLMHRiSzB0Yk8xdGJPMXRyUzJ0N1czdDdXM3VMYTMwcE80dWJhNXViZTV1cmU2dTdlN3ZMbTh2THE4dmJ1ODFacTgxWnk5dnJ1OTFaNit2cnkrdjd5L3Y3Mi93TDIvMXFEQXdMM0F3YjNBd2I3QndyN0N3ci9DdzcvRHc4RER4TUREeE1IRDJLWEV4TUhFeE1MRnhjUEZ4c1BHeHNQRzJxdkh4OFRIeU1USXlNWEl5Y1hKeWNiSnlzYkt5c2ZLeThmSzI3REszTEhMeThmTHk4akx6TW5Nek1uTnpjbk56c3JQejh2UDBNelEwTTNSMGMzUjBzN1Mwcy9VMU5EVTFkSFcxOVBYNHNYWTJOVFkyTlhZMmRYWjJkWFoyZGJhMnRYYTJ0YmEyOWJiMjliYjVNcmI1TXZjM05mYzNOamMzZGpjM2RuZDNkbmUzdHJlMzl2ZjM5dmc0TnZnNTlQaDRkemg0ZDNpNHQzaTR0N2k2TmJqNDk3azVOL2s1T0RsNWVEbDVlSGw1dUxsNmRybTV1SG41K0xuNStQbzZPUHA2ZVRxNnVYcTYrTHE3T1ByNiticzdPWHM3T2Z0N2VmdDdlakE5dFZ5QUFBQUIzUlNUbE1BSEtibDV1enR2cWw5c3dBQUJZZEpSRUZVZU5ydDNHbDNFMlVZZ09Fa0xSUkZFUGM5aEFxSUNBcW80QWFpb2lndWlPS0dpcUFvVUhHalFoV0xJSWdpaUNqSUl0U3FRQXNSNXo5SzI1bUdKRzA2VGZzaHpWejNGMmptYlE5bm51dGtlV2RLS3BYT05BYlNJRFZtMHFsVWVyd1RvVXFOUzZjeXpvSXFsMGsxT0FtcVhFUEtPZEJRUVNKSUJJa2dFU1NDUkpBSUVna1NRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVrQWdTUVNKSUJJa2dFU1FTSklKRWtBZ1NRU0pJQklrZ2tTQVJKSUpFa0FnU1FTSklKRWdFaVNBUkpJSkVrQWdTUVNKQklrZ0VpU0FSSklKRWtBZ1NDUkpCSWtnRWlTQVJKSUpFa0VpUUNCSkJJa2dFaVNBUkpJSkVna1NRQ0JKQklrZ0VpU0NSSUJFa2drU1FDQkpCSWtnRWlRU0pJQkVrZ2tTUUNCSkJJa2drU0FTSklCRWtna1NRQ0JKQklrRWlTQVNKSUJFa2drU1FDQklKRWtFaVNBU0pJQkVrZ2tTUVNKQUlFa0VpU0FTSklCRWtFaVNDUkpBSUVrRWlTQVNKSUpFZ0VTU0NSSkFJRWtFaVNBU0pCSWtnRVNTQ1JKQUlFa0VpU0NSSUJJa2dFU1NDUkpBSUVrRWlRU0pJQklrZ0VTU0NSSkJJa0FnU1FTSklCSWtnRVNTQ1JJSkVpVVp5c3UzeXZtcmZjL2hFdm56Vi9yYVMybjg4ZG1hUW4xaTJ0dEJ1U01aazMyVExhbjU0N1o2U1ZhdXlBNVJiOHZtUkFYN2lnR3Y3ZWh5U2VrSFMwN3pXcmxpRHYyZHpGeVJKUlpMTnp0a1hiL0F6UCttR0pLbElzdGtOc1FhZnpjNytHWkxFSXNsdWlZY2ttMnVESkJGSW11ZjIxbHcwMUozeGtHU3pheUJKQXBJbndxLy9Pcmg5ZnY5UTUrWkxCcisrSzZ6enlQZGJIczBWeHIreEhFbi8ya0o1U09vQ3lhWHlYODZNWnQ5YU12Z05SZDk3NXAxYytaUE9JR3NUVW1LUUJNR2hxZUdqQzRjWS9LbUgramRYamtLU0xDVEIydkRScWY4TU1manU1WkdTSlpBa0RFaytlZ1BiUHRUZ0x5Nk9sT3lESkZsSWdvWGh3MThNT2ZpT0dlR3hSeUJKR0pLVjBVZVVvUWUvUFhvcTJRdEpzcEI4RkQ3ODV0Q0R6ODhLRDc0RlNiS1F2QkErL0VHTXdXOE1EOTRIU1RMZmsyeU5NZmlqMGV2Tk1VZ1MrZWxtWjV4bmh4bEZvaUJKQ0pMTjBUN0oyVGhJbmltNmdnTkpNcEFjbXphc2o3WHJ3cU1yaXRhdU9WMWNKeVQxaE9Udy9kRzdqRzJ4a0xTRVJ4Y1hyVTNlSmVBRUlUbFZtUEs4ZkN3azI4S2pDeUNwYnlSejF2VDI3QVBObGU0bkdSakoxOUdkQlpBazc4NjBBb25LU0ZxTHJobERraVFrcTRPWVNEYUVSNStDSkdGSW1yY0hjWkc4RVI1ZENVbWlrT1JXbkFoaUkxbFVkRFV3V3Z0Y2UzRS9sSC9qN3grK1YralR2eUVaUzBnV3JPOG9YbFVSU1ZldTZPYVQySnRwLzk3YVZOUVY5MEpTMjBobUxPMXQrYXAxTGQrZUxWdFZjZkRmUmM4KzU0YUg1SzZtMGw2Q1pJenNrd3hVeGNHdkNBOCtGZ3dQeWVReUpOZERVcWRJVGtldk5oOFBFMG1aa2FhcklhbFRKSzlFcnpaL2pnREpoQmQzVFdwcW1neEpmU0xaV2ZwYmZOVWdtZkJhRVB4MEpTUjFpdVI0ZERQSnRNN3FrZlFZZ2FSdWtSeU1qR1RYQmxVZ21mVFpUWkdSQTE1dWFxbHpPOVp0K1dWVWtIUzNSRGVlWkJmbHEwQXk4VUFRM0ZJd0Frbk50SGQyendoZno0OFl5Y25XMmYzYmIzZDNCRlVnbVhMaDBoKzM5UnVCcEZicW5ONDN3MDNWSUhteU5hemwzZWZuWDc2TGZ5aW9Ca25URFJmNi90cG5CSkphYVgzMFJqTmZCWkpCbXJVL3FBNUpxQ1EwQWttdHREU2E3SytqaG1SaFIxQXRrbDRsa1JGSWFxVmx4YjhsTTNJa3ViZTdnK3FSWEZMU2J3U1NXbWxUT01QcEYwY0ZTZTdWMDdIM1ZBYmVKNWt5c1FtU0dxdHJUdDhNMjRKUlFQTGcrNmZpNzZtVWRsWFp0WnRySWFtUmp2Zjg3MFROVzRNUklXbWV1MmpaNmgyZHc5aFRLZS9HTWlSM1FsSXJYZnh0eCs2ek5mRHYrT09hRWlQWG5ZZEVKWjEvK3ZhYkM5M3g4bjhCSktyL0lCRWtna1NRQ0JKQklrZ0VpUVNKSUJFa2drU1FhQ3doYVhBT1ZMbUdWTVpKVU9VeXFmUjRaMEdWR3BkT3BkS1pSaWRDZzlXWVNhZitCd3JXL2c0c0tPdERBQUFBQUVsRlRrU3VRbUNDXCIsXG4gICAgICBzdWNjZXNzVmlkZW86XG4gICAgICAgIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFmUUFBQUQ2Q0FZQUFBQlhxN1ZPQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBRWJCSlJFRlVlQUh0M1UrTW5IVVpCL0RmN0U3L2JtZVgxdTF1VzZCQVc2QkZnNml4dEFxYVlHSTBNUnpBdXhkT2V0S1ROOUVZcjU2OEtHZHZrcEJnb2pFUm83U1dKbWdRcVczQmlvSllPcnV0UzNmYjdqL0dtVFpkVzNaMk83T2RtZmQ5bi9sczBqRDd6anZ2KzNzK3p3TmZadWFkVG1seThtd3QrU0ZBZ0FBQkFnUUtMVEJRNk5WYlBBRUNCQWdRSUhCVlFLQWJCQUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQlFSa0NBUUhjRkZoWVcwNm5UcDFQMTNFU2FucG5wN3NsdTgrZ0RBd05wMDZhTmFYaDRKTzNjT1piR3g4YlM0T0RnYlI3Vnd3a1E2SVZBYVhMeWJLMFhKM0lPQXYwbzBBanpsNDhjVGRQVCtRN3lsWHF6ZnYzNnRHL2ZublR2UGJ0VEkrejlFQ0NRWHdIL2h1YTNOMVlXUUtEeHpMeW9ZZDdnbjV1YlN5ZE9uRXhIamg1TGx5OWZEdEFSSlJDSUt5RFE0L1pXWlRrUU9IZXVtb05WM1A0U3BxWStxTC9TOE1kMGNYcjY5Zy9tQ0FRSWRFVkFvSGVGMVVFSlhCT1ltYmtVaG1KMmRpNGRPM1pjcUlmcHFFS2lDYmdvTGxwSDFaTjdnY2I3MGlNakk3bFlaN1hhM2lzSTEwUDkwS01IVTZXeUpSYzFXQVFCQXRjRUJMcEpJTkJqZ1VhWVAzcndNejArYS9QVHZmakxYeTI3NDJQYnRxVmRkKzVNcDA2K21lYm01NWJkZnpYVVh6bWVoUG95R2hzSVpDcmdKZmRNK1oyY1FQNEVCdW9mVTd0bjk5M3BzY2NPMVQvQ3RxbnBBcStIdXZmVW0vTFlTQ0FUQVlHZUNidVRFc2kvd09iTm05UG5EaDljUGRTOXA1Ny9SbHBoM3dnSTlMNXB0VUlKdEMvUWVJWXUxTnQzOHdnQ1dRZ0k5Q3pVblpOQWdRU0Vlb0dhWmFsOUxTRFErN3I5aWlmUW1rQWoxQThmK216YXRIR1Y5OVM5L040YXByMElkRWxBb0hjSjFtRUpSQk5vdktkKytMQlFqOVpYOWNRUkVPaHhlcWtTQWwwWEVPcGRKM1lDQW1zV0VPaHJwdk5BQXYwcElOVDdzKytxenIrQVFNOS9qNnlRUU80RWhIcnVXbUpCQkpKQU53UUVDS3hKUUtpdmljMkRDSFJOUUtCM2pkYUJDY1FYYUNYVWo3L3k2dFd2WVkydm9VSUMyUW9JOUd6OW5aMUE0UVZ1RmVxWHIxeE9yNzMyMThMWHFRQUNlUmNRNkhudmtQVVJLSURBclVMOS9YUG4wdm56RndwUWlTVVNLSzZBUUM5dTc2eWNRSzRFYmhYcWI3NTFKbGZydFJnQzBRUUVlclNPcW9kQWhnS05VRDlZLzJyWVVxbTBiQlVURXhOcGZuNSsyWFliQ0JEb2pJRHZRKytNbzZNUUNDT3d1TGlZWm1ZdXJibWVnWUdCTkRxNkxWV3JremNkbzFhcnBXbzkxSGZ0M0huVGRyOFFJTkFaQVlIZUdVZEhJUkJHNFB6NTgrbWwzLzIrSy9WY21ybmNsZU02S0FFQ3llZlFEUUdCZmhZb2x3ZDdXdjdzM0d4UHorZGtCUHBKd0h2by9kUnR0Ukw0aUVDbFV2bklsaTcvV3V2eThSMmVRQjhMQ1BRK2JyN1NDZXpidXdjQ0FRSkJCQVI2a0VZcWc4QmFCTWJIeDlLQi9RODB2U3A5TGNmekdBSUVzaE53VVZ4MjlzNU1JQmNDZSt2UDBzZkh4MVBqWTJVemwrcFh0M2ZnWmZIR3g5UGUvZmQ3dWFqUElnajBpNEJBNzVkT3E1UEFLZ0pidGd5bHhwOU8vVFErOWliUU82WHBPQVJhRS9DU2UydE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdRRWVtdE85aUpBZ0FBQkFya1dFT2k1Ym8vRkVTQkFnQUNCMWdSY0ZOZWFrNzBJWkNZd05UV1YvbjdtN2ZvWG15eGt0b1k3UmlycC92djNwY2JmMCs2SEFJRjhDZ2owZlBiRnFnZ3NDYnh4NGxUOXU4VFBMLzJleFkxcXRacUdoNGZUenAwN3NqaTljeElnMElLQS85MXVBY2t1QkxJVW1KMjlrdVhwbDg1OVpkYmZ3NzZFNFFhQkhBb0k5QncyeFpJSUVDQkFnRUM3QWdLOVhUSDdFK2l4UUY3ZXR5NFA5dmFiMlhyTTdIUUVDaThnMEF2ZlFnVkVGN2p2dm50VHVaenQ1UzRqSThOcGJHeDdkR3IxRVNpMFFMYi9sU2cwbmNVVDZJM0E3cnZ2U28wL2ZnZ1FJTENhZ0dmb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRXhEb3ErbTRqd0FCQWdRSUZFUkFvQmVrVVpaSmdBQUJBZ1JXRTNCUjNHbzY3aU9RRTRFTEY2YlN3c0pjWnF1cFZJYlR4bzBiTWp1L0V4TWdjR3NCZ1g1ckkzc1F5RlRnOWRmZlNQLzgxenVacnFGVUtxVXZQUDc1Vktsc3lYUWRUazZBd01vQ1huSmYyY1k5QkhJaE1ERTVtZms2YXJWYW1zekJPaktIc0FBQ09SWVE2RGx1anFVUnlKTkFMVStMc1JZQ0JKWUpDUFJsSkRZUUlFQ0FBSUhpQ1FqMDR2WE1pdnRNWUhoNEpCY1YzekdTajNYa0FzTWlDT1JRd0VWeE9XeUtKUkc0VWVDVEQzOGlqWTl2VC9Qejh6ZHU3dW50UnBodjNYcEhUOC9wWkFRSXRDY2cwTnZ6c2plQm5ndVV5NFBwcmp0MzlmeThUa2lBUUxFRXZPUmVySDVaTFFFQ0JBZ1FhQ29nMEp1eTJFaUFBQUVDQklvbElOQ0wxUytySlVDQUFBRUNUUVVFZWxNV0d3a1FJRUNBUUxFRVhCUlhySDVaYlI4S1ZLdlZkT3JVVzJsK0lidXIzQnNmbld0Y2JkKzRRTThQQVFMNUZCRG8rZXlMVlJGWUVtaUUrWCtucHBaK3orTEd6TXlscXgrZGM3VjlGdnJPU2FBMUFZSGVtcE85Q0dRbWtPVXo4eHVMenZKejhEZXVvNTNiRitlcTZiMkxKOVBpaDYxL1U5Mkd3YUYwNS9CRGFXTjV1SjFUMlpkQTVnSUNQZk1XV0FBQkFwMFdxTlVXMC9Nbm4wMi8vY2ZQMW5UbzhzRDY5T1NEMzAxZnV1K2JhM3E4QnhISVFzQkZjVm1vT3llQk5nVFdsZGUxc1hmM2RsMjNMaC9yYUtYQzM1ejV5WnJEdkhIOGhmb3ordWYvOW9QMDU3TXZ0bkk2K3hESWhZQm42TGxvZzBVUVdGbmd3UWYzNWVLaXVCM2o0eXN2TW1mM0hIM241eDFaVWVNNG45cnh0WTRjeTBFSWRGdEFvSGRiMlBFSjNLYkE5dTNiVStPUG45WUZxcGZlYm4zblZmYWM2TkJ4VmptRnV3aDBUTUJMN2gyamRDQUNCSW9xTUZncXAyYysvZFAwdlM4ZVNkczIzYjFVUnEzMjRkSnROd2prWFVDZzU3MUQxa2VBUUZjRnJvWDVjL1dYMXA5TVkwTjcwN2NQL1NLdEc5elkxWE02T0lGdUNBajBicWc2SmdFQ2hSQzRIdVlQajMrbEVPdTFTQUtyQ1FqMDFYVGNSNEJBNFFVYUw2Ri81L0FMNmZIZDM3aXBsbVpoZnY3eU8rbkh4NTVPODR0WGJ0clhMd1NLSU9DaXVDSjB5Um9KRUZpVHdOQzZyZldYMEorLytyNzQzcTJQcHZMQXV2VFMyOCtsbGNQOHFkUUlkVDhFaWlnZzBJdllOV3NtUUtBbGdjcUcwVFN5Y2NmU3ZsOS82SWVwVkJwTTkyODduRzU4bWYzYU0zTmh2Z1RsUmlFRnZPUmV5TFpaTkFFQ3JRaWNuWDR6UGZlblo5Smk3ZjlmYlBQMGdlOEw4MWJ3N0ZNNEFZRmV1SlpaTUFFQzdRajg1ZjFmTHd2MTY0LzN6UHk2aEg5R0VCRG9FYnFvQmdJRVZoVm9GdXJDZkZVeWR4WlFRS0FYc0dtV1RJQkErd0kzaHJvd2I5L1BJL0l2NEtLNC9QZklDb01KVE5XLzIveVY0NjhHcStybWNoWVhGMi9la0pQZkdxSCtvejg4a1M3T1RxU1orUXM1V1pWbEVPaU1nRUR2aktPakVHaFpZRzV1TGxXcjFaYjNEN1ZqcVRmVlZOYVBwb3R6RTAxUDFyaFFydFdmeWdaL2gzNnJWdmJMWHNCTDd0bjN3QW9DQzJ3WkdncGNYZnVsRFczZTNQNkQxdkNJajQ4OXNZWkhMWC9JUTlzN2M1emxSN2FGUU9jRkJIcm5UUjJSd0pMQTlySFJwZHY5ZnFOVUtxWFIwZDU0UEhYZzJiU3JzdisyeVBlUFBwNit2T2RidDNVTUR5YlFTNEhTNU9UWldpOVA2RndFK2tsZ1lXRXh2WHprYUpxZW51bW5zcHZXZW1EL0EybnYzajFONyt2R3hzVVA1OUtyLzNraHZmdkJpZnJuME9kYVBzV0d3YUcwZStTUjlNaU9yOVlmMDZQM0NGcGVuUjBKckN3ZzBGZTJjUStCamdnMFF2M1U2ZE9wZW00aVRjLzBWN0NYeTRPcFVxbWtmZlVnSHg4ZjY0aW5neEFnMEZ4QW9EZDNzWlVBQVFJRUNCUkt3SHZvaFdxWHhSSWdRSUFBZ2VZQ0FyMjVpNjBFQ0JBZ1FLQlFBZ0s5VU8yeVdBSUVDQkFnMEZ4QW9EZDNzWlVBQVFJRUNCUktRS0FYcWwwV1M0QUFBUUlFbWdzSTlPWXV0aElnUUlBQWdVSUpDUFJDdGN0aUNSQWdRSUJBY3dHQjN0ekZWZ0lFQ0JBZ1VDZ0JnVjZvZGxrc0FRSUVDQkJvTHZBL0s0czNNM2o1MmhZQUFBQUFTVVZPUks1Q1lJST1cIixcbiAgICAgIHN1Y2Nlc3NNdWx0aXBsZTogXCIuL3Jlc291cmNlcy9pbWFnZXMvaWNvbnMvaWNvbi1tdWx0aXBsZWZpbGVzLnN2Z1wiLFxuICAgIH07XG5cbiAgICAvL3RoaXMuc2V0QXZhdGFySW1nU3JjKCk7XG4gICAgdGhpcy5ldmVudEhhbmRsZXIoKTtcbiAgfVxuXG4gIHNldEF2YXRhckltZ1NyYyhpbWFnZVNyYyA9IHRoaXMuYXZhdGFySW1hZ2UuZGVmYXVsdEltYWdlKSB7XG4gICAgdGhpcy5hdmF0YXJJbWcuc3JjID0gaW1hZ2VTcmM7XG4gICAgdGhpcy5zZXRFcmFzZUltYWdlQ29udGFpbmVyU3RhdGUoKTtcbiAgfVxuXG4gIGdldEF2YXRhckltZ1VybCgpIHtcbiAgICBsZXQgYXZhdGFySW1hZ2VVcmw7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgIHN3aXRjaCAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGF2YXRhckltZ1V0bCA9IHRoaXMuYXZhdGFySW1hZ2UuYmFzZUltYWdlO1xuICAgICAgICB0aGlzLmVyYXNlSW1hZ2VDb250YWluZXJTdGF0ZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0udHlwZS5tYXRjaChcImltYWdlL1wiKSkge1xuICAgICAgICAgIGF2YXRhckltYWdlVXJsID0gdGhpcy5jYWNoZWRGaWxlQXJyYXlbMF1bXCJkYXRhVXJsXCJdO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLnR5cGUubWF0Y2goXCJhcHBsaWNhdGlvbi9wZGZcIikpIHtcbiAgICAgICAgICBhdmF0YXJJbWFnZVVybCA9IHRoaXMuYXZhdGFySW1hZ2Uuc3VjY2Vzc1BkZjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheVswXS50eXBlLm1hdGNoKFwidmlkZW8vXCIpKSB7XG4gICAgICAgICAgYXZhdGFySW1hZ2VVcmwgPSB0aGlzLmF2YXRhckltYWdlLnN1Y2Nlc3NWaWRlbztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGF2YXRhckltYWdlVXJsID0gdGhpcy5hdmF0YXJJbWFnZS5zdWNjZXNzTXVsdGlwbGU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRBdmF0YXJJbWdTcmMoYXZhdGFySW1hZ2VVcmwpO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyKCkge1xuICAgIHRoaXMuaW5wdXRUeXBlRmlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMuZmlsZVVwbG9hZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVyYXNlSW1hZ2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiY2xpY2tcIixcbiAgICAgIHRoaXMuYXZhdGFySW1hZ2VUb0RlZmF1bHQuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBhdmF0YXJJbWFnZVRvRGVmYXVsdCgpIHtcbiAgICB0aGlzLmNhY2hlZEZpbGVBcnJheSA9IFtdO1xuICAgIHRoaXMuaW5wdXRUeXBlRmlsZS52YWx1ZSA9IFwiXCI7XG4gICAgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPSBcImhpZGRlblwiO1xuICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgdGhpcy5zZXRJbnB1dEZpbGVMYWJlbFRleHQoKTtcbiAgICB0aGlzLnNldEF2YXRhckltZ1NyYygpO1xuICB9XG5cbiAgZmlsZVVwbG9hZCgpIHtcbiAgICBsZXQgaW5wdXRmaWVsZEVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgbGV0IGZpbGVzVG9VcGxvYWQgPSBpbnB1dGZpZWxkRWxlbWVudC5maWxlcztcbiAgICBsZXQgdG90YWxGaWxlc1RvVXBsb2FkID0gaW5wdXRmaWVsZEVsZW1lbnQuZmlsZXMubGVuZ3RoO1xuXG4gICAgdGhpcy5jYWNoZWRGaWxlQXJyYXkgPSBbXTtcblxuICAgIG5ldyBQcm9taXNlKFxuICAgICAgZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZpbGVzVG9VcGxvYWQpLmZvckVhY2goXG4gICAgICAgICAgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheVtrZXldID0gZmlsZXNUb1VwbG9hZFtrZXldO1xuXG4gICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVzVG9VcGxvYWRba2V5XSk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV1bXCJkYXRhVXJsXCJdID0gcmVhZGVyLnJlc3VsdDtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5jYWNoZWRGaWxlQXJyYXkubGVuZ3RoIC0gMSA9PT0gcGFyc2VJbnQoa2V5KSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5jYWNoZWRGaWxlQXJyYXkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApLnRoZW4oXG4gICAgICBmdW5jdGlvbihmaWxlc0FycmF5QXNEYXRhVXJsKSB7XG4gICAgICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgICAgIHRoaXMuc2V0SW5wdXRGaWxlTGFiZWxUZXh0KCk7XG4gICAgICAgIHRoaXMuZ2V0QXZhdGFySW1nVXJsKCk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgc2V0SW5wdXROYW1lRmlsZVZhbHVlKCkge1xuICAgIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgdmFsdWUgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuY2FjaGVkRmlsZUFycmF5KS5mb3JFYWNoKFxuICAgICAgICBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAvLyBsZXQgbmV3QXJyYXkgPSBbJ2ZpbGVuYW1lJywgZGF0YV1cbiAgICAgICAgICB2YWx1ZS5wdXNoKHtcbiAgICAgICAgICAgIGRhdGFVcmw6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0uZGF0YVVybCxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0ubmFtZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgICAgdGhpcy5pbnB1dE5hbWVGaWxlLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlucHV0TmFtZUZpbGUudmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gIHNldElucHV0RmlsZUxhYmVsVGV4dCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID0gXCJzZWxlY3QgYSBmaWxlXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID0gdGhpcy5jYWNoZWRGaWxlQXJyYXlbMF0ubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheS5sZW5ndGggKyBcIiBmaWxlcyBzZWxlY3RlZFwiO1xuICAgIH1cbiAgfVxuXG4gIHNldEVyYXNlSW1hZ2VDb250YWluZXJTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuZXJhc2VJbWFnZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgNjU1XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVyYXNlSW1hZ2VCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICA1XG4gICAgICApO1xuICAgIH1cbiAgICAvLyAgIHRoaXMuZXJhc2VJbWFnZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0YXRlJywgdGhpcy5lcmFzZUltYWdlQ29udGFpbmVyU3RhdGUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZVVwbG9hZFNob3dQcmV2aWV1dztcbiIsIihmdW5jdGlvbigpIHtcclxuICBtZXRob2RzLm1vZHVsZXMubW91bnRBbGwoXCJib2R5XCIpO1xyXG4gIG1ldGhvZHMubW9kdWxlcy5pbml0QWxsKFwiYm9keVwiKTtcclxufSkoKTtcclxuIl19
