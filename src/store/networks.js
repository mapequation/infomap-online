export const initial = `#source target [weight]
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

export const linkList = `#source target [weight]
1 2 1
1 3 1
2 3 2
3 5 0.5`;

export const pajek = `# A network in Pajek format
*Vertices 4
1 "1"
2 "2"
3 "3"
4 "4"
*Edges 4
#source target [weight]
1 2 1
1 3 1
1 4 1
2 3 1`;

export const bipartite = `# A bipartite network with node names
*Vertices 5
1 "Node 1"
2 "Node 2"
3 "Node 3"
4 "Feature 1"
5 "Feature 2"
# set bipartite start id to 4
*Bipartite 4
1 4 1
1 5 1
2 4 1
2 5 1
3 5 1`;

export const bipartiteLinkList = `# A bipartite network in link list format
# set bipartite start id to 4
*Bipartite 4
1 4 1
1 5 1
2 4 1
2 5 1
3 5 1`;

export const multilayer = `# A network in a general multilayer format
*Vertices 4
1 "Node 1"
2 "Node 2"
3 "Node 3"
4 "Node 4"
*Multilayer
#layer node layer node [weight]
1 1 1 2 2
1 1 2 2 1
1 2 1 1 1
1 3 2 2 1
2 2 1 3 1
2 3 2 2 1
2 4 2 1 2
2 4 1 2 1`;

export const multilayerIntraInter = `# A network in multilayer format
*Intra
#layer node node weight
1 1 2 1
1 2 1 1
1 2 3 1
1 3 2 1
1 3 1 1
1 1 3 1
1 2 4 1
1 4 2 1
2 4 5 1
2 5 4 1
2 5 6 1
2 6 5 1
2 6 4 1
2 4 6 1
2 3 6 1
2 6 3 1
*Inter
#layer node layer weight
1 3 2
2 3 1
1 4 2
2 4 1`;

export const states = `# A network in state format
*Vertices 4
1 "PRE"
2 "SCIENCE"
3 "PRL"
4 "BIO"
*States
#state_id physical_id [name]
1 2 "1 2"
2 3 "2 3"
3 2 "4 2"
4 4 "2 4"
*Links
#source_state_id target_state_id
1 2
3 4`;
