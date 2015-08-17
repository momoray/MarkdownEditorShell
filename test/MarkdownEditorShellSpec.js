(function () {
    'use strict';

    chai.should();


    describe('MarkdownEditorShell class', function () {
        beforeEach(function() {
            var windowMock = sinon.spy();
            var documentMock = sinon.spy();
            windowMock.document = documentMock;
            
            this.target = new MarkdownEditorShell({window: windowMock});
            this.window = windowMock;
            this.document = documentMock;
        });

        it('should initialize new instance', function () {
            this.target.should.be.not.null;
        });
        
        describe("load function", function() {
            
        });
        
        describe("changeMode function", function() {
            var tests = ["editor", "preview", "split"];
            
            tests.forEach(function(mode) {
                it("should set proper attribute for " + mode, function() {
                    //arrange
                    this.target._elements.wrapper = { setAttribute: sinon.spy() };
                    this.target._updatePreview = sinon.spy();
                    
                    //action
                    this.target.changeMode(mode);
                    
                    //assert
                    this.target._elements.wrapper.setAttribute.calledWith("data-mode", mode).should.be.true;    
                });    
            });    
        });
        
        // enterFullscreen
        describe("enterFullscreen function", function() {
            beforeEach(function() {
                sinon.stub(this.target, "isFullscreenMode", function() { return false; });
                this.wrapper = this.target._elements.wrapper = new Object();
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
                this.document.fullscreenElement = new Object();
                
                //action
                var actual = this.target.isFullscreenMode();
                
                //assert
                actual.should.be.true;    
            });
            
            it("if webkitFullscreenElement present should return true", function() {
                //arrange
                this.document.webkitFullscreenElement = new Object();
                
                //action
                var actual = this.target.isFullscreenMode();
                
                //assert
                actual.should.be.true;    
            });
            
            it("if mozFullScreenElement present should return true", function() {
                //arrange
                this.document.mozFullScreenElement = new Object();
                
                //action
                var actual = this.target.isFullscreenMode();
                
                //assert
                actual.should.be.true;    
            }); 
            
            it("if msFullscreenElement present should return true", function() {
                //arrange
                this.document.msFullscreenElement = new Object();
                
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
