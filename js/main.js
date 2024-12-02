'use strict';
const $row = document.querySelector('.row');
async function disneyData() {
  try {
    const response = await fetch('https://api.disneyapi.dev/character');
    if (!response.ok) {
      throw new Error(`http error ${response.status}`);
    }
    // data got return
    const data = await response.json();
    console.log('data', data);
    // looping over the character
    data.data.forEach((charData) => {
      const $div = document.createElement('div');
      $div.classList.add('column-fifth');
      const $img = document.createElement('img');
      $img.src = charData.imageUrl;
      $img.alt = charData.name;
      // description of character
      const $p = document.createElement('p');
      $p.textContent = charData.name;
      $div.appendChild($img);
      $div.appendChild($p);
      if ($row) {
        $row.appendChild($div);
      }
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}
const $searchInput = document.querySelector('.search-character');
if ($searchInput) {
  $searchInput.addEventListener('input', () => {
    const searchQuery = $searchInput.value.toLowerCase();
    // Select all character cards
    const characterCards = document.querySelectorAll('.column-fifth');
    characterCards.forEach((card) => {
      // Get the name of the character in the current card
      const charName =
        card.querySelector('p')?.textContent?.toLowerCase() || '';
      // Show or hide based on search query
      if (charName.includes(searchQuery)) {
        card.style.display = 'block'; // Show matching cards
      } else {
        card.style.display = 'none'; // Hide non-matching cards
      }
    });
  });
}
disneyData();
