Tangible logical attribute promotion | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible maintains an in-memory filesystem where each attribute is stored as text. This module provides logical bindings for those attributes. For example, attributes stored in /fn should be
compiled as functions. In order to do this, attributes are accessed through an abstraction that invokes hooks automatically. Like self-modifying Perl, the text versions are still
authoritative; artifacts of those attributes are not stored or otherwise readable through the filesystem API.

    caterwaul.module('tangible.logical', ':all', function ($) {

# Namespaces

Namespaces are stored in /namespace. Each file here contains a function definition that is invoked whenever the given file is created in the corresponding directory. So, for example,
/namespace/fn would contain a function definition that compiled any file in /fn and made it available within tangible.fn. There is no /namespace/namespace, unfortunately; the behavior of
/namespace is baked into the kernel.

Note that you can define the roles of subdirectories using more complex patterns; e.g. /namespace/usr/bin. Also note that namespaces are not necessarily mutually exclusive. If a file is
associated into multiple namespaces, the namespace associator functions will be run in an unspecified order.

      tangible.compiler             = $(':all'),
      tangible.sdoc(code)           = code.split(/\n\n\s*/) %/^[^A-Z|]/.test -seq -re- it.join('\n\n'),
      tangible.compile(code)        = tangible.compiler(tangible.sdoc(code), tangible.bindings),

      tangible.bindings             = capture [tangible = tangible, $ = $],

      tangible.compiled_namespaces  = {},
      tangible.namespace_fn(name)   = tangible.compiled_namespaces[name] -ocq- tangible.compile(tangible.attribute(name).val()),
      tangible.namespaces_for(name) = tangible.keys() %~!/\/namespace\/(.*)/.exec %[name.substr(1, x[1].length) === x[1]] *[x[0]] -seq,
      tangible.intern(name)(value)  = tangible.namespaces_for(name) *![tangible.namespace_fn(x)(name, value)] -seq,

      tangible.save()               = self_lock = self_lock /~flat_map/ "tangible.self /~val/ tangible.serialize_image(tangible.state())".qf,

# Association and retrieval

Like self-modifying Perl, Tangible abstracts the association and retrieval API. Unlike self-modifying Perl, this is done by modifying the mount table instead of by using ad-hoc patterns
against attribute names. Also unlike self-modifying Perl, association is asynchronous. Requests to associate an attribute return futures that are delivered once the object has been saved in
its new state. The Tangible kernel rate-limits save requests to prevent disk hogging.

      tangible.keys()          = attribute_nodes /keys -seq,
      tangible.attribute(name) = attribute_nodes[name] -oeq- attribute_node_for(name) /-$.merge/ capture [rm() = delete attribute_nodes[name]],

      tangible.state(s)        = s ? attribute_nodes -eq- {} -then- s /pairs *![attribute_nodes[x[0]] = attribute_node_for(x[0], x[1])] /seq
                                   : attribute_nodes %v*[x.val()] -seq,

      where [attribute_nodes                 = null,        // Must initialize this before doing anything with the attribute table
             attribute_node_for(name, value) = tangible.nodes.virtual() <se> it.val(value) -when.value -then- it.signal() /~push/ tangible.save
                                                                                                       -then- it.signal() /~push/ tangible.intern(name),
             namespace_for(name)             = /\/([^\/]+)/.exec(name) -re- it[1],
             self_lock                       = future()(null)],

      using.caterwaul});