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

async function disneyData(): Promise<void> {
  try {
    const response = await fetch('https://api.disneyapi.dev/character');
    if (!response.ok) {
      throw new Error(`http error ${response.status}`);
    }
    // data got return
    const data: info = await response.json();
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
        (card as HTMLElement).style.display = 'block'; // Show matching cards
      } else {
        (card as HTMLElement).style.display = 'none'; // Hide non-matching cards
      }
    });
  });
}

disneyData();
