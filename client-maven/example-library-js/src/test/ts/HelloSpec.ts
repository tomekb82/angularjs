/// <reference path="./lib/jasmine.d.ts"/>

import Hello = require("../../main/ts/demo/Hello");

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
});

