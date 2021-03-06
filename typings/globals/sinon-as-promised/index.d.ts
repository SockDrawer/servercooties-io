// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/0f5d541ed332eb6165e1d6488a900c1bac0c3da8/sinon-as-promised/sinon-as-promised.d.ts
declare namespace Sinon {

  export interface SinonStub {

    /**
     * When called, the stub will return a "thenable" object which will return a promise for the provided value. Any Promises/A+ compliant library will handle this object properly.
     */
    resolves(value:any):SinonStub;

    /**
     * When called, the stub will return a thenable which will return a reject promise with the provided err. If err is a string, it will be set as the message on an Error object.
     */
    rejects(err:any):SinonStub;
  } 

}
