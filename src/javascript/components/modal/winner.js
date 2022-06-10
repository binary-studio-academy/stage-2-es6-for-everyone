import { createFighterImage } from "../fighterPreview";
import { showModal } from "./modal";
import { fighterService } from "../../services/fightersService";

import App from './../../app';
import './../../../styles/styles.css';

export function showWinnerModal(fighter) {
  const bodyElement = createFighterImage(fighter);
  showModal({
    title: `Winner is ${fighter.name}`,
    bodyElement: bodyElement,
    onClose: _ => {
      fighterService.getFighterDetails(fighter._id).then(data => fighter.health = data.health);
      
      const root = document.getElementById('root');
      root.innerHTML = '';

      App.startApp();
    }
  });
  // call showModal function 
}
