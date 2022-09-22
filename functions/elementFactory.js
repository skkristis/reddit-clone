export default function elementFactory(type, elClass = "") {
  const tag = document.createElement(type);
  tag.className = elClass;

  return tag;
}
