/*
 * MarkdownEditor
 * Copyright (c) 2015 Alex Titarenko (MIT License)
 */

(function (window) {
    // constructor
    function MarkdownEditorShell(options) {
        var opts = options || {},
            defaultSettings = {
                container: 'MarkdownEditor',
                fullscreenButtonTitle: "Enter Fullscreen",
                previewButtonTitle: "Toggle Preview Mode",
                markdownToHtmlConvertor: function (markdown) { return markdown; }
            };

        this._state = {};
        this.settings = {
            container: opts.container || defaultSettings.container,
            fullscreenButtonTitle: opts.fullscreenButtonTitle || defaultSettings.fullscreenButtonTitle,
            previewButtonTitle: opts.previewButtonTitle || defaultSettings.previewButtonTitle,
            markdownToHtmlConvertor: opts.markdownToHtmlConvertor || defaultSettings.markdownToHtmlConvertor
        };

        this._elements = {};

        if (typeof this.settings.container == 'string') {
            this._elements.editor = document.getElementById(this.settings.container);
        }
        else if (typeof this.settings.container == 'object') {
            this._elements.editor = this.settings.container;
        }
    }

    // public
    MarkdownEditorShell.prototype.load = function (callback) {
        var self = this;

        // wrapper
        var wrapElement = document.createElement("div");
        wrapElement.setAttribute("class", "markdown-editor-wrapper");
        this._elements.wrapper = wrapElement;

        wrapElement.innerHTML =
            "<div class='markdown-editor-header btn-toolbar'>" +
                '<div class="btn-group markdown-editor-modes" data-toggle="buttons"><label class="btn btn-default active" data-me-mode="editor" title="Editor"><input type="radio" name="markdownEditorMode" value="Editor" checked><span class="glyphicon glyphicon-pencil"></span></label><label class="btn btn-default" data-me-mode="preview" title="Preview"><input type="radio" name="markdownEditorMode" value="Preview"><span class="glyphicon glyphicon-eye-open"></span></label><label class="btn btn-default" data-me-mode="split" title="Split mode"><input type="radio" name="markdownEditorMode" value="Split"><span class="glyphicon glyphicon-adjust"></span></label></div>' +

                "<div class='btn-group'><button type='button' class='btn btn-primary markdowneditor-fullscreen-btn' title='" + this.settings.fullscreenButtonTitle + "'><span class='glyphicon glyphicon-fullscreen'></span></button></div>"
            "</div>";

        var rowElement = document.createElement("div");
        rowElement.setAttribute("class", "markdown-editor-row");
        var tableElement = document.createElement("div");
        tableElement.setAttribute("class", "markdown-editor-table");
        tableElement.appendChild(rowElement);

        var previewElement = document.createElement("div");
        previewElement.setAttribute("class", "markdown-editor-preview");
        previewElement.innerHTML = "<div class='markdown-editor-preview-content'><div class='markdown-editor-preview-content-inner'></div></div>";
        this._elements.preview = previewElement.firstChild.firstChild;

        var parent = this._elements.editor.parentNode;
        var sibling = this._elements.editor.nextSibling;
        rowElement.appendChild(this._elements.editor);
        rowElement.appendChild(previewElement);

        wrapElement.appendChild(tableElement);

        if (sibling) {
            parent.insertBefore(wrapElement, sibling);
        } else {
            parent.appendChild(wrapElement);
        }

        // register events
        wrapElement.getElementsByClassName("markdowneditor-fullscreen-btn")[0].addEventListener('click', function (e) {
            self.enterFullscreen();
        });

        modeElements = wrapElement.querySelectorAll(".markdown-editor-modes label.btn");
        for (var i = 0; i < modeElements.length; i++) {
            modeElements[i].addEventListener('click', function (e) {
                self.changeMode(e.currentTarget.getAttribute("data-me-mode"));
            });
        }

        var keypressTimer;
        function onTextChange() {
            if (keypressTimer) {
                window.clearTimeout(keypressTimer);
            }
            keypressTimer = window.setTimeout(function () {
                self._updatePreview();
            }, 250);
        }

        this._elements.editor.addEventListener("keyup", onTextChange);
        this._elements.editor.addEventListener("change", onTextChange);

        _registerEvents(this);

        callback = callback || function () { };
        callback.call(this);
    }

    MarkdownEditorShell.prototype.changeMode = function (mode) {
        this._elements.wrapper.setAttribute("data-mode", mode);
        this._updatePreview();
    }

    MarkdownEditorShell.prototype.enterFullscreen = function () {
        if (isFullscreenMode()) {
            this.exitFullscreen();
        } else {
            var element = this._elements.wrapper;

            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
            else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
            else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
            else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }

    MarkdownEditorShell.prototype.exitFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // private
    MarkdownEditorShell.prototype._updatePreview = function() {
        var markdownText = this._elements.editor.value;
        var htmlText = this.settings.markdownToHtmlConvertor(markdownText);

        this._elements.preview.innerHTML = htmlText;
    }

    function _registerEvents(self) {

    }

    function isFullscreenMode() {
        return (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) ? true : false;
    }

    window.MarkdownEditorShell = MarkdownEditorShell;
})(window);
