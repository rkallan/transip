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