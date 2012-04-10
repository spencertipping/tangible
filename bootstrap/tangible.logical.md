Tangible logical attribute promotion | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible maintains an in-memory filesystem where each attribute is stored as text. This module provides logical bindings for those attributes. For example, attributes stored in /fn should be
compiled as functions. In order to do this, attributes are accessed through an abstraction that invokes hooks automatically. Like self-modifying Perl, the text versions are still
authoritative; artifacts of those attributes are not stored or otherwise readable through the filesystem API.

    caterwaul.module('tangible.logical', ':all', function ($) {

# Namespaces

Namespaces are stored in /conf/namespaces. This file contains a map of root-directory to handler, where the handler refers to the name of a function file that should be compiled. This handler
is then invoked on each file interned into that root directory. For example, in order to support /fn, /conf/namespaces contains an entry like this:

    fn compile

This instructs Tangible to invoke the 'compile' function on each name/value pair that is interned into /fn.

      tangible.namespaces = {},
      tangible.compiler   = $(':all'),
      tangible.fn         = capture [compile(name, value) = tangible.fn[name.replace(/.*\//, '')] = tangible.compiler(value)],

# Association and retrieval

Like self-modifying Perl, Tangible abstracts the association and retrieval API. Unlike self-modifying Perl, this is done by modifying the mount table instead of by using ad-hoc patterns
against attribute names. Also unlike self-modifying Perl, association is asynchronous. Requests to associate an attribute return futures that are delivered once the object has been saved in
its new state. The Tangible kernel rate-limits save requests to prevent disk hogging.

      tangible.keys()          = attribute_nodes /keys -seq,
      tangible.attribute(name) = attribute_nodes[name] -oeq- attribute_node_for(name) /-$.merge/ capture [rm() = delete attribute_nodes[name]],

      tangible.state(s)        = s ? attribute_nodes -eq- {} -then- s /pairs *![attribute_nodes[x[0]] = attribute_node_for(x[0], x[1])] /seq
                                   : attribute_nodes %v*[x.val()] -seq,

      where [attribute_nodes                 = null,        // Must initialize this before doing anything with the attribute table
             attribute_node_for(name, value) = tangible.nodes.virtual() -se- it.val(value) /when.value
                                                                        -se- it / linear_edge /~to/ tangible.save_trigger],
      using.caterwaul});