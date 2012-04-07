Tangible node endpoints | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible values are manpulated through the caterwaul invariant library. This allows you to define edges that transparently propagate updates from one node to another. Tangible provides several
built-in nodes and edges that you can use. All nodes defined here use a getter/setter called 'val()', just like jQuery. All getters return futures (!), not straight values. The reason is that
some getters are for resources such as files, which cross an IO barrier.

This module can be loaded on the client, but the file() node constructor will be inoperative.

    caterwaul.module('tangible.nodes', ':all', function ($) {
      tangible.nodes = wcapture [

# Nodes

The most basic node is a logical Tangible value. This corresponds to the authoritative state of a Tangible object.

        basic_node(g, s, n = result) = node(s.call(n, v) /~flat_map/ "repeat(v, visited, node)".qf -given [v, visited, node]) /where [repeat = node_repeat()]
                            /-$.merge/ capture [val() = arguments.length ? this.apply(this, arguments) : g.call(this)],

        attribute(name)              = basic_node("future()(tangible.state[name])".qf, "future()(tangible.state[name] = _)".qf),
        virtual(v = '')              = basic_node("future()(v)".qf,                    "future()(v = _)".qf),

        file(path)                   = basic_node("future() -se- fs.readFile (path,    'utf8', given[err, data] in it(data))".qf,
                                                  "future() -se- fs.writeFile(path, _, 'utf8', given.err        in it(_))".qf)],

      where [fs = require('fs') -when [typeof require === 'function']],

      using.caterwaul,
      using[caterwaul.invariant]});