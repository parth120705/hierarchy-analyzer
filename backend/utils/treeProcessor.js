/**
 * Processes raw string connections to build tree hierarchies, detect cycles,
 * identify invalid inputs, record duplicate edges, and calculate structural depths.
 * 
 * @param {Array<string>} data Raw data containing edges (e.g. "A->B")
 * @param {string} userId Custom user identifier
 * @param {string} emailId Custom email identifier
 * @param {string} rollNumber Custom college roll number
 * @returns {object} Formatted output containing hierarchies, invalid_entries, duplicate_edges, and summary.
 */
export function processHierarchies(data, userId, emailId, rollNumber) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen_edges = new Set();
  const child_to_parent = {};
  const valid_edges = [];
  const nodes = new Set();
  const node_order = [];

  if (!Array.isArray(data)) {
    throw new Error("Input 'data' must be an array of strings.");
  }

  // 1. Validate each edge, trim whitespace, deduplicate, and resolve multi-parents
  for (const item of data) {
    if (typeof item !== 'string') {
      invalid_entries.push(String(item));
      continue;
    }

    const trimmed = item.trim();
    if (trimmed === "") {
      invalid_entries.push("");
      continue;
    }

    const match = trimmed.match(/^([A-Z])->([A-Z])$/);

    if (!match || match[1] === match[2]) {
      // Invalid format or self loop
      invalid_entries.push(trimmed);
    } else {
      const parent = match[1];
      const child = match[2];
      const edgeStr = `${parent}->${child}`;

      if (seen_edges.has(edgeStr)) {
        // Record duplicate edge only once in duplicate_edges
        if (!duplicate_edges.includes(edgeStr)) {
          duplicate_edges.push(edgeStr);
        }
      } else {
        seen_edges.add(edgeStr);

        // Multi-parent case: Keep only the first parent and silently ignore subsequent ones
        if (child_to_parent[child]) {
          continue;
        }

        child_to_parent[child] = parent;
        valid_edges.push({ parent, child });

        if (!nodes.has(parent)) {
          nodes.add(parent);
          node_order.push(parent);
        }
        if (!nodes.has(child)) {
          nodes.add(child);
          node_order.push(child);
        }
      }
    }
  }

  // 2. Build an undirected adjacency list to identify connected components
  const adj = {};
  for (const node of nodes) {
    adj[node] = [];
  }
  for (const edge of valid_edges) {
    adj[edge.parent].push(edge.child);
    adj[edge.child].push(edge.parent);
  }

  // 3. Group nodes into connected components (DFS traversal, preserving input order)
  const visited = new Set();
  const components = [];

  for (const node of node_order) {
    if (!visited.has(node)) {
      const component = [];
      const queue = [node];
      visited.add(node);

      while (queue.length > 0) {
        const curr = queue.shift();
        component.push(curr);

        for (const neighbor of adj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(component);
    }
  }

  const hierarchies = [];

  // 4. Construct tree structures & detect cycles
  for (const component of components) {
    // A root node in a component has 0 in-degree (no parent in child_to_parent)
    const rootsInComponent = component.filter(node => !child_to_parent[node]);

    if (rootsInComponent.length === 1) {
      // Component has a unique root -> Valid tree structure unless a cycle is detected
      const root = rootsInComponent[0];

      // Directed edges representation within this component
      const directedAdj = {};
      for (const node of component) {
        directedAdj[node] = [];
      }
      for (const edge of valid_edges) {
        if (component.includes(edge.parent)) {
          directedAdj[edge.parent].push(edge.child);
        }
      }

      let hasCycle = false;
      const dfsVisited = new Set();
      const recStack = new Set();

      const dfs = (curr) => {
        dfsVisited.add(curr);
        recStack.add(curr);

        let maxChildDepth = 0;
        const subtree = {};

        // Sort children alphabetically to ensure deterministic layout
        const children = [...directedAdj[curr]].sort();
        for (const child of children) {
          if (recStack.has(child)) {
            hasCycle = true;
          } else {
            const result = dfs(child);
            subtree[child] = result.subtree;
            maxChildDepth = Math.max(maxChildDepth, result.depth);
          }
        }

        recStack.delete(curr);
        return { subtree, depth: 1 + maxChildDepth };
      };

      const { subtree, depth } = dfs(root);

      if (hasCycle) {
        hierarchies.push({
          root: root,
          tree: {},
          has_cycle: true
        });
      } else {
        hierarchies.push({
          root: root,
          tree: { [root]: subtree },
          depth: depth
        });
      }
    } else {
      // Component has 0 roots (pure cycle).
      // Choose the lexicographically smallest node in the component as root.
      const root = [...component].sort()[0];
      hierarchies.push({
        root: root,
        tree: {},
        has_cycle: true
      });
    }
  }

  // 5. Generate summary statistics
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let max_depth = -1;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      total_cycles++;
    } else {
      total_trees++;
      if (h.depth > max_depth) {
        max_depth = h.depth;
        largest_tree_root = h.root;
      } else if (h.depth === max_depth) {
        // Tie-breaker: choose lexicographically smaller root
        if (h.root < largest_tree_root) {
          largest_tree_root = h.root;
        }
      }
    }
  }

  return {
    user_id: userId,
    email_id: emailId,
    college_roll_number: rollNumber,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: total_trees > 0 ? largest_tree_root : ""
    }
  };
}
