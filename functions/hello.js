const items = [
  {
    name: "jaydn",
  },
  { name: "mengxuan" },
];

exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
