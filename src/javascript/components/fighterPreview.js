import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    const imageElement = createFighterPreviewImage(fighter);
    fighterElement.append(imageElement);

    const fighterInfo = createFighterInfo(fighter);
    fighterElement.append(fighterInfo);
    return fighterElement;
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  return createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });
}

function createFighterPreviewImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  return createElement({
    tagName: 'img',
    className: 'fighter-preview___img--small',
    attributes,
  });
}

function createFighterInfo(fighter) {
  const previewContainerElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  const nameElement = createElement({
    tagName: 'h3',
    className: 'fighter-preview___name',
  });
  const { name } = fighter;
  nameElement.innerText = name;
  previewContainerElement.append(nameElement);

  const fighterPropMap = new Map();
  fighterPropMap.set('health', fighter['health']);
  fighterPropMap.set('attack', fighter['attack']);
  fighterPropMap.set('defense', fighter['defense']);
  fighterPropMap.forEach((propValue, propName) => {
    const itemElement = createElement({
      tagName: 'p',
      className: `fighter-preview__${propName}`,
    });
    itemElement.innerText = `${propName}: ${propValue}`;
    previewContainerElement.append(itemElement);
  });

  return previewContainerElement;
}