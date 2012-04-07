Tangible object kernel | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible is a self-modifying structure consisting of node.js and Bash. Unlike self-modifying Perl, Tangible is designed to be nonblocking and support multiple simultaneous clients. It also
does a better job of separating the essential 'kernel' logic from object-specific logic, reducing the likelihood that modifications will render the object unusable.

This kernel is run by the server object, not clients. It contains the logic required to read and write the main image, something that is not generally done by clients of a Tangible object.

    caterwaul.module('tangible', ':all', function ($) {
      tangible.state = tangible.image(require('fs').readFileSync(process.env.tangible, 'utf8')),
      tangible.nodes /-$.merge/ capture [attribute(name) = tangible.nodes.basic_node("future()(tangible.state[name])".qf, "future()(tangible.state[name] = _)".qf)],

      tangible.invoke(name, args) = f.call(tangible, args) -where [f = tangible.state['/fn/#{name}'] || raise [new Error('undefined function: #{name}')]],
      tangible.invoke(process.env.tangible_args.replace(/\s.*/, '') /or['repl'], process.env.tangible_args),

      using.caterwaul});