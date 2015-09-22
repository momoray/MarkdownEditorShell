(function () {
    'use strict';

    chai.should();


    describe('MarkdownEditorShell class', function () {
        function DomElement(name) {
            this.setAttribute = sinon.stub();
            this.appendChild = sinon.stub();
            this.insertBefore = sinon.stub();
            this.getElementsByClassName = sinon.stub();
            this.querySelectorAll = sinon.stub();
            this.childNodes = [];
            this.value = "";

            Object.defineProperty(this, "parentNode", {
                get: function() {
                    return new DomElement("any");
                }
            });
        }
        DomElement.prototype.addEventListener = sinon.stub();


        beforeEach(function() {
            var windowMock = sinon.spy();
            var documentMock = sinon.spy();
            windowMock.document = documentMock;
            windowMock.prompt = sinon.stub();
            windowMock.prompt.returns("http://some-site.com");
            windowMock.setTimeout = sinon.spy();

            var wrapper = new DomElement("div");
            documentMock.createElement = sinon.stub();
            documentMock.createElement.onFirstCall().returns(wrapper);
            documentMock.createElement.returns(new DomElement("name"));

            documentMock.getElementById = sinon.stub();
            documentMock.getElementById.withArgs("target").returns(new DomElement("div"));

            this.wrapper = wrapper;
            this.target = new MarkdownEditorShell({window: windowMock, container: 'target'});
            this.window = windowMock;
            this.document = documentMock;
        });

        it('should initialize new instance', function () {
            this.target.should.be.not.null;
        });

        describe("load function", function() {
            beforeEach(function() {
                this.wrapper.getElementsByClassName.withArgs('markdown-editor-header').returns([new DomElement("div")]);
                this.wrapper.getElementsByClassName.withArgs('markdowneditor-fullscreen-btn').returns([new DomElement("div")]);
                this.wrapper.querySelectorAll.withArgs('.markdown-editor-modes label.btn').returns(new DomElement("div"));
            });

            it ("should create wrapper element", function () {
                //action
                this.target.load();

                //assert
                this.target._elements.wrapper.should.be.not.null;
            });

            it ("should execute toolbar actions without erros", function() {
                //arrange
                DomElement.prototype.addEventListener = function (e, f) {
                    f();
                };

                //action
                this.target.load();
            });
        });

        // changeMode
        describe("changeMode function", function() {
            beforeEach(function() {
                this.target._elements.wrapper = { setAttribute: sinon.spy() };
            });

            ["editor", "preview", "split"]
            .forEach(function(mode) {
                it("should set proper attribute for " + mode, function() {
                    //arrange
                    this.target._updatePreview = sinon.spy();

                    //action
                    this.target.changeMode(mode);

                    //assert
                    this.target._elements.wrapper.setAttribute.calledWith("data-mode", mode).should.be.true;
                });
            });

            it ("should call updatePreview", function() {
                //arrange
                this.target._updatePreview = sinon.spy();

                //action
                this.target.changeMode("editor");

                //assert
                this.target._updatePreview.calledOnce.should.be.true;
            });
        });

        // enterFullscreen
        describe("enterFullscreen function", function() {
            beforeEach(function() {
                sinon.stub(this.target, "isFullscreenMode", function() { return false; });
                this.wrapper = this.target._elements.wrapper = {};
            });

            it ("if already in fullscreen mode should exit", function() {
                //arrange
                this.target.isFullscreenMode.restore();
                sinon.stub(this.target, "isFullscreenMode", function() { return true; });
                sinon.spy(this.target, "exitFullscreen");

                //action
                this.target.enterFullscreen();

                //assert
                this.target.exitFullscreen.calledOnce.should.be.true;
            });

            it ("if native function is present should call it", function () {
                //arrange
                this.wrapper.requestFullscreen = sinon.spy();

                //action
                this.target.enterFullscreen();

                //assert
                this.wrapper.requestFullscreen.calledOnce.should.be.true;
            });

            it ("if webkit function is present should call it", function () {
                //arrange
                this.wrapper.webkitRequestFullscreen = sinon.spy();

                //action
                this.target.enterFullscreen();

                //assert
                this.wrapper.webkitRequestFullscreen.calledOnce.should.be.true;
            });

            it ("if mozilla function is present should call it", function () {
                //arrange
                this.wrapper.mozRequestFullScreen = sinon.spy();

                //action
                this.target.enterFullscreen();

                //assert
                this.wrapper.mozRequestFullScreen.calledOnce.should.be.true;
            });

            it ("if ms function is present should call it", function () {
                //arrange
                this.wrapper.msRequestFullscreen = sinon.spy();

                //action
                this.target.enterFullscreen();

                //assert
                this.wrapper.msRequestFullscreen.calledOnce.should.be.true;
            });
        });

        // exitFullscreen
        describe("exitFullscreen function", function() {
            it("if native function is present should call it", function() {
                //arrange
                this.document.exitFullscreen = sinon.spy();

                //action
                this.target.exitFullscreen();

                //assert
                this.document.exitFullscreen.calledOnce.should.be.true;
            });

            it("if webkit function is present should call it", function() {
                //arrange
                this.document.webkitExitFullscreen = sinon.spy();

                //action
                this.target.exitFullscreen();

                //assert
                this.document.webkitExitFullscreen.calledOnce.should.be.true;
            });

            it("if mozilla function is present should call it", function() {
                //arrange
                this.document.mozCancelFullScreen = sinon.spy();

                //action
                this.target.exitFullscreen();

                //assert
                this.document.mozCancelFullScreen.calledOnce.should.be.true;
            });

            it("if ms function is present should call it", function() {
                //arrange
                this.document.msExitFullscreen = sinon.spy();

                //action
                this.target.exitFullscreen();

                //assert
                this.document.msExitFullscreen.calledOnce.should.be.true;
            });
        });

        // isFullscreenMode
        describe("isFullscreenMode function", function() {
            it ("if fullscreenElement present should return true", function() {
                //arrange
                this.document.fullscreenElement = {};

                //action
                var actual = this.target.isFullscreenMode();

                //assert
                actual.should.be.true;
            });

            it("if webkitFullscreenElement present should return true", function() {
                //arrange
                this.document.webkitFullscreenElement = {};

                //action
                var actual = this.target.isFullscreenMode();

                //assert
                actual.should.be.true;
            });

            it("if mozFullScreenElement present should return true", function() {
                //arrange
                this.document.mozFullScreenElement = {};

                //action
                var actual = this.target.isFullscreenMode();

                //assert
                actual.should.be.true;
            });

            it("if msFullscreenElement present should return true", function() {
                //arrange
                this.document.msFullscreenElement = {};

                //action
                var actual = this.target.isFullscreenMode();

                //assert
                actual.should.be.true;
            });

            it("if there are no elements present should return false", function() {
                //action
                var actual = this.target.isFullscreenMode();

                //assert
                actual.should.be.false;
            });
        });
    });
})();
