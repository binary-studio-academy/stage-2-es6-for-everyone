import {createElement} from '../helpers/domHelper';

export function createFighterPreview (fighter, position) {
  const positionClassName = position === 'right'
    ? 'fighter-preview___right'
    : 'fighter-preview___left';
  const fighterElement = createElement ({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  if (fighter) {
    const {name, health} = fighter;
    const fighterName = document.createElement ('div');
    const fighterHealth = document.createElement ('div');
    const fighterImage = createFighterImage (fighter);

    fighterName.innerText = `Name: ${name}`;
    fighterHealth.innerText = `Health: ${health} hp`;

    // Add some styles for more readability

    fighterName.style.color = "#FFFFFF";
    fighterName.style.fontWeight = "700";
    fighterHealth.style.color = "#FFFFFF";
    fighterHealth.style.fontWeight = "700";
    fighterImage.style.height = "40vh"

    fighterElement.append (fighterName, fighterHealth, fighterImage);
  }

  return fighterElement;
}

export function createFighterImage (fighter) {
  const {source, name} = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name,
  };
  const imgElement = createElement ({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
