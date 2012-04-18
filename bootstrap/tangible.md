Tangible object kernel | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible is a self-modifying structure consisting of node.js and Bash. Unlike self-modifying Perl, Tangible is designed to be nonblocking and support multiple simultaneous clients. It also
does a better job of separating the essential 'kernel' logic from object-specific logic, reducing the likelihood that modifications will render the object unusable.

This kernel is run by the server object, not clients. It contains the logic required to read and write the main image, something that is not generally done by clients of a Tangible object.

Upon booting, the kernel compiles /boot/init, which can refer to 'tangible' and 'caterwaul' (also '$', which is aliased to caterwaul).

    caterwaul.module('tangible', ':all', function ($) {
      tangible.log(exception) = process.stderr.write('\033[1;31merror\033[0;0m: #{exception}'),
      process.on('uncaughtException', tangible.log),

      tangible.init() = require('fs').unlink(process.env.tangible_rm) -when- process.env.tangible_rm
                 -then- tangible.self /eq [tangible.nodes /~file/ process.env.tangible]
                 -then- tangible.self_name / eq [process.env.tangible]
                 -then- tangible.self_argv / eq [process.env.tangible_args.split(/\n/)]

                 -then- state(require('fs').readFileSync(tangible.self_name, 'utf8') /!parse_image)
                 -then- tangible('/boot/init').val() /!compile,

      using.caterwaul,
      using[caterwaul.tangible]});