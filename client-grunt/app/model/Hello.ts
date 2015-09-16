/// <reference path='../reference.ts' />

module test {
export class Hello {

    private _name:string;

    constructor(name:string) {
        this._name = name;
    }

    public get name() {
        return this._name;
    }

}
}
//export = Hello;
