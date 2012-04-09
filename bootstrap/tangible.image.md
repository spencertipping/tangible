Tangible image library | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This module contains functions that read and write Tangible images. An image is a self-modifying Perl file containing a $self section that contains Tangible-specific data. The Perl file acts
as an administrative shell for the Tangible instance. It works by exec()ing the Tangible kernel, which then boots a server or starts a client REPL.

    caterwaul.module('tangible.image', ':all', function ($) {
      tangible.parse_image(s)         = attributes *[[x, decode(xs[++xi])]] + [['/kernel/boot', pieces[0]]] -object -seq -where [pieces       = s.split(/\n__DATA__$/m),
                                                                                                                                 attributes   = pieces[1].split(/\n(\S+)\n/m).slice(1),
                                                                                                                                 decode(s)    = s.replace(/^  /mg, '')],

      tangible.serialize_image(state) = '#{state["/kernel/boot"]}\n__DATA__\n#{data}' -where [serialize(name) = '#{name}\n#{state[name].replace(/^mg/, "  ")}',
                                                                                              data            = state /keys *serialize -seq -re- it.join('\n')],
      using.caterwaul});