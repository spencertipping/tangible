Tangible image library | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This module contains functions that read and write Tangible images. An 'image' in this context is a runnable Tangible file consisting of three parts:

    1. Prelude. This is a Perl segment that handles argument parsing and --help invocation.
    2. node.js kernel invocation. This includes a heredoc containing the Tangible kernel code.
    3. Data. This is never executed by Perl; it begins with '__END__\n' and consists of object-specific data.

The prelude is stored in the data; this allows you to customize what happens with it.

    caterwaul.module('tangible.image', ':all', function ($) {

# Image parser

The image data follows a lone 'exit 0' command and contains a series of attributes. Each attribute is an unindented line consisting of an attribute name and a filter name. The attribute data
follows, indented by some amount. The data format itself is determined by the filter used to serialize the data.

      (tangible.image = {}) /-$.merge/ capture [
        parse(s) = attributes *[[x, decode(xs[++xi])]] /object -seq -where [data_segment = s.split(/\n__END__$/m)[1],
                                                                            attributes   = data_segment.split(/\n(\S+)\n/m).slice(1),
                                                                            decode(s)    = s.replace(/^  /mg, '')],

# Image serializer

This is a little more complex than the parser, as pieces of the serialized image are generated from the data.

        serialize(state) = '#{prelude}\n#{node_invocation}\n#{postlude}\n#{data_header}\n#{data}'
                           -where [prelude         = state['/kernel/prelude'],
                                   postlude        = state['/kernel/postlude'],
                                   node_invocation = 'open my $fh, "| node";\n$fh->print(<<\'eof\');\n#{caterwaul.replicator()}\neof\nclose $fh;',
                                   data_header     = '__END__',

                                   serialize(name) = '#{name}\n#{state[name].replace(/^mg/, "  ")}',
                                   data            = state /keys *serialize -seq -re- it.join('\n')]],
      using.caterwaul});