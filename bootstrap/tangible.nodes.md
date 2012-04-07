Tangible node endpoints | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible values are manpulated through the caterwaul invariant library. This allows you to define edges that transparently propagate updates from one node to another. Tangible provides several
built-in nodes and edges that you can use. All nodes defined here use a getter/setter called 'val()', just like jQuery. All getters return futures (!), not straight values. The reason is that
some getters are for resources such as files, which cross an IO barrier.

This module contains nodes that make sense both for Tangible clients and Tangible servers.

    caterwaul.module('tangible.nodes', ':all', function ($) {
      tangible.nodes = wcapture [
        basic_node(g, s, n = result) = node(s.call(n, v) /~flat_map/ "repeat(v, visited, node)".qf -given [node, v, visited]) /where [repeat = node_repeat()]
                            /-$.merge/ capture [val() = arguments.length ? this.apply(this, arguments) : g.call(this)],

        virtual(v = '') = basic_node("future()(v)".qf,     "future()(v = _)".qf),
        file(path)      = basic_node("read_file(path)".qf, "write_file(path, _)".qf)],

      where [fs                         = require('fs') -when [typeof require === 'function'],
             read_file(name)            = future() -se- fs.readFile(name, 'utf8', given[err, data] in it(data)),
             write_file(name, contents) = future() -se- fs.writeFile(name, contents, 'utf8', given.err in it(contents))],

      using.caterwaul,
      using[caterwaul.invariant]});