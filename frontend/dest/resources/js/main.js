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
      return contactItems[0] || undefined;
    },

    showContacts: function() {
      const contacts = methods.data.getContacts();
      const contactItemsUnit = elements.contactListItemsContainer.querySelector(
        selectors.contactListItemsUnit
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
        contactsToHTML,
        methods.contactInfo,
        "add",
        "click"
      );

      methods.eventListener.contactListButton(
        contactItemsUnit,
        methods.contactInfo,
        "remove",
        "click"
      );

      elements.contactListItemsContainer.replaceChild(
        contactsToHTML,
        contactItemsUnit
      );
      methods.elementWidth.buttonContainerListItems();
    },
  };

  methods.contactInfo = function(event) {
    console.log(methods.data.getContactById(event.currentTarget.value));
  };

  methods.eventListener = {
    contactListButton: function(
      elementNode,
      callFunction,
      listener = "add",
      type = "click"
    ) {
      [].slice
        .call(elementNode.getElementsByClassName("contact-list-item container"))
        .forEach(function(element) {
          methods.eventListener[listener](element, callFunction);
        });
    },
    add: function(element, callFunction, type = "click") {
      element.addEventListener(type, callFunction);
    },
    remove: function(element, callFunction, type = "click") {
      element.removeEventListener(type, callFunction);
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

  methods.setElements = function() {
    if (elements.contactListItemsContainer) {
      elements.contactListItemsUnit = elements.contactListItemsContainer.getElemenmtsByClassName(
        selectors.contactListItemsUnit.replace(/./g, " ").substr(1)
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
      elements.contactItemContainerButton = elements.contactItemContainer.querySelector(
        selectors.contactButtonContainer
      );
    }
  };

  methods.elementWidth = {
    buttonContainer: function() {
      methods.setElements();
      methods.elementWidth.buttonContainerListItems();
      methods.elementWidth.buttonContainerItem();
    },
    buttonContainerListItems: function() {
      console.log(elements.contactListItemsUnit.clientWidth);
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
      if (elements.contactItemContainer) {
        let contactItemContainerWidth =
          elements.contactItemContainer.clientWidth;

        elements.contactItemContainerButton.style.width =
          contactItemContainerWidth + "px";
      }
    },
  };

  methods.init = function(viewport) {
    if (elements.contactsContainer) {
      window.addEventListener("resize", methods.elementWidth.buttonContainer);
      //add class no scroll on html elemant
      let data = {
        element: document.documentElement,
        attributeValue: "no-scroll",
        attributeKey: "variant",
      };
      modules["general"].htmlElement.addAttributeValue(data);
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

      methods.elementWidth.buttonContainer();

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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiQAAAD6CAMAAACmhqw0AAACClBMVEUAAAD29u3u7unt7ent7enu7uju7uhYowBbpARcpQZdpghjqBFlqRRqrB1trSBuriJwryVysCh6tDWAtz2CuEKGukeQv1aVwV+Yw2OZw2SaxGWaxGebxGmfxm6hoqCio6Gio6KjpKOkpaSkyXempqSmp6WnqKanynqoqKaoqaepqqiqq6iqq6mqq6qqzH6rq6qrrKutrautrqyur6yvr62wsa6xsa+xsrCysrCys7Cys7Gzs7GztLGztLK0tbK0tbO1tbO1trS2t7W3t7W3uLa30pO4uba5ube5ure6u7e7vLm8vLq8vbu81Zq81Zy9vru91Z6+vry+v7y/v72/wL2/1qDAwL3Awb3Awb7Bwr7Cwr/Cw7/Dw8DDxMDDxMHD2KXExMHExMLFxcPFxsPGxsPG2qvHx8THyMTIyMXIycXJycbJysbKysfKy8fK27DK3LHLy8fLy8jLzMnMzMnNzcnNzsrPz8vP0MzQ0M3R0c3R0s7S0s/U1NDU1dHW19PX4sXY2NTY2NXY2dXZ2dXZ2dba2tXa2tba29bb29bb5Mrb5Mvc3Nfc3Njc3djc3dnd3dne3tre39vf39vg4Nvg59Ph4dzh4d3i4t3i4t7i6Nbj497k5N/k5ODl5eDl5eHl5uLl6drm5uHn5+Ln5+Po6OPp6eTq6uXq6+Lq7OPr6+bs7OXs7Oft7eft7ejA9tVyAAAAB3RSTlMAHKbl5uztvql9swAABYdJREFUeNrt3Gl3E2UYgOEkLRRFEPc9hAqICAqo4AaioiguiOKGiqAoUHGjQhWLIIgiiCjIItSqQAsR5z9K25mGJG06TfshzVz3F2jmbQ9nnutkeWdKKpXONAbSIDVm0qlUerwToUqNS6cyzoIql0k1OAmqXEPKOdBQQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEkAgSQSJIBIkgESQSJIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIJEgEiSARJIJEkAgSQSJBIkgEiSARJIJEkAgSCRJBIkgEiSARJIJEkEiQCBJBIkgEiSARJIJEgkSQCBJBIkgEiSCRIBEkgkSQCBJBIkgEiQSJIBEkgkSQCBJBIkgkSASJIBEkgkSQCBJBIkEiSASJIBEkgkSQCBIJEkEiSASJIBEkgkSQSJAIEkEiSASJIBEkEiSCRJAIEkEiSASJIJEgESSCRJAIEkEiSASJBIkgESSCRJAIEkEiSCRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEiUZysu3yvmrfc/hEvnzV/raS2n88dmaQn1i2ttBuSMZk32TLan547Z6SVauyA5Rb8vmRAX7igGv7ehySekHS07zWrliDv2dzFyRJRZLNztkXb/AzP+mGJKlIstkNsQafzc7+GZLEIsluiYckm2uDJBFImuf21lw01J3xkGSzayBJApInwq//Orh9fv9Q5+ZLBr++K6zzyPdbHs0Vxr+xHEn/2kJ5SOoCyaXyX86MZt9aMvgNRd975p1c+ZPOIGsTUmKQBMGhqeGjC4cY/KmH+jdXjkKSLCTB2vDRqf8MMfju5ZGSJZAkDEk+egPbPtTgLy6OlOyDJFlIgoXhw18MOfiOGeGxRyBJGJKV0UeUoQe/PXoq2QtJspB8FD785tCDz88KD74FSbKQvBA+/EGMwW8MD94HSTLfk2yNMfij0evNMUgS+elmZ5xnhxlFoiBJCJLN0T7J2ThInim6ggNJMpAcmzasj7XrwqMritauOV1cJyT1hOTw/dG7jG2xkLSERxcXrU3eJeAEITlVmPK8fCwk28KjCyCpbyRz1vT27APNle4nGRjJ19GdBZAk7860AonKSFqLrhlDkiQkq4OYSDaER5+CJGFImrcHcZG8ER5dCUmikORWnAhiI1lUdDUwWvtce3E/lH/j7x++V+jTvyEZS0gWrO8oXlURSVeu6OaT2Jtp/97aVNQV90JS20hmLO1t+ap1Ld+eLVtVcfDfRc8+54aH5K6m0l6CZIzskwxUxcGvCA8+FgwPyeQyJNdDUqdITkevNh8PE0mZkaarIalTJK9ErzZ/jgDJhBd3TWpqmgxJfSLZWfpbfNUgmfBaEPx0JSR1iuR4dDPJtM7qkfQYgaRukRyMjGTXBlUgmfTZTZGRA15uaqlzO9Zt+WVUkHS3RDeeZBflq0Ay8UAQ3FIwAknNtHd2zwhfz48YycnW2f3bb3d3BFUgmXLh0h+39RuBpFbqnN43w03VIHmyNazl3efnX76LfyioBknTDRf6/tpnBJJaaX30RjNfBZJBmrU/qA5JqCQ0AkmttDSa7K+jhmRhR1Atkl4lkRFIaqVlxb8lM3Ikube7g+qRXFLSbwSSWmlTOMPpF0cFSe7V07H3VAbeJ5kysQmSGqtrTt8M24JRQPLg+6fi76mUdlXZtZtrIamRjvf870TNW4MRIWmeu2jZ6h2dw9hTKe/GMiR3QlIrXfxtx+6zNfDv+OOaEiPXnYdEJZ1/+vabC93x8n8BJKr/IBEkgkSQCBJBIkgEiQSJIBEkgkSQaCwhaXAOVLmGVMZJUOUyqfR4Z0GVGpdOpdKZRidCg9WYSaf+BwrW/g4sKOtDAAAAAElFTkSuQmCC",
      successVideo:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAD6CAYAAABXq7VOAAAABGdBTUEAALGPC/xhBQAAEbBJREFUeAHt3U+MnHUZB/Df7E7/bmeX1u1uW6BAW6BFg6ixtAqaYGI0MRzAuxdOetKTN9EYr568KGdvkpBgojERo7SWJmgQqW3BioJYOrutS3fb7j/GmTZdW3Z2O7Odmfd9n/ls0jD7zjvv+3s+zwNfZuadTmly8mwt+SFAgAABAgQKLTBQ6NVbPAECBAgQIHBVQKAbBAIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECAg0M0AAQIECBAIICDQAzRRCQQIECBAQKCbAQIECBAgEEBAoAdoohIIECBAgIBANwMECBAgQCCAgEAP0EQlECBAgAABgW4GCBAgQIBAAAGBHqCJSiBAgAABAgLdDBAgQIAAgQACAj1AE5VAgAABAgQEuhkgQIAAAQIBBAR6gCYqgQABAgQICHQzQIAAAQIEAggI9ABNVAIBAgQIEBDoZoAAAQIECAQQEOgBmqgEAgQIECBQRkCAQHcFFhYW06nTp1P13ESanpnp7slu8+gDAwNp06aNaXh4JO3cOZbGx8bS4ODgbR7VwwkQ6IVAaXLybK0XJ3IOAv0o0Ajzl48cTdPT+Q7ylXqzfv36tG/fnnTvPbtTI+z9ECCQXwH/hua3N1YWQKDxzLyoYd7gn5ubSydOnExHjh5Lly9fDtARJRCIKyDQ4/ZWZTkQOHeumoNV3P4SpqY+qL/S8Md0cXr69g/mCAQIdEVAoHeF1UEJXBOYmbkUhmJ2di4dO3ZcqIfpqEKiCbgoLlpH1ZN7gcb70iMjI7lYZ7Xa3isI10P90KMHU6WyJRc1WAQBAtcEBLpJINBjgUaYP3rwMz0+a/PTvfjLXy2742PbtqVdd+5Mp06+mebm55bdfzXUXzmehPoyGhsIZCrgJfdM+Z2cQP4EBuofU7tn993psccO1T/CtqnpAq+HuvfUm/LYSCATAYGeCbuTEsi/wObNm9PnDh9cPdS9p57/Rlph3wgI9L5ptUIJtC/QeIYu1Nt38wgCWQgI9CzUnZNAgQSEeoGaZal9LSDQ+7r9iifQmkAj1A8f+mzatHGV99S9/N4apr0IdElAoHcJ1mEJRBNovKd++LBQj9ZX9cQREOhxeqkSAl0XEOpdJ3YCAmsWEOhrpvNAAv0pINT7s++qzr+AQM9/j6yQQO4EhHruWmJBBJJANwQECKxJQKivic2DCHRNQKB3jdaBCcQXaCXUj7/y6tWvYY2voUIC2QoI9Gz9nZ1A4QVuFeqXr1xOr73218LXqQACeRcQ6HnvkPURKIDArUL9/XPn0vnzFwpQiSUSKK6AQC9u76ycQK4EbhXqb751JlfrtRgC0QQEerSOqodAhgKNUD9Y/2rYUqm0bBUTExNpfn5+2XYbCBDojIDvQ++Mo6MQCCOwuLiYZmYurbmegYGBNDq6LVWrkzcdo1arpWo91Hft3HnTdr8QINAZAYHeGUdHIRBG4Pz58+ml3/2+K/VcmrncleM6KAECyefQDQGBfhYolwd7Wv7s3GxPz+dkBPpJwHvo/dRttRL4iEClUvnIli7/Wuvy8R2eQB8LCPQ+br7SCezbuwcCAQJBBAR6kEYqg8BaBMbHx9KB/Q80vSp9LcfzGAIEshNwUVx29s5MIBcCe+vP0sfHx1PjY2Uzl+pXt3fgZfHGx9Pe/fd7uajPIgj0i4BA75dOq5PAKgJbtgylxp9O/TQ+9ibQO6XpOARaE/CSe2tO9iJAgAABArkWEOi5bo/FESBAgACB1gQEemtO9iJAgAABArkWEOi5bo/FESBAgACB1gRcFNeak70IZCYwNTWV/n7m7foXmyxktoY7Rirp/vv3pcbf0+6HAIF8Cgj0fPbFqggsCbxx4lT9u8TPL/2exY1qtZqGh4fTzp07sji9cxIg0IKA/91uAckuBLIUmJ29kuXpl859Zdbfw76E4QaBHAoI9Bw2xZIIECBAgEC7AgK9XTH7E+ixQF7ety4P9vab2XrM7HQECi8g0AvfQgVEF7jvvntTuZzt5S4jI8NpbGx7dGr1ESi0QLb/lSg0ncUT6I3A7rvvSo0/fggQILCagGfoq+m4jwABAgQIFERAoBekUZZJgAABAgRWExDoq+m4jwABAgQIFERAoBekUZZJgAABAgRWE3BR3Go67iOQE4ELF6bSwsJcZqupVIbTxo0bMju/ExMgcGsBgX5rI3sQyFTg9dffSP/81zuZrqFUKqUvPP75VKlsyXQdTk6AwMoCXnJf2cY9BHIhMDE5mfk6arVamszBOjKHsAACORYQ6DlujqURyJNALU+LsRYCBJYJCPRlJDYQIECAAIHiCQj04vXMivtMYHh4JBcV3zGSj3XkAsMiCORQwEVxOWyKJRG4UeCTD38ijY9vT/Pz8zdu7untRphv3XpHT8/pZAQItCcg0NvzsjeBnguUy4Pprjt39fy8TkiAQLEEvORerH5ZLQECBAgQaCog0Juy2EiAAAECBIolINCL1S+rJUCAAAECTQUEelMWGwkQIECAQLEEXBRXrH5ZbR8KVKvVdOrUW2l+Ibur3BsfnWtcbd+4QM8PAQL5FBDo+eyLVRFYEmiE+X+nppZ+z+LGzMylqx+dc7V9FvrOSaA1AYHempO9CGQmkOUz8xuLzvJz8Deuo53bF+eq6b2LJ9Pih61/U92GwaF05/BDaWN5uJ1T2ZdA5gICPfMWWAABAp0WqNUW0/Mnn02//cfP1nTo8sD69OSD301fuu+ba3q8BxHIQsBFcVmoOyeBNgTWlde1sXf3dl23Lh/raKXC35z5yZrDvHH8hfoz+uf/9oP057MvtnI6+xDIhYBn6Llog0UQWFngwQf35eKiuB3j4ysvMmf3HH3n5x1ZUeM4n9rxtY4cy0EIdFtAoHdb2PEJ3KbA9u3bU+OPn9YFqpfebn3nVfac6NBxVjmFuwh0TMBL7h2jdCACBIoqMFgqp2c+/dP0vS8eSds23b1URq324dJtNwjkXUCg571D1keAQFcFroX5c/WX1p9MY0N707cP/SKtG9zY1XM6OIFuCAj0bqg6JgEChRC4HuYPj3+lEOu1SAKrCQj01XTcR4BA4QUaL6F/5/AL6fHd37iplmZhfv7yO+nHx55O84tXbtrXLwSKIOCiuCJ0yRoJEFiTwNC6rfWX0J+/+r743q2PpvLAuvTS28+llcP8qdQIdT8Eiigg0IvYNWsmQKAlgcqG0TSyccfSvl9/6IepVBpM9287nG58mf3aM3NhvgTlRiEFvOReyLZZNAECrQicnX4zPfenZ9Ji7f9fbPP0ge8L81bw7FM4AYFeuJZZMAEC7Qj85f1fLwv164/3zPy6hH9GEBDoEbqoBgIEVhVoFurCfFUydxZQQKAXsGmWTIBA+wI3hrowb9/PI/Iv4KK4/PfICoMJTNW/2/yV468Gq+rmchYXF2/ekJPfGqH+oz88kS7OTqSZ+Qs5WZVlEOiMgEDvjKOjEGhZYG5uLlWr1Zb3D7VjqTfVVNaPpotzE01P1rhQrtWfygZ/h36rVvbLXsBL7tn3wAoCC2wZGgpcXfulDW3e3P6D1vCIj489sYZHLX/IQ9s7c5zlR7aFQOcFBHrnTR2RwJLA9rHRpdv9fqNUKqXR0d54PHXg2bSrsv+2yPePPp6+vOdbt3UMDybQS4HS5OTZWi9P6FwE+klgYWExvXzkaJqenumnspvWemD/A2nv3j1N7+vGxsUP59Kr/3khvfvBifrn0OdaPsWGwaG0e+SR9MiOr9Yf06P3CFpenR0JrCwg0Fe2cQ+Bjgg0Qv3U6dOpem4iTc/0V7CXy4OpUqmkffUgHx8f64ingxAg0FxAoDd3sZUAAQIECBRKwHvohWqXxRIgQIAAgeYCAr25i60ECBAgQKBQAgK9UO2yWAIECBAg0FxAoDd3sZUAAQIECBRKQKAXql0WS4AAAQIEmgsI9OYuthIgQIAAgUIJCPRCtctiCRAgQIBAcwGB3tzFVgIECBAgUCgBgV6odlksAQIECBBoLvA/K4s3M3j52hYAAAAASUVORK5CYII=",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRhY3RzLmpzIiwiZmlsZXVwbG9hZC5qcyIsImZvcm0uanMiLCJtb2R1bGVzLmpzIiwib3V0bGluZS5qcyIsImZpbGUtdXBsb2FkLmpzIiwiZGVmYXVsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbW9kdWxlcyA9ICh3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9KTtcblxubW9kdWxlc1tcImFwaS1mb3JtXCJdID0gKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgZWxlbWVudHMsIG1ldGhvZHMsIHNlbGVjdG9ycywgc3RhdGUsIGNvbnRhY3RJdGVtcztcblxuICBlbGVtZW50cyA9IHt9O1xuICBtZXRob2RzID0ge307XG4gIHNlbGVjdG9ycyA9IHtcbiAgICB2aWV3cG9ydDogXCJib2R5XCIsXG5cbiAgICBjb250YWluZXI6ICcuY29udGFpbmVyW3ZhcmlhbnQ9XCJhcGktZm9ybVwiXScsXG5cbiAgICBmb3JtQ29udGFpbmVyOiAnLmNvbnRhaW5lclt2YXJpYW50fj1cImFwaS1mb3JtXCJdJyxcbiAgICBmb3JtRWxlbWVudDogJ1t2YXJpYW50PVwiYXBpLWZvcm1cIl0gZm9ybScsXG4gICAgZm9ybUZ1bGxGb3JtOiAnW3ZhcmlhbnQ9XCJmdWxsLWZvcm1cIl0nLFxuXG4gICAgZm9ybUJ1dHRvbjogXCIuc3VibWl0LWJ1dHRvblwiLFxuXG4gICAgZGF0ZUZpZWxkQ29udGFpbmVyOiAnW3ZhcmlhbnQ9XCJkYXRlXCJdJyxcblxuICAgIHJlcXVpcmVkRmllbGRzOiBcImlucHV0W2RhdGEtcmVxdWlyZWRdXCIsXG4gICAgZm9ybVBvc3RlZENvbnRhaW5lcjogJ1t2YXJpYW50fj1cImN1c3RvbS1mb3JtLXBvc3RlZFwiXScsXG4gICAgZXJyb3JNZXNzYWdlQ29udGFpbmVyOiAnW3ZhcmlhbnR+PVwiZXJyb3ItbWVzc2FnZVwiXScsXG4gIH07XG4gIHN0YXRlID0ge307XG4gIGNvbnRhY3RJdGVtcyA9IHt9O1xuXG4gIG1ldGhvZHMuZm9ybSA9IHtcbiAgICBhZGRJdGVtOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIGZvcm1FbGVtZW50cyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZWxlbWVudHM7XG4gICAgICB2YXIgcG9zdERhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgICAgLmNhbGwoZm9ybUVsZW1lbnRzKVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGRhdGEsIGl0ZW0sIGN1cnJlbnRJbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUgPT09IFwiZmlsZVwiKSB7XG4gICAgICAgICAgICAgIGRhdGFbaXRlbS5uYW1lXSA9IEpTT04ucGFyc2UoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3Bvc3RzXCIsIHtcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2Uub2sgPT09IHRydWUgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRlbGV0ZUl0ZW06IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgY3VycmVudEVsZW1lbnQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIGdldFBhcmVudEVsZW1lbnQ6IHtcbiAgICAgICAgICBvbkF0dHJpYnV0ZTogXCJjbGFzc1wiLFxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImNvbnRhY3QtaXRlbSBjb250YWluZXJcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHZhciBkZWxldGVkRWxlbWVudCA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmdldENsb3Nlc3RQYXJlbnROb2RlKFxuICAgICAgICBkYXRhXG4gICAgICApO1xuXG4gICAgICBmZXRjaChldmVudC5jdXJyZW50VGFyZ2V0LmFjdGlvbiwge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJkZWxldGVcIixcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5vayA9PT0gdHJ1ZSAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgZGVsZXRlZEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuZGF0YSA9IHtcbiAgICBnZXRDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0c1wiKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5vayAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHJlc3BvbnNlLmpzb24oKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zZXRDb250YWN0cyhqc29uKTtcbiAgICAgICAgICAgIG1ldGhvZHMuZGF0YS5zaG93Q29udGFjdHMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiTmV0d29yayByZXF1ZXN0IGZvciBwcm9kdWN0cy5qc29uIGZhaWxlZCB3aXRoIHJlc3BvbnNlIFwiICtcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzICtcbiAgICAgICAgICAgICAgXCI6IFwiICtcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRDb250YWN0czogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgY29udGFjdEl0ZW1zID0gZGF0YTtcbiAgICB9LFxuXG4gICAgY29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNvbnRhY3RJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250YWN0SXRlbXM7XG4gICAgfSxcblxuICAgIHNob3dDb250YWN0czogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjb250YWN0cyA9IG1ldGhvZHMuZGF0YS5jb250YWN0cygpO1xuICAgICAgY29uc3QgY29udGFjdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmNvbnRhY3QtaXRlbXMuY29udGFpbmVyXCJcbiAgICAgICk7XG5cbiAgICAgIGxldCBjb250YWN0c1RvSFRNTCA9IGNvbnRhY3RzLnJlZHVjZShmdW5jdGlvbihcbiAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lcixcbiAgICAgICAgY3VycmVudENvbnRhY3QsXG4gICAgICAgIGN1cnJlbnRJbmRleCxcbiAgICAgICAgYXJyYXlcbiAgICAgICkge1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgLy8gY3JlYXRlIGNvbnRlbnQtaXRlbXMgY29udGFpbmVyIHdoZW4gdGhlIHJlZHVjZXIgaW5kZXggPSAwXG4gICAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lciA9IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWl0ZW1zIGNvbnRhaW5lclwiLFxuICAgICAgICAgICAgbm9kZU5hbWU6IFwiYXJ0aWNsZVwiLFxuICAgICAgICAgIH07XG4gICAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lciA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICBkYXRhQ29udGFjdEl0ZW1zQ29udGFpbmVyXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnRhY3QgaXRlbSBjb250YWluZXJcbiAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtQ29udGFpbmVyID0ge1xuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWl0ZW0gY29udGFpbmVyXCIsXG4gICAgICAgICAgbm9kZU5hbWU6IFwic2VjdGlvblwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudENvbnRhaW5lckVsZW1lbnQgPSBtb2R1bGVzW1xuICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhQ29udGFjdEl0ZW1Db250YWluZXIpO1xuXG4gICAgICAgIC8vIEF2YXRhciBjb250YWluZXJcbiAgICAgICAgY29uc3QgYXZhdGFyQ29udGFpbmVyID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiYXZhdGFyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY2xhc3NOYW1lOiBcImNvbnRhY3QtbmFtZSBjb250YWluZXJcIixcbiAgICAgICAgICBub2RlTmFtZTogXCJkaXZcIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRBdmF0YXJDb250YWluZXIgPSBtb2R1bGVzW1xuICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChhdmF0YXJDb250YWluZXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50Q29udGFjdCk7XG4gICAgICAgIGN1cnJlbnRBdmF0YXJDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cbiAgICAgICAgICBcInVybCgnXCIgKyBjdXJyZW50Q29udGFjdC5maWxlWzBdLmRhdGFVcmwgKyBcIicpXCI7XG5cbiAgICAgICAgLy8gQ29udGFjdCBOYW1lIGNvbnRhaW5lciBhbmQgY2hpbGRzXG4gICAgICAgIGNvbnN0IGRhdGFOYW1lQ29udGFpbmVyID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LW5hbWUgY29udGFpbmVyXCIsXG4gICAgICAgICAgbm9kZU5hbWU6IFwiZGl2XCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50TmFtZUNvbnRhaW5lciA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgZGF0YU5hbWVDb250YWluZXJcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50Q29udGFjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICBjdXJyZW50Q29udGFjdC5maXJzdG5hbWUgKyBcIiBcIiArIGN1cnJlbnRDb250YWN0Lmxhc3RuYW1lXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnROYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRDb250YWN0TmFtZSk7XG5cbiAgICAgICAgLy8gQ29udGFjdCBQaG9uZSBjb250YWluZXIgYW5kIGNoaWxkc1xuICAgICAgICBjb25zdCBkYXRhUGhvbmVDb250YWluZXIgPSB7XG4gICAgICAgICAgYWRkQXR0cmlidXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJwaG9uZW51bWJlclwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LXBob25lIGNvbnRhaW5lclwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudFBob25lQ29udGFpbmVyID0gbW9kdWxlc1tcbiAgICAgICAgICBcImdlbmVyYWxcIlxuICAgICAgICBdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YVBob25lQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBDb250YWN0IHBob25lIHdvcmsgbGFiZWxcbiAgICAgICAgY29uc3QgZGF0YVBob25lTGFiZWwgPSB7XG4gICAgICAgICAgYWRkQXR0cmlidXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJsYWJlbFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LXBob25lIHVuaXRcIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICBkYXRhUGhvbmVMYWJlbFxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG5cbiAgICAgICAgLy8gQ29udGFjdCBwaG9uZSB3b3JrIHZhbHVlXG4gICAgICAgIGNvbnN0IGRhdGFQaG9uZVZhbHVlID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwidmFsdWVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1waG9uZSB1bml0XCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVWYWx1ZVdvcmsgPSBtb2R1bGVzW1xuICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhUGhvbmVWYWx1ZSk7XG5cbiAgICAgICAgbGV0IGN1cnJlbnRQaG9uZUxhYmVsV29ya1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIndvcmtcIik7XG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbFdvcmtVbml0ID0gY3VycmVudFBob25lTGFiZWw7XG4gICAgICAgIGxldCBjdXJyZW50UGhvbmVMYWJlbFdvcmsgPSBjdXJyZW50UGhvbmVMYWJlbEVsZW1lbnQ7XG5cbiAgICAgICAgY3VycmVudFBob25lTGFiZWxXb3JrLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUxhYmVsV29ya1RleHQpO1xuICAgICAgICBjdXJyZW50UGhvbmVMYWJlbFdvcmtVbml0LmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUxhYmVsV29yayk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFBob25lVmFsdWVXb3JrVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFxuICAgICAgICAgIGN1cnJlbnRDb250YWN0LnBob25lV29yayB8fCBcIlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgY3VycmVudFBob25lVmFsdWVXb3JrLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZVZhbHVlV29ya1RleHQpO1xuXG4gICAgICAgIGN1cnJlbnRQaG9uZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50UGhvbmVMYWJlbFdvcmtVbml0KTtcbiAgICAgICAgY3VycmVudFBob25lQ29udGFpbmVyLmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZVZhbHVlV29yayk7XG5cbiAgICAgICAgLy8gQ29udGFjdCBSZW1vdmUgY29udGFpbmVyIGFuZCBjaGlsZHNcbiAgICAgICAgY29uc3QgZGF0YVJlbW92ZUNvbnRhaW5lciA9IHtcbiAgICAgICAgICBhZGRBdHRyaWJ1dGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJ2YXJpYW50XCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcImRlbGV0ZVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWRlbGV0ZSBjb250YWluZXJcIixcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGN1cnJlbnRSZW1vdmVDb250YWluZXIgPSBtb2R1bGVzW1xuICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhUmVtb3ZlQ29udGFpbmVyKTtcblxuICAgICAgICBjb25zdCBkYXRhQnV0dG9uID0ge1xuICAgICAgICAgIGFkZEF0dHJpYnV0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlS2V5OiBcInR5cGVcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwic3VibWl0XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgbm9kZU5hbWU6IFwiYnV0dG9uXCIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBjdXJyZW50UmVtb3ZlQnV0dG9uID0gbW9kdWxlc1tcImdlbmVyYWxcIl0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICBkYXRhQnV0dG9uXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRSZW1vdmVCdXR0b25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXG4gICAgICAgICAgXCJSZW1vdmUgY29udGFjdFwiXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnRSZW1vdmVCdXR0b24uYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUJ1dHRvblRleHQpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRDb250YWN0UmVtb3ZlVXJsID1cbiAgICAgICAgICBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wb3N0cy9cIiArIGN1cnJlbnRDb250YWN0LmlkO1xuXG4gICAgICAgIGNvbnN0IGRhdGFSZW1vdmVGb3JtID0ge1xuICAgICAgICAgIG5vZGVOYW1lOiBcImZvcm1cIixcbiAgICAgICAgICBjbGFzc05hbWU6IFwiY29udGFjdC1kZWxldGUgY29udGFpbmVyXCIsXG4gICAgICAgICAgYWRkQXR0cmlidXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiYWN0aW9uXCIsXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBjdXJyZW50Q29udGFjdFJlbW92ZVVybCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUtleTogXCJtZXRob2RcIixcbiAgICAgICAgICAgICAgYXR0cmlidXRlVmFsdWU6IFwiZGVsZXRlXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVLZXk6IFwidmFyaWFudFwiLFxuICAgICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJkZWxldGVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgY3VycmVudFJlbW92ZUZvcm0gPSBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgIGRhdGFSZW1vdmVGb3JtXG4gICAgICAgICk7XG5cbiAgICAgICAgY3VycmVudFJlbW92ZUZvcm0uYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgY3VycmVudFJlbW92ZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBtZXRob2RzLmZvcm0uZGVsZXRlSXRlbSk7XG4gICAgICAgIGN1cnJlbnRSZW1vdmVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudFJlbW92ZUZvcm0pO1xuXG4gICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRBdmF0YXJDb250YWluZXIpO1xuICAgICAgICBjdXJyZW50Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50TmFtZUNvbnRhaW5lcik7XG4gICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRQaG9uZUNvbnRhaW5lcik7XG4gICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGN1cnJlbnRSZW1vdmVDb250YWluZXIpO1xuXG4gICAgICAgIG5ld0NvbnRhY3RDb250YWluZXIuYXBwZW5kQ2hpbGQoY3VycmVudENvbnRhaW5lckVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gbmV3Q29udGFjdENvbnRhaW5lcjtcbiAgICAgIH0sIFtdKTtcblxuICAgICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpXG4gICAgICAgIC5yZXBsYWNlQ2hpbGQoY29udGFjdHNUb0hUTUwsIGNvbnRhY3RDb250YWluZXIpO1xuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5tb3VudCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgdmlld3BvcnQgPSB2aWV3cG9ydCB8fCBkb2N1bWVudDtcbiAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgICBlbGVtZW50cy52aWV3cG9ydCA9XG4gICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICAgIGVsZW1lbnRzLmZvcm1Db250YWluZXIgPSBmb3VuZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuaW5pdCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcbiAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50ID1cbiAgICAgICAgZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5mb3JtRWxlbWVudCkgfHxcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBPYmplY3Qua2V5cyhlbGVtZW50cy5mb3JtRWxlbWVudCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgZWxlbWVudHMuZm9ybUVsZW1lbnRba2V5XS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwic3VibWl0XCIsXG4gICAgICAgICAgbWV0aG9kcy5mb3JtLmFkZEl0ZW1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHMoKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xuICAgIGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xuICAgICAgT2JqZWN0LmtleXMoZWxlbWVudHMuZm9ybUVsZW1lbnQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGVsZW1lbnRzLmZvcm1FbGVtZW50W2tleV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcInN1Ym1pdFwiLFxuICAgICAgICAgIG1ldGhvZHMuZm9ybS5hZGRJdGVtXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcbiAgICBpbml0OiBtZXRob2RzLmluaXQsXG4gICAgdW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG5cbiAgICBzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lcixcbiAgfTtcbn0pKCk7XG4iLCJ2YXIgbW9kdWxlcyA9ICh3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9KTtcblxubW9kdWxlc1tcImNvbnRhY3RzXCJdID0gKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgZWxlbWVudHMsIG1ldGhvZHMsIHN0YXRlLCBjb250YWN0SXRlbXM7XG5cbiAgZWxlbWVudHMgPSB7fTtcbiAgbWV0aG9kcyA9IHt9O1xuICBzdGF0ZSA9IHt9O1xuICBjb25zdCBzZWxlY3RvcnMgPSB7XG4gICAgdmlld3BvcnQ6IFwiYm9keVwiLFxuICAgIGNvbnRhaW5lcjogJy5jb250YWluZXJbdmFyaWFudH49XCJjb250YWN0c1wiXScsXG4gICAgY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcjogXCIuY29udGFjdC1saXN0LWl0ZW1zLmNvbnRhaW5lclwiLFxuICAgIGNvbnRhY3RMaXN0SXRlbXNVbml0OiBcIi5jb250YWN0LWxpc3QtaXRlbXMudW5pdFwiLFxuICAgIGNvbnRhY3RMaXN0SXRlbXNTZWFyY2hDb250YWluZXI6IFwiLmNvbnRhY3QtbGlzdC1zZWFyY2guY29udGFpbmVyXCIsXG4gICAgY29udGFjdEl0ZW1Db250YWluZXI6IFwiLmNvbnRhY3QtaXRlbS53cmFwcGVyXCIsXG4gICAgY29udGFjdEl0ZW1Vbml0OiBcIi5jb250YWN0LWl0ZW0udW5pdFwiLFxuICAgIGNvbnRhY3RCdXR0b25Db250YWluZXI6IFwiLmNvbnRhY3QtYnV0dG9uLmNvbnRhaW5lclwiLFxuICB9O1xuXG4gIGNvbnRhY3RJdGVtcyA9IHt9O1xuXG4gIG1ldGhvZHMuZGF0YSA9IHtcbiAgICBnZXRDb250YWN0c0Zyb21BcGk6IGZ1bmN0aW9uKCkge1xuICAgICAgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcG9zdHNcIikudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uub2sgJiYgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNwb25zZS5qc29uKCkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuc2V0Q29udGFjdHMoanNvbik7XG4gICAgICAgICAgICBtZXRob2RzLmRhdGEuc2hvd0NvbnRhY3RzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIk5ldHdvcmsgcmVxdWVzdCBmb3IgcHJvZHVjdHMuanNvbiBmYWlsZWQgd2l0aCByZXNwb25zZSBcIiArXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyArXG4gICAgICAgICAgICAgIFwiOiBcIiArXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c1RleHRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0Q29udGFjdHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGNvbnRhY3RJdGVtcyA9IGRhdGE7XG4gICAgfSxcblxuICAgIGdldENvbnRhY3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250YWN0SXRlbXM7XG4gICAgfSxcblxuICAgIGdldENvbnRhY3RCeUlkOiBmdW5jdGlvbihjb250YWN0SWQpIHtcbiAgICAgIGlmIChjb250YWN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG1ldGhvZHMuZGF0YS5nZXRDb250YWN0c0Zyb21BcGkoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250YWN0SXRlbXNbMF0gfHwgdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICBzaG93Q29udGFjdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29udGFjdHMgPSBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHMoKTtcbiAgICAgIGNvbnN0IGNvbnRhY3RJdGVtc1VuaXQgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0TGlzdEl0ZW1zVW5pdFxuICAgICAgKTtcblxuICAgICAgaWYgKCFjb250YWN0SXRlbXNVbml0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGxldCBjb250YWN0c1RvSFRNTCA9IGNvbnRhY3RzLnJlZHVjZShmdW5jdGlvbihcbiAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lcixcbiAgICAgICAgY3VycmVudENvbnRhY3QsXG4gICAgICAgIGN1cnJlbnRJbmRleCxcbiAgICAgICAgYXJyYXlcbiAgICAgICkge1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgLy8gY3JlYXRlIGNvbnRlbnQtaXRlbXMgY29udGFpbmVyIHdoZW4gdGhlIHJlZHVjZXIgaW5kZXggPSAwXG4gICAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtc0NvbnRhaW5lciA9IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWxpc3QtaXRlbXMgdW5pdFwiLFxuICAgICAgICAgICAgbm9kZU5hbWU6IFwiYXJ0aWNsZVwiLFxuICAgICAgICAgIH07XG4gICAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lciA9IG1vZHVsZXNbXCJnZW5lcmFsXCJdLmh0bWxFbGVtZW50LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICBkYXRhQ29udGFjdEl0ZW1zQ29udGFpbmVyXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnRhY3QgaXRlbSBjb250YWluZXJcbiAgICAgICAgY29uc3QgZGF0YUNvbnRhY3RJdGVtQ29udGFpbmVyID0ge1xuICAgICAgICAgIGNsYXNzTmFtZTogXCJjb250YWN0LWxpc3QtaXRlbSB3cmFwcGVyXCIsXG4gICAgICAgICAgbm9kZU5hbWU6IFwic2VjdGlvblwiLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgY3VycmVudENvbnRhaW5lckVsZW1lbnQgPSBtb2R1bGVzW1xuICAgICAgICAgIFwiZ2VuZXJhbFwiXG4gICAgICAgIF0uaHRtbEVsZW1lbnQuY3JlYXRlRWxlbWVudChkYXRhQ29udGFjdEl0ZW1Db250YWluZXIpO1xuXG4gICAgICAgIGxldCBjb250YWN0TGlzdEl0ZW1IdG1sID0gYFxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiJHtjdXJyZW50Q29udGFjdC5pZH1cIiBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIGNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGZpZ3VyZSBjbGFzcz1cImNvbnRhY3QtbGlzdC1pdGVtIHVuaXRcIiB2YXJpYW50PVwiY29udGFjdC1pdGVtLWF2YXRhclwiPlxuICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiaW1hZ2VcIiBzcmM9XCIke2N1cnJlbnRDb250YWN0LmZpbGVbMF0uZGF0YVVybH1cIiAvPlxuICAgICAgICAgICAgPC9maWd1cmU+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1saXN0LWl0ZW0gdW5pdFwiIHZhcmlhbnQ9XCJjb250YWN0LWl0ZW0tbmFtZVwiPlxuICAgICAgICAgICAgICAke2N1cnJlbnRDb250YWN0LmZpcnN0bmFtZSArIFwiIFwiICsgY3VycmVudENvbnRhY3QubGFzdG5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICR7Y3VycmVudENvbnRhY3QuZmF2b3JpdGVcbiAgICAgICAgICAgICAgPyBgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWxpc3QtaXRlbSB1bml0XCIgdmFyaWFudD1cImNvbnRhY3QtaXRlbS1mYXZvcml0ZVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiPlxuICAgICAgICAgICAgICAgICAgICA8dGl0bGU+aWNvbnM8L3RpdGxlPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTM5Ljk4Niw0Ny42TDI1LjE0MSwzOS44LDEwLjMsNDcuNmwyLjgzNS0xNi41M0wxLjEyMiwxOS4zNjZsMTYuNi0yLjQxMkwyNS4xNDEsMS45MTVsNy40MjMsMTUuMDM5LDE2LjYsMi40MTJMMzcuMTUxLDMxLjA3M1pcIiBmaWxsPVwiIzY3Njc2N1wiLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICAgICAgICA6IFwiXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5gO1xuXG4gICAgICAgIGN1cnJlbnRDb250YWluZXJFbGVtZW50LmlubmVySFRNTCA9IGNvbnRhY3RMaXN0SXRlbUh0bWw7XG5cbiAgICAgICAgbmV3Q29udGFjdENvbnRhaW5lci5hcHBlbmRDaGlsZChjdXJyZW50Q29udGFpbmVyRWxlbWVudCk7XG4gICAgICAgIHJldHVybiBuZXdDb250YWN0Q29udGFpbmVyO1xuICAgICAgfSwgW10pO1xuXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIuY29udGFjdExpc3RCdXR0b24oXG4gICAgICAgIGNvbnRhY3RzVG9IVE1MLFxuICAgICAgICBtZXRob2RzLmNvbnRhY3RJbmZvLFxuICAgICAgICBcImFkZFwiLFxuICAgICAgICBcImNsaWNrXCJcbiAgICAgICk7XG5cbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5jb250YWN0TGlzdEJ1dHRvbihcbiAgICAgICAgY29udGFjdEl0ZW1zVW5pdCxcbiAgICAgICAgbWV0aG9kcy5jb250YWN0SW5mbyxcbiAgICAgICAgXCJyZW1vdmVcIixcbiAgICAgICAgXCJjbGlja1wiXG4gICAgICApO1xuXG4gICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnJlcGxhY2VDaGlsZChcbiAgICAgICAgY29udGFjdHNUb0hUTUwsXG4gICAgICAgIGNvbnRhY3RJdGVtc1VuaXRcbiAgICAgICk7XG4gICAgICBtZXRob2RzLmVsZW1lbnRXaWR0aC5idXR0b25Db250YWluZXJMaXN0SXRlbXMoKTtcbiAgICB9LFxuICB9O1xuXG4gIG1ldGhvZHMuY29udGFjdEluZm8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKG1ldGhvZHMuZGF0YS5nZXRDb250YWN0QnlJZChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlKSk7XG4gIH07XG5cbiAgbWV0aG9kcy5ldmVudExpc3RlbmVyID0ge1xuICAgIGNvbnRhY3RMaXN0QnV0dG9uOiBmdW5jdGlvbihcbiAgICAgIGVsZW1lbnROb2RlLFxuICAgICAgY2FsbEZ1bmN0aW9uLFxuICAgICAgbGlzdGVuZXIgPSBcImFkZFwiLFxuICAgICAgdHlwZSA9IFwiY2xpY2tcIlxuICAgICkge1xuICAgICAgW10uc2xpY2VcbiAgICAgICAgLmNhbGwoZWxlbWVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRhY3QtbGlzdC1pdGVtIGNvbnRhaW5lclwiKSlcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lcltsaXN0ZW5lcl0oZWxlbWVudCwgY2FsbEZ1bmN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxGdW5jdGlvbiwgdHlwZSA9IFwiY2xpY2tcIikge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxGdW5jdGlvbik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxGdW5jdGlvbiwgdHlwZSA9IFwiY2xpY2tcIikge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxGdW5jdGlvbik7XG4gICAgfSxcbiAgfTtcblxuICBtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICB2aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICB2YXIgZm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICBlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG4gICAgICBlbGVtZW50cy52aWV3cG9ydCA9XG4gICAgICAgIHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLnZpZXdwb3J0KTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyID0gZm91bmQ7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuc2V0RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLmdldEVsZW1lbm10c0J5Q2xhc3NOYW1lKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc1VuaXQucmVwbGFjZSgvLi9nLCBcIiBcIikuc3Vic3RyKDEpXG4gICAgICApO1xuICAgICAgZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lckJ1dHRvbiA9IGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RCdXR0b25Db250YWluZXJcbiAgICAgICk7XG5cbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNTZWFyY2hDb250YWluZXIgPSBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIHNlbGVjdG9ycy5jb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50cy5jb250YWN0SXRlbUNvbnRhaW5lcikge1xuICAgICAgZWxlbWVudHMuY29udGFjdEl0ZW1Vbml0ID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtVW5pdFxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyQnV0dG9uID0gZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RCdXR0b25Db250YWluZXJcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIG1ldGhvZHMuZWxlbWVudFdpZHRoID0ge1xuICAgIGJ1dHRvbkNvbnRhaW5lcjogZnVuY3Rpb24oKSB7XG4gICAgICBtZXRob2RzLnNldEVsZW1lbnRzKCk7XG4gICAgICBtZXRob2RzLmVsZW1lbnRXaWR0aC5idXR0b25Db250YWluZXJMaXN0SXRlbXMoKTtcbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lckl0ZW0oKTtcbiAgICB9LFxuICAgIGJ1dHRvbkNvbnRhaW5lckxpc3RJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyhlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zVW5pdC5jbGllbnRXaWR0aCk7XG4gICAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc1VuaXQpIHtcbiAgICAgICAgbGV0IGNvbnRhY3RMaXN0SXRlbXNVbml0V2lkdGggPVxuICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNVbml0LmNsaWVudFdpZHRoO1xuICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zQ29udGFpbmVyQnV0dG9uLnN0eWxlLndpZHRoID1cbiAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoICsgXCJweFwiO1xuICAgICAgICBlbGVtZW50cy5jb250YWN0TGlzdEl0ZW1zU2VhcmNoQ29udGFpbmVyLnN0eWxlLndpZHRoID1cbiAgICAgICAgICBjb250YWN0TGlzdEl0ZW1zVW5pdFdpZHRoICsgXCJweFwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgYnV0dG9uQ29udGFpbmVySXRlbTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZWxlbWVudHMuY29udGFjdEl0ZW1Db250YWluZXIpIHtcbiAgICAgICAgbGV0IGNvbnRhY3RJdGVtQ29udGFpbmVyV2lkdGggPVxuICAgICAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyLmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyQnV0dG9uLnN0eWxlLndpZHRoID1cbiAgICAgICAgICBjb250YWN0SXRlbUNvbnRhaW5lcldpZHRoICsgXCJweFwiO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG5cbiAgbWV0aG9kcy5pbml0ID0gZnVuY3Rpb24odmlld3BvcnQpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdHNDb250YWluZXIpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lcik7XG4gICAgICAvL2FkZCBjbGFzcyBubyBzY3JvbGwgb24gaHRtbCBlbGVtYW50XG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZTogXCJuby1zY3JvbGxcIixcbiAgICAgICAgYXR0cmlidXRlS2V5OiBcInZhcmlhbnRcIixcbiAgICAgIH07XG4gICAgICBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcbiAgICAgIC8vIGdldCBhbmQgc2hvdyBjb250YWN0IGxpc3RcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RMaXN0SXRlbXNDb250YWluZXIgPSBlbGVtZW50cy5jb250YWN0c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBzZWxlY3RvcnMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lclxuICAgICAgKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRhY3RJdGVtQ29udGFpbmVyID0gZWxlbWVudHMuY29udGFjdHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgc2VsZWN0b3JzLmNvbnRhY3RJdGVtQ29udGFpbmVyXG4gICAgICApO1xuXG4gICAgICBpZiAoZWxlbWVudHMuY29udGFjdExpc3RJdGVtc0NvbnRhaW5lcikge1xuICAgICAgICBtZXRob2RzLmRhdGEuZ2V0Q29udGFjdHNGcm9tQXBpKCk7XG4gICAgICB9XG5cbiAgICAgIG1ldGhvZHMuZWxlbWVudFdpZHRoLmJ1dHRvbkNvbnRhaW5lcigpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2RzLnJlbmRlciA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XG4gICAgaWYgKGVsZW1lbnRzLmNvbnRhY3RzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBtZXRob2RzLnVubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZWxlbWVudHMuY29udGFjdHNDb250YWluZXIpIHtcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIGF0dHJpYnV0ZVZhbHVlOiBcIm5vLXNjcm9sbFwiLFxuICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiY2xhc3NcIixcbiAgICAgIH07XG4gICAgICBtb2R1bGVzW1wiZ2VuZXJhbFwiXS5odG1sRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcbiAgICBpbml0OiBtZXRob2RzLmluaXQsXG4gICAgdW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxuICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXG5cbiAgICBzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lcixcbiAgfTtcbn0pKCk7XG4iLCJ2YXIgbW9kdWxlcyA9ICh3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9KTtcclxuXHJcbm1vZHVsZXNbXCJmaWxlLXVwbG9hZFwiXSA9IChmdW5jdGlvbigpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgbGV0IGVsZW1lbnRzLCBtZXRob2RzLCBzZWxlY3RvcnMsIHN0YXRlLCBjb250YWN0SXRlbXM7XHJcblxyXG4gIGVsZW1lbnRzID0ge307XHJcbiAgbWV0aG9kcyA9IHt9O1xyXG4gIHNlbGVjdG9ycyA9IHtcclxuICAgIHZpZXdwb3J0OiBcImJvZHlcIixcclxuICAgIGNvbnRhaW5lcjogJy5jb250YWluZXJbdmFyaWFudD1cImZpbGUtdXBsb2FkXCJdJyxcclxuICB9O1xyXG4gIHN0YXRlID0ge307XHJcblxyXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgdmlld3BvcnQgPSB2aWV3cG9ydCB8fCBkb2N1bWVudDtcclxuICAgIHZhciBmb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIGVsZW1lbnRzLndpbmRvdyA9IHdpbmRvdztcclxuICAgICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgICBlbGVtZW50cy52aWV3cG9ydCA9XHJcbiAgICAgICAgdmlld3BvcnQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMudmlld3BvcnQpO1xyXG4gICAgICBlbGVtZW50cy5maWxlVXBsb2FkQ29udGFpbmVyID0gZm91bmQ7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMuaW5pdCA9IGZ1bmN0aW9uKHZpZXdwb3J0KSB7XHJcbiAgICBpZiAoZWxlbWVudHMuZmlsZVVwbG9hZENvbnRhaW5lcikge1xyXG4gICAgICBPYmplY3Qua2V5cyhlbGVtZW50cy5maWxlVXBsb2FkQ29udGFpbmVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgIGxldCBmaWxlVXBsb2FkID0gbmV3IGZpbGVVcGxvYWRTaG93UHJldmlldXcoXHJcbiAgICAgICAgICBlbGVtZW50cy5maWxlVXBsb2FkQ29udGFpbmVyW2tleV1cclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5yZW5kZXIgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgaWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoZWxlbWVudHMuZmlsZVVwbG9hZCkge1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtb3VudDogbWV0aG9kcy5tb3VudCxcclxuICAgIGluaXQ6IG1ldGhvZHMuaW5pdCxcclxuICAgIHVubW91bnQ6IG1ldGhvZHMudW5tb3VudCxcclxuICAgIHJlbmRlcjogbWV0aG9kcy5yZW5kZXIsXHJcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3JzLmNvbnRhaW5lcixcclxuICB9O1xyXG59KSgpO1xyXG4iLCJ2YXIgbW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzID0gd2luZG93Lm1vZHVsZXMgfHwge307XHJcbnZhciBtZXRob2RzID0ge307XHJcblxyXG5tb2R1bGVzWydjdXN0b20tZm9ybSddID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgZWxlbWVudHMsXHJcblx0XHRtZXRob2RzLFxyXG5cdFx0c2VsZWN0b3JzLFxyXG5cdFx0c3RhdGU7XHJcblxyXG5cdGVsZW1lbnRzID0ge307XHJcblx0bWV0aG9kcyA9IHt9O1xyXG5cdHNlbGVjdG9ycyA9IHtcclxuXHRcdCd2aWV3cG9ydCc6ICdib2R5JyxcclxuXHJcblx0XHQnY29udGFpbmVyJzogJy5jb250YWluZXJbdmFyaWFudD1cImN1c3RvbS1mb3JtXCJdJyxcclxuXHJcblx0XHQnZm9ybUNvbnRhaW5lcic6ICcuY29udGFpbmVyW3ZhcmlhbnR+PVwiY3VzdG9tLWZvcm1cIl0nLFxyXG5cdFx0J2Zvcm1FbGVtZW50JzogJ1t2YXJpYW50PVwiY3VzdG9tLWZvcm1cIl0gZm9ybScsXHJcblx0XHQnZm9ybUZ1bGxGb3JtJzogJ1t2YXJpYW50PVwiZnVsbC1mb3JtXCJdJyxcclxuXHJcblx0XHQnZm9ybUJ1dHRvbic6ICcuc3VibWl0LWJ1dHRvbicsXHJcblxyXG5cdFx0J2RhdGVGaWVsZENvbnRhaW5lcic6ICdbdmFyaWFudD1cImRhdGVcIl0nLFxyXG5cclxuXHRcdCdyZXF1aXJlZEZpZWxkcyc6ICdpbnB1dFtkYXRhLXJlcXVpcmVkXScsXHJcblx0XHQnZm9ybVBvc3RlZENvbnRhaW5lcic6ICdbdmFyaWFudH49XCJjdXN0b20tZm9ybS1wb3N0ZWRcIl0nLFxyXG5cdFx0J2Vycm9yTWVzc2FnZUNvbnRhaW5lcic6ICdbdmFyaWFudH49XCJlcnJvci1tZXNzYWdlXCJdJ1xyXG5cdH07XHJcblx0c3RhdGUgPSB7fTtcclxuXHJcblx0bWV0aG9kcy5odG1sRWxlbWVudCA9IHtcclxuXHRcdGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0cmV0dXJuIChkYXRhLmVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KSB8fCBmYWxzZSk7XHJcblx0XHR9LFxyXG5cdFx0aGFzQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhLCBhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0YXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKGRhdGEuYXR0cmlidXRlVmFsdWUsICdnaScpO1xyXG5cdFx0XHRyZXR1cm4gcmVnZXgudGVzdChhdHRyaWJ1dGVWYWx1ZSk7XHJcblx0XHR9LFxyXG5cdFx0YWRkQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xyXG5cclxuXHRcdFx0aWYgKCFtZXRob2RzLmh0bWxFbGVtZW50Lmhhc0F0dHJpYnV0ZVZhbHVlKGRhdGEsIGF0dHJpYnV0ZVZhbHVlKSkge1xyXG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0YXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZSArICcgJyArIGRhdGEuYXR0cmlidXRlVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZVZhbHVlID0gZGF0YS5hdHRyaWJ1dGVWYWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuXHRcdFx0dmFyIGhhc0F0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShkYXRhLCBhdHRyaWJ1dGVWYWx1ZSk7XHJcblx0XHRcdHZhciB2YWx1ZVJlbW92ZWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKGhhc0F0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCAnZ2knKTtcclxuXHRcdFx0XHR2YXIgbmV3QXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVWYWx1ZS5yZXBsYWNlKHJlZ2V4LCAnJykudHJpbSgpO1xyXG5cdFx0XHRcdGlmIChuZXdBdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0ZGF0YS5lbGVtZW50LnNldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSwgbmV3QXR0cmlidXRlVmFsdWUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkYXRhLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGRhdGEuYXR0cmlidXRlS2V5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFsdWVSZW1vdmVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsdWVSZW1vdmVkO1xyXG5cdFx0fSxcclxuXHRcdHRvZ2dsZUF0dHJpYnV0ZVZhbHVlOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRkYXRhLmF0dHJpYnV0ZVZhbHVlID0gZGF0YS5yZW1vdmVBdHRyaWJ1dGVWYWx1ZTtcclxuXHRcdFx0dmFyIHZhbHVlVG9nZ2xlZCA9IGZhbHNlO1xyXG5cdFx0XHR2YXIgcmVtb3ZlQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG5cclxuXHRcdFx0aWYgKHJlbW92ZUF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0ZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYWRkQXR0cmlidXRlVmFsdWU7XHJcblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcclxuXHRcdFx0XHR2YWx1ZVRvZ2dsZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWx1ZVRvZ2dsZWQ7XHJcblx0XHR9LFxyXG5cdFx0YWRkU3RhdGVWYWx1ZUludmFsaWQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRcdFx0YXR0cmlidXRlS2V5OiAnc3RhdGUnLFxyXG5cdFx0XHRcdGF0dHJpYnV0ZVZhbHVlOiAnaW52YWxpZCdcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiBtZXRob2RzLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG5cdFx0fSxcclxuXHRcdHJlbW92ZVN0YXRlVmFsdWVJbnZhbGlkOiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxyXG5cdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcclxuXHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZTogJ2ludmFsaWQnXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG1ldGhvZHMuZmllbGRFbGVtZW50ID0ge1xyXG5cdFx0Zm9jdXNPdXQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHR2YXIgZmllbGREYXRhID0ge1xyXG5cdFx0XHRcdG5hbWU6IGV2ZW50LmN1cnJlbnRUYXJnZXQubmFtZSxcclxuXHRcdFx0XHR2YWx1ZXM6IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUsXHJcblx0XHRcdFx0dmFsdWVDaGVjazogZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnZhbHVlQ2hlY2sgfHwgZXZlbnQuY3VycmVudFRhcmdldC50eXBlXHJcblx0XHRcdH07XHJcblx0XHRcdHZhciB2YWxpZGF0aW9uUmVzcG9uc2UgPSBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLmZpZWxkVmFsaWRhdGlvbihmaWVsZERhdGEpO1xyXG5cdFx0XHRpZiAodmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yKSB7XHJcblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRTdGF0ZVZhbHVlSW52YWxpZChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRtZXRob2RzLmVycm9yTWVzc2FnZS5zZXRTdGF0ZS5oaWRkZW4oZXZlbnQuY3VycmVudFRhcmdldC5mb3JtKTtcclxuXHRcdH0sXHJcblx0XHRmb2N1c0luOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5yZW1vdmVTdGF0ZVZhbHVlSW52YWxpZChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtZXRob2RzLmZvcm0gPSB7XHJcblx0XHRjbGlja0hhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IuaXNTdGF0ZUludmFsaWQoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdHZhciBmb3JtRGF0YSA9IG1ldGhvZHMuZm9ybS5zZXJpYWxpemUoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdHZhciBlcnJvckRhdGEgPSBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLmZvcm1EYXRhKGZvcm1EYXRhLnBvc3REYXRhKTtcclxuXHJcblx0XHRcdGlmIChlcnJvckRhdGEgfHwgc3RhdGUuY29udGFpbmVyVmFyaWFudERhdGVJbnZhbGlkKSB7XHJcblx0XHRcdFx0bWV0aG9kcy5mb3JtLmVycm9ySGFuZGxlcihlcnJvckRhdGEsIGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCFlcnJvckRhdGEgJiYgIXN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZCkge1xyXG5cdFx0XHRcdG1ldGhvZHMuZm9ybS5wb3N0SGFuZGxlcihmb3JtRGF0YSwgZXZlbnQuY3VycmVudFRhcmdldC5hY3Rpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHBvc3RIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybURhdGEsIGFjdGlvbikge1xyXG5cdFx0XHRtZXRob2RzLnNlbmREYXRhLnhocignUE9TVCcsIGFjdGlvbiwgZm9ybURhdGEpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdHZhciBjYWxsYmFja0pzb25YaHIgPSBtZXRob2RzLnNlbmREYXRhLmNhbGxiYWNrLnN1Y2Nlc3MoZGF0YSk7XHJcblx0XHRcdFx0XHRtZXRob2RzLmZvcm0uY2FsbGJhY2tIYW5kbGVyKGNhbGxiYWNrSnNvblhocik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHRjYWxsYmFja0hhbmRsZXI6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdGlmIChkYXRhLmVycm9yRGF0YSAmJiBPYmplY3Qua2V5cyhkYXRhLmVycm9yRGF0YSkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybVtuYW1lPVwiJyArIGRhdGEuZm9ybU5hbWUgKyAnXCJdJyk7XHJcblx0XHRcdFx0bWV0aG9kcy5mb3JtLmVycm9ySGFuZGxlcihkYXRhLmVycm9yRGF0YSwgZm9ybSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZGF0YS5zdWNjZXNEYXRhKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuc3VjY2VzRGF0YS5wYWdlICE9PSAnJykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGdvIHRvIGEgbmV3IHBhZ2UnKTtcclxuXHRcdFx0XHRcdC8vIGdvIHRvIG5ldyBwYWdlXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1ldGhvZHMuZm9ybS5zdWNjZXNIYW5kbGVyKGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdCQoZWxlbWVudHMuYm9keSkudHJpZ2dlcihuZXcgalF1ZXJ5LkV2ZW50KCduYXZpZ2F0ZScsIHtcclxuXHRcdFx0XHRcdHVybDogZGF0YS5zdWNjZXNEYXRhLnBhZ2UsXHJcblx0XHRcdFx0XHRhbmltYXRpb246ICdibHVyaW4nLFxyXG5cdFx0XHRcdFx0d2luZG93TmFtZTogbnVsbCxcclxuXHRcdFx0XHRcdHRhcmdldDogbnVsbFxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0XHQqL1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGVycm9ySGFuZGxlcjogZnVuY3Rpb24gKGVycm9yRGF0YSwgZWxlbWVudCkge1xyXG5cdFx0XHRPYmplY3Qua2V5cyhlcnJvckRhdGEpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRcdHZhciBzZWxlY3RvciA9IGVycm9yRGF0YVtrZXldLmRhdGEuZWxlbWVudFR5cGUgKyAnW25hbWU9XCInICsgZXJyb3JEYXRhW2tleV0uZGF0YS5uYW1lICsgJ1wiXSc7XHJcblx0XHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHJcblx0XHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC5hZGRTdGF0ZVZhbHVlSW52YWxpZChpbnB1dCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRtZXRob2RzLmVycm9yTWVzc2FnZS5zZXRTdGF0ZS5hY3RpdmUoZWxlbWVudCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN1Y2Nlc0hhbmRsZXI6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG5cdFx0XHR2YXIgZm9ybVN1Y2NlcyA9IGVsZW1lbnRzLmJvZHkucXVlcnlTZWxlY3RvcignW25hbWUqPVwiJyArIGRhdGEuc3VjY2VzRGF0YS5mb3JtTmFtZSArICdcIl0nKTtcclxuXHRcdFx0dmFyIGZvcm1TdWNjZXNDb250YWluZXIgPSBmb3JtU3VjY2VzLmNsb3Nlc3QoJ1t2YXJpYW50fj1cImN1c3RvbS1mb3JtXCJdJyk7XHJcblxyXG5cdFx0XHR2YXIgZGF0YUZvcm0gPSB7XHJcblx0XHRcdFx0ZWxlbWVudDogZm9ybVN1Y2NlcyxcclxuXHRcdFx0XHRhdHRyaWJ1dGVLZXk6ICdzdGF0ZScsXHJcblx0XHRcdFx0YWRkQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nLFxyXG5cdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0bWV0aG9kcy5odG1sRWxlbWVudC50b2dnbGVBdHRyaWJ1dGVWYWx1ZShkYXRhRm9ybSk7XHJcblxyXG5cdFx0XHR2YXIgZm9ybVBvc3RlZCA9IGZvcm1TdWNjZXNDb250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZm9ybVBvc3RlZENvbnRhaW5lcik7XHJcblxyXG5cdFx0XHR2YXIgZGF0YVBvc3RlZENvbnRhaW5lciA9IHtcclxuXHRcdFx0XHRlbGVtZW50OiBmb3JtUG9zdGVkLFxyXG5cdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcclxuXHRcdFx0XHRhZGRBdHRyaWJ1dGVWYWx1ZTogJ2FjdGl2ZScsXHJcblx0XHRcdFx0cmVtb3ZlQXR0cmlidXRlVmFsdWU6ICdoaWRkZW4nXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGFQb3N0ZWRDb250YWluZXIpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRWYWx1ZU9mRWxlbWVudDoge1xyXG5cdFx0XHRpbnB1dDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgdmFsdWU7XHJcblx0XHRcdFx0aWYgKGVsZW1lbnQudHlwZSAmJiAoZWxlbWVudC50eXBlID09PSAncmFkaW8nIHx8IGVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94JykpIHtcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50LmNoZWNrZWQpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSkge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LnZhbHVlLnRyaW0oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dGV4dGFyZWE6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsdWUudHJpbSgpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRcdHZhciB2YWx1ZTtcclxuXHRcdFx0XHRpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZSA9PT0gJ3NlbGVjdC1vbmUnKSB7XHJcblx0XHRcdFx0XHRpZiAoZWxlbWVudC52YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBbXTtcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50LnZhbHVlICYmIGVsZW1lbnQub3B0aW9ucykge1xyXG5cdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhlbGVtZW50Lm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbktleSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChlbGVtZW50Lm9wdGlvbnNbb3B0aW9uS2V5XS5zZWxlY3RlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUucHVzaChlbGVtZW50Lm9wdGlvbnNbb3B0aW9uS2V5XS52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHNlcmlhbGl6ZTogZnVuY3Rpb24gKGZvcm0pIHtcclxuXHRcdFx0dmFyIGZvcm1EYXRhID0ge1xyXG5cdFx0XHRcdGZvcm1OYW1lOiBmb3JtLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IG51bGwsXHJcblx0XHRcdFx0YWN0aW9uOiBmb3JtLmdldEF0dHJpYnV0ZSgnYWN0aW9uJykgfHwgbnVsbCxcclxuXHRcdFx0XHRwb3N0RGF0YToge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZvcm1EYXRhLnBvc3REYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9ybS5lbGVtZW50cykucmVkdWNlKGZ1bmN0aW9uIChkYXRhLCBpdGVtKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSlcclxuXHRcdFx0XHRpZiAoaXRlbSAmJiBpdGVtLm5hbWUpIHtcclxuXHRcdFx0XHRcdGlmICghZGF0YVtpdGVtLm5hbWVdKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXSA9IHtcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBpdGVtLnR5cGUsXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogaXRlbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRUeXBlOiBpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0XHRcdFx0cmVxdWlyZWQ6IGl0ZW0uZGF0YXNldC5yZXF1aXJlZCA9PT0gJ3RydWUnLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlQ2hlY2s6IGl0ZW0uZGF0YXNldC52YWx1ZUNoZWNrIHx8IGl0ZW0udHlwZSxcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZUtleTogaXRlbS5kYXRhc2V0LnZhbHVlS2V5IHx8IDAsXHJcblx0XHRcdFx0XHRcdFx0dmFsdWVzOiBbXVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5ID09PSBcIm51bWJlclwiICYmIGlzRmluaXRlKGRhdGFbaXRlbS5uYW1lXS52YWx1ZUtleSkgJiYgTWF0aC5mbG9vcihkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpID09PSBkYXRhW2l0ZW0ubmFtZV0udmFsdWVLZXkpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlS2V5Kys7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0XHRpZiAobWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSkgJiYgaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JyAmJiBpdGVtLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlcyA9IG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG1ldGhvZHMuZm9ybS5nZXRWYWx1ZU9mRWxlbWVudFtpdGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKGl0ZW0pKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uZGF0YXNldC52YWx1ZUtleSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YVtpdGVtLm5hbWVdLnZhbHVlc1tpdGVtLmRhdGFzZXQudmFsdWVLZXldID0gbWV0aG9kcy5mb3JtLmdldFZhbHVlT2ZFbGVtZW50W2l0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0oaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaXRlbS5uYW1lXS52YWx1ZXMucHVzaChtZXRob2RzLmZvcm0uZ2V0VmFsdWVPZkVsZW1lbnRbaXRlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXShpdGVtKSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCB7fSk7XHJcblx0XHRcdHJldHVybiBmb3JtRGF0YTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtZXRob2RzLmZvcm1WYWxpZGF0aW9uID0ge1xyXG5cdFx0Zm9ybURhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdHZhciBlcnJvckRhdGEgPSB7fTtcclxuXHRcdFx0T2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdFx0aWYgKGRhdGFba2V5XS5yZXF1aXJlZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0dmFyIGZpZWxkRGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogZGF0YVtrZXldLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZXM6IGRhdGFba2V5XS52YWx1ZXNbMF0sXHJcblx0XHRcdFx0XHRcdHZhbHVlQ2hlY2s6IGRhdGFba2V5XS52YWx1ZUNoZWNrXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IG1ldGhvZHMuZm9ybVZhbGlkYXRpb24uZmllbGRWYWxpZGF0aW9uKGZpZWxkRGF0YSk7XHJcblx0XHRcdFx0XHRpZiAodmFsaWRhdGlvblJlc3BvbnNlLmhhc0Vycm9yKSB7XHJcblx0XHRcdFx0XHRcdGVycm9yRGF0YVtrZXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGE6IGRhdGFba2V5XSxcclxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiB2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIChPYmplY3Qua2V5cyhlcnJvckRhdGEpLmxlbmd0aCA+IDAgPyBlcnJvckRhdGEgOiBmYWxzZSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGZpZWxkVmFsaWRhdGlvbjogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0dmFyIHZhbGlkYXRpb25SZXNwb25zZSA9IHtcclxuXHRcdFx0XHRoYXNFcnJvcjogZmFsc2UsXHJcblx0XHRcdFx0ZXJyb3JNZXNzYWdlOiBudWxsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoIW1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuaXNOb3RFbXB0eShkYXRhLnZhbHVlcykpIHtcclxuXHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuaGFzRXJyb3IgPSB0cnVlO1xyXG5cdFx0XHRcdHZhbGlkYXRpb25SZXNwb25zZS5lcnJvck1lc3NhZ2UgPSBkYXRhLm5hbWUgKyAnIGZpZWxkIGlzIGVtcHR5JztcclxuXHRcdFx0fSBlbHNlIGlmIChtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlLmlzTm90RW1wdHkoZGF0YS52YWx1ZXMpICYmIHR5cGVvZiBtZXRob2RzLmZvcm1WYWxpZGF0aW9uLnZhbGlkYXRpb25UeXBlW2RhdGEudmFsdWVDaGVja10gPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRpZiAoIW1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGVbZGF0YS52YWx1ZUNoZWNrXShkYXRhLnZhbHVlcykpIHtcclxuXHRcdFx0XHRcdHZhbGlkYXRpb25SZXNwb25zZS5oYXNFcnJvciA9IHRydWU7XHJcblx0XHRcdFx0XHR2YWxpZGF0aW9uUmVzcG9uc2UuZXJyb3JNZXNzYWdlID0gZGF0YS5uYW1lICsgJyBmaWVsZCBpcyBub3QgY29ycmVjdCBmaWxsZWQnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsaWRhdGlvblJlc3BvbnNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHR2YWxpZGF0aW9uVHlwZToge1xyXG5cdFx0XHRpc05vdEVtcHR5OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgdmFsdWVJc05vdEVtcHR5ID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHZhbHVlSXNOb3RFbXB0eSA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA+IDApIHx8IHZhbHVlLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdHZhbHVlSXNOb3RFbXB0eSA9IHRydWU7XHJcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YWx1ZUlzTm90RW1wdHkgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlSXNOb3RFbXB0eTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRleHQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0bnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgcGF0dGVybiA9IC9eXFxkKyQvO1xyXG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0YWxwaGFiZXRpYzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXlxcZCskLztcclxuXHRcdFx0XHRyZXR1cm4gIXBhdHRlcm4udGVzdCh2YWx1ZSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRlbWFpbDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIHBhdHRlcm4gPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XHJcblxyXG5cdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0dGVsOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgcGF0dGVybiA9IC9eKD86XFwrXFxkezEsM318MFxcZHsxLDN9fDAwXFxkezEsMn0pPyg/Olxccz9cXChcXGQrXFwpKT8oPzpbLVxcL1xccy5dfFxcZCkrJC87XHJcblx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRkYXRlRnV0dXJlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG5cdFx0XHRcdGRhdGUuZGF5ID0gcGFyc2VJbnQoZGF0ZS5kYXksIDEwKTtcclxuXHRcdFx0XHRkYXRlLm1vbnRoID0gcGFyc2VJbnQoZGF0ZS5tb250aCwgMTApIC0gMTtcclxuXHRcdFx0XHRkYXRlLnllYXIgPSBwYXJzZUludChkYXRlLnllYXIsIDEwKSArIDIwMDA7XHJcblxyXG5cdFx0XHRcdHZhciB0ZW1wID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSk7XHJcblx0XHRcdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHRcdGlmIChub3cgPCB0ZW1wICYmIHRlbXAuZ2V0RGF0ZSgpID09PSBkYXRlLmRheSAmJiB0ZW1wLmdldE1vbnRoKCkgPT09IGRhdGUubW9udGggJiYgdGVtcC5nZXRGdWxsWWVhcigpID09PSBkYXRlLnllYXIpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG1ldGhvZHMuc2VuZERhdGEgPSB7XHJcblx0XHR4aHI6IGZ1bmN0aW9uIChtZXRob2QsIHVybCwgZGF0YSkge1xyXG5cdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuXHJcblx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0XHRyZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xyXG5cdFx0XHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XHJcblx0XHRcdFx0cmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHRcdFx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUocmVxdWVzdC5yZXNwb25zZSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZWplY3QocmVxdWVzdC5zdGF0dXNUZXh0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHJlamVjdChyZXF1ZXN0LnN0YXR1c1RleHQpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cclxuXHRcdFx0XHR2YXIgcmVzcG9uc2VEYXRhID0ge1xyXG5cdFx0XHRcdFx0c3VjY2VzRGF0YToge1xyXG5cdFx0XHRcdFx0XHRwYWdlOiAnJyxcclxuXHRcdFx0XHRcdFx0Zm9ybU5hbWU6IGRhdGEuZm9ybU5hbWUsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVHh0OiAnQmVkYW5rdCB2b29yIGhldCBpbnZ1bGxlbi4nXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0cmVzcG9uc2VEYXRhID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEYXRhKTtcclxuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlRGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuXHRcdH0sXHJcblx0XHRjYWxsYmFjazoge1xyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtZXRob2RzLmVycm9yTWVzc2FnZSA9IHtcclxuXHRcdHNldFN0YXRlOiB7XHJcblx0XHRcdGhpZGRlbjogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcclxuXHRcdFx0XHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJyxcclxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0bWV0aG9kcy5lcnJvck1lc3NhZ2UudG9nZ2xlU3RhdGUoZGF0YSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFjdGl2ZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZXJyb3JNZXNzYWdlQ29udGFpbmVyKSxcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZUtleTogJ3N0YXRlJyxcclxuXHRcdFx0XHRcdGFkZEF0dHJpYnV0ZVZhbHVlOiAnYWN0aXZlJyxcclxuXHRcdFx0XHRcdHJlbW92ZUF0dHJpYnV0ZVZhbHVlOiAnaGlkZGVuJ1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdG1ldGhvZHMuZXJyb3JNZXNzYWdlLnRvZ2dsZVN0YXRlKGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0U3RhdGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLmVycm9yTWVzc2FnZUNvbnRhaW5lcikuZ2V0QXR0cmlidXRlKCdzdGF0ZScpO1xyXG5cdFx0fSxcclxuXHRcdHRvZ2dsZVN0YXRlOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRtZXRob2RzLmh0bWxFbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHRtZXRob2RzLmRhdGVTZWxlY3RvciA9IHtcclxuXHRcdGZ1bGxDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0dmFyIGRhdGUgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci5jb252ZXJ0RnVsbFRvU2VwZXJhdGVkKGVsZW1lbnRzLmRhdGVTZWxlY3RvckZ1bGxEYXRlLnZhbHVlKTtcclxuXHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yRGF5LnZhbHVlID0gZGF0ZS5kYXk7XHJcblx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3Rvck1vbnRoLnZhbHVlID0gZGF0ZS5tb250aDtcclxuXHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhci52YWx1ZSA9IGRhdGUueWVhci50b1N0cmluZygpLnNsaWNlKC0yKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdHZhciBlbGVtZW50O1xyXG5cclxuXHRcdFx0Ly8gY2FuY2VsIGtleXVwLWV2ZW50IGlmIGtleSB3YXMgbm90IGEgbnVtYmVyIG9yIFRBQiBvciBFTlRFUlxyXG5cdFx0XHRpZiAobWV0aG9kcy5kYXRlU2VsZWN0b3IudGVzdEtleVVwRXZlbnQoZXZlbnQpKSB7XHJcblx0XHRcdFx0bWV0aG9kcy5kYXRlU2VsZWN0b3IudGVzdFZhbHVlcygpO1xyXG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmFwcGx5U3RhdGUoKTtcclxuXHJcblx0XHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgfHwgZXZlbnQudHlwZSA9PT0gJ2tleWRvd24nKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50ID0gZXZlbnQuY3VycmVudFRhcmdldDtcclxuXHRcdFx0XHRcdGlmICgoZWxlbWVudC52YWx1ZS5sZW5ndGggPj0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubWF4SW5wdXRMZW5ndGgoZWxlbWVudCkpICYmIChldmVudC5rZXlDb2RlICE9PSAxNikgJiYgKGV2ZW50LmtleUNvZGUgIT09IDkpICYmIChldmVudC5rZXlDb2RlICE9PSA4KSkge1xyXG5cdFx0XHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci5qdW1wVG9OZXh0SW5wdXQoZWxlbWVudCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIHRoaXMgaXMgYSBrZXlkb3duIGJlaW5nIGNhbmNlbGxlZCwgdGh1cyBubyBrZXl1cCBvY2N1cnMgb24gdGhpcyAnY2hhbmdlJ1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0dGVzdFZhbHVlczogZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdHN0YXRlLmFnZSA9IHtcclxuXHRcdFx0XHRkYXk6IGVsZW1lbnRzLmRhdGVTZWxlY3RvckRheS52YWx1ZSxcclxuXHRcdFx0XHRtb250aDogZWxlbWVudHMuZGF0ZVNlbGVjdG9yTW9udGgudmFsdWUsXHJcblx0XHRcdFx0eWVhcjogZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhci52YWx1ZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKHN0YXRlLmFnZS5kYXkgJiYgc3RhdGUuYWdlLm1vbnRoICYmIHN0YXRlLmFnZS55ZWFyKSB7XHJcblx0XHRcdFx0aWYgKG1ldGhvZHMuZm9ybVZhbGlkYXRpb24udmFsaWRhdGlvblR5cGUuZGF0ZUZ1dHVyZShzdGF0ZS5hZ2UpKSB7XHJcblx0XHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICd2YWxpZCc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ2ludmFsaWQnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmIChzdGF0ZS5hZ2UuZGF5IHx8IHN0YXRlLmFnZS5tb250aCB8fCBzdGF0ZS5hZ2UueWVhcikge1xyXG5cdFx0XHRcdHN0YXRlLmFnZVN0YXRlID0gJ3Byb2dyZXNzJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdGF0ZS5hZ2VTdGF0ZSA9ICdpbml0aWFsJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIChzdGF0ZS5hZ2VTdGF0ZSA9PT0gJ3ZhbGlkJyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRlc3RGdWxsRGF0ZVN1cHBvcnQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZS50eXBlID09PSAnZGF0ZScpO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0ZXN0S2V5VXBFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdHZhciBpc0tleVVwID0gKGV2ZW50LnR5cGUgPT09ICdrZXlkb3duJyk7XHJcblx0XHRcdHZhciBpc1RhYiA9IChldmVudC5rZXlDb2RlID09PSA5KTtcclxuXHRcdFx0dmFyIGlzRW50ZXIgPSAoZXZlbnQua2V5Q29kZSA9PT0gMTMpO1xyXG5cdFx0XHR2YXIgaXNCYWNrc3BhY2UgPSAoZXZlbnQua2V5Q29kZSA9PT0gOCk7XHJcblx0XHRcdHZhciBpc0RlbGV0ZSA9IChldmVudC5rZXlDb2RlID09PSA0Nik7XHJcblx0XHRcdHZhciBpc051bWVyaWMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpLm1hdGNoKC9bMC05XS8pO1xyXG5cdFx0XHR2YXIgaXNOdW1wYWQgPSAoZXZlbnQua2V5Q29kZSA+PSA5NikgJiYgKGV2ZW50LmtleUNvZGUgPD0gMTA1KTtcclxuXHRcdFx0dmFyIGlzTnVtQW5kcm9pZCA9IChldmVudC5rZXlDb2RlID09PSAyMjkpO1xyXG5cclxuXHRcdFx0aWYgKCFpc0tleVVwKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpc0tleVVwICYmIChpc1RhYiB8fCBpc0VudGVyIHx8IGlzTnVtZXJpYyB8fCBpc0JhY2tzcGFjZSB8fCBpc0RlbGV0ZSB8fCBpc051bXBhZCB8fCBpc051bUFuZHJvaWQpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGNvbnZlcnRGdWxsVG9TZXBlcmF0ZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHR2YWx1ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRkYXk6IHZhbHVlLmdldERhdGUoKSxcclxuXHRcdFx0XHRtb250aDogdmFsdWUuZ2V0TW9udGgoKSArIDEsXHJcblx0XHRcdFx0eWVhcjogdmFsdWUuZ2V0RnVsbFllYXIoKVxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRjaGVja0lucHV0TGVuZ3RoOiBmdW5jdGlvbiAoY3VycmVudEVsZW1lbnQpIHtcclxuXHRcdFx0cmV0dXJuIGN1cnJlbnRFbGVtZW50LnZhbHVlLmxlbmd0aDtcclxuXHRcdH0sXHJcblxyXG5cdFx0bWF4SW5wdXRMZW5ndGg6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG5leHRJbnB1dDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiBjdXJyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV4dGZpZWxkJyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGp1bXBUb05leHRJbnB1dDogZnVuY3Rpb24gKGN1cnJlbnRFbGVtZW50KSB7XHJcblx0XHRcdHZhciBuZXh0SW5wdXREYXRhID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IubmV4dElucHV0KGN1cnJlbnRFbGVtZW50KSB8fCB1bmRlZmluZWQ7XHJcblx0XHRcdHZhciBlbGVtZW50VG9Gb2N1cyA9IG5leHRJbnB1dERhdGEgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0SW5wdXREYXRhKSA6IHVuZGVmaW5lZDtcclxuXHJcblx0XHRcdGlmIChuZXh0SW5wdXREYXRhICYmIGVsZW1lbnRUb0ZvY3VzKSB7XHJcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRkYXRlSW5wdXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0XHRcdHZhciBjdXJyZW50ID0gb3B0aW9ucy5jdXJyZW50O1xyXG5cdFx0XHR2YXIgY3VycmVudEtleUNvZGUgPSBvcHRpb25zLmtleUNvZGU7XHJcblx0XHRcdHZhciBpbnB1dExlbmd0aCA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoZWNrSW5wdXRMZW5ndGgoY3VycmVudCk7XHJcblx0XHRcdHZhciBtYXhJbnB1dExlbmd0aCA9IG1ldGhvZHMuZGF0ZVNlbGVjdG9yLm1heElucHV0TGVuZ3RoKGN1cnJlbnQpO1xyXG5cclxuXHRcdFx0aWYgKChpbnB1dExlbmd0aCA9PT0gbWF4SW5wdXRMZW5ndGgpICYmIChjdXJyZW50S2V5Q29kZSAhPT0gMTYpICYmIChjdXJyZW50S2V5Q29kZSAhPT0gOSkpIHtcclxuXHRcdFx0XHRtZXRob2RzLmRhdGVTZWxlY3Rvci5qdW1wVG9OZXh0SW5wdXQoY3VycmVudCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0YXBwbHlTdGF0ZTogZnVuY3Rpb24gKGlucHV0KSB7XHJcblx0XHRcdGlmIChpbnB1dCkge1xyXG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0YXRlJywgaW5wdXQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnRlc3RWYWx1ZXMoKTtcclxuXHJcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3RhdGUnLCBzdGF0ZS5hZ2VTdGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0Q29udGFpbmVyOiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5kYXRlRmllbGRDb250YWluZXIpIHx8IGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpc1N0YXRlSW52YWxpZDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdFx0dmFyIGRhdGVDb250YWluZXJzID0gbWV0aG9kcy5kYXRlU2VsZWN0b3IuZ2V0Q29udGFpbmVyKGVsZW1lbnQpO1xyXG5cdFx0XHRzdGF0ZS5jb250YWluZXJWYXJpYW50RGF0ZUludmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0aWYgKGRhdGVDb250YWluZXJzKSB7XHJcblx0XHRcdFx0W10uc2xpY2UuY2FsbChkYXRlQ29udGFpbmVycykuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0aWYgKGl0ZW0uZ2V0QXR0cmlidXRlKCdzdGF0ZScpICE9PSAndmFsaWQnKSB7XHJcblx0XHRcdFx0XHRcdHN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHN0YXRlLmNvbnRhaW5lclZhcmlhbnREYXRlSW52YWxpZDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtZXRob2RzLm1vdW50ID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XHJcblx0XHR2aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50O1xyXG5cdFx0dmFyIGZvdW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuY29udGFpbmVyKTtcclxuXHJcblx0XHRpZiAoZm91bmQpIHtcclxuXHRcdFx0ZWxlbWVudHMud2luZG93ID0gd2luZG93O1xyXG5cdFx0XHRlbGVtZW50cy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cdFx0XHRlbGVtZW50cy52aWV3cG9ydCA9IHZpZXdwb3J0IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLnZpZXdwb3J0KTtcclxuXHRcdFx0ZWxlbWVudHMuZm9ybUNvbnRhaW5lciA9IGZvdW5kO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtZXRob2RzLmluaXQgPSBmdW5jdGlvbiAodmlld3BvcnQpIHtcclxuXHRcdGlmIChlbGVtZW50cy5mb3JtQ29udGFpbmVyKSB7XHJcblx0XHRcdGVsZW1lbnRzLmZvcm1FbGVtZW50ID0gZWxlbWVudHMuZm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5mb3JtRWxlbWVudCkgfHwgdW5kZWZpbmVkO1xyXG5cdFx0XHRlbGVtZW50cy5yZXF1aXJlZEZpZWxkcyA9IGVsZW1lbnRzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMucmVxdWlyZWRGaWVsZHMpIHx8IHVuZGVmaW5lZDtcclxuXHRcdFx0ZWxlbWVudHMucG9zdGVkQ29udGFpbmVycyA9IGVsZW1lbnRzLmZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvcnMuZm9ybVBvc3RlZENvbnRhaW5lcikgfHwgdW5kZWZpbmVkO1xyXG5cdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIgPSBlbGVtZW50cy5mb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cImRhdGVcIl0nKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIpIHtcclxuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JEYXkgPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwiZGF5XCJdJyk7XHJcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yTW9udGggPSBlbGVtZW50cy5kYXRlU2VsZWN0b3JDb250YWluZXIucXVlcnlTZWxlY3RvcignW3ZhcmlhbnR+PVwibW9udGhcIl0nKTtcclxuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JZZWFyID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t2YXJpYW50fj1cInllYXJcIl0nKTtcclxuXHRcdFx0XHRlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdmFyaWFudH49XCJmdWxsXCJdJyk7XHJcblx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yID0gZWxlbWVudHMuZGF0ZVNlbGVjdG9yQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t2YXJpYW50fj1cImRhdGVzZWxlY3RvclwiXScpO1xyXG5cdFx0XHRcdGVsZW1lbnRzLmRhdGVTZWxlY3RvckFsbEZpZWxkcyA9IGVsZW1lbnRzLmRhdGVTZWxlY3RvckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuaW5wdXQnKTtcclxuXHRcdFx0XHRzdGF0ZS5mdWxsRGF0ZVN1cHBvcnQgPSBtZXRob2RzLmRhdGVTZWxlY3Rvci50ZXN0RnVsbERhdGVTdXBwb3J0KCk7XHJcblxyXG5cdFx0XHRcdHN0YXRlLmlzTW9iaWxlID0gKGVsZW1lbnRzLndpbmRvdy5pbm5lcldpZHRoIDwgNzAwKTtcclxuXHRcdFx0XHRpZiAoZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUgJiYgc3RhdGUuZnVsbERhdGVTdXBwb3J0ICYmIHN0YXRlLmlzTW9iaWxlKSB7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudHMuZGF0ZVNlbGVjdG9yRnVsbERhdGUuc2V0QXR0cmlidXRlKCdzdGF0ZScsICdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBkYXRlU2VsZWN0b3IgPSBbZWxlbWVudHMuZGF0ZVNlbGVjdG9yRGF5LCBlbGVtZW50cy5kYXRlU2VsZWN0b3JNb250aCwgZWxlbWVudHMuZGF0ZVNlbGVjdG9yWWVhcl07XHJcblxyXG5cdFx0XHRcdE9iamVjdC5rZXlzKGRhdGVTZWxlY3RvcikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdFx0XHRkYXRlU2VsZWN0b3Jba2V5XS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgbWV0aG9kcy5kYXRlU2VsZWN0b3IuY2hhbmdlSGFuZGxlcik7XHJcblx0XHRcdFx0XHRkYXRlU2VsZWN0b3Jba2V5XS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmNoYW5nZUhhbmRsZXIpO1xyXG5cdFx0XHRcdFx0ZGF0ZVNlbGVjdG9yW2tleV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgbWV0aG9kcy5kYXRlU2VsZWN0b3IuY2hhbmdlSGFuZGxlcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdE9iamVjdC5rZXlzKGVsZW1lbnRzLmZvcm1FbGVtZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0XHRlbGVtZW50cy5mb3JtRWxlbWVudFtrZXldLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG1ldGhvZHMuZm9ybS5jbGlja0hhbmRsZXIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdE9iamVjdC5rZXlzKGVsZW1lbnRzLnJlcXVpcmVkRmllbGRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdFx0XHRlbGVtZW50cy5yZXF1aXJlZEZpZWxkc1trZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBtZXRob2RzLmZpZWxkRWxlbWVudC5mb2N1c0luKTtcclxuXHRcdFx0XHRlbGVtZW50cy5yZXF1aXJlZEZpZWxkc1trZXldLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgbWV0aG9kcy5maWVsZEVsZW1lbnQuZm9jdXNPdXQpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24gKHZpZXdwb3J0KSB7XHJcblx0XHRpZiAoZWxlbWVudHMuZm9ybUNvbnRhaW5lcikge1xyXG5cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0bWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKGVsZW1lbnRzLmZvcm1Db250YWluZXIpIHtcclxuXHRcdFx0JChlbGVtZW50cy5mb3JtRWxlbWVudCkub2ZmKCdzdWJtaXQnLCBtZXRob2RzLmZvcm0uY2xpY2tIYW5kbGVyKTtcclxuXHRcdFx0JChlbGVtZW50cy5kYXRlU2VsZWN0b3JBbGxGaWVsZHMpLm9uKCdjbGljaycsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLnNldEZvY3VzKTtcclxuXHRcdFx0JChlbGVtZW50cy5kYXRlU2VsZWN0b3JGdWxsRGF0ZSkub24oJ2NoYW5nZScsIG1ldGhvZHMuZGF0ZVNlbGVjdG9yLmZ1bGxDaGFuZ2VIYW5kbGVyKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0bW91bnQ6IG1ldGhvZHMubW91bnQsXHJcblx0XHRpbml0OiBtZXRob2RzLmluaXQsXHJcblx0XHR1bm1vdW50OiBtZXRob2RzLnVubW91bnQsXHJcblx0XHRyZW5kZXI6IG1ldGhvZHMucmVuZGVyLFxyXG5cclxuXHRcdHNlbGVjdG9yOiBzZWxlY3RvcnMuY29udGFpbmVyXHJcblx0fTtcclxufSgpKTsiLCJtZXRob2RzLm1vZHVsZXMgPSB7XHJcblx0J2luaXRBbGwnOiBmdW5jdGlvbiAodmlld3BvcnQpIHtcclxuXHRcdE9iamVjdC5rZXlzKG1vZHVsZXMpLmZvckVhY2goIGZ1bmN0aW9uIChtb2R1bGVOYW1lLCBrZXkpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAobW9kdWxlc1ttb2R1bGVOYW1lXS5pbml0KSB7XHJcblx0XHRcdFx0XHR2YXIgZXhpc3RlZCA9IG1vZHVsZXNbbW9kdWxlTmFtZV0uaW5pdCh2aWV3cG9ydCk7XHJcblx0XHRcdFx0XHRpZiAoZXhpc3RlZCkge1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmluZm8oJ2luaXRpYWxpc2VkIG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybignZmFpbGVkIHRvIGluaXQgbW9kdWxlOiAnLCBtb2R1bGVOYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHQnbW91bnRBbGwnOiBmdW5jdGlvbiAodmlld3BvcnQpIHtcclxuXHRcdE9iamVjdC5rZXlzKG1vZHVsZXMpLmZvckVhY2goIGZ1bmN0aW9uIChtb2R1bGVOYW1lLCBrZXkpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAobW9kdWxlc1ttb2R1bGVOYW1lXS5tb3VudCkge1xyXG5cdFx0XHRcdFx0dmFyIGV4aXN0ZWQgPSBtb2R1bGVzW21vZHVsZU5hbWVdLm1vdW50KHZpZXdwb3J0KTtcclxuXHRcdFx0XHRcdGlmIChleGlzdGVkKSB7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5pbmZvKCdtb3VudGVkIG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybignZmFpbGVkIHRvIG1vdW50IG1vZHVsZTogJywgbW9kdWxlTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0J3VubW91bnRBbGwnOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRPYmplY3Qua2V5cyhtb2R1bGVzKS5mb3JFYWNoKCBmdW5jdGlvbiAobW9kdWxlTmFtZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdG1vZHVsZXNbbW9kdWxlTmFtZV0udW5tb3VudCgpO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdC8vY29uc29sZS53YXJuKCdmYWlsZWQgdG8gdW5tb3VudCBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0J3JlbmRlckFsbCc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdE9iamVjdC5rZXlzKG1vZHVsZXMpLmZvckVhY2goIGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0bW9kdWxlc1ttb2R1bGVOYW1lXS5yZW5kZXIoKTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUud2FybignZmFpbGVkIHRvIFJlbmRlciBtb2R1bGU6ICcsIG1vZHVsZU5hbWUpO1xyXG5cdFx0XHRcdC8vY29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTsiLCJ2YXIgbW9kdWxlcyA9ICh3aW5kb3cubW9kdWxlcyA9IHdpbmRvdy5tb2R1bGVzIHx8IHt9KTtcclxuXHJcbm1vZHVsZXNbXCJnZW5lcmFsXCJdID0gKGZ1bmN0aW9uKCkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICB2YXIgZWxlbWVudHMsIG1ldGhvZHMsIGFjY2Vzc2liaWxpdHk7XHJcblxyXG4gIGVsZW1lbnRzID0ge307XHJcbiAgbWV0aG9kcyA9IHt9O1xyXG5cclxuICBtZXRob2RzLmh0bWxFbGVtZW50ID0ge1xyXG4gICAgZ2V0QXR0cmlidXRlOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGlmIChkYXRhLmVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5lbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSkgfHwgZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBoYXNBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24oZGF0YSwgYXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCBcImdpXCIpO1xyXG4gICAgICByZXR1cm4gcmVnZXgudGVzdChhdHRyaWJ1dGVWYWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgYWRkQXR0cmlidXRlVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5nZXRBdHRyaWJ1dGUoZGF0YSk7XHJcblxyXG4gICAgICBpZiAoIW1ldGhvZHMuaHRtbEVsZW1lbnQuaGFzQXR0cmlidXRlVmFsdWUoZGF0YSwgYXR0cmlidXRlVmFsdWUpKSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZVZhbHVlICsgXCIgXCIgKyBkYXRhLmF0dHJpYnV0ZVZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYXR0cmlidXRlVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGEuZWxlbWVudC5zZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICB2YXIgYXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LmdldEF0dHJpYnV0ZShkYXRhKTtcclxuICAgICAgdmFyIGhhc0F0dHJpYnV0ZVZhbHVlID0gbWV0aG9kcy5odG1sRWxlbWVudC5oYXNBdHRyaWJ1dGVWYWx1ZShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGF0dHJpYnV0ZVZhbHVlXHJcbiAgICAgICk7XHJcbiAgICAgIHZhciB2YWx1ZVJlbW92ZWQgPSBmYWxzZTtcclxuICAgICAgaWYgKGhhc0F0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChkYXRhLmF0dHJpYnV0ZVZhbHVlLCBcImdpXCIpO1xyXG4gICAgICAgIHZhciBuZXdBdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZVZhbHVlLnJlcGxhY2UocmVnZXgsIFwiXCIpLnRyaW0oKTtcclxuICAgICAgICBpZiAobmV3QXR0cmlidXRlVmFsdWUpIHtcclxuICAgICAgICAgIGRhdGEuZWxlbWVudC5zZXRBdHRyaWJ1dGUoZGF0YS5hdHRyaWJ1dGVLZXksIG5ld0F0dHJpYnV0ZVZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YS5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShkYXRhLmF0dHJpYnV0ZUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlUmVtb3ZlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlUmVtb3ZlZDtcclxuICAgIH0sXHJcbiAgICB0b2dnbGVBdHRyaWJ1dGVWYWx1ZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBkYXRhLmF0dHJpYnV0ZVZhbHVlID0gZGF0YS5yZW1vdmVBdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgdmFyIHZhbHVlVG9nZ2xlZCA9IGZhbHNlO1xyXG4gICAgICB2YXIgcmVtb3ZlQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmh0bWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZVZhbHVlKGRhdGEpO1xyXG5cclxuICAgICAgaWYgKHJlbW92ZUF0dHJpYnV0ZVZhbHVlKSB7XHJcbiAgICAgICAgZGF0YS5hdHRyaWJ1dGVWYWx1ZSA9IGRhdGEuYWRkQXR0cmlidXRlVmFsdWU7XHJcbiAgICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC5hZGRBdHRyaWJ1dGVWYWx1ZShkYXRhKTtcclxuICAgICAgICB2YWx1ZVRvZ2dsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZVRvZ2dsZWQ7XHJcbiAgICB9LFxyXG4gICAgaGFzQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XHJcbiAgICAgIHJldHVybiAoXCIgXCIgKyBlbGVtZW50LmNsYXNzTmFtZSArIFwiIFwiKS5pbmRleE9mKFwiIFwiICsgdmFsdWUgKyBcIiBcIikgPiAtMTtcclxuICAgIH0sXHJcbiAgICBnZXRDbG9zZXN0UGFyZW50Tm9kZTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICB2YXIgZWxlbWVudCA9IGRhdGEuY3VycmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICB3aGlsZSAoXHJcbiAgICAgICAgbWV0aG9kcy5odG1sRWxlbWVudC5oYXNDbGFzcyhcclxuICAgICAgICAgIGVsZW1lbnQsXHJcbiAgICAgICAgICBkYXRhLmdldFBhcmVudEVsZW1lbnQuYXR0cmlidXRlVmFsdWVcclxuICAgICAgICApID09PSBmYWxzZVxyXG4gICAgICApIHtcclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEubm9kZU5hbWUgfHwgXCJkaXZcIik7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZGF0YS5jbGFzc05hbWUgfHwgbnVsbDtcclxuXHJcbiAgICAgIGlmIChkYXRhICYmIGRhdGEuYWRkQXR0cmlidXRlcykge1xyXG4gICAgICAgIGRhdGEuYWRkQXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uKGF0dHJpYnV0ZURhdGEpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZURhdGEuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBtZXRob2RzLmh0bWxFbGVtZW50LmFkZEF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZURhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5ID0ge1xyXG4gICAgc2V0OiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIG1ldGhvZHMuaHRtbEVsZW1lbnQudG9nZ2xlQXR0cmlidXRlVmFsdWUoZGF0YSk7XHJcbiAgICAgIG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5zZXRMb2NhbFN0b3JlKGRhdGEuZWxlbWVudCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0RnJvbUVsZW1lbnQ6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgcmV0dXJuIG1ldGhvZHMuaHRtbEVsZW1lbnQuZ2V0QXR0cmlidXRlKGRhdGEpO1xyXG4gICAgfSxcclxuICAgIHNldExvY2FsU3RvcmU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgcmV0dXJuIChhY2Nlc3NpYmlsaXR5ID0gbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmdldEZyb21FbGVtZW50KGRhdGEpKTtcclxuICAgIH0sXHJcbiAgICBnZXRMb2NhbFN0b3JlOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGFjY2Vzc2liaWxpdHk7XHJcbiAgICB9LFxyXG4gICAgZGF0YU1vdXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgZWxlbWVudDogZWxlbWVudHMuYm9keSxcclxuICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiYWNjZXNzaWJpbGl0eVwiLFxyXG4gICAgICAgIGFkZEF0dHJpYnV0ZVZhbHVlOiBcIm1vdXNlXCIsXHJcbiAgICAgICAgcmVtb3ZlQXR0cmlidXRlVmFsdWU6IFwia2V5Ym9hcmRcIixcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gICAgZGF0YUtleWJvYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgZWxlbWVudDogZWxlbWVudHMuYm9keSxcclxuICAgICAgICBhdHRyaWJ1dGVLZXk6IFwiYWNjZXNzaWJpbGl0eVwiLFxyXG4gICAgICAgIGFkZEF0dHJpYnV0ZVZhbHVlOiBcImtleWJvYXJkXCIsXHJcbiAgICAgICAgcmVtb3ZlQXR0cmlidXRlVmFsdWU6IFwibW91c2VcIixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBtZXRob2RzLmV2ZW50TGlzdGVuZXIgPSB7XHJcbiAgICBtb3VzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5zZXRLZXlib2FyZCk7XHJcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbWV0aG9kcy5ldmVudExpc3RlbmVyLnNldE1vdXNlKTtcclxuICAgIH0sXHJcbiAgICBrZXlib2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbWV0aG9kcy5ldmVudExpc3RlbmVyLnNldE1vdXNlKTtcclxuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtZXRob2RzLmV2ZW50TGlzdGVuZXIuc2V0S2V5Ym9hcmQpO1xyXG4gICAgfSxcclxuICAgIHNldE1vdXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSBtZXRob2RzLmFjY2Vzc2liaWxpdHkuZGF0YU1vdXNlKCk7XHJcbiAgICAgIG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5zZXQoZGF0YSk7XHJcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5tb3VzZSgpO1xyXG4gICAgfSxcclxuICAgIHNldEtleWJvYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSBtZXRob2RzLmFjY2Vzc2liaWxpdHkuZGF0YUtleWJvYXJkKCk7XHJcbiAgICAgIG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5zZXQoZGF0YSk7XHJcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5rZXlib2FyZCgpO1xyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBtZXRob2RzLmluaXQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgZWxlbWVudHMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnRzLmJvZHksXHJcbiAgICAgIGF0dHJpYnV0ZUtleTogXCJhY2Nlc3NpYmlsaXR5XCIsXHJcbiAgICB9O1xyXG5cclxuICAgIGRhdGEuYWRkQXR0cmlidXRlVmFsdWUgPSBtZXRob2RzLmFjY2Vzc2liaWxpdHkuZ2V0RnJvbUVsZW1lbnQoZGF0YSk7XHJcblxyXG4gICAgbWV0aG9kcy5hY2Nlc3NpYmlsaXR5LnNldExvY2FsU3RvcmUoZGF0YSk7XHJcblxyXG4gICAgaWYgKG1ldGhvZHMuYWNjZXNzaWJpbGl0eS5nZXRMb2NhbFN0b3JlKCkgPT09IFwibW91c2VcIikge1xyXG4gICAgICBtZXRob2RzLmV2ZW50TGlzdGVuZXIubW91c2UoKTtcclxuICAgIH0gZWxzZSBpZiAobWV0aG9kcy5hY2Nlc3NpYmlsaXR5LmdldExvY2FsU3RvcmUoKSA9PT0gXCJrZXlib2FyZFwiKSB7XHJcbiAgICAgIG1ldGhvZHMuZXZlbnRMaXN0ZW5lci5rZXlib2FyZCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMucmVuZGVyID0gZnVuY3Rpb24odmlld3BvcnQpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIG1ldGhvZHMubW91bnQgPSBmdW5jdGlvbih2aWV3cG9ydCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgbWV0aG9kcy51bm1vdW50ID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vdW50OiBtZXRob2RzLm1vdW50LFxyXG4gICAgaW5pdDogbWV0aG9kcy5pbml0LFxyXG4gICAgdW5tb3VudDogbWV0aG9kcy51bm1vdW50LFxyXG4gICAgcmVuZGVyOiBtZXRob2RzLnJlbmRlcixcclxuICAgIGh0bWxFbGVtZW50OiBtZXRob2RzLmh0bWxFbGVtZW50LFxyXG4gIH07XHJcbn0pKCk7XHJcbiIsImNsYXNzIGZpbGVVcGxvYWRTaG93UHJldmlldXcge1xuICBjb25zdHJ1Y3RvcihmaWxlVXBsb2FkQ29udGFpbmVyKSB7XG4gICAgdGhpcy5maWxlVXBsb2FkQ29udGFpbmVyID0gZmlsZVVwbG9hZENvbnRhaW5lcjtcbiAgICB0aGlzLmNhY2hlZEZpbGVBcnJheSA9IFtdO1xuXG4gICAgdGhpcy5pbnB1dFR5cGVGaWxlID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cImZpbGVcIl0nKTtcbiAgICB0aGlzLmlucHV0TmFtZUZpbGUgPSBmaWxlVXBsb2FkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZmlsZVwiXScpO1xuICAgIHRoaXMuaW5wdXRMYWJlbCA9IGZpbGVVcGxvYWRDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnVwbG9hZC1maWVsZC1jb250cm9sXCJcbiAgICApO1xuICAgIHRoaXMuaW1hZ2VQcmV2aWV3Q29udGFpbmVyID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgJ1t2YXJpYW50PVwiZmlsZS1wcmV2aWV3XCJdJ1xuICAgICk7XG4gICAgdGhpcy5lcmFzZUltYWdlQnV0dG9uID0gZmlsZVVwbG9hZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZXJhc2UtZmlsZS11cGxvYWRcIlxuICAgICk7XG5cbiAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IHtcbiAgICAgIGJhc2VJbWFnZTpcbiAgICAgICAgXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWlRQUFBRDZDQU1BQUFDbWhxdzBBQUFBK1ZCTVZFVUFBQUQyOXUzdTd1bnQ3ZW50N2VudTd1anU3dWlob3FDaW82R2lvNktqcEtPa3BhU21wcVNtcDZXb3FLYXFxNm1xcTZxcnE2cXNyYXV0cmF1dXI2MndzYTZ4c2EreHNyQ3lzN0d6dExLMHRiSzF0clMydDdTM3Q3VzR1YmE1dXJlNnU3ZTd2TG04dmJ1OXZydkF3TDNBd2IzRHhNSEZ4Y1BHeHNQSHg4VEl5Y1hMek1qTHpNbk16TW5OenNyUHo4dlAwTXpRME0zUzBzL1UxTkRWMWRMWDE5VFkyTlRZMk5YWjJkYmEydFhiMjliYzNOZmMzTmpjM2RuZDNkcmUzdHJlMzl2ZzROdmg0ZHppNHQzaTR0N2o0OTdrNU4vazVPRGw1ZURsNWVIbDV1TG01dUhuNStMbzZPUHA2ZVRxNnVYcjYrYnM3T2Z0N2VoNTRLeElBQUFBQjNSU1RsTUFIS2JsNXV6dHZxbDlzd0FBQkExSlJFRlVlTnJ0M1ZsVDAxQVlnT0cwb0VFRTkxMFVSTnpGQlZGY3FDZ0tpckxVL1A4ZkkzUVliRU9TZHRyTXlKenp2SGZNbEZ4ODMzTkJRdVkwU1JyTjhVd3FhYnpaU0pMR2FZTlFWYWNhU2RNVVZGMHpHVE1FVlRlV21JSDZCWWtnRVNTQ1JKQUlFa0VpU0NSSUJJa2dFU1NDUkpBSUVrRWlRU0pJQklrZ0VTU0NSSkFJRWdrU1FTSklCSWtnRVNTQ1JKQklrQWdTUVNKSUJJa2dFU1NDUklKRWtBZ1NRU0pJQklrZ2tTQVJKSUpFa0FnU1FTSklCSWtFaVNBUkpJSkVrQWdTUVNKSUpFZ0VpU0FSSklKRWtBZ1NRU0pCSWtnRWlTQVJKSUpFa0FnU0NSSkJJa2dFaVNBUkpJSkVna1NRNVB2eGJkUyt0eUVKdVpWYjArbm9UVjU3OWdlU1FHcy9TT3ZxeGlZa1lmWXdyYStyYlVoQzdOTkVqVWpTSjVDRTJQMDZqYVRuSUFteEt3ZTd2YjQ2OHQzTjE0V09raTFJQXV6TXdXcmYxSENoM1E2Uzk1QUVXR2UxYjAvV2xTQ0JCQkpJSUFrZFNYdnQxYU5YYTIxSUlDbGQ3ZEpVNStlcEpVZ2dLVjd0enV6UkE0L1pIVWdnS1ZydGZOZGpzWGxJSUNsWTdYTFB3OU5sU0NBNXZ0cUxQVWd1UWdMSnNkWCt6djBmWmhzU1NQS3JYY2toV1NuNWpWOHpHNURFaXVSMURzbnJFaU9YMHZNYmtFU0taRFdIWkxYTVNGcXNCSklJa096MXZuNDBzVmRxcEZnSkpESGMzZHpzUVhLendraWhFa2hpUUxJKzJmM3krM3FWa1NJbGtNU0FKRnZzUXJKWWJhUkFDU1JSSU1sZW5qMFVjUFpsUHlQSGxVQVNCNUpzYys3Y3dldk1jNXY5alJ4VEFra2tTUGJiK3JpVlpZTVl5U3VCSkI0a0pSVVl5U21CSkhZa2hVWjZsVUFTT1pJU0l6MUtJSWtiU2FtUmJpV1F4SVprdlQyWWtTNGxrRVNHcERWOXR6MllrWDlLSUlrTFNXczZUWStVOURGeXBBU1NxSkMwT2ljZkhTcnBhMlQvazVCRWg2UjFlRHBXUjhrQVJ0SVpTR0pEMGpvNlFXMWZ5U0JHSUlrT1NhdnJsTDI3UHdjeEFrbHNTRm85SnpGT3BwQkFrbDl0YTVqVE9pR0pDc2xRUmlDSkNzbHdSaUNKQ2NtUVJpQ0pDTW13UmlDSkI4bVhvVStZaHlRYUpNOVRTQ0NCQkJKSUlJRUVFa2dnZ1FRU1NDQ0pBc255ekxBOWhpUVdKQ2ZuU3BCQUFna2trQVRYeEZDblB4ZlU3aUI1QjBtQVhUNVk3WjN0MFkwODdTRFpnQ1RBN3RYNmJaNVRHU1FCdGx3cmtnVklnbXkrUmlNWGRpRUpzcDNiOVJuNW5FRVNhQy9PMS9QM3lNSnVCa200Ylg5NE8ycnZOaUtiV1hSSUJJa2dFU1NDUkpBSUVrRWlRU0pJQklrZ0VTU0NSSkFJRWdrU1FTSklCSWtnRVNTQ1JJSkVrQWdTUVNKSUJJa2dFU1FTSklKRWtBZ1NRU0pJQklrZ2tTQVJKSUpFa0FnU1FTSklCSWtFaVNBUkpJSkVrQWdTUVNKSUpFZ0VpU0FSSklKRWtBZ1NDUkpCSWtnRWlTQVJKSUpFa0VpUUNCSkJJa2dFaVNBUkpJSkVna1NRQ0JKQklrZ0VpU0FSSkJJa2drU1E2UDhnR1RNRFZUZVdOQTFCMVRXVHhtbFRVRlduR2tuU2FJNGJoTW9hYnphU3YrNEJIRlZvSFp6ZkFBQUFBRWxGVGtTdVFtQ0NcIixcbiAgICAgIHN1Y2Nlc3NQZGY6XG4gICAgICAgIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFpUUFBQUQ2Q0FNQUFBQ21ocXcwQUFBQ0NsQk1WRVVBQUFEMjl1M3U3dW50N2VudDdlbnU3dWp1N3VoWW93QmJwQVJjcFFaZHBnaGpxQkZscVJScXJCMXRyU0J1cmlKd3J5VnlzQ2g2dERXQXR6MkN1RUtHdWtlUXYxYVZ3VitZdzJPWncyU2F4R1dheEdlYnhHbWZ4bTZob3FDaW82R2lvNktqcEtPa3BhU2t5WGVtcHFTbXA2V25xS2FueW5xb3FLYW9xYWVwcXFpcXE2aXFxNm1xcTZxcXpINnJxNnFyckt1dHJhdXRycXl1cjZ5dnI2MndzYTZ4c2EreHNyQ3lzckN5czdDeXM3R3pzN0d6dExHenRMSzB0YkswdGJPMXRiTzF0clMydDdXM3Q3VzN1TGEzMHBPNHViYTV1YmU1dXJlNnU3ZTd2TG04dkxxOHZidTgxWnE4MVp5OXZydTkxWjYrdnJ5K3Y3eS92NzIvd0wyLzFxREF3TDNBd2IzQXdiN0J3cjdDd3IvQ3c3L0R3OEREeE1ERHhNSEQyS1hFeE1IRXhNTEZ4Y1BGeHNQR3hzUEcycXZIeDhUSHlNVEl5TVhJeWNYSnljYkp5c2JLeXNmS3k4ZksyN0RLM0xITHk4Zkx5OGpMek1uTXpNbk56Y25OenNyUHo4dlAwTXpRME0zUjBjM1IwczdTMHMvVTFORFUxZEhXMTlQWDRzWFkyTlRZMk5YWTJkWFoyZFhaMmRiYTJ0WGEydGJhMjliYjI5YmI1TXJiNU12YzNOZmMzTmpjM2RqYzNkbmQzZG5lM3RyZTM5dmYzOXZnNE52ZzU5UGg0ZHpoNGQzaTR0M2k0dDdpNk5iajQ5N2s1Ti9rNU9EbDVlRGw1ZUhsNXVMbDZkcm01dUhuNStMbjUrUG82T1BwNmVUcTZ1WHE2K0xxN09QcjYrYnM3T1hzN09mdDdlZnQ3ZWpBOXRWeUFBQUFCM1JTVGxNQUhLYmw1dXp0dnFsOXN3QUFCWWRKUkVGVWVOcnQzR2wzRTJVWWdPRWtMUlJGRVBjOWhBcUlDQXFvNEFhaW9pZ3VpT0tHaXFBb1VIR2pRaFdMSUlnaWlDaklJdFNxUUFzUjV6OUsyNW1HSkcwNlRmc2h6VnozRjJqbWJROW5udXRrZVdkS0twWE9OQWJTSURWbTBxbFVlcndUb1VxTlM2Y3l6b0lxbDBrMU9BbXFYRVBLT2RCUVFTSklCSWtnRVNTQ1JKQUlFZ2tTUVNKSUJJa2dFU1NDUkpCSWtBZ1NRU0pJQklrZ0VTU0NSSUpFa0FnU1FTSklCSWtnRVNRU0pJSkVrQWdTUVNKSUJJa2drU0FSSklKRWtBZ1NRU0pJSkVnRWlTQVJKSUpFa0FnU1FTSkJJa2dFaVNBUkpJSkVrQWdTQ1JKQklrZ0VpU0FSSklKRWtFaVFDQkpCSWtnRWlTQVJKSUpFZ2tTUUNCSkJJa2dFaVNDUklCRWtna1NRQ0JKQklrZ0VpUVNKSUJFa2drU1FDQkpCSWtna1NBU0pJQkVrZ2tTUUNCSkJJa0VpU0FTSklCRWtna1NRQ0JJSkVrRWlTQVNKSUJFa2drU1FTSkFJRWtFaVNBU0pJQkVrRWlTQ1JKQUlFa0VpU0FTSklKRWdFU1NDUkpBSUVrRWlTQVNKQklrZ0VTU0NSSkFJRWtFaVNDUklCSWtnRVNTQ1JKQUlFa0VpUVNKSUJJa2dFU1NDUkpCSWtBZ1NRU0pJQklrZ0VTU0NSSUpFaVVaeXN1M3l2bXJmYy9oRXZuelYvcmFTMm44OGRtYVFuMWkydHRCdVNNWmszMlRMYW41NDdaNlNWYXV5QTVSYjh2bVJBWDdpZ0d2N2VoeVNla0hTMDd6V3JsaUR2MmR6RnlSSlJaTE56dGtYYi9BelArbUdKS2xJc3RrTnNRYWZ6YzcrR1pMRUlzbHVpWWNrbTJ1REpCRkltdWYyMWx3MDFKM3hrR1N6YXlCSkFwSW53cS8vT3JoOWZ2OVE1K1pMQnIrK0s2enp5UGRiSHMwVnhyK3hIRW4vMmtKNVNPb0N5YVh5WDg2TVp0OWFNdmdOUmQ5NzVwMWMrWlBPSUdzVFVtS1FCTUdocWVHakM0Y1kvS21IK2pkWGprS1NMQ1RCMnZEUnFmOE1NZmp1NVpHU0paQWtERWsrZWdQYlB0VGdMeTZPbE95REpGbElnb1hodzE4TU9maU9HZUd4UnlCSkdKS1YwVWVVb1FlL1BYb3EyUXRKc3BCOEZENzg1dENEejg4S0Q3NEZTYktRdkJBKy9FR013VzhNRDk0SFNUTGZrMnlOTWZpajBldk5NVWdTK2VsbVo1eG5oeGxGb2lCSkNKTE4wVDdKMlRoSW5pbTZnZ05KTXBBY216YXNqN1hyd3FNcml0YXVPVjFjSnlUMWhPVHcvZEc3akcyeGtMU0VSeGNYclUzZUplQUVJVGxWbVBLOGZDd2syOEtqQ3lDcGJ5UnoxdlQyN0FQTmxlNG5HUmpKMTlHZEJaQWs3ODYwQW9uS1NGcUxyaGxEa2lRa3E0T1lTRGFFUjUrQ0pHRkltcmNIY1pHOEVSNWRDVW1pa09SV25BaGlJMWxVZERVd1d2dGNlM0UvbEgvajd4KytWK2pUdnlFWlMwZ1dyTzhvWGxVUlNWZXU2T2FUMkp0cC85N2FWTlFWOTBKUzIwaG1MTzF0K2FwMUxkK2VMVnRWY2ZEZlJjOCs1NGFINUs2bTBsNkNaSXpza3d4VXhjR3ZDQTgrRmd3UHllUXlKTmREVXFkSVRrZXZOaDhQRTBtWmthYXJJYWxUSks5RXJ6Wi9qZ0RKaEJkM1RXcHFtZ3hKZlNMWldmcGJmTlVnbWZCYUVQeDBKU1IxaXVSNGREUEp0TTdxa2ZRWWdhUnVrUnlNakdUWEJsVWdtZlRaVFpHUkExNXVhcWx6TzladCtXVlVrSFMzUkRlZVpCZmxxMEF5OFVBUTNGSXdBa25OdEhkMnp3aGZ6NDhZeWNuVzJmM2JiM2QzQkZVZ21YTGgwaCszOVJ1QnBGYnFuTjQzdzAzVklIbXlOYXpsM2Vmblg3NkxmeWlvQmtuVERSZjYvdHBuQkpKYWFYMzBSak5mQlpKQm1yVS9xQTVKcUNRMEFrbXR0RFNhN0sramhtUmhSMUF0a2w0bGtSRklhcVZseGI4bE0zSWt1YmU3ZytxUlhGTFNid1NTV21sVE9NUHBGMGNGU2U3VjA3SDNWQWJlSjVreXNRbVNHcXRyVHQ4TTI0SlJRUExnKzZmaTc2bVVkbFhadFp0cklhbVJqdmY4NzBUTlc0TVJJV21ldTJqWjZoMmR3OWhUS2UvR01pUjNRbElyWGZ4dHgrNnpOZkR2K09PYUVpUFhuWWRFSloxLyt2YWJDOTN4OG44QkpLci9JQkVrZ2tTUUNCSkJJa2dFaVFTSklCRWtna1NRYUN3aGFYQU9WTG1HVk1aSlVPVXlxZlI0WjBHVkdwZE9wZEtaUmlkQ2c5V1lTYWYrQndyVy9nNHNLT3REQUFBQUFFbEZUa1N1UW1DQ1wiLFxuICAgICAgc3VjY2Vzc1ZpZGVvOlxuICAgICAgICBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZlFBQUFENkNBWUFBQUJYcTdWT0FBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUViQkpSRUZVZUFIdDNVK01uSFVaQi9EZjdFNy9ibWVYMXUxdVc2QkFXNkJGZzZpeHRBcWFZR0kwTVJ6QXV4ZE9ldEtUTjlFWXI1NjhLR2R2a3BCZ29qRVJvN1NXSm1nUXFXM0Jpb0pZT3J1dFMzZmI3ai9HbVRaZFczWjJPN09kbWZkOW4vbHMwakQ3emp2diszcyt6d05mWnVhZFRtbHk4bXd0K1NGQWdBQUJBZ1FLTFRCUTZOVmJQQUVDQkFnUUlIQlZRS0FiQkFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0FnME0wQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQ2JBUUlFQ0JBZ0VFQkFvQWRvb2hJSUVDQkFnSUJBTndNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNEdDQkFnUUlCQUFBR0JIcUNKU2lCQWdBQUJBZ0xkREJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVoa2dRSUFBQVFJQkJBUjZnQ1lxZ1FBQkFnUUlDSFF6UUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEb1pvQUFBUUlFQ0FRUUVPZ0JtcWdFQWdRSUVDQWcwTTBBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtDYkFRSUVDQkFnRUVCQW9BZG9vaElJRUNCQWdJQkFOd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0R0NCQWdRSUJBQUFHQkhxQ0pTaUJBZ0FBQkFnTGREQkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWhrZ1FJQUFBUUlCQkFSNmdDWXFnUUFCQWdRSUNIUXpRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvWm9BQUFRSUVDQVFRRU9nQm1xZ0VBZ1FJRUNBZzBNMEFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0NiQVFJRUNCQWdFRUJBb0Fkb29oSUlFQ0JBZ0lCQU53TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRHQ0JBZ1FJQkFBQUdCSHFDSlNpQkFnQUFCQWdMZERCQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1aGtnUUlBQUFRSUJCQVI2Z0NZcWdRQUJBZ1FJQ0hRelFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG9ab0FBQVFJRUNBUVFFT2dCbXFnRUFnUUlFQ0JRUmtDQVFIY0ZGaFlXMDZuVHAxUDEzRVNhbnBucDdzbHU4K2dEQXdOcDA2YU5hWGg0Sk8zY09aYkd4OGJTNE9EZ2JSN1Z3d2tRNklWQWFYTHliSzBYSjNJT0F2MG8wQWp6bDQ4Y1RkUFQrUTd5bFhxemZ2MzZ0Ry9mbm5UdlBidFRJK3o5RUNDUVh3SC9odWEzTjFZV1FLRHh6THlvWWQ3Z241dWJTeWRPbkV4SGpoNUxseTlmRHRBUkpSQ0lLeURRNC9aV1pUa1FPSGV1bW9OVjNQNFNwcVkrcUwvUzhNZDBjWHI2OWcvbUNBUUlkRVZBb0hlRjFVRUpYQk9ZbWJrVWhtSjJkaTRkTzNaY3FJZnBxRUtpQ2Jnb0xscEgxWk43Z2NiNzBpTWpJN2xZWjdYYTNpc0kxMFA5MEtNSFU2V3lKUmMxV0FRQkF0Y0VCTHBKSU5CamdVYVlQM3J3TXowK2EvUFR2ZmpMWHkyNzQyUGJ0cVZkZCs1TXAwNittZWJtNTViZGZ6WFVYem1laFBveUdoc0laQ3JnSmZkTStaMmNRUDRFQnVvZlU3dG45OTNwc2NjTzFUL0N0cW5wQXErSHV2ZlVtL0xZU0NBVEFZR2VDYnVURXNpL3dPYk5tOVBuRGg5Y1BkUzlwNTcvUmxwaDN3Z0k5TDVwdFVJSnRDL1FlSVl1MU50Mzh3Z0NXUWdJOUN6VW5aTkFnUVNFZW9HYVphbDlMU0RRKzdyOWlpZlFta0FqMUE4ZittemF0SEdWOTlTOS9ONGFwcjBJZEVsQW9IY0oxbUVKUkJOb3ZLZCsrTEJRajlaWDljUVJFT2h4ZXFrU0FsMFhFT3BkSjNZQ0Ftc1dFT2hycHZOQUF2MHBJTlQ3cysrcXpyK0FRTTkvajZ5UVFPNEVoSHJ1V21KQkJKSkFOd1FFQ0t4SlFLaXZpYzJEQ0hSTlFLQjNqZGFCQ2NRWGFDWFVqNy95NnRXdllZMnZvVUlDMlFvSTlHejluWjFBNFFWdUZlcVhyMXhPcjczMjE4TFhxUUFDZVJjUTZIbnZrUFVSS0lEQXJVTDkvWFBuMHZuekZ3cFFpU1VTS0s2QVFDOXU3NnljUUs0RWJoWHFiNzUxSmxmcnRSZ0MwUVFFZXJTT3FvZEFoZ0tOVUQ5WS8ycllVcW0wYkJVVEV4TnBmbjUrMlhZYkNCRG9qSUR2USsrTW82TVFDQ093dUxpWVptWXVyYm1lZ1lHQk5EcTZMVldya3pjZG8xYXJwV285MUhmdDNIblRkcjhRSU5BWkFZSGVHVWRISVJCRzRQejU4K21sMy8yK0svVmNtcm5jbGVNNktBRUN5ZWZRRFFHQmZoWW9sd2Q3V3Y3czNHeFB6K2RrQlBwSndIdm8vZFJ0dFJMNGlFQ2xVdm5JbGk3L1d1dnk4UjJlUUI4TENQUSticjdTQ2V6YnV3Y0NBUUpCQkFSNmtFWXFnOEJhQk1iSHg5S0IvUTgwdlNwOUxjZnpHQUlFc2hOd1VWeDI5czVNSUJjQ2UrdlAwc2ZIeDFQalkyVXpsK3BYdDNmZ1pmSEd4OVBlL2ZkN3VhalBJZ2owaTRCQTc1ZE9xNVBBS2dKYnRneWx4cDlPL1RRKzlpYlFPNlhwT0FSYUUvQ1NlMnRPOWlKQWdBQUJBcmtXRU9pNWJvL0ZFU0JBZ0FDQjFnUUVlbXRPOWlKQWdBQUJBcmtXRU9pNWJvL0ZFU0JBZ0FDQjFnUmNGTmVhazcwSVpDWXdOVFdWL243bTdmb1hteXhrdG9ZN1JpcnAvdnYzcGNiZjArNkhBSUY4Q2dqMGZQYkZxZ2dzQ2J4eDRsVDl1OFRQTC8yZXhZMXF0WnFHaDRmVHpwMDdzamk5Y3hJZzBJS0EvOTF1QWNrdUJMSVVtSjI5a3VYcGw4NTlaZGJmdzc2RTRRYUJIQW9JOUJ3MnhaSUlFQ0JBZ0VDN0FnSzlYVEg3RStpeFFGN2V0eTRQOXZhYjJYck03SFFFQ2k4ZzBBdmZRZ1ZFRjdqdnZudFR1Wnp0NVM0akk4TnBiR3g3ZEdyMUVTaTBRTGIvbFNnMG5jVVQ2STNBN3J2dlNvMC9mZ2dRSUxDYWdHZm9xK200andBQkFnUUlGRVJBb0Jla1VaWkpnQUFCQWdSV0V4RG9xK200andBQkFnUUlGRVJBb0Jla1VaWkpnQUFCQWdSV0UzQlIzR282N2lPUUU0RUxGNmJTd3NKY1pxdXBWSWJUeG8wYk1qdS9FeE1nY0dzQmdYNXJJM3NReUZUZzlkZmZTUC84MXp1WnJxRlVLcVV2UFA3NVZLbHN5WFFkVGs2QXdNb0NYbkpmMmNZOUJISWhNREU1bWZrNmFyVmFtc3pCT2pLSHNBQUNPUllRNkRsdWpxVVJ5Sk5BTFUrTHNSWUNCSllKQ1BSbEpEWVFJRUNBQUlIaUNRajA0dlhNaXZ0TVlIaDRKQmNWM3pHU2ozWGtBc01pQ09SUXdFVnhPV3lLSlJHNFVlQ1REMzhpalk5dlQvUHo4emR1N3VudFJwaHYzWHBIVDgvcFpBUUl0Q2NnME52enNqZUJuZ3VVeTRQcHJqdDM5Znk4VGtpQVFMRUV2T1Jlckg1WkxRRUNCQWdRYUNvZzBKdXkyRWlBQUFFQ0JJb2xJTkNMMVMrckpVQ0FBQUVDVFFVRWVsTVdHd2tRSUVDQVFMRUVYQlJYckg1WmJSOEtWS3ZWZE9yVVcybCtJYnVyM0JzZm5XdGNiZCs0UU04UEFRTDVGQkRvK2V5TFZSRllFbWlFK1grbnBwWit6K0xHek15bHF4K2RjN1Y5RnZyT1NhQTFBWUhlbXBPOUNHUW1rT1V6OHh1THp2Sno4RGV1bzUzYkYrZXE2YjJMSjlQaWg2MS9VOTJHd2FGMDUvQkRhV041dUoxVDJaZEE1Z0lDUGZNV1dBQUJBcDBXcU5VVzAvTW5uMDIvL2NmUDFuVG84c0Q2OU9TRDMwMWZ1dStiYTNxOEJ4SElRc0JGY1Ztb095ZUJOZ1RXbGRlMXNYZjNkbDIzTGgvcmFLWEMzNXo1eVpyRHZISDhoZm96K3VmLzlvUDA1N012dG5JNit4REloWUJuNkxsb2cwVVFXRm5nd1FmMzVlS2l1QjNqNHlzdk1tZjNISDNuNXgxWlVlTTRuOXJ4dFk0Y3kwRUlkRnRBb0hkYjJQRUozS2JBOXUzYlUrT1BuOVlGcXBmZWJuM25WZmFjNk5CeFZqbUZ1d2gwVE1CTDdoMmpkQ0FDQklvcU1GZ3FwMmMrL2RQMHZTOGVTZHMyM2IxVVJxMzI0ZEp0Tndqa1hVQ2c1NzFEMWtlQVFGY0Zyb1g1Yy9XWDFwOU1ZME43MDdjUC9TS3RHOXpZMVhNNk9JRnVDQWowYnFnNkpnRUNoUkM0SHVZUGozK2xFT3UxU0FLckNRajAxWFRjUjRCQTRRVWFMNkYvNS9BTDZmSGQzN2lwbG1aaGZ2N3lPK25IeDU1Tzg0dFhidHJYTHdTS0lPQ2l1Q0oweVJvSkVGaVR3TkM2cmZXWDBKKy8rcjc0M3EyUHB2TEF1dlRTMjgrbGxjUDhxZFFJZFQ4RWlpZ2cwSXZZTldzbVFLQWxnY3FHMFRTeWNjZlN2bDkvNkllcFZCcE05Mjg3bkc1OG1mM2FNM05odmdUbFJpRUZ2T1JleUxaWk5BRUNyUWljblg0elBmZW5aOUppN2Y5ZmJQUDBnZThMODFidzdGTTRBWUZldUpaWk1BRUM3UWo4NWYxZkx3djE2NC8zelB5NmhIOUdFQkRvRWJxb0JnSUVWaFZvRnVyQ2ZGVXlkeFpRUUtBWHNHbVdUSUJBK3dJM2hyb3diOS9QSS9JdjRLSzQvUGZJQ29NSlROVy8yL3lWNDY4R3Ercm1jaFlYRjIvZWtKUGZHcUgrb3o4OGtTN09UcVNaK1FzNVdaVmxFT2lNZ0VEdmpLT2pFR2haWUc1dUxsV3IxWmIzRDdWanFUZlZWTmFQcG90ekUwMVAxcmhRcnRXZnlnWi9oMzZyVnZiTFhzQkw3dG4zd0FvQ0Myd1pHZ3BjWGZ1bERXM2UzUDZEMXZDSWo0ODlzWVpITFgvSVE5czdjNXpsUjdhRlFPY0ZCSHJuVFIyUndKTEE5ckhScGR2OWZxTlVLcVhSMGQ1NFBIWGcyYlNyc3YrMnlQZVBQcDYrdk9kYnQzVU1EeWJRUzRIUzVPVFpXaTlQNkZ3RStrbGdZV0V4dlh6a2FKcWVudW1uc3B2V2VtRC9BMm52M2oxTjcrdkd4c1VQNTlLci8za2h2ZnZCaWZybjBPZGFQc1dHd2FHMGUrU1I5TWlPcjlZZjA2UDNDRnBlblIwSnJDd2cwRmUyY1ErQmpnZzBRdjNVNmRPcGVtNGlUYy8wVjdDWHk0T3BVcW1rZmZVZ0h4OGY2NGluZ3hBZzBGeEFvRGQzc1pVQUFRSUVDQlJLd0h2b2hXcVh4UklnUUlBQWdlWUNBcjI1aTYwRUNCQWdRS0JRQWdLOVVPMnlXQUlFQ0JBZzBGeEFvRGQzc1pVQUFRSUVDQlJLUUtBWHFsMFdTNEFBQVFJRW1nc0k5T1l1dGhJZ1FJQUFnVUlKQ1BSQ3RjdGlDUkFnUUlCQWN3R0IzdHpGVmdJRUNCQWdVQ2dCZ1Y2b2Rsa3NBUUlFQ0JCb0x2QS9LNHMzTTNqNTJoWUFBQUFBU1VWT1JLNUNZSUk9XCIsXG4gICAgICBzdWNjZXNzTXVsdGlwbGU6XG4gICAgICAgIFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFmUUFBQUQ2Q0FZQUFBQlhxN1ZPQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBRTNGSlJFRlVlQUh0M1V0c1hOZDVCL0F6RW1tYklpVlpqa2pSVGlKTGlaNVcyamgyRWp0dDB3QXBVRFJBMEVYU2ZUZFp0YXQwMVYwZUtMcnRxcHZFNis1cUlNdWdRRk9rU1J6YmtveTZVR1FyZWtWT1RVb2tKZEY4bWc5TjU5S1JiSm12NGN5ZG1YdS8reHVETURsejc3bm4rMzFIK212dXpPWFVwcWJHNjhtTkFBRUNCQWdRS0xYQXJsTFAzdVFKRUNCQWdBQ0JOUUdCYmlFUUlFQ0FBSUVBQWdJOVFCT1ZRSUFBQVFJRUJMbzFRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvMWdBQkFnUUlFQWdnSU5BRE5GRUpCQWdRSUVCQW9Gc0RCQWdRSUVBZ2dJQkFEOUJFSlJBZ1FJQUFBWUZ1RFJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVqVkFnQUFCQWdRQ0NBajBBRTFVQWdFQ0JBZ1FFT2pXQUFFQ0JBZ1FDQ0FnMEFNMFVRa0VDQkFnUUVDZ1d3TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRORUNCQWdBQ0JBQUlDUFVBVGxVQ0FBQUVDQkFTNk5VQ0FBQUVDQkFJSUNQUUFUVlFDQVFJRUNCQVE2TllBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtCYkF3UUlFQ0JBSUlDQVFBL1FSQ1VRSUVDQUFBR0JiZzBRSUVDQUFJRUFBZ0k5UUJPVlFJQUFBUUlFQkxvMVFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG8xZ0FCQWdRSUVBZ2dJTkFETkZFSkJBZ1FJRUJBb0ZzREJBZ1FJRUFnZ0lCQUQ5QkVKUkFnUUlBQUFZRnVEUkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWpWQWdBQUJBZ1FDQ0FqMEFFMVVBZ0VDQkFnUUVPaldBQUVDQkFnUUNDQWcwQU0wVVFrRUNCQWdRRUNnV3dNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNE5FQ0JBZ0FDQkFBSUNQVUFUbFVDQUFBRUNCQVM2TlVDQUFBRUNCQUlJQ1BRQVRWUUNBUUlFQ0JBUTZOWUFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0JiQXdRSUVDQkFJSUNBUUEvUVJDVVFJRUNBQUFHQmJnMFFJRUNBQUlFQUFnSTlRQk9WUUlBQUFRSUVCTG8xUUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEbzFnQUJBZ1FJRUFnZ0lOQURORkVKQkFnUUlFQkFvRnNEQkFnUUlFQWdnSUJBRDlCRUpSQWdRSUFBQVlGdURSQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1alZBZ0FBQkFnUUNDQWowQUUxVUFnRUNCQWdRRU9qV0FBRUNCQWdRQ0NBZzBBTTBVUWtFQ0JBZ1FFQ2dXd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0TkVDQkFnQUNCQUFJQ1BVQVRsVUNBQUFFQ0JBUzZOVUNBQUFFQ0JBSUlDUFFBVFZRQ0FRSUVDQkFRNk5ZQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQmJBd1FJRUNCQUlJQ0FRQS9RUkNVUUlFQ0FBQUdCYmcwUUlFQ0FBSUVBQWdJOVFCT1ZRSUFBQVFJRUJMbzFRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvMWdBQkFnUUlFQWdnSU5BRE5GRUpCQWdRSUVCQW9Gc0RCQWdRSUVBZ2dJQkFEOUJFSlJBZ1FJQUFBWUZ1RFJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVqVkFnQUFCQWdRQ0NBajBBRTFVQWdFQ0JBZ1FFT2pXQUFFQ0JBZ1FDQ0FnMEFNMFVRa0VDQkFnUUVDZ1d3TUVDQkFnUUNDQWdFQVAwRVFsRUNCQWdBQUJnVzRORUNCQWdBQ0JBQUlDUFVBVGxVQ0FBQUVDQkFTNk5VQ0FBQUVDQkFJSUNQUUFUVlFDQVFJRUNCQVE2TllBQVFJRUNCQUlJQ0RRQXpSUkNRUUlFQ0JBUUtCYkF3UUlFQ0JBSUlDQVFBL1FSQ1VRSUVDQUFBR0JiZzBRSUVDQUFJRUFBZ0k5UUJPVlFJQUFBUUlFQkxvMVFJQUFBUUlFQWdnSTlBQk5WQUlCQWdRSUVCRG8xZ0FCQWdRSUVBZ2dJTkFETkZFSkJBZ1FJRUJBb0ZzREJBZ1FJRUFnZ0lCQUQ5QkVKUkFnUUlBQUFZRnVEUkFnUUlBQWdRQUNBajFBRTVWQWdBQUJBZ1FFdWpWQWdBQUJBZ1FDQ0FqMEFFMVVBZ0VDQkFnUUVPaldBQUVDQkFnUUNDQWcwQU0wVVFrRUNCQWdRRUNnV3dNRUNCQWdRQ0NBZ0VBUDBFUWxFQ0JBZ0FBQmdXNE5FQ0JBZ0FDQkFBSUNQVUFUbFVDQUFBRUNCQVM2TlVDQUFBRUNCQUlJQ1BRQVRWUUNBUUlFQ0JBUTZOWUFBUUlFQ0JBSUlDRFFBelJSQ1FRSUVDQkFRS0JiQXdRSUVDQkFJSUNBUUEvUVJDVVFJRUNBQUFHQmJnMFFJRUNBQUlFQUFnSTlRQk9WUUlBQUFRSUVCTG8xUUlBQUFRSUVBZ2dJOUFCTlZBSUJBZ1FJRUJEbzFnQUJBZ1FJRUFnZ0lOQURORkVKQkFnUUlFQkFvRnNEQkFnUUlFQWdnSUJBRDlCRUpSQWdRSUFBQVlGdURSQWdRSUFBZ1FBQ0FqMUFFNVZBZ0FBQkFnUUV1alZBZ0FBQkFnUUNDQWowQUUxVUFnRUNCQWdRRU9qV0FBRUNCQWdRQ0NBZzBBTTBVUWtFQ0JBZ1FFQ2dXd01FQ0JBZ1FDQ0FnRUFQMEVRbEVDQkFnQUFCZ1c0TkVDQkFnQUNCQUFJQ1BVQVRsVUNBQUFFQ0JBUzZOVUNBQUFFQ0JBSUlDUFFBVFZRQ0FRSUVDQkFRNk5ZQUFRSUVDQkFJSUNEUUF6UlJDUVFJRUNCQVFLQmJBd1FJRUNCQUlJQ0FRQS9RUkNVUUlFQ0FBQUdCYmcwUUlFQ0FBSUVBQWdJOVFCT1ZRSUFBQVFJRUJMbzFRSUFBQVFJRUFnZ0k5QUJOVkFJQkFnUUlFQkRvMWdBQkFnUUlFQWdnSU5BRE5GRUpCQWdRSUVCQW9Gc0RCQWdRSUVBZ2dJQkFEOUJFSlJBZ1FJQUFBWUZ1RFJBZ1FJQUFnUUFDQWoxQUU1VkFnQUFCQWdRRXVqVkFnQUFCQWdRQ0NBajBBRTFVQWdFQ0JBZ1FFT2pXQUFFQ0JBZ1FDQ0FnMEFNMFVRa0VDQkFnUUtBUEFRRUN4UmRZWGw1T1krTTMwM2pqYTJabU5pMHVMcVo2dlo3THhQdjcrOVBqKy9lbEV5ZE9wQU1IOXVjeXBrRUlFT2krUUcxcWFqeWZ2eFc2UDNkSEpCQmVZR1ZsSlYyK2NqVmR2LzY3dExLeTJ0RjZhN1ZhZXU0TG4wOVBQam5hMGVNWW5BQ0J6Z2g0aHQ0WlY2TVNhRnRnZXZxOWRQYmNHMmxoWWFIdHNab1pJSHZHLytiL1hrakR3d2RUWDUrL0dwb3hzdzJCSWdsNERiMUkzVEFYQW44UW1KcWFTcjk2NWRXdWhmbDkrT3pVL3AyN2QrLy82UDhFQ0pSSVFLQ1hxRm1tV2cyQkxNeGZlLzE4V2wzdDdDbjJ6VFRuWnVjM2U4ajlCQWdVV01CNXRRSTN4OVNxSjlCc21BOE1ES1Nob2FHMmdKYVhsdExkNmVsMVk5U1R0OVdzUTNFSGdSSUlDUFFTTk1rVXF5SFFiSmhuR3FPSFJ0S1pNNmZiZ3BtWW1FaXZ2bmF1clRIc1RJQkFjUVNjY2k5T0w4eWt3Z0k3Q2ZNS015bWRBSUV0QkFUNkZqZ2VJdEFOQVdIZURXWEhJQkJmUUtESDc3RUtDeXl3WFpnUFBEWlE0Tm1iR2dFQ1JSSVE2RVhxaHJsVVNtQzdNTi9mK08xdHp6Ly9iS1ZNRkV1QVFPc0NBcjExTzNzU2FGbWdtVEIvOFlVdnBlelhzcm9SSUVDZ0dRR0Izb3lTYlFqa0tDRE1jOFEwRkFFQ0R3UUUrZ01LM3hEb3ZJQXc3N3l4SXhDb3FvQkFyMnJuMWQxMUFXSGVkWElISkZBcEFZRmVxWFlydGxjQ3dyeFg4bzVMb0RvQ0FyMDZ2VlpwandTRWVZL2dIWlpBeFFUODZ0ZUtOVnk1M1JVb2M1aG5uOFgrZisrT3BmY2FIK002T3p1WEZ0OWZ6QVd2bG1wcHo1NDlhV1JrT0IwNWNqaVhNUTFDZ0VCS0F0MHFJTkFoZ2JLRytjTENZdnJOeGJmU2pSdnZwSldWem56aTIremNYTHJWK0YzeTR6ZHZwaGUrL01WVXE5VTYxQVhERXFpT2dFQ3ZUcTlWMmtXQnNvWjVSblQxNnJXdVNVMU9UcVhMbDYrbTQ4Yy8yN1ZqT2hDQnFBSmVRNC9hV1hYMVRLRE1ZZDRMdEhmSHhucHhXTWNrRUU1QW9JZHJxWUo2S1REZGVMMzV0ZGZQcDlYVmpVOVZaNy9PMVcrQWU3aEQyZXZ6YmdRSXRDL2dsSHY3aGtZZ3NDYVF2WW5zN0xrM05nM3o3SU5XL3Voelo5TFMwdkxhVnpOczh3c0x6V3pXbFcwR0JnYlNybDN0dmRhOXVQaitPcDk2dmQ2VitUc0lnZWdDQWoxNmg5WFhOWUhMVjY2bWhTMENlR0Z4SWYzaWw2OTBiVDU1SHlnN3N6QTR1S2V0WVY5OTdWeWFhTHdaem8wQWdmd0ZuSExQMzlTSUZSUllYbDVPMTYvL3JtdVY3KzdiM2ZheEppZHZ0ejNHemdmd2JIem5adllnMEp5QVFHL095VllFdGhRWUc3dlpzVXU4Tmpyd3ZuMTdON3E3NmZzdS9mWnl1dExGZDdOL09MSDJUdGwvT0k3dkNCRDR1SUJBLzdpSW53bTBJSkJkVDkydDI5RFFZQm85ZEtqbHcyVmhmdW5TNVUzMzcrdnpTdHltT0I0Z1VHQUJnVjdnNXBoYWVRUm1abWE3TXRrc3pKOS83dG5HbTlOYSs2TzdYWmdmT2ZKMCt0U25QdG1WV2h5RUFJRjhCZnhUUEY5UG8xVlVZSEZ4L2E5RnpkNFZQbnBvSkJlUjdEWHo3RFI3OXN5OGsySCt1VE9uMDRVTEYzT1pzMEVJRU9pdWdFRHZycmVqQlJYWTZOS3JvYUdoZEtZUmtFVzROZlBNUEF0ek53SUV5aXZRMm5tNzh0WnI1Z1FxSnlETUs5ZHlCVmRVUUtCWHRQSEtyb2FBTUs5R24xVkpJQk53eXQwNklOQkRnYk5uenpjK2NleFc3ak1ZSFIxcHZPYStiOHQzczJkdmdIT2FQWGQ2QXhMb21ZQkE3eG05QXhOSUhRbnp6SFY4L05iYTEyYkd3bnd6R2ZjVEtLK0FVKzdsN1oyWkUyaEpRSmkzeEdZbkFvVVhFT2lGYjVFSlJoWm85UkswVmsyRWVhdHk5aU5RZkFHbjNJdmZJek1NTEhENjFNbDBhMkl5bHdybjV1ZlQvTnptSDBVcXpITmhOZ2lCd2dvSTlNSzJ4c1NxSUhEMDZOTXArMnIzbHIyYmZhdFBNUlBtN1FyYm4wRHhCWnh5TDM2UHpKREFsZ0pYcmx6emJ2WXRoVHhJb0JvQ0FyMGFmVlpsVUlHSmlhbDA4YTIzTjYzT00vTk5hVHhBSUp5QVUrN2hXcXFnTWdtODh1dlgwOVRVVk1lbW5IMUdlemMvcDcxamhSaVlBSUZ0QlR4RDM1YklCZ1E2SjlESk1NOTcxdm04STcrZTk3U01SNERBSHdRRXVxVkFnTUMyQXRsbnBBOE1QTGJ0ZHR0dlVOdCtFMXNRSU5DU2dFQnZpYzFPQlBJUnlPZFpiejV6MldxVXc0Yy92ZFhETzNqTU0vUWRZTm1Vd0k0RXZJYStJeTRiRThoWDRNVHhZMm5xOXAwZEQ3cTB0SlNtcDZkM3ZGOHJPd3dmUEpoT25UemV5cTRiN09NWitnWW83aUtRaTRCQXo0WFJJQVJhRXpoMjdEUHBXQXU3M25qbjkrbk5OOWNIK3VQNzk2ZitSeDVwWWNUMXUreHBuR0wveENlZVNFODk5ZVQ2QjkxRGdFRGhCQVI2NFZwaVFnUzJGMWhkWGQxd281TW5qNlhoNGVFTkgzTW5BUUt4QmJ5R0hydS9xaU5BZ0FDQmlnaDRobDZSUml1em1BS2R2ZzY5bUZXYkZRRUNuUkFRNkoxUU5TYUJKZ1Y2Y1IzNjJiUG5PL0k1N0tPakkrbUx6ei9YWk9VMkkwQWdid0duM1BNV05SNkJnZ3VNMzd6VmtSbU9qM2RtM0k1TTFxQUVBZ29JOUlCTlZWSjVCTXB5SFhwNVJNMlVRSFVGbkhLdmJ1OVZYZ0NCVnE5RFgxaFlTTE96c3kxVmtQMGo0dDY5ZXkzdHU5Vk8vbkd5bFk3SENIUmVRS0IzM3RnUkNHd3EwT3AxNk5jYUg3cHk0Y0xGVGNmZDZvSFRwMDZtV3hPVFcyM1MwbU1qd3dkYjJzOU9CQWprSXlEUTgzRTBDb0hTQ0J3OStuVEt2dHdJRUlnbDREWDBXUDFVRFFFQ0JBaFVWRUNnVjdUeHlpWkFnQUNCV0FKT3VjZnFwMm9LSkhENzl1MzBzLy82ZVVkbXRMeTgwdks0cmtOdm1jNk9CQW90SU5BTDNSNlRLNHRBclZaTDlmckRIdzJhL2I3MXVibjV3cFhnT3ZUQ3RjU0VDT1FpSU5CellUUkkxUVdHaG9iU3pNeE0xUmtLVi8vTTBrUjZkK2F0dEhwdnFlbTVQYnA3TUgxeTN6UHBzYjU5VGU5alF3SkZFQkRvUmVpQ09aUmU0S2tuUjlQYkpRbjBLbHlIWHErdnBwZmYrbjc2ejJzL2JtbHQ5ZTE2SlAzMXlYOU1mM0gwNzFyYTMwNEVlaUVnMEh1aDdwamhCTExyeWFjYXI1bFBUazRWdnJZcVhJZitIMWYvdGVVd3p4cTQwbmhHLy9MRkg2WW5CZzZuTDR4K3MvQTlOVUVDbVlCQXR3NEk1Q0NRdlliKzRndGZTdGV2MzBpM2JrMmsrZm41VkcvODE2bGI5cWE0cGFYbVR5Ti9kQjVWdUE3OVYrLzgyMGRMYnZuN2JCeUIzaktmSGJzc0lOQzdETzV3c1FXT0hEbWNzcTlPMzlyNVRYR2RubHNSeHArWXY1N0xOQ1p6R2llWHlSaUV3RFlDcmtQZkJzakRCQWpFRjloZDYwdmZlZTVINlh0ZisyWGpOUHVuSHhSY3IrZi9PKzhmRE80YkFqa0xlSWFlTTZqaENCUmR3SFhvRDNmb2d6Qi9LZjN4b2I5YWUrQzdMLzU3K3VIUC96d3RyeTQrdktHZkNCUmN3RFAwZ2pmSTlBamtMZUE2OUE5RlB4N21IejdpT3dMbEV4RG81ZXVaR1JNZ3NBT0I3QlQ2UDN6bEorbXJoLy8yb2IwMkN2UGJDKytrZi9uMXR6MDdmMGpLRDJVUmNNcTlMSjB5VHdJNUNWVGhPdlQ3VklQOUI5SjNYM3g1N1hYeHp4NTRJZlh0Nms4L3UvNVMyanpNdjVXeVVIY2pVRVlCZ1Y3R3Jwa3pnVFlFcW5BZCtuMmV2WThlVFBzZkc3My9ZL3FiWi80cDFXcTcwL0VudnZMZ05mUHN3UStlbVF2ekIxQytLYVdBUUM5bDIweWFRT3NDVmJnTy9iN08rT3h2MDB2bnY5TjRCM3Yyckx4LzdlNXZuLzdCL1lmWC9pL01IK0x3UTRrRnZJWmU0dWFaT2dFQzJ3dThlZk9uYTZHK1dsOWV0N0V3WDBmaWpoSUxDUFFTTjgvVUNSQm9UbUNqVUJmbXpkblpxandDQXIwOHZUSlRBZ1RhRVBob3FBdnpOaUR0V2xnQnI2RVh0alVtUm1EbkFtKy9mVGxkdlhaajV6dDJhWS9wNmVrdUhXbmp3MlNoL3MvLy9mVTA4LzVrbWx1K3MvRkc3aVZRVWdHQlh0TEdtWGExQldxcHRpSEEzUjRINW9hVDZzR2RleDg1bUdhV0pqYzhjdlpHdVdadmV4OGRiblpUMnhIb3VZQlQ3ajF2Z1FrUTJMbkE0TkNlbmU5VTBEMkdCZ2R6bjltWmthL25NdVl6dy9tTWs4dGtERUpnR3dHQnZnMlFod2tVVWVEQTQ0K24vdjRQTHNNcTR2eDJNcWZoa1lNNzJieXBiYjkxK3Z2cHFiMm5tdHAyczQxT0hmeHErc3ZQL1AxbUQ3dWZRT0VFYWxOVDQ1MzcwT2JDbFd0Q0JPSUlqSTJOcC9Odi9FK3ExOHY3UjNob2FERDkyWi8rU2VycjI1MTdZMWJ2TGFWell6OUp2My92TjJtMTN2eG54eis2ZXpBZDN2OXNlbmIwRzQwNWJmelNSdTZUTlNDQkhBUUVlZzZJaGlEUUs0RTdkNmJUcFV1WDB0M3A5OUx5OHZycnJIczFyKzJPbTUxbXo1Nlpuenh4b2lOaHZ0M3hQVTRnb29CQWo5aFZOUkVnUUlCQTVRUzhobDY1bGl1WUFBRUNCQ0lLQ1BTSVhWVVRBUUlFQ0ZST1FLQlhydVVLSmtDQUFJR0lBZ0k5WWxmVlJJQUFBUUtWRXhEb2xXdTVnZ2tRSUVBZ29vQkFqOWhWTlJFZ1FJQkE1UVFFZXVWYXJtQUNCQWdRaUNnZzBDTjJWVTBFQ0JBZ1VEa0JnVjY1bGl1WUFBRUNCQ0lLL0Q4cHVVaitQN0tmR0FBQUFBQkpSVTVFcmtKZ2dnPT1cIixcbiAgICB9O1xuXG4gICAgdGhpcy5zZXRCYWNrZ3JvdW5kUGxhY2Vob2xkZXIoKTtcbiAgICB0aGlzLmV2ZW50SGFuZGxlcigpO1xuICB9XG5cbiAgc2V0QmFja2dyb3VuZFBsYWNlaG9sZGVyKCkge1xuICAgIHRoaXMuaW1hZ2VQcmV2aWV3Q29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICBcInVybCgnXCIgKyB0aGlzLmJhY2tncm91bmRJbWFnZS5iYXNlSW1hZ2UgKyBcIicpXCI7XG4gIH1cblxuICBldmVudEhhbmRsZXIoKSB7XG4gICAgdGhpcy5pbnB1dFR5cGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy51cGxvYWRGaWxlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXJhc2VJbWFnZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJjbGlja1wiLFxuICAgICAgdGhpcy5yZW1vdmVJbWFnZXNBbmRSZXNldEJhY2tncm91bmRQbGFjZWhvbGRlci5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHJlbW92ZUltYWdlc0FuZFJlc2V0QmFja2dyb3VuZFBsYWNlaG9sZGVyKCkge1xuICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5ID0gW107XG4gICAgdGhpcy5pbnB1dFR5cGVGaWxlLnZhbHVlID0gXCJcIjtcblxuICAgIHRoaXMuc2V0SW5wdXROYW1lRmlsZVZhbHVlKCk7XG4gICAgdGhpcy5zZXRJbnB1dEZpbGVMYWJlbFRleHQoKTtcbiAgICB0aGlzLnNldEJhY2tncm91bmRQcmV2aWV3Q29udGFpbmVyKCk7XG4gIH1cblxuICB1cGxvYWRGaWxlKGV2ZW50KSB7XG4gICAgbGV0IGlucHV0ZmllbGRFbGVtZW50ID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBsZXQgdXBsb2FkZWRGaWxlcyA9IGlucHV0ZmllbGRFbGVtZW50LmZpbGVzO1xuICAgIGxldCB0b3RhbFVwbG9hZGVkRmlsZXMgPSB1cGxvYWRlZEZpbGVzLmxlbmdodDtcblxuICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5ID0gW107XG5cbiAgICBuZXcgUHJvbWlzZShcbiAgICAgIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBPYmplY3Qua2V5cyh1cGxvYWRlZEZpbGVzKS5mb3JFYWNoKFxuICAgICAgICAgIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZWRGaWxlQXJyYXlba2V5XSA9IHVwbG9hZGVkRmlsZTtcblxuICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCh1cGxvYWRlZEZpbGUpO1xuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB0aGlzLmNhY2hlZEZpbGVBcnJheVtrZXldW1wiZGF0YVVybFwiXSA9IHJlYWRlci5yZXN1bHQ7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCAtIDEgPT09IHBhcnNlSW50KGtleSkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuY2FjaGVkRmlsZUFycmF5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKS50aGVuKFxuICAgICAgZnVuY3Rpb24oZmlsZXNBcnJheUFzRGF0YVVybCkge1xuICAgICAgICB0aGlzLnNldElucHV0TmFtZUZpbGVWYWx1ZSgpO1xuICAgICAgICB0aGlzLnNldElucHV0RmlsZUxhYmVsVGV4dCgpO1xuICAgICAgICB0aGlzLnNldEJhY2tncm91bmRQcmV2aWV3Q29udGFpbmVyKCk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgc2V0SW5wdXROYW1lRmlsZVZhbHVlKCkge1xuICAgIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgdmFsdWUgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuY2FjaGVkRmlsZUFycmF5KS5mb3JFYWNoKFxuICAgICAgICBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAvLyBsZXQgbmV3QXJyYXkgPSBbJ2ZpbGVuYW1lJywgZGF0YV1cbiAgICAgICAgICB2YWx1ZS5wdXNoKHtcbiAgICAgICAgICAgIGRhdGFVcmw6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0uZGF0YVVybCxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuY2FjaGVkRmlsZUFycmF5W2tleV0ubmFtZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgICAgdGhpcy5pbnB1dE5hbWVGaWxlLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlucHV0TmFtZUZpbGUudmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gIHNldElucHV0RmlsZUxhYmVsVGV4dCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLmlucHV0TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMuaW5wdXRMYWJlbC5pbm5lckhUTUwgPSB0aGlzLmNhY2hlZEZpbGVBcnJheVswXS5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuaW5wdXRMYWJlbC5pbm5lckhUTUwgPVxuICAgICAgICAgIHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCArIFwiIGZpbGVzIHNlbGVjdGVkXCI7XG4gICAgfVxuICB9XG5cbiAgc2V0QmFja2dyb3VuZFByZXZpZXdDb250YWluZXIoKSB7XG4gICAgbGV0IGJhY2tncm91bmRVcmw7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY2FjaGVkRmlsZUFycmF5Lmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBiYWNrZ3JvdW5kVXJsID0gdGhpcy5iYWNrZ3JvdW5kSW1hZ2UuYmFzZUltYWdlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLnR5cGUubWF0Y2goXCJpbWFnZS9cIikpIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kVXJsID0gdGhpcy5jYWNoZWRGaWxlQXJyYXlbMF1bXCJkYXRhVXJsXCJdO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGVkRmlsZUFycmF5WzBdLnR5cGUubWF0Y2goXCJhcHBsaWNhdGlvbi9wZGZcIikpIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kVXJsID0gdGhpcy5iYWNrZ3JvdW5kSW1hZ2Uuc3VjY2Vzc1BkZjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNhY2hlZEZpbGVBcnJheVswXS50eXBlLm1hdGNoKFwidmlkZW8vXCIpKSB7XG4gICAgICAgICAgYmFja2dyb3VuZFVybCA9IHRoaXMuYmFja2dyb3VuZEltYWdlLnN1Y2Nlc3NWaWRlbztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJhY2tncm91bmRVcmwgPSB0aGlzLmJhY2tncm91bmRJbWFnZS5zdWNjZXNzTXVsdGlwbGU7XG4gICAgfVxuXG4gICAgdGhpcy5pbWFnZVByZXZpZXdDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID1cbiAgICAgIFwidXJsKCdcIiArIGJhY2tncm91bmRVcmwgKyBcIicpXCI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsZVVwbG9hZFNob3dQcmV2aWV1dztcbiIsIihmdW5jdGlvbigpIHtcclxuICBtZXRob2RzLm1vZHVsZXMubW91bnRBbGwoXCJib2R5XCIpO1xyXG4gIG1ldGhvZHMubW9kdWxlcy5pbml0QWxsKFwiYm9keVwiKTtcclxufSkoKTtcclxuIl19
