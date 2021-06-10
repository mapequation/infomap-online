export const tree = `# path flow name node_id
1:1 0.214286 "1" 1
1:2 0.142857 "2" 2
1:3 0.142857 "3" 3
2:1 0.214286 "4" 4
2:2 0.142857 "5" 5
2:3 0.142857 "6" 6`;

export const ftreeLinks = `*Links undirected
#*Links path enterFlow exitFlow numEdges numChildren
*Links root 0 0 2 2
1 2 0.0714286
2 1 0.0714286
*Links 1 0.0714286 0.0714286 6 3
1 2 0.0714286
1 3 0.0714286
2 1 0.0714286
2 3 0.0714286
3 1 0.0714286
3 2 0.0714286
*Links 2 0.0714286 0.0714286 6 3
1 2 0.0714286
1 3 0.0714286
2 1 0.0714286
2 3 0.0714286
3 1 0.0714286
3 2 0.0714286`;

export const clu = `# module level: 1
# id module flow
1 1 0.214286
2 1 0.142857
3 1 0.142857
4 2 0.214286
5 2 0.142857
6 2 0.142857`;

export const newick = `(((1:0.166667,2:0.166667,3:0.166667):0.5,(4:0.166667,5:0.166667,6:0.166667):0.5):1);`;

export const json = `{
    "version": "v1.4.0",
    "args": "-o json example.net .",
    "startedAt": "2021-06-10 15:02:15",
    "completedIn": 0.00249326,
    "numLevels": 2,
    "numTopModules": 2,
    "codelength": 2.01141,
    "relativeCodelengthSavings": 0.221882,
    "nodes": [
        { "path": [1, 1], "name": "i", "flow": 0.166667,
            "stateId": 1, "id": 1 },
        { "path": [1, 2], "name": "j", "flow": 0.166667,
            "stateId": 2, "id": 2 },
        { "path": [1, 3], "name": "k", "flow": 0.166667,
            "stateId": 3, "id": 3 },
        { "path": [2, 1], "name": "i", "flow": 0.166667,
            "stateId": 4, "id": 1 },
        { "path": [2, 2], "name": "l", "flow": 0.166667,
            "stateId": 5, "id": 4 },
        { "path": [2, 3], "name": "m", "flow": 0.166667,
            "stateId": 6, "id": 5 }
    ]
}`;
