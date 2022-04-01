# PePSA: A Privacy-enhancing Plugin for Solid Applications

An implementation of PePSA in components.js for the Solid Community Server

## About

PePSA is a plugin for the Community Solid Server that implements privacy filters for structured data. PePSA provides a library of transformations on data attributes. Currently, the following are supported: `remove`, `pseudonym`, `perturbation`, `hash`, `encrypted`, `random`. PePSA introduces a number of privacy levels, which correspond to a number of transformations that will be performed on data of a certain data type (called the _data scheme_). For every data type, a configuration file can be specified (in JSON). This configuration file determines, for every privacy level, what transformations will be applied to which attributes of the data. For JSON and XML, the attributes are specified in JSONPath.

## Roadmap

The following features are underway:

1. Implementations for the `hash` and `encrypted` transformations
2. Allowing configuration files for a data type to be
   a. loaded from the user's pod, instead of being in the server config
   b. allow different privacy levels or configuration files for specific applications
3. Implement support for performing these transformations to data represented in a serialized form of RDF, where attributes are targeted using queries (for example, using communica)

## Running

`npm run build && npx community-solid-server -c config/css-config.json -m . -f ./demo/pod/`
