const createDomElement = (tag, classNames) => {
  const element = document.createElement(tag);
  if (Array.isArray(classNames)) {
    classNames.forEach((item) => element.classList.add(item));
  } else {
    element.classList.add(classNames);
  }
  return element;
};

export default createDomElement;
