import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';

export function showWinnerModal(fighter) {
  showModal({
    title: `Winner is ${fighter.name}!`,
    bodyElement: createFighterImage(fighter),
    onClose: () => location.reload()
  });
}
