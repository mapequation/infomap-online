import React from "react";
import imgNineTriangles from "../../images/triangle-network-levels_3.svg";
import imgMultilayerNetwork from "../../images/multilayer-network.svg";
import imgStateNetwork from "../../images/state-network.svg";
import imgPhysicalAndStateNodes from "../../images/physical-and-state-nodes.svg";
import { InlineMath } from "react-katex";

const FIGURE_NUMBER = {
  FigureNineTriangles: 1,
  FigureMultilayerNetwork: 2,
  FigureStateNetwork: 3,
  FigurePhysicalAndStateNodes: 4,
}

const ASSERT_FIGURE = (id) => {
  if (!FIGURE_NUMBER.hasOwnProperty(id)) {
    throw new Error(`No figure with id '${id}'.`);
  }
}

export const figNumber = (id) => {
  ASSERT_FIGURE(id);
  return FIGURE_NUMBER[id];
}

export const FigLink = ({ id }) => {
  return <a href={`#${id}`}>Figure {figNumber(id)}</a>;
}


const Figure = ({ id }) => {
  switch (id) {
    case "FigureNineTriangles":
      return (
      <figure id={id}>
        <img src={imgNineTriangles} alt="Network of nine triangles" />
        <figcaption>
          <strong>Figure {figNumber(id)}.</strong> Triangle network of three levels with nine
          triangles at the bottom level.
        </figcaption>
      </figure>
      )
    case "FigureMultilayerNetwork":
      return (
        <figure id={id}>
          <img src={imgMultilayerNetwork} alt="Multilayer network" />
          <figcaption>
            <strong>Figure {figNumber(id)}.</strong> A multilayer network with five physical
            nodes <InlineMath>i,\dotsc,m</InlineMath> in two layers,{" "}
            <InlineMath>\alpha</InlineMath> and <InlineMath>\beta</InlineMath>.
            Node <InlineMath>i</InlineMath> exists in both layers, and the flow
            between layers through the common nodes can be modelled with a relax
            rate <InlineMath>r</InlineMath>, which is the probability to relax the
            constraint to move only in the current layer. This network is represented 
            as a state network in <FigLink id="FigureStateNetwork" />, using relax 
            rate <InlineMath>r = 0.4</InlineMath>.
          </figcaption>
        </figure>
      );
    case "FigureStateNetwork":
      return (
        <figure id={id}>
          <img src={imgStateNetwork} alt="State network" />
          <figcaption>
            <strong>Figure {figNumber(id)}.</strong> A State network with five
            physical nodes <InlineMath>i,\dotsc,m</InlineMath> and six state
            nodes <InlineMath math="\tilde{\alpha}_i,\dotsc,\tilde{\zeta}_m" />.
            It represents the multilayer network in{" "}
            <FigLink id="FigureMultilayerNetwork" />.
          </figcaption>
        </figure>
      );
    case "FigurePhysicalAndStateNodes":
      return (
        <figure id={id}>
          <img
            src={imgPhysicalAndStateNodes}
            alt="Physical and state nodes in output"
          />
          <figcaption>
            <strong>Figure {figNumber(id)}.</strong> Network flows at different
            modular levels. Large circles represent physical nodes, small
            circles represent state nodes, and dashed areas represent modules.{" "}
            <strong>(a)</strong> Finest modular level with physical nodes for
            first-order network flows; <strong>(b)</strong> Finest modular level
            with physical nodes and state nodes for higher-order network flows;{" "}
            <strong>(c)</strong> Intermediate level; <strong>(d)</strong>{" "}
            Coarsest modular level.
          </figcaption>
        </figure>
      );
    default:
      throw new Error(`No figure with id '${id}'.`);
  }
};

export default Figure;
