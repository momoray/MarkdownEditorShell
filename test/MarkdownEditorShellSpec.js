(function () {
    'use strict';

    chai.should();


    describe('main suite', function () {
        beforeEach(function() {
            var windowMock = sinon.spy();
            var documentMock = sinon.spy();
            windowMock.document = documentMock;
            
            this.target = new MarkdownEditorShell({window: windowMock});
            this.window = windowMock;
            this.document = documentMock;
        });

        it('should initialize new MarkdownEditorShell', function () {
            this.target.should.be.not.null;
        });
        
        describe("load", function() {
            
        });
        
        describe("changeMode", function() {
            
        });
        
        describe("enterFullscreen", function() {
            
        });
        
        describe("exitFullscreen", function() {
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
    });
})();
