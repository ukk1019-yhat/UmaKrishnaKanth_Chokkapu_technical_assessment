from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict, deque

api_app = FastAPI()

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


class Pipeline(BaseModel):
    nodes: list[dict]
    edges: list[dict]


@api_app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@api_app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)

    node_ids = {n['id'] for n in pipeline.nodes if 'id' in n}

    adj = defaultdict(list)
    indeg = defaultdict(int)

    for nid in node_ids:
        indeg[nid] = indeg.get(nid, 0)

    for e in pipeline.edges:
        src, tgt = e.get('source'), e.get('target')
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            indeg[tgt] += 1

    queue = deque([n for n in node_ids if indeg[n] == 0])
    visited = 0

    while queue:
        u = queue.popleft()
        visited += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)

    is_dag = visited == len(node_ids)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag,
    }


app = FastAPI()
app.mount('/api', api_app)
