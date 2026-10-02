/** Highlight existing step numbers without changing heading text or anchor IDs. */
export default function stepHeadings() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'element' && /^h[2-4]$/.test(node.tagName)) {
        const first = node.children?.[0];
        const match = first?.type === 'text' && first.value.match(/^(\d+(?:-\d+)*(?:[.．])?)(\s+)(?=\S)/);
        if (match) {
          node.properties ??= {};
          const classes = node.properties.className ?? [];
          node.properties.className = [...(Array.isArray(classes) ? classes : [classes]), 'step-heading'];
          node.children.splice(0, 1,
            { type: 'element', tagName: 'span', properties: { className: ['step-number'] }, children: [{ type: 'text', value: match[1].replace(/[.．]$/, '') }] },
            { type: 'text', value: first.value.slice(match[1].length) },
          );
        }
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}
