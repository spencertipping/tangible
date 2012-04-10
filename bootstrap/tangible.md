Tangible object kernel | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible is a self-modifying structure consisting of node.js and Bash. Unlike self-modifying Perl, Tangible is designed to be nonblocking and support multiple simultaneous clients. It also
does a better job of separating the essential 'kernel' logic from object-specific logic, reducing the likelihood that modifications will render the object unusable.

This kernel is run by the server object, not clients. It contains the logic required to read and write the main image, something that is not generally done by clients of a Tangible object.

Upon booting, the kernel compiles and runs /boot/init, which should contain a caterwaul function that refers to a global called 'tangible'.

    caterwaul.module('tangible', ':all', function ($) {
      tangible.init() = require('fs').unlink(process.env.tangible_rm) -when- process.env.tangible_rm
                 -then- state(require('fs').readFileSync(process.env.tangible, 'utf8') /!parse_image)
                 -then- compiler(tangible('/boot/init').val(), {tangible: tangible}).apply(tangible, process.env.tangible_args.split(/\n/)),

      using.caterwaul,
      using[caterwaul.tangible]});