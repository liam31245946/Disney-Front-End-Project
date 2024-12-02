interface Data {
  _id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  allies: string[];
  enemies: string[];
  parkAttractions: string[];
  sourceUrl: string;
  url: string;
}

interface info {
  data: Data[];
}

const $row = document.querySelector('.row') as HTMLElement;

function renderCharacter(charData: Data): HTMLElement {
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
  return $div;
}

async function disneyData(): Promise<void> {
  try {
    const response = await fetch('https://api.disneyapi.dev/character');
    if (!response.ok) {
      throw new Error(`http error ${response.status}`);
    }
    // data got return
    const data: info = await response.json();

    // looping over the character
    data.data.forEach((charData) => {
      if ($row) {
        const $charCard = renderCharacter(charData);
        $row.appendChild($charCard);
      }
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}

const $searchInput = document.querySelector(
  '.search-character',
) as HTMLInputElement;

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
        card.classList.remove('hidden'); // Show matching cards
      } else {
        card.classList.add('hidden'); // Hide non-matching cards
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  disneyData();
});
