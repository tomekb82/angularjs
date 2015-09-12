/// <reference path='../../reference.ts' />

module test {
import Hello = test.Hello;
import TestController = Controllers.TestController;
/**
 * Tests {@link Hello}
 */
describe("Hello", function():void {

    /**
     * Tests {@link Hello#sayHello}
     */
    it("sayHello", function():void {

        var hello:Hello = new Hello("olek");
        expect(hello.name).toBe("olek");
        
    })



    it("TestController", function():void {

        var testController:TestController = new TestController();
        expect(testController.vm.message).toBe("foo");
        
    })


});


}

