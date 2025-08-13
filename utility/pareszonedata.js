const parseZoneData = (zoneDataFormatted) => {
  return zoneDataFormatted.split(',').reduce((acc, item) => {
    const [zone, rate] = item.split(':').map(str => str.trim().replace(/['"]+/g, ''));
    acc[zone] = rate;
    return acc;
  }, {});
};
module.exports = parseZoneData