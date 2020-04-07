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
