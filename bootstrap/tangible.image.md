Tangible image library | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This module contains functions that read and write Tangible images. An 'image' in this context is a runnable Tangible file consisting of three parts:

    1. Prelude. This is a Bash segment that handles argument parsing and --help invocation.
    2. node.js kernel invocation. This includes a heredoc containing the Tangible kernel code.
    3. Data. This is never executed by bash; it begins with 'exit 0\n' and consists of object-specific data.

The prelude is stored in the data; this allows you to customize what happens with it.

    caterwaul.module('tangible.image', ':all', function ($) {
      tangible /-$.merge/ wcapture [
        image(o) = o.constructor === String ? tangible.image.parse(o) : tangible.image.serialize(o),

# Filters

A filter is a function that serializes or deserializes an attribute value. Each filter is tried in succession until one returns a truthy serialization result. You need to replace the kernel in
order to add new filters. (This differs significantly from self-modifying Perl.)

        filters = {text: capture [encode(s) = s.replace(/^/mg, '  ')            -when [s.constructor === String],                            decode(s) = s.replace(/^  /mg, '')],
                   json: capture [encode(o) = '  ' + JSON.stringify(o)          -when [o.constructor === Array || o.constructor === Object], decode(s) = JSON.parse(s)],
                   fn:   capture [encode(f) = filters.text.encode(f.toString()) -when [o.constructor === Function],                          decode(s) = $(':all')(s)]},

        filter(name) = filters[name] || raise [new Error('undefined filter "#{name}"')]],

      tangible.image /-$.merge/ capture [

# Image parser

The image data follows a lone 'exit 0' command and contains a series of attributes. Each attribute is an unindented line consisting of an attribute name and a filter name. The attribute data
follows, indented by some amount. The data format itself is determined by the filter used to serialize the data.

        parse(s) = attributes *[[x, tangible.filter(xs[++xi]).decode(xs[++xi])]] /object -seq -where [data_segment = s.split(/^exit 0$\n^# Tangible data$\n/m)[1],
                                                                                                      attributes   = data_segment.split(/^(\S+) (\S+)$/m).slice(1)],

# Image serializer

This is a little more complex than the parser, as pieces of the serialized image are generated from the data.

        serialize(state) = '#{prelude}\n#{node_invocation}\n#{postlude}\n#{data_header}\n#{data}'
                           -where [prelude         = state['/kernel/prelude'],
                                   postlude        = state['/kernel/postlude'],
                                   node_invocation = 'node <<\'eof\'\n#{caterwaul.replicator()}\neof',
                                   data_header     = 'exit 0\n# Tangible data',

                                   encoders        = tangible.filters %v*[x.encode] /pairs -seq,
                                   serialize(name) = encoders |[x[1](state[name]) -re- '#{name} #{x[0]}\n#{it}' /when.it] |seq,
                                   data            = state /keys *serialize -seq -re- it.join('')]],

      using.caterwaul});