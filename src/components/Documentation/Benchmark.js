export default function Benchmark() {
  return (
    <>
      <h2 id="Benchmark">
        <a href="#Benchmark">Benchmark</a>
      </h2>

      <p>
        The speed and accuracy of Infomap is visualized below, compared to the
        <a href="//sites.google.com/site/findcommunities/">Louvain method</a>,
        on generated benchmark networks
        <a href="//arxiv.org/abs/0805.4770">
          described by Andrea Lancichinetti et al
        </a>
        .
      </p>

      <img src="/assets/img/benchmark-performance.svg" alt="Speed benchmark" />
      <figcaption>
        <strong>Speed benchmark</strong>
        The speed is measured as the time needed to partition the benchmark
        networks in two levels.
      </figcaption>

      <img src="/assets/img/benchmark-accuracy.svg" alt="Accuracy benchmark" />
      <figcaption>
        <strong>Accuracy benchmark</strong>
        The accuracy is measured as Normalized Mutual Information (NMI) between
        the output cluster and the reference cluster. Benchmark networks are
        generated with 5000 nodes and community sizes between 20 and 200.
      </figcaption>

      <img
        src="/assets/img/benchmark-hier-accuracy.svg"
        alt="Hierarchical benchmark"
      />
      <img
        src="/assets/img/triangle-network-levels_3.svg"
        alt="Triangle network"
      />

      <figcaption>
        <strong>Hierarchical accuracy benchmark.</strong>
        The figure shows how well the algorithm reveal the hierarchical
        organization of nodes in triangle networks of different levels (see next
        figure).
      </figcaption>

      <figcaption>
        <strong>Triangle network of three levels.</strong>
        Networks for the hierarchical accuracy benchmark are generated as the
        Sierpinski fractal of different levels.
      </figcaption>

      <img src="/assets/img/infomap-evolution.svg" alt="Evolution of Infomap" />
      <figcaption>
        <strong>Performance evolution of Infomap.</strong>
        The performance is measured on a real-world network with code from
        different dates in the history of Infomap.
      </figcaption>
    </>
  );
}
