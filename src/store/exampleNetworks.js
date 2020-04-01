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
# source target weight
1 2 1
1 3 1
1 4 1
2 3 1
3 7 1
4 5 1 
4 6 1 
5 6 1 
6 8 1 
7 8 1 
7 9 1 
8 9 1 
10 11 1
10 12 1
10 13 1
11 12 1
12 16 1
13 14 1 
13 15 1 
14 15 1 
15 17 1 
16 17 1 
16 18 1 
17 18 1
19 20 1
19 21 1
19 22 1
20 21 1
21 25 1
22 23 1 
22 24 1 
23 24 1 
24 26 1 
25 26 1 
25 27 1 
26 27 1
9 20 1
5 11 1
18 23 1`;

export const pajek = `# A network in Pajek format
*Vertices 4
1 "1"
2 "2"
3 "3"
4 "4"
5 "5"
6 "6"
*Edges 4
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
# set bipartite start id to 4
*Bipartite 4
# node_id feature weight
1 4 1
2 4 1
2 5 0.25
3 5 1`;

export const multilayer = `# A multilayer network using explicit format
# Figure 4a in Algorithms 10, 112 (2017)
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

export const multilayerIntraInter = `# A multilayer network using *Inter/*Intra format
# Figure 4a in Algorithms 10, 112 (2017)
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
# Figure 4a in Algorithms 10, 112 (2017), assuming --multilayer-relax-rate 0.4
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
# Figure 4e in Algorithms 10, 112 (2017)
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
