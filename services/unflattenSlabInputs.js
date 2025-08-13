function unflattenSlabInputs(flat) {
  const result = { slabs: [] };
  for (const key in flat) {
    const value = flat[key];
    // slabs[0][zones_input][A]
    let match = key.match(/^slabs\[(\d+)\]\[([^\]]+)\]\[([^\]]+)\]$/);
    if (match) {
      const [_, slabIdx, group, subkey] = match;
      if (!result.slabs[slabIdx]) result.slabs[slabIdx] = {};
      if (!result.slabs[slabIdx][group]) result.slabs[slabIdx][group] = {};
      // Convert value to number if possible
      const num = Number(value);
      result.slabs[slabIdx][group][subkey] = isNaN(num) ? value : num;
      continue;
    }
    // slabs[0][slab_additional][0][input][A]
    match = key.match(/^slabs\[(\d+)\]\[slab_additional\]\[(\d+)\]\[([^\]]+)\]\[([^\]]+)\]$/);
    if (match) {
      const [_, slabIdx, addIdx, inputType, subkey] = match;
      if (!result.slabs[slabIdx]) result.slabs[slabIdx] = {};
      if (!result.slabs[slabIdx].slab_additional) result.slabs[slabIdx].slab_additional = [];
      if (!result.slabs[slabIdx].slab_additional[addIdx]) result.slabs[slabIdx].slab_additional[addIdx] = {};
      if (!result.slabs[slabIdx].slab_additional[addIdx][inputType]) result.slabs[slabIdx].slab_additional[addIdx][inputType] = {};
      const num = Number(value);
      result.slabs[slabIdx].slab_additional[addIdx][inputType][subkey] = isNaN(num) ? value : num;
    }
  }
  return result;
}
module.exports = unflattenSlabInputs