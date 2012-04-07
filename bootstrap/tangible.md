Tangible object kernel | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Tangible is a self-modifying structure consisting of node.js and Bash. Unlike self-modifying Perl, Tangible is designed to be nonblocking and support multiple simultaneous clients. It also
does a better job of separating the essential 'kernel' logic from object-specific logic, reducing the likelihood that modifications will render the object unusable.

    caterwaul.module('tangible', ':all', function ($) {

    });