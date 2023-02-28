# Infomap Online

Infomap Online is a client-side web application that makes it possible
for users to run [Infomap](//github.com/mapequation/infomap) without any
installation. Infomap runs locally on your computer and uploads no data
to any server. We support this solution by compiling Infomap from C++
to JavaScript with [Emscripten](//emscripten.org/),
which gives a performance penalty compared to the stand-alone version of Infomap.

The code for running Infomap as a web worker in the browser is available as a
[package on NPM](//www.npmjs.com/package/@mapequation/infomap).

## Authors

Daniel Edler, Anton Holmgren, Martin Rosvall
