Tangible node endpoints | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible values are manpulated through the caterwaul invariant library. This allows you to define edges that transparently propagate updates from one node to another. Tangible provides several
built-in nodes and edges that you can use. All nodes defined here use a getter/setter called 'val()', just like jQuery. Nodes will return either a straight value or a future of a value. No
canonical node value will ever be a future, so you can just check the type of the result. (Though ideally you know up front which type the node will return.)

This module contains nodes that make sense both for Tangible clients and Tangible servers.

    caterwaul.module('tangible.nodes', ':all', function ($) {
      tangible.nodes = wcapture [basic_node(g, s, n = result)  = node(s.call(n, v) -then- repeat(node, v, visited) -given [node, v, visited]) /where [repeat = node_repeat()]
                                                      /-$.merge/ capture [val() = arguments.length ? this.apply(this, arguments) : g.call(this)],

# Read/write nodes

These have a logical state that can be modified by using the val() setter. In most cases, e.g. files, state changes correspond to external side-effects.

                                 virtual(v = '')               = "future()(v)".qf     /-basic_node/ "future()(v = _)".qf,
                                 file(path)                    = "read_file(path)".qf /-basic_node/ "write_file(path, _)".qf,

# Read-only nodes

These have no-op writers, and these nodes propagate their state when read. This is useful for situations where a node is connected as an observer to an external data source. For example,
consider the case where you're watching the value of something over HTTP. You want to propagate the changes through the node network each time you observe a new value.

                                 read_only_node(g, n = result) = propagating_getter /-basic_node/ "future()(null)".qf -where [propagating_getter() = g.call(this) /~push/ "n.val(_)".qf],

                                 tangible_image(path, name)    = read_file(path) /~map/ "tangible.parse_image(_)[name]".qf /given.nothing /!read_only_node,
                                 http(url)                     = read_http(host, port, path)                               /given.nothing /!read_only_node
                                                                 -where [pieces = /(?:http:)?(?:\/\/)?([^\/:]+)(:\d+)?(\/.*)/.exec(url),
                                                                         host   = pieces[1],
                                                                         port   = pieces[2] ? +pieces[2].substr(1) : 80,
                                                                         path   = pieces[3]]],

# Drivers

These will work iff we're running under node.js. They won't work for web-based clients, which will need a different set of nodes.

      where [fs                          = require('fs')   -when [typeof require === 'function'],
             http                        = require('http') -when [typeof require === 'function'],

             read_file(name)             = future() -se- fs.readFile(name, 'utf8', given[err, data] in it(data)),
             write_file(name, contents)  = future() -se- fs.writeFile(name, contents, 'utf8', given.err in it(contents)),

             read_http(host, port, path) = future() -se- http.get({host: host, port: port, path: path}, "it(_)".qf)
                               |~flat_map| response.on('data', "chunks /~push/ _".qf) -then- response.on('end', "result(chunks /~join/ '')".qf) -then- result
                                           -where [chunks = [], result = future()]
                                           -given.response],
      using.caterwaul,
      using[caterwaul.invariant]});