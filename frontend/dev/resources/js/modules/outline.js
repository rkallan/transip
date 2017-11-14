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
