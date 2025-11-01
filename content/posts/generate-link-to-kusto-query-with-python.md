---
title: "Generate Link to Kusto Query With Python"
subtitle: ""
description: ""
date: 2025-10-30T17:00:19Z
tags: [ "snippet", "python", "kusto", "azure" ]
keywords: []
draft: true
featured: false
---

<!--more-->

## TL;DR

```python
import base64
import gzip

def generate_kusto_query_link(cluster: str, database: str, query: str) -> str:
    """Generate a link to a given Kusto query in Azure Data Explorer."""

    encoded_bytes = gzip.compress(query.encode('utf-8'))
    encoded_query = base64.b64encode(encoded_bytes).decode('utf-8')

    return f"https://dataexplorer.azure.com/clusters/{cluster}/{database}?query={encoded_query}"

```
