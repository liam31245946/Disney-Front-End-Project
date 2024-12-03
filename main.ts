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
    console.log(data);

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

function showCharacterDetail(charData: Data): void {
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
  $characterFilm.textContent = charData.films.join(' , ');
  $characterVideogames.textContent = charData.videoGames.join(' ');
  $characterInfo.innerHTML = `<a href="${charData.sourceUrl}">${charData.sourceUrl}</a>`;

  // main page swapping
  const $mainPage = document.querySelector(
    '[data-view="main-page"]',
  ) as HTMLElement;
  const $characterDetail = document.querySelector(
    '[data-view="character-page"]',
  ) as HTMLElement;

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

// set how data going into  and out of local storage
function saveToLocalStorage(key: string, data: Data[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): Data[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// function to display character's data

function getCharData(): Data {
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

  return {
    _id: Date.now(), // Temporary unique ID for demonstration
    name: $characterPic.alt,
    imageUrl: $characterPic.src,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    films: $characterFilm.textContent
      ? $characterFilm.textContent.split(', ')
      : [],
    shortFilms: [],
    tvShows: [],
    videoGames: $characterVideogames.textContent
      ? $characterVideogames.textContent.split(' ')
      : [],
    allies: [],
    enemies: [],
    parkAttractions: [],
    sourceUrl: $characterInfo.querySelector('a')?.href || '',
    url: '',
  };
}

// eventlistern to listen for dislike and favorite button being click in character-page

const $addDislike = document.querySelector('.addDislike');
const $addFavorite = document.querySelector('.addFavorite');

if ($addDislike) {
  $addDislike.addEventListener('click', () => {
    const charData = getCharData();
    const dislikeList = getFromLocalStorage('dislikeList');
    dislikeList.push(charData);
    saveToLocalStorage('dislikeList', dislikeList);
  });
}

if ($addFavorite) {
  $addFavorite.addEventListener('click', () => {
    const charData = getCharData();
    const favoriteList = getFromLocalStorage('favoriteList');
    favoriteList.push(charData);
    saveToLocalStorage('favoriteList', favoriteList);
  });
}
