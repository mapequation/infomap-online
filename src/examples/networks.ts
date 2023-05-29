import { figNumber } from "../components/Documentation/Figure";

export const twoTriangles = `#source target [weight]
1 2
1 3
1 4
2 1
2 3
3 2
3 1
4 1
4 5
4 6
5 4
5 6
6 5
6 4`;

export const nineTriangles = `# A hierarchical network of nine triangles
# Figure ${figNumber("FigureNineTriangles")}
# source target weight
1 2
1 3
2 3
4 5
4 6
5 6
7 8
7 9
8 9
2 4
3 7
6 8
10 11
10 12
11 12
13 14
13 15
14 15
16 17
16 18
17 18
11 13
12 16
15 17
19 20
19 21
20 21
22 23
22 24
23 24
25 26
25 27
26 27
20 22
21 25
24 26
5 10
9 19
18 23`;

export const pajek = `# A network in Pajek format
*Vertices 6
1 "1"
2 "2"
3 "3"
4 "4"
5 "5"
6 "6"
*Edges 14
# source target [weight]
1 2
1 3
1 4
2 1
2 3
3 2
3 1
4 1
4 5
4 6
5 4
5 6
6 5
6 4`;

export const bipartite = `# A bipartite network with node names
# Figure ${figNumber("FigureBipartite")}
*Vertices 5
1 "Node 1"
2 "Node 2"
3 "Node 3"
4 "Feature 1"
5 "Feature 2"
# set bipartite start id to 4
*Bipartite 4
# node_id feature weight
1 4 1
2 4 1
2 5 0.25
3 5 1`;

export const bipartiteLinkList = `# A bipartite network in link list format
# Figure ${figNumber("FigureBipartite")}
# set bipartite start id to 4
*Bipartite 4
# node_id feature weight
1 4 1
2 4 1
2 5 0.25
3 5 1`;

export const multilayer = `# A multilayer network using explicit format
# Figure ${figNumber("FigureMultilayerNetworkFull")}
*Vertices 5
# node_id name
1 "i"
2 "j"
3 "k"
4 "l"
5 "m"
*Multilayer
# layer_id node_id layer_id node_id weight
# intra
1 1 1 4 0.8
1 4 1 1 1
1 1 1 5 0.8
1 5 1 1 1
1 4 1 5 1
1 5 1 4 1
2 1 2 2 0.8
2 2 2 1 1
2 1 2 3 0.8
2 3 2 1 1
2 2 2 3 1
2 3 2 2 1
# inter
1 1 2 2 0.2
1 1 2 3 0.2
2 1 1 4 0.2
2 1 1 5 0.2`;

export const multilayerIntraInter = `# A multilayer network using *Intra/*Inter format
# Figure ${figNumber("FigureMultilayerNetworkIntraInter")}
*Vertices 5
# node_id name
1 "i"
2 "j"
3 "k"
4 "l"
5 "m"
*Intra
# layer_id node_id node_id weight
1 1 4 0.8
1 4 1 1
1 1 5 0.8
1 5 1 1
1 4 5 1
1 5 4 1
2 1 2 0.8
2 2 1 1
2 1 3 0.8
2 3 1 1
2 2 3 1
2 3 2 1
*Inter
# layer_id node_id layer_id weight
1 1 2 0.4
2 1 1 0.4`;

export const multilayerIntra = `# A multilayer network using *Intra format
# Figure ${figNumber("FigureMultilayerNetworkIntra")}
*Vertices 5
# node_id name
1 "i"
2 "j"
3 "k"
4 "l"
5 "m"
*Intra
# layer_id node_id node_id weight
1 1 4 1
1 4 1 1
1 1 5 1
1 5 1 1
1 4 5 1
1 5 4 1
2 1 2 1
2 2 1 1
2 1 3 1
2 3 1 1
2 2 3 1
2 3 2 1`;

export const states = `# A network in state format
# Figure ${figNumber("FigureStateNetwork")}
*Vertices 5
#node_id name
1 "i"
2 "j"
3 "k"
4 "l"
5 "m"
*States
#state_id node_id name
1 1 "α~_i"
2 2 "β~_j"
3 3 "γ~_k"
4 1 "δ~_i"
5 4 "ε~_l"
6 5 "ζ~_m"
*Links
#source target weight
1 2 0.8
1 3 0.8
1 5 0.2
1 6 0.2
2 1 1
2 3 1
3 1 1
3 2 1
4 5 0.8
4 6 0.8
4 2 0.2
4 3 0.2
5 4 1
5 6 1
6 4 1
6 5 1`;

export const karate = `# Zacharys karate club
0 1 4
0 2 5
0 3 3
0 4 3
0 5 3
0 6 3
0 7 2
0 8 2
0 10 2
0 11 3
0 12 1
0 13 3
0 17 2
0 19 2
0 21 2
0 31 2
1 2 6
1 3 3
1 7 4
1 13 5
1 17 1
1 19 2
1 21 2
1 30 2
2 3 3
2 7 4
2 8 5
2 9 1
2 13 3
2 27 2
2 28 2
2 32 2
3 7 3
3 12 3
3 13 3
4 6 2
4 10 3
5 6 5
5 10 3
5 16 3
6 16 3
8 30 3
8 32 3
8 33 4
9 33 2
13 33 3
14 32 3
14 33 2
15 32 3
15 33 4
18 32 1
18 33 2
19 33 1
20 32 3
20 33 1
22 32 2
22 33 3
23 25 5
23 27 4
23 29 3
23 32 5
23 33 4
24 25 2
24 27 3
24 31 2
25 31 7
26 29 4
26 33 2
27 33 4
28 31 2
28 33 2
29 32 4
29 33 2
30 32 3
30 33 3
31 32 4
31 33 4
32 33 5`;

export const modular_w = `*Edges
0 2 2
1 2 4
2 3 5
1 4 8
2 4 5
2 5 5
4 5 4
3 5 3
4 6 3
6 7 8
7 8 4
6 8 5
8 9 5
6 9 4
8 10 2
7 11 3
10 11 2
8 11 3
10 12 5
9 12 3
11 12 3
12 13 2
13 14 4
14 15 3
13 16 4
14 16 5
15 16 4
16 17 1
17 19 4
19 20 4
17 20 2
17 21 4
19 21 2
20 21 2
18 21 4
21 22 4
22 23 5
9 23 4
21 23 5
23 24 3
21 24 2
17 24 8
19 18 3`;

export const modular_wd = `*Arcs
1 3 2
2 3 4
3 4 5
2 5 4
3 5 5
3 6 4
5 6 4
4 6 3
5 7 3
7 8 3
8 9 4
7 9 5
9 10 5
7 10 4
9 11 2
8 12 3
11 12 2
9 12 3
11 13 2
10 13 3
12 13 3
13 14 2
14 15 4
15 16 3
14 17 4
15 17 5
16 17 4
17 18 1
18 20 4
20 21 4
18 21 2
18 22 4
20 22 2
21 22 2
19 22 4
22 23 4
23 24 5
10 24 4
22 24 5
24 25 3
22 25 2
18 25 2
25 18 6
20 19 3
13 11 3
6 3 1
5 2 4
8 7 5`;
