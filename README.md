# Cardinal  
Keep track of every touch point with cardinal and [compass][compass] be a bad-ass Captain Jack with a Sparrow on the shoulder.

Cardinal is a Javascript es6 library with a great **Touch API** that gives the web and native apps for touch devices&mdash;mobile and desktop&mdash;an interesting interface for touch capabilities, to program functional apps with user experience kept in mind. Cardinal has no dependencies whatsoever, and it's a must-have as it brings similar, native OS touch interfaces to HTML5 apps built for the web and native systems. The library has a low-level toolkit, built from abstraction, and a high-level implementation of the low-levels built readily for use. The low-level toolkits could be used to extend and/or create more of the high-level implementations we provide, if you see beyond our implementations&mdash;_that's a bonus_.  

### The low-level  
The low-level toolkits can't be used to give UIs their functions but are like an arcadia of algorithms (logical, mathematical, maybe statistical too) exported by a class of rich APIs to create/write codes that gives functional UIs.  

**Modules**
   1. [Circular Path][circles]
   2. [Drawer][drawer]

### The high-level  
The high-levels are implementations of the low-level APIs that make user interfaces functional, offering great user experience. Although some don't implement any low-level API and are independent. Those that implement are dependent, and for production, the dependencies of the dependents **must be available (on JS runtimes) imported or loaded (on the web).** For example, to use the [Nav][nav] module the [Drawer][drawer] module must be imported or loaded as dependency.  

**Modules**  
Every module that's not low-level, except otherwise stated.  

## Compass  
Cardinal&mdash;being a javascript program&mdash;is not enough to create rich GUIs. That's where [compass / compacss / compascss][compass] comes in.  
Compass or compacss or compascss is a kick-start SCSS mixin library which could be used as a backbone, extensible template to building cardinal compliant UI. It also comes in a ready/precompiled form, that is, already built to CSS. [Learn more](https://github.com/compacss/compass#readme)

## Design Guide and Standards  
Cardinal is a standard, highly predictable javascript library. It is built to be [Google's Material Design][material] compliant; as it follows the standard definitions of UI, UI behaviours, User actions/Interface reactions, defined under the material design. This standard definitions helps the program to behave predictably, giving expected reactions to similar actions every where possible. Not having a standard to follow can make things really messy; as similar actions might trigger different reactions which would be unexpected. The guide and standards help cardinal to serve a great user experience as interface reactions are as what the user will normally experience.

# License
We should spread the good; don't you think?  
There's nothing as good as open source; except Cardinal which is as good as open source. I'm simply saying...  
Cardinal is open source, and is provided under the [Apache LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0) with all rights reserved. Copyright `new Date().getFullYear()` Caleb Adepitan.

[circles]: https://github.com/cardinaljs/cardinal/blob/master/src/circular-path
[compass]: https://github.com/compacss/compass
[drawer]: https://github.com/cardinaljs/cardinal/blob/master/src/drawer
[material]: https://material.io/
[nav]: https://github.com/cardinaljs/cardinal/blob/master/src/nav
