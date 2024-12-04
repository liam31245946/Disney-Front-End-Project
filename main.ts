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

// render function, use to create element in html

function renderCharacter(charData: Data): HTMLElement {
  const $div = document.createElement('div');
  $div.classList.add('column-fourth');

  const $img = document.createElement('img');
  $img.src = charData.imageUrl;
  $img.alt = charData.name;

  // description of character
  const $p = document.createElement('p');
  $p.textContent = charData.name;

  $div.appendChild($img);
  $div.appendChild($p);

  // this is a click to click the character card on the main page
  $div.addEventListener('click', () => {
    // this function is below to select individual character card
    showCharacterDetail(charData);
  });
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
    const characterCards = document.querySelectorAll('.column-fourth');

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

// Starting from here is mostly issue 2

// function use to show information of individual card.

const $mainPage = document.querySelector(
  '[data-view="main-page"]',
) as HTMLElement;
const $characterDetail = document.querySelector(
  '[data-view="character-page"]',
) as HTMLElement;

function showCharacterDetail(charData: Data): void {
  const $characterName = document.querySelector(
    '.characterName',
  ) as HTMLElement;
  const $characterTVshow = document.querySelector(
    '.characterTVshow',
  ) as HTMLElement;
  const $characterPic = document.querySelector(
    '#character-image',
  ) as HTMLImageElement;
  const $characterFilm = document.querySelector(
    '.characterFilm',
  ) as HTMLElement;
  const $characterVideogames = document.querySelector(
    '.characterVideogames',
  ) as HTMLElement;
  const $characterInfo = document.querySelector(
    '.characterInfo',
  ) as HTMLElement;

  $characterPic.src = charData.imageUrl;
  $characterPic.alt = charData.name;
  $characterName.textContent = `Character Name: ${charData.name}`;

  if ($characterTVshow) {
    $characterTVshow.textContent = charData.tvShows.length
      ? `TV Show : ${charData.tvShows.join(' , ')}`
      : `TV Show: N/A, does not exist`;
  }

  $characterFilm.textContent = `Film: ${charData.films.join(' , ')}`;

  $characterVideogames.textContent = charData.videoGames.length
    ? `Video Game: ${charData.videoGames.join(' ')}`
    : `Video Game: N/A, does not exist`;
  $characterInfo.innerHTML = `Character's Information on Wikipedia <a href="${charData.sourceUrl}">${charData.sourceUrl}</a>`;

  // main page swapping

  $mainPage.classList.add('hidden');
  $characterDetail.classList.remove('hidden');
}

// Disney header navbar, one way ticket back to main page

const $navbar = document.querySelector('.navbar') as HTMLElement;

if ($navbar) {
  $navbar.addEventListener('click', () => {
    // this is 2 data-view
    const $mainPage = document.querySelector('[data-view="main-page"]');
    const $characterPage = document.querySelector(
      '[data-view="character-page"',
    );

    // click on Walt Disney = go back to main page
    $characterPage?.classList.add('hidden');
    $mainPage?.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  disneyData();
});

// This is Where the Fun Begin, Here is all the local storage code for dislike and favorite start

// first part will be code in Character-Page

// Local storage function will be in data.ts

// function to display character's data, this is the annoying part to fix and will not try to do it again

async function characterDataById(id: number): Promise<Data | null> {
  try {
    const response = await fetch(`https://api.disneyapi.dev/character/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching character data:', error);
    return null;
  }
}

async function handleAddToList(
  key: string,
  characterId: number,
): Promise<void> {
  try {
    const charData = await characterDataById(characterId);
    if (charData) {
      const list = getFromLocalStorage(key);
      list.push(charData);
      saveToLocalStorage(key, list);
    }
  } catch (error) {
    console.error('Error adding to list:', error);
  }
}

const $addDislike = document.querySelector('.addDislike');
const $addFavorite = document.querySelector('.addFavorite');

// Event listeners, this click will then move data to local storage
if ($addDislike) {
  $addDislike.addEventListener('click', () => {
    const characterId = Number($addDislike.getAttribute('data-id')); // Set ID during rendering
    handleAddToList('dislikeList', characterId);
  });
}

if ($addFavorite) {
  $addFavorite.addEventListener('click', () => {
    const characterId = Number($addFavorite.getAttribute('data-id')); // Set ID during rendering
    handleAddToList('favoriteList', characterId);
  });
}
