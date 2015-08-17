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
                markdownToHtmlConvertor: function (markdown) { return markdown; },
                customButtons: [],
                window: window
            };

        this.toolbar = [
            {
                name: "",
                buttons: [
                    { title: "Bold", className: "glyphicon glyphicon-bold", action: toolbarActions.bold },
                    { title: "Italic", className: "glyphicon glyphicon-italic", action: toolbarActions.italic },
                    { title: "Heading", className: "glyphicon glyphicon-header", action: toolbarActions.heading }
                ]
            },
            {
                name: "name",
                buttons: [
                    { title: "Link", className: "glyphicon glyphicon-link" },
                    { title: "Image", className: "glyphicon glyphicon-picture" }
                ]
            },
            {
                name: "",
                buttons: [
                    { title: "Unordered List", className: "glyphicon glyphicon-list", action: function(e) {} },
                    { title: "Ordered List", className: "glyphicon glyphicon-th-list", action: function(e) {} },
                    { title: "Blockquote", className: "glyphicon glyphicon-comment" },
                    { title: "Code", className: "glyphicon glyphicon-asterisk" }
                ]
            }        
        ];

        this._state = {};
        this.settings = {
            container: opts.container || defaultSettings.container,
            fullscreenButtonTitle: opts.fullscreenButtonTitle || defaultSettings.fullscreenButtonTitle,
            previewButtonTitle: opts.previewButtonTitle || defaultSettings.previewButtonTitle,
            markdownToHtmlConvertor: opts.markdownToHtmlConvertor || defaultSettings.markdownToHtmlConvertor,
            customButtons: opts.customButtons || defaultSettings.customButtons,
            window: opts.window || defaultSettings.window
        };

        this._elements = {};

        if (typeof this.settings.container == 'string') {
            this._elements.editor = window.document.getElementById(this.settings.container);
        }
        else if (typeof this.settings.container == 'object') {
            this._elements.editor = this.settings.container;
        }
    }

    // public
    MarkdownEditorShell.prototype.load = function (callback) {
        var self = this;

        // wrapper
        var wrapElement = window.document.createElement("div");
        wrapElement.setAttribute("class", "markdown-editor-wrapper");
        this._elements.wrapper = wrapElement;

        wrapElement.innerHTML =
            "<div class='markdown-editor-header btn-toolbar'>" +
                '<div class="btn-group markdown-editor-modes" data-toggle="buttons"><label class="btn btn-default active" data-me-mode="editor" title="Editor"><input type="radio" name="markdownEditorMode" value="Editor" checked><span class="glyphicon glyphicon-pencil"></span></label><label class="btn btn-default" data-me-mode="preview" title="Preview"><input type="radio" name="markdownEditorMode" value="Preview"><span class="glyphicon glyphicon-eye-open"></span></label><label class="btn btn-default" data-me-mode="split" title="Split mode"><input type="radio" name="markdownEditorMode" value="Split"><span class="glyphicon glyphicon-adjust"></span></label></div>' +

                "<div class='btn-group'><button type='button' class='btn btn-primary markdowneditor-fullscreen-btn' title='" + this.settings.fullscreenButtonTitle + "'><span class='glyphicon glyphicon-fullscreen'></span></button></div>"
            "</div>";

        var rowElement = window.document.createElement("div");
        rowElement.setAttribute("class", "markdown-editor-row");

        var previewElement = window.document.createElement("div");
        previewElement.setAttribute("class", "markdown-editor-preview");
        this._elements.preview = previewElement;

        var parent = this._elements.editor.parentNode;
        var sibling = this._elements.editor.nextSibling;
        rowElement.appendChild(this._elements.editor);
        rowElement.appendChild(previewElement);

        wrapElement.appendChild(rowElement);

        if (sibling) {
            parent.insertBefore(wrapElement, sibling);
        } else {
            parent.appendChild(wrapElement);
        }

        // register events
        var fullscreenButton = wrapElement.getElementsByClassName("markdowneditor-fullscreen-btn")[0];
        var toolbarElement = wrapElement.getElementsByClassName("markdown-editor-header")[0];
        var buttonGroups = this._renderButtons(this.toolbar);
        for (var i = 0; i < buttonGroups.length; i++) {
            toolbarElement.insertBefore(buttonGroups[i], toolbarElement.childNodes[toolbarElement.childNodes.length - 1]);
        }
                
        fullscreenButton.addEventListener('click', function (e) {
            self.enterFullscreen();
        });

        var modeElements = wrapElement.querySelectorAll(".markdown-editor-modes label.btn");
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

        this._elements.editor.addEventListener("input", onTextChange);

        _registerEvents(this);

        callback = callback || function () { };
        callback.call(this);
    }

    MarkdownEditorShell.prototype.changeMode = function (mode) {
        this._elements.wrapper.setAttribute("data-mode", mode);
        this._updatePreview();
    }

    MarkdownEditorShell.prototype.enterFullscreen = function () {
        if (this.isFullscreenMode()) {
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
        var document = this.settings.window.document;
        
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

    MarkdownEditorShell.prototype.isFullscreenMode = function() {
        var document = this.settings.window.document;
        
        return (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) ? true : false;
    }

    // private
    MarkdownEditorShell.prototype._updatePreview = function() {
        var markdownText = this._elements.editor.value;
        var htmlText = this.settings.markdownToHtmlConvertor(markdownText);

        this._elements.preview.innerHTML = htmlText;
    }
    
    MarkdownEditorShell.prototype._renderButtons = function(groups) {        
        var result = [];
        
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var groupElement = this._renderButtonsGroup(group);
            
            result.push(groupElement);
        }
        
        return result;
    }
    
    MarkdownEditorShell.prototype._renderButtonsGroup = function(group) {
        var document = this.settings.window.document;            
        var groupElement = document.createElement("div");
        var self = this;
        groupElement.setAttribute("class", "btn-group");
        
        for (var i = 0; i < group.buttons.length; i++) {
            var button = group.buttons[i],
                buttonElement = document.createElement("button");
                
            buttonElement.setAttribute("type", "button");
            buttonElement.setAttribute("class", "btn btn-default");
            buttonElement.setAttribute("title", button.title);
            
            var innerElement = document.createElement("span");
            innerElement.setAttribute("class", button.className);
            
            buttonElement.action = button.action;
            var act = function(action) { return function(e) { action(self); } };
            
            buttonElement.addEventListener("click", act(button.action));
            buttonElement.appendChild(innerElement);
            groupElement.appendChild(buttonElement);
        }
        
        return groupElement;
    }

    MarkdownEditorShell.prototype.getContent = function() {
        return this._elements.editor.value;
    }

    MarkdownEditorShell.prototype.getSelection = function() {
        var editor = this._elements.editor;
        var len = editor.selectionEnd - editor.selectionStart;
        
        return {
            start: editor.selectionStart,
            end: editor.selectionEnd,
            length: len,
            text: editor.value.substr(editor.selectionStart, len)
        };    
    }
    
    MarkdownEditorShell.prototype.setSelection = function(start, end) {
        var editor = this._elements.editor;
        
        editor.selectionStart = start;
        editor.selectionEnd = end;
    }
    
    MarkdownEditorShell.prototype.replaceSelection = function(text) {
        var editor = this._elements.editor;
        
        editor.value = editor.value.substr(0, editor.selectionStart) + text + editor.value.substr(editor.selectionEnd, editor.value.length);
        // Set cursor to the last replacement end
        editor.selectionStart = editor.value.length;
    }

    var toolbarActions = {
        bold: function (e) {
            // Give/remove ** surround the selection
            var chunk, cursor, selected = e.getSelection(), content = e.getContent();
    
            if (selected.length === 0) {
                // Give extra word
                chunk = "Strong text";
            } else {
                chunk = selected.text;
            }
    
            // transform selection and set the cursor into chunked text
            if (content.substr(selected.start - 2, 2) === '**'
                && content.substr(selected.end, 2) === '**') {
                e.setSelection(selected.start - 2, selected.end + 2);
                e.replaceSelection(chunk);
                cursor = selected.start - 2;
            } else {
                e.replaceSelection('**' + chunk + '**');
                cursor = selected.start + 2;
            }
    
            // Set the cursor
            e.setSelection(cursor, cursor + chunk.length); 
        },
        
        italic: function (e) {
            
        },
        
        heading: function (e) {
            
        }
    }
    

    function _registerEvents(self) {
    }

    window.MarkdownEditorShell = MarkdownEditorShell;
})(window);
