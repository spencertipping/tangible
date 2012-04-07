Tangible image library | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This module contains functions that read and write Tangible images. An 'image' in this context is a runnable Tangible file consisting of three parts:

    1. Prelude. This is a Bash segment that handles argument parsing and --help invocation.
    2. node.js kernel invocation. This includes a heredoc containing the Tangible kernel code.
    3. Data. This is never executed by bash; it begins with 'exit 0\n' and consists of object-specific data.

The prelude is stored in the data; this allows you to customize what happens with it.

    caterwaul.module('tangible.image', ':all', function ($) {
      tangible /-$.merge/ capture [
        image(o) = o.constructor === String ? tangible.image.parse(o) : tangible.image.serialize(o),

# Image parser

The image data follows a lone 'exit 0' command and contains a series of attributes. Each attribute is an unindented line consisting of a filter name and an attribute name. The attribute data
follows, indented by two spaces. The data segment must begin with the magic '# Tangible data'.

        parse(s) = attributes *[[x.replace(/^text /, ''), xs[++xi] /!unindent]] /object -seq -where [data_segment = s.split(/^exit 0$\n^# Tangible data$\n/m)[1],
                                                                                                     attributes   = data_segment.split(/^(\S.*)/m),
                                                                                                     unindent(s)  = s.replace(/^  /mg, '')],

# Image serializer

This is a little more complex than the parser, as pieces of the serialized image are generated from the data.

        serialize(state) = '#{prelude}\n#{node_invocation}\n#{data_header}\n#{data}' -where [prelude         = state['/kernel/prelude'],
                                                                                             node_invocation = 'node <<\'eof\'\n#{caterwaul.replicator()}\neof',
                                                                                             data_header     = 'exit 0\n# Tangible data',

                                                                                             indent(s)       = s.replace(/^/mg, '  '),
                                                                                             serialize(name) = 'text #{name}\n#{indent(state[name])}\n',
                                                                                             data            = state /keys *serialize -seq -re- it.join('')]],

      using.caterwaul});