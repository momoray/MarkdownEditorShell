# Markdown Editor Shell
[![Build Status](https://travis-ci.org/T-Alex/MarkdownEditorShell.svg?branch=master)](https://travis-ci.org/T-Alex/MarkdownEditorShell)
[![Coverage Status](https://coveralls.io/repos/T-Alex/MarkdownEditorShell/badge.svg?branch=master&service=github)](https://coveralls.io/github/T-Alex/MarkdownEditorShell?branch=master)
[![npm version](https://img.shields.io/npm/v/markdown-editor-shell.svg)](https://www.npmjs.com/package/markdown-editor-shell)

Client-side markdown editor shell which compatible with any renderer engine.

## Example of usage
```javascript
var editor = new MarkdownEditorShell({
    container: 'content',
    markdownToHtmlConvertor: markdownToHtmlConvertor
});
editor.load();
```

[Demo](http://htmlpreview.github.io/?https://github.com/T-Alex/MarkdownEditorShell/blob/master/demo/index.html)

## Options
### container
_string_ or _object_, an Id of ```textarea``` element or element itself for wrapping in ```MarkdownEditorShell```.

### fullscreenButtonTitle
_string_, the title of fullscreen button which will be shown by mouse over. Defaults to ```Enter Fullscreen```.

### previewButtonTitle
_string_, the title of preview button which will be shown by mouse over. Defaults to ```Toggle Preview Mode```.

### markdownToHtmlConvertor
_function_ that represents converter from markdown text (input parameter) to html (output value).

### additionalButtons
_array_ of groups of ```buttons``` to display in toolbar.

Each group should represent the following object:
```javascript
{
    name: "", // name of group
    buttons: [ // array of group buttons
        {
            title: "Bold", // title of button
            className: "glyphicon glyphicon-bold", // class of button
            action: buttonAction(e) // a function that represents the action of button, where e is instance of plugin
        }
    ]
}
```

## License
Markdown Editor Shell is under the [MIT license](LICENSE.md).
