---
title: "Generate Link to Kusto Query With Python"
subtitle: "A Python snippet for creating direct links to Kusto queries in Azure Data Explorer"
description: ""
date: 2025-10-30T17:00:19Z
tags: [ "snippet", "python", "kusto", "azure" ]
keywords: []
draft: false
featured: false
---

When sharing Kusto queries for Azure Data Explorer, it's often useful to generate a direct link to the query. This snippet demonstrates how to create such a link using Python by encoding the query.

<!--more-->

## Code Snippet

```python
import base64
import gzip

def generate_kusto_query_link(cluster: str, database: str, query: str) -> str:
    """Generate a link to a given Kusto query in Azure Data Explorer.

    Args:
        cluster (str): The name of the Kusto cluster.
        database (str): The name of the database.
        query (str): The Kusto query string.

    Returns:
        str: A URL linking to the Kusto query.
    """

    encoded_bytes = gzip.compress(query.encode('utf-8'))
    encoded_query = base64.b64encode(encoded_bytes).decode('utf-8')

    return f"https://dataexplorer.azure.com/clusters/{cluster}/{database}?query={encoded_query}"

```

Here's how to use the function:

```python
cluster_name = "help"
database_name = "Samples"
kusto_query = "nyc_taxi | take 100"

link = generate_kusto_query_link(cluster_name, database_name, kusto_query)
print("Link:", link)
# Link: https://dataexplorer.azure.com/clusters/help/Samples?query=H4sIAHjFBmkC/8urTI4vSazIVKhRKEnMTlUwNDAAAG/ThhgTAAAA
```

## Explanation

This function generates a link to a Kusto query in Azure Data Explorer by compressing and encoding the query string. The resulting link can be used to directly open the query in the specified cluster and database.

The url format is as follows:

```markdown
https://dataexplorer.azure.com/clusters/<Cluster Name>/<Database Name>?query=<Encoded Query>
```

Where `<Encoded Query>` is the base64-encoded gzip-compressed version of the original query string (`base64(gzip(text))`).

Here is the documentation reference for more details:

> Alternatively, it can be encoded using the transformation base64(gzip(text)), which makes it possible to compress long queries or management commands to git in the default browser URI length limits.
>
> <https://learn.microsoft.com/en-us/kusto/api/rest/deeplink?view=azure-data-explorer>
