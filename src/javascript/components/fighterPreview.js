import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    fighterElement.append(createFighterImage(fighter));
    fighterElement.append(createFighterInfo(fighter));
  }
  // todo: show fighter info (image, name, health, etc.)

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });
  imgElement.style.height = "450px";

  return imgElement;
}

function createFighterInfo(fighter) {
  const { name, health, attack, defense } = fighter;
  const divElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info'
  });
  divElement.innerHTML = `Name: ${name}<br/>Health: ${health}<br/>Attack: ${attack}<br/>Defense: ${defense}`;
  divElement.style.color = "white";
  divElement.style.fontWeight = "700";
  divElement.style.fontSize = "30px";
  divElement.style.lineHeight = "40px";

  return divElement;
}