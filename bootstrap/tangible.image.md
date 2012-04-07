Tangible image library | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This module contains functions that read and write Tangible images. An 'image' in this context is a runnable Tangible file consisting of three parts:

    1. Prelude. This is a Bash segment that handles argument parsing and --help invocation.
    2. node.js kernel invocation. This includes a heredoc containing the Tangible kernel code.
    3. Data. This is never executed by bash; it begins with 'exit 0\n' and consists of object-specific data.

    caterwaul.module('tangible.image', function ($) {

    });