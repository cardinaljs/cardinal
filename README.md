# Cardinal  
Keep track of every touch point with cardinal and [compass](https://github.com/compacss/compass) be a bad-ass Captain Jack with a Sparrow on the shoulder.

Cardinal is a Javascript es6 library with a great **Touch API** that gives the web and native apps for touch devices&mdash;mobile and desktop&mdash;an interesting interface for touch capabilities, to program functional apps with user experience kept in mind. Cardinal has no dependencies whatsoever, and it's a must-have as it brings similar, native OS touch interfaces to HTML5 apps built for the web and native systems. The library has a low-level toolkit, built from abstraction, and a high-level implementation of the low-levels built readily for use. The low-level toolkits could be used to extend and/or create more of the high-level implementations we provide, if you see beyond our implementations&mdash;_that's a bonus_.  

### The low-level  
The low-level toolkits can't be used to give UIs their functions but are like an _al-qaedea_ of algorithms (logical, mathematical, maybe statistical too) exported by a class of rich APIs to create/write codes that gives functional UIs.  
**Modules**
   1. [Circular Path](circles)
   2. [Drawer](drawer)

### The high-level  
The high-levels are implementations of the low-level APIs that make user interfaces functional, offering great user experience. Although some don't implement any low-level API and are independent. Those that implement are dependent, and for production, the dependencies of the dependents **must be available (on JS runtimes) imported or loaded (on the web).** For example, to use the [Nav](nav) module the [Drawer](drawer) module must be imported or loaded as dependency.
**Modules**  
Every module that's not low-level, except otherwise stated.  

[circles]: https://github.com/cardinaljs/cardinal/blob/master/src/circular-path
[drawer]: https://github.com/cardinaljs/cardinal/blob/master/src/drawer
[nav]: https://github.com/cardinaljs/cardinal/blob/master/src/nav 
