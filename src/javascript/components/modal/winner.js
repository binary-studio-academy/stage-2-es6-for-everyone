import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  // call showModal function 
  const title = "Game over"
  const bodyElement = `${fighter.name} wins!` 
  showModal({title, bodyElement})
}
