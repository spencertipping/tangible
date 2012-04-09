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

    fn /kernel/compile

The contents of /kernel/compile look like this:

    function (name, value) {
      return tangible.compiler -oeq- $(':all') <then>
             tangible.fn       -oeq- {}        <then>
             tangible.fn[name.replace(/.*\//, '')] = tangible.compiler(value)}

Because this is written in caterwaul, a compiler must exist to compile /kernel/compile. This is done magically by the kernel up-front.

      tangible.namespaces = {},
      tangible.compiler   = $(':all'),
      tangible.fn         = capture [compile(name, value) = tangible.fn[name.replace(/.*\//, '')] = tangible.compiler(value)],

# Association and retrieval

Like self-modifying Perl, Tangible abstracts the association and retrieval API. Unlike self-modifying Perl, this is done by modifying the mount table instead of by using ad-hoc patterns
against attribute names. Also unlike self-modifying Perl, retrieval and association use futures. Retrievers always return futures of their values, and associators return futures that are
delivered once the object is saved with its new state. The Tangible kernel rate-limits save requests to prevent disk hogging.

      using.caterwaul});